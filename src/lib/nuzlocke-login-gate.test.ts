/* Every create (solo + online), join and goOnline requires a real account
 * (not anonymous) — runs live in the DB so they are the same on every device. */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { NuzPlayerRow, NuzRunRow } from './supabase';
import { DEFAULT_RULES } from './nuzlocke-store';

const USER_ID = 'user-gate-1';
const RUN_ID = 'run-gate-1';

let mockUser: { id: string } | null = null;

const runsById = new Map<string, NuzRunRow>();
const playersByRun = new Map<string, NuzPlayerRow[]>();
const insertedRuns: unknown[] = [];

const { fromMock } = vi.hoisted(() => ({
  fromMock: vi.fn(),
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
  Object.defineProperty(globalThis, 'document', {
    configurable: true,
    value: {
      visibilityState: 'visible',
      documentElement: { lang: 'en' },
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    },
  });
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: {
      setTimeout: (...args: Parameters<typeof setTimeout>) => setTimeout(...args),
      clearTimeout: (...args: Parameters<typeof clearTimeout>) => clearTimeout(...args),
      location: { pathname: '/en/' },
    },
  });
}

vi.mock('./auth', () => ({
  getAuthUser: () => mockUser,
  isAuthReady: () => true,
  useAuth: () => ({ ready: true, user: mockUser, profile: null }),
  ensureRunIdentity: vi.fn().mockResolvedValue(undefined),
  onAuthChange: vi.fn(() => () => undefined),
}));

