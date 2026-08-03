import { describe, expect, it } from 'vitest';
import { metaForPath } from './seo';
import {
  NUZLOCKE_SEO_PAGES,
  NUZLOCKE_SEO_SLUGS,
  isNuzlockeSeoSlug,
  nuzlockeSeoPath,
} from './nuzlocke-seo';
import { nuzlockeGuideContent } from './nuzlocke-guide-content';

describe('nuzlocke SEO registry', () => {
  it('contains the six curated satellite pages', () => {
    expect(NUZLOCKE_SEO_SLUGS).toEqual([
      'soul-link',
      'firered',
      'emerald',
      'platinum',
      'heartgold',
      'black-white',
    ]);
    expect(NUZLOCKE_SEO_PAGES.map((page) => page.slug)).toEqual(NUZLOCKE_SEO_SLUGS);
  });

  it('maps games to their regions, maps and wizard presets', () => {
    const pageFor = (slug: (typeof NUZLOCKE_SEO_SLUGS)[number]) =>
      NUZLOCKE_SEO_PAGES.find((page) => page.slug === slug);

    expect(pageFor('firered')).toMatchObject({
      regionId: 'kanto',
      mapPath: '/maps/kanto',
      wizardQuery: expect.stringContaining('region=kanto'),
    });
    expect(pageFor('emerald')?.regionId).toBe('hoenn');
    expect(pageFor('platinum')?.regionId).toBe('sinnoh');
    expect(pageFor('heartgold')?.regionId).toBe('johto');
    expect(pageFor('black-white')?.regionId).toBe('unova');
    expect(pageFor('soul-link')).toMatchObject({
      regionId: null,
      mapPath: null,
    });
  });

  it('recognizes only registered SEO slugs', () => {
    expect(isNuzlockeSeoSlug('firered')).toBe(true);
    expect(isNuzlockeSeoSlug('soul-link')).toBe(true);
    expect(isNuzlockeSeoSlug('missingno')).toBe(false);
    expect(isNuzlockeSeoSlug('')).toBe(false);
  });

  it('maps every slug to its Nuzlocke path and localized meta', () => {
    const defaultMeta = metaForPath('/');

    for (const page of NUZLOCKE_SEO_PAGES) {
      const path = nuzlockeSeoPath(page.slug);
      const meta = metaForPath(path);

      expect(path).toBe(`/nuzlocke/${page.slug}`);
      expect(meta).not.toBe(defaultMeta);
      expect(meta.title.de).not.toBe('');
      expect(meta.title.en).not.toBe('');
      expect(meta.description.de).not.toBe('');
      expect(meta.description.en).not.toBe('');
      expect(meta.title.de.length, `${page.slug} German title`).toBeLessThanOrEqual(60);
      expect(meta.title.en.length, `${page.slug} English title`).toBeLessThanOrEqual(60);
      expect(meta.description.de.length, `${page.slug} German description`).toBeLessThanOrEqual(160);
      expect(meta.description.en.length, `${page.slug} English description`).toBeLessThanOrEqual(160);
    }
  });

  it('provides complete localized copy for every guide', () => {
    for (const lang of ['en', 'de'] as const) {
      for (const slug of NUZLOCKE_SEO_SLUGS) {
        const guide = nuzlockeGuideContent(lang, slug);

        expect(guide.h1).not.toBe('');
        expect(guide.intro).not.toBe('');
        expect(guide.sections.length).toBeGreaterThanOrEqual(3);
        expect(guide.example.body).not.toBe('');
        expect(guide.faq.length).toBeGreaterThanOrEqual(3);
        expect(guide.cta.title).not.toBe('');
        expect(guide.links.backToHub).not.toBe('');
      }
    }
  });
});
