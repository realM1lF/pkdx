/* Dupes sub-options: dupesDead (graveyard still claims) + dupesEncounter (missed/duped claim). */
import { beforeEach, describe, expect, it } from 'vitest';
import { clearEvolutionFamilyCache, primeEvolutionFamilyCache } from './nuzlocke-evolution';
import { findEvoLineDupeViolations } from './nuzlocke-concurrency';
import {
  dupesClaimingStatuses,
  normalizeRules,
  validateLogDraft,
} from './nuzlocke-rules';
import { DEFAULT_RULES } from './nuzlocke-store';
import type { RunState } from './nuzlocke-store';
import type { NuzEncounterRow, NuzEncounterStatus } from './supabase';

const MANKEY = 56;
const PRIMEAPE = 57;
const ANNIHILAPE = 979;
const LINE = [MANKEY, PRIMEAPE, ANNIHILAPE];

beforeEach(() => {
  clearEvolutionFamilyCache();
  primeEvolutionFamilyCache(LINE);
});

function enc(
  partial: Partial<NuzEncounterRow> & Pick<NuzEncounterRow, 'id' | 'status' | 'pokemon_id'>,
): NuzEncounterRow {
  return {
    run_id: 'r',
    player_id: 'p1',
    route_key: 'route-22',
    nickname: null,
    level: 5,
    note: null,
    created_at: '2026-01-01T00:00:00.000Z',
    caught_pokemon_id: partial.pokemon_id,
    ...partial,
  };
}

function stateWith(
  row: NuzEncounterRow,
  rules: Partial<typeof DEFAULT_RULES> = {},
): RunState {
  return {
    run: { rules: normalizeRules({ ...DEFAULT_RULES, nicknames: false, dupes: true, ...rules }) },
    mode: 'multi',
    players: [],
    encounters: [row],
  } as unknown as RunState;
}

async function tryRasaff(state: RunState) {
  return validateLogDraft(state, {
    playerId: 'p2',
    routeKey: 'viridian-forest',
    pokemonId: PRIMEAPE,
    nickname: 'Rasaff',
    level: 5,
    status: 'caught',
  });
}

describe('normalizeRules — dupes sub-options', () => {
  it('defaults both sub-options to false (living-only Dupes)', () => {
    const r = normalizeRules({ dupes: true });
    expect(r.dupesDead).toBe(false);
    expect(r.dupesEncounter).toBe(false);
  });

  it('dupesClaimingStatuses: living only by default; expands with flags', () => {
    expect(dupesClaimingStatuses(normalizeRules({ dupes: true }))).toEqual(['caught']);
    expect(dupesClaimingStatuses(normalizeRules({ dupes: true, dupesDead: true }))).toEqual(
      expect.arrayContaining(['caught', 'dead', 'lost']),
    );
    expect(dupesClaimingStatuses(normalizeRules({ dupes: true, dupesEncounter: true }))).toEqual(
      expect.arrayContaining(['caught', 'missed', 'duped']),
    );
    expect(dupesClaimingStatuses(normalizeRules({ dupes: false, dupesDead: true }))).toEqual([]);
  });
});

describe('validateLogDraft — dupesDead / dupesEncounter', () => {
  it('dead Menki does NOT block Rasaff when dupesDead is off (legacy)', async () => {
    const err = await tryRasaff(stateWith(enc({ id: 'e1', pokemon_id: MANKEY, status: 'dead' })));
    expect(err).toBeNull();
  });

  it('dead Menki blocks Rasaff when dupesDead is on', async () => {
    const err = await tryRasaff(
      stateWith(enc({ id: 'e1', pokemon_id: MANKEY, status: 'dead' }), { dupesDead: true }),
    );
    expect(err).toBe('speciesDupe');
  });

  it('link-lost Menki blocks Rasaff when dupesDead is on', async () => {
    const err = await tryRasaff(
      stateWith(enc({ id: 'e1', pokemon_id: MANKEY, status: 'lost' }), { dupesDead: true }),
    );
    expect(err).toBe('speciesDupe');
  });

  it('missed Menki does NOT block when dupesEncounter is off', async () => {
    const err = await tryRasaff(stateWith(enc({ id: 'e1', pokemon_id: MANKEY, status: 'missed' })));
    expect(err).toBeNull();
  });

  it('missed Menki blocks Rasaff when dupesEncounter is on', async () => {
    const err = await tryRasaff(
      stateWith(enc({ id: 'e1', pokemon_id: MANKEY, status: 'missed' }), { dupesEncounter: true }),
    );
    expect(err).toBe('speciesDupe');
  });

  it('duped Menki blocks Rasaff when dupesEncounter is on', async () => {
    const err = await tryRasaff(
      stateWith(enc({ id: 'e1', pokemon_id: MANKEY, status: 'duped' }), { dupesEncounter: true }),
    );
    expect(err).toBe('speciesDupe');
  });

  it('both flags: missed or dead either way blocks', async () => {
    const rules = { dupesDead: true, dupesEncounter: true };
    expect(
      await tryRasaff(stateWith(enc({ id: 'e1', pokemon_id: MANKEY, status: 'missed' }), rules)),
    ).toBe('speciesDupe');
    expect(
      await tryRasaff(stateWith(enc({ id: 'e2', pokemon_id: MANKEY, status: 'dead' }), rules)),
    ).toBe('speciesDupe');
  });
});

describe('findEvoLineDupeViolations — claiming statuses', () => {
  it('with dead claiming, later living catch of the line is the loser', () => {
    const familyOf = (id: number) => (LINE.includes(id) ? LINE : undefined);
    const dead = enc({
      id: 'e-dead',
      pokemon_id: MANKEY,
      status: 'dead',
      created_at: '2026-01-01T00:00:00.000Z',
    });
    const later = enc({
      id: 'e-live',
      player_id: 'p2',
      route_key: 'viridian-forest',
      pokemon_id: PRIMEAPE,
      status: 'caught',
      created_at: '2026-01-01T00:00:05.000Z',
    });
    const claiming = new Set<NuzEncounterStatus>(['caught', 'dead', 'lost']);
    const losers = findEvoLineDupeViolations([dead, later], familyOf, claiming);
    expect(losers).toEqual([later]);
  });

  it('default claiming (caught only) does not demote against a dead prior', () => {
    const familyOf = (id: number) => (LINE.includes(id) ? LINE : undefined);
    const dead = enc({ id: 'e-dead', pokemon_id: MANKEY, status: 'dead' });
    const later = enc({
      id: 'e-live',
      pokemon_id: PRIMEAPE,
      status: 'caught',
      created_at: '2026-01-01T00:00:05.000Z',
    });
    expect(findEvoLineDupeViolations([dead, later], familyOf)).toEqual([]);
  });
});
