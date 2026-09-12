import { beforeEach, describe, expect, it, vi } from 'vitest';
import { effectiveLevelCap, formatRunSummary, nextGymInfo } from '@/lib/nuzlocke-rules';
import { DEFAULT_RULES, createRun, kpisOf, partyOf } from '@/lib/nuzlocke-store';
import type { RunState } from '@/lib/nuzlocke-store';
import { executeRegisteredTool } from './registry';
import { runSummaryOptions } from './nuzlocke-run-context';
import { NUZLOCKE_RUN_STATUS, nuzlockeRunStatusFromArgs } from './nuzlocke-run-status';

vi.mock('@/lib/auth', () => ({
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

async function makeRun(): Promise<RunState> {
  const { state } = await createRun({
    name: 'Voice Run',
    region: 'kanto',
    game: 'firered',
    players: [{ name: 'ANN', color: '#FFD60A' }],
    rules: { ...DEFAULT_RULES, nicknames: false, autoLevelCap: true, badgesCleared: 0 },
    online: false,
  });
  return state;
}

describe('nuzlocke_run_status', () => {
  it('returns no_run when the browser did not attach a snapshot', async () => {
    const result = await executeRegisteredTool(NUZLOCKE_RUN_STATUS, {}, {});
    expect(result).toMatchObject({ ok: false, error: 'no_run' });
  });

  it('matches formatRunSummary, kpisOf, partyOf, and level cap helpers', async () => {
    const state = await makeRun();
    const result = await nuzlockeRunStatusFromArgs({}, { run: state });
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const expectedSummary = formatRunSummary(state, runSummaryOptions(state, 'en'));
    const expectedKpis = kpisOf(state);
    const expectedCap = effectiveLevelCap(state);
    const expectedGym = nextGymInfo(state);
    const expectedParty = partyOf(state, state.players[0]!.id).map((enc) => enc.pokemon_id);

    expect(result.summary).toBe(expectedSummary);
    expect(result.kpis).toEqual(expectedKpis);
    expect(result.levelCap).toBe(expectedCap);
    expect(result.nextGym).toEqual(expectedGym);
    expect(result.players[0]?.party.map((row) => row.pokemonId)).toEqual(expectedParty);
  });
});
