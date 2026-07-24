/* Shared route table for the SEO build scripts (sitemap + prerender).
 * Locale-stripped app paths only — the scripts expand them to /de… and
 * /en… URLs. Keep in sync with the static routes in src/App.tsx and the
 * meta registry in src/lib/seo.ts. */
export const SITE_URL = 'https://mypokepanion.com';

export const LANGS = ['de', 'en'];

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
];

/** localePath() equivalent: '/pokedex' + 'de' → '/de/pokedex'; '/' → '/de' */
export function localePath(lang, path) {
  return `/${lang}${path === '/' ? '' : path}`;
}

/** All localized URLs, de first then en (matches sitemap reading order). */
export function allLocalizedRoutes() {
  const out = [];
  for (const rest of STATIC_ROUTES) {
    for (const lang of LANGS) {
      out.push({ lang, rest, path: localePath(lang, rest) });
    }
  }
  return out;
}
