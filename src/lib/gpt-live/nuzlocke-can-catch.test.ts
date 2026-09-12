import { beforeEach, describe, expect, it, vi } from 'vitest';
import { clearEvolutionFamilyCache, primeEvolutionFamilyCache } from '@/lib/nuzlocke-evolution';
import { validateLogDraft } from '@/lib/nuzlocke-rules';
import { DEFAULT_RULES, createRun, getRunState, logEncounter } from '@/lib/nuzlocke-store';
import type { RunState } from '@/lib/nuzlocke-store';
import { executeRegisteredTool } from './registry';
import { NUZLOCKE_CAN_CATCH, nuzlockeCanCatchFromArgs } from './nuzlocke-can-catch';

vi.mock('@/lib/auth', () => ({
  getAuthUser: () => ({ id: 'test-user' }),
  isAuthReady: () => true,
  useAuth: () => ({ ready: true, user: { id: 'test-user' }, profile: null }),
  ensureRunIdentity: async () => undefined,
  onAuthChange: () => () => undefined,
}));

const SQUIRTLE = 7;
const WARTORTLE = 8;
const BLASTOISE = 9;

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
  clearEvolutionFamilyCache();
  primeEvolutionFamilyCache([SQUIRTLE, WARTORTLE, BLASTOISE]);
});

async function makeRun(): Promise<RunState> {
  const { state } = await createRun({
    name: 'Catch Check',
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

describe('nuzlocke_can_catch', () => {
  it('returns no_run without a browser snapshot', async () => {
    const result = await executeRegisteredTool(
      NUZLOCKE_CAN_CATCH,
      { species_query: 'Schiggy', route_query: 'Route 1', player_slot: 1, level: 5, is_shiny: false },
      {},
    );
    expect(result).toMatchObject({ ok: false, error: 'no_run' });
  });

  it('agrees with validateLogDraft for an open catch', async () => {
    let state = await makeRun();
    const args = {
      species_query: 'Taubsi',
      route_query: 'Route 1',
      player_slot: 1,
      level: 5,
      is_shiny: false,
    };
    const tool = await nuzlockeCanCatchFromArgs(args, { run: state });
    const lib = await validateLogDraft(state, {
      playerId: state.players[0]!.id,
      routeKey: 'kanto-route-1',
      pokemonId: 16,
      nickname: null,
      level: 5,
      status: 'caught',
    });
    expect(tool).toMatchObject({ ok: true, canCatch: lib === null, validationError: lib });
  });

  it('agrees with validateLogDraft for speciesDupe after a living line claim', async () => {
    let state = await makeRun();
    const first = await logEncounter(state.run.id, {
      playerId: state.players[0]!.id,
      routeKey: 'kanto-route-1',
      pokemonId: SQUIRTLE,
      nickname: 'Shell',
      level: 5,
      status: 'caught',
    });
    expect(first.ok).toBe(true);
    state = getRunState(state.run.id)!;

    const tool = await nuzlockeCanCatchFromArgs(
      {
        species_query: 'Turtok',
        route_query: 'Route 22',
        player_slot: 2,
        level: 5,
        is_shiny: false,
      },
      { run: state },
    );
    const lib = await validateLogDraft(state, {
      playerId: state.players[1]!.id,
      routeKey: 'kanto-route-22',
      pokemonId: BLASTOISE,
      nickname: null,
      level: 5,
      status: 'caught',
    });
    expect(tool).toMatchObject({ ok: true, canCatch: false, validationError: 'speciesDupe' });
    expect(lib).toBe('speciesDupe');
  });

  it('agrees with validateLogDraft for duplicate route lock', async () => {
    let state = await makeRun();
    const first = await logEncounter(state.run.id, {
      playerId: state.players[0]!.id,
      routeKey: 'kanto-route-1',
      pokemonId: 16,
      nickname: 'Bird',
      level: 5,
      status: 'caught',
    });
    expect(first.ok).toBe(true);
    state = getRunState(state.run.id)!;

    const tool = await nuzlockeCanCatchFromArgs(
      {
        species_query: 'Rattfratz',
        route_query: 'Route 1',
        player_slot: 1,
        level: 5,
        is_shiny: false,
      },
      { run: state },
    );
    const lib = await validateLogDraft(state, {
      playerId: state.players[0]!.id,
      routeKey: 'kanto-route-1',
      pokemonId: 19,
      nickname: null,
      level: 5,
      status: 'caught',
    });
    expect(tool).toMatchObject({ ok: true, canCatch: false, validationError: 'duplicate' });
    expect(lib).toBe('duplicate');
  });
});
