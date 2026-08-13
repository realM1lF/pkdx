/* Store hardening: join 23505 retry, goOnline write errors, delayed-dead
 * vs restore, createRun player-orphan, duplicate cloud persist, presence
 * key, membership RPC (no nuz_run_members INSERT). */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { RealtimeChannel } from '@supabase/supabase-js';
import type { NuzEncounterRow, NuzPlayerRow, NuzRunRow } from './supabase';
import { DEFAULT_RULES } from './nuzlocke-store';

const USER_ID = 'user-harden-1';

let mockUser: { id: string } | null = null;

const runsById = new Map<string, NuzRunRow>();
const playersByRun = new Map<string, NuzPlayerRow[]>();
const encountersByRun = new Map<string, NuzEncounterRow[]>();

const insertedRuns: NuzRunRow[] = [];
const deletedRunIds: string[] = [];
const membersUpserts: unknown[] = [];
const runOwnerUpdates: unknown[] = [];
const playerInserts: NuzPlayerRow[] = [];
const encounterInserts: NuzEncounterRow[] = [];
const encounterUpserts: unknown[] = [];

let playerInsertImpl: (row: NuzPlayerRow | NuzPlayerRow[]) => { error: { code?: string; message?: string } | null } =
  () => ({ error: null });
let encounterUpsertError: { code?: string; message?: string } | null = null;
let encounterInsertError: { code?: string; message?: string } | null = null;
let playerUpsertError: { code?: string; message?: string } | null = null;

type PgHandler = (payload: {
  eventType: string;
  new?: unknown;
  old?: Partial<{ id: string }>;
}) => void;
const runPgHandlers: Array<{ table: string; handler: PgHandler }> = [];
const runChannelOpts: Array<{ runId: string; presenceKey: string }> = [];

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

const { fromMock, channelMock, rpcMock } = vi.hoisted(() => ({
  fromMock: vi.fn(),
  channelMock: vi.fn(),
  rpcMock: vi.fn((_name: string, _args?: unknown) =>
    Promise.resolve({ data: null, error: { code: 'PGRST202' } }),
  ),
}));

function asList<T>(row: T | T[]): T[] {
  return Array.isArray(row) ? row : [row];
}

function makeTableChain(table: string) {
  return {
    insert: vi.fn((row: unknown) => {
      if (table === 'nuz_runs') {
        const r = row as NuzRunRow;
        insertedRuns.push(r);
        runsById.set(r.id, r);
        return Promise.resolve({ error: null });
      }
      if (table === 'nuz_players') {
        const list = asList(row as NuzPlayerRow | NuzPlayerRow[]);
        const result = playerInsertImpl(list);
        if (!result.error) {
          for (const p of list) {
            playerInserts.push(p);
            const cur = playersByRun.get(p.run_id) ?? [];
            cur.push(p);
            playersByRun.set(p.run_id, cur);
          }
        }
        return Promise.resolve(result);
      }
      if (table === 'nuz_encounters') {
        if (encounterInsertError) return Promise.resolve({ error: encounterInsertError });
        const list = asList(row as NuzEncounterRow | NuzEncounterRow[]);
        for (const e of list) {
          encounterInserts.push(e);
          const cur = encountersByRun.get(e.run_id) ?? [];
          cur.push(e);
          encountersByRun.set(e.run_id, cur);
        }
        return Promise.resolve({ error: null });
      }
      return Promise.resolve({ error: null });
    }),
    upsert: vi.fn((row: unknown) => {
      if (table === 'nuz_runs') {
        const r = row as NuzRunRow;
        insertedRuns.push(r);
        runsById.set(r.id, r);
        return Promise.resolve({ error: null });
      }
      if (table === 'nuz_players') {
        if (playerUpsertError) return Promise.resolve({ error: playerUpsertError });
        return Promise.resolve({ error: null });
      }
      if (table === 'nuz_encounters') {
        encounterUpserts.push(row);
        if (encounterUpsertError) return Promise.resolve({ error: encounterUpsertError });
        return Promise.resolve({ error: null });
      }
      if (table === 'nuz_run_members') {
        membersUpserts.push(row);
        return Promise.resolve({ error: null });
      }
      return Promise.resolve({ error: null });
    }),
    update: vi.fn((patch: Record<string, unknown>) => ({
      eq: vi.fn((_col: string, id: string) => {
        if (table === 'nuz_runs' && 'owner_id' in patch) runOwnerUpdates.push({ id, patch });
        return Promise.resolve({ error: null });
      }),
    })),
    delete: vi.fn(() => ({
      eq: vi.fn((col: string, id: string) => {
        if (table === 'nuz_runs' && col === 'id') {
          deletedRunIds.push(id);
          runsById.delete(id);
        }
        return Promise.resolve({ error: null });
      }),
    })),
    select: vi.fn(() => ({
      eq: vi.fn((col: string, val: string) => {
        if (table === 'nuz_players' && col === 'run_id') {
          return {
            order: () => Promise.resolve({ data: playersByRun.get(val) ?? [], error: null }),
          };
        }
        if (table === 'nuz_encounters' && col === 'run_id') {
          return {
            order: () => Promise.resolve({ data: encountersByRun.get(val) ?? [], error: null }),
          };
        }
        if (table === 'nuz_runs' && col === 'id') {
          return {
            maybeSingle: () => Promise.resolve({ data: runsById.get(val) ?? null, error: null }),
          };
        }
        return {
          eq: () => ({
            order: () => Promise.resolve({ data: [], error: null }),
            maybeSingle: () => Promise.resolve({ data: null, error: null }),
          }),
          order: () => Promise.resolve({ data: [], error: null }),
          maybeSingle: () => Promise.resolve({ data: null, error: null }),
        };
      }),
    })),
  };
}

