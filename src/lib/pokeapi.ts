/* MyPokePanion — typed PokéAPI client (design.md §10.1)
 * In-memory + localStorage cache with stale-while-revalidate. */

import type {
  DexIndexEntry,
  EvolutionChain,
  GenerationInfo,
  Move,
  Pokemon,
  PokemonSpecies,
} from './types';
import { GENERATIONS, MAX_DEX_ID, genOf, regionOf } from './types';

const API = 'https://pokeapi.co/api/v2';
const LS_PREFIX = 'pdx:';
const TTL = 1000 * 60 * 60 * 24 * 7; // payloads are near-immutable; revalidate weekly

/* ---------- cache core ---------- */

interface CacheEnvelope<T> {
  t: number;
  data: T;
}

const mem = new Map<string, Promise<unknown>>();
const listeners = new Set<(key: string) => void>();

function lsGet<T>(key: string): CacheEnvelope<T> | null {
  try {
    const raw = localStorage.getItem(LS_PREFIX + key);
    if (!raw) return null;
    return JSON.parse(raw) as CacheEnvelope<T>;
  } catch {
    return null;
  }
}

/** Payloads above this size stay memory-cached only (EP1.4): full /pokemon/{id}
 *  responses are 270–425 KB — a handful of them silently breaks the ~5 MB
 *  localStorage quota, killing persistence for EVERYTHING else (incl. the
 *  name index) and forcing expensive JSON.parse round-trips of huge strings. */
const LS_MAX_PAYLOAD = 150_000;

function lsSet<T>(key: string, data: T): void {
  try {
    const raw = JSON.stringify({ t: Date.now(), data } satisfies CacheEnvelope<T>);
    if (raw.length > LS_MAX_PAYLOAD) return; // memory cache still works
    localStorage.setItem(LS_PREFIX + key, raw);
  } catch {
    /* quota full — memory cache still works */
  }
}

/**
 * Stale-while-revalidate fetch.
 * Returns cached data immediately (even stale) and refreshes in the background;
 * with no cache it awaits the network. `onUpdate` fires when fresher data lands.
 */
export async function cachedJson<T>(key: string, url: string, onUpdate?: (data: T) => void): Promise<T> {
  const hit = lsGet<T>(key);
  const fresh = hit && Date.now() - hit.t < TTL;

  const revalidate = () => {
    if (!mem.has(key)) {
      mem.set(
        key,
        fetch(url)
          .then((r) => {
            if (!r.ok) throw new Error(`PokéAPI ${r.status} for ${url}`);
            return r.json() as Promise<T>;
          })
          .then((data) => {
            lsSet(key, data);
            onUpdate?.(data);
            listeners.forEach((fn) => fn(key));
            return data;
          })
          .finally(() => mem.delete(key)),
      );
    }
    return mem.get(key) as Promise<T>;
  };

  if (hit) {
    if (!fresh) void revalidate().catch(() => undefined); // serve stale, refresh quietly
    return hit.data;
  }
  return revalidate();
}

