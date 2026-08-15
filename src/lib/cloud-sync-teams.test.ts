/* Account teams: DB is the set, localStorage is the cache.
 * Local-only rows that were already synced must never be re-uploaded
 * (that resurrects deletes from another origin). Guest rows still adopt. */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { User } from '@supabase/supabase-js';
import type { Team } from './teambuilder';

const USER_A = 'user-a';
const USER_B = 'user-b';

let mockUser: { id: string } | null = null;
let authCb: ((user: User | null) => void) | null = null;

interface TeamRow {
  id: string;
  payload: Team;
  updated_at: string;
}

const remoteTeams: TeamRow[] = [];
const teamUpserts: unknown[] = [];
const teamDeletes: string[] = [];
let teamSelectError: { message: string } | null = null;

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
    upsert: () => Promise.resolve(result),
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
    if (table === 'teams') {
      return {
        select: () => ({
          eq: () =>
            teamSelectError
              ? Promise.resolve({ data: null, error: teamSelectError })
              : Promise.resolve({ data: [...remoteTeams], error: null }),
        }),
        upsert: (row: { id: string; payload: Team; updated_at: string; user_id: string }) => {
          teamUpserts.push(row);
          const stored: TeamRow = { id: row.id, payload: row.payload, updated_at: row.updated_at };
          const i = remoteTeams.findIndex((r) => r.id === row.id);
          if (i >= 0) remoteTeams[i] = stored;
          else remoteTeams.push(stored);
          return Promise.resolve({ data: row, error: null });
        },
        delete: () => {
          let id = '';
          const second = {
            eq: () => {
              teamDeletes.push(id);
              const i = remoteTeams.findIndex((r) => r.id === id);
              if (i >= 0) remoteTeams.splice(i, 1);
              return Promise.resolve({ data: null, error: null });
            },
          };
          return {
            eq: (col: string, val: string) => {
              if (col === 'id') id = val;
              return second;
            },
          };
        },
      };
    }
    if (table === 'nuz_runs') {
      return {
        upsert: () => Promise.resolve({ data: null, error: null }),
        select: () => ({ eq: () => ({ maybeSingle: () => Promise.resolve({ data: null, error: null }) }) }),
      };
    }
    if (table === 'nuz_players' || table === 'nuz_encounters') {
      return { upsert: () => Promise.resolve({ data: null, error: null }) };
    }
    if (table === 'nuz_run_members') {
      return { select: () => ({ eq: () => Promise.resolve({ data: [], error: null }) }) };
    }
    if (table === 'nuz_solo_runs' || table === 'orre_shadow_progress') {
      return {
        select: () => ({ eq: () => Promise.resolve({ data: [], error: null }) }),
        upsert: () => Promise.resolve({ data: null, error: null }),
        delete: () => ({ eq: () => ({ eq: () => ({ eq: () => Promise.resolve({ data: null, error: null }) }) }) }),
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

function stubTeam(id: string, name: string, updatedAt: number): Team {
  return {
    id,
    name,
    versionGroup: 'scarlet-violet',
    slots: [],
    updatedAt,
  };
}

function seedLocal(teams: Team[], extra?: { synced?: string[]; owner?: string | null; tombstones?: string[] }) {
  localStorage.setItem('pdx2.teams', JSON.stringify(teams));
  if (extra?.synced) localStorage.setItem('pdx2.teams.synced', JSON.stringify(extra.synced));
  if (extra?.owner !== undefined) {
    if (extra.owner) localStorage.setItem('pdx2.teams.owner', JSON.stringify(extra.owner));
    else localStorage.removeItem('pdx2.teams.owner');
  }
  if (extra?.tombstones) localStorage.setItem('pdx2.teams.tombstones', JSON.stringify(extra.tombstones));
}

async function login(userId: string) {
  const cloud = await import('./cloud-sync');
  cloud.bootCloudSync();
  mockUser = { id: userId };
  authCb?.(mockUser as User);
  await vi.advanceTimersByTimeAsync(1200);
}

describe('cloud-sync teams', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.useFakeTimers();
    installMemoryLocalStorage();
    mockUser = null;
    authCb = null;
    remoteTeams.length = 0;
    teamUpserts.length = 0;
    teamDeletes.length = 0;
    teamSelectError = null;
    fromMock.mockClear();
    onAuthChangeMock.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('adopts guest local-only teams on first login', async () => {
    const guest = stubTeam('guest-1', 'Phone Team', 1_000);
    seedLocal([guest]);
    await login(USER_A);
    const { loadTeams } = await import('./teambuilder');
    expect(loadTeams().map((t) => t.id)).toContain('guest-1');
    expect(teamUpserts.some((r) => (r as { id: string }).id === 'guest-1')).toBe(true);
  });

  it('does not resurrect a synced team that was deleted remotely', async () => {
    const gone = stubTeam('gone-1', 'Deleted elsewhere', 1_000);
    seedLocal([gone], { synced: ['gone-1'], owner: USER_A });
    await login(USER_A);
    const { loadTeams } = await import('./teambuilder');
    expect(loadTeams().map((t) => t.id)).not.toContain('gone-1');
    expect(teamUpserts.some((r) => (r as { id: string }).id === 'gone-1')).toBe(false);
  });

  it('pulls a remote-only team into the local cache without re-upserting it as new', async () => {
    const remote = stubTeam('cloud-1', 'From cloud', 5_000);
    remoteTeams.push({
      id: remote.id,
      payload: remote,
      updated_at: new Date(5_000).toISOString(),
    });
    seedLocal([], { synced: [], owner: USER_A });
    await login(USER_A);
    const { loadTeams } = await import('./teambuilder');
    expect(loadTeams().find((t) => t.id === 'cloud-1')?.name).toBe('From cloud');
    expect(teamUpserts.filter((r) => (r as { id: string }).id === 'cloud-1')).toHaveLength(0);
  });

  it('keeps the newer local payload and pushes it when timestamps conflict', async () => {
    const local = stubTeam('same-1', 'Local newer', 9_000);
    const remote = stubTeam('same-1', 'Remote older', 1_000);
    seedLocal([local], { synced: ['same-1'], owner: USER_A });
    remoteTeams.push({
      id: remote.id,
      payload: remote,
      updated_at: new Date(1_000).toISOString(),
    });
    await login(USER_A);
    const { loadTeams } = await import('./teambuilder');
    expect(loadTeams().find((t) => t.id === 'same-1')?.name).toBe('Local newer');
    expect(teamUpserts.some((r) => (r as { payload: Team }).payload.name === 'Local newer')).toBe(true);
  });

  it('applies a newer remote payload and does not push the stale local name', async () => {
    const local = stubTeam('same-2', 'Stale local', 1_000);
    const remote = stubTeam('same-2', 'Remote newer', 9_000);
    seedLocal([local], { synced: ['same-2'], owner: USER_A });
    remoteTeams.push({
      id: remote.id,
      payload: remote,
      updated_at: new Date(9_000).toISOString(),
    });
    await login(USER_A);
    const { loadTeams } = await import('./teambuilder');
    expect(loadTeams().find((t) => t.id === 'same-2')?.name).toBe('Remote newer');
    expect(teamUpserts.some((r) => (r as { payload: Team }).payload.name === 'Stale local')).toBe(false);
  });

  it('does not adopt unsynced teams from a previous account owner', async () => {
    const leftover = stubTeam('a-unsynced', 'Leftover A', 1_000);
    seedLocal([leftover], { owner: USER_A });
    const bTeam = stubTeam('b-1', 'Account B', 2_000);
    remoteTeams.push({
      id: bTeam.id,
      payload: bTeam,
      updated_at: new Date(2_000).toISOString(),
    });
    await login(USER_B);
    const { loadTeams } = await import('./teambuilder');
    expect(loadTeams().map((t) => t.id)).toEqual(['b-1']);
    expect(teamUpserts.some((r) => (r as { id: string }).id === 'a-unsynced')).toBe(false);
  });

  it('logout wipes the local team vault', async () => {
    const aTeam = stubTeam('a-1', 'Account A', 1_000);
    seedLocal([aTeam], { synced: ['a-1'], owner: USER_A });
    remoteTeams.push({
      id: aTeam.id,
      payload: aTeam,
      updated_at: new Date(1_000).toISOString(),
    });
    await login(USER_A);
    const cloud = await import('./cloud-sync');
    cloud.clearAccountLocalVault();
    const { loadTeams } = await import('./teambuilder');
    expect(loadTeams()).toEqual([]);
    expect(localStorage.getItem('pdx2.teams.owner')).toBeNull();
    expect(JSON.parse(localStorage.getItem('pdx2.teams') ?? '[]')).toEqual([]);
  });

  it('does not upload the previous account cache when another user logs in', async () => {
    const aTeam = stubTeam('a-1', 'Account A', 1_000);
    seedLocal([aTeam], { synced: ['a-1'], owner: USER_A });
    const bTeam = stubTeam('b-1', 'Account B', 2_000);
    remoteTeams.push({
      id: bTeam.id,
      payload: bTeam,
      updated_at: new Date(2_000).toISOString(),
    });
    await login(USER_B);
    const { loadTeams } = await import('./teambuilder');
    expect(loadTeams().map((t) => t.id)).toEqual(['b-1']);
    expect(teamUpserts.some((r) => (r as { id: string }).id === 'a-1')).toBe(false);
  });

  it('leaves the local cache alone when the teams fetch fails', async () => {
    const kept = stubTeam('keep-1', 'Still here', 1_000);
    seedLocal([kept], { synced: ['keep-1'], owner: USER_A });
    teamSelectError = { message: 'network down' };
    await login(USER_A);
    const { loadTeams } = await import('./teambuilder');
    expect(loadTeams().map((t) => t.id)).toEqual(['keep-1']);
    expect(teamUpserts).toHaveLength(0);
  });

  it('retries a tombstoned remote row as a delete instead of putting it back', async () => {
    const dead = stubTeam('dead-1', 'Should stay gone', 1_000);
    seedLocal([], { synced: [], owner: USER_A, tombstones: ['dead-1'] });
    remoteTeams.push({
      id: dead.id,
      payload: dead,
      updated_at: new Date(1_000).toISOString(),
    });
    await login(USER_A);
    const { loadTeams } = await import('./teambuilder');
    expect(loadTeams().map((t) => t.id)).not.toContain('dead-1');
    expect(teamDeletes).toContain('dead-1');
  });

  it('deleteTeam tombstones so a later hydrate cannot bring the same id back', async () => {
    const doomed = stubTeam('doomed-1', 'Bye', 1_000);
    seedLocal([doomed], { synced: ['doomed-1'], owner: USER_A });
    mockUser = { id: USER_A };
    const { deleteTeam, loadTeams } = await import('./teambuilder');
    deleteTeam('doomed-1');
    expect(loadTeams()).toEqual([]);
    expect(JSON.parse(localStorage.getItem('pdx2.teams.tombstones') ?? '[]')).toContain('doomed-1');
  });
});
