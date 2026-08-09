/* Solo runs for logged-in users live in nuz_runs (not nuz_solo_runs blob). */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_RULES } from './nuzlocke-store';
import type { RunState } from './nuzlocke-store';

const USER_ID = 'user-solo-cloud';
const SOLO_RUN = 'run-solo-logged-in';
const GUEST_RUN = 'run-solo-guest';

let mockUser: { id: string; is_anonymous?: boolean } | null = null;

const runsUpserts: unknown[] = [];
const membersUpserts: unknown[] = [];
const playersUpserts: unknown[] = [];
const soloBlobUpserts: unknown[] = [];
let soloBlobRows: Array<{ id: string; payload: RunState; updated_at: string }> = [];

type TableChain = {
  insert: ReturnType<typeof vi.fn>;
  upsert: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
  select: ReturnType<typeof vi.fn>;
};

const tableChains = new Map<string, TableChain>();

function chainFor(table: string): TableChain {
  let chain = tableChains.get(table);
  if (!chain) {
    chain = {
      insert: vi.fn(() => Promise.resolve({ error: null })),
      upsert: vi.fn(() => Promise.resolve({ error: null })),
      update: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null })),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null })),
      })),
      select: vi.fn(() => ({
        eq: vi.fn((_col: string, val: string) => ({
          maybeSingle: () =>
            Promise.resolve({
              data: table === 'nuz_runs' ? { id: val, invite_code: null } : null,
              error: null,
            }),
          order: () => Promise.resolve({ data: [], error: null }),
        })),
      })),
    };
    tableChains.set(table, chain);
  }
  return chain;
}

const ANON_ID = 'anon-guest-session';

const { fromMock, getSessionMock } = vi.hoisted(() => ({
  fromMock: vi.fn((table: string) => chainFor(table)),
  getSessionMock: vi.fn(() =>
    Promise.resolve({
      data: { session: { user: { id: ANON_ID, is_anonymous: true } } },
    }),
  ),
}));

vi.mock('./nuzlocke-linked-teams', () => ({
  ensureLinkedTeams: vi.fn(),
  syncLinkedTeamsForRun: vi.fn().mockResolvedValue(undefined),
  repairAllLinkedTeams: vi.fn().mockResolvedValue(undefined),
  deleteLinkedTeamsForRun: vi.fn(),
  cloneLinkedTeamsForDuplicate: vi.fn(),
}));

vi.mock('./auth', () => ({
  getAuthUser: () => mockUser,
  isAuthReady: () => true,
  useAuth: () => ({ ready: true, user: mockUser, profile: null }),
  ensureRunIdentity: vi.fn().mockResolvedValue(undefined),
  onAuthChange: vi.fn(() => () => undefined),
}));

vi.mock('./supabase', async () => {
  const actual = await vi.importActual<typeof import('./supabase')>('./supabase');
  return {
    ...actual,
    isMultiCapable: () => true,
    dropChannel: vi.fn(),
    supabase: {
      from: fromMock,
      auth: { getSession: getSessionMock },
      channel: vi.fn(() => ({
        on: vi.fn().mockReturnThis(),
        subscribe: vi.fn(),
      })),
      removeChannel: vi.fn(),
      rpc: vi.fn(),
    },
    nuzTables: {
      runs: () => fromMock('nuz_runs'),
      players: () => fromMock('nuz_players'),
      encounters: () => fromMock('nuz_encounters'),
    },
  };
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
      setItem: (k: string, v: string) => map.set(String(k), String(v)),
      removeItem: (k: string) => map.delete(k),
      key: (i: number) => [...map.keys()][i] ?? null,
    },
  });
}