/** subscribe to cache refreshes (SWR updates) */
export function onCacheUpdate(fn: (key: string) => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/* ---------- name index boot (search/autocomplete) ---------- */

const SPECIAL_NAMES: Record<string, string> = {
  'mr-mime': 'Mr. Mime',
  'mime-jr': 'Mime Jr.',
  'ho-oh': 'Ho-Oh',
  'porygon-z': 'Porygon-Z',
  'nidoran-f': 'Nidoran ♀',
  'nidoran-m': 'Nidoran ♂',
  'farfetchd': "Farfetch'd",
  'sirfetchd': "Sirfetch'd",
  flabebe: 'Flabébé',
  'type-null': 'Type: Null',
  'jangmo-o': 'Jangmo-o',
  'hakamo-o': 'Hakamo-o',
  'kommo-o': 'Kommo-o',
  'tapu-koko': 'Tapu Koko',
  'tapu-lele': 'Tapu Lele',
  // items whose names aren't just Title-Case words
  'pp-up': 'PP Up',
  'pp-max': 'PP Max',
  'hp-up': 'HP Up',
  'x-attack': 'X Attack',
  'x-defense': 'X Defense',
  'x-speed': 'X Speed',
  'x-accuracy': 'X Accuracy',
  'x-special': 'X Special',
  'x-sp-atk': 'X Sp. Atk',
  'x-sp-def': 'X Sp. Def',
  'guard-spec': 'Guard Spec.',
  'dire-hit': 'Dire Hit',
  'tapu-bulu': 'Tapu Bulu',
  'tapu-fini': 'Tapu Fini',
  'mr-rime': 'Mr. Rime',
};

export function displayName(slug: string): string {
  if (SPECIAL_NAMES[slug]) return SPECIAL_NAMES[slug];
  return slug
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');
}

export function padNum(id: number): string {
  return `#${String(id).padStart(3, '0')}`;
}

interface PokemonListResponse {
  results: Array<{ name: string; url: string }>;
}

let indexPromise: Promise<DexIndexEntry[]> | null = null;

/** Boot the full National Dex name index (1–1025), cached (§10.1). */
export function bootNameIndex(): Promise<DexIndexEntry[]> {
  if (!indexPromise) {
    indexPromise = cachedJson<PokemonListResponse>('name-index', `${API}/pokemon?limit=${MAX_DEX_ID}`).then(
      (res) =>
        res.results
          .map((r) => {
            const id = Number(r.url.replace(/\/$/, '').split('/').pop());
            if (!Number.isFinite(id) || id < 1 || id > MAX_DEX_ID) return null;
            return { id, name: r.name, label: displayName(r.name), num: padNum(id), gen: genOf(id).gen };
          })
          .filter((e): e is DexIndexEntry => e !== null),
    );
    indexPromise.catch(() => {
      indexPromise = null; // allow retry after a failed boot
    });
  }
  return indexPromise;
}

/* ---------- endpoint helpers ---------- */

export function getPokemon(idOrName: number | string, onUpdate?: (p: Pokemon) => void): Promise<Pokemon> {
  return cachedJson<Pokemon>(`pokemon:${idOrName}`, `${API}/pokemon/${idOrName}`, onUpdate);
}

export function getSpecies(id: number | string, onUpdate?: (s: PokemonSpecies) => void): Promise<PokemonSpecies> {
  return cachedJson<PokemonSpecies>(`species:${id}`, `${API}/pokemon-species/${id}`, onUpdate);
}

/** Pre-evolutions closest-first (Ivysaur then Bulbasaur). Empty for a first stage. */
export async function loadPokemonAncestors(species: PokemonSpecies): Promise<Pokemon[]> {
  const out: Pokemon[] = [];
  const seen = new Set<string>();
  let name = species.evolves_from_species?.name;
  while (name && !seen.has(name)) {
    seen.add(name);
    const [p, s] = await Promise.all([getPokemon(name), getSpecies(name)]);
    out.push(p);
    name = s.evolves_from_species?.name;
  }
  return out;
}

export function getEvolutionChain(id: number | string): Promise<EvolutionChain> {
  return cachedJson<EvolutionChain>(`evo:${id}`, `${API}/evolution-chain/${id}`);
}

export function getMove(idOrName: number | string): Promise<Move> {
  return cachedJson<Move>(`move:${idOrName}`, `${API}/move/${idOrName}`);
}

/** Species helper: evolution-chain id parsed from its URL */
export function evolutionChainId(species: PokemonSpecies): number {
  return Number(species.evolution_chain.url.replace(/\/$/, '').split('/').pop());
}

/* ---------- flavor text & genus ---------- */

/** Sanitize PokéAPI flavor text: \f and \n → space, collapse whitespace (§10.1). */
export function sanitizeFlavor(text: string): string {
  return text.replace(/[\f\n\r]+/g, ' ').replace(/\s+/g, ' ').trim();
}

/** Latest English flavor entry (entries arrive oldest → newest). */
export function latestEnglishFlavor(species: PokemonSpecies): string {
  const en = species.flavor_text_entries.filter((e) => e.language.name === 'en');
  const last = en[en.length - 1];
  return last ? sanitizeFlavor(last.flavor_text) : '';
}

/** Latest flavor text preferring the requested language (de → en fallback). */
export function latestFlavor(species: PokemonSpecies, lang: string): string {
  if (lang.startsWith('de')) {
    const de = species.flavor_text_entries.filter((e) => e.language.name === 'de');
    if (de.length) return sanitizeFlavor(de[de.length - 1].flavor_text);
  }
  return latestEnglishFlavor(species);
}

/** All English flavor entries mapped to game versions (version picker). */
export function englishFlavorsByVersion(species: PokemonSpecies): Array<{ version: string; text: string }> {
  return species.flavor_text_entries
    .filter((e) => e.language.name === 'en')
    .map((e) => ({ version: displayName(e.version.name), text: sanitizeFlavor(e.flavor_text) }));
}

export function englishGenus(species: PokemonSpecies): string {
  return species.genera.find((g) => g.language.name === 'en')?.genus ?? '';
}

/**
 * Flavor entries by version for the requested language, falling back to English
 * (many species lack de entries in newer versions; EN is always present).
 */
export function flavorsByVersion(
  species: PokemonSpecies,
  lang: string,
): Array<{ version: string; text: string }> {
  const wanted = lang.startsWith('de') ? 'de' : 'en';
  const primary = species.flavor_text_entries.filter((e) => e.language.name === wanted);
  const entries = wanted !== 'en' && primary.length === 0
    ? species.flavor_text_entries.filter((e) => e.language.name === 'en')
    : primary;
  return entries.map((e) => ({ version: displayName(e.version.name), text: sanitizeFlavor(e.flavor_text) }));
}

/* ---------- generation / region maps ---------- */

export { genOf, regionOf, GENERATIONS };

export function generationByNumber(gen: number): GenerationInfo | undefined {
  return GENERATIONS.find((g) => g.gen === gen);
}

/* ---------- hover prefetch (§10.1 — instant detail morphs) ---------- */

/** Fire-and-forget warm of /pokemon + species (call on card hover/focus). */
export function prefetchPokemon(id: number): void {
  void getPokemon(id).catch(() => undefined);
  void getSpecies(id).catch(() => undefined);
}

/* ---------- misc ---------- */

export function statOf(p: Pokemon, key: string): number {
  return p.stats.find((s) => s.stat.name === key)?.base_stat ?? 0;
}

export function totalBaseStats(p: Pokemon): number {
  return p.stats.reduce((sum, s) => sum + s.base_stat, 0);
}

export function pokemonTypes(p: Pokemon): string[] {
  return [...p.types].sort((a, b) => a.slot - b.slot).map((t) => t.type.name);
}
