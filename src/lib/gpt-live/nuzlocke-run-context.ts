/** Shared run snapshot + route resolution for read-only GPT-Live Nuzlocke tools. */
import { nameOfPokemon } from '@/lib/i18n-data';
import { nodeIndex, nodeName, type MapNode } from '@/lib/regions';
import { anyRegionById } from '@/lib/regions-freeform';
import type { RunState } from '@/lib/nuzlocke-store';
import { normalizeRules, type RunSummaryOptions } from '@/lib/nuzlocke-rules';
import { normalizeEncounters } from '@/lib/nuzlocke-evolution';
import { effectiveRegionForRun } from '@/lib/nuzlocke-routes';
import { regionForRun } from '@/lib/orre';
import type { GptLiveSessionContext } from './session-context';
import { resolveGame } from './species-stats';

/** Base region + manual-route overlay — server-safe (no nuzlocke-store import). */
function resolveRunRegion(state: RunState): ReturnType<typeof regionForRun> {
  const base = regionForRun(state.run.region, state.run.game);
  return effectiveRegionForRun(base, state.run.rules) ?? base;
}

export type NuzlockeNoRunErr = {
  ok: false;
  error: 'no_run';
  message: string;
  spoken_hint: string;
};

function fold(raw: string): string {
  return raw
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/ß/g, 'ss')
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

/** Normalize a browser-supplied RunState snapshot for tool execution. */
export function parseRunSnapshot(raw: unknown): RunState | null {
  if (!raw || typeof raw !== 'object') return null;
  const row = raw as Partial<RunState>;
  if (!row.run || typeof row.run !== 'object') return null;
  const run = row.run as RunState['run'];
  if (typeof run.id !== 'string' || !run.id.trim()) return null;
  if (typeof run.region !== 'string' || typeof run.game !== 'string') return null;
  return {
    run: {
      ...run,
      rules: normalizeRules(run.rules),
    },
    mode: row.mode === 'multi' ? 'multi' : 'solo',
    players: Array.isArray(row.players) ? row.players : [],
    encounters: normalizeEncounters(Array.isArray(row.encounters) ? row.encounters : []),
  };
}

export function noRunError(): NuzlockeNoRunErr {
  return {
    ok: false,
    error: 'no_run',
    message: 'No Nuzlocke run is loaded in this browser tab.',
    spoken_hint: 'I do not have an active Nuzlocke run loaded. Open or create a run first.',
  };
}

export function isNoRunError(value: RunState | NuzlockeNoRunErr): value is NuzlockeNoRunErr {
  return 'error' in value && value.error === 'no_run';
}

export function requireRun(ctx: GptLiveSessionContext): RunState | NuzlockeNoRunErr {
  const state = ctx.run ?? null;
  if (!state) return noRunError();
  return state;
}

/** Resolve a spoken route/location within the run's effective region map. */
export function resolveRouteInRun(state: RunState, query: string): MapNode | null {
  const region = resolveRunRegion(state);
  if (!region) return null;
  const raw = query.trim();
  if (!raw) return null;

  const idx = nodeIndex(region);
  if (idx.has(raw)) return idx.get(raw)!;

  const folded = fold(raw);
  for (const node of region.nodes) {
    if (fold(node.id) === folded) return node;
    if (fold(node.label) === folded) return node;
    if (node.nameDe && fold(node.nameDe) === folded) return node;
  }

  const routeMatch = folded.match(/^route\s*(\d+)$/);
  if (routeMatch) {
    const num = routeMatch[1];
    const hits = region.nodes.filter((node) => node.id.endsWith(`-route-${num}`));
    if (hits.length === 1) return hits[0]!;
  }

  return null;
}

export function runSummaryOptions(state: RunState, lang: 'de' | 'en' = 'en'): RunSummaryOptions {
  const region = anyRegionById(state.run.region);
  const runRegion = resolveRunRegion(state);
  const idx = runRegion ? nodeIndex(runRegion) : new Map<string, MapNode>();
  const game = resolveGame(state.run.game);
  return {
    nameOf: (id) => nameOfPokemon(id, lang),
    routeLabel: (key) => {
      const node = idx.get(key);
      return node ? nodeName(node, lang) : key;
    },
    regionLabel: region?.name ?? state.run.region,
    gameLabel: game?.label ?? state.run.game,
  };
}

export function playerBySlot(state: RunState, slot: number | null | undefined): RunState['players'][number] | null {
  const wanted = typeof slot === 'number' && Number.isFinite(slot) ? Math.round(slot) : 1;
  const clamped = Math.max(1, Math.min(4, wanted));
  const sorted = [...state.players].sort((a, b) => a.slot - b.slot);
  return sorted[clamped - 1] ?? sorted[0] ?? null;
}
