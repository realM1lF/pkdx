/* Hoenn route/location SEO pages — curated slug mapping for
 * /de/maps/hoenn/:slug · /en/maps/hoenn/:slug.
 *
 * Mirror of src/lib/seo-routes-kanto.ts for the Hoenn rollout (RSE data,
 * framing "Datenstand Smaragd"). German slugs use the official German RSE
 * location names (Blütenburg City, Metaflurtunnel); route numbers keep the
 * numeric slug in both locales (Route 101).
 *
 * A page exists only for nodes with encounter data — the generator
 * (scripts/generate-pokemon-seo.mjs hoenn) writes src/data/routes-hoenn.json
 * and the routesHoenn block of src/data/seo-meta-gen.json; HOENN_ROUTE_PAGES
 * is the intersection of this mapping with that data. Keep the slug table
 * in sync with the Hoenn table in scripts/generate-pokemon-seo.mjs.
 *
 * LIGHT BY DESIGN: imported by src/lib/seo.ts (entry bundle) — no data
 * imports here beyond the tiny generated meta summary. */

import META_GEN from '@/data/seo-meta-gen.json';

/** Curated localized slugs per Hoenn node (nodeId → { de, en }). */
export const HOENN_ROUTE_SLUGS: Record<string, { de: string; en: string }> = {
  'littleroot-town': { de: 'wurzelheim', en: 'littleroot-town' },
  'hoenn-route-101': { de: 'route-101', en: 'route-101' },
  'oldale-town': { de: 'rosaltstadt', en: 'oldale-town' },
  'hoenn-route-102': { de: 'route-102', en: 'route-102' },
  'petalburg-city': { de: 'bluetenburg-city', en: 'petalburg-city' },
  'hoenn-route-104': { de: 'route-104', en: 'route-104' },
  'petalburg-woods': { de: 'bluetenburgwald', en: 'petalburg-woods' },
  'rustboro-city': { de: 'metarost-city', en: 'rustboro-city' },
  'hoenn-route-116': { de: 'route-116', en: 'route-116' },
  'rusturf-tunnel': { de: 'metaflurtunnel', en: 'rusturf-tunnel' },
  'hoenn-route-105': { de: 'route-105', en: 'route-105' },
  'dewford-town': { de: 'faustauhaven', en: 'dewford-town' },
  'granite-cave': { de: 'granithoehle', en: 'granite-cave' },
  'hoenn-route-108': { de: 'route-108', en: 'route-108' },
  'hoenn-route-109': { de: 'route-109', en: 'route-109' },
  'slateport-city': { de: 'graphitport-city', en: 'slateport-city' },
  'hoenn-route-110': { de: 'route-110', en: 'route-110' },
  'mauville-city': { de: 'malvenfroh-city', en: 'mauville-city' },
  'verdanturf-town': { de: 'wiesenflur', en: 'verdanturf-town' },
  'hoenn-route-117': { de: 'route-117', en: 'route-117' },
  'hoenn-route-111': { de: 'route-111', en: 'route-111' },
  'hoenn-route-112': { de: 'route-112', en: 'route-112' },
  'fiery-path': { de: 'feuriger-pfad', en: 'fiery-path' },
  'hoenn-route-113': { de: 'route-113', en: 'route-113' },
  'fallarbor-town': { de: 'laubwechselfeld', en: 'fallarbor-town' },
  'meteor-falls': { de: 'meteorfaelle', en: 'meteor-falls' },
  'hoenn-route-114': { de: 'route-114', en: 'route-114' },
  'mt-chimney': { de: 'schlotberg', en: 'mt-chimney' },
  'lavaridge-town': { de: 'bad-lavastadt', en: 'lavaridge-town' },
  'hoenn-route-103': { de: 'route-103', en: 'route-103' },
  'hoenn-route-118': { de: 'route-118', en: 'route-118' },
  'hoenn-route-119': { de: 'route-119', en: 'route-119' },
  'fortree-city': { de: 'baumhausen-city', en: 'fortree-city' },
  'hoenn-route-120': { de: 'route-120', en: 'route-120' },
  'hoenn-route-121': { de: 'route-121', en: 'route-121' },
  'hoenn-safari-zone': { de: 'safari-zone', en: 'safari-zone' },
  'lilycove-city': { de: 'seegrasulb-city', en: 'lilycove-city' },
  'mt-pyre': { de: 'pyroberg', en: 'mt-pyre' },
  'hoenn-route-124': { de: 'route-124', en: 'route-124' },
  'mossdeep-city': { de: 'moosbach-city', en: 'mossdeep-city' },
  'shoal-cave': { de: 'kuestenhoehle', en: 'shoal-cave' },
  'sootopolis-city': { de: 'xeneroville', en: 'sootopolis-city' },
  'hoenn-route-128': { de: 'route-128', en: 'route-128' },
  'sky-pillar': { de: 'himmelturm', en: 'sky-pillar' },
  'hoenn-route-129': { de: 'route-129', en: 'route-129' },
  'pacifidlog-town': { de: 'flossbrunn', en: 'pacifidlog-town' },
  'hoenn-victory-road': { de: 'siegesstrasse', en: 'victory-road' },
  'ever-grande-city': { de: 'prachtpolis-city', en: 'ever-grande-city' },
};

