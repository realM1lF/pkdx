/* Account-level run discovery: nuz_run_members → hub + live membership sync. */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { RealtimeChannel } from '@supabase/supabase-js';
import type { NuzPlayerRow, NuzRunRow } from './supabase';
import { DEFAULT_RULES } from './nuzlocke-store';

const USER_ID = 'user-test-1';
const RUN_A = 'run-account-a';
const RUN_B = 'run-account-b';
const RUN_GUEST = 'run-guest-local';

let mockUser: { id: string } | null = null;
let membersFetchDelayMs = 0;
let membersFetchInFlight = 0;
let membersFetchCompleted = 0;

const runsById = new Map<string, NuzRunRow>();
const membersByUser = new Map<string, string[]>();
/** `${userId}:${runId}` → role; defaults to owner when unset */
const memberRoles = new Map<string, 'owner' | 'member'>();
const playersByRun = new Map<string, NuzPlayerRow[]>();

type PgHandler = (payload: {
  eventType: string;
  new?: unknown;
  old?: Partial<{ id: string; run_id: string; user_id: string }>;
}) => void;
const pgHandlers: Array<{ table: string; filter?: string; handler: PgHandler }> = [];

const { fromMock, removeChannelMock, channelMock, dropChannelMock } = vi.hoisted(() => ({
  fromMock: vi.fn((table: string) => ({
    select: vi.fn(() => ({
      eq: vi.fn((col: string, val: string) => chainEq(table, col, val)),
    })),
    delete: vi.fn(() => ({
      eq: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ data: null, error: null })),
      })),
    })),
    update: vi.fn(() => ({
      eq: vi.fn(() => Promise.resolve({ data: null, error: null })),
    })),
  })),
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

function membersListPayload(userId: string) {
  const ids = membersByUser.get(userId) ?? [];
  return ids.map((run_id) => ({
    run_id,
    archived: false,
    role: memberRoles.get(`${userId}:${run_id}`) ?? 'owner',
    nuz_runs: runsById.get(run_id) ?? null,
  }));
}

/** Thenable + chainable — supports account list fetch and role maybeSingle. */
function membersQuery(filters: Record<string, string>) {
  const api = {
    eq(col: string, val: string) {
      return membersQuery({ ...filters, [col]: val });
    },
    maybeSingle() {
      const runId = filters.run_id;
      const userId = filters.user_id;
      if (runId && userId && (membersByUser.get(userId) ?? []).includes(runId)) {
        const role = memberRoles.get(`${userId}:${runId}`) ?? 'owner';
        return Promise.resolve({ data: { role }, error: null });
      }
      return Promise.resolve({ data: null, error: null });
    },
    then(
      onFulfilled?: (value: { data: ReturnType<typeof membersListPayload>; error: null }) => unknown,
      onRejected?: (reason: unknown) => unknown,
    ) {
      const userId = filters.user_id;
      membersFetchInFlight += 1;
      return new Promise<{ data: ReturnType<typeof membersListPayload>; error: null }>((resolve) => {
        const finish = (): void => {
          membersFetchCompleted += 1;
          membersFetchInFlight -= 1;
          resolve({ data: userId ? membersListPayload(userId) : [], error: null });
        };
        if (membersFetchDelayMs <= 0) finish();
        else setTimeout(finish, membersFetchDelayMs);
      }).then(onFulfilled, onRejected);
    },
  };
  return api;
}

function chainEq(table: string, col: string, val: string) {
  if (table === 'nuz_run_members') {
    return membersQuery({ [col]: val });
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
  isAuthReady: () => true,
  useAuth: () => ({ ready: true, user: mockUser, profile: null }),
  ensureRunIdentity: vi.fn().mockResolvedValue(undefined),
  onAuthChange: vi.fn(() => () => undefined),
}));

vi.mock('./nuzlocke-linked-teams', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./nuzlocke-linked-teams')>();
  return {
    ...actual,
    syncLinkedTeamsForRun: vi.fn().mockResolvedValue(undefined),
    ensureLinkedTeams: vi.fn().mockResolvedValue(undefined),
    repairAllLinkedTeams: vi.fn().mockResolvedValue(undefined),
    cloneLinkedTeamsForDuplicate: vi.fn(),
  };
});

