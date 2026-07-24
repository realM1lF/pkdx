/* Shared route table for the SEO build scripts (sitemap + prerender).
 * Locale-stripped app paths only — the scripts expand them to /de… and
 * /en… URLs. Keep in sync with the static routes in src/App.tsx and the
 * meta registry in src/lib/seo.ts.
 *
 * Entries are either a string (same rest path in both locales) or a
 * { de, en } pair for routes with localized slugs (type pages:
 * /de/typen/wasser ↔ /en/types/water; item pages: /de/items/ep-teiler ↔
 * /en/items/exp-share). */
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

export const STATIC_ROUTES = [
  '/',
  '/pokedex',
  '/items',
  '/maps',
  '/maps/kanto/route-1',
  '/pokemon/25',
  '/nuzlocke',
  '/team',
  '/versus',
  '/about',
  '/feedback',
  '/support',
  /* type hub + 18 type pages (localized paths) */
  { de: '/typen', en: '/types' },
  ...Object.values(TYPE_SLUGS).map(([de, en]) => ({
    de: `/typen/${de}`,
    en: `/types/${en}`,
  })),
  /* 25 item detail pages (localized slugs) */
  ...ITEM_SLUGS.map(([de, en]) => ({ de: `/items/${de}`, en: `/items/${en}` })),
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
