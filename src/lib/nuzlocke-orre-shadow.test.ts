import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_RULES, createRun, getRunState, logEncounter } from './nuzlocke-store';

vi.mock('./auth', () => ({
  getAuthUser: () => ({ id: 'test-user' }),
  isAuthReady: () => true,
  useAuth: () => ({ ready: true, user: { id: 'test-user' }, profile: null }),
  ensureRunIdentity: async () => undefined,
  onAuthChange: () => () => undefined,
}));

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

describe('Orre encounter shadow_id', () => {
  it('stores the curated Shadow id on the logged row', async () => {
    const { state } = await createRun({
      name: 'Colo',
      region: 'orre',
      game: 'colosseum',
      players: [{ name: 'ANN', color: '#FFD60A' }],
      rules: { ...DEFAULT_RULES, nicknames: false },
      online: false,
    });
    const playerId = state.players[0].id;
    const res = await logEncounter(state.run.id, {
      playerId,
      routeKey: 'orre-phenac-mayors-house',
      pokemonId: 296,
      nickname: null,
      level: 30,
      status: 'caught',
      shadowId: 'colo-shadow-makuhita',
    });
    expect(res.ok).toBe(true);
    expect(res.encounter?.shadow_id).toBe('colo-shadow-makuhita');
    const live = getRunState(state.run.id);
    expect(live?.encounters[0]?.shadow_id).toBe('colo-shadow-makuhita');
  });

  it('caught shadow encounter marks the Orre tracker snagged', async () => {
    const { getStatus } = await import('./orre-progress');
    const { state } = await createRun({
      name: 'Colo Sync',
      region: 'orre',
      game: 'colosseum',
      players: [{ name: 'ANN', color: '#FFD60A' }],
      rules: { ...DEFAULT_RULES, nicknames: false },
      online: false,
    });
    const res = await logEncounter(state.run.id, {
      playerId: state.players[0].id,
      routeKey: 'orre-phenac-mayors-house',
      pokemonId: 296,
      nickname: null,
      level: 30,
      status: 'caught',
      shadowId: 'colo-shadow-makuhita',
    });
    expect(res.ok).toBe(true);
    expect(getStatus('colosseum', 'colo-shadow-makuhita')).toBe('snagged');
  });
});
