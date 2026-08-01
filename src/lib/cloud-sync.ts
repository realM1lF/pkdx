/* cloud-sync — local-first mirror into Supabase (plan-accounts.md WP5/WP6).
 * localStorage stays the source of truth for reads; when logged in, writes
 * are mirrored to the DB (debounced) and on login the DB is merged back in
 * (last-write-wins per record). Guest mode never touches this module. */
import type { User } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { getAuthUser, onAuthChange } from './auth';
import { loadTeams, saveTeam } from './teambuilder';
import type { Team } from './teambuilder';
import { loadLocalRun, readRunIndex, saveLocalRunPublic } from './nuzlocke-store';
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

/* ---------------- migration offer (first login) ---------------- */
export interface MigrationOffer {
  teams: Team[];
  runs: RunState[];
  accept: () => void;
  decline: (forever: boolean) => void;
}

const SKIP_KEY = 'pdx2.acctMigrateSkip';
let offerListeners: Array<(o: MigrationOffer | null) => void> = [];
let sessionAsked = false;

export function onMigrationOffer(cb: (o: MigrationOffer | null) => void): () => void {
  offerListeners.push(cb);
  return () => {
    offerListeners = offerListeners.filter((l) => l !== cb);
  };
}

function migrationSkipped(): boolean {
  try {
    return localStorage.getItem(SKIP_KEY) === '1';
  } catch {
    return false;
  }
}

function maybeOffer(teams: Team[], runs: RunState[]): void {
  if (sessionAsked || migrationSkipped() || (teams.length === 0 && runs.length === 0)) return;
  sessionAsked = true;
  const offer: MigrationOffer = {
    teams,
    runs,
    accept: () => {
      for (const t of teams) cloudPushTeam(t);
      for (const r of runs) cloudPushSoloRun(r);
      offerListeners.forEach((fn) => fn(null));
    },
    decline: (forever) => {
      if (forever) {
        try {
          localStorage.setItem(SKIP_KEY, '1');
        } catch { /* ignore */ }
      }
      offerListeners.forEach((fn) => fn(null));
    },
  };
  offerListeners.forEach((fn) => fn(offer));
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
  /* local teams missing remotely → migration candidates (dialog decides) */
  return loadTeams().filter((t) => !remoteIds.has(t.id));
}

/* ---------------- nuzlocke solo runs ---------------- */
export function cloudPushSoloRun(state: RunState): void {
  const user = getAuthUser();
  if (!user || state.mode !== 'solo') return;
  const id = state.run.id;
  debounce(runTimers, id, () => {
    void supabase
      .from('nuz_solo_runs')
      .upsert(
        { id, user_id: user.id, payload: state, updated_at: new Date().toISOString() },
        { onConflict: 'id' },
      )
      .then(({ error }) => {
        if (error) console.warn('[cloud-sync] run push failed', error.message);
      });
  });
}

export function cloudDeleteSoloRun(id: string): void {
  const user = getAuthUser();
  if (!user) return;
  void supabase
    .from('nuz_solo_runs')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)
    .then(({ error }) => {
      if (error) console.warn('[cloud-sync] run delete failed', error.message);
    });
}

interface SoloRunRow {
  id: string;
  payload: RunState;
  updated_at: string;
}

async function hydrateSoloRuns(user: User): Promise<RunState[]> {
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

/* ---------------- boot / login hydration ---------------- */
let booted = false;

export function bootCloudSync(): void {
  if (booted) return;
  booted = true;
  onAuthChange((user) => {
    if (!user) return;
    void (async () => {
      const [teams, runs] = await Promise.all([hydrateTeams(user), hydrateSoloRuns(user)]);
      maybeOffer(teams, runs);
      /* mid-run login / second device: repair linked TB teams after hydrate */
      void import('./nuzlocke-linked-teams').then((m) => m.repairAllLinkedTeams());
    })();
  });
}