function wireTableSideEffects(): void {
  chainFor('nuz_runs').insert.mockImplementation((row: unknown) => {
    runsUpserts.push(row);
    return Promise.resolve({ error: null });
  });
  chainFor('nuz_runs').upsert.mockImplementation((row: unknown) => {
    runsUpserts.push(row);
    return Promise.resolve({ error: null });
  });
  chainFor('nuz_run_members').upsert.mockImplementation((row: unknown) => {
    membersUpserts.push(row);
    return Promise.resolve({ error: null });
  });
  chainFor('nuz_players').insert.mockImplementation((row: unknown) => {
    playersUpserts.push(row);
    return Promise.resolve({ error: null });
  });
  chainFor('nuz_players').upsert.mockImplementation((row: unknown) => {
    playersUpserts.push(row);
    return Promise.resolve({ error: null });
  });
  chainFor('nuz_encounters').upsert.mockImplementation(() => {
    return Promise.resolve({ error: null });
  });
  chainFor('nuz_solo_runs').upsert.mockImplementation((row: unknown) => {
    soloBlobUpserts.push(row);
    return Promise.resolve({ error: null });
  });
  chainFor('nuz_solo_runs').select.mockImplementation(() => ({
    eq: vi.fn((_col: string, userId: string) =>
      Promise.resolve({
        data: soloBlobRows.filter(() => userId === USER_ID),
        error: null,
      }),
    ),
  }));
}

