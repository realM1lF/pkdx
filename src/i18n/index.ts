/* i18n core — i18next + react-i18next + browser language detector.
 * Languages: en (fallback) + de. Persisted in localStorage under `pdx2.lang`.
 * Detection order: localStorage → navigator → 'en'. Switching is live (no reload);
 * `document.documentElement.lang` is kept in sync.
 *
 * EP1.2: only the ACTIVE language is bundled. The en bundle is the static
 * fallback; the de UI bundle + the de name artifacts (src/lib/i18n-data.ts)
 * load via dynamic import() when German becomes active, then a synthetic
 * `languageChanged` emit re-renders subscribed components. */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en/translation.json';
import { loadGermanData, onGermanDataLoaded } from '@/lib/i18n-data';

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
    },
    partialBundledLanguages: true,
    fallbackLng: 'en',
    supportedLngs: ['en', 'de'],
    interpolation: { escapeValue: false },
    returnNull: false,
    detection: {
      // URL prefix is the source of truth (WP7); then persisted choice, then browser
      order: ['path', 'localStorage', 'navigator'],
      lookupFromPathIndex: 0,
      lookupLocalStorage: 'pdx2.lang',
      caches: ['localStorage'],
    },
  });

function syncHtmlLang(lng: string) {
  document.documentElement.lang = lng.startsWith('de') ? 'de' : 'en';
}

/* ---------- lazy German resources (UI bundle + name artifacts) ---------- */

let deBundlePromise: Promise<unknown> | null = null;

/** Dynamically import the de UI bundle + de name artifacts, then re-render. */
function ensureGermanResources(lng: string): void {
  if (!lng.startsWith('de')) return;
  if (!deBundlePromise) {
    deBundlePromise = Promise.all([
      import('./locales/de/translation.json'),
      loadGermanData(),
    ]).then(([de]) => {
      i18n.addResourceBundle('de', 'translation', de.default, true, true);
      // synthetic emit → react-i18next re-renders all useTranslation() subscribers
      // (artifacts notify separately via onGermanDataLoaded below)
      i18n.emit('languageChanged', i18n.language);
    });
    deBundlePromise.catch(() => {
      deBundlePromise = null; // allow retry after a failed load
    });
  }
}

/* The name artifacts resolve after the UI bundle (separate chunks) — re-render
 * again once they land so german names/aliases flip from the EN fallback. */
onGermanDataLoaded(() => {
  i18n.emit('languageChanged', i18n.language);
});

syncHtmlLang(i18n.language);
ensureGermanResources(i18n.language);
i18n.on('languageChanged', (lng) => {
  syncHtmlLang(lng);
  ensureGermanResources(lng);
});

export default i18n;
