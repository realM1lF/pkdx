/* SoulLink missed cascade + 'lost' status + N-player death cascade
 * (nuzlocke-store). Solo runs only — no realtime/supabase interaction
 * (vitest.setup stubs WebSocket; solo mode never touches the network). */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  DEFAULT_RULES,
  canRestoreEncounter,
  createRun,
  getRunState,
  kpisOf,
  linkPartnersOf,
  logEncounter,
  partyOf,
  setEncounterParty,
  swapParty,
  updateEncounter,
} from './nuzlocke-store';
import type { NuzRules, RunState } from './nuzlocke-store';
import { clearEvolutionFamilyCache, primeEvolutionFamilyCache } from './nuzlocke-evolution';

vi.mock('./auth', () => ({
  getAuthUser: () => ({ id: 'test-user' }),
  isAuthReady: () => true,
  useAuth: () => ({ ready: true, user: { id: 'test-user' }, profile: null }),
  ensureRunIdentity: async () => undefined,
  onAuthChange: () => () => undefined,
}));

/* Dupes now resolve evo families async — seed singleton families so these
 * cascade tests stay offline and species-independent. */
beforeEach(() => {
  clearEvolutionFamilyCache();
  for (const id of [1, 4, 7, 10, 13, 16, 19, 25, 35, 39]) primeEvolutionFamilyCache([id]);
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

describe('SoulLink box-cascade (A1)', () => {
  it('boxing a living catch also boxes every other living partner on the route', async () => {
    let s = await makeSoulRun({}, [{ name: 'CAM', color: '#FF7A45' }]);
    await log(s, 0, 'route-1', 1);
    await log(s, 1, 'route-1', 4);
    await log(s, 2, 'route-1', 7);
    s = getRunState(s.run.id)!;
    expect(encAt(s, 1, 'route-1')!.in_party).toBe(true);
    expect(encAt(s, 2, 'route-1')!.in_party).toBe(true);

    const res = setEncounterParty(s.run.id, encAt(s, 0, 'route-1')!.id, false);
    expect(res.ok).toBe(true);
    s = getRunState(s.run.id)!;
    expect(encAt(s, 0, 'route-1')!.in_party).toBe(false);
    expect(encAt(s, 1, 'route-1')!.in_party).toBe(false);
    expect(encAt(s, 2, 'route-1')!.in_party).toBe(false);
    /* still caught — only boxed, not killed/lost (independent of soulLinkCascade) */
    expect(encAt(s, 1, 'route-1')!.status).toBe('caught');
    expect(encAt(s, 2, 'route-1')!.status).toBe('caught');
  });

  it('box-link fires even with the death cascade rule off', async () => {
    let s = await makeSoulRun({ soulLinkCascade: false });
    await log(s, 0, 'route-1', 16);
    await log(s, 1, 'route-1', 19);
    s = getRunState(s.run.id)!;

    setEncounterParty(s.run.id, encAt(s, 0, 'route-1')!.id, false);
    s = getRunState(s.run.id)!;
    expect(encAt(s, 1, 'route-1')!.in_party).toBe(false);
    expect(encAt(s, 1, 'route-1')!.status).toBe('caught');
  });

  it('unboxing does NOT pull a boxed partner back into the party', async () => {
    let s = await makeSoulRun();
    await log(s, 0, 'route-1', 16);
    await log(s, 1, 'route-1', 19);
    s = getRunState(s.run.id)!;

    setEncounterParty(s.run.id, encAt(s, 0, 'route-1')!.id, false);
    s = getRunState(s.run.id)!;
    expect(encAt(s, 1, 'route-1')!.in_party).toBe(false);

    setEncounterParty(s.run.id, encAt(s, 0, 'route-1')!.id, true);
    s = getRunState(s.run.id)!;
    expect(encAt(s, 0, 'route-1')!.in_party).toBe(true);
    /* partner stays boxed — no forced party move */
    expect(encAt(s, 1, 'route-1')!.in_party).toBe(false);
  });

  it('a boxed-in-party swap also box-cascades the outgoing mon\'s partner', async () => {
    let s = await makeSoulRun();
    await log(s, 0, 'route-1', 16); // Ann: linked party member (route-1)
    await log(s, 1, 'route-1', 19); // Bob: linked partner (route-1)
    await log(s, 0, 'route-2', 13); // Ann: a boxed candidate, no link
    s = getRunState(s.run.id)!;
    setEncounterParty(s.run.id, encAt(s, 0, 'route-2')!.id, false);
    s = getRunState(s.run.id)!;
    const boxed = encAt(s, 0, 'route-2')!;
    const partySlot = encAt(s, 0, 'route-1')!;
    expect(partySlot.in_party).toBe(true);

    const res = swapParty(s.run.id, boxed.id, partySlot.id);
    expect(res.ok).toBe(true);
    s = getRunState(s.run.id)!;
    expect(encAt(s, 0, 'route-2')!.in_party).toBe(true);
    expect(encAt(s, 0, 'route-1')!.in_party).toBe(false);
    /* Bob's route-1 partner was box-linked to Ann's just-boxed route-1 mon */
    expect(encAt(s, 1, 'route-1')!.in_party).toBe(false);
    expect(encAt(s, 1, 'route-1')!.status).toBe('caught');
  });
});

describe('SoulLink restore undoes cascade', () => {
  it('restoring the death trigger revives cascaded partners to caught (still boxed)', async () => {
    let s = await makeSoulRun({}, [{ name: 'CAM', color: '#FF7A45' }]);
    await log(s, 0, 'route-1', 1);
    await log(s, 1, 'route-1', 4);
    await log(s, 2, 'route-1', 7);

    const ann = encAt(s, 0, 'route-1')!;
    updateEncounter(s.run.id, ann.id, { status: 'dead' });
    s = getRunState(s.run.id)!;
    expect(encAt(s, 1, 'route-1')!.status).toBe('dead');
    expect(encAt(s, 2, 'route-1')!.status).toBe('dead');

    const res = updateEncounter(s.run.id, ann.id, { status: 'caught' });
    expect(res.ok).toBe(true);
    expect(res.cascadePartners).toHaveLength(2);
    s = getRunState(s.run.id)!;
    expect(encAt(s, 0, 'route-1')!.status).toBe('caught');
    expect(encAt(s, 1, 'route-1')!.status).toBe('caught');
    expect(encAt(s, 2, 'route-1')!.status).toBe('caught');
    expect(encAt(s, 1, 'route-1')!.in_party).toBe(false);
    expect(encAt(s, 2, 'route-1')!.in_party).toBe(false);
  });

  it('restoring a missed trigger revives lost partners to caught', async () => {
    let s = await makeSoulRun();
    await log(s, 0, 'route-1', 16);
    await log(s, 1, 'route-1', 19);
    updateEncounter(s.run.id, encAt(s, 0, 'route-1')!.id, { status: 'missed' });
    s = getRunState(s.run.id)!;
    expect(encAt(s, 1, 'route-1')!.status).toBe('lost');

    updateEncounter(s.run.id, encAt(s, 0, 'route-1')!.id, { status: 'caught' });
    s = getRunState(s.run.id)!;
    expect(encAt(s, 0, 'route-1')!.status).toBe('caught');
    expect(encAt(s, 1, 'route-1')!.status).toBe('caught');
    expect(encAt(s, 1, 'route-1')!.in_party).toBe(false);
  });

  it('cascade off: restore does not change partner status (they stayed caught)', async () => {
    let s = await makeSoulRun({ soulLinkCascade: false });
    await log(s, 0, 'route-1', 16);
    await log(s, 1, 'route-1', 19);
    updateEncounter(s.run.id, encAt(s, 0, 'route-1')!.id, { status: 'dead' });
    s = getRunState(s.run.id)!;
    expect(encAt(s, 1, 'route-1')!.status).toBe('caught');
    expect(encAt(s, 1, 'route-1')!.in_party).toBe(false);

    updateEncounter(s.run.id, encAt(s, 0, 'route-1')!.id, { status: 'caught' });
    s = getRunState(s.run.id)!;
    expect(encAt(s, 1, 'route-1')!.status).toBe('caught');
    expect(encAt(s, 1, 'route-1')!.in_party).toBe(false);
  });

  it('canRestore is false for a miss-cascade victim (lost while a mate is missed)', async () => {
    let s = await makeSoulRun();
    await log(s, 0, 'route-1', 16);
    await log(s, 1, 'route-1', 19);
    updateEncounter(s.run.id, encAt(s, 0, 'route-1')!.id, { status: 'missed' });
    s = getRunState(s.run.id)!;
    const victim = encAt(s, 1, 'route-1')!;
    const trigger = encAt(s, 0, 'route-1')!;
    expect(victim.status).toBe('lost');
    expect(canRestoreEncounter(s, victim)).toBe(false);
    expect(canRestoreEncounter(s, trigger)).toBe(true);
  });
});

describe('party flags: null is legacy, not boxed', () => {
  it('in_party: null is treated like missing — partyOf uses the 6-recent rule', async () => {
    const { state } = await createRun({
      name: 'Null Party',
      region: 'kanto',
      game: 'firered',
      players: [{ name: 'ANN', color: '#FFD60A' }],
      rules: { ...DEFAULT_RULES, nicknames: false, soulLink: false },
      online: false,
    });
    for (let i = 0; i < 7; i++) {
      const logged = await logEncounter(state.run.id, {
        playerId: state.players[0].id,
        routeKey: `route-${i + 1}`,
        pokemonId: [16, 19, 10, 13, 25, 35, 39][i]!,
        nickname: 'Mon',
        level: 5,
        status: 'caught',
      });
      expect(logged.ok).toBe(true);
    }
    let s = getRunState(state.run.id)!;
    for (const e of s.encounters) {
      (e as { in_party: boolean | null }).in_party = null;
    }
    expect(partyOf(s, s.players[0].id)).toHaveLength(6);

    await logEncounter(s.run.id, {
      playerId: s.players[0].id,
      routeKey: 'route-8',
      pokemonId: 10,
      nickname: 'Mon',
      level: 5,
      status: 'caught',
    });
    s = getRunState(s.run.id)!;
    expect(s.encounters.every((e) => e.in_party === true || e.in_party === false)).toBe(true);
    expect(partyOf(s, s.players[0].id).length).toBeGreaterThan(0);
  });
});

describe('nickname edit respects nicknames rule', () => {
  it('cannot clear nickname on edit when the nicknames rule is on', async () => {
    const { state } = await createRun({
      name: 'Nick Rule',
      region: 'kanto',
      game: 'firered',
      players: [{ name: 'ANN', color: '#FFD60A' }],
      rules: { ...DEFAULT_RULES, nicknames: true, soulLink: false },
      online: false,
    });
    const res = await logEncounter(state.run.id, {
      playerId: state.players[0].id,
      routeKey: 'route-1',
      pokemonId: 1,
      nickname: 'Bulba',
      level: 5,
      status: 'caught',
    });
    expect(res.ok).toBe(true);
    const cleared = updateEncounter(state.run.id, res.encounter!.id, { nickname: null });
    expect(cleared.ok).toBe(false);
    expect(getRunState(state.run.id)!.encounters[0]!.nickname).toBe('Bulba');
  });

  it('empty nickname is allowed when the nicknames rule is off', async () => {
    const { state } = await createRun({
      name: 'Nick Off',
      region: 'kanto',
      game: 'firered',
      players: [{ name: 'ANN', color: '#FFD60A' }],
      rules: { ...DEFAULT_RULES, nicknames: false, soulLink: false },
      online: false,
    });
    const res = await logEncounter(state.run.id, {
      playerId: state.players[0].id,
      routeKey: 'route-1',
      pokemonId: 1,
      nickname: 'Bulba',
      level: 5,
      status: 'caught',
    });
    const cleared = updateEncounter(state.run.id, res.encounter!.id, { nickname: null });
    expect(cleared.ok).toBe(true);
    expect(getRunState(state.run.id)!.encounters[0]!.nickname).toBeNull();
  });
});

