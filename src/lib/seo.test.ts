import { describe, expect, it } from 'vitest';
import {
  SITE_URL,
  canonicalUrl,
  metaForPath,
  pathWithoutSearch,
  restForLang,
  robotsForPath,
} from './seo';

describe('robotsForPath', () => {
  it('noindexes the account login and existing vault / overlay surfaces', () => {
    expect(robotsForPath('/account')).toBe('noindex, nofollow');
    expect(robotsForPath('/account/')).toBe('noindex, nofollow');
    expect(robotsForPath('/team/abc-1')).toBe('noindex, nofollow');
    expect(robotsForPath('/team/s/zPAYLOAD')).toBe('noindex, nofollow');
    expect(robotsForPath('/overlay/nuzlocke/TOKEN')).toBe('noindex, nofollow');
    expect(robotsForPath('/voice-demo')).toBe('noindex, nofollow');
    expect(robotsForPath('/voice-demo/')).toBe('noindex, nofollow');
  });

  it('keeps impressum and public hubs indexable', () => {
    expect(robotsForPath('/impressum')).toBeNull();
    expect(robotsForPath('/')).toBeNull();
    expect(robotsForPath('/team')).toBeNull();
    expect(robotsForPath('/pokedex')).toBeNull();
    expect(robotsForPath('/datenschutz')).toBeNull();
  });
});

describe('home title length', () => {
  it('keeps the English default title at ≤60 characters', () => {
    const title = metaForPath('/').title.en;
    expect(title.startsWith('MyPokePanion')).toBe(true);
    expect(title.length).toBeLessThanOrEqual(60);
    expect(title.length).toBeGreaterThanOrEqual(50);
  });

  it('keeps the German default title at ≤60 characters', () => {
    const title = metaForPath('/').title.de;
    expect(title.startsWith('MyPokePanion')).toBe(true);
    expect(title.length).toBeLessThanOrEqual(60);
  });
});

describe('team and nuzlocke hub meta', () => {
  const team = metaForPath('/team');
  const nuzlocke = metaForPath('/nuzlocke');

  it('keeps titles in the 50–60 range and distinct from the visible H1', () => {
    expect(team.title.en.length).toBeGreaterThanOrEqual(50);
    expect(team.title.en.length).toBeLessThanOrEqual(60);
    expect(team.title.de.length).toBeGreaterThanOrEqual(50);
    expect(team.title.de.length).toBeLessThanOrEqual(60);
    expect(nuzlocke.title.en.length).toBeGreaterThanOrEqual(50);
    expect(nuzlocke.title.en.length).toBeLessThanOrEqual(60);
    expect(nuzlocke.title.de.length).toBeGreaterThanOrEqual(50);
    expect(nuzlocke.title.de.length).toBeLessThanOrEqual(60);

    expect(team.title.en).not.toBe('Team Builder');
    expect(team.title.de).not.toBe('Team-Builder');
    expect(nuzlocke.title.en).not.toBe('Nuzlocke Tracker');
    expect(nuzlocke.title.de).not.toBe('Nuzlocke-Tracker');
  });

  it('puts the hub intent at the front of the title', () => {
    expect(team.title.en.toLowerCase().startsWith('pokémon team builder')).toBe(true);
    expect(team.title.de.toLowerCase().startsWith('pokémon-teambuilder')).toBe(true);
    expect(nuzlocke.title.en.toLowerCase().startsWith('nuzlocke tracker')).toBe(true);
    expect(nuzlocke.title.de.toLowerCase().startsWith('nuzlocke-tracker')).toBe(true);
  });

  it('writes descriptions as snippet copy, 150–160 chars, not a title reprint', () => {
    for (const meta of [team, nuzlocke]) {
      expect(meta.description.en.length).toBeGreaterThanOrEqual(150);
      expect(meta.description.en.length).toBeLessThanOrEqual(160);
      expect(meta.description.de.length).toBeGreaterThanOrEqual(150);
      expect(meta.description.de.length).toBeLessThanOrEqual(160);
      expect(meta.description.en).not.toBe(meta.title.en);
      expect(meta.description.de).not.toBe(meta.title.de);
      expect(meta.description.en).not.toMatch(/ — /);
      expect(meta.description.de).not.toMatch(/ — /);
    }

    expect(team.description.en.toLowerCase()).toMatch(/legality/);
    expect(team.description.de).toMatch(/Legalität/);
    expect(team.description.de).not.toMatch(/\b[Dd]u\b/);
    expect(team.description.de).not.toMatch(/\b[Dd]ein/);
    expect(nuzlocke.description.en.toLowerCase()).toMatch(/guided|freeform/);
    expect(nuzlocke.description.de).toMatch(/Geführte|freie Runs/);
    expect(nuzlocke.description.de).not.toMatch(/\b[Dd]u\b/);
    expect(nuzlocke.description.de).not.toMatch(/\b[Dd]ein/);
  });
});

describe('facet canonical + title stay on the hub', () => {
  it('strips query and hash from the SEO path', () => {
    expect(pathWithoutSearch('/pokedex?type=fire')).toBe('/pokedex');
    expect(pathWithoutSearch('/pokedex?q=pika')).toBe('/pokedex');
    expect(pathWithoutSearch('/versus?you=6&vs=9')).toBe('/versus');
    expect(pathWithoutSearch('/nuzlocke?wizard=1&region=kanto')).toBe('/nuzlocke');
    expect(pathWithoutSearch('/kampf-simulator/')).toBe('/kampf-simulator');
    expect(pathWithoutSearch('/versus/')).toBe('/versus');
  });

  it('reuses hub title and canonical for filter / wizard query strings', () => {
    const pokedex = metaForPath('/pokedex');
    expect(metaForPath('/pokedex?type=water')).toEqual(pokedex);
    expect(metaForPath('/pokedex?q=glurak')).toEqual(pokedex);
    expect(canonicalUrl('en', '/pokedex?type=fire')).toBe(`${SITE_URL}/en/pokedex/`);
    expect(canonicalUrl('de', '/pokedex?q=pika')).toBe(`${SITE_URL}/de/pokedex/`);

    const versus = metaForPath('/versus');
    expect(metaForPath('/versus?you=6')).toEqual(versus);
    expect(canonicalUrl('en', '/versus?you=6&vs=9')).toBe(`${SITE_URL}/en/versus/`);

    const nuzlocke = metaForPath('/nuzlocke');
    expect(metaForPath('/nuzlocke?wizard=1&region=kanto')).toEqual(nuzlocke);
    expect(canonicalUrl('de', '/nuzlocke?wizard=1')).toBe(`${SITE_URL}/de/nuzlocke/`);
  });

  it('keeps type detail pages as real URLs with their own canonical', () => {
    const water = metaForPath('/types/water');
    const wasser = metaForPath('/typen/wasser');
    expect(water.title.en).toMatch(/Water type/i);
    expect(wasser.title.de).toMatch(/Wasser-Typ/);
    expect(water).not.toEqual(metaForPath('/pokedex'));
    expect(canonicalUrl('en', restForLang('/types/water', 'en'))).toBe(`${SITE_URL}/en/types/water/`);
    expect(canonicalUrl('de', restForLang('/types/water', 'de'))).toBe(`${SITE_URL}/de/typen/wasser/`);
    expect(canonicalUrl('en', restForLang('/typen/wasser', 'en'))).toBe(`${SITE_URL}/en/types/water/`);
  });
});
