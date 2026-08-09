/* cloud-sync — local-first mirror into Supabase (plan-accounts.md WP5/WP6).
 * localStorage stays the fast cache; logged-in writes mirror to the DB.
 * On login, local-only solo runs/teams are adopted silently (no dialog).
 * Guest mode never touches account tables. */
import type { User } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { getAuthUser, onAuthChange } from './auth';
import { loadTeams, saveTeam, type Team } from './teambuilder';
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
      });
  });
}

export function cloudDeleteTeam(id: string): void {
  const user = getAuthUser();
  if (!user) return;
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

async function hydrateTeams(user: User): Promise<Team[]> {
  const { data, error } = await supabase.from('teams').select('id, payload, updated_at').eq('user_id', user.id);
  if (error || !data) return [];
  const local = loadTeams();
  const localById = new Map(local.map((t) => [t.id, t]));
  const remoteIds = new Set<string>();
  for (const row of data as TeamRow[]) {
    remoteIds.add(row.id);
    const l = localById.get(row.id);
    const remoteTs = Date.parse(row.updated_at) || 0;
    if (!l || remoteTs > l.updatedAt) {
      saveTeam({ ...row.payload, id: row.id, updatedAt: remoteTs });
    }
  }
  /* local teams missing remotely → silent adopt on login */
  return loadTeams().filter((t) => !remoteIds.has(t.id));
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

export function bootCloudSync(): void {
  if (booted) return;
  booted = true;
  onAuthChange((user) => {
    if (!user) {
      stopAccountRunsWatch();
      /* never prompt while logged out — that flash is what users hated */
      return;
    }
    watchAccountRuns(user.id);
    void (async () => {
      await syncAccountRuns(user.id);
      const pendingTeams = await hydrateTeams(user);
      for (const t of pendingTeams) cloudPushTeam(t);
      await adoptLocalSoloRuns();
      await hydrateSoloRuns(user);
      void import('./nuzlocke-linked-teams').then((m) => m.repairAllLinkedTeams());
    })();
  });
}
