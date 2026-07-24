/* Item SEO registry (SEO rollout) — curated data for the 25 item detail
 * pages (/de/items/:deSlug · /en/items/:slug).
 *
 * DATA PROVENANCE (src/data/items-seo.json, generated once + committed):
 *   - names / categories / cost / flavor texts: src/data/desc/items.json
 *     (PokéAPI-derived artifact, build-desc-data.mjs)
 *   - linking-cord: not in the desc artifact (PokéAPI has no localized
 *     names); DE name "Linkkabel" is the official PLA German name
 *   - effectEn: PokéAPI /item/{slug} effect_entries.short_effect (live-
 *     verified); effectDe is our translation of that same fact
 *   - locationsFrlg: src/data/enriched/kanto.json (FireRed/LeafGreen item
 *     balls/hidden/given) + notes from src/data/items-kanto.json; node
 *     display names from src/data/i18n/de/locations.json — nothing else is
 *     claimed, items without FRLG data simply have no location section
 *   - evolutionTargets (dex ids): PokéAPI effect_entries species lists */
import itemsSeoJson from '@/data/items-seo.json';

export interface ItemLocation {
  node: string;
  kind: 'given' | 'hidden' | 'ball';
  nameEn: string;
  nameDe: string;
  noteEn?: string;
  noteDe?: string;
}

export interface ItemSeoEntry {
  slug: string; // PokéAPI slug = EN url slug
  deSlug: string; // German url slug
  nameEn: string;
  nameDe: string;
  category: string;
  cost?: number;
  flavorEn?: string;
  flavorDe?: string;
  effectEn: string;
  effectDe: string;
  locationsFrlg?: ItemLocation[];
  evolutionTargets?: number[];
  evolutionKind?: 'stone' | 'trade' | 'trade-replacement';
}

export const ITEMS_SEO = itemsSeoJson as unknown as Record<string, ItemSeoEntry>;

export const ITEM_SEO_LIST: ItemSeoEntry[] = Object.values(ITEMS_SEO);

const BY_DE_SLUG = new Map(ITEM_SEO_LIST.map((e) => [e.deSlug, e.slug]));

/** Resolve a URL param (EN slug or DE slug) to the PokéAPI item slug. */
export function resolveItemParam(param: string | undefined): string | null {
  if (!param) return null;
  const p = param.toLowerCase();
  if (ITEMS_SEO[p]) return p;
  return BY_DE_SLUG.get(p) ?? null;
}

/** Locale-aware item detail path: /items/ep-teiler (de) · /items/exp-share (en). */
export function itemDetailPath(lang: 'de' | 'en', slug: string): string {
  const e = ITEMS_SEO[slug];
  return `/items/${lang === 'de' ? e.deSlug : e.slug}`;
}

/** True when an item (PokéAPI slug) has a detail page — used by the lexicon. */
export function hasItemPage(slug: string): boolean {
  return slug in ITEMS_SEO;
}

/**
 * Map a locale-stripped item path between locales (canonical/hreflang):
 * '/items/ep-teiler' ↔ '/items/exp-share'. Unknown slugs pass through.
 */
export function localizeItemPath(rest: string, lang: 'de' | 'en'): string {
  const m = rest.match(/^\/items\/([^/]+)$/);
  if (!m) return rest;
  const slug = resolveItemParam(m[1]);
  return slug ? itemDetailPath(lang, slug) : rest;
}
