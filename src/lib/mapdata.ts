/* MyPokePanion — map runtime data (maps.md §0)
 * Per node: /location → areas[] → /location-area → pokemon_encounters,
 * aggregated per selected version. Batched (concurrency 6), cached through
 * the shared cachedJson SWR store (7-day TTL), progressive per-node arrival.
 * Items come from curated src/data/items-{region}.json — honest `0 ITEMS`
 * when nothing is curated. */

import { useEffect, useMemo, useRef, useState } from 'react';
import { cachedJson } from './pokeapi';
import { nameOfItem, nameOfMove } from './i18n-data';
import type { Lang } from './i18n-data';
import type { RegionMap } from './regions';

import itemsKanto from '@/data/items-kanto.json';
import itemsJohto from '@/data/items-johto.json';
import itemsHoenn from '@/data/items-hoenn.json';
import itemsSinnoh from '@/data/items-sinnoh.json';
import itemsUnova from '@/data/items-unova.json';
import enrichedKanto from '@/data/enriched/kanto.json';
import enrichedHoenn from '@/data/enriched/hoenn.json';

const API = 'https://pokeapi.co/api/v2';

/* ---------- PokéAPI payload shapes ---------- */

interface NamedRef {
  name: string;
  url: string;
}

interface LocationResponse {
  id: number;
  name: string;
  areas: NamedRef[];
}

interface EncounterDetail {
  chance: number;
  min_level: number;
  max_level: number;
  method: NamedRef;
  condition_values?: NamedRef[];
}

interface VersionEncounter {
  version: NamedRef;
  max_chance: number;
  encounter_details: EncounterDetail[];
}

interface PokemonEncounter {
  pokemon: NamedRef;
  version_details: VersionEncounter[];
}

interface LocationAreaResponse {
  id: number;
  name: string;
  pokemon_encounters: PokemonEncounter[];
}

/* ---------- aggregated model ---------- */

export type MethodBucket = 'WALK' | 'SURF' | 'FISH' | 'OTHER';
/** Row-level chip when OTHER is more specific than the filter bucket. */
export type MethodChip = 'swarm' | 'radio' | 'headbutt' | 'feebas';

export const METHOD_BUCKETS: MethodBucket[] = ['WALK', 'SURF', 'FISH', 'OTHER'];

/* Method census across all 5 region versions (PokéAPI scan, 2024):
 * water variants ('surf-spots', 'super-rod-spots'),
 * tree variants ('honey-tree' singular, gen-2 'headbutt-low/normal/high')
 * and one-off event methods ('pokeflute', 'npc-trade', 'squirt-bottle',
 * 'devon-scope', 'feebas-tile-fishing') all exist in the mapped areas —
 * classify them correctly or they leak into WALK / FISH leaderboards. */
const SURF_METHODS = new Set(['surf', 'surf-spots']);
const FISH_METHODS = new Set([
  'old-rod', 'good-rod', 'super-rod', 'fish', 'fishing',
  'super-rod-spots',
]);
const WALK_METHODS = new Set([
  'walk', 'dark-grass', 'rustling-grass', 'grass-spots', 'cave-spots', 'bridge-spots',
  'pokeradar', 'roaming', 'seaweed', 'honey-trees', 'honey-tree',
]);
/** gift / one-off static / trade / tile-only — never wild (Poké Flute Snorlax,
 * in-game trades, Sudowoodo, Devon-Scope Kecleon, Feebas tiles included). */
export const STATIC_METHODS = new Set([
  'gift', 'gift-egg', 'only-one', 'static', 'pokeflute', 'npc-trade',
  'squirt-bottle', 'devon-scope', 'feebas-tile-fishing',
]);

export function methodBucket(method: string): MethodBucket {
  if (SURF_METHODS.has(method)) return 'SURF';
  if (FISH_METHODS.has(method)) return 'FISH';
  if (WALK_METHODS.has(method)) return 'WALK';
  return 'OTHER';
}

interface ExclusiveAxes {
  time: string;
  swarm: string;
  radio: string;
  headbutt: string;
}

function conditionNames(det: EncounterDetail): string[] {
  return (det.condition_values ?? []).map((c) => c.name);
}

