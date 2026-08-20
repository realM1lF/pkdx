import { describe, expect, it } from 'vitest';
import { buildTcgParams, parseTcgParams } from './tcg-filters';
import { DEFAULT_TCG_FILTERS, type TcgCardSummary, tcgBestMarketPrice } from './tcg-types';
import { filterTcgCards, queryTcgCards, sortTcgCards } from './tcg-search';

const sample: TcgCardSummary[] = [
  {
    id: 'a-1',
    name: 'Pikachu',
    localId: '25',
    setId: 'base1',
    setName: 'Base',
    releaseDate: '1999-01-09',
    rarity: 'Common',
    category: 'Pokémon',
    dexIds: [25],
    hp: 40,
    types: ['Lightning'],
    stage: 'Basic',
    variants: { normal: true, holo: false, reverse: false, firstEdition: false },
    pricing: {
      cardmarket: { low: 5, trend: 6, avg30: 7 },
      tcgplayer: { holofoil: { marketPrice: 8, lowPrice: 4, midPrice: 7, highPrice: 20 } },
    },
  },
  {
    id: 'b-2',
    name: 'Charizard',
    localId: '4',
    setId: 'base1',
    setName: 'Base',
    releaseDate: '1999-01-09',
    rarity: 'Rare Holo',
    category: 'Pokémon',
    dexIds: [6],
    hp: 120,
    types: ['Fire'],
    stage: 'Stage 2',
    variants: { normal: false, holo: true, reverse: false, firstEdition: true },
    pricing: {
      cardmarket: { low: 200, trend: 250, avg30: 240 },
      tcgplayer: { holofoil: { marketPrice: 300, lowPrice: 180, midPrice: 280, highPrice: 500 } },
    },
  },
  {
    id: 'c-3',
    name: 'Bulbasaur',
    localId: '44',
    setId: 'base1',
    setName: 'Base',
    releaseDate: '1999-01-09',
    rarity: 'Common',
    category: 'Pokémon',
    dexIds: [1],
    hp: 40,
    types: ['Grass'],
    stage: 'Basic',
    variants: { normal: true, holo: false, reverse: false, firstEdition: false },
    pricing: { cardmarket: {} },
  },
  {
    id: 'd-4',
    name: 'Venusaur Holo',
    localId: '15',
    setId: 'base1',
    setName: 'Base',
    releaseDate: '1999-01-09',
    rarity: 'Rare Holo',
    category: 'Pokémon',
    dexIds: [3],
    hp: 100,
    types: ['Grass'],
    stage: 'Stage 2',
    variants: { normal: false, holo: true, reverse: false, firstEdition: false },
    pricing: {
      cardmarket: { low: 10, lowHolo: 80, trend: 12, trendHolo: 90 },
    },
  },
];

describe('tcg-filters url', () => {
  it('round-trips dex and sort', () => {
    const f = { ...DEFAULT_TCG_FILTERS, dexId: 25, sort: 'price-desc' as const, q: 'pika' };
    const p = buildTcgParams(f);
    const back = parseTcgParams(p);
    expect(back.dexId).toBe(25);
    expect(back.sort).toBe('price-desc');
    expect(back.q).toBe('pika');
  });
});

describe('tcg-search', () => {
  it('filters by dex scope', () => {
    const out = filterTcgCards(sample, DEFAULT_TCG_FILTERS, 'de', 25);
    expect(out.map((c) => c.id)).toEqual(['a-1']);
  });

  it('sorts by price desc in en', () => {
    const out = sortTcgCards(sample, 'price-desc', 'en');
    expect(out[0].id).toBe('b-2');
  });

  it('sorts holo higher than normal in de price-desc', () => {
    const cards = [sample[0], sample[3]];
    const out = sortTcgCards(cards, 'price-desc', 'de');
    expect(out[0].id).toBe('d-4');
    expect(tcgBestMarketPrice(out[0], 'de')).toBe(90);
  });

  it('puts no-price cards last in price sort', () => {
    const out = sortTcgCards(sample, 'price-desc', 'de');
    expect(out[out.length - 1].id).toBe('c-3');
  });

  it('queries with text search', () => {
    const f = { ...DEFAULT_TCG_FILTERS, q: 'char' };
    const out = queryTcgCards(sample, f, 'en');
    expect(out).toHaveLength(1);
    expect(out[0].name).toBe('Charizard');
  });
});
