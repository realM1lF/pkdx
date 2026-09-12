/** Shared map-node + API-version resolution for GPT-Live location tools. */
import { gameSlugOf } from '@/lib/edition-nav';
import { REGIONS, type MapNode, type RegionMap } from '@/lib/regions';
import type { GameHit } from './species-stats';

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

function slugify(raw: string): string {
  return fold(raw).replace(/\s+/g, '-');
}

export interface MapNodeHit {
  region: RegionMap;
  node: MapNode;
}

/** Resolve a spoken route/location to a shared RegionMap node. */
export function resolveMapNode(query: string): MapNodeHit | null {
  const raw = query.trim();
  if (!raw) return null;
  const folded = fold(raw);
  const slugged = slugify(raw);

  for (const region of REGIONS) {
    for (const node of region.nodes) {
      if (node.id === slugged || fold(node.id) === folded) return { region, node };
      if (fold(node.label) === folded) return { region, node };
      if (node.nameDe && fold(node.nameDe) === folded) return { region, node };
    }
  }

  const routeMatch = folded.match(/^route\s*(\d+)$/);
  if (routeMatch) {
    const num = routeMatch[1];
    const hits = REGIONS.flatMap((region) =>
      region.nodes.filter((node) => node.id.endsWith(`-route-${num}`)).map((node) => ({ region, node })),
    );
    if (hits.length === 1) return hits[0]!;
  }

  return null;
}

/** PokéAPI version slug for map/encounter filters (firered, red, …). */
export function resolveApiVersion(gameQuery: string, game: GameHit): string {
  return gameSlugOf(gameQuery) ?? gameSlugOf(game.versionGroup) ?? game.games[0] ?? '';
}