/** Mutually exclusive axes inside one method. Empty = default group. */
function exclusiveAxes(names: string[]): ExclusiveAxes {
  const axes: ExclusiveAxes = { time: '', swarm: '', radio: '', headbutt: '' };
  for (const raw of names) {
    const n = raw.toLowerCase();
    if (n === 'time-morning' || n === 'morning') axes.time = 'morning';
    else if (n === 'time-day' || n === 'day') axes.time = 'day';
    else if (n === 'time-night' || n === 'night') axes.time = 'night';
    else if (n === 'swarm-yes' || n === 'swarm') axes.swarm = 'yes';
    else if (n === 'swarm-no') axes.swarm = 'no';
    else if (n.startsWith('radio-') || n === 'radio-hoenn' || n === 'radio-sinnoh') {
      axes.radio = n.replace(/^radio-/, '') || n;
    } else if (n === 'headbutt-tree-common') axes.headbutt = 'common';
    else if (n === 'headbutt-tree-rare') axes.headbutt = 'rare';
  }
  return axes;
}

function exclusiveGroupKey(method: string, names: string[]): string {
  const a = exclusiveAxes(names);
  return `${method}|t:${a.time}|s:${a.swarm}|r:${a.radio}|h:${a.headbutt}`;
}

function displayOf(
  method: string,
  names: string[],
): { bucket: MethodBucket; chip?: MethodChip; isStatic: boolean } {
  const a = exclusiveAxes(names);
  if (method === 'feebas-tile-fishing') {
    return { bucket: 'OTHER', chip: 'feebas', isStatic: true };
  }
  if (STATIC_METHODS.has(method)) {
    return { bucket: 'OTHER', isStatic: true };
  }
  if (method.startsWith('headbutt') || a.headbutt) {
    return { bucket: 'OTHER', chip: 'headbutt', isStatic: false };
  }
  if (a.swarm === 'yes' || method === 'swarm') return { bucket: 'OTHER', chip: 'swarm', isStatic: false };
  if (a.radio) return { bucket: 'OTHER', chip: 'radio', isStatic: false };
  return { bucket: methodBucket(method), isStatic: false };
}

export interface EncounterEntry {
  pokemonId: number;
  slug: string;
  methods: MethodBucket[];
  /** best encounter chance (0..100) in this area for the selected version */
  maxChance: number;
  minLevel: number;
  maxLevel: number;
  /** gift / one-off static encounter */
  isStatic: boolean;
  /** chance per method bucket (ScoutTooltip / methodTop must not use species-max) */
  chanceByMethod: Partial<Record<MethodBucket, number>>;
  /** swarm / radio / headbutt / feebas — own chip, not folded into WALK */
  methodChip?: MethodChip;
}

export interface AreaGroup {
  areaSlug: string;
  /** short floor/section label — '1F', 'B1F', 'MAIN' */
  areaLabel: string;
  entries: EncounterEntry[];
}

export type NodeDataStatus = 'loaded' | 'empty' | 'error';

export interface NodeMapData {
  nodeId: string;
  status: NodeDataStatus;
  areas: AreaGroup[];
  /** unique species across areas (selected version) */
  pokemonCount: number;
  /** best single-species rate across areas */
  bestRate: number;
  /** top rate per method bucket (for tooltip dots) */
  methodTop: Partial<Record<MethodBucket, number>>;
}

export interface CuratedItemNote {
  de?: string;
  en: string;
}

export interface CuratedItem {
  itemSlug: string;
  name: string;
  /** bilingual curation note (new regions) — legacy entries stay a plain EN string */
  note: CuratedItemNote | string;
  pocket: string;
  hidden?: boolean;
  /** TM/HM entries: the taught move — display name comes from the i18n move data */
  moveSlug?: string;
}

/** locale-aware curation note; EN fallback when no translation exists */
export function noteOfItem(item: CuratedItem, lang: Lang): string {
  if (typeof item.note === 'string') return item.note;
  return (lang === 'de' && item.note.de) || item.note.en;
}

/** display name for a curated item — TM/HM machines become "TM18 (Regentanz)"
 *  from the i18n move data instead of the generic "Tm Water" sprite name */
export function displayNameOfItem(item: CuratedItem, lang: Lang): string {
  const machine = /^(?:TM|HM)\d+/.exec(item.name)?.[0];
  if (machine && item.moveSlug) return `${machine} (${nameOfMove(item.moveSlug, lang)})`;
  return nameOfItem(item.itemSlug, lang);
}

