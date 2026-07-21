/* /pokedex page-local data layer — name-index boot, concurrency-limited summary
 * enrichment, /type membership sets, legendary/mythical flags, filter+sort helpers.
 * Wraps src/lib/pokeapi.ts (cachedJson/getPokemon) — does not modify shared libs. */
import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import { bootNameIndex, cachedJson, displayName, getPokemon } from '@/lib/pokeapi';
import { germanAliasOfPokemon, nameOfPokemon, type Lang } from '@/lib/i18n-data';
import { MAX_DEX_ID, POKEMON_TYPES, genOf } from '@/lib/types';
import type { DexIndexEntry, Pokemon, PokemonType, StatKey } from '@/lib/types';

/* ---------- shared page types ---------- */

export type Density = 'comfort' | 'compact' | 'list';
export type SortKey = 'id' | 'id-desc' | 'name' | 'height' | 'weight' | 'bst';
export type Special = 'legendary' | 'mythical';

/* labels are i18n keys under pokedex.sortOptions (rendered via t()) */
export const SORT_OPTIONS: Array<{ key: SortKey; labelKey: string }> = [
  { key: 'id', labelKey: 'pokedex.sortOptions.id' },
  { key: 'id-desc', labelKey: 'pokedex.sortOptions.idDesc' },
  { key: 'name', labelKey: 'pokedex.sortOptions.name' },
  { key: 'height', labelKey: 'pokedex.sortOptions.height' },
  { key: 'weight', labelKey: 'pokedex.sortOptions.weight' },
  { key: 'bst', labelKey: 'pokedex.sortOptions.bst' },
];

export const STAT_SORTS: ReadonlySet<SortKey> = new Set(['height', 'weight', 'bst']);

export interface DexSummary {
  id: number;
  label: string;
  types: PokemonType[];
  stats: Record<StatKey, number>;
  bst: number;
  height: number; // decimetres
  weight: number; // hectograms
  gen: number;
  legendary: boolean;
  mythical: boolean;
}

/* ---------- legendary / mythical flags (mirrors PokéAPI species flags) ---------- */

export const LEGENDARY_IDS: ReadonlySet<number> = new Set([
  144, 145, 146, 150, 243, 244, 245, 249, 250, 377, 378, 379, 380, 381, 382, 383, 384, 480, 481,
  482, 483, 484, 485, 486, 487, 488, 638, 639, 640, 641, 642, 643, 644, 645, 646, 716, 717, 718,
  772, 773, 785, 786, 787, 788, 789, 790, 791, 792, 800, 888, 889, 890, 891, 892, 894, 895, 896,
  897, 898, 905, 1001, 1002, 1003, 1004, 1007, 1008, 1014, 1015, 1016, 1017, 1020, 1021, 1022,
  1023, 1024,
]);

export const MYTHICAL_IDS: ReadonlySet<number> = new Set([
  151, 251, 385, 386, 489, 490, 491, 492, 493, 494, 647, 648, 649, 719, 720, 721, 801, 802, 807,
  808, 809, 893, 1025,
]);

/* ---------- summary enrichment (module store, concurrency-limited queue) ----------
 * Session-global: survives /pokedex remounts, so back-navigation from a detail
 * page re-renders instantly. Subscribed via useSyncExternalStore. */

const CONCURRENCY = 12;

const summaryStore = new Map<number, DexSummary>();
const queuedIds = new Set<number>();
const fetchQueue: number[] = [];
let activeFetches = 0;

let summarySnapshot: ReadonlyMap<number, DexSummary> = new Map();
let pendingSnapshot = 0;
const storeListeners = new Set<() => void>();

function notifyStore(): void {
  summarySnapshot = new Map(summaryStore);
  pendingSnapshot = activeFetches + fetchQueue.length;
  storeListeners.forEach((fn) => fn());
}

function subscribeSummaryStore(fn: () => void): () => void {
  storeListeners.add(fn);
  return () => storeListeners.delete(fn);
}

function toSummary(p: Pokemon): DexSummary {
  const stats = {} as Record<StatKey, number>;
  for (const s of p.stats) stats[s.stat.name as StatKey] = s.base_stat;
  return {
    id: p.id,
    label: displayName(p.name),
    types: [...p.types].sort((a, b) => a.slot - b.slot).map((t) => t.type.name as PokemonType),
    stats,
    bst: p.stats.reduce((sum, s) => sum + s.base_stat, 0),
    height: p.height,
    weight: p.weight,
    gen: genOf(p.id).gen,
    legendary: LEGENDARY_IDS.has(p.id),
    mythical: MYTHICAL_IDS.has(p.id),
  };
}

function pumpQueue(): void {
  while (activeFetches < CONCURRENCY && fetchQueue.length > 0) {
    const take = Math.min(CONCURRENCY - activeFetches, fetchQueue.length);
    const chunk = fetchQueue.splice(0, take);
    activeFetches += chunk.length;
    notifyStore();
    void Promise.all(
      chunk.map((id) =>
        getPokemon(id)
          .then((p) => ({ id, summary: toSummary(p) }))
          .catch(() => ({ id, summary: null as DexSummary | null })),
      ),
    ).then((results) => {
      for (const { id, summary } of results) {
        queuedIds.delete(id);
        if (summary) summaryStore.set(id, summary);
      }
      activeFetches -= chunk.length;
      notifyStore();
      pumpQueue();
    });
  }
}

