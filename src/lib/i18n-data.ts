/* Localized entity-name lookup (WP2).
 *
 * DATA MODEL STAYS ENGLISH: slugs/ids are never translated. These helpers only
 * localize the DISPLAY layer: current language → de artifact (build-time JSONs
 * from src/data/i18n/de) → English fallback (displayName / artifact en values).
 *
 * Reactivity: components must subscribe to language changes via useLanguage()
 * (or useTranslation()) so lookups re-run on toggle. */

import { useTranslation } from 'react-i18next';
import pokemonDe from '@/data/i18n/de/pokemon.json';
import movesDe from '@/data/i18n/de/moves.json';
import abilitiesDe from '@/data/i18n/de/abilities.json';
import itemsDe from '@/data/i18n/de/items.json';
import typesDe from '@/data/i18n/de/types.json';
import locationsDe from '@/data/i18n/de/locations.json';
import regionsDe from '@/data/i18n/de/regions.json';
import searchIndexDe from '@/data/i18n/de/search-index.json';
import { displayName } from './pokeapi';

export type Lang = 'en' | 'de';

const POKEMON_DE = pokemonDe as Record<string, { slug: string; name: string; genus: string }>;
const MOVES_DE = movesDe as Record<string, string>;
const ABILITIES_DE = abilitiesDe as Record<string, string>;
const ITEMS_DE = itemsDe as Record<string, string>;
const TYPES_DE = typesDe as Record<string, string>;
const LOCATIONS_DE = locationsDe as Record<string, string>;
const REGIONS_DE = regionsDe as Record<string, string>;

interface SearchIndex {
  pokemon: Record<string, number>;
  moves: Record<string, string>;
  abilities: Record<string, string>;
  items: Record<string, string>;
  types: Record<string, string>;
  locations: Record<string, string>;
}
export const SEARCH_INDEX_DE = searchIndexDe as unknown as SearchIndex;

/** slug → dex id, built once from the pokemon artifact */
const ID_BY_SLUG: Record<string, number> = {};
for (const [id, p] of Object.entries(POKEMON_DE)) ID_BY_SLUG[p.slug] = Number(id);

export function currentLang(lng: string | undefined): Lang {
  return lng?.startsWith('de') ? 'de' : 'en';
}

/** Reactive language hook — subscribing components re-render on toggle. */
export function useLanguage(): Lang {
  const { i18n } = useTranslation();
  return currentLang(i18n.language);
}

function isDe(lang: Lang): boolean {
  return lang === 'de';
}

/* ---------- pokemon ---------- */

export function nameOfPokemon(idOrSlug: number | string, lang: Lang): string {
  if (isDe(lang)) {
    const id = typeof idOrSlug === 'number' ? idOrSlug : ID_BY_SLUG[idOrSlug];
    const entry = id ? POKEMON_DE[id] : undefined;
    if (entry) return entry.name;
  }
  const slug = typeof idOrSlug === 'number' ? POKEMON_DE[idOrSlug]?.slug : idOrSlug;
  return displayName(slug ?? String(idOrSlug));
}

export function slugOfPokemon(id: number): string {
  return POKEMON_DE[id]?.slug ?? String(id);
}

export function genusOfPokemon(id: number, lang: Lang): string {
  if (isDe(lang)) return POKEMON_DE[id]?.genus ?? '';
  return ''; // EN genus comes from live species data (englishGenus)
}

/* ---------- moves / abilities / items / types ---------- */

export function nameOfMove(slug: string, lang: Lang): string {
  if (isDe(lang) && MOVES_DE[slug]) return MOVES_DE[slug];
  return displayName(slug);
}

export function nameOfAbility(slug: string, lang: Lang): string {
  if (isDe(lang) && ABILITIES_DE[slug]) return ABILITIES_DE[slug];
  return displayName(slug);
}

export function nameOfItem(slug: string, lang: Lang): string {
  if (isDe(lang) && ITEMS_DE[slug]) return ITEMS_DE[slug];
  return displayName(slug);
}

export function nameOfType(slug: string, lang: Lang): string {
  if (isDe(lang) && TYPES_DE[slug]) return TYPES_DE[slug];
  return displayName(slug);
}

/* ---------- locations / regions ---------- */

export function nameOfLocation(slug: string, lang: Lang): string {
  if (isDe(lang) && LOCATIONS_DE[slug]) return LOCATIONS_DE[slug];
  return displayName(slug);
}

export function nameOfRegion(slug: string, lang: Lang): string {
  if (isDe(lang) && REGIONS_DE[slug]) return REGIONS_DE[slug];
  return displayName(slug);
}

/* ---------- encounter methods / egg groups / growth rates ----------
 * Small closed vocabularies — official German game terminology, kept inline
 * instead of a build artifact (PokéAPI coverage is patchy here). */

const METHODS_DE: Record<string, string> = {
  walk: 'Gehen',
  surf: 'Surfen',
  'old-rod': 'Angel',
  'good-rod': 'Profiangel',
  'super-rod': 'Superangel',
  fish: 'Angeln',
  fishing: 'Angeln',
  'rock-smash': 'Zertrümmerer',
  headbutt: 'Kopfnuss',
  gift: 'Geschenk',
  'gift-egg': 'Ei-Geschenk',
  'only-one': 'Nur einmal',
  'dark-grass': 'Dunkles Gras',
  'rustling-grass': 'Raschelndes Gras',
  'grass-spots': 'Grasstellen',
  'cave-spots': 'Höhlenstellen',
  'bridge-spots': 'Brückenstellen',
  'yellow-flowers': 'Gelbe Blumen',
  'purple-flowers': 'Lila Blumen',
  'red-flowers': 'Rote Blumen',
  'rough-terrain': 'Raues Terrain',
  seaweed: 'Seetang',
  sos: 'SOS-Ruf',
  'bubbling-spots': 'Blubberstellen',
  swarm: 'Schwarm',
  pokeradar: 'PokéRadar',
  roaming: 'Wandernd',
  'honey-trees': 'Honigbäume',
};

