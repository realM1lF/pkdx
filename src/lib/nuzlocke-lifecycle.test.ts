/* Run lifecycle: server delete, archive sync, guest vs account paths. */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { RealtimeChannel } from '@supabase/supabase-js';
import type { NuzPlayerRow, NuzRunRow } from './supabase';
import { DEFAULT_RULES } from './nuzlocke-store';

const OWNER_ID = 'user-owner';
const MEMBER_ID = 'user-member';
const ANON_ID = 'anon-guest';

const RUN_SOLO = 'run-cloud-solo';
const RUN_MULTI = 'run-cloud-multi';

let mockUser: { id: string } | null = null;

const runsById = new Map<string, NuzRunRow>();
const membersByUser = new Map<string, Array<{ run_id: string; role: string; archived?: boolean }>>();
const playersByRun = new Map<string, NuzPlayerRow[]>();

const runsDeleted = new Set<string>();
const memberRowsDeleted: Array<{ run_id: string; user_id: string }> = [];
const soloRunsDeleted: string[] = [];
const memberArchivedUpdates: Array<{ run_id: string; user_id: string; archived: boolean }> = [];

type PgHandler = (payload: {
  eventType: string;
  new?: unknown;
  old?: Partial<{ id: string; run_id: string; user_id: string }>;
}) => void;
const pgHandlers: Array<{ table: string; filter?: string; handler: PgHandler }> = [];

const { fromMock, getSessionMock, removeChannelMock, channelMock, dropChannelMock } = vi.hoisted(() => ({
  fromMock: vi.fn(),
  getSessionMock: vi.fn(() =>
    Promise.resolve({
      data: { session: { user: { id: ANON_ID, is_anonymous: true } } },
    }),
  ),
  removeChannelMock: vi.fn(),
  channelMock: vi.fn(),
  dropChannelMock: vi.fn(),
}));

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

function membersForUser(userId: string) {
  return membersByUser.get(userId) ?? [];
}

