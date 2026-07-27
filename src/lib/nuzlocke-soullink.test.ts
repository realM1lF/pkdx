/* SoulLink missed cascade + 'lost' status (nuzlocke-store).
 * Solo runs only — no realtime/supabase interaction (vitest.setup stubs
 * WebSocket; solo mode never touches the network). */
import { describe, expect, it } from 'vitest';
import {
  DEFAULT_RULES,
  createRun,
  getRunState,
  kpisOf,
  logEncounter,
  updateEncounter,
} from './nuzlocke-store';
import type { NuzRules, RunState } from './nuzlocke-store';

async function makeSoulRun(rules?: Partial<NuzRules>): Promise<RunState> {
  const { state } = await createRun({
    name: 'Cascade Test',
    region: 'kanto',
    game: 'firered',
    players: [
      { name: 'ANN', color: '#FFD60A' },
      { name: 'BOB', color: '#45C8FF' },
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

function log(s: RunState, playerIdx: number, route: string, pokemonId: number, status: 'caught' | 'missed' | 'dead' = 'caught') {
  const p = s.players[playerIdx];
  const res = logEncounter(s.run.id, {
    playerId: p.id,
    routeKey: route,
    pokemonId,
    nickname: null,
    level: 5,
    status,
  });
  expect(res.ok).toBe(true);
  return res.encounter!;
}

describe('SoulLink missed cascade', () => {
  it('(i) marking missed sets the living link partner to lost + boxes it', async () => {
    let s = await makeSoulRun();
    log(s, 0, 'route-1', 16); // Ann: Pidgey
    log(s, 1, 'route-1', 19); // Bob: Rattata — soul link formed
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
    log(s, 0, 'route-1', 16);
    log(s, 1, 'route-1', 19);

    updateEncounter(s.run.id, encAt(s, 0, 'route-1')!.id, { status: 'missed' });
    s = getRunState(s.run.id)!;

    const partner = encAt(s, 1, 'route-1')!;
    expect(partner.status).toBe('caught');
    expect(partner.in_party).toBe(false);
  });

  it('(iii) partner has not played the route → later catch logs as lost (route lock)', async () => {
    let s = await makeSoulRun();
    log(s, 0, 'route-2', 13, 'missed'); // Ann misses route 2, Bob has no row yet

    log(s, 1, 'route-2', 10); // Bob catches Caterpie on the locked route
    s = getRunState(s.run.id)!;

    const bob = encAt(s, 1, 'route-2')!;
    expect(bob.status).toBe('lost');
    expect(bob.in_party).toBe(false);
  });

  it('(iii b) route lock does not apply when cascade rule is off', async () => {
    let s = await makeSoulRun({ soulLinkCascade: false });
    log(s, 0, 'route-2', 13, 'missed');
    log(s, 1, 'route-2', 10);
    s = getRunState(s.run.id)!;
    expect(encAt(s, 1, 'route-2')!.status).toBe('caught');
  });

  it('(iv) no double cascade: already lost/missed partners never re-trigger', async () => {
    let s = await makeSoulRun();
    log(s, 0, 'route-1', 16);
    log(s, 1, 'route-1', 19);
    // Ann misses → Bob becomes lost
    updateEncounter(s.run.id, encAt(s, 0, 'route-1')!.id, { status: 'missed' });
    s = getRunState(s.run.id)!;
    expect(encAt(s, 1, 'route-1')!.status).toBe('lost');

    // realtime race shape: Bob ALSO marks his (already lost) row missed —
    // Ann's row is already missed, so nothing may change / loop
    updateEncounter(s.run.id, encAt(s, 1, 'route-1')!.id, { status: 'missed' });
    s = getRunState(s.run.id)!;
    expect(encAt(s, 0, 'route-1')!.status).toBe('missed');
    expect(encAt(s, 1, 'route-1')!.status).toBe('missed');

    // death cascade must not fire from a lost partner either
    let s2 = await makeSoulRun();
    log(s2, 0, 'route-1', 16);
    log(s2, 1, 'route-1', 19);
    updateEncounter(s2.run.id, encAt(s2, 0, 'route-1')!.id, { status: 'missed' }); // Bob → lost
    s2 = getRunState(s2.run.id)!;
    updateEncounter(s2.run.id, encAt(s2, 0, 'route-1')!.id, { status: 'dead' }); // Ann dies later
    s2 = getRunState(s2.run.id)!;
    expect(encAt(s2, 1, 'route-1')!.status).toBe('lost'); // unchanged, not dead
  });

  it('(v) KPIs: lost counts as neither dead nor missed', async () => {
    let s = await makeSoulRun();
    log(s, 0, 'route-1', 16);
    log(s, 1, 'route-1', 19);
    log(s, 0, 'route-2', 13, 'missed');
    updateEncounter(s.run.id, encAt(s, 0, 'route-1')!.id, { status: 'missed' }); // Bob → lost
    s = getRunState(s.run.id)!;

    const k = kpisOf(s);
    expect(s.encounters.filter((e) => e.status === 'lost')).toHaveLength(1);
    expect(k.caught).toBe(0);
    expect(k.dead).toBe(0);
    expect(k.missed).toBe(2); // two missed rows; the lost row is excluded
  });
});
