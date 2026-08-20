import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { buildTcgFilterChips, tcgFilterActiveCount } from './tcg-filters';
import { queryTcgCards } from './tcg-search';
import { DEFAULT_TCG_FILTERS, tcgBestMarketPrice } from './tcg-types';

const deCards = JSON.parse(readFileSync(new URL('../data/tcg/index.de.json', import.meta.url), 'utf8')).cards;

describe('tcg integration (index.de.json)', () => {
  it('sorts Glurak by best Cardmarket price desc', () => {
    const r = queryTcgCards(deCards, { ...DEFAULT_TCG_FILTERS, q: 'Glurak', sort: 'price-desc' }, 'de');
    expect(r.length).toBeGreaterThan(50);
    expect(r[0].setName).toMatch(/Skyridge/i);
    expect(tcgBestMarketPrice(r[0], 'de')).toBeGreaterThan(4000);
  });

  it('filters by CM low range and builds chips', () => {
    const f = { ...DEFAULT_TCG_FILTERS, cmLow: { min: 100, max: 500 } };
    const r = queryTcgCards(deCards, f, 'de');
    expect(r.length).toBeGreaterThan(0);
    for (const c of r.slice(0, 20)) {
      const low = c.pricing.cardmarket?.low;
      if (low != null) {
        expect(low).toBeGreaterThanOrEqual(100);
        expect(low).toBeLessThanOrEqual(500);
      }
    }
    const chips = buildTcgFilterChips(f, { sets: [], series: [] }, (k) => k, 'de', true);
    expect(chips.length).toBe(1);
    expect(tcgFilterActiveCount(f)).toBe(1);
  });

  it('dex scope on detail panel query', () => {
    const r = queryTcgCards(deCards, DEFAULT_TCG_FILTERS, 'de', 6);
    expect(r.length).toBeGreaterThan(80);
    expect(r.every((c) => c.dexIds?.includes(6))).toBe(true);
  });
});