function chainEq(table: string, col: string, val: string) {
  if (table === 'nuz_run_members' && col === 'user_id') {
    const rows = membersForUser(val).map((m) => ({
      run_id: m.run_id,
      archived: m.archived ?? false,
      nuz_runs: runsById.get(m.run_id) ?? null,
    }));
    return Promise.resolve({ data: rows, error: null });
  }
  if (table === 'nuz_run_members' && col === 'run_id') {
    return {
      eq: vi.fn((_col2: string, userId: string) => ({
        maybeSingle: () => {
          const row = membersForUser(userId).find((m) => m.run_id === val);
          return Promise.resolve({
            data: row ? { role: row.role, archived: row.archived ?? false } : null,
            error: null,
          });
        },
      })),
    };
  }
  if (table === 'nuz_runs' && col === 'id') {
    return {
      maybeSingle: () =>
        Promise.resolve({
          data: runsDeleted.has(val) ? null : (runsById.get(val) ?? null),
          error: null,
        }),
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

function makeTableChain(table: string) {
  return {
    select: vi.fn(() => ({
      eq: vi.fn((col: string, val: string) => chainEq(table, col, val)),
    })),
    insert: vi.fn(() => Promise.resolve({ error: null })),
    upsert: vi.fn(() => Promise.resolve({ error: null })),
    update: vi.fn((patch: { archived?: boolean }) => ({
      eq: vi.fn((col: string, val: string) => {
        if (table === 'nuz_run_members' && col === 'run_id') {
          const runId = val;
          return {
            eq: vi.fn((col2: string, userId: string) => {
              if (col2 === 'user_id' && patch.archived !== undefined) {
                memberArchivedUpdates.push({ run_id: runId, user_id: userId, archived: patch.archived });
                const list = membersByUser.get(userId);
                if (list) {
                  const row = list.find((m) => m.run_id === runId);
                  if (row) row.archived = patch.archived;
                }
              }
              return Promise.resolve({ error: null });
            }),
          };
        }
        return Promise.resolve({ error: null });
      }),
    })),
    delete: vi.fn(() => ({
      eq: vi.fn((col: string, val: string) => {
        if (table === 'nuz_runs' && col === 'id') {
          runsDeleted.add(val);
          runsById.delete(val);
          return Promise.resolve({ error: null });
        }
        if (table === 'nuz_run_members' && col === 'run_id') {
          return {
            eq: vi.fn((col2: string, userId: string) => {
              if (col2 === 'user_id') {
                memberRowsDeleted.push({ run_id: val, user_id: userId });
                const list = membersByUser.get(userId);
                if (list) {
                  membersByUser.set(
                    userId,
                    list.filter((m) => m.run_id !== val),
                  );
                }
              }
              return Promise.resolve({ error: null });
            }),
          };
        }
        if (table === 'nuz_solo_runs' && col === 'id') {
          soloRunsDeleted.push(val);
          return {
            eq: vi.fn(() => Promise.resolve({ error: null })),
          };
        }
        return Promise.resolve({ error: null });
      }),
    })),
  };
}

fromMock.mockImplementation((table: string) => makeTableChain(table));

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
  channelMock.mockImplementation(() => mockChannel as unknown as RealtimeChannel);
  return {
    ...actual,
    isMultiCapable: () => true,
    dropChannel: dropChannelMock,
    supabase: {
      from: fromMock,
      auth: { getSession: getSessionMock },
      channel: channelMock,
      removeChannel: removeChannelMock,
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

function seedCloudRun(
  id: string,
  opts: { invite: string | null; ownerId: string; memberIds?: string[] },
): void {
  runsById.set(id, {
    id,
    invite_code: opts.invite,
    name: `Run ${id}`,
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
  membersByUser.set(opts.ownerId, [{ run_id: id, role: 'owner', archived: false }]);
  for (const mid of opts.memberIds ?? []) {
    const list = membersByUser.get(mid) ?? [];
    list.push({ run_id: id, role: 'member', archived: false });
    membersByUser.set(mid, list);
  }
}

function seedLocalRun(
  id: string,
  mode: 'solo' | 'multi',
  opts?: { owner?: boolean; playerId?: string },
): void {
  const state = {
    run: runsById.get(id) ?? {
      id,
      invite_code: mode === 'multi' ? 'SOUL-TEST1234' : null,
      name: `Run ${id}`,
      game: 'firered',
      region: 'kanto',
      rules: { ...DEFAULT_RULES },
      status: 'active',
      created_at: '2026-01-01T00:00:00.000Z',
    },
    mode,
    players: playersByRun.get(id) ?? [],
    encounters: [],
  };
  localStorage.setItem(`pdx2.nuz.run.${id}`, JSON.stringify(state));
  localStorage.setItem('pdx2.nuz.runs', JSON.stringify([id]));
  if (opts?.owner) {
    localStorage.setItem('pdx2.nuz.owners', JSON.stringify([id]));
  }
  if (opts?.playerId) {
    localStorage.setItem('pdx2.nuz.memberships', JSON.stringify({ [id]: opts.playerId }));
  }
}

describe('nuzlocke run lifecycle', () => {
  beforeEach(() => {
    vi.resetModules();
    installMemoryLocalStorage();
    mockUser = null;
    runsById.clear();
    membersByUser.clear();
    playersByRun.clear();
    runsDeleted.clear();
    memberRowsDeleted.length = 0;
    soloRunsDeleted.length = 0;
    memberArchivedUpdates.length = 0;
    pgHandlers.length = 0;
    mockChannel.on.mockClear();
    mockChannel.subscribe.mockClear();
    fromMock.mockClear();
    fromMock.mockImplementation((table: string) => makeTableChain(table));
    getSessionMock.mockClear();
    getSessionMock.mockImplementation(() =>
      Promise.resolve({
        data: { session: { user: { id: ANON_ID, is_anonymous: true } } },
      }),
    );
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  async function loadStore() {
    return import('./nuzlocke-store');
  }

  async function flushAsync(): Promise<void> {
    await Promise.resolve();
    await Promise.resolve();
  }

  it('owner deleteRunForever on cloud solo run deletes nuz_runs and cleans local mirror', async () => {
    mockUser = { id: OWNER_ID };
    seedCloudRun(RUN_SOLO, { invite: null, ownerId: OWNER_ID });
    seedLocalRun(RUN_SOLO, 'solo', { owner: true, playerId: `player-${RUN_SOLO}` });
    localStorage.setItem('pdx2.nuz.accountRuns', JSON.stringify([RUN_SOLO]));

    const { deleteRunForever, loadLocalRun, getHubRunIds } = await loadStore();
    deleteRunForever(RUN_SOLO);
    await flushAsync();

    expect(runsDeleted.has(RUN_SOLO)).toBe(true);
    expect(memberRowsDeleted).toEqual([]);
    expect(loadLocalRun(RUN_SOLO)).toBeNull();
    expect(getHubRunIds()).not.toContain(RUN_SOLO);
    expect(localStorage.getItem(`pdx2.nuz.run.${RUN_SOLO}`)).toBeNull();
  });

  it('owner deleteRunForever on cloud multi run deletes nuz_runs row', async () => {
    mockUser = { id: OWNER_ID };
    seedCloudRun(RUN_MULTI, { invite: 'SOUL-ABCD1234', ownerId: OWNER_ID, memberIds: [MEMBER_ID] });
    seedLocalRun(RUN_MULTI, 'multi', { owner: true, playerId: `player-${RUN_MULTI}` });
    localStorage.setItem('pdx2.nuz.accountRuns', JSON.stringify([RUN_MULTI]));

    const { deleteRunForever } = await loadStore();
    deleteRunForever(RUN_MULTI);
    await flushAsync();

    expect(runsDeleted.has(RUN_MULTI)).toBe(true);
    expect(runsById.has(RUN_MULTI)).toBe(false);
  });

  it('non-owner member deleteRunForever removes only own membership; nuz_runs survives', async () => {
    mockUser = { id: MEMBER_ID };
    seedCloudRun(RUN_MULTI, { invite: 'SOUL-ABCD1234', ownerId: OWNER_ID, memberIds: [MEMBER_ID] });
    seedLocalRun(RUN_MULTI, 'multi', { playerId: 'player-member' });
    localStorage.setItem('pdx2.nuz.accountRuns', JSON.stringify([RUN_MULTI]));

    const { deleteRunForever, loadLocalRun, getHubRunIds } = await loadStore();
    deleteRunForever(RUN_MULTI);
    await flushAsync();

    expect(runsDeleted.has(RUN_MULTI)).toBe(false);
    expect(runsById.has(RUN_MULTI)).toBe(true);
    expect(memberRowsDeleted).toEqual([{ run_id: RUN_MULTI, user_id: MEMBER_ID }]);
    expect(membersForUser(MEMBER_ID).some((m) => m.run_id === RUN_MULTI)).toBe(false);
    expect(loadLocalRun(RUN_MULTI)).toBeNull();
    expect(getHubRunIds()).not.toContain(RUN_MULTI);
  });

  it('archiveRun on cloud run sets archived=true on caller nuz_run_members row', async () => {
    mockUser = { id: OWNER_ID };
    seedCloudRun(RUN_SOLO, { invite: null, ownerId: OWNER_ID });
    seedLocalRun(RUN_SOLO, 'solo', { owner: true, playerId: `player-${RUN_SOLO}` });
    localStorage.setItem('pdx2.nuz.accountRuns', JSON.stringify([RUN_SOLO]));

    const { archiveRun, isRunArchived, getHubRunIds } = await loadStore();
    archiveRun(RUN_SOLO);
    await flushAsync();

    expect(memberArchivedUpdates).toEqual([{ run_id: RUN_SOLO, user_id: OWNER_ID, archived: true }]);
    expect(isRunArchived(RUN_SOLO)).toBe(true);
    expect(getHubRunIds()).not.toContain(RUN_SOLO);
  });

  it('restoreRun sets archived=false on nuz_run_members', async () => {
    mockUser = { id: OWNER_ID };
    seedCloudRun(RUN_SOLO, { invite: null, ownerId: OWNER_ID });
    seedLocalRun(RUN_SOLO, 'solo', { owner: true, playerId: `player-${RUN_SOLO}` });
    localStorage.setItem('pdx2.nuz.accountRuns', JSON.stringify([RUN_SOLO]));
    localStorage.setItem('pdx2.nuz.archived', JSON.stringify([RUN_SOLO]));

    const { restoreRun, isRunArchived, getHubRunIds } = await loadStore();
    restoreRun(RUN_SOLO);
    await flushAsync();

    expect(memberArchivedUpdates).toEqual([{ run_id: RUN_SOLO, user_id: OWNER_ID, archived: false }]);
    expect(isRunArchived(RUN_SOLO)).toBe(false);
    expect(getHubRunIds()).toContain(RUN_SOLO);
  });

  it('after deleteRunForever tombstone prevents reconcile from resurrecting stale LS_RUN', async () => {
    mockUser = { id: OWNER_ID };
    seedCloudRun(RUN_SOLO, { invite: null, ownerId: OWNER_ID });
    seedLocalRun(RUN_SOLO, 'solo', { owner: true, playerId: `player-${RUN_SOLO}` });
    localStorage.setItem('pdx2.nuz.accountRuns', JSON.stringify([RUN_SOLO]));

    const store = await loadStore();
    store.deleteRunForever(RUN_SOLO);
    await flushAsync();

    localStorage.setItem(`pdx2.nuz.run.${RUN_SOLO}`, JSON.stringify({ run: { id: RUN_SOLO }, mode: 'solo', players: [], encounters: [] }));
    localStorage.setItem('pdx2.nuz.runs', JSON.stringify([]));
    membersByUser.set(OWNER_ID, [{ run_id: RUN_SOLO, role: 'owner', archived: false }]);
    await store.syncAccountRuns(OWNER_ID);

    expect(store.getHubRunIds()).not.toContain(RUN_SOLO);
    expect(JSON.parse(localStorage.getItem('pdx2.nuz.accountPurged') ?? '[]')).toContain(RUN_SOLO);
  });

  it('guest deleteRunForever deletes nuz_solo_runs and does not touch nuz_runs', async () => {
    mockUser = null;
    await import('./cloud-sync');
    const { deleteRunForever, loadLocalRun } = await loadStore();

    const guestId = 'run-guest-delete';
    const local = {
      run: {
        id: guestId,
        invite_code: null,
        name: 'Guest Solo',
        game: 'firered',
        region: 'kanto',
        rules: { ...DEFAULT_RULES },
        status: 'active' as const,
        created_at: '2026-01-01T00:00:00.000Z',
      },
      mode: 'solo' as const,
      players: [
        {
          id: 'player-guest',
          run_id: guestId,
          name: 'ME',
          color: '#FFD60A',
          slot: 0,
          created_at: '2026-01-01T00:00:00.000Z',
        },
      ],
      encounters: [],
    };
    localStorage.setItem(`pdx2.nuz.run.${guestId}`, JSON.stringify(local));
    localStorage.setItem('pdx2.nuz.runs', JSON.stringify([guestId]));

    deleteRunForever(guestId);
    await vi.waitFor(() => expect(soloRunsDeleted.length).toBeGreaterThan(0));

    expect(soloRunsDeleted).toContain(guestId);
    expect(runsDeleted.has(guestId)).toBe(false);
    expect(fromMock).not.toHaveBeenCalledWith('nuz_runs');
    expect(loadLocalRun(guestId)).toBeNull();
  });

  it('syncAccountRuns puts server-archived runs in archived bucket not active hub', async () => {
    mockUser = { id: OWNER_ID };
    seedCloudRun(RUN_SOLO, { invite: null, ownerId: OWNER_ID });
    membersByUser.set(OWNER_ID, [{ run_id: RUN_SOLO, role: 'owner', archived: true }]);
    seedLocalRun(RUN_SOLO, 'solo', { owner: true, playerId: `player-${RUN_SOLO}` });

    const { syncAccountRuns, getHubRunIds, isRunArchived } = await loadStore();
    await syncAccountRuns(OWNER_ID);

    expect(getHubRunIds()).not.toContain(RUN_SOLO);
    expect(isRunArchived(RUN_SOLO)).toBe(true);
    expect(JSON.parse(localStorage.getItem('pdx2.nuz.archived') ?? '[]')).toContain(RUN_SOLO);
  });
});