vi.mock('./supabase', async () => {
  const actual = await vi.importActual<typeof import('./supabase')>('./supabase');
  fromMock.mockImplementation((table: string) => {
    if (table === 'nuz_runs') {
      return {
        insert: (row: unknown) => {
          insertedRuns.push(row);
          const r = row as NuzRunRow;
          runsById.set(r.id, r);
          return Promise.resolve({ data: row, error: null });
        },
        upsert: (row: unknown) => {
          insertedRuns.push(row);
          const r = row as NuzRunRow;
          runsById.set(r.id, r);
          return Promise.resolve({ data: row, error: null });
        },
        select: () => ({
          eq: () => ({
            maybeSingle: () => Promise.resolve({ data: null, error: null }),
          }),
        }),
        update: () => ({
          eq: () => Promise.resolve({ data: null, error: null }),
        }),
      };
    }
    if (table === 'nuz_players') {
      return {
        insert: (rows: NuzPlayerRow[]) => {
          const list = Array.isArray(rows) ? rows : [rows];
          for (const p of list) {
            const cur = playersByRun.get(p.run_id) ?? [];
            cur.push(p);
            playersByRun.set(p.run_id, cur);
          }
          return Promise.resolve({ data: rows, error: null });
        },
        upsert: (rows: NuzPlayerRow[]) => Promise.resolve({ data: rows, error: null }),
      };
    }
    if (table === 'nuz_encounters') {
      return {
        upsert: () => Promise.resolve({ data: null, error: null }),
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
          eq: () => ({
            eq: () => ({
              maybeSingle: () => Promise.resolve({ data: null, error: null }),
            }),
          }),
        }),
        upsert: () => Promise.resolve({ data: null, error: null }),
      };
    }
    return {
      select: () => ({ eq: () => Promise.resolve({ data: null, error: null }) }),
    };
  });
  return {
    ...actual,
    isMultiCapable: () => true,
    supabase: {
      from: fromMock,
      rpc: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST202' } }),
      channel: vi.fn(() => ({
        on: vi.fn().mockReturnThis(),
        subscribe: vi.fn().mockReturnThis(),
        track: vi.fn(),
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

vi.mock('./nuzlocke-linked-teams', () => ({
  syncLinkedTeamsForRun: vi.fn().mockResolvedValue(undefined),
  ensureLinkedTeams: vi.fn().mockResolvedValue(undefined),
  repairAllLinkedTeams: vi.fn().mockResolvedValue(undefined),
  cloneLinkedTeamsForDuplicate: vi.fn(),
  deleteLinkedTeamsForRun: vi.fn().mockResolvedValue(undefined),
}));

describe('nuzlocke login gate', () => {
  beforeEach(() => {
    vi.resetModules();
    installMemoryLocalStorage();
    mockUser = null;
    runsById.clear();
    playersByRun.clear();
    insertedRuns.length = 0;
    fromMock.mockClear();
  });

  async function loadStore() {
    return import('./nuzlocke-store');
  }

  it('createRun online without account throws and creates nothing', async () => {
    mockUser = null;
    const { createRun, readRunIndex, NuzLoginRequiredError } = await loadStore();
    await expect(
      createRun({
        name: 'No Account Online',
        region: 'kanto',
        game: 'firered',
        players: [{ name: 'ME', color: '#FFD60A' }],
        rules: { ...DEFAULT_RULES },
        online: true,
      }),
    ).rejects.toBeInstanceOf(NuzLoginRequiredError);
    expect(readRunIndex()).toHaveLength(0);
    expect(insertedRuns).toHaveLength(0);
  });

  it('createRun online with account proceeds', async () => {
    mockUser = { id: USER_ID };
    const { createRun } = await loadStore();
    const res = await createRun({
      name: 'Account Online',
      region: 'kanto',
      game: 'firered',
      players: [{ name: 'ME', color: '#FFD60A' }],
      rules: { ...DEFAULT_RULES },
      online: true,
    });
    expect(res.state.mode).toBe('multi');
    expect(res.inviteCode).toBeTruthy();
  });

  it('createRun solo without account throws and creates nothing', async () => {
    mockUser = null;
    const { createRun, readRunIndex, NuzLoginRequiredError } = await loadStore();
    await expect(
      createRun({
        name: 'Local Solo',
        region: 'kanto',
        game: 'firered',
        players: [{ name: 'ME', color: '#FFD60A' }],
        rules: { ...DEFAULT_RULES },
        online: false,
      }),
    ).rejects.toBeInstanceOf(NuzLoginRequiredError);
    expect(readRunIndex()).toHaveLength(0);
    expect(insertedRuns).toHaveLength(0);
  });

  it('createRun solo with account proceeds and is cloud-backed', async () => {
    mockUser = { id: USER_ID };
    const { createRun } = await loadStore();
    const res = await createRun({
      name: 'Account Solo',
      region: 'kanto',
      game: 'firered',
      players: [{ name: 'ME', color: '#FFD60A' }],
      rules: { ...DEFAULT_RULES },
      online: false,
    });
    expect(res.state.mode).toBe('solo');
    expect(res.inviteCode).toBeNull();
    expect(insertedRuns).toHaveLength(1);
  });

  it('joinRun without account returns null', async () => {
    mockUser = null;
    const { joinRun } = await loadStore();
    const state = await joinRun(
      {
        run: {
          id: RUN_ID,
          invite_code: 'SOUL-TESTCODE',
          name: 'Host Run',
          game: 'firered',
          region: 'kanto',
          rules: { ...DEFAULT_RULES },
          status: 'active',
          created_at: '2026-01-01T00:00:00.000Z',
        },
        players: [
          {
            id: 'player-host',
            run_id: RUN_ID,
            name: 'HOST',
            color: '#FFD60A',
            slot: 0,
            created_at: '2026-01-01T00:00:00.000Z',
          },
        ],
      },
      'JOINE',
      '#45C8FF',
    );
    expect(state).toBeNull();
  });

  it('goOnline after logout returns false', async () => {
    mockUser = { id: USER_ID };
    const { createRun, goOnline } = await loadStore();
    const { state } = await createRun({
      name: 'Stay Local',
      region: 'kanto',
      game: 'firered',
      players: [{ name: 'ME', color: '#FFD60A' }],
      rules: { ...DEFAULT_RULES },
      online: false,
    });
    expect(state).not.toBeNull();
    mockUser = null;
    expect(await goOnline(state!.run.id)).toBe(false);
    expect(state!.mode).toBe('solo');
  });

  it('cloud run with missing server row surfaces hydrateFailed toast', async () => {
    mockUser = { id: USER_ID };
    const store = await loadStore();
    const runId = 'run-stale-hydrate';
    const local = {
      run: {
        id: runId,
        invite_code: 'SOUL-STALE01',
        name: 'Stale Multi',
        game: 'firered',
        region: 'kanto',
        rules: { ...DEFAULT_RULES },
        status: 'active' as const,
        created_at: '2026-01-01T00:00:00.000Z',
      },
      mode: 'multi' as const,
      players: [
        {
          id: 'player-stale',
          run_id: runId,
          name: 'ME',
          color: '#FFD60A',
          slot: 0,
          created_at: '2026-01-01T00:00:00.000Z',
        },
      ],
      encounters: [],
    };
    localStorage.setItem(`pdx2.nuz.run.${runId}`, JSON.stringify(local));
    localStorage.setItem('pdx2.nuz.runs', JSON.stringify([runId]));
    store.markRunAccountLinked(runId);

    const texts: string[] = [];
    const stop = store.onToast((toast) => {
      texts.push(toast.text);
    });
    const unsub = store.subscribeRun(runId, () => undefined);
    await vi.waitFor(() => {
      expect(texts.some((t) => /Server|server|cache|Cache|Stand/i.test(t))).toBe(true);
    });
    unsub();
    stop();
  });

  it('duplicateAsSolo without account returns null and creates nothing', async () => {
    mockUser = { id: USER_ID };
    const { createRun, duplicateAsSolo, readRunIndex } = await loadStore();
    const { state } = await createRun({
      name: 'Source Solo',
      region: 'kanto',
      game: 'firered',
      players: [{ name: 'ME', color: '#FFD60A' }],
      rules: { ...DEFAULT_RULES },
      online: false,
    });
    const before = readRunIndex().length;
    mockUser = null;
    expect(await duplicateAsSolo(state.run.id)).toBeNull();
    expect(readRunIndex()).toHaveLength(before);
  });

  it('duplicateAsSolo with account creates a solo copy', async () => {
    mockUser = { id: USER_ID };
    const { createRun, duplicateAsSolo, loadLocalRun, readRunIndex } = await loadStore();
    const { state } = await createRun({
      name: 'Source Solo',
      region: 'kanto',
      game: 'firered',
      players: [{ name: 'ME', color: '#FFD60A' }],
      rules: { ...DEFAULT_RULES },
      online: false,
    });
    const before = readRunIndex().length;
    const copyId = await duplicateAsSolo(state.run.id);
    expect(copyId).toBeTruthy();
    expect(readRunIndex()).toHaveLength(before + 1);
    const copy = loadLocalRun(copyId!);
    expect(copy?.mode).toBe('solo');
    expect(copy?.run.name).toContain('COPY');
  });
});
