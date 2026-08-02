/* Account-level run discovery: nuz_run_members → hub + live membership sync. */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { RealtimeChannel } from '@supabase/supabase-js';
import type { NuzPlayerRow, NuzRunRow } from './supabase';
import { DEFAULT_RULES } from './nuzlocke-store';

const USER_ID = 'user-test-1';
const RUN_A = 'run-account-a';
const RUN_B = 'run-account-b';

let mockUser: { id: string } | null = null;

const runsById = new Map<string, NuzRunRow>();
const membersByUser = new Map<string, string[]>();
const playersByRun = new Map<string, NuzPlayerRow[]>();

type PgHandler = (payload: {
  eventType: string;
  new?: unknown;
  old?: Partial<{ id: string; run_id: string; user_id: string }>;
}) => void;
const pgHandlers: Array<{ table: string; filter?: string; handler: PgHandler }> = [];

const mockChannel = {
  on: vi.fn(function (
    this: typeof mockChannel,
    _type: string,
    opts: { event?: string; schema?: string; table?: string; filter?: string },
    handler: PgHandler,
  ) {
    pgHandlers.push({ table: opts.table ?? '', filter: opts.filter, handler });
    return this;
  }),
  subscribe: vi.fn(function (this: typeof mockChannel, cb?: (status: string) => void) {
    cb?.('SUBSCRIBED');
    return this;
  }),
};

function chainEq(table: string, col: string, val: string) {
  if (table === 'nuz_run_members' && col === 'user_id') {
    const ids = membersByUser.get(val) ?? [];
    return Promise.resolve({
      data: ids.map((run_id) => ({ run_id, nuz_runs: runsById.get(run_id) ?? null })),
      error: null,
    });
  }
  if (table === 'nuz_runs' && col === 'id') {
    return {
      maybeSingle: () => Promise.resolve({ data: runsById.get(val) ?? null, error: null }),
    };
  }
  if (table === 'nuz_players' && col === 'run_id') {
    return {
      order: () => Promise.resolve({ data: playersByRun.get(val) ?? [], error: null }),
    };
  }
  if (table === 'nuz_encounters' && col === 'run_id') {
    return {
      order: () => Promise.resolve({ data: [], error: null }),
    };
  }
  return Promise.resolve({ data: null, error: null });
}

vi.mock('./auth', () => ({
  getAuthUser: () => mockUser,
  ensureRunIdentity: vi.fn().mockResolvedValue(undefined),
  onAuthChange: vi.fn(() => () => undefined),
}));