vi.mock('./auth', () => ({
  getAuthUser: () => mockUser,
  isAuthReady: () => true,
  useAuth: () => ({ ready: true, user: mockUser, profile: null }),
  ensureRunIdentity: vi.fn().mockResolvedValue(undefined),
  onAuthChange: vi.fn(() => () => undefined),
}));

vi.mock('./nuzlocke-linked-teams', () => ({
  syncLinkedTeamsForRun: vi.fn().mockResolvedValue(undefined),
  ensureLinkedTeams: vi.fn().mockResolvedValue(undefined),
  repairAllLinkedTeams: vi.fn().mockResolvedValue(undefined),
  cloneLinkedTeamsForDuplicate: vi.fn(),
  deleteLinkedTeamsForRun: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('./supabase', async () => {
  const actual = await vi.importActual<typeof import('./supabase')>('./supabase');
  const runChannelMock = vi.fn((runId: string, presenceKey: string) => {
    runChannelOpts.push({ runId, presenceKey });
    channelMock(`run:${runId}`, { config: { presence: { key: presenceKey } } });
    return mockRunChannel as unknown as RealtimeChannel;
  });
  channelMock.mockImplementation((name: string) => {
    if (name.startsWith('run:')) return mockRunChannel as unknown as RealtimeChannel;
    return {
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn().mockReturnThis(),
    } as unknown as RealtimeChannel;
  });
  fromMock.mockImplementation((table: string) => makeTableChain(table));
  return {
    ...actual,
    isMultiCapable: () => true,
    runChannel: runChannelMock,
    dropChannel: vi.fn(),
    supabase: {
      from: fromMock,
      rpc: rpcMock,
      channel: channelMock,
      removeChannel: vi.fn(),
      auth: {
        getSession: () => Promise.resolve({ data: { session: { user: { id: USER_ID } } } }),
      },
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

describe('nuzlocke store hardening', () => {
  beforeEach(() => {
    vi.resetModules();
    installMemoryLocalStorage();
    mockUser = { id: USER_ID };
    runsById.clear();
    playersByRun.clear();
    encountersByRun.clear();
    insertedRuns.length = 0;
    deletedRunIds.length = 0;
    membersUpserts.length = 0;
    runOwnerUpdates.length = 0;
    playerInserts.length = 0;
    encounterInserts.length = 0;
    encounterUpserts.length = 0;
    runPgHandlers.length = 0;
    runChannelOpts.length = 0;
    playerInsertImpl = () => ({ error: null });
    encounterUpsertError = null;
    encounterInsertError = null;
    playerUpsertError = null;
    rpcMock.mockReset();
    rpcMock.mockResolvedValue({ data: null, error: { code: 'PGRST202' } });
    fromMock.mockClear();
    channelMock.mockClear();
    mockRunChannel.on.mockClear();
    mockRunChannel.subscribe.mockClear();
    mockRunChannel.track.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  async function loadStore() {
    return import('./nuzlocke-store');
  }

  async function settleHydrate(runId: string, store: { getRunState: (id: string) => unknown }) {
    await vi.waitFor(() => expect(store.getRunState(runId)).not.toBeNull());
    await new Promise((r) => setTimeout(r, 30));
  }

  it('joinRun retries player insert on 23505 after re-fetching slots', async () => {
    const host: NuzPlayerRow = {
      id: 'player-host',
      run_id: 'run-join',
      name: 'HOST',
      color: '#FFD60A',
      slot: 0,
      created_at: '2026-01-01T00:00:00.000Z',
    };
    const racer: NuzPlayerRow = {
      id: 'player-racer',
      run_id: 'run-join',
      name: 'RACER',
      color: '#63D96B',
      slot: 1,
      created_at: '2026-01-01T00:00:01.000Z',
    };
    playersByRun.set('run-join', [host]);
    let attempts = 0;
    playerInsertImpl = (row) => {
      attempts += 1;
      const p = asList(row)[0]!;
      if (attempts === 1 && p.slot === 1) {
        playersByRun.set('run-join', [host, racer]);
        return { error: { code: '23505', message: 'duplicate slot' } };
      }
      return { error: null };
    };

    const { joinRun } = await loadStore();
    const state = await joinRun(
      {
        run: {
          id: 'run-join',
          invite_code: 'SOUL-JOINTEST',
          name: 'Open Lobby',
          game: 'firered',
          region: 'kanto',
          rules: { ...DEFAULT_RULES },
          status: 'active',
          created_at: '2026-01-01T00:00:00.000Z',
        },
        players: [host],
      },
      'JOINE',
      '#45C8FF',
    );

    expect(state).not.toBeNull();
    expect(attempts).toBeGreaterThanOrEqual(2);
    const me = state!.players.find((p) => p.name === 'JOINE');
    expect(me?.slot).toBe(2);
    expect(membersUpserts).toHaveLength(0);
  });

  it('goOnline does not switch to multi when encounter upload fails', async () => {
    const { createRun, logEncounter, goOnline, getRunState } = await loadStore();
    const { state } = await createRun({
      name: 'Go Online Fail',
      region: 'kanto',
      game: 'firered',
      players: [{ name: 'ME', color: '#FFD60A' }],
      rules: { ...DEFAULT_RULES, nicknames: false },
      online: false,
    });
    await settleHydrate(state.run.id, { getRunState });
    const logged = await logEncounter(state.run.id, {
      playerId: state.players[0].id,
      routeKey: 'route-1',
      pokemonId: 1,
      nickname: 'Mon',
      level: 5,
      status: 'caught',
    });
    expect(logged.ok).toBe(true);
    encountersByRun.set(state.run.id, [...(getRunState(state.run.id)?.encounters ?? [logged.encounter!])]);
    expect(getRunState(state.run.id)?.encounters.length).toBeGreaterThan(0);
    encounterInsertError = { code: '400', message: 'upsert blocked' };
    encounterUpsertError = { code: '400', message: 'cannot target partial index' };
    const ok = await goOnline(state.run.id);
    expect(ok).toBe(false);
    expect(getRunState(state.run.id)?.mode).toBe('solo');
  });

  it('delayed dead realtime frame does not kill a completed restore', async () => {
    const { createRun, logEncounter, updateEncounter, subscribeRun, getRunState } = await loadStore();
    const { state } = await createRun({
      name: 'Restore Race',
      region: 'kanto',
      game: 'firered',
      players: [{ name: 'ME', color: '#FFD60A' }],
      rules: { ...DEFAULT_RULES, nicknames: false },
      online: true,
    });
    await settleHydrate(state.run.id, { getRunState });
    const logged = await logEncounter(state.run.id, {
      playerId: state.players[0].id,
      routeKey: 'route-1',
      pokemonId: 1,
      nickname: 'Mon',
      level: 5,
      status: 'caught',
    });
    expect(logged.ok).toBe(true);
    const enc = logged.encounter!;
    encountersByRun.set(state.run.id, [{ ...enc }]);
    updateEncounter(state.run.id, enc.id, { status: 'dead' });
    updateEncounter(state.run.id, enc.id, { status: 'caught' });
    expect(getRunState(state.run.id)?.encounters.find((e) => e.id === enc.id)?.status).toBe('caught');

    const unsub = subscribeRun(state.run.id, () => undefined);
    await vi.waitFor(() => expect(runPgHandlers.some((h) => h.table === 'nuz_encounters')).toBe(true));

    const staleDead: NuzEncounterRow = { ...enc, status: 'dead', in_party: false };
    for (const handler of runPgHandlers.filter((h) => h.table === 'nuz_encounters')) {
      handler.handler({ eventType: 'UPDATE', new: staleDead });
    }
    expect(getRunState(state.run.id)?.encounters.find((e) => e.id === enc.id)?.status).toBe('caught');
    unsub();
  });

  it('createRun solo rolls back the run row when player insert fails', async () => {
    let runCount = 0;
    playerInsertImpl = () => {
      runCount += 1;
      return { error: { code: '400', message: 'players blocked' } };
    };
    const { createRun, getRunState } = await loadStore();
    const { state, offlineFallback } = await createRun({
      name: 'Orphan Guard',
      region: 'kanto',
      game: 'firered',
      players: [{ name: 'ME', color: '#FFD60A' }],
      rules: { ...DEFAULT_RULES },
      online: false,
    });
    expect(state.mode).toBe('solo');
    expect(deletedRunIds).toContain(state.run.id);
    expect(getRunState(state.run.id)).not.toBeNull();
    void offlineFallback;
    void runCount;
  });

  it('duplicateAsSolo persists the copy to nuz_runs for an account', async () => {
    const { createRun, duplicateAsSolo, loadLocalRun } = await loadStore();
    const { state } = await createRun({
      name: 'Source',
      region: 'kanto',
      game: 'firered',
      players: [{ name: 'ME', color: '#FFD60A' }],
      rules: { ...DEFAULT_RULES },
      online: false,
    });
    insertedRuns.length = 0;
    playerInserts.length = 0;
    const copyId = await duplicateAsSolo(state.run.id);
    expect(copyId).toBeTruthy();
    expect(loadLocalRun(copyId!)?.mode).toBe('solo');
    expect(insertedRuns.some((r) => r.id === copyId)).toBe(true);
    expect(playerInserts.some((p) => p.run_id === copyId)).toBe(true);
  });

  it('createRun / joinRun never upsert nuz_run_members or patch owner_id', async () => {
    const { createRun } = await loadStore();
    await createRun({
      name: 'No Members Write',
      region: 'kanto',
      game: 'firered',
      players: [{ name: 'ME', color: '#FFD60A' }],
      rules: { ...DEFAULT_RULES },
      online: true,
    });
    expect(membersUpserts).toHaveLength(0);
    expect(runOwnerUpdates).toHaveLength(0);
  });

  it('multi goLive never uses the run id as presence key', async () => {
    const { createRun, subscribeRun } = await loadStore();
    const { state } = await createRun({
      name: 'Presence',
      region: 'kanto',
      game: 'firered',
      players: [{ name: 'ME', color: '#FFD60A' }],
      rules: { ...DEFAULT_RULES },
      online: true,
    });
    subscribeRun(state.run.id, () => undefined);
    await vi.waitFor(() => expect(runChannelOpts.length).toBeGreaterThan(0));
    for (const opt of runChannelOpts) {
      expect(opt.presenceKey).not.toBe(state.run.id);
    }
  });
});
