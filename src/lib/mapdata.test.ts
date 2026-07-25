/* Encounter-method classification invariants (encounter-consistency fix).
 * Guards the method census: one-off event methods (Poké Flute, trades,
 * Squirt Bottle, Devon Scope) must stay out of the wild buckets, and the
 * fishing/surfing/walking variants must land in their proper bucket. */
import { describe, expect, it } from 'vitest';
import { aggregateArea, areaShortLabel, methodBucket, STATIC_METHODS } from './mapdata';

describe('aggregateArea chance semantics', () => {
  const area = {
    id: 1,
    name: 'kanto-route-19-area',
    pokemon_encounters: [
      {
        pokemon: { name: 'horsea', url: 'https://pokeapi.co/api/v2/pokemon/116/' },
        version_details: [
          {
            version: { name: 'firered', url: '' },
            /* raw PokéAPI max_chance would be 170 — summing across mutually
               exclusive methods must never happen */
            max_chance: 170,
            encounter_details: [
              { chance: 40, min_level: 5, max_level: 10, method: { name: 'old-rod', url: '' } },
              { chance: 60, min_level: 5, max_level: 15, method: { name: 'good-rod', url: '' } },
              { chance: 60, min_level: 15, max_level: 25, method: { name: 'super-rod', url: '' } },
              { chance: 10, min_level: 20, max_level: 30, method: { name: 'super-rod', url: '' } },
            ],
          },
        ],
      },
    ],
  };

  it('sums slots per method, then takes the max across methods (never > 100)', () => {
    const g = aggregateArea(area, 'kanto-route-19', 'firered');
    const horsea = g.entries.find((e) => e.slug === 'horsea');
    expect(horsea).toBeDefined();
    /* super-rod 60+10=70 is the best bucket; old-rod 40, good-rod 60 */
    expect(horsea!.maxChance).toBe(70);
    expect(horsea!.maxChance).toBeLessThanOrEqual(100);
    expect(horsea!.minLevel).toBe(5);
    expect(horsea!.maxLevel).toBe(30);
    expect(horsea!.methods).toEqual(['FISH']);
  });
});

describe('methodBucket', () => {
  it('classifies the rod family as FISH', () => {
    for (const m of ['old-rod', 'good-rod', 'super-rod', 'super-rod-spots', 'feebas-tile-fishing']) {
      expect(methodBucket(m)).toBe('FISH');
    }
  });

  it('classifies water walking variants as SURF', () => {
    expect(methodBucket('surf')).toBe('SURF');
    expect(methodBucket('surf-spots')).toBe('SURF');
  });

  it('classifies tree/overhead wild variants as WALK', () => {
    for (const m of ['walk', 'dark-grass', 'grass-spots', 'honey-tree', 'honey-trees', 'headbutt', 'headbutt-low', 'headbutt-normal', 'headbutt-high']) {
      expect(methodBucket(m)).toBe('WALK');
    }
  });

  it('keeps one-off event methods out of the wild buckets', () => {
    for (const m of ['gift', 'gift-egg', 'only-one', 'static', 'pokeflute', 'npc-trade', 'squirt-bottle', 'devon-scope']) {
      expect(methodBucket(m)).toBe('OTHER');
      expect(STATIC_METHODS.has(m)).toBe(true);
    }
  });
});

describe('areaShortLabel', () => {
  it('maps the main area to MAIN (not AREA)', () => {
    expect(areaShortLabel('celadon-city-area', 'celadon-city')).toBe('MAIN');
    expect(areaShortLabel('mt-moon-area', 'mt-moon')).toBe('MAIN');
  });

  it('derives floor/section labels', () => {
    expect(areaShortLabel('mt-moon-b1f', 'mt-moon')).toBe('B1F');
    expect(areaShortLabel('celadon-city-prize-corner', 'celadon-city')).toBe('PRIZE CORNER');
  });
});
