/* Shared route table for the SEO build scripts (sitemap + prerender).
 * Locale-stripped app paths only — the scripts expand them to /de… and
 * /en… URLs. Keep in sync with the static routes in src/App.tsx and the
 * meta registry in src/lib/seo.ts.
 *
 * Entries are either a string (same rest path in both locales) or a
 * { de, en } pair for routes with localized slugs (type pages:
 * /de/typen/wasser ↔ /en/types/water; item pages: /de/items/ep-teiler ↔
 * /en/items/exp-share). */
import { readFileSync } from 'node:fs';

export const SITE_URL = 'https://mypokepanion.com';

export const LANGS = ['de', 'en'];

const TYPE_SLUGS = {
  normal: ['normal', 'normal'],
  fire: ['feuer', 'fire'],
  water: ['wasser', 'water'],
  electric: ['elektro', 'electric'],
  grass: ['pflanze', 'grass'],
  ice: ['eis', 'ice'],
  fighting: ['kampf', 'fighting'],
  poison: ['gift', 'poison'],
  ground: ['boden', 'ground'],
  flying: ['flug', 'flying'],
  psychic: ['psycho', 'psychic'],
  bug: ['kafer', 'bug'],
  rock: ['gestein', 'rock'],
  ghost: ['geist', 'ghost'],
  dragon: ['drache', 'dragon'],
  dark: ['unlicht', 'dark'],
  steel: ['stahl', 'steel'],
  fairy: ['fee', 'fairy'],
};

const ITEM_SLUGS = [
  ['ep-teiler', 'exp-share'],
  ['gluecks-ei', 'lucky-egg'],
  ['wahlband', 'choice-band'],
  ['wahlbrille', 'choice-specs'],
  ['wahlschal', 'choice-scarf'],
  ['leben-orb', 'life-orb'],
  ['evolith', 'eviolite'],
  ['fokusgurt', 'focus-sash'],
  ['ueberreste', 'leftovers'],
  ['tsitrubeere', 'sitrus-berry'],
  ['prunusbeere', 'lum-berry'],
  ['ewigstein', 'everstone'],
  ['meisterball', 'master-ball'],
  ['hyperball', 'ultra-ball'],
  ['sonnenstein', 'sun-stone'],
  ['feuerstein', 'fire-stone'],
  ['wasserstein', 'water-stone'],
  ['donnerstein', 'thunder-stone'],
  ['blattstein', 'leaf-stone'],
  ['mondstein', 'moon-stone'],
  ['linkkabel', 'linking-cord'],
  ['metallmantel', 'metal-coat'],
  ['drachenhaut', 'dragon-scale'],
  ['king-stein', 'kings-rock'],
  ['dubiosdisc', 'dubious-disc'],
];

/* Kanto location pages (SEO rollout 2): localized slugs per node with FRLG
 * encounter data. The slug table is curated in src/lib/seo-routes-kanto.ts;
 * the generated snapshot src/data/seo-meta-gen.json carries it per node, so
 * this list always matches the pages the app actually renders. */
const META_GEN = JSON.parse(readFileSync(new URL('../src/data/seo-meta-gen.json', import.meta.url), 'utf8'));

const KANTO_ROUTE_ENTRIES = Object.values(META_GEN.routes).map((r) => ({
  de: `/maps/kanto/${r.slugDe}`,
  en: `/maps/kanto/${r.slugEn}`,
}));

/* 25 curated Pokémon detail pages (SEO rollout 2) */
const POKEMON_SEO_IDS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 25, 26, 133, 143, 150, 151, 149, 130, 94, 18, 20,
  24, 97, 105, 65, 112,
];

/* 35 curated matchup pages (matchup rollout): localized slugs from the
 * simulation snapshot src/data/matchups.json (scripts/simulate-matchups.mjs),
 * e.g. /de/versus/glurak-gegen-turtok ↔ /en/versus/charizard-vs-blastoise */
const MATCHUPS_JSON = JSON.parse(readFileSync(new URL('../src/data/matchups.json', import.meta.url), 'utf8'));

const MATCHUP_ROUTE_ENTRIES = MATCHUPS_JSON.matchups.map((m) => ({
  de: `/versus/${m.slugDe}`,
  en: `/versus/${m.slugEn}`,
}));

export const STATIC_ROUTES = [
  '/',
  '/pokedex',
  '/items',
  '/maps',
  '/nuzlocke',
  '/team',
  '/versus',
  '/about',
  '/feedback',
  '/support',
  /* battle-simulator landing (localized slugs) */
  { de: '/kampf-simulator', en: '/battle-simulator' },
  /* type hub + 18 type pages (localized paths) */
  { de: '/typen', en: '/types' },
  ...Object.values(TYPE_SLUGS).map(([de, en]) => ({
    de: `/typen/${de}`,
    en: `/types/${en}`,
  })),
  /* 25 item detail pages (localized slugs) */
  ...ITEM_SLUGS.map(([de, en]) => ({ de: `/items/${de}`, en: `/items/${en}` })),
  /* Kanto location pages (localized slugs) */
  ...KANTO_ROUTE_ENTRIES,
  /* curated Pokémon detail pages */
  ...POKEMON_SEO_IDS.map((id) => `/pokemon/${id}`),
  /* curated matchup pages (localized slugs) */
  ...MATCHUP_ROUTE_ENTRIES,
];

/** localePath() equivalent: '/pokedex' + 'de' → '/de/pokedex'; '/' → '/de' */
export function localePath(lang, path) {
  return `/${lang}${path === '/' ? '' : path}`;
}

/** Rest path of a route entry for a given locale. */
export function restFor(entry, lang) {
  return typeof entry === 'string' ? entry : entry[lang];
}

/** All localized URLs, de first then en (matches sitemap reading order). */
export function allLocalizedRoutes() {
  const out = [];
  for (const entry of STATIC_ROUTES) {
    for (const lang of LANGS) {
      const rest = restFor(entry, lang);
      out.push({ lang, rest, path: localePath(lang, rest) });
    }
  }
  return out;
}
