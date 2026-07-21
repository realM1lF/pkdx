/* Locale-aware routing helpers (WP7).
 *
 * All internal links/navigations MUST go through useLocalePath()/LocaleLink so
 * every route lives under its language prefix (/de/…, /en/…). The URL prefix is
 * the source of truth for the active language; i18n + localStorage follow it.
 *
 * The DATA MODEL is unaffected: slugs, ids and query params stay English. */
import { forwardRef } from 'react';
import type { ComponentProps } from 'react';
import { Link, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { currentLang, type Lang } from './i18n-data';

export const SUPPORTED_LANGS: readonly Lang[] = ['en', 'de'];

export function isSupportedLang(v: string | undefined): v is Lang {
  return v === 'en' || v === 'de';
}

/** Active locale: valid route param wins, otherwise the detected i18n language. */
export function useLocale(): Lang {
  const { lang } = useParams();
  const { i18n } = useTranslation();
  return isSupportedLang(lang) ? lang : currentLang(i18n.language);
}

/** Returns `(path) => `/${lang}${path}`` — pass absolute app paths ('/pokedex'). */
export function useLocalePath(): (path: string) => string {
  const lang = useLocale();
  return (path: string) => {
    if (!path.startsWith('/')) return path; // external anchors etc. — untouched
    return `/${lang}${path === '/' ? '' : path}`;
  };
}

/** Prefix a path with an explicit locale (used by the toggle + redirects). */
export function localePath(lang: Lang, path: string): string {
  return `/${lang}${path === '/' ? '' : path}`;
}

/** Strip a leading /de|/en prefix; returns the bare app path ('/' for the root). */
export function stripLocalePrefix(pathname: string): string {
  const stripped = pathname.replace(/^\/(de|en)(?=\/|$)/, '');
  return stripped === '' ? '/' : stripped;
}

type LocaleLinkProps = Omit<ComponentProps<typeof Link>, 'to'> & { to: string };

/** Link that prefixes internal app paths with the active locale. */
export const LocaleLink = forwardRef<HTMLAnchorElement, LocaleLinkProps>(function LocaleLink(
  { to, ...props },
  ref,
) {
  const localize = useLocalePath();
  return <Link ref={ref} to={localize(to)} {...props} />;
});
