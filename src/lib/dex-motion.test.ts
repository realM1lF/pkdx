import { describe, expect, it } from 'vitest';
import { ABOVE_FOLD_DEX_COUNT } from './img-priority';
import { dexChromeInitial, dexItemMotion, dexItemUsesMotion, dexPresenceMode } from './dex-motion';

describe('dexItemMotion', () => {
  it('disables layout and entrance replay for above-the-fold cards', () => {
    const first = dexItemMotion(0);
    const lastAtf = dexItemMotion(ABOVE_FOLD_DEX_COUNT - 1);
    expect(first).toEqual({ layout: false, initial: false });
    expect(lastAtf).toEqual({ layout: false, initial: false });
    expect(dexItemUsesMotion(0)).toBe(false);
    expect(dexItemUsesMotion(ABOVE_FOLD_DEX_COUNT - 1)).toBe(false);
    expect(dexItemUsesMotion(ABOVE_FOLD_DEX_COUNT)).toBe(true);
  });

  it('keeps entrance motion for newly scrolled cards without layout animation', () => {
    expect(dexItemMotion(ABOVE_FOLD_DEX_COUNT)).toEqual({
      layout: false,
      initial: { opacity: 0, y: 16, filter: 'blur(6px)' },
    });
    expect(dexItemMotion(ABOVE_FOLD_DEX_COUNT, 'row')).toEqual({
      layout: false,
      initial: { opacity: 0, y: 8 },
    });
  });
});

describe('dex chrome hydration', () => {
  it('does not replay page-header motion after prerender hydration', () => {
    expect(dexChromeInitial()).toBe(false);
  });

  it('avoids popLayout so the first grid paint cannot shift', () => {
    expect(dexPresenceMode()).toBe('sync');
  });
});