vi.mock('./supabase', async () => {
  const actual = await vi.importActual<typeof import('./supabase')>('./supabase');
  channelMock.mockImplementation(() => mockChannel as unknown as RealtimeChannel);
  return {
    ...actual,
    isMultiCapable: () => true,
    dropChannel: dropChannelMock,
    supabase: {
      from: fromMock,
      channel: channelMock,
      removeChannel: removeChannelMock,
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

function memberFetchCount(): number {
  return fromMock.mock.calls.filter((c) => c[0] === 'nuz_run_members').length;
}

/** Mirrors hubRefresh's account-sync step for ghost-run regression coverage. */
async function hubRefreshLike(store: {
  syncAccountRuns: (userId: string) => Promise<void>;
}): Promise<void> {
  const user = mockUser;
  if (user) await store.syncAccountRuns(user.id);
}

describe('account run discovery', () => {
  beforeEach(async () => {
    vi.resetModules();
    installMemoryLocalStorage();
    mockUser = null;
    runsById.clear();
    membersByUser.clear();
    memberRoles.clear();
    playersByRun.clear();
    pgHandlers.length = 0;
    membersFetchDelayMs = 0;
    membersFetchInFlight = 0;
    membersFetchCompleted = 0;
    mockChannel.on.mockClear();
    mockChannel.subscribe.mockClear();
    fromMock.mockClear();
    removeChannelMock.mockClear();
    channelMock.mockClear();
    dropChannelMock.mockClear();
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

  it('fresh device: multi owner hydrate restores myPlayerId + isRunOwner from membership', async () => {
    mockUser = { id: USER_ID };
    seedRun(RUN_A, 'Soul Link Host');
    memberRoles.set(`${USER_ID}:${RUN_A}`, 'owner');
    membersByUser.set(USER_ID, [RUN_A]);
    expect(localStorage.getItem('pdx2.nuz.memberships')).toBeNull();
    expect(localStorage.getItem('pdx2.nuz.owners')).toBeNull();

    const { syncAccountRuns, myPlayerId, isRunOwner, getRunState } = await loadStore();
    await syncAccountRuns(USER_ID);

    expect(getRunState(RUN_A)?.mode).toBe('multi');
    expect(myPlayerId(RUN_A)).toBe(`player-${RUN_A}`);
    expect(isRunOwner(RUN_A)).toBe(true);
  });

  it('fresh device: multi member with one player binds membership but not owner', async () => {
    mockUser = { id: USER_ID };
    seedRun(RUN_A, 'Joined Alone');
    memberRoles.set(`${USER_ID}:${RUN_A}`, 'member');
    membersByUser.set(USER_ID, [RUN_A]);

    const { syncAccountRuns, myPlayerId, isRunOwner } = await loadStore();
    await syncAccountRuns(USER_ID);

    expect(myPlayerId(RUN_A)).toBe(`player-${RUN_A}`);
    expect(isRunOwner(RUN_A)).toBe(false);
  });

  it('fresh device: multi member with multiple players does not guess myPlayerId', async () => {
    mockUser = { id: USER_ID };
    seedRun(RUN_A, 'Full Lobby');
    playersByRun.set(RUN_A, [
      {
        id: 'player-host',
        run_id: RUN_A,
        name: 'HOST',
        color: '#FFD60A',
        slot: 0,
        created_at: '2026-01-01T00:00:00.000Z',
      },
      {
        id: 'player-joiner',
        run_id: RUN_A,
        name: 'P2',
        color: '#45C8FF',
        slot: 1,
        created_at: '2026-01-01T00:00:01.000Z',
      },
    ]);
    memberRoles.set(`${USER_ID}:${RUN_A}`, 'member');
    membersByUser.set(USER_ID, [RUN_A]);

    const { syncAccountRuns, myPlayerId, isRunOwner } = await loadStore();
    await syncAccountRuns(USER_ID);

    expect(myPlayerId(RUN_A)).toBeNull();
    expect(isRunOwner(RUN_A)).toBe(false);
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

  it('realtime UPDATE on nuz_runs for unrelated run does not resync', async () => {
    mockUser = { id: USER_ID };
    seedRun(RUN_A, 'My Run');
    seedRun(RUN_B, 'Other Run');
    membersByUser.set(USER_ID, [RUN_A]);

    const { syncAccountRuns, watchAccountRuns, getHubRunIds } = await loadStore();
    await syncAccountRuns(USER_ID);
    watchAccountRuns(USER_ID);
    const callsBefore = fromMock.mock.calls.filter((c) => c[0] === 'nuz_run_members').length;

    runsById.set(RUN_B, { ...runsById.get(RUN_B)!, name: 'Hacked Name' });
    for (const handler of runHandlers()) {
      handler({ eventType: 'UPDATE', new: runsById.get(RUN_B) });
    }
    await new Promise((r) => setTimeout(r, 50));

    const callsAfter = fromMock.mock.calls.filter((c) => c[0] === 'nuz_run_members').length;
    expect(callsAfter).toBe(callsBefore);
    expect(getHubRunIds()).not.toContain(RUN_B);
  });

  it('guest: no account sync, localStorage only', async () => {
    mockUser = null;
    seedRun(RUN_A, 'Local Only');
    membersByUser.set(USER_ID, [RUN_A]);

    const { syncAccountRuns, watchAccountRuns, getHubRunIds, createRun, NuzLoginRequiredError } =
      await loadStore();
    await syncAccountRuns(USER_ID);
    watchAccountRuns(USER_ID);

    await expect(
      createRun({
        name: 'Solo Local',
        region: 'kanto',
        game: 'firered',
        players: [{ name: 'ME', color: '#FFD60A' }],
        rules: { ...DEFAULT_RULES },
        online: false,
      }),
    ).rejects.toBeInstanceOf(NuzLoginRequiredError);

    const guestId = 'run-solo-local-guest';
    const guest = {
      run: {
        id: guestId,
        invite_code: null,
        name: 'Solo Local',
        game: 'firered',
        region: 'kanto',
        rules: { ...DEFAULT_RULES },
        status: 'active' as const,
        created_at: '2026-01-01T00:00:00.000Z',
      },
      mode: 'solo' as const,
      players: [
        {
          id: 'player-solo-local',
          run_id: guestId,
          name: 'ME',
          color: '#FFD60A',
          slot: 0,
          created_at: '2026-01-01T00:00:00.000Z',
        },
      ],
      encounters: [],
    };
    localStorage.setItem(`pdx2.nuz.run.${guestId}`, JSON.stringify(guest));
    localStorage.setItem('pdx2.nuz.runs', JSON.stringify([guestId, RUN_A]));

    expect(getHubRunIds()).toEqual([guestId]);
    expect(getHubRunIds()).not.toContain(RUN_A);
    expect(pgHandlers).toHaveLength(0);
  });

  it('stopAccountRunsWatch clears accountRunIds and removes the channel', async () => {
    mockUser = { id: USER_ID };
    seedRun(RUN_A, 'Watched Run');
    membersByUser.set(USER_ID, [RUN_A]);

    const { syncAccountRuns, watchAccountRuns, stopAccountRunsWatch, getHubRunIds } = await loadStore();
    await syncAccountRuns(USER_ID);
    watchAccountRuns(USER_ID);
    localStorage.setItem('pdx2.nuz.runs', JSON.stringify([]));
    expect(getHubRunIds()).toContain(RUN_A);

    stopAccountRunsWatch();

    expect(getHubRunIds()).not.toContain(RUN_A);
    expect(dropChannelMock).toHaveBeenCalled();
  });

  it('logged out: hub hides multi + account-synced runs still sitting in localStorage', async () => {
    mockUser = { id: USER_ID };
    seedRun(RUN_A, 'Multi Cached');
    membersByUser.set(USER_ID, [RUN_A]);

    const store = await loadStore();
    await store.syncAccountRuns(USER_ID);
    expect(store.getHubRunIds()).toContain(RUN_A);

    mockUser = null;
    store.stopAccountRunsWatch();

    /* legacy guest solo still on disk (created before the account gate) stays visible */
    const guestId = 'run-guest-solo';
    const guestSolo = {
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
    localStorage.setItem(`pdx2.nuz.run.${guestId}`, JSON.stringify(guestSolo));
    localStorage.setItem('pdx2.nuz.runs', JSON.stringify([guestId, RUN_A]));

    await expect(
      store.createRun({
        name: 'Blocked Guest',
        region: 'kanto',
        game: 'firered',
        players: [{ name: 'ME', color: '#FFD60A' }],
        rules: { ...DEFAULT_RULES },
        online: false,
      }),
    ).rejects.toBeInstanceOf(store.NuzLoginRequiredError);

    expect(store.getHubRunIds()).not.toContain(RUN_A);
    expect(store.getHubRunIds()).toContain(guestId);
    /* multi payload stays on disk for the next login */
    expect(store.loadLocalRun(RUN_A)).not.toBeNull();

    /* guest archive must not make a local solo look account-owned */
    store.archiveRun(guestId);
    expect(store.isDeviceLocalSoloRun(guestSolo)).toBe(true);
    expect(store.getHubRunIds()).not.toContain(guestId);
    /* still listed under archived when logged out */
    const archived = JSON.parse(localStorage.getItem('pdx2.nuz.archived') ?? '[]') as string[];
    expect(archived).toContain(guestId);
  });

  it('watchAccountRuns is idempotent — second call does not create another channel', async () => {
    mockUser = { id: USER_ID };
    membersByUser.set(USER_ID, []);

    const { watchAccountRuns } = await loadStore();

    watchAccountRuns(USER_ID);
    watchAccountRuns(USER_ID);

    expect(channelMock).toHaveBeenCalledTimes(1);
    expect(dropChannelMock).not.toHaveBeenCalled();
  });

  it('lost membership purges local payload — ghost run does not reappear after hub refresh', async () => {
    mockUser = { id: USER_ID };
    seedRun(RUN_A, 'Ghost Run');
    membersByUser.set(USER_ID, [RUN_A]);

    const store = await loadStore();
    await store.syncAccountRuns(USER_ID);
    expect(store.getHubRunIds()).toContain(RUN_A);
    expect(store.loadLocalRun(RUN_A)).not.toBeNull();

    localStorage.setItem(
      'pdx2.teams',
      JSON.stringify([
        {
          id: 'linked-ghost',
          name: 'Ghost NUZ',
          versionGroup: 'firered-leafgreen',
          slots: [{ id: 's0' }, { id: 's1' }, { id: 's2' }, { id: 's3' }, { id: 's4' }, { id: 's5' }],
          updatedAt: 1,
          linkedRunId: RUN_A,
          linkedPlayerId: `player-${RUN_A}`,
        },
      ]),
    );

    membersByUser.set(USER_ID, []);
    localStorage.setItem('pdx2.nuz.runs', JSON.stringify([RUN_A]));
    await hubRefreshLike(store);
    await vi.waitFor(() => {
      const leftover = JSON.parse(localStorage.getItem('pdx2.teams') ?? '[]') as Array<{ linkedRunId?: string }>;
      expect(leftover.some((t) => t.linkedRunId === RUN_A)).toBe(false);
    });

    expect(store.getHubRunIds()).not.toContain(RUN_A);
    expect(store.loadLocalRun(RUN_A)).toBeNull();
    expect(localStorage.getItem(`pdx2.nuz.run.${RUN_A}`)).toBeNull();
  });

  it('lost membership purge does not touch guest-only local runs', async () => {
    mockUser = { id: USER_ID };
    seedRun(RUN_A, 'Account Run');
    membersByUser.set(USER_ID, [RUN_A]);

    const store = await loadStore();
    await store.syncAccountRuns(USER_ID);

    const guestState = {
      run: {
        id: RUN_GUEST,
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
          run_id: RUN_GUEST,
          name: 'ME',
          color: '#FFD60A',
          slot: 0,
          created_at: '2026-01-01T00:00:00.000Z',
        },
      ],
      encounters: [],
    };
    localStorage.setItem(`pdx2.nuz.run.${RUN_GUEST}`, JSON.stringify(guestState));
    localStorage.setItem('pdx2.nuz.runs', JSON.stringify([RUN_GUEST, RUN_A]));

    membersByUser.set(USER_ID, []);
    await store.syncAccountRuns(USER_ID);

    expect(store.getHubRunIds()).not.toContain(RUN_A);
    expect(store.getHubRunIds()).toContain(RUN_GUEST);
    expect(store.loadLocalRun(RUN_GUEST)).not.toBeNull();
  });

  it('syncAccountRuns single-flight: concurrent calls share one fetch; mid-sync event triggers one follow-up', async () => {
    mockUser = { id: USER_ID };
    seedRun(RUN_A, 'Flight Run');
    membersByUser.set(USER_ID, [RUN_A]);
    membersFetchDelayMs = 50;

    const { syncAccountRuns, watchAccountRuns } = await loadStore();
    watchAccountRuns(USER_ID);

    const first = syncAccountRuns(USER_ID);
    const second = syncAccountRuns(USER_ID);
    await vi.waitFor(() => expect(membersFetchInFlight).toBe(1));

    for (const handler of memberHandlers()) {
      handler({ eventType: 'INSERT', new: { run_id: RUN_A, user_id: USER_ID } });
    }

    await Promise.all([first, second]);
    /* list fetches only (thenable path) — role maybeSingle adds extra from() calls */
    expect(membersFetchCompleted).toBe(2);
    expect(memberFetchCount()).toBeGreaterThanOrEqual(2);
  });
});
