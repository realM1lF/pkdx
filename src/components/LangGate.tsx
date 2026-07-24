/* LangGate + LangRedirect — URL language routing (WP7).
 *
 * LangGate wraps the whole route tree under /:lang — validates the segment,
 * syncs it bidirectionally with i18n/localStorage/html-lang and renders the
 * SEO head (src/components/SeoHead.tsx). Invalid segments and unprefixed
 * legacy URLs redirect to the detected language, preserving query + hash. */
import { useEffect } from 'react';
import { Navigate, Outlet, useLocation, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { currentLang, type Lang } from '@/lib/i18n-data';
import { isSupportedLang, localePath, stripLocalePrefix } from '@/lib/locale-link';
import SeoHead from './SeoHead';

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
