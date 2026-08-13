/* /pokedex page-local data layer — build-time summary artifact boot,
 * legendary/mythical flags, filter+sort helpers.
 *
 * EP1.4: summaries (types/stats/height/weight for all 1025) come from the
 * committed build artifact src/data/summaries.json (ONE chunked fetch, generated
 * by scripts/build-summaries.mjs) instead of 1025 full /pokemon/{id} payloads
 * (270–425 KB each). Detail data still loads on demand via getPokemon(). */
import { useCallback, useEffect, useState } from 'react';
import { displayName, padNum } from '@/lib/pokeapi';
import { germanAliasOfPokemon, nameOfPokemon, type Lang } from '@/lib/i18n-data';
import { formNameOf } from '@/lib/form-names';
import { POKEMON_TYPES, genOf } from '@/lib/types';
import type { DexFormKind, DexIndexEntry, PokemonType, StatKey } from '@/lib/types';

/* ---------- shared page types ---------- */

export type Density = 'comfort' | 'compact' | 'list';
export type SortKey = 'id' | 'id-desc' | 'name' | 'height' | 'weight' | 'bst';
export type Special = 'legendary' | 'mythical';
export type FormKind = DexFormKind;

export function isSpecialToken(s: string): s is Special {
  return s === 'legendary' || s === 'mythical';
}

/** Classify a Showdown/PokéAPI forme string. Null = skip (cosmetic, totem, ZA). */
export function formKindOf(
  forme: string,
  isNonstandard?: string | null,
  baseSpecies?: string,
): FormKind | null {
  if (isNonstandard === 'Future' || isNonstandard === 'CAP' || isNonstandard === 'Custom') {
    return null;
  }
  const f = forme.toLowerCase();
  if (f.includes('totem')) return null;
  if (f === 'mega-z' || f === 'original-mega' || f.endsWith('-mega-z')) return null;
  if (baseSpecies === 'Pikachu' && f === 'alola') return null;
  if (f === 'gmax' || f.endsWith('-gmax')) return 'gmax';
  if (f === 'mega' || f === 'mega-x' || f === 'mega-y' || f === 'primal') return 'mega';
  if (f === 'alola') return 'alola';
  if (f === 'galar' || f === 'galar-zen') return 'galar';
  if (f === 'hisui') return 'hisui';
  if (f.startsWith('paldea')) return 'paldea';
  return null;
}

function nationalId(e: DexIndexEntry): number {
  return e.speciesId ?? e.id;
}

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
  /** English PokéAPI slug — form rows link to `/pokemon/{slug}` */
  slug?: string;
  /** National-dex id (1–1025). Forms keep this separate from sprite `id`. */
  speciesId?: number;
  form?: FormKind;
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

/* ---------- summary boot (build artifact, single chunked fetch) ---------- */

interface RawSummary {
  id: number;
  slug: string;
  name: string; // EN display name (build-time, mirrors displayName())
  types: string[];
  stats: { hp: number; atk: number; def: number; spa: number; spd: number; spe: number };
  height: number; // decimetres
  weight: number; // hectograms
}

const STAT_MAP: ReadonlyArray<readonly [keyof RawSummary['stats'], StatKey]> = [
  ['hp', 'hp'],
  ['atk', 'attack'],
  ['def', 'defense'],
  ['spa', 'special-attack'],
  ['spd', 'special-defense'],
  ['spe', 'speed'],
];

interface DexBoot {
  index: DexIndexEntry[];
  summaries: ReadonlyMap<number, DexSummary>;
  typeSets: Record<PokemonType, ReadonlySet<number>>;
}

let bootPromise: Promise<DexBoot> | null = null;

/** Load + hydrate the summary artifact once per session (idempotent, cached). */
function bootDex(): Promise<DexBoot> {
  if (!bootPromise) {
    bootPromise = import('@/data/summaries.json').then((mod) => {
      const raw = (mod.default as { pokemon: RawSummary[] }).pokemon;
      const index: DexIndexEntry[] = [];
      const summaries = new Map<number, DexSummary>();
      const typeSets = {} as Record<PokemonType, Set<number>>;
      for (const t of POKEMON_TYPES) typeSets[t] = new Set<number>();
      for (const r of raw) {
        const gen = genOf(r.id).gen;
        index.push({ id: r.id, name: r.slug, label: r.name, num: padNum(r.id), gen });
        const stats = {} as Record<StatKey, number>;
        let bst = 0;
        for (const [short, key] of STAT_MAP) {
          stats[key] = r.stats[short];
          bst += r.stats[short];
        }
        const types = r.types as PokemonType[];
        summaries.set(r.id, {
          id: r.id,
          slug: r.slug,
          speciesId: r.id,
          label: r.name,
          types,
          stats,
          bst,
          height: r.height,
          weight: r.weight,
          gen,
          legendary: LEGENDARY_IDS.has(r.id),
          mythical: MYTHICAL_IDS.has(r.id),
        });
        for (const t of types) typeSets[t]?.add(r.id);
      }
      return { index, summaries, typeSets };
    });
    bootPromise.catch(() => {
      bootPromise = null; // allow retry after a failed boot
    });
  }
  return bootPromise;
}

const EMPTY_SUMMARIES: ReadonlyMap<number, DexSummary> = new Map();

