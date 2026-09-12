/**
 * Domain contract — GPT-Live route_encounters wrapper.
 *
 * Page call chain (Maps drawer — binding):
 *   location/{slug} → location-area/{area} → mapdata.aggregateArea(area, slug, version)
 *   → summarizeAreas; wild leaderboards exclude isStatic / swarm chips.
 *
 * Version is required (single PokéAPI version, e.g. firered). MAX chance is per
 * method bucket inside aggregateArea — never sum across rods or time slots.
 * Static/gift/trade rows stay out of the wild list.
 *
 * Must-not: invented encounter tables or bucket math diverging from mapdata.
 *
 * Test map: route-encounters.test.ts, mapdata.test.ts, spoken-eval.test.ts.
 */
import { cachedJson } from '@/lib/pokeapi';
import { aggregateArea, type AreaGroup, type EncounterEntry } from '@/lib/mapdata';
import type { GptLiveSessionContext } from './session-context';
import { resolveApiVersion, resolveMapNode } from './map-node';
import { resolveGame, type GameHit } from './species-stats';

export const ROUTE_ENCOUNTERS = 'route_encounters';

export const ROUTE_ENCOUNTERS_TOOL = {
  type: 'function' as const,
  name: ROUTE_ENCOUNTERS,
  description:
    'List wild Pokémon on a route or map location for a specific game version. Use for what-spawns-here questions.',
  strict: true as const,
  parameters: {
    type: 'object' as const,
    properties: {
      route_query: {
        type: 'string',
        description: 'Route or location as spoken, e.g. Route 1, Vertania-Wald, kanto-route-3.',
      },
      game: {
        type: ['string', 'null'],
        description:
          'Game version required, e.g. firered, red. Null only when the session already has a game.',
      },
    },
    required: ['route_query', 'game'],
    additionalProperties: false as const,
  },
};

const API = 'https://pokeapi.co/api/v2';

interface NamedRef {
  name: string;
  url: string;
}

interface LocationResponse {
  areas: NamedRef[];
}

interface LocationAreaResponse {
  id: number;
  name: string;
  pokemon_encounters: Array<{
    pokemon: NamedRef;
    version_details: Array<{
      version: NamedRef;
      max_chance: number;
      encounter_details: Array<{
        chance: number;
        min_level: number;
        max_level: number;
        method: NamedRef;
        condition_values?: NamedRef[];
      }>;
    }>;
  }>;
}

export interface RouteWildRow {
  slug: string;
  pokemonId: number;
  methods: string[];
  maxChance: number;
  minLevel: number;
  maxLevel: number;
  areaLabel: string;
}

export interface RouteSpecialRow extends RouteWildRow {
  kind: 'static' | 'gift' | 'trade' | 'other';
}

export type RouteEncountersOk = {
  ok: true;
  region: string;
  nodeId: string;
  label: string;
  game: GameHit;
  version: string;
  wild: RouteWildRow[];
  special: RouteSpecialRow[];
  spoken_hint: string;
};

export type RouteEncountersErr = {
  ok: false;
  error: 'unknown_route' | 'unknown_game' | 'no_location' | 'no_encounters' | 'invalid_arguments';
  message: string;
  game?: GameHit;
};

export type RouteEncountersResult = RouteEncountersOk | RouteEncountersErr;