/* ---------- curated items ---------- */

const ITEMS_BY_REGION: Record<string, Record<string, CuratedItem[]>> = {
  kanto: itemsKanto as Record<string, CuratedItem[]>,
  johto: itemsJohto as Record<string, CuratedItem[]>,
  hoenn: itemsHoenn as Record<string, CuratedItem[]>,
  sinnoh: itemsSinnoh as Record<string, CuratedItem[]>,
  unova: itemsUnova as Record<string, CuratedItem[]>,
};

/* Second item source: the SEO enrichment dumps (pret/pokefirered for Kanto,
 * Bulbapedia-curated for Hoenn) keyed by node id. Map drawer and SEO pages
 * must show the UNION of both sources — historically they each read only one
 * and contradicted each other (item-consistency fix, audit classes A–C). */
export interface EnrichedItem {
  slug: string;
  kind: 'ball' | 'hidden' | 'given';
}

const ENRICHED_ITEMS_BY_REGION: Record<string, Record<string, EnrichedItem[]>> = {
  kanto: Object.fromEntries(
    Object.entries(enrichedKanto.nodes).map(([node, v]) => [
      node,
      ((v as { items?: EnrichedItem[] }).items ?? []) as EnrichedItem[],
    ]),
  ),
  hoenn: Object.fromEntries(
    Object.entries(enrichedHoenn.nodes).map(([node, v]) => [
      node,
      ((v as { items?: EnrichedItem[] }).items ?? []) as EnrichedItem[],
    ]),
  ),
};

/** Cross-source identity of an item: curated TM/HM entries carry move-based
 * slugs ('tm-psychic') while the enrichment uses numeric ones ('tm29') — the
 * curated display name ('TM29 — Psychic') pins the number. The Itemfinder was
 * renamed 'Dowsing Machine' in Gen IV+. */
export function canonicalItemSlug(slug: string, displayName?: string): string {
  const machine = displayName ? /^(TM|HM)(\d{2})/.exec(displayName) : null;
  if (machine) return `${machine[1].toLowerCase()}${machine[2]}`;
  if (slug === 'dowsing-machine') return 'itemfinder';
  return slug;
}

/** curated items only (single source) — internal; use itemsForNode for the union */
function curatedItemsForNode(regionId: string, nodeId: string): CuratedItem[] {
  return ITEMS_BY_REGION[regionId]?.[nodeId] ?? [];
}

function enrichedItemsForNode(regionId: string, nodeId: string): EnrichedItem[] {
  return ENRICHED_ITEMS_BY_REGION[regionId]?.[nodeId] ?? [];
}

/** map a curated item to the SEO kind vocabulary */
function kindOfCurated(item: CuratedItem): EnrichedItem['kind'] {
  if (item.hidden) return 'hidden';
  return item.pocket === 'ITEMS' ? 'ball' : 'given';
}

/** Union of both item sources for one node, as CuratedItem rows for the map
 * drawer: curated entries first (they carry the curation notes), then
 * enrichment-only items deduplicated by canonical slug. */
export function itemsForNode(regionId: string, nodeId: string): CuratedItem[] {
  const curated = curatedItemsForNode(regionId, nodeId);
  const seen = new Set(curated.map((i) => canonicalItemSlug(i.itemSlug, i.name)));
  const extras: CuratedItem[] = [];
  for (const e of enrichedItemsForNode(regionId, nodeId)) {
    const key = canonicalItemSlug(e.slug);
    if (seen.has(key)) continue;
    seen.add(key);
    extras.push({
      itemSlug: e.slug,
      name: e.slug,
      note: '',
      pocket: 'ITEMS',
      hidden: e.kind === 'hidden',
    });
  }
  return [...curated, ...extras];
}

/** Union of both item sources for the SEO route pages: keeps every enriched
 * row (each physical item ball stays visible) and appends curated-only items
 * (canonical slug not already covered by the enrichment). `curated` is set
 * when the row originates from the curation file (localized display name via
 * displayNameOfItem). */
export interface SeoItem extends EnrichedItem {
  curated?: CuratedItem;
}

