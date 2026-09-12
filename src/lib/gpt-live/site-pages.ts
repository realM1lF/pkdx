/**
 * Domain contract — GPT-Live site_pages wrapper.
 *
 * Returns the same footer nav links the site Footer shows (label + locale path).
 * Must-not: fetch or summarize Impressum, Datenschutz, or other legal page bodies.
 */
import de from '@/i18n/locales/de/translation.json';
import en from '@/i18n/locales/en/translation.json';
import {
  FOOTER_GROUP_I18N,
  FOOTER_NAV_LINKS,
  localePath,
  type FooterLinkGroup,
} from '@/lib/site-pages';
import type { GptLiveSessionContext } from './session-context';

export const SITE_PAGES = 'site_pages';

export const SITE_PAGES_TOOL = {
  type: 'function' as const,
  name: SITE_PAGES,
  description:
    'List footer site, legal, and explore page links (labels + locale paths). Use to point users to About, Feedback, Donate, Impressum, Privacy, Licenses, or main app tabs. Does not return page content.',
  strict: true as const,
  parameters: {
    type: 'object' as const,
    properties: {},
    required: [] as string[],
    additionalProperties: false as const,
  },
};

export interface SitePageRow {
  id: string;
  path: string;
  group: FooterLinkGroup;
  labels: { de: string; en: string };
  paths: { de: string; en: string };
}

export interface SitePageSection {
  id: FooterLinkGroup;
  labels: { de: string; en: string };
  pages: SitePageRow[];
}

export type SitePagesOk = {
  ok: true;
  sections: SitePageSection[];
  pages: SitePageRow[];
  spoken_hint: string;
};

export type SitePagesResult = SitePagesOk;

function footerLabel(lang: 'de' | 'en', key: `footer.${string}`): string {
  const bucket = lang === 'de' ? de.footer : en.footer;
  const leaf = key.slice('footer.'.length) as keyof typeof bucket;
  const value = bucket[leaf];
  return typeof value === 'string' ? value : key;
}

function buildSections(): SitePageSection[] {
  const groups: FooterLinkGroup[] = ['site', 'legal', 'explore'];
  return groups.map((group) => {
    const groupKey = FOOTER_GROUP_I18N[group];
    const pages = FOOTER_NAV_LINKS.filter((row) => row.group === group).map((row) => ({
      id: row.id,
      path: row.path,
      group: row.group,
      labels: {
        de: footerLabel('de', row.i18nKey),
        en: footerLabel('en', row.i18nKey),
      },
      paths: {
        de: localePath('de', row.path),
        en: localePath('en', row.path),
      },
    }));
    return {
      id: group,
      labels: {
        de: footerLabel('de', groupKey),
        en: footerLabel('en', groupKey),
      },
      pages,
    };
  });
}

export function sitePagesFromArgs(_args: unknown, _ctx: GptLiveSessionContext): SitePagesResult {
  const sections = buildSections();
  return {
    ok: true,
    sections,
    pages: sections.flatMap((section) => section.pages),
    spoken_hint:
      'Point the user to the footer link by label and section (Die Seite / The Site, Rechtliches / Legal, Entdecken / Explore). Do not quote or summarize legal page text.',
  };
}
