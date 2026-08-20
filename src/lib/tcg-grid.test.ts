import { describe, expect, it } from 'vitest';
import { TCG_INITIAL, TCG_MAX_RENDER, tcgCanLoadMore, tcgVisibleLimit } from './tcg-grid';

describe('tcg-grid', () => {
  it('caps visible count at MAX_RENDER', () => {
    expect(tcgVisibleLimit(500, 300)).toBe(TCG_MAX_RENDER);
    expect(tcgVisibleLimit(500, 100)).toBe(100);
  });

  it('shows all when total is small', () => {
    expect(tcgVisibleLimit(50, TCG_INITIAL)).toBe(50);
  });

  it('can load more until cap', () => {
    expect(tcgCanLoadMore(500, TCG_INITIAL)).toBe(true);
    expect(tcgCanLoadMore(500, TCG_MAX_RENDER)).toBe(false);
    expect(tcgCanLoadMore(30, 18)).toBe(true);
    expect(tcgCanLoadMore(30, 30)).toBe(false);
  });
});
