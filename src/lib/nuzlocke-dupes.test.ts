/* Dupes Clause — evolution family, run-wide (all living players). */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { clearEvolutionFamilyCache, primeEvolutionFamilyCache } from './nuzlocke-evolution';
import { evoLineAliveInRun, validateLogDraft } from './nuzlocke-rules';
import { DEFAULT_RULES, createRun, getRunState, logEncounter, updateEncounter } from './nuzlocke-store';
import type { RunState } from './nuzlocke-store';

vi.mock('./auth', () => ({
  getAuthUser: () => ({ id: 'test-user' }),
  isAuthReady: () => true,
  useAuth: () => ({ ready: true, user: { id: 'test-user' }, profile: null }),
  ensureRunIdentity: async () => undefined,
  onAuthChange: () => () => undefined,
}));

const SQUIRTLE = 7;
const WARTORTLE = 8;
const BLASTOISE = 9;
const CHARMANDER = 4;

beforeEach(() => {
  clearEvolutionFamilyCache();
  primeEvolutionFamilyCache([SQUIRTLE, WARTORTLE, BLASTOISE]);
  primeEvolutionFamilyCache([CHARMANDER, 5, 6]);
  primeEvolutionFamilyCache([1, 2, 3]);
});

function installMemoryLocalStorage(): void {
  const map = new Map<string, string>();
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      get length() {
        return map.size;
      },
      clear: () => map.clear(),
      getItem: (k: string) => (map.has(k) ? map.get(k)! : null),
      setItem: (k: string, v: string) => {
        map.set(String(k), String(v));
      },
      removeItem: (k: string) => {
        map.delete(k);
      },
      key: (i: number) => [...map.keys()][i] ?? null,
    },
  });
}

beforeEach(() => {
  installMemoryLocalStorage();
});

async function makeRun(): Promise<RunState> {
  const { state } = await createRun({
    name: 'Dupes Line',
    region: 'kanto',
    game: 'firered',
    players: [
      { name: 'ANN', color: '#FFD60A' },
      { name: 'BOB', color: '#45C8FF' },
    ],
    rules: { ...DEFAULT_RULES, nicknames: false, dupes: true },
    online: false,
  });
  return state;
}

describe('evoLineAliveInRun', () => {
  it('matches current and caught forms against the family', () => {
    const state = {
      run: { rules: DEFAULT_RULES },
      mode: 'solo' as const,
      players: [],
      encounters: [
        {
          id: 'e1',
          run_id: 'r',
          player_id: 'p1',
          route_key: 'route-1',
          pokemon_id: WARTORTLE,
          caught_pokemon_id: SQUIRTLE,
          nickname: null,
          level: 20,
          status: 'caught' as const,
          note: null,
          created_at: '',
        },
      ],
    } as unknown as RunState;
    expect(evoLineAliveInRun(state, [SQUIRTLE, WARTORTLE, BLASTOISE])).toBe(true);
    expect(evoLineAliveInRun(state, [CHARMANDER, 5, 6])).toBe(false);
  });
});

describe('Dupes Clause — evolution family across players', () => {
  it('blocks Wartortle/Blastoise when another player holds Squirtle', async () => {
    let s = await makeRun();
    const ann = s.players[0];
    const bob = s.players[1];

    const ok = await logEncounter(s.run.id, {
      playerId: ann.id,
      routeKey: 'route-1',
      pokemonId: SQUIRTLE,
      nickname: 'Shelly',
      level: 5,
      status: 'caught',
    });
    expect(ok.ok).toBe(true);
    s = getRunState(s.run.id)!;

    const wart = await logEncounter(s.run.id, {
      playerId: bob.id,
      routeKey: 'route-1',
      pokemonId: WARTORTLE,
      nickname: 'Shell',
      level: 16,
      status: 'caught',
    });
    expect(wart.ok).toBe(false);
    expect(wart.error).toBe('speciesDupe');

    const blast = await validateLogDraft(s, {
      playerId: bob.id,
      routeKey: 'route-2',
      pokemonId: BLASTOISE,
      nickname: 'Tank',
      level: 36,
      status: 'caught',
    });
    expect(blast).toBe('speciesDupe');

    const charm = await logEncounter(s.run.id, {
      playerId: bob.id,
      routeKey: 'route-1',
      pokemonId: CHARMANDER,
      nickname: 'Ember',
      level: 5,
      status: 'caught',
    });
    expect(charm.ok).toBe(true);
  });

  it('still blocks after the holder evolved (caught form keeps the line)', async () => {
    let s = await makeRun();
    const ann = s.players[0];
    const bob = s.players[1];

    const catchSq = await logEncounter(s.run.id, {
      playerId: ann.id,
      routeKey: 'route-1',
      pokemonId: SQUIRTLE,
      nickname: 'Shelly',
      level: 5,
      status: 'caught',
    });
    expect(catchSq.ok).toBe(true);
    updateEncounter(s.run.id, catchSq.encounter!.id, { pokemon_id: WARTORTLE });
    s = getRunState(s.run.id)!;
    expect(s.encounters[0].pokemon_id).toBe(WARTORTLE);
    expect(s.encounters[0].caught_pokemon_id).toBe(SQUIRTLE);

    const blocked = await logEncounter(s.run.id, {
      playerId: bob.id,
      routeKey: 'route-2',
      pokemonId: BLASTOISE,
      nickname: 'Nuke',
      level: 36,
      status: 'caught',
    });
    expect(blocked.ok).toBe(false);
    expect(blocked.error).toBe('speciesDupe');
  });

  it('frees the line when the living catch dies', async () => {
    let s = await makeRun();
    const ann = s.players[0];
    const bob = s.players[1];

    const catchSq = await logEncounter(s.run.id, {
      playerId: ann.id,
      routeKey: 'route-1',
      pokemonId: SQUIRTLE,
      nickname: 'Shelly',
      level: 5,
      status: 'caught',
    });
    updateEncounter(s.run.id, catchSq.encounter!.id, { status: 'dead' });
    s = getRunState(s.run.id)!;

    const after = await logEncounter(s.run.id, {
      playerId: bob.id,
      routeKey: 'route-1',
      pokemonId: WARTORTLE,
      nickname: 'Shell',
      level: 16,
      status: 'caught',
    });
    expect(after.ok).toBe(true);
  });

  it('dupes off allows the same line for another player', async () => {
    const { state } = await createRun({
      name: 'No Dupes',
      region: 'kanto',
      game: 'firered',
      players: [
        { name: 'ANN', color: '#FFD60A' },
        { name: 'BOB', color: '#45C8FF' },
      ],
      rules: { ...DEFAULT_RULES, nicknames: false, dupes: false },
      online: false,
    });
    await logEncounter(state.run.id, {
      playerId: state.players[0].id,
      routeKey: 'route-1',
      pokemonId: SQUIRTLE,
      nickname: null,
      level: 5,
      status: 'caught',
    });
    const res = await logEncounter(state.run.id, {
      playerId: state.players[1].id,
      routeKey: 'route-1',
      pokemonId: WARTORTLE,
      nickname: null,
      level: 16,
      status: 'caught',
    });
    expect(res.ok).toBe(true);
  });
});
