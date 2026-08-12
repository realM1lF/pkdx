import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  buildViewTeamFromParty,
  canEditLinkedTeam,
  ensureLinkedTeams,
  findLinkedTeam,
  ownedPlayerId,
  purgeForeignLinkedTeams,
  syncLinkedTeamRoster,
} from './nuzlocke-linked-teams';
import {
  DEFAULT_RULES,
  createRun,
  getRunState,
  logEncounter,
  setEncounterParty,
} from './nuzlocke-store';
import { emptyTeam, loadTeams, saveTeam, type Team } from './teambuilder';

vi.mock('./auth', () => ({
  getAuthUser: () => ({ id: 'test-user' }),
  isAuthReady: () => true,
  useAuth: () => ({ ready: true, user: { id: 'test-user' }, profile: null }),
  ensureRunIdentity: async () => undefined,
  onAuthChange: () => () => undefined,
}));

vi.mock('./pokeapi', async () => {
  const actual = await vi.importActual<typeof import('./pokeapi')>('./pokeapi');
  return {
    ...actual,
    getPokemon: async (id: number | string) => ({
      id: Number(id),
      name: `species-${id}`,
      sprites: { front_default: null },
      types: [],
      stats: [],
      abilities: [],
      moves: [],
      height: 1,
      weight: 1,
      base_experience: 1,
      order: 1,
      is_default: true,
      location_area_encounters: '',
      forms: [],
      game_indices: [],
      held_items: [],
      past_types: [],
      species: { name: `species-${id}`, url: '' },
    }),
  };
});

function installMemoryLocalStorage(): void {
  const map = new Map<string, string>();
  const mem = {
    get length() {
      return map.size;
    },
    clear() {
      map.clear();
    },
    getItem(key: string) {
      return map.has(key) ? map.get(key)! : null;
    },
    setItem(key: string, value: string) {
      map.set(String(key), String(value));
    },
    removeItem(key: string) {
      map.delete(key);
    },
    key(i: number) {
      return [...map.keys()][i] ?? null;
    },
  };
  Object.defineProperty(globalThis, 'localStorage', { value: mem, configurable: true });
}

beforeEach(() => {
  installMemoryLocalStorage();
});

describe('ensureLinkedTeams (own only)', () => {
  it('creates only the owned player team and purges foreign ones', async () => {
    const { state } = await createRun({
      name: 'Soul Run',
      region: 'kanto',
      game: 'firered',
      players: [
        { name: 'ANN', color: '#FFD60A' },
        { name: 'BOB', color: '#45C8FF' },
      ],
      rules: { ...DEFAULT_RULES },
      online: false,
    });

    /* simulate old bug: foreign linked team in vault */
    const foreign = emptyTeam('Soul Run — BOB');
    foreign.linkedRunId = state.run.id;
    foreign.linkedPlayerId = state.players[1].id;
    saveTeam(foreign);

    const ensured = ensureLinkedTeams(state);
    expect(ensured).toHaveLength(1);
    expect(ensured[0].linkedPlayerId).toBe(ownedPlayerId(state));
    expect(loadTeams().filter((t) => t.linkedRunId === state.run.id)).toHaveLength(1);
    expect(findLinkedTeam(state.run.id, state.players[1].id)).toBeNull();
  });
});

describe('syncLinkedTeamRoster', () => {
  it('syncs owned party and preserves set across box trip', async () => {
    const { state } = await createRun({
      name: 'Box Trip',
      region: 'kanto',
      game: 'firered',
      players: [{ name: 'ANN', color: '#FFD60A' }],
      rules: { ...DEFAULT_RULES },
      online: false,
    });
    const playerId = state.players[0].id;
    const res = await logEncounter(state.run.id, {
      playerId,
      routeKey: 'route-1',
      pokemonId: 7,
      nickname: 'Shelly',
      level: 5,
      status: 'caught',
    });
    expect(res.ok).toBe(true);
    const encId = res.encounter!.id;

    let s = getRunState(state.run.id)!;
    await syncLinkedTeamRoster(s, playerId);
    let team = findLinkedTeam(s.run.id, playerId)!;
    expect(team.slots[0].encounterId).toBe(encId);

    team = {
      ...team,
      slots: team.slots.map((slot, i) =>
        i === 0 ? { ...slot, ability: 'Torrent', moves: ['surf', null, null, null] as Team['slots'][0]['moves'] } : slot,
      ),
    };
    saveTeam(team);

    setEncounterParty(s.run.id, encId, false);
    s = getRunState(s.run.id)!;
    await syncLinkedTeamRoster(s, playerId);
    team = findLinkedTeam(s.run.id, playerId)!;
    expect(team.linkedSetBag?.[encId]?.ability).toBe('Torrent');

    setEncounterParty(s.run.id, encId, true);
    s = getRunState(s.run.id)!;
    await syncLinkedTeamRoster(s, playerId);
    team = findLinkedTeam(s.run.id, playerId)!;
    expect(team.slots[0].ability).toBe('Torrent');
  });

  it('does not sync another player', async () => {
    const { state } = await createRun({
      name: 'No Foreign Sync',
      region: 'kanto',
      game: 'firered',
      players: [
        { name: 'ANN', color: '#FFD60A' },
        { name: 'BOB', color: '#45C8FF' },
      ],
      rules: { ...DEFAULT_RULES },
      online: false,
    });
    ensureLinkedTeams(state);
    const before = loadTeams().length;
    const out = await syncLinkedTeamRoster(state, state.players[1].id);
    expect(out).toBeNull();
    expect(loadTeams().length).toBe(before);
  });
});

describe('canEdit / view team', () => {
  it('only owned player is editable; view team is ephemeral', async () => {
    const { state } = await createRun({
      name: 'Edit Guard',
      region: 'kanto',
      game: 'firered',
      players: [
        { name: 'ANN', color: '#FFD60A' },
        { name: 'BOB', color: '#45C8FF' },
      ],
      rules: { ...DEFAULT_RULES },
      online: false,
    });
    expect(canEditLinkedTeam(state, state.players[0].id)).toBe(true);
    expect(canEditLinkedTeam(state, state.players[1].id)).toBe(false);

    const logged = await logEncounter(state.run.id, {
      playerId: state.players[1].id,
      routeKey: 'route-1',
      pokemonId: 4,
      nickname: 'Glumanda',
      level: 5,
      status: 'caught',
    });
    expect(logged.ok).toBe(true);
    const s = getRunState(state.run.id)!;
    const view = await buildViewTeamFromParty(s, state.players[1].id);
    expect(view?.slots[0].pokemonId).toBe(4);
    expect(findLinkedTeam(s.run.id, state.players[1].id)).toBeNull();
    expect(purgeForeignLinkedTeams(s.run.id, ownedPlayerId(s))).toBe(0);
  });
});
