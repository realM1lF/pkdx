/* MyPokePanion — Shared Region Data Contract (maps.md §0)
 * SINGLE SOURCE OF TRUTH for map geometry AND the Nuzlocke route list.
 * node.id values are stable route keys (`kanto-route-1` …) — do NOT rename.
 * Consumers: /maps pages (Phase 04), Nuzlocke (Phase 05). */

import kantoJson from '@/data/regions/kanto.json';
import johtoJson from '@/data/regions/johto.json';
import hoennJson from '@/data/regions/hoenn.json';
import sinnohJson from '@/data/regions/sinnoh.json';
import unovaJson from '@/data/regions/unova.json';

export type RegionId = 'kanto' | 'johto' | 'hoenn' | 'sinnoh' | 'unova';
export type NodeKind = 'city' | 'route' | 'dungeon' | 'special';
export type EdgeKind = 'land' | 'water' | 'tunnel';
export type LabelPos = 'top' | 'bottom' | 'left' | 'right';

export interface MapNode {
  /** kebab key, e.g. 'kanto-route-1' — USED AS route_key EVERYWHERE */
  id: string;
  label: string;
  /** German display name (build-time artifact from PokéAPI) — label stays EN */
  nameDe?: string;
  kind: NodeKind;
  /** authored, in region viewBox units */
  x: number;
  y: number;
  /** canonical game-progression index (1..n) — drives Nuzlocke timeline */
  order: number;
  /** PokéAPI /location slug — null for decor nodes */
  locationSlug: string | null;
  /** e.g. cerulean-cave — rendered dimmer, ordered last */
  postGame?: boolean;
  /** authored label offset (default 'bottom') */
  labelPos?: LabelPos;
}

export interface MapEdge {
  from: string;
  to: string;
  kind: EdgeKind;
}

export interface RegionMap {
  region: RegionId;
  name: string;
  /** German region display name — `name` stays EN */
  nameDe?: string;
  gen: string;
  /** signature energy hex (maps.md §0 accent table) */
  accent: string;
  viewBox: string;
  versions: string[];
  defaultVersion: string;
  /** build-time audit: share of nodes with encounter data (0..1) */
  coverage: number;
  /** unique species encounterable across all versions (audit) */
  speciesCount: number;
  nodes: MapNode[];
  edges: MapEdge[];
}

export type CoverageTier = 'FULL' | 'PARTIAL' | 'SOON';

/* ---------- index ---------- */

const ALL: RegionMap[] = [
  kantoJson as RegionMap,
  johtoJson as RegionMap,
  hoennJson as RegionMap,
  sinnohJson as RegionMap,
  unovaJson as RegionMap,
];

/** The 5-region atlas index, in canonical order. */
export const REGIONS: readonly RegionMap[] = ALL;

const BY_ID = new Map<RegionId, RegionMap>(ALL.map((r) => [r.region, r]));

/** Localized node label — route keys (`id`) and EN `label` are the data model;
 *  `nameDe` is display-only. */
export function nodeName(node: MapNode, lang: string): string {
  return lang.startsWith('de') ? (node.nameDe ?? node.label) : node.label;
}

/** Localized region name — display-only. */
export function regionName(region: RegionMap, lang: string): string {
  return lang.startsWith('de') ? (region.nameDe ?? region.name) : region.name;
}

/** Lookup a region by id; undefined for unknown ids (e.g. /maps/kalos → 404 state). */
export function regionById(id: string | undefined | null): RegionMap | undefined {
  if (!id) return undefined;
  return BY_ID.get(id as RegionId);
}

export function isRegionId(id: string | undefined | null): id is RegionId {
  return !!id && BY_ID.has(id as RegionId);
}

/* ---------- helpers ---------- */

/** Nodes sorted by canonical game-progression order (Nuzlocke timeline order). */
export function routeOrder(region: RegionMap): MapNode[] {
  return [...region.nodes].sort((a, b) => a.order - b.order);
}

/** Node lookup map for O(1) id resolution. */
export function nodeIndex(region: RegionMap): Map<string, MapNode> {
  return new Map(region.nodes.map((n) => [n.id, n]));
}

/** Coverage tier per maps.md §0: FULL ≥ 95% · PARTIAL ≥ 50% · SOON < 50%. */
export function coverageTier(region: RegionMap): CoverageTier {
  if (region.coverage >= 0.95) return 'FULL';
  if (region.coverage >= 0.5) return 'PARTIAL';
  return 'SOON';
}

/** "r,g,b" triplet of a region accent, for rgba() composition. */
export function accentRgb(hex: string): string {
  const h = hex.replace('#', '');
  const n = parseInt(h, 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
}

/** viewBox parsed to [minX, minY, w, h]. */
export function viewBoxParts(region: RegionMap): [number, number, number, number] {
  const p = region.viewBox.split(/\s+/).map(Number);
  return [p[0] ?? 0, p[1] ?? 0, p[2] ?? 1200, p[3] ?? 840];
}

/** Total location count across the atlas (used on /maps header stats). */
export const TOTAL_LOCATIONS = ALL.reduce((sum, r) => sum + r.nodes.length, 0);

/** Version display label: 'firered' → 'FIRE RED', 'black-2' → 'BLACK 2'. */
export function versionLabel(v: string): string {
  return v.replace(/-/g, ' ').toUpperCase();
}

/** Short chip label: 'firered' → 'FR', 'leafgreen' → 'LG', others uppercase. */
const SHORT_VERSIONS: Record<string, string> = {
  firered: 'FR',
  leafgreen: 'LG',
  heartgold: 'HG',
  soulsilver: 'SS',
  'omega-ruby': 'OR',
  'alpha-sapphire': 'AS',
  'black-2': 'BLK 2',
  'white-2': 'WHT 2',
};

export function versionChipLabel(v: string): string {
  return SHORT_VERSIONS[v] ?? v.toUpperCase();
}
