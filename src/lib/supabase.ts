/* MyPokePanion — Nuzlocke multiplayer client (nuzlocke.md §0.2)
 * Client singleton: env override (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)
 * falls back to the baked publishable key (public by design, RLS-gated). */
import { createClient } from '@supabase/supabase-js';
import type { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js';

const FALLBACK_URL = 'https://iqsdojzyqznmcirypdnk.supabase.co';
const FALLBACK_KEY = 'sb_publishable_B-cuJFNUAsfLvva9givrcA_m7QWT-fe';

const URL = (import.meta.env.VITE_SUPABASE_URL as string | undefined) || FALLBACK_URL;
const KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) || FALLBACK_KEY;

export const supabase: SupabaseClient = createClient(URL, KEY, {
  realtime: { params: { eventsPerSecond: 8 } },
});

/** Multi-capable when a project URL + key are configured (baked fallback counts). */
export function isMultiCapable(): boolean {
  return Boolean(URL && KEY);
}

/* ---------- row shapes (mirror of nuzlocke.md §0.2 schema) ---------- */

export type NuzEncounterStatus = 'caught' | 'dead' | 'missed' | 'duped';
export type NuzRunStatus = 'active' | 'complete' | 'failed';

export interface NuzRules {
  dupes: boolean;
  shiny: boolean;
  nicknames: boolean;
  soulLink: boolean;
  /** SoulLink death cascade: ON = linked partner falls too (UI confirm);
   * OFF = linked partner is auto-boxed instead */
  soulLinkCascade: boolean;
  /** remind on death that mon must be released / not used */
  releaseOnDeath: boolean;
  /** manual level cap for catches (null = off) */
  levelCap: number | null;
  /** auto cap: ace level of the next unbeaten gym leader (overrides manual) */
  autoLevelCap: boolean;
}

export interface NuzRunRow {
  id: string;
  invite_code: string | null;
  name: string;
  game: string;
  region: string;
  rules: NuzRules;
  status: NuzRunStatus;
  created_at: string;
}

export interface NuzPlayerRow {
  id: string;
  run_id: string;
  name: string;
  color: string;
  slot: number;
  created_at: string;
}

export interface NuzEncounterRow {
  id: string;
  run_id: string;
  player_id: string;
  /** == MapNode.id from the shared RegionMap (maps.md §0) */
  route_key: string;
  pokemon_id: number;
  nickname: string | null;
  level: number;
  status: NuzEncounterStatus;
  note: string | null;
  /** shiny catch — clause-free (bypasses route lock + dupes clause) and never
   * consumes the route slot; pre-migration rows may lack the flag */
  is_shiny?: boolean;
  /** explicit party membership (drag & drop team/box); pre-migration rows
   * may lack it → store falls back to derived "6 newest caught = party" */
  in_party?: boolean;
  created_at: string;
}

/* ---------- typed table helpers ---------- */

export const nuzTables = {
  runs: () => supabase.from('nuz_runs'),
  players: () => supabase.from('nuz_players'),
  encounters: () => supabase.from('nuz_encounters'),
} as const;

/* ---------- realtime channel helper (nuzlocke.md §0.2) ----------
 * Channel `run:{runId}` carries postgres_changes on all three tables
 * plus presence (per-player online state). Callers register handlers
 * before calling .subscribe(). */
export function runChannel(runId: string): RealtimeChannel {
  return supabase.channel(`run:${runId}`, { config: { presence: { key: runId } } });
}

export function dropChannel(channel: RealtimeChannel): void {
  void supabase.removeChannel(channel);
}
