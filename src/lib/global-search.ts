/* Global header search — Pokémon + items + maps only.
 * Pure catalog + query helpers; the UI (SearchCommand) owns debounce and chrome. */
import Fuse from 'fuse.js';
import type { DexIndexEntry } from './types';
import type { RegionMap } from './regions';
import { hasItemPage, itemDetailPath } from './seo-items';
import { ROUTE_PAGES, routePagePath } from './seo-routes-kanto';
import { JOHTO_ROUTE_PAGES, johtoRoutePagePath } from './seo-routes-johto';
import { HOENN_ROUTE_PAGES, hoennRoutePagePath } from './seo-routes-hoenn';
import { SINNOH_ROUTE_PAGES, sinnohRoutePagePath } from './seo-routes-sinnoh';

export const MAX_SEARCH_RESULTS = 8;
export const RECENT_KEY = 'pdx:recent-searches';

const ATLAS = new Set(['kanto', 'johto', 'hoenn', 'sinnoh', 'unova']);

export type SearchKind = 'pokemon' | 'item' | 'map';

export interface SearchDoc {
  kind: SearchKind;
  key: string;
  labelEn: string;
  labelDe: string;
  slug: string;
  idStr: string;
  num?: string;
  searchText?: string;
  pokemonId?: number;
  itemSlug?: string;
  regionId?: string;
  nodeId?: string;
}

export type RecentEntry =
  | { kind: 'pokemon'; id: number; label: string }
  | { kind: 'item'; slug: string; label: string }
  | { kind: 'map'; region: string; nodeId?: string; label: string };

