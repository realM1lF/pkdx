/**
 * Domain contract — GPT-Live nuzlocke_can_catch wrapper.
 *
 * Read-only catch validation via validateLogDraft. Route resolution stays scoped
 * to the run's effective region (guided or manual customRoutes).
 *
 * Must-not: logEncounter, invented Dupes/SoulLink logic, or global map guessing.
 */
import type { LogValidationError } from '@/lib/nuzlocke-rules';
import { validateLogDraft } from '@/lib/nuzlocke-rules';
import { nodeName } from '@/lib/regions';
import type { GptLiveSessionContext } from './session-context';
import { resolveSpecies, type SpeciesHit } from './species-stats';
import {
  isNoRunError,
  playerBySlot,
  requireRun,
  resolveRouteInRun,
  type NuzlockeNoRunErr,
} from './nuzlocke-run-context';

export const NUZLOCKE_CAN_CATCH = 'nuzlocke_can_catch';

export const NUZLOCKE_CAN_CATCH_TOOL = {
  type: 'function' as const,
  name: NUZLOCKE_CAN_CATCH,
  description:
    'Check whether a species can be logged on a route for the loaded Nuzlocke run. Uses the same validation codes as the run logger (duplicate, speciesDupe, nicknameRequired, giftRoute, unknownRoute).',
  strict: true as const,
  parameters: {
    type: 'object' as const,
    properties: {
      species_query: {
        type: 'string',
        description: 'Species as spoken, e.g. Bisasam, Pidgey, 16.',
      },
      route_query: {
        type: 'string',
        description: 'Route or location as spoken within the run region, e.g. Route 1, kanto-route-1.',
      },
      player_slot: {
        type: ['integer', 'null'],
        description: 'Player slot 1–4. Null defaults to slot 1.',
      },
      level: {
        type: ['integer', 'null'],
        description: 'Encounter level for the draft check. Null defaults to 5.',
      },
      is_shiny: {
        type: ['boolean', 'null'],
        description: 'Whether the encounter is shiny. Null defaults to false.',
      },
    },
    required: ['species_query', 'route_query', 'player_slot', 'level', 'is_shiny'],
    additionalProperties: false as const,
  },
};

export type NuzlockeCanCatchOk = {
  ok: true;
  canCatch: boolean;
  validationError: LogValidationError | null;
  species: SpeciesHit;
  routeKey: string;
  routeLabel: string;
  playerId: string;
  playerName: string;
  spoken_hint: string;
};

export type NuzlockeCanCatchErr =
  | NuzlockeNoRunErr
  | {
      ok: false;
      error: 'unknown_species' | 'unknown_route' | 'unknown_player' | 'invalid_arguments';
      message: string;
      species?: SpeciesHit;
      routeQuery?: string;
    };

export type NuzlockeCanCatchResult = NuzlockeCanCatchOk | NuzlockeCanCatchErr;

function intArg(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? Math.round(value) : fallback;
}

function boolArg(value: unknown, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

function validationMessage(code: LogValidationError): string {
  switch (code) {
    case 'duplicate':
      return 'That player already resolved this route.';
    case 'speciesDupe':
      return 'Dupes Clause blocks this evolution line in the run.';
    case 'nicknameRequired':
      return 'Nicknames are required for catches in this run.';
    case 'giftRoute':
      return 'This route is treated as a special location, not a wild catch slot.';
    case 'unknownRoute':
      return 'That route is not part of this run.';
    default:
      return code;
  }
}

function spokenHint(input: {
  species: SpeciesHit;
  routeLabel: string;
  playerName: string;
  canCatch: boolean;
  validationError: LogValidationError | null;
}): string {
  if (input.canCatch) {
    return `${input.species.nameEn} can be caught on ${input.routeLabel} for ${input.playerName}.`;
  }
  const reason = input.validationError ? validationMessage(input.validationError) : 'Catch is blocked.';
  return `${input.species.nameEn} on ${input.routeLabel} for ${input.playerName}: ${reason}`;
}

export async function nuzlockeCanCatchPair(
  state: NonNullable<GptLiveSessionContext['run']>,
  args: {
    speciesQuery: string;
    routeQuery: string;
    playerSlot: number | null;
    level: number;
    isShiny: boolean;
  },
): Promise<NuzlockeCanCatchResult> {
  const species = resolveSpecies(args.speciesQuery);
  if (!species) {
    return {
      ok: false,
      error: 'unknown_species',
      message: `No species matched "${args.speciesQuery.trim()}".`,
    };
  }

  const routeNode = resolveRouteInRun(state, args.routeQuery);
  if (!routeNode) {
    return {
      ok: false,
      error: 'unknown_route',
      message: `No route in this run matched "${args.routeQuery.trim()}".`,
      species,
      routeQuery: args.routeQuery,
    };
  }

  const player = playerBySlot(state, args.playerSlot);
  if (!player) {
    return {
      ok: false,
      error: 'unknown_player',
      message: 'This run has no player for the requested slot.',
      species,
    };
  }

  const validationError = await validateLogDraft(state, {
    playerId: player.id,
    routeKey: routeNode.id,
    pokemonId: species.id,
    nickname: null,
    level: args.level,
    status: 'caught',
    isShiny: args.isShiny,
  }, routeNode);

  const routeLabel = nodeName(routeNode, 'en');
  const canCatch = validationError === null;

  return {
    ok: true,
    canCatch,
    validationError,
    species,
    routeKey: routeNode.id,
    routeLabel,
    playerId: player.id,
    playerName: player.name,
    spoken_hint: spokenHint({
      species,
      routeLabel,
      playerName: player.name,
      canCatch,
      validationError,
    }),
  };
}

export async function nuzlockeCanCatchFromArgs(
  args: unknown,
  ctx: GptLiveSessionContext,
): Promise<NuzlockeCanCatchResult> {
  if (!args || typeof args !== 'object') {
    return { ok: false, error: 'invalid_arguments', message: 'Tool arguments must be an object.' };
  }
  const row = args as Record<string, unknown>;
  const speciesQuery = typeof row.species_query === 'string' ? row.species_query : '';
  const routeQuery = typeof row.route_query === 'string' ? row.route_query : '';
  if (!speciesQuery.trim() || !routeQuery.trim()) {
    return { ok: false, error: 'invalid_arguments', message: 'species_query and route_query are required.' };
  }

  const stateOrErr = requireRun(ctx);
  if (isNoRunError(stateOrErr)) return stateOrErr;

  return nuzlockeCanCatchPair(stateOrErr, {
    speciesQuery,
    routeQuery,
    playerSlot: typeof row.player_slot === 'number' ? row.player_slot : null,
    level: intArg(row.level, 5),
    isShiny: boolArg(row.is_shiny, false),
  });
}