export function seoItemsForNode(regionId: string, nodeId: string): SeoItem[] {
  const enriched = enrichedItemsForNode(regionId, nodeId);
  const seen = new Set(enriched.map((e) => canonicalItemSlug(e.slug)));
  const out: SeoItem[] = enriched.map((e) => ({ slug: e.slug, kind: e.kind }));
  for (const c of curatedItemsForNode(regionId, nodeId)) {
    const key = canonicalItemSlug(c.itemSlug, c.name);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ slug: c.itemSlug, kind: kindOfCurated(c), curated: c });
  }
  return out;
}

export function itemCountForRegion(regionId: string): number {
  const nodeIds = new Set([
    ...Object.keys(ITEMS_BY_REGION[regionId] ?? {}),
    ...Object.keys(ENRICHED_ITEMS_BY_REGION[regionId] ?? {}),
  ]);
  let sum = 0;
  for (const nodeId of nodeIds) sum += itemsForNode(regionId, nodeId).length;
  return sum;
}

export const ITEM_SPRITE_BASE =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items';

/* ---------- raw fetch with module-level memo (version switches stay instant) ---------- */

const locMemo = new Map<string, Promise<LocationResponse>>();
const areaMemo = new Map<string, Promise<LocationAreaResponse>>();

function fetchLocation(slug: string): Promise<LocationResponse> {
  let p = locMemo.get(slug);
  if (!p) {
    p = cachedJson<LocationResponse>(`mapdata:loc:${slug}`, `${API}/location/${slug}`);
    p.catch(() => locMemo.delete(slug));
    locMemo.set(slug, p);
  }
  return p;
}

function fetchArea(name: string): Promise<LocationAreaResponse> {
  let p = areaMemo.get(name);
  if (!p) {
    p = cachedJson<LocationAreaResponse>(`mapdata:area:${name}`, `${API}/location-area/${name}`);
    p.catch(() => areaMemo.delete(name));
    areaMemo.set(name, p);
  }
  return p;
}

/* ---------- aggregation ---------- */

function idFromUrl(url: string): number {
  return Number(url.replace(/\/$/, '').split('/').pop());
}

/** 'mt-moon-b1f' with prefix 'mt-moon' → 'B1F'; 'kanto-route-2-area' → 'MAIN'. */
export function areaShortLabel(areaName: string, locationSlug: string): string {
  let rest = areaName.startsWith(locationSlug) ? areaName.slice(locationSlug.length) : areaName;
  rest = rest.replace(/^-+|-+$/g, '').replace(/-area$/, '');
  if (!rest || rest === 'area') return 'MAIN';
  return rest.replace(/-/g, ' ').toUpperCase();
}

/** exported for tests — per-area encounter aggregation */
export function aggregateArea(
  area: LocationAreaResponse,
  locationSlug: string,
  version: string,
): AreaGroup {
  type Row = {
    slug: string;
    pokemonId: number;
    bucket: MethodBucket;
    chip?: MethodChip;
    isStatic: boolean;
    chance: number;
    minLevel: number;
    maxLevel: number;
  };
  const byRow = new Map<string, Row>();

  for (const enc of area.pokemon_encounters) {
    const vd = enc.version_details.find((v) => v.version.name === version);
    if (!vd || vd.encounter_details.length === 0) continue;
    const id = idFromUrl(enc.pokemon.url);
    if (!Number.isFinite(id) || id < 1 || id > 1025) continue;

    const groups = new Map<
      string,
      { method: string; names: string[]; chance: number; minLevel: number; maxLevel: number }
    >();
    for (const d of vd.encounter_details) {
      const method = d.method.name;
      const names = conditionNames(d);
      const key = exclusiveGroupKey(method, names);
      const prev = groups.get(key);
      if (prev) {
        prev.chance += d.chance;
        prev.minLevel = Math.min(prev.minLevel, d.min_level);
        prev.maxLevel = Math.max(prev.maxLevel, d.max_level);
      } else {
        groups.set(key, {
          method,
          names,
          chance: d.chance,
          minLevel: d.min_level,
          maxLevel: d.max_level,
        });
      }
    }

    for (const g of groups.values()) {
      const display = displayOf(g.method, g.names);
      const rowKey = `${id}|${display.bucket}|${display.chip ?? ''}|${display.isStatic ? 's' : 'w'}`;
      const chance = Math.min(100, Math.max(0, g.chance));
      const prev = byRow.get(rowKey);
      if (prev) {
        prev.chance = Math.min(100, Math.max(prev.chance, chance));
        prev.minLevel = Math.min(prev.minLevel, g.minLevel);
        prev.maxLevel = Math.max(prev.maxLevel, g.maxLevel);
      } else {
        byRow.set(rowKey, {
          slug: enc.pokemon.name,
          pokemonId: id,
          bucket: display.bucket,
          chip: display.chip,
          isStatic: display.isStatic,
          chance,
          minLevel: Number.isFinite(g.minLevel) ? g.minLevel : 0,
          maxLevel: Number.isFinite(g.maxLevel) ? g.maxLevel : 0,
        });
      }
    }
  }

  const entries: EncounterEntry[] = [...byRow.values()]
    .map((e) => ({
      pokemonId: e.pokemonId,
      slug: e.slug,
      methods: [e.bucket],
      maxChance: e.chance,
      minLevel: e.minLevel,
      maxLevel: e.maxLevel,
      isStatic: e.isStatic,
      chanceByMethod: { [e.bucket]: e.chance },
      methodChip: e.chip,
    }))
    .sort((a, b) => {
      if (a.isStatic !== b.isStatic) return a.isStatic ? -1 : 1;
      if (b.maxChance !== a.maxChance) return b.maxChance - a.maxChance;
      return a.pokemonId - b.pokemonId;
    });

  return {
    areaSlug: area.name,
    areaLabel: areaShortLabel(area.name, locationSlug),
    entries,
  };
}

