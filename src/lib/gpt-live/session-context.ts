/** In-memory GPT-Live session context. Local demo only, one tab per id. */
import type { RunState } from '@/lib/nuzlocke-store';
import type { GptLiveTeamSnapshot } from './team-snapshot';

export interface GptLiveSessionContext {
  gameQuery?: string;
  lastSpeciesSlug?: string;
  /** Browser team snapshot for the current tool POST (read-only). */
  teamSnapshot?: GptLiveTeamSnapshot;
  /** Browser Nuzlocke run snapshot for the current tool POST (read-only). */
  run?: RunState | null;
}

const STORE = new Map<string, GptLiveSessionContext>();
const MAX_SESSIONS = 32;

export function createSessionContext(): string {
  const id = crypto.randomUUID();
  if (STORE.size >= MAX_SESSIONS) {
    const first = STORE.keys().next().value;
    if (first) STORE.delete(first);
  }
  STORE.set(id, {});
  return id;
}

export function getSessionContext(id: string | undefined): GptLiveSessionContext {
  if (!id) return {};
  return STORE.get(id) ?? {};
}

export function resetSessionContext(id: string | undefined): void {
  if (id) STORE.delete(id);
}

export function rememberSessionGame(ctx: GptLiveSessionContext, gameQuery: string): void {
  const trimmed = gameQuery.trim();
  if (trimmed) ctx.gameQuery = trimmed;
}

export function rememberSessionSpecies(ctx: GptLiveSessionContext, slug: string): void {
  if (slug) ctx.lastSpeciesSlug = slug;
}
