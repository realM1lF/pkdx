/* Sinnoh route/location SEO pages — curated slug mapping for
 * /de/maps/sinnoh/:slug · /en/maps/sinnoh/:slug.
 *
 * Mirror of src/lib/seo-routes-kanto.ts for the Sinnoh rollout (DPPt data,
 * framing "Datenstand Platin"). German slugs use the official German DPPt
 * location names (Ewigwald, Höhle der Umkehr); route numbers keep the
 * numeric slug in both locales (Route 201).
 *
 * A page exists only for nodes with wild Platinum encounter data — the
 * generator (scripts/generate-pokemon-seo.mjs sinnoh) writes
 * src/data/routes-sinnoh.json and the routesSinnoh block of
 * src/data/seo-meta-gen.json; SINNOH_ROUTE_PAGES is the intersection of this
 * mapping with that data. Keep the slug table in sync with the Sinnoh table
 * in scripts/generate-pokemon-seo.mjs.
 *
 * LIGHT BY DESIGN: imported by src/lib/seo.ts (entry bundle) — no data
 * imports here beyond the tiny generated meta summary. */

import META_GEN from '@/data/seo-meta-gen.json';

/** Curated localized slugs per Sinnoh node (nodeId → { de, en }). */
export const SINNOH_ROUTE_SLUGS: Record<string, { de: string; en: string }> = {
  'twinleaf-town': { de: 'zweiblattdorf', en: 'twinleaf-town' },
  'sinnoh-route-201': { de: 'route-201', en: 'route-201' },
  'sandgem-town': { de: 'sandgemme', en: 'sandgem-town' },
  'sinnoh-route-202': { de: 'route-202', en: 'route-202' },
  'jubilife-city': { de: 'jubelstadt', en: 'jubilife-city' },
  'sinnoh-route-203': { de: 'route-203', en: 'route-203' },
  'oreburgh-city': { de: 'erzelingen', en: 'oreburgh-city' },
  'oreburgh-mine': { de: 'erzelingen-mine', en: 'oreburgh-mine' },
  'sinnoh-route-204': { de: 'route-204', en: 'route-204' },
  'ravaged-path': { de: 'verwuesteter-pfad', en: 'ravaged-path' },
  'floaroma-town': { de: 'flori', en: 'floaroma-town' },
  'sinnoh-route-205': { de: 'route-205', en: 'route-205' },
  'valley-windworks': { de: 'windkraftwerk', en: 'valley-windworks' },
  'eterna-forest': { de: 'ewigwald', en: 'eterna-forest' },
  'eterna-city': { de: 'ewigenau', en: 'eterna-city' },
  'sinnoh-route-206': { de: 'route-206', en: 'route-206' },
  'wayward-cave': { de: 'bizarre-hoehle', en: 'wayward-cave' },
  'sinnoh-route-207': { de: 'route-207', en: 'route-207' },
  'mt-coronet': { de: 'kraterberg', en: 'mt-coronet' },
  'sinnoh-route-208': { de: 'route-208', en: 'route-208' },
  'hearthome-city': { de: 'herzhofen', en: 'hearthome-city' },
  'sinnoh-route-209': { de: 'route-209', en: 'route-209' },
  'lost-tower': { de: 'turm-der-ruhenden', en: 'lost-tower' },
  'solaceon-town': { de: 'trostu', en: 'solaceon-town' },
  'solaceon-ruins': { de: 'trostu-ruinen', en: 'solaceon-ruins' },
  'sinnoh-route-210': { de: 'route-210', en: 'route-210' },
  'celestic-town': { de: 'elyses', en: 'celestic-town' },
  'sinnoh-route-211': { de: 'route-211', en: 'route-211' },
  'sinnoh-route-212': { de: 'route-212', en: 'route-212' },
  'pastoria-city': { de: 'weideburg', en: 'pastoria-city' },
  'great-marsh': { de: 'grossmoor', en: 'great-marsh' },
  'sinnoh-route-213': { de: 'route-213', en: 'route-213' },
  'sinnoh-route-214': { de: 'route-214', en: 'route-214' },
  'veilstone-city': { de: 'schleiede', en: 'veilstone-city' },
  'sinnoh-route-215': { de: 'route-215', en: 'route-215' },
  'sinnoh-route-218': { de: 'route-218', en: 'route-218' },
  'canalave-city': { de: 'fleetburg', en: 'canalave-city' },
  'iron-island': { de: 'eiseninsel', en: 'iron-island' },
  'sinnoh-route-216': { de: 'route-216', en: 'route-216' },
  'sinnoh-route-217': { de: 'route-217', en: 'route-217' },
  'snowpoint-city': { de: 'blizzach', en: 'snowpoint-city' },
  'spear-pillar': { de: 'speersaeule', en: 'spear-pillar' },
  'sunyshore-city': { de: 'sonnewik', en: 'sunyshore-city' },
  'sinnoh-victory-road': { de: 'siegesstrasse', en: 'victory-road' },
  'turnback-cave': { de: 'hoehle-der-umkehr', en: 'turnback-cave' },
  'stark-mountain': { de: 'kahlberg', en: 'stark-mountain' },
  'sinnoh-route-219': { de: 'route-219', en: 'route-219' },
  'sinnoh-route-220': { de: 'route-220', en: 'route-220' },
  'sinnoh-route-221': { de: 'route-221', en: 'route-221' },
  'sinnoh-route-222': { de: 'route-222', en: 'route-222' },
  'sinnoh-route-223': { de: 'route-223', en: 'route-223' },
  'sinnoh-route-224': { de: 'route-224', en: 'route-224' },
  'fight-area': { de: 'kampfzone', en: 'fight-area' },
  'sinnoh-route-225': { de: 'route-225', en: 'route-225' },
  'survival-area': { de: 'ueberlebensareal', en: 'survival-area' },
  'sinnoh-route-226': { de: 'route-226', en: 'route-226' },
  'sinnoh-route-227': { de: 'route-227', en: 'route-227' },
  'sinnoh-route-228': { de: 'route-228', en: 'route-228' },
  'resort-area': { de: 'erholungsgebiet', en: 'resort-area' },
  'sinnoh-route-229': { de: 'route-229', en: 'route-229' },
  'sinnoh-route-230': { de: 'route-230', en: 'route-230' },
  'distortion-world': { de: 'zerrwelt', en: 'distortion-world' },
};

