/* Kanto route/location SEO pages (SEO rollout part 2) — curated slug mapping
 * for /de/maps/kanto/:slug · /en/maps/kanto/:slug.
 *
 * German slugs use the official German location names (Vertania-Wald, not
 * Viridian Forest) because DE search traffic uses German names
 * (research/seo-wiki-2026/05-fragen-maps-routen.md §d).
 *
 * A page exists only for nodes with FRLG encounter data — the generator
 * (scripts/generate-pokemon-seo.mjs) writes src/data/routes-kanto.json;
 * ROUTE_PAGES is the intersection of this mapping with that data. Keep the
 * slug table in sync with ROUTE_SLUGS in scripts/generate-pokemon-seo.mjs.
 *
 * LIGHT BY DESIGN: imported by src/lib/seo.ts (entry bundle) — no data
 * imports here beyond the tiny generated meta summary. */

import META_GEN from '@/data/seo-meta-gen.json';

export interface RouteSlugEntry {
  nodeId: string;
  de: string;
  en: string;
}

/** Curated localized slugs per Kanto node (nodeId → { de, en }). */
export const KANTO_ROUTE_SLUGS: Record<string, { de: string; en: string }> = {
  'pallet-town': { de: 'alabastia', en: 'pallet-town' },
  'kanto-route-1': { de: 'route-1', en: 'route-1' },
  'viridian-city': { de: 'vertania-city', en: 'viridian-city' },
  'kanto-route-22': { de: 'route-22', en: 'route-22' },
  'kanto-route-2': { de: 'route-2', en: 'route-2' },
  'viridian-forest': { de: 'vertania-wald', en: 'viridian-forest' },
  'digletts-cave': { de: 'digda-hoehle', en: 'digletts-cave' },
  'pewter-city': { de: 'marmoria-city', en: 'pewter-city' },
  'kanto-route-3': { de: 'route-3', en: 'route-3' },
  'mt-moon': { de: 'mondberg', en: 'mt-moon' },
  'kanto-route-4': { de: 'route-4', en: 'route-4' },
  'cerulean-city': { de: 'azuria-city', en: 'cerulean-city' },
  'kanto-route-24': { de: 'route-24', en: 'route-24' },
  'kanto-route-25': { de: 'route-25', en: 'route-25' },
  'cerulean-cave': { de: 'azuria-hoehle', en: 'cerulean-cave' },
  'kanto-route-5': { de: 'route-5', en: 'route-5' },
  'kanto-route-6': { de: 'route-6', en: 'route-6' },
  'vermilion-city': { de: 'orania-city', en: 'vermilion-city' },
  'kanto-route-11': { de: 'route-11', en: 'route-11' },
  'kanto-route-9': { de: 'route-9', en: 'route-9' },
  'kanto-route-10': { de: 'route-10', en: 'route-10' },
  'rock-tunnel': { de: 'felstunnel', en: 'rock-tunnel' },
  'power-plant': { de: 'kraftwerk', en: 'power-plant' },
  'lavender-town': { de: 'lavandia', en: 'lavender-town' },
  'pokemon-tower': { de: 'pokemon-turm', en: 'pokemon-tower' },
  'kanto-route-8': { de: 'route-8', en: 'route-8' },
  'kanto-route-7': { de: 'route-7', en: 'route-7' },
  'celadon-city': { de: 'prismania-city', en: 'celadon-city' },
  'kanto-route-16': { de: 'route-16', en: 'route-16' },
  'kanto-route-17': { de: 'route-17', en: 'route-17' },
  'kanto-route-18': { de: 'route-18', en: 'route-18' },
  'fuchsia-city': { de: 'fuchsania-city', en: 'fuchsia-city' },
  'safari-zone': { de: 'safari-zone', en: 'safari-zone' },
  'kanto-route-12': { de: 'route-12', en: 'route-12' },
  'kanto-route-13': { de: 'route-13', en: 'route-13' },
  'kanto-route-14': { de: 'route-14', en: 'route-14' },
  'kanto-route-15': { de: 'route-15', en: 'route-15' },
  'kanto-route-19': { de: 'route-19', en: 'route-19' },
  'kanto-route-20': { de: 'route-20', en: 'route-20' },
  'seafoam-islands': { de: 'seeschauminseln', en: 'seafoam-islands' },
  'cinnabar-island': { de: 'zinnoberinsel', en: 'cinnabar-island' },
  'kanto-route-21': { de: 'route-21', en: 'route-21' },
  'kanto-route-23': { de: 'route-23', en: 'route-23' },
  'victory-road': { de: 'siegesstrasse', en: 'victory-road' },
  'indigo-plateau': { de: 'indigo-plateau', en: 'indigo-plateau' },
  'saffron-city': { de: 'saffronia-city', en: 'saffron-city' },
};

export interface RouteMetaGen {
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

const META_ROUTES = META_GEN.routes as unknown as Record<string, RouteMetaGen>;

/** nodeIds that actually have an SEO page (mapping ∩ generated encounter data). */
export const ROUTE_PAGES: ReadonlySet<string> = new Set(
  Object.keys(KANTO_ROUTE_SLUGS).filter((id) => META_ROUTES[id]),
);

/** Generated meta summary for a node (undefined when the node has no page). */
export function routeMetaGen(nodeId: string): RouteMetaGen | undefined {
  return META_ROUTES[nodeId];
}

/** Resolve a URL param ('vertania-wald' | 'viridian-forest' | …) to a nodeId. */
export function resolveRouteParam(param: string | undefined): string | null {
  if (!param) return null;
  const p = param.toLowerCase();
  for (const [nodeId, slugs] of Object.entries(KANTO_ROUTE_SLUGS)) {
    if (!ROUTE_PAGES.has(nodeId)) continue;
    if (slugs.de === p || slugs.en === p) return nodeId;
  }
  return null;
}

/** Locale-aware path of a route page: /maps/kanto/vertania-wald (de) · /maps/kanto/viridian-forest (en). */
export function routePagePath(lang: 'de' | 'en', nodeId: string): string {
  const s = KANTO_ROUTE_SLUGS[nodeId];
  return `/maps/kanto/${lang === 'de' ? s.de : s.en}`;
}

/** Display name of a node (sync, from the generated meta summary). */
export function routeNodeName(nodeId: string, lang: 'de' | 'en'): string {
  const m = META_ROUTES[nodeId];
  return (lang === 'de' ? m?.nameDe : m?.nameEn) ?? nodeId;
}

/**
 * Map a locale-stripped app path between locales (for canonical/hreflang):
 * '/maps/kanto/vertania-wald' ↔ '/maps/kanto/viridian-forest'.
 * Unknown paths pass through unchanged.
 */
export function localizeRoutePath(rest: string, lang: 'de' | 'en'): string {
  const m = rest.match(/^\/maps\/kanto\/([^/]+)$/);
  if (m) {
    const nodeId = resolveRouteParam(m[1]);
    if (nodeId) return routePagePath(lang, nodeId);
  }
  return rest;
}