/** queue summaries for the given ids (front-prioritized, deduped) */
function ensureSummaries(ids: number[]): void {
  const fresh: number[] = [];
  for (const id of ids) {
    if (!summaryStore.has(id) && !queuedIds.has(id)) {
      queuedIds.add(id);
      fresh.push(id);
    }
  }
  if (fresh.length > 0) {
    // latest request wins — prepend so visible/filtered batches jump the queue
    fetchQueue.unshift(...fresh);
    notifyStore();
    pumpQueue();
  }
}

export interface DexData {
  index: DexIndexEntry[] | null;
  bootFailed: boolean;
  retryBoot: () => void;
  summaries: ReadonlyMap<number, DexSummary>;
  /** queue summaries for the given ids (front-prioritized, deduped) */
  ensure: (ids: number[]) => void;
  /** number of summaries currently queued or in flight */
  pendingCount: number;
}

export function useDexData(): DexData {
  const [index, setIndex] = useState<DexIndexEntry[] | null>(null);
  const [bootFailed, setBootFailed] = useState(false);
  const summaries = useSyncExternalStore(subscribeSummaryStore, () => summarySnapshot);
  const pendingCount = useSyncExternalStore(subscribeSummaryStore, () => pendingSnapshot);

  const boot = useCallback(() => {
    // async callbacks only — no sync setState (react-hooks/set-state-in-effect)
    bootNameIndex()
      .then((entries) => {
        setIndex(entries);
        setBootFailed(false);
      })
      .catch(() => setBootFailed(true));
  }, []);

  useEffect(() => {
    boot();
  }, [boot]);

  return { index, bootFailed, retryBoot: boot, summaries, ensure: ensureSummaries, pendingCount };
}

/* ---------- /type membership sets (1 cached request per type) ---------- */

interface TypeResponse {
  pokemon: Array<{ pokemon: { name: string; url: string }; slot: number }>;
}

export type TypeMemberSets = Partial<Record<PokemonType, ReadonlySet<number>>>;

export function useTypeMembers(types: PokemonType[]): TypeMemberSets {
  const [sets, setSets] = useState<TypeMemberSets>({});
  const key = types.join(',');
  useEffect(() => {
    let alive = true;
    const missing = types.filter((t) => !sets[t]);
    if (missing.length === 0) return;
    void Promise.all(
      missing.map((t) =>
        cachedJson<TypeResponse>(`type:${t}`, `https://pokeapi.co/api/v2/type/${t}`)
          .then((res) => {
            const ids = new Set<number>();
            for (const slot of res.pokemon) {
              const id = Number(slot.pokemon.url.replace(/\/$/, '').split('/').pop());
              if (Number.isFinite(id) && id >= 1 && id <= MAX_DEX_ID) ids.add(id);
            }
            return [t, ids] as const;
          })
          .catch(() => [t, new Set<number>()] as const),
      ),
    ).then((pairs) => {
      if (!alive) return;
      setSets((prev) => {
        const next = { ...prev };
        for (const [t, s] of pairs) next[t] = s;
        return next;
      });
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return sets;
}

/* ---------- online status (offline fallback notice) ---------- */

export function useOnline(): boolean {
  const [online, setOnline] = useState<boolean>(() =>
    typeof navigator === 'undefined' ? true : navigator.onLine,
  );
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);
  return online;
}

/* ---------- filtering & sorting (in-memory, < 1ms) ---------- */

export interface FilterState {
  q: string;
  types: PokemonType[];
  gen: number | null;
  special: Special[];
}

export function filterEntries(
  index: DexIndexEntry[],
  f: FilterState,
  typeSets: TypeMemberSets,
): DexIndexEntry[] | null {
  let out = index;
  const q = f.q.trim().toLowerCase().replace(/^#/, '');
  if (q) {
    out = out.filter(
      (e) =>
        e.label.toLowerCase().includes(q) ||
        e.name.includes(q) ||
        e.num.includes(q) ||
        String(e.id) === q ||
        // German alias (build-time de artifact) — "bisasam" finds bulbasaur
        (germanAliasOfPokemon(e.id)?.includes(q) ?? false),
    );
  }
  if (f.gen !== null) out = out.filter((e) => e.gen === f.gen);
  if (f.special.length > 0) {
    const wantLegendary = f.special.includes('legendary');
    const wantMythical = f.special.includes('mythical');
    out = out.filter(
      (e) =>
        (wantLegendary && LEGENDARY_IDS.has(e.id)) || (wantMythical && MYTHICAL_IDS.has(e.id)),
    );
  }
  if (f.types.length > 0) {
    // null = type membership still loading → caller shows a loader, not an empty state
    if (f.types.some((t) => !typeSets[t])) return null;
    out = out.filter((e) => f.types.some((t) => typeSets[t]!.has(e.id)));
  }
  return out;
}

export function sortEntries(
  entries: DexIndexEntry[],
  summaries: ReadonlyMap<number, DexSummary>,
  sort: SortKey,
  lang: Lang = 'en',
): DexIndexEntry[] {
  const arr = [...entries];
  switch (sort) {
    case 'id':
      return arr; // boot index arrives in dex order
    case 'id-desc':
      return arr.reverse();
    case 'name':
      // sort by the localized display name of the active language
      return arr.sort((a, b) =>
        nameOfPokemon(a.id, lang).localeCompare(nameOfPokemon(b.id, lang), lang),
      );
    case 'height':
    case 'weight':
    case 'bst': {
      const metric = (e: DexIndexEntry): number => {
        const s = summaries.get(e.id);
        if (!s) return -1;
        return sort === 'bst' ? s.bst : sort === 'height' ? s.height : s.weight;
      };
      return arr.sort((a, b) => metric(b) - metric(a));
    }
  }
}

export function isValidType(t: string): t is PokemonType {
  return (POKEMON_TYPES as readonly string[]).includes(t);
}
