/* Cloud-backed solo runs: live postgres_changes + row-by-row writes (Task 3b). */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { RealtimeChannel } from '@supabase/supabase-js';
import type { NuzEncounterRow, NuzPlayerRow, NuzRunRow } from './supabase';
import { DEFAULT_RULES } from './nuzlocke-store';

const USER_ID = 'user-solo-live';
const SOLO_CLOUD = 'run-solo-cloud';
const MULTI_RUN = 'run-multi-guard';
const ROUTE_KEY = 'kanto-route-1';

let mockUser: { id: string } | null = null;

const runsById = new Map<string, NuzRunRow>();
const encountersByRun = new Map<string, NuzEncounterRow[]>();
const membersByUser = new Map<string, string[]>();

const encounterInserts: NuzEncounterRow[] = [];
const runUpdates: Array<{ id: string; patch: Record<string, unknown> }> = [];
const runsUpserts: unknown[] = [];

type PgHandler = (payload: {
  eventType: string;
  new?: unknown;
  old?: Partial<{ id: string }>;
}) => void;

const runPgHandlers: Array<{ table: string; handler: PgHandler }> = [];

const mockRunChannel = {
  on: vi.fn(function (
    this: typeof mockRunChannel,
    type: string,
    opts: { table?: string },
    handler: PgHandler,
  ) {
    if (type === 'postgres_changes') {
      runPgHandlers.push({ table: opts.table ?? '', handler });
    }
    return this;
  }),
  subscribe: vi.fn(function (this: typeof mockRunChannel, cb?: (status: string) => void) {
    queueMicrotask(() => cb?.('SUBSCRIBED'));
    return this;
  }),
  track: vi.fn(),
  presenceState: vi.fn(() => ({})),
};

const mockAccountChannel = {
  on: vi.fn().mockReturnThis(),
  subscribe: vi.fn().mockReturnThis(),
};

const { fromMock, channelMock, dropChannelMock } = vi.hoisted(() => ({
  fromMock: vi.fn(),
  channelMock: vi.fn(),
  dropChannelMock: vi.fn(),
}));

function chainEq(table: string, col: string, val: string) {
  if (table === 'nuz_run_members' && col === 'user_id') {
    const ids = membersByUser.get(val) ?? [];
    const payload = ids.map((run_id) => ({ run_id, archived: false, nuz_runs: runsById.get(run_id) ?? null }));
    return Promise.resolve({ data: payload, error: null });
  }
  if (table === 'nuz_runs' && col === 'id') {
    return {
      maybeSingle: () => Promise.resolve({ data: runsById.get(val) ?? null, error: null }),
    };
  }
  if (table === 'nuz_players' && col === 'run_id') {
    return {
      order: () =>
        Promise.resolve({
          data: [
            {
              id: `player-${val}`,
              run_id: val,
              name: 'ME',
              color: '#FFD60A',
              slot: 0,
              created_at: '2026-01-01T00:00:00.000Z',
            } satisfies NuzPlayerRow,
          ],
          error: null,
        }),
    };
  }
  if (table === 'nuz_encounters' && col === 'run_id') {
    return {
      order: () => Promise.resolve({ data: encountersByRun.get(val) ?? [], error: null }),
    };
  }
  return Promise.resolve({ data: null, error: null });
}

