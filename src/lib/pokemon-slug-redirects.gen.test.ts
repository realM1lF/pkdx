import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('public/_redirects pokemon aliases', () => {
  const body = readFileSync(new URL('../../public/_redirects', import.meta.url), 'utf8');
  const spa = body.indexOf('/*    /index.html   200');

  it('301s EN slugs and DE names to the numeric canonical before the SPA fallback', () => {
    expect(body).toContain('/en/pokemon/pikachu  /en/pokemon/25/  301');
    expect(body).toContain('/de/pokemon/glurak  /de/pokemon/6/  301');
    expect(body.indexOf('/en/pokemon/pikachu')).toBeLessThan(spa);
  });

  it('301s the wrong battle slug onto the locale-correct rest before the SPA fallback', () => {
    expect(body).toContain('/en/kampf-simulator  /en/battle-simulator/  301');
    expect(body).toContain('/de/battle-simulator  /de/kampf-simulator/  301');
    expect(body.indexOf('/en/kampf-simulator')).toBeLessThan(spa);
    expect(body.indexOf('/de/battle-simulator')).toBeLessThan(spa);
  });

  it('derives versus cross-locale 301s from matchups.json', () => {
    expect(body).toContain('/en/versus/glurak-gegen-turtok  /en/versus/charizard-vs-blastoise/  301');
    expect(body).toContain('/de/versus/charizard-vs-blastoise  /de/versus/glurak-gegen-turtok/  301');
    expect(body.indexOf('/en/versus/glurak-gegen-turtok')).toBeLessThan(spa);
  });

  it('language-302s the unprefixed team hub before the SPA fallback', () => {
    expect(body).toMatch(/\/team\s+\/de\/team\/\s+302\s+Language=de/);
    expect(body).toMatch(/\/team\s+\/en\/team\/\s+302/);
    expect(body.indexOf('/team')).toBeLessThan(spa);
  });

  it('passes sitemap.xml and robots.txt through before the SPA fallback', () => {
    const sitemap = body.indexOf('/sitemap.xml  /sitemap.xml  200');
    const robots = body.indexOf('/robots.txt');
    expect(sitemap).toBeGreaterThan(-1);
    expect(robots).toBeGreaterThan(-1);
    expect(sitemap).toBeLessThan(spa);
    expect(robots).toBeLessThan(spa);
    expect(body).toMatch(/\/robots\.txt\s+\/robots\.txt\s+200/);
  });
});

