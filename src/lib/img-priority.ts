import { sprites } from './sprites';

/** Compact dex: ~2 rows × 4 cols on a phone-width first paint. */
export const ABOVE_FOLD_DEX_COUNT = 8;

const LOCAL_HERO_ART = new Set([3, 6, 9]);

export function isAboveFoldDexItem(index: number, count = ABOVE_FOLD_DEX_COUNT): boolean {
  return index >= 0 && index < count;
}

export function spriteImgAttrs(opts: { eager?: boolean; priority?: boolean; width?: number; height?: number }): {
  loading: 'eager' | 'lazy';
  fetchPriority?: 'high';
  width?: number;
  height?: number;
} {
  const loading = opts.eager || opts.priority ? 'eager' : 'lazy';
  return {
    loading,
    ...(opts.priority ? { fetchPriority: 'high' as const } : {}),
    ...(opts.width != null ? { width: opts.width } : {}),
    ...(opts.height != null ? { height: opts.height } : {}),
  };
}

export function spritePaintVisible(opts: { priority?: boolean }): boolean {
  return Boolean(opts.priority);
}

export function heroArtworkSrc(id: number): string {
  if (LOCAL_HERO_ART.has(id)) return `/hero/artwork-${id}.webp`;
  return sprites.artwork(id);
}
