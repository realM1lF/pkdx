/* SeoHead — central per-route head manager (SEO foundation).
 *
 * Rendered once by LangGate above the route tree; derives the active route
 * from useLocation (locale prefix stripped) and syncs:
 *   - document.title + meta description + Open Graph (from src/lib/seo.ts)
 *   - canonical + hreflang alternates (de / en / x-default)
 *   - JSON-LD structured data (from src/lib/structured-data.ts)
 *
 * All URLs use the production SITE_URL (not window.location.origin) so the
 * prerendered HTML captured by scripts/prerender.mjs is valid on any host.
 * Base tags that already exist in index.html are updated in place; tags we
 * create ourselves are removed again on route change. */
import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { stripLocalePrefix, localePath } from '@/lib/locale-link';
import type { Lang } from '@/lib/i18n-data';
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE, metaForPath, canonicalUrl } from '@/lib/seo';
import { schemasForRoute } from '@/lib/structured-data';

function upsertMeta(
  attr: 'name' | 'property',
  key: string,
  content: string,
  managed: Element[],
): void {
  const selector = `meta[${attr}="${key}"]`;
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
    managed.push(el);
  }
  el.content = content;
}

function upsertLink(
  rel: string,
  hreflang: string | null,
  href: string,
  managed: Element[],
): void {
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
}

export default function SeoHead({ lang }: { lang: Lang }) {
  const location = useLocation();
  const rest = stripLocalePrefix(location.pathname);

  useEffect(() => {
    const meta = metaForPath(rest);
    const managed: Element[] = [];

    /* title + description + Open Graph */
    document.title = meta.title[lang];
    upsertMeta('name', 'description', meta.description[lang], managed);
    upsertMeta('property', 'og:title', meta.title[lang], managed);
    upsertMeta('property', 'og:description', meta.description[lang], managed);
    upsertMeta('property', 'og:url', canonicalUrl(lang, rest), managed);
    upsertMeta('property', 'og:type', meta.ogType ?? 'website', managed);
    upsertMeta('property', 'og:image', DEFAULT_OG_IMAGE, managed);
    upsertMeta('property', 'og:site_name', SITE_NAME, managed);
    upsertMeta('property', 'og:locale', lang === 'de' ? 'de_DE' : 'en_US', managed);

    /* canonical + hreflang alternates */
    upsertLink('alternate', 'de', `${SITE_URL}${localePath('de', rest)}`, managed);
    upsertLink('alternate', 'en', `${SITE_URL}${localePath('en', rest)}`, managed);
    upsertLink('alternate', 'x-default', `${SITE_URL}${localePath('en', rest)}`, managed);
    upsertLink('canonical', null, canonicalUrl(lang, rest), managed);

    /* JSON-LD structured data — upsert per id, drop blocks that no longer apply */
    const wanted = schemasForRoute(rest, lang);
    const wantedIds = new Set(wanted.map((b) => b.id));
    document.head
      .querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"][data-seo]')
      .forEach((el) => {
        if (!wantedIds.has(el.dataset.seo!)) el.remove();
      });
    for (const block of wanted) {
      let el = document.head.querySelector<HTMLScriptElement>(
        `script[type="application/ld+json"][data-seo="${block.id}"]`,
      );
      if (!el) {
        el = document.createElement('script');
        el.type = 'application/ld+json';
        el.dataset.seo = block.id;
        document.head.appendChild(el);
      }
      el.textContent = JSON.stringify(block.data);
    }

    return () => {
      /* remove only elements we created (pre-existing ones keep their updated values) */
      managed.forEach((el) => el.remove());
    };
  }, [lang, rest]);

  return null;
}