export interface HoennRouteMetaGen {
  slugDe: string;
  slugEn: string;
  nameDe: string;
  nameEn: string;
  topId: number | null;
  topNameDe: string | null;
  topNameEn: string | null;
  topChance: number | null;
  speciesCount: number;
}

const META_ROUTES_HOENN =
  (META_GEN as unknown as { routesHoenn?: Record<string, HoennRouteMetaGen> }).routesHoenn ?? {};

/** nodeIds that actually have an SEO page (mapping ∩ generated encounter data). */
export const HOENN_ROUTE_PAGES: ReadonlySet<string> = new Set(
  Object.keys(HOENN_ROUTE_SLUGS).filter((id) => META_ROUTES_HOENN[id]),
);

/** Generated meta summary for a node (undefined when the node has no page). */
export function hoennRouteMetaGen(nodeId: string): HoennRouteMetaGen | undefined {
  return META_ROUTES_HOENN[nodeId];
}

/** Resolve a URL param ('bluetenburgwald' | 'petalburg-woods' | …) to a nodeId. */
export function resolveHoennRouteParam(param: string | undefined): string | null {
  if (!param) return null;
  const p = param.toLowerCase();
  for (const [nodeId, slugs] of Object.entries(HOENN_ROUTE_SLUGS)) {
    if (!HOENN_ROUTE_PAGES.has(nodeId)) continue;
    if (slugs.de === p || slugs.en === p) return nodeId;
  }
  return null;
}

/** Locale-aware path of a route page: /maps/hoenn/bluetenburgwald (de) · /maps/hoenn/petalburg-woods (en). */
export function hoennRoutePagePath(lang: 'de' | 'en', nodeId: string): string {
  const s = HOENN_ROUTE_SLUGS[nodeId];
  return `/maps/hoenn/${lang === 'de' ? s.de : s.en}`;
}

/** Display name of a node (sync, from the generated meta summary). */
export function hoennRouteNodeName(nodeId: string, lang: 'de' | 'en'): string {
  const m = META_ROUTES_HOENN[nodeId];
  return (lang === 'de' ? m?.nameDe : m?.nameEn) ?? nodeId;
}

/**
 * Map a locale-stripped app path between locales (for canonical/hreflang):
 * '/maps/hoenn/bluetenburgwald' ↔ '/maps/hoenn/petalburg-woods'.
 * Unknown paths pass through unchanged.
 */
export function localizeHoennRoutePath(rest: string, lang: 'de' | 'en'): string {
  const m = rest.match(/^\/maps\/hoenn\/([^/]+)$/);
  if (m) {
    const nodeId = resolveHoennRouteParam(m[1]);
    if (nodeId) return hoennRoutePagePath(lang, nodeId);
  }
  return rest;
}