describe('solo cloud persistence', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.resetModules();
    installMemoryLocalStorage();
    mockUser = null;
    runsUpserts.length = 0;
    membersUpserts.length = 0;
    playersUpserts.length = 0;
    soloBlobUpserts.length = 0;
    soloBlobRows = [];
    tableChains.clear();
    fromMock.mockClear();
    getSessionMock.mockClear();
    getSessionMock.mockImplementation(() =>
      Promise.resolve({
        data: { session: { user: { id: ANON_ID, is_anonymous: true } } },
      }),
    );
    wireTableSideEffects();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  async function loadStore() {
    return import('./nuzlocke-store');
  }

  async function loadCloudSync() {
    return import('./cloud-sync');
  }

  it('createRun (solo, logged in) writes nuz_runs and leaves the owner membership to the DB trigger', async () => {
    mockUser = { id: USER_ID };
    const { createRun } = await loadStore();

    const { state } = await createRun({
      name: 'Account Solo',
      region: 'kanto',
      game: 'firered',
      players: [{ name: 'ME', color: '#FFD60A' }],
      rules: { ...DEFAULT_RULES },
      online: false,
    });

    expect(state.mode).toBe('solo');
    expect(state.run.invite_code).toBeNull();
    expect(fromMock).toHaveBeenCalledWith('nuz_runs');
    expect(runsUpserts).toHaveLength(1);
    expect(runsUpserts[0]).toMatchObject({
      id: state.run.id,
      invite_code: null,
      name: 'Account Solo',
    });
    /* role='owner' is rejected by RLS for REST clients (migration 10) — the
     * nuz_runs_grant_owner trigger writes that row instead */
    expect(membersUpserts).not.toContainEqual(
      expect.objectContaining({ run_id: state.run.id, role: 'owner' }),
    );
    expect(fromMock).not.toHaveBeenCalledWith('nuz_solo_runs');
  });

  it('saveLocalRun on existing solo run uses row update via renameRun when cloud-backed', async () => {
    mockUser = { id: USER_ID };
    await loadCloudSync();
    const { createRun, getRunState, renameRun } = await loadStore();

    const { state } = await createRun({
      name: 'Debounced Solo',
      region: 'kanto',
      game: 'firered',
      players: [{ name: 'ME', color: '#FFD60A' }],
      rules: { ...DEFAULT_RULES },
      online: false,
    });
    runsUpserts.length = 0;
    membersUpserts.length = 0;
    fromMock.mockClear();

    renameRun(state.run.id, 'Renamed Solo');
    await vi.waitFor(() =>
      expect(
        fromMock.mock.calls.some(
          (c) => c[0] === 'nuz_runs' && chainFor('nuz_runs').update.mock.calls.length > 0,
        ),
      ).toBe(true),
    );

    expect(getRunState(state.run.id)?.run.name).toBe('Renamed Solo');
    expect(fromMock).not.toHaveBeenCalledWith('nuz_solo_runs');
    /* no debounced full-state blob upsert for account-managed solos */
    await vi.advanceTimersByTimeAsync(1000);
    expect(runsUpserts).toHaveLength(0);
  });

  it('guest createRun writes nuz_solo_runs and NOT nuz_runs', async () => {
    vi.useRealTimers();
    mockUser = null;
    await loadCloudSync();
    const { createRun } = await loadStore();

    const { state } = await createRun({
      name: 'Guest Solo',
      region: 'kanto',
      game: 'firered',
      players: [{ name: 'ME', color: '#FFD60A' }],
      rules: { ...DEFAULT_RULES },
      online: false,
    });

    expect(fromMock).not.toHaveBeenCalledWith('nuz_runs');
    expect(fromMock).not.toHaveBeenCalledWith('nuz_run_members');

    await new Promise((r) => setTimeout(r, 950));

    expect(fromMock).not.toHaveBeenCalledWith('nuz_runs');
    expect(fromMock).toHaveBeenCalledWith('nuz_solo_runs');
    const blobForRun = soloBlobUpserts.filter((r) => (r as { id?: string }).id === state.run.id);
    expect(blobForRun.length).toBeGreaterThanOrEqual(1);
    expect(blobForRun[blobForRun.length - 1]).toMatchObject({ id: state.run.id, user_id: ANON_ID });
    expect(state.mode).toBe('solo');
  });

  it('hydrateSoloRuns returns [] for logged-in users', async () => {
    mockUser = { id: USER_ID };
    soloBlobRows = [
      {
        id: SOLO_RUN,
        payload: {
          run: {
            id: SOLO_RUN,
            invite_code: null,
            name: 'Blob Run',
            game: 'firered',
            region: 'kanto',
            rules: { ...DEFAULT_RULES },
            status: 'active',
            created_at: '2026-01-01T00:00:00.000Z',
          },
          mode: 'solo',
          players: [],
          encounters: [],
        },
        updated_at: '2026-01-01T00:00:00.000Z',
      },
    ];

    const { hydrateSoloRuns } = await loadCloudSync();
    const pending = await hydrateSoloRuns({ id: USER_ID } as never);

    expect(pending).toEqual([]);
    expect(fromMock).not.toHaveBeenCalledWith('nuz_solo_runs');
  });

  it('hydrateSoloRuns still hydrates for guests (no logged-in user)', async () => {
    mockUser = null;
    const payload: RunState = {
      run: {
        id: GUEST_RUN,
        invite_code: null,
        name: 'Guest Blob',
        game: 'firered',
        region: 'kanto',
        rules: { ...DEFAULT_RULES },
        status: 'active',
        created_at: '2026-01-01T00:00:00.000Z',
      },
      mode: 'solo',
      players: [
        {
          id: 'player-guest',
          run_id: GUEST_RUN,
          name: 'ME',
          color: '#FFD60A',
          slot: 0,
          created_at: '2026-01-01T00:00:00.000Z',
        },
      ],
      encounters: [],
    };
    soloBlobRows = [{ id: GUEST_RUN, payload, updated_at: '2026-01-01T00:00:00.000Z' }];

    const { hydrateSoloRuns, loadLocalRun } = await loadCloudSync().then(async (m) => ({
      hydrateSoloRuns: m.hydrateSoloRuns,
      loadLocalRun: (await import('./nuzlocke-store')).loadLocalRun,
    }));

    const pending = await hydrateSoloRuns({ id: USER_ID } as never);

    expect(fromMock).toHaveBeenCalledWith('nuz_solo_runs');
    expect(loadLocalRun(GUEST_RUN)).not.toBeNull();
    expect(pending).toEqual([]);
  });
});