function makeTableChain(table: string) {
  return {
    insert: vi.fn((row: unknown) => {
      if (table === 'nuz_encounters') encounterInserts.push(row as NuzEncounterRow);
      if (table === 'nuz_runs') runsUpserts.push(row);
      return Promise.resolve({ error: null });
    }),
    upsert: vi.fn((row: unknown) => {
      if (table === 'nuz_runs') runsUpserts.push(row);
      return Promise.resolve({ error: null });
    }),
    update: vi.fn((patch: Record<string, unknown>) => ({
      eq: vi.fn((col: string, id: string) => {
        if (table === 'nuz_runs' && col === 'id') {
          runUpdates.push({ id, patch });
          const row = runsById.get(id);
          if (row) runsById.set(id, { ...row, ...patch } as NuzRunRow);
        }
        return Promise.resolve({ error: null });
      }),
    })),
    delete: vi.fn(() => ({
      eq: vi.fn(() => Promise.resolve({ error: null })),
    })),
    select: vi.fn(() => ({
      eq: vi.fn((col: string, val: string) => chainEq(table, col, val)),
    })),
  };
}

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
  const runChannelMock = vi.fn((runId: string, presenceKey: string) => {
    channelMock(`run:${runId}`, { config: { presence: { key: presenceKey } } });
    return mockRunChannel as unknown as RealtimeChannel;
  });
  channelMock.mockImplementation((name: string) => {
    if (name.startsWith('run:')) return mockRunChannel as unknown as RealtimeChannel;
    return mockAccountChannel as unknown as RealtimeChannel;
  });
  fromMock.mockImplementation((table: string) => makeTableChain(table));
  return {
    ...actual,
    isMultiCapable: () => true,
    runChannel: runChannelMock,
    dropChannel: dropChannelMock,
    supabase: {
      from: fromMock,
      channel: channelMock,
      removeChannel: vi.fn(),
      auth: {
        getSession: vi.fn(() =>
          Promise.resolve({ data: { session: { user: { id: 'anon', is_anonymous: true } } } }),
        ),
      },
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

function seedSoloCloudRun(id: string): void {
  runsById.set(id, {
    id,
    invite_code: null,
    name: 'Cloud Solo',
    game: 'firered',
    region: 'kanto',
    rules: { ...DEFAULT_RULES },
    status: 'active',
    created_at: '2026-01-01T00:00:00.000Z',
  });
  membersByUser.set(USER_ID, [id]);
  encountersByRun.set(id, []);
}

function seedMultiRun(id: string): void {
  runsById.set(id, {
    id,
    invite_code: 'SOUL-TEST1234',
    name: 'Multi Guard',
    game: 'firered',
    region: 'kanto',
    rules: { ...DEFAULT_RULES },
    status: 'active',
    created_at: '2026-01-01T00:00:00.000Z',
  });
  membersByUser.set(USER_ID, [id]);
  encountersByRun.set(id, []);
}

function handlersFor(table: string): PgHandler[] {
  return runPgHandlers.filter((h) => h.table === table).map((h) => h.handler);
}

describe('cloud-backed solo live sync', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.resetModules();
    installMemoryLocalStorage();
    mockUser = null;
    runsById.clear();
    encountersByRun.clear();
    membersByUser.clear();
    encounterInserts.length = 0;
    runUpdates.length = 0;
    runsUpserts.length = 0;
    runPgHandlers.length = 0;
    mockRunChannel.on.mockClear();
    mockRunChannel.subscribe.mockClear();
    channelMock.mockClear();
    dropChannelMock.mockClear();
    fromMock.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  async function loadStore() {
    return import('./nuzlocke-store');
  }

  it('cloud-backed solo run opens a realtime channel and applies remote encounter INSERT', async () => {
    mockUser = { id: USER_ID };
    seedSoloCloudRun(SOLO_CLOUD);

    const { syncAccountRuns, subscribeRun, getRunState } = await loadStore();
    await syncAccountRuns(USER_ID);

    const unsub = subscribeRun(SOLO_CLOUD, () => undefined);
    await vi.waitFor(() => expect(channelMock).toHaveBeenCalledWith(`run:${SOLO_CLOUD}`, expect.any(Object)));

    const remoteEnc: NuzEncounterRow = {
      id: 'enc-remote-1',
      run_id: SOLO_CLOUD,
      player_id: `player-${SOLO_CLOUD}`,
      route_key: ROUTE_KEY,
      pokemon_id: 25,
      nickname: null,
      level: 5,
      status: 'caught',
      note: null,
      in_party: true,
      created_at: '2026-01-02T00:00:00.000Z',
    };

    for (const handler of handlersFor('nuz_encounters')) {
      handler({ eventType: 'INSERT', new: remoteEnc });
    }

    expect(getRunState(SOLO_CLOUD)?.encounters[0]).toMatchObject({
      id: 'enc-remote-1',
      pokemon_id: 25,
      status: 'caught',
    });
    unsub();
  });

  it('remote nuz_runs UPDATE (rules change) is applied to a cloud-backed solo run', async () => {
    mockUser = { id: USER_ID };
    seedSoloCloudRun(SOLO_CLOUD);

    const { syncAccountRuns, subscribeRun, getRunState } = await loadStore();
    await syncAccountRuns(USER_ID);
    subscribeRun(SOLO_CLOUD, () => undefined);
    await vi.waitFor(() => expect(runPgHandlers.some((h) => h.table === 'nuz_runs')).toBe(true));

    const nextRules = { ...DEFAULT_RULES, dupes: false, shiny: false };
    const updatedRun = { ...runsById.get(SOLO_CLOUD)!, rules: nextRules };

    for (const handler of handlersFor('nuz_runs')) {
      handler({ eventType: 'UPDATE', new: updatedRun });
    }

    expect(getRunState(SOLO_CLOUD)?.run.rules.dupes).toBe(false);
    expect(getRunState(SOLO_CLOUD)?.run.rules.shiny).toBe(false);
  });

  it('logEncounter on a cloud-backed solo run issues an immediate server insert, not debounced blob upsert', async () => {
    mockUser = { id: USER_ID };
    const { createRun, logEncounter } = await loadStore();

    const { state } = await createRun({
      name: 'Live Solo',
      region: 'kanto',
      game: 'firered',
      players: [{ name: 'ME', color: '#FFD60A' }],
      rules: { ...DEFAULT_RULES, nicknames: false },
      online: false,
    });

    expect(state.mode).toBe('solo');
    encounterInserts.length = 0;
    runsUpserts.length = 0;
    fromMock.mockClear();

    const playerId = state.players[0].id;
    const result = await logEncounter(state.run.id, {
      playerId,
      routeKey: ROUTE_KEY,
      pokemonId: 1,
      nickname: null,
      level: 5,
      status: 'caught',
    });
    expect(result.ok).toBe(true);

    await vi.waitFor(() => expect(encounterInserts).toHaveLength(1));
    expect(encounterInserts[0]).toMatchObject({
      run_id: state.run.id,
      player_id: playerId,
      pokemon_id: 1,
      status: 'caught',
    });
    expect(fromMock).not.toHaveBeenCalledWith('nuz_solo_runs');
    /* row-by-row path — no debounced full-state upsert after mutations */
    await vi.advanceTimersByTimeAsync(1000);
    expect(runsUpserts).toHaveLength(0);
  });

  it('legacy guest solo on disk opens no run channel and issues no nuz_runs write', async () => {
    mockUser = null;
    const guestId = 'run-guest-solo-live';
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

    const { subscribeRun } = await loadStore();
    subscribeRun(guestId, () => undefined);
    await vi.advanceTimersByTimeAsync(1000);

    expect(channelMock.mock.calls.some((c) => String(c[0]).startsWith('run:'))).toBe(false);
    expect(fromMock).not.toHaveBeenCalledWith('nuz_runs');
  });

  it('multiplayer run still opens a run channel (guard)', async () => {
    mockUser = { id: USER_ID };
    seedMultiRun(MULTI_RUN);

    const { syncAccountRuns, subscribeRun } = await loadStore();
    await syncAccountRuns(USER_ID);
    subscribeRun(MULTI_RUN, () => undefined);

    await vi.waitFor(() => expect(channelMock).toHaveBeenCalledWith(`run:${MULTI_RUN}`, expect.any(Object)));
    expect(mockRunChannel.on).toHaveBeenCalledWith(
      'presence',
      { event: 'sync' },
      expect.any(Function),
    );
  });
});