function emptyNode(nodeId: string, status: NodeDataStatus = 'empty'): NodeMapData {
  return { nodeId, status, areas: [], pokemonCount: 0, bestRate: 0, methodTop: {} };
}

/** KPIs for a loaded node: bestRate is wild-only, methodTop is per-bucket chance. */
export function summarizeAreas(
  groups: AreaGroup[],
): Pick<NodeMapData, 'pokemonCount' | 'bestRate' | 'methodTop'> {
  const species = new Set<number>();
  let bestRate = 0;
  const methodTop: Partial<Record<MethodBucket, number>> = {};
  for (const g of groups) {
    for (const e of g.entries) {
      species.add(e.pokemonId);
      if (!e.isStatic && e.methodChip !== 'swarm') bestRate = Math.max(bestRate, e.maxChance);
      for (const m of e.methods) {
        const c = e.chanceByMethod[m] ?? e.maxChance;
        methodTop[m] = Math.max(methodTop[m] ?? 0, c);
      }
    }
  }
  return { pokemonCount: species.size, bestRate, methodTop };
}

async function loadNodeData(nodeId: string, locationSlug: string, version: string): Promise<NodeMapData> {
  const loc = await fetchLocation(locationSlug);
  if (!loc.areas || loc.areas.length === 0) return emptyNode(nodeId);
  const areaResponses = await Promise.all(loc.areas.map((a) => fetchArea(a.name)));
  const groups = areaResponses
    .map((a) => aggregateArea(a, locationSlug, version))
    .filter((g) => g.entries.length > 0);

  if (groups.length === 0) return emptyNode(nodeId);

  const { pokemonCount, bestRate, methodTop } = summarizeAreas(groups);
  return {
    nodeId,
    status: 'loaded',
    areas: groups,
    pokemonCount,
    bestRate,
    methodTop,
  };
}

/* ---------- concurrency pool (6, maps.md §0) ---------- */

function runPool(jobs: Array<() => Promise<void>>, concurrency = 6): Promise<void> {
  let next = 0;
  const workers = Array.from({ length: Math.min(concurrency, jobs.length) }, async () => {
    while (next < jobs.length) {
      const job = jobs[next++];
      await job();
    }
  });
  return Promise.all(workers).then(() => undefined);
}

/* ---------- region-level hook ---------- */

export interface RegionDataState {
  /** per-node aggregated data, filled progressively as fetches land */
  data: ReadonlyMap<string, NodeMapData>;
  /** nodes finished / nodes with a locationSlug */
  scanned: number;
  total: number;
  scanning: boolean;
  /** browser reports no connectivity */
  offline: boolean;
  /** region+version this state belongs to */
  regionId: string;
  version: string;
}

/* aggregation cache: region+version → full node map (raw payloads are memoized,
 * so re-aggregation on version switch is cheap and mostly synchronous). */
const aggCache = new Map<string, Map<string, NodeMapData>>();

