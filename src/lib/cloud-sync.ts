/* cloud-sync — account vault in Supabase; localStorage is the working cache.
 * Logged-in team set follows the DB (no silent resurrect of remote deletes).
 * Guest rows still adopt on first login. Guest mode never touches account tables. */
import type { User } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { getAuthUser, onAuthChange } from './auth';
import {
  clearSyncedTeamIds,
  clearTeamTombstones,
  collapseLinkedTeamDuplicates,
  loadDraft,
  loadTeams,
  markTeamSynced,
  markTeamsSynced,
  readSyncedTeamIds,
  readTeamTombstones,
  readTeamsOwner,
  saveDraft,
  tombstoneTeamId,
  unmarkTeamSynced,
  writeTeamsCache,
  writeTeamsOwner,
  type Team,
} from './teambuilder';
import {
  isAccountManagedRun,
  loadLocalRun,
  markRunAccountLinked,
  readRunIndex,
  saveLocalRunPublic,
  stopAccountRunsWatch,
  syncAccountRuns,
  watchAccountRuns,
} from './nuzlocke-store';
import type { RunState } from './nuzlocke-store';

const DEBOUNCE_MS = 900;

/* ---------------- debounce helpers ---------------- */
const teamTimers = new Map<string, ReturnType<typeof setTimeout>>();
const runTimers = new Map<string, ReturnType<typeof setTimeout>>();

function debounce(map: Map<string, ReturnType<typeof setTimeout>>, id: string, fn: () => void) {
  const cur = map.get(id);
  if (cur) clearTimeout(cur);
  map.set(
    id,
    setTimeout(() => {
      map.delete(id);
      fn();
    }, DEBOUNCE_MS),
  );
}

/* ---------------- migration offer (legacy no-op API) ----------------
 * Kept so old listeners do not crash; offers are never emitted. Local-only
 * data is adopted silently in bootCloudSync on login. */
export interface MigrationOffer {
  teams: Team[];
  runs: RunState[];
  accept: () => void;
  decline: (forever: boolean) => void;
}

export function onMigrationOffer(cb: (o: MigrationOffer | null) => void): () => void {
  void cb;
  return () => undefined;
}

/* ---------------- teams ---------------- */
export function cloudPushTeam(team: Team): void {
  const user = getAuthUser();
  if (!user) return;
  debounce(teamTimers, team.id, () => {
    void supabase
      .from('teams')
      .upsert(
        { id: team.id, user_id: user.id, name: team.name, payload: team, updated_at: new Date(team.updatedAt).toISOString() },
        { onConflict: 'id' },
      )
      .then(({ error }) => {
        if (error) console.warn('[cloud-sync] team push failed', error.message);
        else markTeamSynced(team.id);
      });
  });
}

export function cloudDeleteTeam(id: string): void {
  const user = getAuthUser();
  if (!user) return;
  tombstoneTeamId(id);
  unmarkTeamSynced(id);
  void supabase
    .from('teams')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)
    .then(({ error }) => {
      if (error) console.warn('[cloud-sync] team delete failed', error.message);
    });
}

interface TeamRow {
  id: string;
  payload: Team;
  updated_at: string;
}

function teamFromRow(row: TeamRow): Team {
  const remoteTs = Date.parse(row.updated_at) || 0;
  return { ...row.payload, id: row.id, updatedAt: remoteTs || row.payload.updatedAt };
}

/**
 * Logged-in: the DB row set is the vault. localStorage is the working cache.
 * - Guest / never-synced ids are adopted (pushed).
 * - Ids we already synced that are missing remotely were deleted elsewhere: drop, never push.
 * - Tombstones retry a failed remote delete and never re-add that id.
 * - Fetch errors leave the cache untouched.
 */
async function hydrateTeams(user: { id: string }): Promise<void> {
  const { data, error } = await supabase.from('teams').select('id, payload, updated_at').eq('user_id', user.id);
  if (error) {
    console.warn('[cloud-sync] team hydrate failed', error.message);
    return;
  }

  const prevOwner = readTeamsOwner();
  const wasSynced = readSyncedTeamIds();
  const switching = Boolean(prevOwner && prevOwner !== user.id);
  if (switching) {
    clearTeamTombstones();
    clearSyncedTeamIds();
  }
  writeTeamsOwner(user.id);

  const tombstones = readTeamTombstones();
  const local = loadTeams();
  const localById = new Map(local.map((t) => [t.id, t]));
  const next: Team[] = [];
  const keep = new Set<string>();
  const toPush: Team[] = [];

  for (const row of (data ?? []) as TeamRow[]) {
    if (tombstones.has(row.id)) {
      cloudDeleteTeam(row.id);
      continue;
    }
    const remote = teamFromRow(row);
    const existing = localById.get(row.id);
    if (!existing || remote.updatedAt > existing.updatedAt) {
      next.push(remote);
    } else {
      next.push(existing);
      if (existing.updatedAt > remote.updatedAt) toPush.push(existing);
    }
    keep.add(row.id);
  }

  for (const t of local) {
    if (keep.has(t.id) || tombstones.has(t.id)) continue;
    if (switching) continue;
    if (wasSynced.has(t.id)) continue;
    next.push(t);
    toPush.push(t);
  }

  writeTeamsCache(next);
  markTeamsSynced(keep);
  collapseLinkedTeamDuplicates();
  for (const t of toPush) cloudPushTeam(t);

  const draft = loadDraft();
  if (draft && !next.some((t) => t.id === draft.id) && wasSynced.has(draft.id)) {
    saveDraft(null);
  }
}

/* ---------------- nuzlocke solo runs ---------------- */

