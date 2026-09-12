import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import de from '@/i18n/locales/de/translation.json';
import en from '@/i18n/locales/en/translation.json';
import {
  FOOTER_FEATURE_LINKS,
  FOOTER_LEGAL_LINKS,
  FOOTER_NAV_LINKS,
  FOOTER_SITE_LINKS,
} from '@/lib/site-pages';
import { executeRegisteredTool } from './registry';
import { SITE_PAGES, sitePagesFromArgs } from './site-pages';

describe('site_pages', () => {
  it('matches the Footer shared link table', () => {
    const footerSrc = readFileSync(resolve(process.cwd(), 'src/components/Footer.tsx'), 'utf8');
    expect(footerSrc).toContain("from '@/lib/site-pages'");
    expect(footerSrc).toContain('FOOTER_SITE_LINKS');
    expect(footerSrc).toContain('FOOTER_LEGAL_LINKS');
    expect(footerSrc).toContain('FOOTER_FEATURE_LINKS');

    expect(FOOTER_SITE_LINKS.map((row) => row.path)).toEqual(['/about', '/feedback', '/support']);
    expect(FOOTER_LEGAL_LINKS.map((row) => row.path)).toEqual([
      '/impressum',
      '/datenschutz',
      '/lizenzen',
    ]);
    expect(FOOTER_FEATURE_LINKS.map((row) => row.id)).toEqual([
      'home',
      'pokedex',
      'maps',
      'nuzlocke',
      'team',
      'versus',
      'items',
      'orre',
    ]);
    expect(FOOTER_NAV_LINKS).toHaveLength(
      FOOTER_SITE_LINKS.length + FOOTER_LEGAL_LINKS.length + FOOTER_FEATURE_LINKS.length,
    );
  });

  it('returns localized labels and paths without page bodies', () => {
    const result = sitePagesFromArgs({}, {});
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const feedback = result.pages.find((row) => row.id === 'feedback');
    expect(feedback).toMatchObject({
      path: '/feedback',
      group: 'site',
      labels: { de: de.footer.feedback, en: en.footer.feedback },
      paths: { de: '/de/feedback', en: '/en/feedback' },
    });

    const privacy = result.pages.find((row) => row.id === 'privacy');
    expect(privacy).toMatchObject({
      path: '/datenschutz',
      group: 'legal',
      labels: { de: de.footer.privacy, en: en.footer.privacy },
      paths: { de: '/de/datenschutz', en: '/en/datenschutz' },
    });

    expect(result.sections.map((section) => section.id)).toEqual(['site', 'legal', 'explore']);
    expect(result.spoken_hint).toContain('Do not quote');
    expect(JSON.stringify(result)).not.toMatch(/html|<p>|Impressumstext/i);
  });

  it('runs through executeRegisteredTool', async () => {
    const result = await executeRegisteredTool(SITE_PAGES, {}, {});
    expect(result).toMatchObject({ ok: true });
    const row = result as { pages: { id: string }[] };
    expect(row.pages.some((page) => page.id === 'support')).toBe(true);
    expect(row.pages.some((page) => page.id === 'impressum')).toBe(true);
  });
});
