/* i18n core — i18next + react-i18next + browser language detector.
 * Languages: en (fallback) + de. Persisted in localStorage under `pdx2.lang`.
 * Detection order: localStorage → navigator → 'en'. Switching is live (no reload);
 * `document.documentElement.lang` is kept in sync. */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en/translation.json';
import de from './locales/de/translation.json';

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      de: { translation: de },
    },
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

syncHtmlLang(i18n.language);
i18n.on('languageChanged', syncHtmlLang);

export default i18n;