/** Immediate account upsert (no debounce) — used by login adopt + debounced push. */
async function pushSoloRunToAccount(state: RunState): Promise<boolean> {
  if (state.mode !== 'solo') return false;
  const realUser = getAuthUser();
  if (!realUser) return false;
  const runRow = { ...state.run, invite_code: null };
  const { error: runErr } = await supabase.from('nuz_runs').upsert(runRow, { onConflict: 'id' });
  if (runErr) {
    console.warn('[cloud-sync] run push failed', runErr.message);
    return false;
  }
  if (state.players.length) {
    const { error: plErr } = await supabase.from('nuz_players').upsert(state.players, { onConflict: 'id' });
    if (plErr) console.warn('[cloud-sync] players push failed', plErr.message);
  }
  if (state.encounters.length) {
    const { error: encErr } = await supabase
      .from('nuz_encounters')
      .upsert(state.encounters, { onConflict: 'id' });
    if (encErr) console.warn('[cloud-sync] encounters push failed', encErr.message);
  }
  /* owner membership comes from nuz_runs_grant_owner trigger */
  return true;
}

export function cloudPushSoloRun(state: RunState): void {
  if (state.mode !== 'solo') return;
  const id = state.run.id;
  debounce(runTimers, id, () => {
    void (async () => {
      if (getAuthUser()) {
        const ok = await pushSoloRunToAccount(state);
        if (ok) markRunAccountLinked(id);
        return;
      }
      const { data } = await supabase.auth.getSession();
      const sessionUser = data.session?.user;
      if (!sessionUser) return;
      const { error } = await supabase
        .from('nuz_solo_runs')
        .upsert(
          { id, user_id: sessionUser.id, payload: state, updated_at: new Date().toISOString() },
          { onConflict: 'id' },
        );
      if (error) console.warn('[cloud-sync] run push failed', error.message);
    })();
  });
}

export function cloudDeleteSoloRun(id: string): void {
  /* Logged-in accounts delete via nuz_runs / nuz_run_members in nuzlocke-store. */
  if (getAuthUser()) return;
  void (async () => {
    const { data } = await supabase.auth.getSession();
    const sessionUser = data.session?.user;
    if (!sessionUser) return;
    const { error } = await supabase
      .from('nuz_solo_runs')
      .delete()
      .eq('id', id)
      .eq('user_id', sessionUser.id);
    if (error) console.warn('[cloud-sync] run delete failed', error.message);
  })();
}

interface SoloRunRow {
  id: string;
  payload: RunState;
  updated_at: string;
}

export async function hydrateSoloRuns(user: User): Promise<RunState[]> {
  if (getAuthUser()) return [];
  const { data, error } = await supabase.from('nuz_solo_runs').select('id, payload, updated_at').eq('user_id', user.id);
  if (error || !data) return [];
  const remoteIds = new Set<string>();
  for (const row of data as SoloRunRow[]) {
    remoteIds.add(row.id);
    const local = loadLocalRun(row.id);
    /* local-first: only adopt remote copies we don't have locally;
     * everything else is pushed up below (single-writer per device) */
    if (!local) saveLocalRunPublic(row.payload);
  }
  const pending: RunState[] = [];
  for (const id of readRunIndex()) {
    if (remoteIds.has(id)) continue;
    const local = loadLocalRun(id);
    if (local?.mode === 'solo') pending.push(local);
  }
  return pending;
}

/** Upload solo runs that exist only in localStorage after account sync. */
async function adoptLocalSoloRuns(): Promise<void> {
  if (!getAuthUser()) return;
  for (const id of readRunIndex()) {
    if (isAccountManagedRun(id)) continue;
    const local = loadLocalRun(id);
    if (!local || local.mode !== 'solo') continue;
    const ok = await pushSoloRunToAccount(local);
    if (ok) markRunAccountLinked(id);
  }
}

/* ---------------- boot / login hydration ---------------- */
let booted = false;
let stopTeamWatch: (() => void) | null = null;

function watchAccountTeams(userId: string): void {
  stopTeamWatch?.();
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  let t: ReturnType<typeof setTimeout> | null = null;
  const pull = () => {
    const user = getAuthUser();
    if (!user || user.id !== userId) return;
    void hydrateTeams(user);
  };
  const onVis = () => {
    if (document.visibilityState !== 'visible') return;
    if (t) clearTimeout(t);
    t = setTimeout(pull, 400);
  };
  document.addEventListener('visibilitychange', onVis);
  window.addEventListener('focus', onVis);
  stopTeamWatch = () => {
    document.removeEventListener('visibilitychange', onVis);
    window.removeEventListener('focus', onVis);
    if (t) clearTimeout(t);
    stopTeamWatch = null;
  };
}

/** Drop the account working cache on logout so a shared browser stays empty. */
export function clearAccountLocalVault(): void {
  writeTeamsCache([]);
  clearSyncedTeamIds();
  clearTeamTombstones();
  writeTeamsOwner(null);
  saveDraft(null);
  void import('./orre-progress').then((m) => m.clearOrreLocalProgress());
}

export function bootCloudSync(): void {
  if (booted) return;
  booted = true;
  onAuthChange((user) => {
    if (!user) {
      stopAccountRunsWatch();
      stopTeamWatch?.();
      clearAccountLocalVault();
      return;
    }
    watchAccountRuns(user.id);
    watchAccountTeams(user.id);
    void (async () => {
      await syncAccountRuns(user.id);
      await hydrateTeams(user);
      await adoptLocalSoloRuns();
      await hydrateSoloRuns(user);
      const orre = await import('./orre-progress');
      await orre.hydrateOrreProgress(user);
      void import('./nuzlocke-linked-teams').then((m) => m.repairAllLinkedTeams());
    })();
  });
}
