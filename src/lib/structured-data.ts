/* JSON-LD structured data (SEO foundation).
 *
 * Builders return plain schema.org objects; <SeoHead /> injects them as
 * <script type="application/ld+json"> into the head. Because injection
 * happens in the same runtime pass the prerender pipeline captures, the
 * static HTML carries identical structured data — no JS required. */
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE, metaForPath } from './seo';
import { localePath } from './locale-link';
import type { Lang } from './i18n-data';

type JsonLd = Record<string, unknown>;

/** Site-wide Organization — emitted on every page. */
export function organizationSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.svg`,
    description:
      'MyPokePanion is an unofficial Pokémon fan project: an interactive Pokédex with team builder, Nuzlocke tracker, Versus calculator and interactive maps.',
  };
}

/** Site-wide WebSite — emitted on every page (SearchAction targets /pokedex?q=). */
export function websiteSchema(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: ['de', 'en'],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}${localePath('en', '/pokedex')}?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/** BreadcrumbList from [name, absolute-or-rooted url] pairs. */
export function breadcrumbSchema(items: Array<{ name: string; url: string }>): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

/** SoftwareApplication for the interactive tool pages (free, GameApplication). */
export function softwareApplicationSchema(rest: string, lang: Lang): JsonLd | null {
  const names: Record<string, string> = {
    '/team': 'Pokémon Team Builder',
    '/nuzlocke': 'Nuzlocke Tracker',
    '/versus': 'Pokémon Versus Damage Calculator',
    '/maps': 'Interactive Pokémon Maps',
  };
  const name = names[rest];
  if (!name) return null;
  const meta = metaForPath(rest);
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    url: `${SITE_URL}${localePath(lang, rest)}`,
    applicationCategory: 'GameApplication',
    operatingSystem: 'Web',
    inLanguage: lang,
    description: meta.description[lang],
    image: DEFAULT_OG_IMAGE,
    offers: {
      '@type': 'Offer',
      price: 0,
      priceCurrency: 'EUR',
    },
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

/** All JSON-LD blocks for a route: site-wide + breadcrumb + tool schema. */
export function schemasForRoute(rest: string, lang: Lang): Array<{ id: string; data: JsonLd }> {
  const meta = metaForPath(rest);
  const blocks: Array<{ id: string; data: JsonLd }> = [
    { id: 'organization', data: organizationSchema() },
    { id: 'website', data: websiteSchema() },
  ];
  if (rest !== '/') {
    const homeName = lang === 'de' ? 'Startseite' : 'Home';
    const crumbName = meta.title[lang].split(' — ')[0];
    const trail: Array<{ name: string; url: string }> = [{ name: homeName, url: localePath(lang, '/') }];
    /* deeper trails for the SEO pilot pages (keeps parity with the visible
     * breadcrumb on /maps/kanto/route-1) */
    if (rest === '/maps/kanto/route-1') {
      trail.push({ name: 'Maps', url: localePath(lang, '/maps') });
      trail.push({ name: 'Kanto', url: localePath(lang, '/maps/kanto') });
      trail.push({ name: 'Route 1', url: localePath(lang, rest) });
    } else if (rest.startsWith('/pokemon/')) {
      trail.push({ name: 'Pokédex', url: localePath(lang, '/pokedex') });
      trail.push({ name: crumbName, url: localePath(lang, rest) });
    } else {
      trail.push({ name: crumbName, url: localePath(lang, rest) });
    }
    blocks.push({ id: 'breadcrumb', data: breadcrumbSchema(trail) });
  }
  const app = softwareApplicationSchema(rest, lang);
  if (app) blocks.push({ id: 'software-application', data: app });
  return blocks;
}
