/* Johto route/location SEO pages — curated slug mapping for
 * /de/maps/johto/:slug · /en/maps/johto/:slug.
 *
 * Mirror of src/lib/seo-routes-kanto.ts for the Johto rollout (HGSS data,
 * framing "Datenstand HeartGold"). German slugs use the official German
 * HGSS location names (Steineichenwald, See des Zorns); route numbers keep
 * the numeric slug in both locales (Route 29).
 *
 * A page exists only for nodes with wild HeartGold encounter data — the
 * generator (scripts/generate-pokemon-seo.mjs johto) writes
 * src/data/routes-johto.json and the routesJohto block of
 * src/data/seo-meta-gen.json; JOHTO_ROUTE_PAGES is the intersection of this
 * mapping with that data. Keep the slug table in sync with the Johto table
 * in scripts/generate-pokemon-seo.mjs.
 *
 * LIGHT BY DESIGN: imported by src/lib/seo.ts (entry bundle) — no data
 * imports here beyond the tiny generated meta summary. */

import META_GEN from '@/data/seo-meta-gen.json';

/** Curated localized slugs per Johto node (nodeId → { de, en }). */
export const JOHTO_ROUTE_SLUGS: Record<string, { de: string; en: string }> = {
  'new-bark-town': { de: 'neuborkia', en: 'new-bark-town' },
  'johto-route-29': { de: 'route-29', en: 'route-29' },
  'cherrygrove-city': { de: 'rosalia-city', en: 'cherrygrove-city' },
  'johto-route-30': { de: 'route-30', en: 'route-30' },
  'johto-route-31': { de: 'route-31', en: 'route-31' },
  'violet-city': { de: 'viola-city', en: 'violet-city' },
  'sprout-tower': { de: 'knofensa-turm', en: 'sprout-tower' },
  'johto-route-32': { de: 'route-32', en: 'route-32' },
  'union-cave': { de: 'einheitstunnel', en: 'union-cave' },
  'ruins-of-alph': { de: 'alph-ruinen', en: 'ruins-of-alph' },
  'johto-route-33': { de: 'route-33', en: 'route-33' },
  'azalea-town': { de: 'azalea-city', en: 'azalea-town' },
  'slowpoke-well': { de: 'flegmon-brunnen', en: 'slowpoke-well' },
  'ilex-forest': { de: 'steineichenwald', en: 'ilex-forest' },
  'johto-route-34': { de: 'route-34', en: 'route-34' },
  'goldenrod-city': { de: 'dukatia-city', en: 'goldenrod-city' },
  'johto-route-35': { de: 'route-35', en: 'route-35' },
  'national-park': { de: 'nationalpark', en: 'national-park' },
  'johto-route-36': { de: 'route-36', en: 'route-36' },
  'ecruteak-city': { de: 'teak-city', en: 'ecruteak-city' },
  'burned-tower': { de: 'turmruine', en: 'burned-tower' },
  'johto-route-37': { de: 'route-37', en: 'route-37' },
  'johto-route-38': { de: 'route-38', en: 'route-38' },
  'johto-route-39': { de: 'route-39', en: 'route-39' },
  'olivine-city': { de: 'oliviana-city', en: 'olivine-city' },
  'johto-route-40': { de: 'route-40', en: 'route-40' },
  'johto-route-41': { de: 'route-41', en: 'route-41' },
  'whirl-islands': { de: 'strudelinseln', en: 'whirl-islands' },
  'cianwood-city': { de: 'anemonia-city', en: 'cianwood-city' },
  'bell-tower': { de: 'glockenturm', en: 'bell-tower' },
  'johto-route-42': { de: 'route-42', en: 'route-42' },
  'mt-mortar': { de: 'kesselberg', en: 'mt-mortar' },
  'mahogany-town': { de: 'mahagonia-city', en: 'mahogany-town' },
  'johto-route-43': { de: 'route-43', en: 'route-43' },
  'lake-of-rage': { de: 'see-des-zorns', en: 'lake-of-rage' },
  'johto-route-44': { de: 'route-44', en: 'route-44' },
  'ice-path': { de: 'eispfad', en: 'ice-path' },
  'blackthorn-city': { de: 'ebenholz-city', en: 'blackthorn-city' },
  'dragons-den': { de: 'drachenhoehle', en: 'dragons-den' },
  'johto-route-45': { de: 'route-45', en: 'route-45' },
  'dark-cave': { de: 'dunkelhoehle', en: 'dark-cave' },
  'johto-route-46': { de: 'route-46', en: 'route-46' },
  'mt-silver': { de: 'silberberg', en: 'mt-silver' },
  'johto-route-47': { de: 'route-47', en: 'route-47' },
  'cliff-cave': { de: 'felsenhoehle', en: 'cliff-cave' },
  'johto-route-48': { de: 'route-48', en: 'route-48' },
  'johto-safari-zone': { de: 'safari-zone', en: 'safari-zone' },
};

export interface JohtoRouteMetaGen {
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

const META_ROUTES_JOHTO =
  (META_GEN as unknown as { routesJohto?: Record<string, JohtoRouteMetaGen> }).routesJohto ?? {};

/** nodeIds that actually have an SEO page (mapping ∩ generated encounter data). */
export const JOHTO_ROUTE_PAGES: ReadonlySet<string> = new Set(
  Object.keys(JOHTO_ROUTE_SLUGS).filter((id) => META_ROUTES_JOHTO[id]),
);

/** Generated meta summary for a node (undefined when the node has no page). */
export function johtoRouteMetaGen(nodeId: string): JohtoRouteMetaGen | undefined {
  return META_ROUTES_JOHTO[nodeId];
}

/** Resolve a URL param ('steineichenwald' | 'ilex-forest' | …) to a nodeId. */
export function resolveJohtoRouteParam(param: string | undefined): string | null {
  if (!param) return null;
  const p = param.toLowerCase();
  for (const [nodeId, slugs] of Object.entries(JOHTO_ROUTE_SLUGS)) {
    if (!JOHTO_ROUTE_PAGES.has(nodeId)) continue;
    if (slugs.de === p || slugs.en === p) return nodeId;
  }
  return null;
}

/** Locale-aware path of a route page: /maps/johto/steineichenwald (de) · /maps/johto/ilex-forest (en). */
export function johtoRoutePagePath(lang: 'de' | 'en', nodeId: string): string {
  const s = JOHTO_ROUTE_SLUGS[nodeId];
  return `/maps/johto/${lang === 'de' ? s.de : s.en}`;
}

/** Display name of a node (sync, from the generated meta summary). */
export function johtoRouteNodeName(nodeId: string, lang: 'de' | 'en'): string {
  const m = META_ROUTES_JOHTO[nodeId];
  return (lang === 'de' ? m?.nameDe : m?.nameEn) ?? nodeId;
}

/**
 * Map a locale-stripped app path between locales (for canonical/hreflang):
 * '/maps/johto/steineichenwald' ↔ '/maps/johto/ilex-forest'.
 * Unknown paths pass through unchanged.
 */
export function localizeJohtoRoutePath(rest: string, lang: 'de' | 'en'): string {
  const m = rest.match(/^\/maps\/johto\/([^/]+)$/);
  if (m) {
    const nodeId = resolveJohtoRouteParam(m[1]);
    if (nodeId) return johtoRoutePagePath(lang, nodeId);
  }
  return rest;
}
