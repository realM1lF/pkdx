/* Migration offer must never surprise guests / mid-auth flashes.
 * Local-only solo runs + teams are adopted silently on login. */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { User } from '@supabase/supabase-js';
import { DEFAULT_RULES } from './nuzlocke-store';
import type { RunState } from './nuzlocke-store';

const USER_ID = 'user-migrate-1';
const LOCAL_SOLO = 'run-local-solo-only';

let mockUser: { id: string } | null = null;
let authCb: ((user: User | null) => void) | null = null;

const runsUpserts: unknown[] = [];
const teamUpserts: unknown[] = [];
const playersUpserts: unknown[] = [];
const encounterUpserts: unknown[] = [];

const { fromMock, onAuthChangeMock } = vi.hoisted(() => ({
  fromMock: vi.fn(),
  onAuthChangeMock: vi.fn(),
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
      setItem: (k: string, v: string) => map.set(String(k), String(v)),
      removeItem: (k: string) => map.delete(k),
      key: (i: number) => [...map.keys()][i] ?? null,
    },
  });
}

function chainable(result: { data: unknown; error: null }) {
  const api: Record<string, unknown> = {
    select: () => api,
    eq: () => api,
    upsert: (_row: unknown) => Promise.resolve(result),
    maybeSingle: () => Promise.resolve(result),
    then: (onFulfilled?: (v: typeof result) => unknown, onRejected?: (r: unknown) => unknown) =>
      Promise.resolve(result).then(onFulfilled, onRejected),
  };
  return api;
}

vi.mock('./auth', () => ({
  getAuthUser: () => mockUser,
  isAuthReady: () => true,
  useAuth: () => ({ ready: true, user: mockUser, profile: null }),
  ensureRunIdentity: vi.fn().mockResolvedValue(undefined),
  onAuthChange: (cb: (user: User | null) => void) => {
    authCb = cb;
    onAuthChangeMock(cb);
    return () => {
      authCb = null;
    };
  },
}));

vi.mock('./supabase', async () => {
  const actual = await vi.importActual<typeof import('./supabase')>('./supabase');
  fromMock.mockImplementation((table: string) => {
    if (table === 'nuz_runs') {
      return {
        upsert: (row: unknown) => {
          runsUpserts.push(row);
          return Promise.resolve({ data: row, error: null });
        },
        select: () => ({
          eq: () => ({
            maybeSingle: () => Promise.resolve({ data: null, error: null }),
          }),
        }),
      };
    }
    if (table === 'nuz_players') {
      return {
        upsert: (rows: unknown) => {
          playersUpserts.push(rows);
          return Promise.resolve({ data: rows, error: null });
        },
      };
    }
    if (table === 'nuz_encounters') {
      return {
        upsert: (rows: unknown) => {
          encounterUpserts.push(rows);
          return Promise.resolve({ data: rows, error: null });
        },
        select: () => ({
          eq: () => ({
            order: () => Promise.resolve({ data: [], error: null }),
          }),
        }),
      };
    }
    if (table === 'nuz_run_members') {
      return {
        select: () => ({
          eq: () => Promise.resolve({ data: [], error: null }),
        }),
      };
    }
    if (table === 'teams') {
      return {
        select: () => ({
          eq: () => Promise.resolve({ data: [], error: null }),
        }),
        upsert: (row: unknown) => {
          teamUpserts.push(row);
          return Promise.resolve({ data: row, error: null });
        },
        delete: () => ({
          eq: () => ({
            eq: () => Promise.resolve({ data: null, error: null }),
          }),
        }),
      };
    }
    if (table === 'nuz_solo_runs') {
      return {
        select: () => ({
          eq: () => Promise.resolve({ data: [], error: null }),
        }),
        upsert: () => Promise.resolve({ data: null, error: null }),
      };
    }
    if (table === 'orre_shadow_progress') {
      return {
        select: () => ({
          eq: () => Promise.resolve({ data: [], error: null }),
        }),
        upsert: () => Promise.resolve({ data: null, error: null }),
        delete: () => ({
          eq: () => ({
            eq: () => ({
              eq: () => Promise.resolve({ data: null, error: null }),
            }),
          }),
        }),
      };
    }
    return chainable({ data: null, error: null });
  });
  return {
    ...actual,
    isMultiCapable: () => true,
    supabase: {
      from: fromMock,
      channel: vi.fn(() => ({
        on: vi.fn().mockReturnThis(),
        subscribe: vi.fn().mockReturnThis(),
      })),
      removeChannel: vi.fn(),
      auth: { getSession: () => Promise.resolve({ data: { session: null } }) },
    },
    nuzTables: {
      runs: () => fromMock('nuz_runs'),
      players: () => fromMock('nuz_players'),
      encounters: () => fromMock('nuz_encounters'),
    },
  };
});

function seedLocalSolo(): void {
  const state: RunState = {
    run: {
      id: LOCAL_SOLO,
      invite_code: null,
      name: 'Phone Solo',
      game: 'firered',
      region: 'kanto',
      rules: { ...DEFAULT_RULES },
      status: 'active',
      created_at: '2026-01-01T00:00:00.000Z',
    },
    mode: 'solo',
    players: [
      {
        id: 'player-local',
        run_id: LOCAL_SOLO,
        name: 'ME',
        color: '#FFD60A',
        slot: 0,
        created_at: '2026-01-01T00:00:00.000Z',
      },
    ],
    encounters: [],
  };
  localStorage.setItem(`pdx2.nuz.run.${LOCAL_SOLO}`, JSON.stringify(state));
  localStorage.setItem('pdx2.nuz.runs', JSON.stringify([LOCAL_SOLO]));
}

describe('cloud-sync migration', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.useFakeTimers();
    installMemoryLocalStorage();
    mockUser = null;
    authCb = null;
    runsUpserts.length = 0;
    teamUpserts.length = 0;
    playersUpserts.length = 0;
    encounterUpserts.length = 0;
    fromMock.mockClear();
    onAuthChangeMock.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('guest / logged-out auth callback does not open a migration offer', async () => {
    seedLocalSolo();
    const offers: unknown[] = [];
    const cloud = await import('./cloud-sync');
    cloud.onMigrationOffer((o) => offers.push(o));
    cloud.bootCloudSync();

    authCb?.(null);
    await vi.advanceTimersByTimeAsync(50);

    expect(offers.filter(Boolean)).toHaveLength(0);
  });

  it('login silently upserts local-only solo runs into nuz_runs (no dialog)', async () => {
    seedLocalSolo();
    const offers: unknown[] = [];
    const cloud = await import('./cloud-sync');
    cloud.onMigrationOffer((o) => offers.push(o));
    cloud.bootCloudSync();

    mockUser = { id: USER_ID };
    authCb?.(mockUser as User);
    await vi.advanceTimersByTimeAsync(1200);

    expect(offers.filter(Boolean)).toHaveLength(0);
    expect(runsUpserts.some((r) => (r as { id?: string }).id === LOCAL_SOLO)).toBe(true);
  });
});
