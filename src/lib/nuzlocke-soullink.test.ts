/* SoulLink missed cascade + 'lost' status + N-player death cascade
 * (nuzlocke-store). Solo runs only — no realtime/supabase interaction
 * (vitest.setup stubs WebSocket; solo mode never touches the network). */
import { beforeEach, describe, expect, it } from 'vitest';
import {
  DEFAULT_RULES,
  createRun,
  getRunState,
  kpisOf,
  linkPartnersOf,
  logEncounter,
  updateEncounter,
} from './nuzlocke-store';
import type { NuzRules, RunState } from './nuzlocke-store';
import { clearEvolutionFamilyCache, primeEvolutionFamilyCache } from './nuzlocke-evolution';

/* Dupes now resolve evo families async — seed singleton families so these
 * cascade tests stay offline and species-independent. */
beforeEach(() => {
  clearEvolutionFamilyCache();
  for (const id of [1, 4, 7, 10, 13, 16, 19]) primeEvolutionFamilyCache([id]);
});

async function makeSoulRun(
  rules?: Partial<NuzRules>,
  extraPlayers: { name: string; color: string }[] = [],
): Promise<RunState> {
  const { state } = await createRun({
    name: 'Cascade Test',
    region: 'kanto',
    game: 'firered',
    players: [
      { name: 'ANN', color: '#FFD60A' },
      { name: 'BOB', color: '#45C8FF' },
      ...extraPlayers,
    ],
    rules: { ...DEFAULT_RULES, soulLink: true, soulLinkCascade: true, nicknames: false, ...rules },
    online: false,
  });
  return state;
}

function encAt(s: RunState, playerIdx: number, route: string) {
  const p = s.players[playerIdx];
  return s.encounters.find((e) => e.player_id === p.id && e.route_key === route);
}

async function log(s: RunState, playerIdx: number, route: string, pokemonId: number, status: 'caught' | 'missed' | 'dead' = 'caught') {
  const p = s.players[playerIdx];
  const res = await logEncounter(s.run.id, {
    playerId: p.id,
    routeKey: route,
    pokemonId,
    nickname: 'Mon',
    level: 5,
    status,
  });
  expect(res.ok).toBe(true);
  return res.encounter!;
}

describe('SoulLink missed cascade', () => {
  it('(i) marking missed sets the living link partner to lost + boxes it', async () => {
    let s = await makeSoulRun();
    await log(s, 0, 'route-1', 16); // Ann: Pidgey
    await log(s, 1, 'route-1', 19); // Bob: Rattata — soul link formed
    expect(encAt(s, 1, 'route-1')!.status).toBe('caught');
    expect(encAt(s, 1, 'route-1')!.in_party).toBe(true);

    updateEncounter(s.run.id, encAt(s, 0, 'route-1')!.id, { status: 'missed' });
    s = getRunState(s.run.id)!;

    const partner = encAt(s, 1, 'route-1')!;
    expect(partner.status).toBe('lost');
    expect(partner.in_party).toBe(false);
  });

  it('(ii) cascade rule off → partner is only auto-boxed, stays caught', async () => {
    let s = await makeSoulRun({ soulLinkCascade: false });
    await log(s, 0, 'route-1', 16);
    await log(s, 1, 'route-1', 19);

    updateEncounter(s.run.id, encAt(s, 0, 'route-1')!.id, { status: 'missed' });
    s = getRunState(s.run.id)!;

    const partner = encAt(s, 1, 'route-1')!;
    expect(partner.status).toBe('caught');
    expect(partner.in_party).toBe(false);
  });

  it('(iii) partner has not played the route → later catch logs as lost (route lock)', async () => {
    let s = await makeSoulRun();
    await log(s, 0, 'route-2', 13, 'missed'); // Ann misses route 2, Bob has no row yet

    await log(s, 1, 'route-2', 10); // Bob catches Caterpie on the locked route
    s = getRunState(s.run.id)!;

    const bob = encAt(s, 1, 'route-2')!;
    expect(bob.status).toBe('lost');
    expect(bob.in_party).toBe(false);
  });

  it('(iii b) route lock does not apply when cascade rule is off', async () => {
    let s = await makeSoulRun({ soulLinkCascade: false });
    await log(s, 0, 'route-2', 13, 'missed');
    await log(s, 1, 'route-2', 10);
    s = getRunState(s.run.id)!;
    expect(encAt(s, 1, 'route-2')!.status).toBe('caught');
  });

  it('(iv) no double cascade: already lost/missed partners never re-trigger', async () => {
    let s = await makeSoulRun();
    await log(s, 0, 'route-1', 16);
    await log(s, 1, 'route-1', 19);
    updateEncounter(s.run.id, encAt(s, 0, 'route-1')!.id, { status: 'missed' });
    s = getRunState(s.run.id)!;
    expect(encAt(s, 1, 'route-1')!.status).toBe('lost');

    updateEncounter(s.run.id, encAt(s, 1, 'route-1')!.id, { status: 'missed' });
    s = getRunState(s.run.id)!;
    expect(encAt(s, 0, 'route-1')!.status).toBe('missed');
    expect(encAt(s, 1, 'route-1')!.status).toBe('missed');

    let s2 = await makeSoulRun();
    await log(s2, 0, 'route-1', 16);
    await log(s2, 1, 'route-1', 19);
    updateEncounter(s2.run.id, encAt(s2, 0, 'route-1')!.id, { status: 'missed' });
    s2 = getRunState(s2.run.id)!;
    updateEncounter(s2.run.id, encAt(s2, 0, 'route-1')!.id, { status: 'dead' });
    s2 = getRunState(s2.run.id)!;
    expect(encAt(s2, 1, 'route-1')!.status).toBe('lost');
  });

  it('(v) KPIs: lost counts as neither dead nor missed', async () => {
    let s = await makeSoulRun();
    await log(s, 0, 'route-1', 16);
    await log(s, 1, 'route-1', 19);
    await log(s, 0, 'route-2', 13, 'missed');
    updateEncounter(s.run.id, encAt(s, 0, 'route-1')!.id, { status: 'missed' });
    s = getRunState(s.run.id)!;

    const k = kpisOf(s);
    expect(s.encounters.filter((e) => e.status === 'lost')).toHaveLength(1);
    expect(k.caught).toBe(0);
    expect(k.dead).toBe(0);
    expect(k.missed).toBe(2);
  });
});