vi.mock('./supabase', async () => {
  const actual = await vi.importActual<typeof import('./supabase')>('./supabase');
  const from = vi.fn((table: string) => ({
    select: vi.fn(() => ({
      eq: vi.fn((col: string, val: string) => chainEq(table, col, val)),
    })),
  }));
  return {
    ...actual,
    isMultiCapable: () => true,
    supabase: {
      from,
      channel: vi.fn(() => mockChannel as unknown as RealtimeChannel),
      removeChannel: vi.fn(),
    },
    nuzTables: {
      runs: () => from('nuz_runs'),
      players: () => from('nuz_players'),
      encounters: () => from('nuz_encounters'),
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

function seedRun(id: string, name: string): void {
  runsById.set(id, {
    id,
    invite_code: 'SOUL-TEST1234',
    name,
    game: 'firered',
    region: 'kanto',
    rules: { ...DEFAULT_RULES },
    status: 'active',
    created_at: '2026-01-01T00:00:00.000Z',
  });
  playersByRun.set(id, [
    {
      id: `player-${id}`,
      run_id: id,
      name: 'HOST',
      color: '#FFD60A',
      slot: 0,
      created_at: '2026-01-01T00:00:00.000Z',
    },
  ]);
}

function memberHandlers(): PgHandler[] {
  return pgHandlers.filter((h) => h.table === 'nuz_run_members').map((h) => h.handler);
}

function runHandlers(): PgHandler[] {
  return pgHandlers.filter((h) => h.table === 'nuz_runs').map((h) => h.handler);
}

describe('account run discovery', () => {
  beforeEach(async () => {
    vi.resetModules();
    installMemoryLocalStorage();
    mockUser = null;
    runsById.clear();
    membersByUser.clear();
    playersByRun.clear();
    pgHandlers.length = 0;
    mockChannel.on.mockClear();
    mockChannel.subscribe.mockClear();
  });

  async function loadStore() {
    return import('./nuzlocke-store');
  }

  it('logged-in user: hub lists runs from nuz_run_members even if not in localStorage', async () => {
    mockUser = { id: USER_ID };
    seedRun(RUN_A, 'Remote Run');
    membersByUser.set(USER_ID, [RUN_A]);

    const { syncAccountRuns, getHubRunIds, getRunState, readRunIndex } = await loadStore();
    await syncAccountRuns(USER_ID);

    expect(readRunIndex()).toContain(RUN_A);
    expect(getHubRunIds()).toContain(RUN_A);
    expect(getRunState(RUN_A)?.run.name).toBe('Remote Run');
  });

  it('realtime INSERT on nuz_run_members adds run to hub', async () => {
    mockUser = { id: USER_ID };
    seedRun(RUN_B, 'Joined Run');
    membersByUser.set(USER_ID, []);

    const { syncAccountRuns, watchAccountRuns, getHubRunIds } = await loadStore();
    await syncAccountRuns(USER_ID);
    watchAccountRuns(USER_ID);
    expect(getHubRunIds()).not.toContain(RUN_B);

    membersByUser.set(USER_ID, [RUN_B]);
    for (const handler of memberHandlers()) {
      handler({ eventType: 'INSERT', new: { run_id: RUN_B, user_id: USER_ID } });
    }
    await vi.waitFor(() => expect(getHubRunIds()).toContain(RUN_B));
  });

  it('realtime DELETE on nuz_run_members removes run from hub', async () => {
    mockUser = { id: USER_ID };
    seedRun(RUN_A, 'Leaving Run');
    membersByUser.set(USER_ID, [RUN_A]);

    const { syncAccountRuns, watchAccountRuns, getHubRunIds } = await loadStore();
    await syncAccountRuns(USER_ID);
    watchAccountRuns(USER_ID);
    expect(getHubRunIds()).toContain(RUN_A);

    membersByUser.set(USER_ID, []);
    for (const handler of memberHandlers()) {
      handler({ eventType: 'DELETE', old: { run_id: RUN_A, user_id: USER_ID } });
    }
    await vi.waitFor(() => expect(getHubRunIds()).not.toContain(RUN_A));
  });

  it('realtime UPDATE on nuz_runs (name/status/rules) refreshes run in hub', async () => {
    mockUser = { id: USER_ID };
    seedRun(RUN_A, 'Old Name');
    membersByUser.set(USER_ID, [RUN_A]);

    const { syncAccountRuns, watchAccountRuns, getRunState } = await loadStore();
    await syncAccountRuns(USER_ID);
    watchAccountRuns(USER_ID);
    expect(getRunState(RUN_A)?.run.name).toBe('Old Name');

    runsById.set(RUN_A, { ...runsById.get(RUN_A)!, name: 'New Name', status: 'complete' });
    for (const handler of runHandlers()) {
      handler({ eventType: 'UPDATE', new: runsById.get(RUN_A) });
    }
    await vi.waitFor(() => expect(getRunState(RUN_A)?.run.name).toBe('New Name'));
    expect(getRunState(RUN_A)?.run.status).toBe('complete');
  });

  it('guest: no account sync, localStorage only', async () => {
    mockUser = null;
    seedRun(RUN_A, 'Local Only');
    membersByUser.set(USER_ID, [RUN_A]);

    const { syncAccountRuns, watchAccountRuns, getHubRunIds, createRun } = await loadStore();
    await syncAccountRuns(USER_ID);
    watchAccountRuns(USER_ID);

    const { state } = await createRun({
      name: 'Solo Local',
      region: 'kanto',
      game: 'firered',
      players: [{ name: 'ME', color: '#FFD60A' }],
      rules: { ...DEFAULT_RULES },
      online: false,
    });

    expect(getHubRunIds()).toEqual([state.run.id]);
    expect(getHubRunIds()).not.toContain(RUN_A);
    expect(pgHandlers).toHaveLength(0);
  });
});
