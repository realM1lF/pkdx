import { describe, expect, it } from 'vitest';
import { artworkEditionMismatchesDefault, artworkVersionId } from './maps-geo';

describe('artworkVersionId', () => {
  it('reads johto geo.version as goldsilver', () => {
    expect(artworkVersionId('johto')).toBe('goldsilver');
  });

  it('reads unova geo.version as black-2', () => {
    expect(artworkVersionId('unova')).toBe('black-2');
  });
});

describe('artworkEditionMismatchesDefault', () => {
  it('flags johto Gold/Silver artwork against HeartGold default', () => {
    expect(artworkEditionMismatchesDefault('johto', 'heartgold')).toBe(true);
  });

  it('does not flag kanto FireRed artwork against FireRed default', () => {
    expect(artworkEditionMismatchesDefault('kanto', 'firered')).toBe(false);
  });

  it('flags unova Black 2 artwork against Black default', () => {
    expect(artworkEditionMismatchesDefault('unova', 'black')).toBe(true);
  });
});