function stringArg(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

async function loadAreaGroups(locationSlug: string, version: string): Promise<AreaGroup[]> {
  const loc = await cachedJson<LocationResponse>(`mapdata:loc:${locationSlug}`, `${API}/location/${locationSlug}`);
  if (!loc.areas?.length) return [];
  const areas = await Promise.all(
    loc.areas.map((area) =>
      cachedJson<LocationAreaResponse>(`mapdata:area:${area.name}`, `${API}/location-area/${area.name}`),
    ),
  );
  return areas
    .map((area) => aggregateArea(area, locationSlug, version))
    .filter((group) => group.entries.length > 0);
}

function flattenWild(groups: AreaGroup[]): RouteWildRow[] {
  const out: RouteWildRow[] = [];
  for (const group of groups) {
    for (const entry of group.entries) {
      if (entry.isStatic || entry.methodChip === 'swarm') continue;
      out.push(rowFromEntry(entry, group.areaLabel));
    }
  }
  return out.sort((a, b) => b.maxChance - a.maxChance || a.slug.localeCompare(b.slug));
}

function flattenSpecial(groups: AreaGroup[]): RouteSpecialRow[] {
  const out: RouteSpecialRow[] = [];
  for (const group of groups) {
    for (const entry of group.entries) {
      if (!entry.isStatic) continue;
      out.push({ ...rowFromEntry(entry, group.areaLabel), kind: 'static' });
    }
  }
  return out.sort((a, b) => a.slug.localeCompare(b.slug));
}

function rowFromEntry(entry: EncounterEntry, areaLabel: string): RouteWildRow {
  return {
    slug: entry.slug,
    pokemonId: entry.pokemonId,
    methods: entry.methods,
    maxChance: entry.maxChance,
    minLevel: entry.minLevel,
    maxLevel: entry.maxLevel,
    areaLabel,
  };
}

function spokenHint(input: {
  label: string;
  version: string;
  wild: RouteWildRow[];
  special: RouteSpecialRow[];
}): string {
  const top = input.wild[0];
  const wildLine = top
    ? `Most common wild: ${top.slug} (${top.maxChance}% ${top.methods.join('/')}).`
    : 'No wild spawns for this version.';
  const specialLine = input.special.length ? `${input.special.length} static/gift encounter(s) listed separately.` : '';
  return `${input.label}, ${input.version}: ${wildLine} ${specialLine}`.trim();
}

export async function routeEncountersPair(routeQuery: string, gameQuery: string): Promise<RouteEncountersResult> {
  const hit = resolveMapNode(routeQuery);
  if (!hit) {
    return {
      ok: false,
      error: 'unknown_route',
      message: `No map location matched "${routeQuery.trim()}". Try Route 1, Viridian Forest, or a node id like kanto-route-3.`,
    };
  }

  const game = resolveGame(gameQuery);
  if (!game) {
    return {
      ok: false,
      error: 'unknown_game',
      message: `No game matched "${gameQuery.trim()}". Try firered, red, gold, or another version name.`,
    };
  }

  const version = resolveApiVersion(gameQuery, game);
  if (!version) {
    return {
      ok: false,
      error: 'invalid_arguments',
      message: 'A specific game version is required (e.g. firered, red).',
      game,
    };
  }

  if (!hit.node.locationSlug) {
    return {
      ok: false,
      error: 'no_location',
      message: `${hit.node.label} has no PokéAPI location slug.`,
      game,
    };
  }

  let groups: AreaGroup[];
  try {
    groups = await loadAreaGroups(hit.node.locationSlug, version);
  } catch {
    return {
      ok: false,
      error: 'no_encounters',
      message: `Encounter data for ${hit.node.label} (${version}) is unavailable right now.`,
      game,
    };
  }

  const wild = flattenWild(groups);
  const special = flattenSpecial(groups);
  if (wild.length === 0 && special.length === 0) {
    return {
      ok: false,
      error: 'no_encounters',
      message: `No encounters for ${hit.node.label} in ${version}.`,
      game,
    };
  }

  return {
    ok: true,
    region: hit.region.region,
    nodeId: hit.node.id,
    label: hit.node.label,
    game,
    version,
    wild,
    special,
    spoken_hint: spokenHint({ label: hit.node.label, version, wild, special }),
  };
}

export async function routeEncountersFromArgs(
  args: unknown,
  ctx: Pick<GptLiveSessionContext, 'gameQuery'> = {},
): Promise<RouteEncountersResult> {
  if (!args || typeof args !== 'object') {
    return { ok: false, error: 'invalid_arguments', message: 'Expected an object with route_query and game.' };
  }
  const rec = args as Record<string, unknown>;
  const routeQuery = stringArg(rec.route_query);
  const gameQuery = stringArg(rec.game) || ctx.gameQuery || '';
  if (!routeQuery.trim() || !gameQuery.trim()) {
    return {
      ok: false,
      error: 'invalid_arguments',
      message: 'route_query is required. game is required unless the session already has a game.',
    };
  }
  return routeEncountersPair(routeQuery, gameQuery);
}
