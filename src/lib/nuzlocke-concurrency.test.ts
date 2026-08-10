import { describe, expect, it } from 'vitest';
import {
  findEvoLineDupeViolations,
  isCurrentOp,
  isStatusDowngrade,
  livingCascadeTargets,
  mergeRemoteWithOutbox,
  nextOpGen,
  pickDupeLoser,
  type Outbox,
} from './nuzlocke-concurrency';
import type { NuzEncounterRow } from './supabase';

function enc(overrides: Partial<NuzEncounterRow> & Pick<NuzEncounterRow, 'id'>): NuzEncounterRow {
  return {
    run_id: 'run-1',
    player_id: 'p1',
    route_key: 'route-1',
    pokemon_id: 1,
    nickname: null,
    level: 5,
    status: 'caught',
    note: null,
    created_at: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('mergeRemoteWithOutbox', () => {
  it('keeps a pending insert absent on the server', () => {
    const local = enc({ id: 'e1' });
    const outbox: Outbox = new Map([['e1', { kind: 'insert', snapshot: local, gen: 1 }]]);
    const res = mergeRemoteWithOutbox({ remote: [], localEncounters: [local], outbox });
    expect(res.encounters).toEqual([local]);
    expect(res.keptKeys).toEqual(['e1']);
  });

  it('uses the server row untouched when there is no pending op', () => {
    const serverRow = enc({ id: 'e1', level: 10 });
    const res = mergeRemoteWithOutbox({ remote: [serverRow], localEncounters: [], outbox: new Map() });
    expect(res.encounters).toEqual([serverRow]);
    expect(res.keptKeys).toEqual([]);
  });

  it('overrides a stale server row with the pending patch snapshot', () => {
    const serverRow = enc({ id: 'e1', status: 'caught' });
    const pendingPatch = enc({ id: 'e1', status: 'dead' });
    const outbox: Outbox = new Map([['e1', { kind: 'patch', snapshot: pendingPatch, gen: 2 }]]);
    const res = mergeRemoteWithOutbox({ remote: [serverRow], localEncounters: [pendingPatch], outbox });
    expect(res.encounters).toEqual([pendingPatch]);
    expect(res.keptKeys).toEqual(['e1']);
  });

  it('drops a row that has a pending delete, even though the server still has it', () => {
    const serverRow = enc({ id: 'e1' });
    const outbox: Outbox = new Map([['e1', { kind: 'delete', snapshot: serverRow, gen: 1 }]]);
    const res = mergeRemoteWithOutbox({ remote: [serverRow], localEncounters: [], outbox });
    expect(res.encounters).toEqual([]);
    expect(res.keptKeys).toEqual(['e1']);
  });

  it('leaves unrelated server rows and other pending rows alone side by side', () => {
    const untouched = enc({ id: 'e-untouched', level: 20 });
    const pendingInsert = enc({ id: 'e-new' });
    const outbox: Outbox = new Map([['e-new', { kind: 'insert', snapshot: pendingInsert, gen: 1 }]]);
    const res = mergeRemoteWithOutbox({ remote: [untouched], localEncounters: [pendingInsert], outbox });
    expect(res.encounters).toHaveLength(2);
    expect(res.encounters).toEqual(expect.arrayContaining([untouched, pendingInsert]));
  });

  it('falls back to the local mirror when an outbox entry has no snapshot to lean on', () => {
    /* defensive path — real callers always attach a snapshot, but the merge
     * should not crash or drop the row if one were ever missing */
    const local = enc({ id: 'e1', level: 7 });
    const outbox: Outbox = new Map([
      ['e1', { kind: 'insert', snapshot: undefined as unknown as NuzEncounterRow, gen: 1 }],
    ]);
    const res = mergeRemoteWithOutbox({ remote: [], localEncounters: [local], outbox });
    expect(res.encounters).toEqual([local]);
  });
});

describe('nextOpGen / isCurrentOp', () => {
  it('increments per syncKey independently', () => {
    const map = new Map<string, number>();
    expect(nextOpGen(map, 'a')).toBe(1);
    expect(nextOpGen(map, 'b')).toBe(1);
    expect(nextOpGen(map, 'a')).toBe(2);
  });

  it('flags an earlier gen as stale once a newer one is enqueued', () => {
    const map = new Map<string, number>();
    const gen1 = nextOpGen(map, 'e1');
    expect(isCurrentOp(map, 'e1', gen1)).toBe(true);

    const gen2 = nextOpGen(map, 'e1'); // e.g. rapid dead → restore
    expect(isCurrentOp(map, 'e1', gen1)).toBe(false);
    expect(isCurrentOp(map, 'e1', gen2)).toBe(true);
  });

  it('an unknown syncKey is never current for a real gen', () => {
    const map = new Map<string, number>();
    expect(isCurrentOp(map, 'never-enqueued', 1)).toBe(false);
  });
});

/* Squirtle line, used to simulate two near-simultaneous catches of different
 * stages of the same evolution family (Phase 1.3 TOCTOU interim). */
const SQUIRTLE = 7;
const WARTORTLE = 8;
const BLASTOISE = 9;
const CHARMANDER = 4;
const CHARMELEON = 5;

const SQUIRTLE_LINE = [SQUIRTLE, WARTORTLE, BLASTOISE];
const CHARMANDER_LINE = [CHARMANDER, CHARMELEON, 6];

function familyOf(map: Record<number, number[]>): (id: number) => number[] | undefined {
  return (id: number) => map[id];
}

describe('pickDupeLoser', () => {
  it('the later created_at loses (Dupes Clause is first-come)', () => {
    const early = enc({ id: 'e-early', created_at: '2026-01-01T00:00:00.000Z' });
    const late = enc({ id: 'e-late', created_at: '2026-01-01T00:00:05.000Z' });
    expect(pickDupeLoser(early, late)).toBe(late);
    expect(pickDupeLoser(late, early)).toBe(late);
  });

  it('breaks an exact timestamp tie by the larger id', () => {
    const a = enc({ id: 'aaa', created_at: '2026-01-01T00:00:00.000Z' });
    const b = enc({ id: 'bbb', created_at: '2026-01-01T00:00:00.000Z' });
    expect(pickDupeLoser(a, b)).toBe(b);
    expect(pickDupeLoser(b, a)).toBe(b);
  });
});

describe('findEvoLineDupeViolations', () => {
  it('two near-simultaneous catches of different stages, same line → the later one is the loser', () => {
    const ownFamily = familyOf({
      [SQUIRTLE]: SQUIRTLE_LINE,
      [WARTORTLE]: SQUIRTLE_LINE,
      [BLASTOISE]: SQUIRTLE_LINE,
    });
    const first = enc({ id: 'e1', player_id: 'ann', pokemon_id: SQUIRTLE, created_at: '2026-01-01T00:00:00.000Z' });
    const second = enc({ id: 'e2', player_id: 'bob', pokemon_id: WARTORTLE, created_at: '2026-01-01T00:00:03.000Z' });
    const losers = findEvoLineDupeViolations([first, second], ownFamily);
    expect(losers).toEqual([second]);
  });

  it('caught form (post-evolution) is matched via caught_pokemon_id, not just pokemon_id', () => {
    const ownFamily = familyOf({ [SQUIRTLE]: SQUIRTLE_LINE, [WARTORTLE]: SQUIRTLE_LINE, [BLASTOISE]: SQUIRTLE_LINE });
    const evolved = enc({
      id: 'e1',
      pokemon_id: WARTORTLE,
      caught_pokemon_id: SQUIRTLE,
      created_at: '2026-01-01T00:00:00.000Z',
    });
    const rival = enc({ id: 'e2', pokemon_id: BLASTOISE, created_at: '2026-01-01T00:00:05.000Z' });
    expect(findEvoLineDupeViolations([evolved, rival], ownFamily)).toEqual([rival]);
  });

  it('no violation across unrelated families', () => {
    const both = familyOf({ [SQUIRTLE]: SQUIRTLE_LINE, [CHARMANDER]: CHARMANDER_LINE });
    const a = enc({ id: 'e1', pokemon_id: SQUIRTLE, created_at: '2026-01-01T00:00:00.000Z' });
    const b = enc({ id: 'e2', pokemon_id: CHARMANDER, created_at: '2026-01-01T00:00:01.000Z' });
    expect(findEvoLineDupeViolations([a, b], both)).toEqual([]);
  });

  it('shiny catches are clause-free and never flagged', () => {
    const ownFamily = familyOf({ [SQUIRTLE]: SQUIRTLE_LINE, [WARTORTLE]: SQUIRTLE_LINE });
    const a = enc({ id: 'e1', pokemon_id: SQUIRTLE, created_at: '2026-01-01T00:00:00.000Z' });
    const b = enc({ id: 'e2', pokemon_id: WARTORTLE, created_at: '2026-01-01T00:00:01.000Z', is_shiny: true });
    expect(findEvoLineDupeViolations([a, b], ownFamily)).toEqual([]);
  });

  it('dead/missed/duped rows free the line and are never picked as rivals', () => {
    const ownFamily = familyOf({ [SQUIRTLE]: SQUIRTLE_LINE, [WARTORTLE]: SQUIRTLE_LINE });
    const dead = enc({ id: 'e1', pokemon_id: SQUIRTLE, status: 'dead', created_at: '2026-01-01T00:00:00.000Z' });
    const living = enc({ id: 'e2', pokemon_id: WARTORTLE, created_at: '2026-01-01T00:00:01.000Z' });
    expect(findEvoLineDupeViolations([dead, living], ownFamily)).toEqual([]);
  });

  it('N-way collision: only the earliest survives, everyone else is a loser', () => {
    const ownFamily = familyOf({ [SQUIRTLE]: SQUIRTLE_LINE, [WARTORTLE]: SQUIRTLE_LINE, [BLASTOISE]: SQUIRTLE_LINE });
    const first = enc({ id: 'e1', pokemon_id: SQUIRTLE, created_at: '2026-01-01T00:00:00.000Z' });
    const second = enc({ id: 'e2', pokemon_id: WARTORTLE, created_at: '2026-01-01T00:00:01.000Z' });
    const third = enc({ id: 'e3', pokemon_id: BLASTOISE, created_at: '2026-01-01T00:00:02.000Z' });
    const losers = findEvoLineDupeViolations([first, second, third], ownFamily);
    expect(losers.map((l) => l.id).sort()).toEqual(['e2', 'e3']);
  });

  it('exact-species dupe is caught even with no cached family (singleton fallback)', () => {
    const noCache = () => undefined;
    const a = enc({ id: 'e1', pokemon_id: SQUIRTLE, created_at: '2026-01-01T00:00:00.000Z' });
    const b = enc({ id: 'e2', pokemon_id: SQUIRTLE, created_at: '2026-01-01T00:00:01.000Z' });
    expect(findEvoLineDupeViolations([a, b], noCache)).toEqual([b]);
  });

  it('uncached cross-stage species never falsely collide (degrade to singleton, not a shared key)', () => {
    const noCache = () => undefined;
    const a = enc({ id: 'e1', pokemon_id: SQUIRTLE, created_at: '2026-01-01T00:00:00.000Z' });
    const b = enc({ id: 'e2', pokemon_id: WARTORTLE, created_at: '2026-01-01T00:00:01.000Z' });
    expect(findEvoLineDupeViolations([a, b], noCache)).toEqual([]);
  });

  it('asymmetric cache (full family on one stage, singleton poison on another) still collides', () => {
    /* Menki fetch succeeded → [56,57,979]; Rasaff later failed open → cached [57].
     * Math.min keys used to diverge (56 vs 57); union-by-shared-member must heal. */
    const MANKEY = 56;
    const PRIMEAPE = 57;
    const ANNIHILAPE = 979;
    const ownFamily = familyOf({
      [MANKEY]: [MANKEY, PRIMEAPE, ANNIHILAPE],
      [PRIMEAPE]: [PRIMEAPE],
    });
    const first = enc({
      id: 'e-menki',
      player_id: 'ann',
      pokemon_id: MANKEY,
      created_at: '2026-01-01T00:00:00.000Z',
    });
    const second = enc({
      id: 'e-rasaff',
      player_id: 'bob',
      pokemon_id: PRIMEAPE,
      created_at: '2026-01-01T00:00:03.000Z',
    });
    expect(findEvoLineDupeViolations([first, second], ownFamily)).toEqual([second]);
  });

  it('overlapping partial family caches (7–8 and 8–9) collide via shared member', () => {
    const ownFamily = familyOf({
      [SQUIRTLE]: [SQUIRTLE, WARTORTLE],
      [BLASTOISE]: [WARTORTLE, BLASTOISE],
    });
    const first = enc({ id: 'e1', pokemon_id: SQUIRTLE, created_at: '2026-01-01T00:00:00.000Z' });
    const second = enc({ id: 'e2', pokemon_id: BLASTOISE, created_at: '2026-01-01T00:00:01.000Z' });
    expect(findEvoLineDupeViolations([first, second], ownFamily)).toEqual([second]);
  });
});

describe('isStatusDowngrade', () => {
  it('flags dead → caught as a downgrade', () => {
    expect(isStatusDowngrade('dead', 'caught')).toBe(true);
  });

  it('flags lost → caught as a downgrade', () => {
    expect(isStatusDowngrade('lost', 'caught')).toBe(true);
  });

  it('does not flag caught → dead (a real, more final transition)', () => {
    expect(isStatusDowngrade('caught', 'dead')).toBe(false);
  });

  it('treats missed/duped as equally final (no downgrade either direction)', () => {
    expect(isStatusDowngrade('missed', 'duped')).toBe(false);
    expect(isStatusDowngrade('duped', 'missed')).toBe(false);
  });

  it('same status is never a downgrade', () => {
    expect(isStatusDowngrade('dead', 'dead')).toBe(false);
  });
});

describe('livingCascadeTargets', () => {
  it('returns every other player\'s living catch on the same route', () => {
    const trigger = enc({ id: 'ann', player_id: 'ann', route_key: 'route-1' });
    const bob = enc({ id: 'bob', player_id: 'bob', route_key: 'route-1' });
    const cam = enc({ id: 'cam', player_id: 'cam', route_key: 'route-1' });
    expect(livingCascadeTargets([trigger, bob, cam], trigger)).toEqual(expect.arrayContaining([bob, cam]));
    expect(livingCascadeTargets([trigger, bob, cam], trigger)).toHaveLength(2);
  });

  it('excludes the trigger itself even if somehow present twice', () => {
    const trigger = enc({ id: 'ann', player_id: 'ann', route_key: 'route-1' });
    expect(livingCascadeTargets([trigger], trigger)).toEqual([]);
  });

  it('excludes a different route', () => {
    const trigger = enc({ id: 'ann', player_id: 'ann', route_key: 'route-1' });
    const elsewhere = enc({ id: 'bob', player_id: 'bob', route_key: 'route-2' });
    expect(livingCascadeTargets([trigger, elsewhere], trigger)).toEqual([]);
  });

  it('excludes the same player (no self-cascade)', () => {
    const trigger = enc({ id: 'ann-1', player_id: 'ann', route_key: 'route-1' });
    const sameSlot = enc({ id: 'ann-2', player_id: 'ann', route_key: 'route-1' });
    expect(livingCascadeTargets([trigger, sameSlot], trigger)).toEqual([]);
  });

  it('excludes partners that already fell (dead/lost/missed/duped) — idempotent re-cascade', () => {
    const trigger = enc({ id: 'ann', player_id: 'ann', route_key: 'route-1' });
    const alreadyDead = enc({ id: 'bob', player_id: 'bob', route_key: 'route-1', status: 'dead' });
    const alreadyLost = enc({ id: 'cam', player_id: 'cam', route_key: 'route-1', status: 'lost' });
    const stillLiving = enc({ id: 'dan', player_id: 'dan', route_key: 'route-1', status: 'caught' });
    expect(livingCascadeTargets([trigger, alreadyDead, alreadyLost, stillLiving], trigger)).toEqual([stillLiving]);
  });
});
