/* Client fallback for the wrong battle-simulator slug under a locale.
 * Netlify 301s cover production; this keeps preview / non-Netlify hosts
 * from rendering a second canonical (query + hash preserved). */
import type { Lang } from './i18n-data';
import { isSupportedLang, localePath, stripLocalePrefix, withTrailingSlash } from './locale-link';
import { BATTLE_LANDING_RESTS } from './seo';

function restWithoutTrailingSlash(pathname: string): string {
  const rest = stripLocalePrefix(pathname);
  if (rest === '/') return rest;
  return rest.replace(/\/+$/, '');
}

/** Canonical battle rest for a locale (`/kampf-simulator` · `/battle-simulator`). */
export function battleLandingRest(lang: Lang): string {
  return BATTLE_LANDING_RESTS[lang];
}

/**
 * Path to replace-navigate onto when `pathname` is the other locale's battle
 * slug. Returns null when the rest is already correct or not a battle landing.
 */
export function battleLandingRedirectTo(
  lang: string | undefined,
  pathname: string,
  search = '',
  hash = '',
): string | null {
  if (!isSupportedLang(lang)) return null;
  const rest = restWithoutTrailingSlash(pathname);
  if (rest !== BATTLE_LANDING_RESTS.de && rest !== BATTLE_LANDING_RESTS.en) return null;
  const canonical = BATTLE_LANDING_RESTS[lang];
  if (rest === canonical) return null;
  return withTrailingSlash(`${localePath(lang, canonical)}${search}${hash}`);
}
