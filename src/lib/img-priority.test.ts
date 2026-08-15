import { describe, expect, it } from 'vitest';
import { ABOVE_FOLD_DEX_COUNT, heroArtworkSrc, isAboveFoldDexItem, spritePaintVisible, spriteImgAttrs } from './img-priority';

describe('spriteImgAttrs', () => {
  it('lazy-loads below-the-fold sprites', () => {
    expect(spriteImgAttrs({})).toEqual({ loading: 'lazy' });
  });

  it('eager-loads without promoting fetch priority', () => {
    expect(spriteImgAttrs({ eager: true })).toEqual({ loading: 'eager' });
  });

  it('marks the LCP sprite eager + high priority and reserves size', () => {
    expect(spriteImgAttrs({ priority: true, width: 80, height: 80 })).toEqual({
      loading: 'eager',
      fetchPriority: 'high',
      width: 80,
      height: 80,
    });
  });
});

describe('spritePaintVisible', () => {
  it('keeps the LCP sprite opaque before hydration', () => {
    expect(spritePaintVisible({ priority: true })).toBe(true);
    expect(spritePaintVisible({})).toBe(false);
  });
});

describe('isAboveFoldDexItem', () => {
  it('treats the first compact row-pair as above the fold', () => {
    expect(ABOVE_FOLD_DEX_COUNT).toBe(8);
    expect(isAboveFoldDexItem(0)).toBe(true);
    expect(isAboveFoldDexItem(7)).toBe(true);
    expect(isAboveFoldDexItem(8)).toBe(false);
    expect(isAboveFoldDexItem(-1)).toBe(false);
  });
});

describe('heroArtworkSrc', () => {
  it('serves the three spotlight mons from first-party WebP', () => {
    expect(heroArtworkSrc(6)).toBe('/hero/artwork-6.webp');
    expect(heroArtworkSrc(3)).toBe('/hero/artwork-3.webp');
    expect(heroArtworkSrc(9)).toBe('/hero/artwork-9.webp');
  });

  it('leaves every other id on the remote artwork URL', () => {
    expect(heroArtworkSrc(25)).toBe(
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
    );
  });
});