function searchTextOf(...parts: Array<string | undefined>): string {
  return parts
    .filter((p): p is string => !!p)
    .map((p) => p.replace(/[.’']/g, '').replace(/[-_]+/g, ' '))
    .join(' ');
}

export function docsFromPokemon(
  index: DexIndexEntry[],
  deName: (id: number) => string | null,
): SearchDoc[] {
  return index.map((e) => {
    const labelDe = deName(e.id) ?? e.label;
    return {
      kind: 'pokemon',
      key: `pokemon:${e.id}`,
      labelEn: e.label,
      labelDe,
      slug: e.name,
      idStr: String(e.id),
      num: e.num.replace(/^#/, ''),
      searchText: searchTextOf(e.label, labelDe, e.name),
      pokemonId: e.id,
    };
  });
}

export function docsFromItems(
  items: Array<{ slug: string; nameEn: string; nameDe?: string; skip?: boolean }>,
): SearchDoc[] {
  return items
    .filter((i) => !i.skip && !i.nameEn.startsWith('★'))
    .map((i) => {
      const labelDe = i.nameDe ?? i.nameEn;
      return {
        kind: 'item',
        key: `item:${i.slug}`,
        labelEn: i.nameEn,
        labelDe,
        slug: i.slug,
        idStr: i.slug,
        searchText: searchTextOf(i.nameEn, labelDe, i.slug),
        itemSlug: i.slug,
      };
    });
}

export function docsFromMaps(regions: readonly RegionMap[]): SearchDoc[] {
  const docs: SearchDoc[] = [];
  for (const r of regions) {
    if (!ATLAS.has(r.region)) continue;
    const regionDe = r.nameDe ?? r.name;
    docs.push({
      kind: 'map',
      key: `map:${r.region}`,
      labelEn: r.name,
      labelDe: regionDe,
      slug: r.region,
      idStr: r.region,
      searchText: searchTextOf(r.name, regionDe, r.region),
      regionId: r.region,
    });
    for (const n of r.nodes) {
      const nodeDe = n.nameDe ?? n.label;
      docs.push({
        kind: 'map',
        key: `map:${r.region}:${n.id}`,
        labelEn: n.label,
        labelDe: nodeDe,
        slug: n.id,
        idStr: n.id,
        searchText: searchTextOf(n.label, nodeDe, n.id, r.name, regionDe),
        regionId: r.region,
        nodeId: n.id,
      });
    }
  }
  return docs;
}

export function searchDocs(query: string, docs: SearchDoc[], limit = MAX_SEARCH_RESULTS): SearchDoc[] {
  const q = query.trim().replace(/^#/, '');
  if (!q) return [];
  const asNum = Number(q);
  if (Number.isInteger(asNum) && asNum > 0) {
    const exact = docs.filter((d) => d.kind === 'pokemon' && d.pokemonId === asNum);
    if (exact.length > 0) return exact.slice(0, limit);
  }
  const fuse = new Fuse(docs, {
    keys: [
      { name: 'labelEn', weight: 2 },
      { name: 'labelDe', weight: 2 },
      { name: 'searchText', weight: 1.5 },
      { name: 'slug', weight: 1.5 },
      { name: 'idStr', weight: 1 },
      { name: 'num', weight: 1 },
    ],
    threshold: 0.3,
    ignoreLocation: true,
  });
  return fuse.search(q).slice(0, limit).map((r) => r.item);
}

function mapNodePath(lang: 'de' | 'en', regionId: string, nodeId: string): string {
  if (regionId === 'kanto' && ROUTE_PAGES.has(nodeId)) return routePagePath(lang, nodeId);
  if (regionId === 'johto' && JOHTO_ROUTE_PAGES.has(nodeId)) return johtoRoutePagePath(lang, nodeId);
  if (regionId === 'hoenn' && HOENN_ROUTE_PAGES.has(nodeId)) return hoennRoutePagePath(lang, nodeId);
  if (regionId === 'sinnoh' && SINNOH_ROUTE_PAGES.has(nodeId)) return sinnohRoutePagePath(lang, nodeId);
  return `/maps/${regionId}?node=${encodeURIComponent(nodeId)}`;
}

export function pathForDoc(doc: SearchDoc, lang: 'de' | 'en'): string {
  if (doc.kind === 'pokemon' && doc.pokemonId != null) return `/pokemon/${doc.pokemonId}`;
  if (doc.kind === 'item' && doc.itemSlug) {
    return hasItemPage(doc.itemSlug) ? itemDetailPath(lang, doc.itemSlug) : `/items?item=${encodeURIComponent(doc.itemSlug)}`;
  }
  if (doc.kind === 'map' && doc.regionId) {
    return doc.nodeId ? mapNodePath(lang, doc.regionId, doc.nodeId) : `/maps/${doc.regionId}`;
  }
  return '/';
}

export function parseRecentEntry(raw: unknown): RecentEntry | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const label = typeof r.label === 'string' ? r.label : '';
  if (r.kind === 'item' && typeof r.slug === 'string') {
    return { kind: 'item', slug: r.slug, label: label || r.slug };
  }
  if (r.kind === 'map' && typeof r.region === 'string') {
    return {
      kind: 'map',
      region: r.region,
      nodeId: typeof r.nodeId === 'string' ? r.nodeId : undefined,
      label: label || r.region,
    };
  }
  if (typeof r.id === 'number' && (r.kind === 'pokemon' || r.kind == null)) {
    return { kind: 'pokemon', id: r.id, label: label || String(r.id) };
  }
  return null;
}

export function recentKey(entry: RecentEntry): string {
  if (entry.kind === 'pokemon') return `pokemon:${entry.id}`;
  if (entry.kind === 'item') return `item:${entry.slug}`;
  return `map:${entry.region}${entry.nodeId ? `:${entry.nodeId}` : ''}`;
}

export function pushRecent(entry: RecentEntry, existing: RecentEntry[]): RecentEntry[] {
  const key = recentKey(entry);
  return [entry, ...existing.filter((e) => recentKey(e) !== key)].slice(0, 5);
}

export function recentFromDoc(doc: SearchDoc, label: string): RecentEntry {
  if (doc.kind === 'item' && doc.itemSlug) return { kind: 'item', slug: doc.itemSlug, label };
  if (doc.kind === 'map' && doc.regionId) {
    return { kind: 'map', region: doc.regionId, nodeId: doc.nodeId, label };
  }
  return { kind: 'pokemon', id: doc.pokemonId ?? 0, label };
}

export function pathForRecent(entry: RecentEntry, lang: 'de' | 'en'): string {
  if (entry.kind === 'pokemon') return `/pokemon/${entry.id}`;
  if (entry.kind === 'item') {
    return hasItemPage(entry.slug) ? itemDetailPath(lang, entry.slug) : `/items?item=${encodeURIComponent(entry.slug)}`;
  }
  return entry.nodeId ? mapNodePath(lang, entry.region, entry.nodeId) : `/maps/${entry.region}`;
}
