/* LangGate + LangRedirect + SeoHead — URL language routing (WP7).
 *
 * LangGate wraps the whole route tree under /:lang — validates the segment,
 * syncs it bidirectionally with i18n/localStorage/html-lang and renders the
 * SEO head (hreflang + canonical). Invalid segments and unprefixed legacy
 * URLs redirect to the detected language, preserving query + hash. */
import { useEffect } from 'react';
import { Navigate, Outlet, useLocation, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { currentLang, type Lang } from '@/lib/i18n-data';
import { isSupportedLang, localePath, stripLocalePrefix } from '@/lib/locale-link';

/** /:lang/* gate — invalid lang redirects to the detected language. */
export function LangGate() {
  const { lang } = useParams();
  const location = useLocation();
  const { i18n } = useTranslation();

  if (!isSupportedLang(lang)) {
    // e.g. /fr/pokedex → /<detected>/pokedex (query + hash preserved)
    const rest = stripLocalePrefix(location.pathname);
    return <Navigate to={`${localePath(currentLang(i18n.language), rest)}${location.search}${location.hash}`} replace />;
  }

  return (
    <>
      <LangSync lang={lang} />
      <SeoHead lang={lang} />
      <Outlet />
    </>
  );
}

/** Route param → i18n + localStorage + <html lang> (i18n → URL is the toggle's job). */
function LangSync({ lang }: { lang: Lang }) {
  const { i18n } = useTranslation();
  useEffect(() => {
    if (currentLang(i18n.language) !== lang) void i18n.changeLanguage(lang);
    document.documentElement.lang = lang;
  }, [lang, i18n]);
  return null;
}

/** hreflang alternates + canonical for the current route, per language. */
function SeoHead({ lang }: { lang: Lang }) {
  const location = useLocation();
  const rest = stripLocalePrefix(location.pathname);

  useEffect(() => {
    const origin = window.location.origin;
    const managed: HTMLLinkElement[] = [];
    const upsert = (rel: string, hreflang: string | null, href: string) => {
      const selector = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]`;
      let el = document.head.querySelector<HTMLLinkElement>(selector);
      if (!el) {
        el = document.createElement('link');
        el.rel = rel;
        if (hreflang) el.hreflang = hreflang;
        document.head.appendChild(el);
        managed.push(el);
      }
      el.href = href;
    };
    upsert('alternate', 'de', `${origin}${localePath('de', rest)}${location.search}`);
    upsert('alternate', 'en', `${origin}${localePath('en', rest)}${location.search}`);
    upsert('alternate', 'x-default', `${origin}${localePath('en', rest)}${location.search}`);
    upsert('canonical', null, `${origin}${localePath(lang, rest)}${location.search}`);
    return () => {
      // remove only elements we created (pre-existing ones keep their updated href)
      managed.forEach((el) => el.remove());
    };
  }, [lang, rest, location.search]);

  return null;
}

/** Unknown path inside a valid /:lang tree → language home. */
export function LangHomeRedirect() {
  const { lang } = useParams();
  const { i18n } = useTranslation();
  const target = isSupportedLang(lang) ? lang : currentLang(i18n.language);
  return <Navigate to={localePath(target, '/')} replace />;
}

/** Unprefixed URLs (legacy links, '/') → detected language, query + hash preserved. */
export function LangRedirect() {
  const location = useLocation();
  const { i18n } = useTranslation();
  const rest = stripLocalePrefix(location.pathname);
  return (
    <Navigate
      to={`${localePath(currentLang(i18n.language), rest)}${location.search}${location.hash}`}
      replace
    />
  );
}