export function nameOfMethod(slug: string, lang: Lang): string {
  if (isDe(lang) && METHODS_DE[slug]) return METHODS_DE[slug];
  return displayName(slug);
}

const EGG_GROUPS_DE: Record<string, string> = {
  monster: 'Monster',
  water1: 'Wasser 1',
  bug: 'Käfer',
  flying: 'Flug',
  field: 'Feld',
  fairy: 'Fee',
  grass: 'Pflanze',
  plant: 'Pflanze', // PokéAPI slug for the grass egg group is 'plant'
  'human-like': 'Humanotyp',
  water3: 'Wasser 3',
  mineral: 'Mineral',
  amorph: 'Amorph',
  water2: 'Wasser 2',
  ditto: 'Ditto',
  dragon: 'Drache',
  'no-eggs': 'Unbekannt',
};

export function nameOfEggGroup(slug: string, lang: Lang): string {
  if (isDe(lang) && EGG_GROUPS_DE[slug]) return EGG_GROUPS_DE[slug];
  return displayName(slug);
}

const GROWTH_DE: Record<string, string> = {
  slow: 'Langsam',
  'medium-slow': 'Mittellangsam',
  fast: 'Schnell',
  'medium-fast': 'Mittelschnell',
  medium: 'Mittel',
  erratic: 'Erratisch',
  fluctuating: 'Fluktuierend',
};

export function nameOfGrowth(slug: string, lang: Lang): string {
  if (isDe(lang) && GROWTH_DE[slug]) return GROWTH_DE[slug];
  return displayName(slug);
}

/** GENERATIONS region display name -> locale key under `regions.*` */
const GEN_REGION_KEY: Record<string, string> = {
  Kanto: 'kanto',
  Johto: 'johto',
  Hoenn: 'hoenn',
  Sinnoh: 'sinnoh',
  Unova: 'unova',
  Kalos: 'kalos',
  Alola: 'alola',
  'Galar / Hisui': 'galarHisui',
  Paldea: 'paldea',
};

export function genRegionKey(region: string): string {
  return GEN_REGION_KEY[region] ?? 'kanto';
}

const POCKETS_DE: Record<string, string> = {
  items: 'Items',
  'key-items': 'Basis-Items',
  'poke-balls': 'Pokébälle',
  'tms-hms': 'TM/VM',
  machines: 'TM/VM',
  berries: 'Beeren',
  medicine: 'Medizin',
  'battle-items': 'Kampfitems',
  'mail': 'Briefe',
};

export function nameOfPocket(slug: string, lang: Lang): string {
  if (isDe(lang) && POCKETS_DE[slug]) return POCKETS_DE[slug];
  return displayName(slug);
}

const NATURES_DE: Record<string, string> = {
  hardy: 'Robust', lonely: 'Solo', brave: 'Mutig', adamant: 'Hart', naughty: 'Frech',
  bold: 'Kühn', docile: 'Sanft', relaxed: 'Locker', impish: 'Pfiffig', lax: 'Lasch',
  timid: 'Scheu', hasty: 'Hastig', serious: 'Ernst', jolly: 'Froh', naive: 'Naiv',
  modest: 'Mäßig', mild: 'Mild', quiet: 'Ruhig', bashful: 'Zaghaft', rash: 'Hitzig',
  calm: 'Still', gentle: 'Zart', sassy: 'Forsch', careful: 'Sacht', quirky: 'Kauzig',
};

/** Nature names — official German terminology (Wesen). EN falls back to the @pkmn name. */
export function nameOfNature(slug: string, lang: Lang): string {
  if (isDe(lang) && NATURES_DE[slug]) return NATURES_DE[slug];
  return displayName(slug);
}

/* ---------- numbers ---------- */

const NF = { en: new Intl.NumberFormat('en-US'), de: new Intl.NumberFormat('de-DE') };

/** Locale-aware thousands separator (de: 1.025 / en: 1,025). */
export function fmtNum(v: number, lang: Lang): string {
  return NF[lang].format(v);
}

/* ---------- search ---------- */

/** Resolve a (possibly German) query to a dex id via the de reverse index. */
export function pokemonIdForQuery(query: string): number | null {
  const hit = SEARCH_INDEX_DE.pokemon[query.trim().toLowerCase()];
  return hit ?? null;
}

/**
 * German aliases for a dex id: [deName] lowercased — merged into search indexes
 * so "bisasam" and "bulbasaur" both match #1.
 */
export function germanAliasOfPokemon(id: number): string | null {
  return POKEMON_DE[id]?.name.toLowerCase() ?? null;
}

/** Bound, reactive lookup bag for components (re-renders on language change). */
export function useEntityNames() {
  const lang = useLanguage();
  return {
    lang,
    pokemon: (idOrSlug: number | string) => nameOfPokemon(idOrSlug, lang),
    genus: (id: number) => genusOfPokemon(id, lang),
    move: (slug: string) => nameOfMove(slug, lang),
    ability: (slug: string) => nameOfAbility(slug, lang),
    item: (slug: string) => nameOfItem(slug, lang),
    type: (slug: string) => nameOfType(slug, lang),
    location: (slug: string) => nameOfLocation(slug, lang),
    region: (slug: string) => nameOfRegion(slug, lang),
  };
}
