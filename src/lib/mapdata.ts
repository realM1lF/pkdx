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

export const METHOD_BUCKETS: MethodBucket[] = ['WALK', 'SURF', 'FISH', 'OTHER'];

const SURF_METHODS = new Set(['surf']);
const FISH_METHODS = new Set(['old-rod', 'good-rod', 'super-rod', 'fish', 'fishing']);
const WALK_METHODS = new Set([
  'walk', 'dark-grass', 'rustling-grass', 'grass-spots', 'cave-spots', 'bridge-spots',
  'swarm', 'pokeradar', 'roaming', 'seaweed', 'honey-trees',
]);
const STATIC_METHODS = new Set(['gift', 'only-one']);

export function methodBucket(method: string): MethodBucket {
  if (SURF_METHODS.has(method)) return 'SURF';
  if (FISH_METHODS.has(method)) return 'FISH';
  if (WALK_METHODS.has(method)) return 'WALK';
  return 'OTHER';
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

export function itemsForNode(regionId: string, nodeId: string): CuratedItem[] {
  return ITEMS_BY_REGION[regionId]?.[nodeId] ?? [];
}

export function itemCountForRegion(regionId: string): number {
  const table = ITEMS_BY_REGION[regionId];
  if (!table) return 0;
  return Object.values(table).reduce((sum, list) => sum + list.length, 0);
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
  if (!rest) return 'MAIN';
  return rest.replace(/-/g, ' ').toUpperCase();
}

function aggregateArea(
  area: LocationAreaResponse,
  locationSlug: string,
  version: string,
): AreaGroup {
  const bySpecies = new Map<
    number,
    { slug: string; methods: Set<MethodBucket>; maxChance: number; minLevel: number; maxLevel: number; isStatic: boolean }
  >();

  for (const enc of area.pokemon_encounters) {
    const vd = enc.version_details.find((v) => v.version.name === version);
    if (!vd || vd.encounter_details.length === 0) continue;
    const id = idFromUrl(enc.pokemon.url);
    if (!Number.isFinite(id) || id < 1 || id > 1025) continue;

    let minL = Infinity;
    let maxL = -Infinity;
    const buckets = new Set<MethodBucket>();
    let isStatic = false;
    for (const det of vd.encounter_details) {
      buckets.add(methodBucket(det.method.name));
      if (STATIC_METHODS.has(det.method.name)) isStatic = true;
      minL = Math.min(minL, det.min_level);
      maxL = Math.max(maxL, det.max_level);
    }
    if (!Number.isFinite(minL)) {
      minL = 0;
      maxL = 0;
    }

    const prev = bySpecies.get(id);
    if (prev) {
      buckets.forEach((b) => prev.methods.add(b));
      prev.maxChance = Math.max(prev.maxChance, vd.max_chance);
      prev.minLevel = Math.min(prev.minLevel, minL);
      prev.maxLevel = Math.max(prev.maxLevel, maxL);
      prev.isStatic = prev.isStatic || isStatic;
    } else {
      bySpecies.set(id, {
        slug: enc.pokemon.name,
        methods: buckets,
        maxChance: vd.max_chance,
        minLevel: minL,
        maxLevel: maxL,
        isStatic,
      });
    }
  }

  const entries: EncounterEntry[] = [...bySpecies.entries()]
    .map(([pokemonId, e]) => ({
      pokemonId,
      slug: e.slug,
      methods: METHOD_BUCKETS.filter((b) => e.methods.has(b)),
      maxChance: e.maxChance,
      minLevel: e.minLevel,
      maxLevel: e.maxLevel,
      isStatic: e.isStatic,
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

async function loadNodeData(nodeId: string, locationSlug: string, version: string): Promise<NodeMapData> {
  const loc = await fetchLocation(locationSlug);
  if (!loc.areas || loc.areas.length === 0) return emptyNode(nodeId);
  const areaResponses = await Promise.all(loc.areas.map((a) => fetchArea(a.name)));
  const groups = areaResponses
    .map((a) => aggregateArea(a, locationSlug, version))
    .filter((g) => g.entries.length > 0);

  if (groups.length === 0) return emptyNode(nodeId);

  const species = new Set<number>();
  let bestRate = 0;
  const methodTop: Partial<Record<MethodBucket, number>> = {};
  for (const g of groups) {
    for (const e of g.entries) {
      species.add(e.pokemonId);
      bestRate = Math.max(bestRate, e.maxChance);
      for (const m of e.methods) {
        methodTop[m] = Math.max(methodTop[m] ?? 0, e.maxChance);
      }
    }
  }
  return {
    nodeId,
    status: 'loaded',
    areas: groups,
    pokemonCount: species.size,
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

  const slugs = useMemo(
    () =>
      region.nodes
        .filter((n) => n.locationSlug)
        .map((n) => ({ nodeId: n.id, slug: n.locationSlug as string })),
    [region],
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

/** Most common / rarest species across all loaded nodes (selected version). */
export function spawnLeaders(data: ReadonlyMap<string, NodeMapData>): { common: SpawnLeader[]; rare: SpawnLeader[] } {
  const best = new Map<number, SpawnLeader>();
  for (const [nodeId, nd] of data) {
    if (nd.status !== 'loaded') continue;
    for (const g of nd.areas) {
      for (const e of g.entries) {
        if (e.isStatic) continue;
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