export function useRegionData(region: RegionMap, version: string): RegionDataState {
  const cacheKey = `${region.region}:${version}`;
  const [data, setData] = useState<Map<string, NodeMapData>>(
    () => new Map(aggCache.get(cacheKey) ?? []),
  );
  const [scanned, setScanned] = useState(() => aggCache.get(cacheKey)?.size ?? 0);
  const [offline, setOffline] = useState(() => (typeof navigator !== 'undefined' ? !navigator.onLine : false));
  const runId = useRef(0);

  const slugSig = region.nodes
    .filter((n) => n.locationSlug)
    .map((n) => `${n.id}:${n.locationSlug}`)
    .join('|');
  /* Content signature — not `region` by reference. Unstable region objects
   * (e.g. a rebuilt Orre filter map) must not re-fire the load effect. */
  const slugs = useMemo(
    () =>
      region.nodes
        .filter((n) => n.locationSlug)
        .map((n) => ({ nodeId: n.id, slug: n.locationSlug as string })),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- keyed by slugSig
    [slugSig],
  );
  const total = slugs.length;

  useEffect(() => {
    const on = () => setOffline(false);
    const off = () => setOffline(true);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);

  useEffect(() => {
    const id = ++runId.current;
    const cached = aggCache.get(cacheKey);
    const acc = new Map<string, NodeMapData>(cached ?? []);
    setData(new Map(acc));
    setScanned(acc.size);

    const jobs = slugs.map(({ nodeId, slug }) => async () => {
      if (acc.has(nodeId)) return;
      let nd: NodeMapData;
      try {
        nd = await loadNodeData(nodeId, slug, version);
      } catch {
        nd = emptyNode(nodeId, 'error');
      }
      if (runId.current !== id) return; // stale run (region/version changed)
      acc.set(nodeId, nd);
      aggCache.set(cacheKey, new Map(acc));
      setData(new Map(acc));
      setScanned(acc.size);
    });

    void runPool(jobs, 6);

    return () => {
      /* keep acc in aggCache even if aborted — partial progress stays warm */
    };
  }, [cacheKey, slugs, version]);

  return {
    data,
    scanned,
    total,
    scanning: scanned < total,
    offline,
    regionId: region.region,
    version,
  };
}

/* ---------- region-wide spawn leaderboards (left rail) ---------- */

export interface SpawnLeader {
  pokemonId: number;
  slug: string;
  rate: number;
  nodeId: string;
}

/** Best wild rate per species. Static gifts (and similar) stay out of the % mix. */
export function bestWildBySpecies<T extends { pokemonId: number; slug: string; maxChance: number; isStatic?: boolean }>(
  entries: readonly T[],
): Map<number, T> {
  const best = new Map<number, T>();
  for (const e of entries) {
    if (e.isStatic) continue;
    const prev = best.get(e.pokemonId);
    if (!prev || e.maxChance > prev.maxChance) best.set(e.pokemonId, e);
  }
  return best;
}

/** Most common / rarest species across all loaded nodes (selected version). */
export function spawnLeaders(data: ReadonlyMap<string, NodeMapData>): { common: SpawnLeader[]; rare: SpawnLeader[] } {
  const best = new Map<number, SpawnLeader>();
  for (const [nodeId, nd] of data) {
    if (nd.status !== 'loaded') continue;
    for (const g of nd.areas) {
      for (const e of g.entries) {
        if (e.isStatic || e.methodChip === 'swarm') continue;
        const prev = best.get(e.pokemonId);
        if (!prev || e.maxChance > prev.rate) {
          best.set(e.pokemonId, { pokemonId: e.pokemonId, slug: e.slug, rate: e.maxChance, nodeId });
        }
      }
    }
  }
  const all = [...best.values()];
  const common = [...all].sort((a, b) => b.rate - a.rate).slice(0, 5);
  const rare = [...all].sort((a, b) => a.rate - b.rate || a.pokemonId - b.pokemonId).slice(0, 5);
  return { common, rare };
}

/** Unique species count across loaded nodes (left-rail KPI, counts up as data lands). */
export function speciesUnion(data: ReadonlyMap<string, NodeMapData>): number {
  const s = new Set<number>();
  for (const nd of data.values()) {
    if (nd.status !== 'loaded') continue;
    for (const g of nd.areas) for (const e of g.entries) s.add(e.pokemonId);
  }
  return s.size;
}
