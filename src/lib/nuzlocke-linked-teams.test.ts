import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  buildViewTeamFromParty,
  canEditLinkedTeam,
  ensureLinkedTeams,
  findLinkedTeam,
  ownedPlayerId,
  purgeForeignLinkedTeams,
  repairAllLinkedTeams,
  resolveRunImport,
  syncLinkedTeamRoster,
} from './nuzlocke-linked-teams';
import {
  DEFAULT_RULES,
  createRun,
  getRunState,
  logEncounter,
  setEncounterParty,
} from './nuzlocke-store';
import { emptyTeam, listImportableRuns, loadTeams, saveTeam, teamVaultCountKey, type Team } from './teambuilder';

vi.mock('./auth', () => ({
  getAuthUser: () => ({ id: 'test-user' }),
  isAuthReady: () => true,
  useAuth: () => ({ ready: true, user: { id: 'test-user' }, profile: null }),
  ensureRunIdentity: async () => undefined,
  onAuthChange: () => () => undefined,
}));

const { learnsetById } = vi.hoisted(() => ({
  learnsetById: {} as Record<number, Array<{ slug: string; level: number; vg: string }>>,
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
      moves: (learnsetById[Number(id)] ?? []).map((m) => ({
        move: { name: m.slug, url: '' },
        version_group_details: [
          {
            level_learned_at: m.level,
            move_learn_method: { name: 'level-up', url: '' },
            version_group: { name: m.vg, url: '' },
          },
        ],
      })),
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
  for (const key of Object.keys(learnsetById)) delete learnsetById[Number(key)];
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

  it('seeds level-up moves once when a catch first enters the party', async () => {
    learnsetById[7] = [
      { slug: 'tackle', level: 1, vg: 'firered-leafgreen' },
      { slug: 'tail-whip', level: 1, vg: 'firered-leafgreen' },
      { slug: 'water-gun', level: 1, vg: 'firered-leafgreen' },
      { slug: 'withdraw', level: 1, vg: 'firered-leafgreen' },
    ];
    const { state } = await createRun({
      name: 'First Set',
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

    await vi.waitFor(() => {
      const seeded = findLinkedTeam(state.run.id, playerId);
      expect(seeded?.slots[0].moves).toEqual(['tackle', 'tail-whip', 'water-gun', 'withdraw']);
    });
    let s = getRunState(state.run.id)!;
    let team = findLinkedTeam(s.run.id, playerId)!;

    team = {
      ...team,
      slots: team.slots.map((slot, i) =>
        i === 0 ? { ...slot, moves: ['surf', null, null, null] as Team['slots'][0]['moves'] } : slot,
      ),
    };
    saveTeam(team);

    setEncounterParty(s.run.id, encId, false);
    s = getRunState(s.run.id)!;
    await syncLinkedTeamRoster(s, playerId);
    setEncounterParty(s.run.id, encId, true);
    s = getRunState(s.run.id)!;
    await syncLinkedTeamRoster(s, playerId);
    team = findLinkedTeam(s.run.id, playerId)!;
    expect(team.slots[0].moves).toEqual(['surf', null, null, null]);
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

describe('linked team uniqueness (run + player)', () => {
  it('saveTeam does not insert a second row for the same run and player', () => {
    const first = emptyTeam('letsgo — You');
    first.linkedRunId = 'run-letsgo';
    first.linkedPlayerId = 'player-you';
    saveTeam(first);

    const copy = emptyTeam('letsgo — You');
    copy.linkedRunId = 'run-letsgo';
    copy.linkedPlayerId = 'player-you';
    copy.slots = first.slots.map((s, i) => (i === 0 ? { ...s, pokemon: 'starmie', pokemonId: 121 } : s));
    saveTeam(copy);

    const rows = loadTeams().filter((t) => t.linkedRunId === 'run-letsgo' && t.linkedPlayerId === 'player-you');
    expect(rows).toHaveLength(1);
    expect(rows[0].id).toBe(first.id);
    expect(rows[0].slots[0].pokemonId).toBe(121);
  });

  it('ensureLinkedTeams collapses extra owned copies already in the vault', async () => {
    const { state } = await createRun({
      name: 'letsgo',
      region: 'kanto',
      game: 'red',
      players: [{ name: 'Du', color: '#FFD60A' }],
      rules: { ...DEFAULT_RULES },
      online: false,
    });
    const mine = ownedPlayerId(state)!;
    ensureLinkedTeams(state);
    const original = findLinkedTeam(state.run.id, mine)!;

    const extra = emptyTeam(original.name);
    extra.linkedRunId = state.run.id;
    extra.linkedPlayerId = mine;
    extra.versionGroup = original.versionGroup;
    extra.slots = original.slots;
    /* already-corrupt vault: two ids, same link key (bypass saveTeam) */
    localStorage.setItem('pdx2.teams', JSON.stringify([extra, original]));
    expect(loadTeams().filter((t) => t.linkedRunId === state.run.id && t.linkedPlayerId === mine)).toHaveLength(2);

    const ensured = ensureLinkedTeams(state);
    const rows = loadTeams().filter((t) => t.linkedRunId === state.run.id && t.linkedPlayerId === mine);
    expect(rows).toHaveLength(1);
    expect(ensured).toHaveLength(1);
    expect(ensured[0].id).toBe(rows[0].id);
  });

  it('createRun does not insert an empty linked team', async () => {
    await createRun({
      name: 'Kalos-Protokoll Nr. 1',
      region: 'kalos',
      game: 'scarlet',
      players: [{ name: 'Du', color: '#FFD60A' }],
      rules: { ...DEFAULT_RULES },
      online: false,
    });
    expect(loadTeams()).toEqual([]);
  });

  it('first catch creates the owned linked team', async () => {
    const { state } = await createRun({
      name: 'Catch Then Link',
      region: 'kanto',
      game: 'firered',
      players: [{ name: 'ANN', color: '#FFD60A' }],
      rules: { ...DEFAULT_RULES },
      online: false,
    });
    expect(loadTeams()).toEqual([]);
    const res = await logEncounter(state.run.id, {
      playerId: state.players[0].id,
      routeKey: 'route-1',
      pokemonId: 25,
      nickname: 'Pika',
      level: 5,
      status: 'caught',
    });
    expect(res.ok).toBe(true);
    await vi.waitFor(() => {
      expect(findLinkedTeam(state.run.id, state.players[0].id)).not.toBeNull();
    });
    expect(findLinkedTeam(state.run.id, state.players[0].id)?.slots[0].pokemonId).toBe(25);
  });

  it('repairAllLinkedTeams deletes teams whose run is gone', async () => {
    const { state } = await createRun({
      name: 'Orphan Source',
      region: 'kalos',
      game: 'scarlet',
      players: [{ name: 'Du', color: '#FFD60A' }],
      rules: { ...DEFAULT_RULES },
      online: false,
    });
    ensureLinkedTeams(state);
    expect(findLinkedTeam(state.run.id, ownedPlayerId(state)!)).not.toBeNull();

    localStorage.removeItem(`pdx2.nuz.run.${state.run.id}`);
    localStorage.setItem('pdx2.nuz.runs', JSON.stringify([]));
    localStorage.setItem('pdx2.nuz.archived', JSON.stringify([]));

    repairAllLinkedTeams();
    expect(loadTeams().filter((t) => t.linkedRunId === state.run.id)).toHaveLength(0);
  });

  it('repairAllLinkedTeams keeps a team for an archived run', async () => {
    const { state } = await createRun({
      name: 'Archived Keep',
      region: 'kanto',
      game: 'firered',
      players: [{ name: 'ANN', color: '#FFD60A' }],
      rules: { ...DEFAULT_RULES },
      online: false,
    });
    ensureLinkedTeams(state);
    localStorage.setItem('pdx2.nuz.runs', JSON.stringify([]));
    localStorage.setItem('pdx2.nuz.archived', JSON.stringify([state.run.id]));

    repairAllLinkedTeams();
    expect(findLinkedTeam(state.run.id, ownedPlayerId(state)!)).not.toBeNull();
  });

  it('repairAllLinkedTeams collapses leftover duplicates', async () => {
    const { state } = await createRun({
      name: 'test',
      region: 'kanto',
      game: 'firered',
      players: [{ name: 'You', color: '#45C8FF' }],
      rules: { ...DEFAULT_RULES },
      online: false,
    });
    const mine = ownedPlayerId(state)!;
    ensureLinkedTeams(state);
    const original = findLinkedTeam(state.run.id, mine)!;

    const extraA = emptyTeam(original.name);
    extraA.linkedRunId = state.run.id;
    extraA.linkedPlayerId = mine;
    extraA.slots = original.slots;
    const extraB = emptyTeam(original.name);
    extraB.linkedRunId = state.run.id;
    extraB.linkedPlayerId = mine;
    extraB.slots = original.slots;
    /* bypass uniqueness by writing the array directly — models already-corrupt vault */
    const raw = [extraB, extraA, original];
    localStorage.setItem('pdx2.teams', JSON.stringify(raw));
    expect(loadTeams().filter((t) => t.linkedRunId === state.run.id)).toHaveLength(3);

    repairAllLinkedTeams();
    expect(loadTeams().filter((t) => t.linkedRunId === state.run.id && t.linkedPlayerId === mine)).toHaveLength(1);
  });
});

describe('import + vault labels', () => {
  it('listImportableRuns includes archived runs missing from the active index', async () => {
    const { state } = await createRun({
      name: 'Archived Import',
      region: 'kanto',
      game: 'firered',
      players: [{ name: 'ANN', color: '#FFD60A' }],
      rules: { ...DEFAULT_RULES },
      online: false,
    });
    localStorage.setItem('pdx2.nuz.runs', JSON.stringify([]));
    localStorage.setItem('pdx2.nuz.archived', JSON.stringify([state.run.id]));
    expect(listImportableRuns().map((r) => r.id)).toContain(state.run.id);
  });

  it('resolveRunImport opens the owned linked team instead of copying', async () => {
    const { state } = await createRun({
      name: 'No Copy',
      region: 'kanto',
      game: 'firered',
      players: [{ name: 'ANN', color: '#FFD60A' }],
      rules: { ...DEFAULT_RULES },
      online: false,
    });
    const res = await logEncounter(state.run.id, {
      playerId: state.players[0].id,
      routeKey: 'route-1',
      pokemonId: 1,
      nickname: 'Bisa',
      level: 5,
      status: 'caught',
    });
    expect(res.ok).toBe(true);
    await vi.waitFor(() => {
      expect(findLinkedTeam(state.run.id, state.players[0].id)).not.toBeNull();
    });
    const linked = findLinkedTeam(state.run.id, state.players[0].id)!;
    const resolved = await resolveRunImport(state.run.id);
    expect(resolved.kind).toBe('linked');
    if (resolved.kind === 'linked') expect(resolved.team.id).toBe(linked.id);
  });

  it('teamVaultCountKey distinguishes account vs local', () => {
    expect(teamVaultCountKey(true)).toBe('tb.hub.vaultCountAccount');
    expect(teamVaultCountKey(false)).toBe('tb.hub.vaultCount');
  });
});