export interface SinnohRouteMetaGen {
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

const META_ROUTES_SINNOH =
  (META_GEN as unknown as { routesSinnoh?: Record<string, SinnohRouteMetaGen> }).routesSinnoh ?? {};

/** nodeIds that actually have an SEO page (mapping ∩ generated encounter data). */
export const SINNOH_ROUTE_PAGES: ReadonlySet<string> = new Set(
  Object.keys(SINNOH_ROUTE_SLUGS).filter((id) => META_ROUTES_SINNOH[id]),
);

/** Generated meta summary for a node (undefined when the node has no page). */
export function sinnohRouteMetaGen(nodeId: string): SinnohRouteMetaGen | undefined {
  return META_ROUTES_SINNOH[nodeId];
}

/** Resolve a URL param ('ewigwald' | 'eterna-forest' | …) to a nodeId. */
export function resolveSinnohRouteParam(param: string | undefined): string | null {
  if (!param) return null;
  const p = param.toLowerCase();
  for (const [nodeId, slugs] of Object.entries(SINNOH_ROUTE_SLUGS)) {
    if (!SINNOH_ROUTE_PAGES.has(nodeId)) continue;
    if (slugs.de === p || slugs.en === p) return nodeId;
  }
  return null;
}

/** Locale-aware path of a route page: /maps/sinnoh/ewigwald (de) · /maps/sinnoh/eterna-forest (en). */
export function sinnohRoutePagePath(lang: 'de' | 'en', nodeId: string): string {
  const s = SINNOH_ROUTE_SLUGS[nodeId];
  return `/maps/sinnoh/${lang === 'de' ? s.de : s.en}`;
}

/** Display name of a node (sync, from the generated meta summary). */
export function sinnohRouteNodeName(nodeId: string, lang: 'de' | 'en'): string {
  const m = META_ROUTES_SINNOH[nodeId];
  return (lang === 'de' ? m?.nameDe : m?.nameEn) ?? nodeId;
}

/**
 * Map a locale-stripped app path between locales (for canonical/hreflang):
 * '/maps/sinnoh/ewigwald' ↔ '/maps/sinnoh/eterna-forest'.
 * Unknown paths pass through unchanged.
 */
export function localizeSinnohRoutePath(rest: string, lang: 'de' | 'en'): string {
  const m = rest.match(/^\/maps\/sinnoh\/([^/]+)$/);
  if (m) {
    const nodeId = resolveSinnohRouteParam(m[1]);
    if (nodeId) return sinnohRoutePagePath(lang, nodeId);
  }
  return rest;
}
