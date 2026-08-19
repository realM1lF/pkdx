import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  PDEX_SCROLL_KEY,
  clearPokedexScroll,
  commitPokedexScroll,
  peekPokedexScroll,
  pokedexBackPath,
  readPokedexScroll,
  restoreVisibleCount,
} from './pokedex-scroll';

describe('pokedex-scroll', () => {
  const storage: Record<string, string> = {};

  beforeEach(() => {
    for (const key of Object.keys(storage)) delete storage[key];
    vi.stubGlobal('sessionStorage', {
      getItem: (key: string) => storage[key] ?? null,
      setItem: (key: string, value: string) => {
        storage[key] = value;
      },
      removeItem: (key: string) => {
        delete storage[key];
      },
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('commit stores anchor + batch depth', () => {
    commitPokedexScroll({ anchorId: 12, visibleCount: 192, search: '?type=bug' });
    expect(readPokedexScroll()).toMatchObject({
      anchorId: 12,
      visibleCount: 192,
      search: '?type=bug',
    });
  });

  it('peekPokedexScroll requires matching search', () => {
    commitPokedexScroll({ anchorId: 1, visibleCount: 96, search: '?gen=1' });
    expect(peekPokedexScroll('?gen=2')).toBeNull();
    expect(readPokedexScroll()).toBeNull();

    commitPokedexScroll({ anchorId: 1, visibleCount: 96, search: '?gen=1' });
    expect(peekPokedexScroll('?gen=1')?.anchorId).toBe(1);
  });

  it('restoreVisibleCount expands for anchor index', () => {
    const indexById = new Map([[400, 150]]);
    expect(
      restoreVisibleCount(
        { anchorId: 400, visibleCount: 96, search: '', ts: 0 },
        1025,
        indexById,
        96,
      ),
    ).toBe(192);
  });

  it('pokedexBackPath preserves query string', () => {
    expect(pokedexBackPath('?type=bug')).toBe('/pokedex?type=bug');
    expect(pokedexBackPath('')).toBe('/pokedex');
  });

  it('clearPokedexScroll removes the session key', () => {
    commitPokedexScroll({ anchorId: 1, visibleCount: 96, search: '' });
    clearPokedexScroll();
    expect(sessionStorage.getItem(PDEX_SCROLL_KEY)).toBeNull();
  });
});
