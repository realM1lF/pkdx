/** GPT-Live tool registry. Session config and the local executor share this list. */
import {
  ITEM_LOCATIONS,
  ITEM_LOCATIONS_TOOL,
  itemLocationsFromArgs,
  type ItemLocationsResult,
} from './item-locations';
import {
  JUDGE_MATCHUP,
  JUDGE_MATCHUP_TOOL,
  judgeMatchupFromArgs,
  type JudgeMatchupResult,
} from './judge-matchup';
import {
  ROUTE_ENCOUNTERS,
  ROUTE_ENCOUNTERS_TOOL,
  routeEncountersFromArgs,
  type RouteEncountersResult,
} from './route-encounters';
import {
  NUZLOCKE_CAN_CATCH,
  NUZLOCKE_CAN_CATCH_TOOL,
  nuzlockeCanCatchFromArgs,
  type NuzlockeCanCatchResult,
} from './nuzlocke-can-catch';
import {
  NUZLOCKE_RUN_STATUS,
  NUZLOCKE_RUN_STATUS_TOOL,
  nuzlockeRunStatusFromArgs,
} from './nuzlocke-run-status';
import {
  CHECK_SLOT_LEGALITY,
  CHECK_SLOT_LEGALITY_TOOL,
  checkSlotLegalityFromArgs,
  type CheckSlotLegalityResult,
} from './check-slot-legality';
import {
  CHECK_TEAM_COVERAGE,
  CHECK_TEAM_COVERAGE_TOOL,
  checkTeamCoverageFromArgs,
  type CheckTeamCoverageResult,
} from './check-team-coverage';
import {
  GET_SPECIES_STATS,
  GET_SPECIES_STATS_TOOL,
  getSpeciesStatsFromArgs,
  type SpeciesStatsResult,
} from './species-stats';
import {
  WHERE_TO_FIND,
  WHERE_TO_FIND_TOOL,
  whereToFindFromArgs,
  type WhereToFindResult,
} from './where-to-find';
import {
  SITE_PAGES,
  SITE_PAGES_TOOL,
  sitePagesFromArgs,
} from './site-pages';
import {
  rememberSessionGame,
  rememberSessionSpecies,
  type GptLiveSessionContext,
} from './session-context';

export interface GptLiveFunctionSchema {
  type: 'function';
  name: string;
  description: string;
  strict: true;
  parameters: {
    type: 'object';
    properties: Record<string, unknown>;
    required: string[];
    additionalProperties: false;
  };
}

export interface GptLiveToolEntry {
  name: string;
  schema: GptLiveFunctionSchema;
  backendRule: string;
  liveCapability: string;
  execute: (args: unknown, ctx: GptLiveSessionContext) => unknown | Promise<unknown>;
}

function rememberSpeciesStats(result: unknown, ctx: GptLiveSessionContext): void {
  const row = result as SpeciesStatsResult;
  if (!row || !row.ok) return;
  rememberSessionGame(ctx, row.game.query);
  rememberSessionSpecies(ctx, row.species.slug);
}

function rememberJudgeMatchup(result: unknown, ctx: GptLiveSessionContext): void {
  const row = result as JudgeMatchupResult;
  if (!row || !row.ok) return;
  rememberSessionGame(ctx, row.game.query);
  rememberSessionSpecies(ctx, row.you.slug);
}

function rememberWhereToFind(result: unknown, ctx: GptLiveSessionContext): void {
  const row = result as WhereToFindResult;
  if (!row || !row.ok) return;
  rememberSessionGame(ctx, row.game.query);
  rememberSessionSpecies(ctx, row.species.slug);
}

function rememberRouteEncounters(result: unknown, ctx: GptLiveSessionContext): void {
  const row = result as RouteEncountersResult;
  if (!row || !row.ok) return;
  rememberSessionGame(ctx, row.game.query);
}