describe('SoulLink KPI links', () => {
  it('counts one link group per route, not pairwise edges', async () => {
    const s = await makeSoulRun({}, [{ name: 'CAM', color: '#FF7A45' }]);
    await log(s, 0, 'route-1', 1);
    await log(s, 1, 'route-1', 4);
    expect(kpisOf(getRunState(s.run.id)!).links).toBe(1);
    await log(s, 2, 'route-1', 7);
    /* 3 Pokémon on one route → still 1 link (not 2 edges) */
    expect(kpisOf(getRunState(s.run.id)!).links).toBe(1);

    await log(s, 0, 'route-2', 16);
    await log(s, 1, 'route-2', 19);
    expect(kpisOf(getRunState(s.run.id)!).links).toBe(2);
  });
});

describe('SoulLink death cascade (N players)', () => {
  it('death auto-applies to every living mate on the route, no confirm/fromCascade needed', async () => {
    let s = await makeSoulRun({}, [{ name: 'CAM', color: '#FF7A45' }]);
    expect(s.players).toHaveLength(3);
    await log(s, 0, 'route-1', 1);
    await log(s, 1, 'route-1', 4);
    await log(s, 2, 'route-1', 7);

    const ann = encAt(s, 0, 'route-1')!;
    expect(linkPartnersOf(s, ann.id)).toHaveLength(2);

    /* a single updateEncounter call — no follow-up per-partner calls, no
     * fromCascade, no UI confirm — must leave the whole group dead */
    const res = updateEncounter(s.run.id, ann.id, { status: 'dead' });
    expect(res.ok).toBe(true);
    expect(res.cascadePartners).toHaveLength(2);
    const partnerIds = new Set(res.cascadePartners!.map((p) => p.id));
    expect(partnerIds.has(encAt(s, 1, 'route-1')!.id)).toBe(true);
    expect(partnerIds.has(encAt(s, 2, 'route-1')!.id)).toBe(true);
    /* the returned rows already reflect the auto-applied final state */
    expect(res.cascadePartners!.every((p) => p.status === 'dead' && p.in_party === false)).toBe(true);

    s = getRunState(s.run.id)!;
    expect(encAt(s, 0, 'route-1')!.status).toBe('dead');
    expect(encAt(s, 1, 'route-1')!.status).toBe('dead');
    expect(encAt(s, 2, 'route-1')!.status).toBe('dead');
    expect(encAt(s, 1, 'route-1')!.in_party).toBe(false);
    expect(encAt(s, 2, 'route-1')!.in_party).toBe(false);
  });

  it('cascade rule off boxes every living mate, none die', async () => {
    let s = await makeSoulRun({ soulLinkCascade: false }, [{ name: 'CAM', color: '#FF7A45' }]);
    await log(s, 0, 'route-1', 1);
    await log(s, 1, 'route-1', 4);
    await log(s, 2, 'route-1', 7);

    updateEncounter(s.run.id, encAt(s, 0, 'route-1')!.id, { status: 'dead' });
    s = getRunState(s.run.id)!;

    expect(encAt(s, 0, 'route-1')!.status).toBe('dead');
    expect(encAt(s, 1, 'route-1')!.status).toBe('caught');
    expect(encAt(s, 1, 'route-1')!.in_party).toBe(false);
    expect(encAt(s, 2, 'route-1')!.status).toBe('caught');
    expect(encAt(s, 2, 'route-1')!.in_party).toBe(false);
  });

  it('no double cascade: an already-dead partner never re-triggers a second pass', async () => {
    let s = await makeSoulRun();
    await log(s, 0, 'route-1', 16);
    await log(s, 1, 'route-1', 19);

    updateEncounter(s.run.id, encAt(s, 0, 'route-1')!.id, { status: 'dead' });
    s = getRunState(s.run.id)!;
    expect(encAt(s, 1, 'route-1')!.status).toBe('dead');

    /* re-marking the same (already dead) encounter dead again must not
     * find any new living partner to cascade to */
    const res = updateEncounter(s.run.id, encAt(s, 0, 'route-1')!.id, { status: 'dead' });
    expect(res.cascadePartners).toHaveLength(0);
  });
});
