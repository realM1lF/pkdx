/**
 * Domain contract — GPT-Live where_to_find wrapper.
 *
 * Page call chain (WhereToFind panel — binding):
 *   cachedJson pokemon/{id}/encounters → wherefind.aggregate(areas, version|games)
 *   → wild rows vs special (gift/static/trade) sections.
 *
 * Uses resolveSpecies + resolveGame. Version filter follows the selected edition
 * (game.games[] when a version group is named).
 *
 * Must-not: invented spawn tables or MAX logic diverging from wherefind.aggregate.
 *
 * Test map: where-to-find.test.ts, where-to-find panel tests, spoken-eval.test.ts.
 */
import { cachedJson } from '@/lib/pokeapi';
import { aggregate, mapsPath, rankableWildRows, type EncounterAreaEntry, type WhereRow } from '@/lib/wherefind';
import type { GptLiveSessionContext } from './session-context';
import {
  resolveGame,
  resolveSpecies,
  type GameHit,
  type SpeciesHit,
} from './species-stats';

export const WHERE_TO_FIND = 'where_to_find';

export const WHERE_TO_FIND_TOOL = {
  type: 'function' as const,
  name: WHERE_TO_FIND,
  description:
    'Find where a species appears in the wild or as a gift/static encounter for a named game. Use for location, route, or catch-area questions.',
  strict: true as const,
  parameters: {
    type: 'object' as const,
    properties: {
      species_query: {
        type: 'string',
        description: 'Species as spoken, e.g. Taubsi, Pidgey, 16.',
      },
      game: {
        type: ['string', 'null'],
        description:
          'Game or edition, e.g. firered, rote edition. Null when the session already has a game.',
      },
    },
    required: ['species_query', 'game'],
    additionalProperties: false as const,
  },
};

const TOP_WILD = 8;

export type WhereToFindOk = {
  ok: true;
  species: SpeciesHit;
  game: GameHit;
  wild: WhereRow[];
  special: WhereRow[];
  spoken_hint: string;
};

export type WhereToFindErr = {
  ok: false;
  error: 'unknown_species' | 'unknown_game' | 'not_in_game' | 'no_encounters' | 'invalid_arguments';
  message: string;
  species?: SpeciesHit;
  game?: GameHit;
};

export type WhereToFindResult = WhereToFindOk | WhereToFindErr;

function stringArg(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function spokenHint(input: {
  species: SpeciesHit;
  game: GameHit;
  wild: WhereRow[];
  special: WhereRow[];
}): string {
  if (input.wild.length === 0 && input.special.length === 0) {
    return `${input.species.nameEn} has no mapped encounters in ${input.game.label}.`;
  }
  const ranked = rankableWildRows(input.wild);
  const topWild = ranked.slice(0, 2);
  const wildLine =
    topWild.length > 0
      ? `Wild spots: ${topWild.map((row) => `${row.label}${row.maxChance ? ` (${row.maxChance}%)` : ''}`).join('; ')}.`
      : input.wild.length > 0
        ? 'Wild rows exist but none are rankable map nodes for this edition.'
        : 'No wild rows for this edition.';
  const specialLine =
    input.special.length > 0
      ? `${input.special.length} gift/static/trade location(s) also listed.`
      : '';
  return `${input.species.nameEn} in ${input.game.label}: ${wildLine} ${specialLine}`.trim();
}

export async function whereToFindPair(speciesQuery: string, gameQuery: string): Promise<WhereToFindResult> {
  const species = resolveSpecies(speciesQuery);
  if (!species) {
    return {
      ok: false,
      error: 'unknown_species',
      message: `No species matched "${speciesQuery.trim()}". Use a German or English Pokédex name or a national-dex number.`,
    };
  }

  const game = resolveGame(gameQuery);
  if (!game) {
    return {
      ok: false,
      error: 'unknown_game',
      message: `No game matched "${gameQuery.trim()}". Try red, firered, gold, or another version-group name.`,
      species,
    };
  }

  let areas: EncounterAreaEntry[];
  try {
    areas = await cachedJson<EncounterAreaEntry[]>(
      `encounters:${species.id}`,
      `https://pokeapi.co/api/v2/pokemon/${species.id}/encounters`,
    );
  } catch {
    return {
      ok: false,
      error: 'no_encounters',
      message: `Encounter data for ${species.nameEn} is unavailable right now.`,
      species,
      game,
    };
  }

  if (!areas.length) {
    return {
      ok: false,
      error: 'no_encounters',
      message: `${species.nameEn} / ${species.nameDe} has no PokéAPI encounter rows.`,
      species,
      game,
    };
  }

  const rows = aggregate(areas, game.games);
  const wild = rankableWildRows(rows.filter((r) => !r.special)).slice(0, TOP_WILD);
  const special = rows.filter((r) => r.special);

  if (wild.length === 0 && special.length === 0) {
    return {
      ok: false,
      error: 'not_in_game',
      message: `${species.nameEn} / ${species.nameDe} has no encounters mapped for ${game.label}.`,
      species,
      game,
    };
  }

  return {
    ok: true,
    species,
    game,
    wild,
    special,
    spoken_hint: spokenHint({ species, game, wild, special }),
  };
}

export async function whereToFindFromArgs(
  args: unknown,
  ctx: Pick<GptLiveSessionContext, 'gameQuery'> = {},
): Promise<WhereToFindResult> {
  if (!args || typeof args !== 'object') {
    return { ok: false, error: 'invalid_arguments', message: 'Expected an object with species_query and game.' };
  }
  const rec = args as Record<string, unknown>;
  const speciesQuery = stringArg(rec.species_query);
  const gameQuery = stringArg(rec.game) || ctx.gameQuery || '';
  if (!speciesQuery.trim() || !gameQuery.trim()) {
    return {
      ok: false,
      error: 'invalid_arguments',
      message: 'species_query is required. game is required unless the session already has a game.',
    };
  }
  return whereToFindPair(speciesQuery, gameQuery);
}

/** Stable maps deep-link for a where-row (mirrors WhereToFind panel). */
export function whereRowMapsPath(row: WhereRow, version: string | null): string | null {
  if (!row.region || !row.nodeId) return null;
  return mapsPath(row.region.region, row.nodeId, version);
}