/** All summaries are bundled in the artifact — nothing left to fetch on demand. */
function ensureNoop(_ids: number[]): void {
  /* no-op (EP1.4) */
}

export interface DexData {
  index: DexIndexEntry[] | null;
  bootFailed: boolean;
  retryBoot: () => void;
  summaries: ReadonlyMap<number, DexSummary>;
  /** @deprecated no-op — kept for call-site compatibility (artifact is complete) */
  ensure: (ids: number[]) => void;
  /** always 0 — no summary requests are in flight anymore */
  pendingCount: number;
}

export function useDexData(): DexData {
  const [boot, setBoot] = useState<DexBoot | null>(null);
  const [bootFailed, setBootFailed] = useState(false);

  const load = useCallback(() => {
    // async callbacks only — no sync setState (react-hooks/set-state-in-effect)
    bootDex()
      .then((b) => {
        setBoot(b);
        setBootFailed(false);
      })
      .catch(() => setBootFailed(true));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {
    index: boot?.index ?? null,
    bootFailed,
    retryBoot: load,
    summaries: boot?.summaries ?? EMPTY_SUMMARIES,
    ensure: ensureNoop,
    pendingCount: 0,
  };
}

/* ---------- /type membership sets (derived from the summary artifact) ---------- */

export type TypeMemberSets = Partial<Record<PokemonType, ReadonlySet<number>>>;

export function useTypeMembers(types: PokemonType[]): TypeMemberSets {
  const [sets, setSets] = useState<TypeMemberSets>({});
  const key = types.join(',');
  useEffect(() => {
    let alive = true;
    const missing = types.filter((t) => !sets[t]);
    if (missing.length === 0) return;
    void bootDex()
      .then((b) => {
        if (!alive) return;
        setSets((prev) => {
          const next = { ...prev };
          for (const t of missing) next[t] = b.typeSets[t];
          return next;
        });
      })
      .catch(() => undefined);
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
  const q = f.q.trim().toLowerCase().replace(/^#/, '');
  let out = index;
  if (q) {
    out = out.filter(
      (e) =>
        e.label.toLowerCase().includes(q) ||
        e.name.includes(q) ||
        e.num.includes(q) ||
        String(e.id) === q ||
        String(nationalId(e)) === q ||
        (germanAliasOfPokemon(nationalId(e))?.includes(q) ?? false),
    );
  }
  if (f.gen !== null) out = out.filter((e) => e.gen === f.gen);
  if (f.special.length > 0) {
    const wantLegendary = f.special.includes('legendary');
    const wantMythical = f.special.includes('mythical');
    out = out.filter(
      (e) =>
        (wantLegendary && LEGENDARY_IDS.has(nationalId(e))) ||
        (wantMythical && MYTHICAL_IDS.has(nationalId(e))),
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
        nameOfPokemon(nationalId(a), lang).localeCompare(nameOfPokemon(nationalId(b), lang), lang),
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

export const FORM_I18N_KEY: Record<FormKind, string> = {
  alola: 'pokedex.formsAlola',
  galar: 'pokedex.formsGalar',
  hisui: 'pokedex.formsHisui',
  paldea: 'pokedex.formsPaldea',
  mega: 'pokedex.formsMega',
  gmax: 'pokedex.formsGmax',
};

/* ---------- form catalog hydrate (grid does not merge these rows in v1) ---------- */

export interface DexFormRecord {
  slug: string;
  speciesId: number;
  spriteId: number;
  types: PokemonType[];
  stats?: RawSummary['stats'];
  height?: number;
  weight?: number;
  kind: FormKind;
  gen: number;
}

interface FormBoot {
  index: DexIndexEntry[];
  summaries: ReadonlyMap<number, DexSummary>;
  typeSets: Record<PokemonType, ReadonlySet<number>>;
}

export function hydrateFormCatalog(forms: DexFormRecord[]): FormBoot {
  const index: DexIndexEntry[] = [];
  const summaries = new Map<number, DexSummary>();
  const typeSets = {} as Record<PokemonType, Set<number>>;
  for (const t of POKEMON_TYPES) typeSets[t] = new Set<number>();
  for (const r of forms) {
    const stats = {} as Record<StatKey, number>;
    let bst = 0;
    if (r.stats) {
      for (const [short, key] of STAT_MAP) {
        stats[key] = r.stats[short];
        bst += r.stats[short];
      }
    }
    const entry: DexIndexEntry = {
      id: r.spriteId,
      name: r.slug,
      label: formNameOf(r.slug, 'en') ?? displayName(r.slug),
      num: padNum(r.speciesId),
      gen: r.gen,
      speciesId: r.speciesId,
      form: r.kind,
    };
    index.push(entry);
    summaries.set(r.spriteId, {
      id: r.spriteId,
      slug: r.slug,
      speciesId: r.speciesId,
      label: formNameOf(r.slug, 'en') ?? displayName(r.slug),
      types: r.types,
      stats,
      bst,
      height: r.height ?? 0,
      weight: r.weight ?? 0,
      gen: r.gen,
      legendary: LEGENDARY_IDS.has(r.speciesId),
      mythical: MYTHICAL_IDS.has(r.speciesId),
      form: r.kind,
    });
    for (const t of r.types) typeSets[t]?.add(r.spriteId);
  }
  return { index, summaries, typeSets };
}