function rememberItemLocations(result: unknown, ctx: GptLiveSessionContext): void {
  const row = result as ItemLocationsResult;
  if (!row || !row.ok) return;
  if (row.game) rememberSessionGame(ctx, row.game.query);
}

function rememberSlotLegality(result: unknown, ctx: GptLiveSessionContext): void {
  const row = result as CheckSlotLegalityResult;
  if (!row || !row.ok) return;
  rememberSessionGame(ctx, row.game.query);
  rememberSessionSpecies(ctx, row.species.slug);
}

function rememberTeamCoverage(result: unknown, ctx: GptLiveSessionContext): void {
  const row = result as CheckTeamCoverageResult;
  if (!row || !row.ok) return;
  rememberSessionGame(ctx, row.game.query);
}

export const GPT_LIVE_TOOLS: GptLiveToolEntry[] = [
  {
    name: GET_SPECIES_STATS,
    schema: GET_SPECIES_STATS_TOOL,
    liveCapability: 'Species stats: generation-correct base stats, BST, and types for a named game.',
    backendRule:
      'Use get_species_stats for every factual species stat, BST, or type question. Pass species_query as spoken. Pass game as the named edition, or null when the session already has a game.',
    execute: (args, ctx) => {
      const result = getSpeciesStatsFromArgs(args, ctx);
      rememberSpeciesStats(result, ctx);
      return result;
    },
  },
  {
    name: JUDGE_MATCHUP,
    schema: JUDGE_MATCHUP_TOOL,
    liveCapability: 'Matchup verdict: who wins at level 50 with default wild/assumed sets in a named game.',
    backendRule:
      'Use judge_matchup for every who-wins, matchup, or head-to-head question between two species. Pass you_query and foe_query as spoken. Pass game as the named edition, or null when the session already has a game. Do not call it for what-if custom movesets or non-50 levels.',
    execute: async (args, ctx) => {
      const result = await judgeMatchupFromArgs(args, ctx);
      rememberJudgeMatchup(result, ctx);
      return result;
    },
  },
  {
    name: WHERE_TO_FIND,
    schema: WHERE_TO_FIND_TOOL,
    liveCapability: 'Where to find: wild and special encounter locations for a species in a named game.',
    backendRule:
      'Use where_to_find for species catch and location questions (where can I catch, kann ich X fangen, welche Route für X) even when progress timing is vague (wann, gerade angefangen). Pass species_query as spoken. Pass game as the named edition, or null when the session already has a game. When the user names a species and game but no specific route, use where_to_find — not route_encounters. Prefer this over nuzlocke_can_catch unless a Nuzlocke run is loaded and the question is about that run.',
    execute: async (args, ctx) => {
      const result = await whereToFindFromArgs(args, ctx);
      rememberWhereToFind(result, ctx);
      return result;
    },
  },
  {
    name: ROUTE_ENCOUNTERS,
    schema: ROUTE_ENCOUNTERS_TOOL,
    liveCapability: 'Route spawns: wild Pokémon on a map node for a specific game version.',
    backendRule:
      'Use route_encounters only when the user names a specific route or map location (Route 1, Viridian Forest, Vertania-Wald). Pass route_query as spoken. Pass game as the specific version (firered, red, …), or null when the session already has a game. Species catch questions without a named route → where_to_find instead.',
    execute: async (args, ctx) => {
      const result = await routeEncountersFromArgs(args, ctx);
      rememberRouteEncounters(result, ctx);
      return result;
    },
  },
  {
    name: ITEM_LOCATIONS,
    schema: ITEM_LOCATIONS_TOOL,
    liveCapability: 'Item locations: curated map pickups for an item name or slug.',
    backendRule:
      'Use item_locations for where-is-this-item questions. Pass item_query as spoken. Pass game for localized notes, or null when not relevant.',
    execute: (args, ctx) => {
      const result = itemLocationsFromArgs(args, ctx);
      rememberItemLocations(result, ctx);
      return result;
    },
  },
  {
    name: CHECK_SLOT_LEGALITY,
    schema: CHECK_SLOT_LEGALITY_TOOL,
    liveCapability: 'Slot legality: species, moves, item, ability, and nature flags for a named game.',
    backendRule:
      'Use check_slot_legality for illegal-move, learnset, species-in-game, item, ability, or nature legality on one slot. Pass species_query and optional moves[4] as spoken. Pass game as the named edition, or null when the session already has a game.',
    execute: async (args, ctx) => {
      const result = await checkSlotLegalityFromArgs(args, ctx);
      rememberSlotLegality(result, ctx);
      return result;
    },
  },
  {
    name: CHECK_TEAM_COVERAGE,
    schema: CHECK_TEAM_COVERAGE_TOOL,
    liveCapability: 'Team coverage: offensive gaps and defensive synergy for spoken members or the browser team snapshot.',
    backendRule:
      'Use check_team_coverage for type-coverage, defensive holes, or synergy questions about a team. Pass members as 1–6 spoken species, or null to use the browser team snapshot. Pass game as the named edition, or null when the session already has a game.',
    execute: async (args, ctx) => {
      const result = await checkTeamCoverageFromArgs(args, ctx);
      rememberTeamCoverage(result, ctx);
      return result;
    },
  },
  {
    name: NUZLOCKE_RUN_STATUS,
    schema: NUZLOCKE_RUN_STATUS_TOOL,
    liveCapability: 'Nuzlocke run status: summary, KPIs, party, level cap, and next gym for the loaded browser run.',
    backendRule:
      'Use nuzlocke_run_status for run progress, party, graveyard summary, level cap, or badge-driven cap questions about the active Nuzlocke run. Requires a run loaded in the browser; never invent run data.',
    execute: (args, ctx) => nuzlockeRunStatusFromArgs(args, ctx),
  },
  {
    name: NUZLOCKE_CAN_CATCH,
    schema: NUZLOCKE_CAN_CATCH_TOOL,
    liveCapability: 'Nuzlocke catch check: Dupes, route lock, and nickname rules for a species on a run route.',
    backendRule:
      'Use nuzlocke_can_catch only when a Nuzlocke run is loaded and the user asks about catching on a route in that run. General can-I-catch-in-game questions → where_to_find instead. Pass species_query and route_query as spoken.',
    execute: async (args, ctx) => {
      const result = await nuzlockeCanCatchFromArgs(args, ctx);
      const row = result as NuzlockeCanCatchResult;
      if (row.ok && 'species' in row) rememberSessionSpecies(ctx, row.species.slug);
      return result;
    },
  },
  {
    name: SITE_PAGES,
    schema: SITE_PAGES_TOOL,
    liveCapability: 'Site pages: footer links to About, Feedback, Donate, legal pages, and main app tabs.',
    backendRule:
      'Use site_pages when the user asks where Impressum, privacy, feedback, about, donate, licenses, or non-Pokémon site pages are, or what the site offers besides Pokémon tools. Point to labels and footer sections only; never quote or summarize legal page text.',
    execute: (args, ctx) => sitePagesFromArgs(args, ctx),
  },
];

export function gptLiveToolSchemas(): GptLiveFunctionSchema[] {
  return GPT_LIVE_TOOLS.map((tool) => tool.schema);
}

export function gptLiveBackendRules(): string {
  return GPT_LIVE_TOOLS.map((tool) => tool.backendRule).join(' ');
}

export function gptLiveCapabilities(): string[] {
  return GPT_LIVE_TOOLS.map((tool) => tool.liveCapability);
}

export async function executeRegisteredTool(
  name: string,
  args: unknown,
  ctx: GptLiveSessionContext,
): Promise<unknown> {
  const tool = GPT_LIVE_TOOLS.find((entry) => entry.name === name);
  if (!tool) {
    return { ok: false, error: 'unknown_tool', message: `Unsupported tool "${name}".` };
  }
  return tool.execute(args, ctx);
}
