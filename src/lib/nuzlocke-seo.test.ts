import { describe, expect, it } from 'vitest';
import { metaForPath } from './seo';
import {
  NUZLOCKE_SEO_PAGES,
  NUZLOCKE_SEO_SLUGS,
  isNuzlockeSeoSlug,
  nuzlockeSeoPath,
} from './nuzlocke-seo';
import { nuzlockeGuideContent } from './nuzlocke-guide-content';
import { nuzlockeSeoContent } from './nuzlocke-seo-content';
import de from '@/i18n/locales/de/translation.json';
import en from '@/i18n/locales/en/translation.json';

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

describe('Nuzlocke hub on-page copy', () => {
  function collectStrings(value: unknown): string[] {
    if (typeof value === 'string') return [value];
    if (Array.isArray(value)) return value.flatMap(collectStrings);
    if (value && typeof value === 'object') {
      return Object.values(value as Record<string, unknown>).flatMap(collectStrings);
    }
    return [];
  }

  it('keeps WhatIs copy free of em-dashes and German du-form', () => {
    const enText = [en.nuz.blurb, ...collectStrings(en.nuz.whatIsSection)].join(' ');
    const deText = [de.nuz.blurb, ...collectStrings(de.nuz.whatIsSection)].join(' ');
    expect(enText).not.toMatch(/ — /);
    expect(deText).not.toMatch(/ — /);
    expect(deText).not.toMatch(/\b[Dd]u\b/);
    expect(deText).not.toMatch(/\b[Dd]ein/);
  });

  it('does not pitch the tracker inside the WhatIs variants paragraph', () => {
    expect(en.nuz.whatIsSection.variants).not.toMatch(/this tracker supports/i);
    expect(de.nuz.whatIsSection.variants).not.toMatch(/Dieser Tracker unterstützt/);
  });

  it('gives FAQ answers facts that the games/multi blocks do not already state', () => {
    for (const lang of ['en', 'de'] as const) {
      const content = nuzlockeSeoContent(lang);
      const gamesText = `${content.games.body} ${content.games.freeformNote}`;
      const multiText = content.multi.body;
      expect(content.faq.items.length).toBeGreaterThanOrEqual(6);
      for (const item of content.faq.items) {
        expect(item.a).not.toBe(content.games.body);
        expect(item.a).not.toBe(content.games.freeformNote);
        expect(item.a).not.toBe(multiText);
        expect(gamesText.includes(item.a)).toBe(false);
        expect(multiText.includes(item.a)).toBe(false);
      }
    }
    expect(nuzlockeSeoContent('en').faq.items[0].a).toMatch(/FireRed/);
    expect(nuzlockeSeoContent('de').faq.items[0].a).toMatch(/Feuerrot/);
  });

  it('keeps German FAQ answers free of du-form and em-dashes', () => {
    const deText = collectStrings(nuzlockeSeoContent('de').faq).join(' ');
    expect(deText).not.toMatch(/ — /);
    expect(deText).not.toMatch(/\b[Dd]u\b/);
    expect(deText).not.toMatch(/\b[Dd]ein/);
  });
});
