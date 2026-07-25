/* Encounter-method classification invariants (encounter-consistency fix).
 * Guards the method census: one-off event methods (Poké Flute, trades,
 * Squirt Bottle, Devon Scope) must stay out of the wild buckets, and the
 * fishing/surfing/walking variants must land in their proper bucket. */
import { describe, expect, it } from 'vitest';
import { areaShortLabel, methodBucket, STATIC_METHODS } from './mapdata';

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
