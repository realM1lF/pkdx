/** Pokédex back-navigation: anchor id + batch depth only (no scroll listeners). */

import { getLenis } from '@/lib/smooth';

export const PDEX_SCROLL_KEY = 'pdx2.pokedex.restore';

const TTL_MS = 30 * 60 * 1000;

export type PokedexScrollRestore = {
  anchorId: number;
  visibleCount: number;
  /** `location.search` on the listing */
  search: string;
  ts: number;
};

export function commitPokedexScroll(state: Omit<PokedexScrollRestore, 'ts'>): void {
  try {
    sessionStorage.setItem(PDEX_SCROLL_KEY, JSON.stringify({ ...state, ts: Date.now() }));
  } catch {
    /* quota / private mode */
  }
}

export function readPokedexScroll(): PokedexScrollRestore | null {
  try {
    const raw = sessionStorage.getItem(PDEX_SCROLL_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PokedexScrollRestore;
    if (!Number.isFinite(parsed.anchorId) || !Number.isFinite(parsed.visibleCount)) return null;
    if (Date.now() - parsed.ts > TTL_MS) {
      sessionStorage.removeItem(PDEX_SCROLL_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function clearPokedexScroll(): void {
  try {
    sessionStorage.removeItem(PDEX_SCROLL_KEY);
  } catch {
    /* ignore */
  }
}

/** Match filters, keep entry until scroll succeeds. */
export function peekPokedexScroll(search: string): PokedexScrollRestore | null {
  const saved = readPokedexScroll();
  if (!saved || saved.search !== search) {
    if (saved) clearPokedexScroll();
    return null;
  }
  return saved;
}

export function pokedexBackPath(search: string): string {
  return search ? `/pokedex${search}` : '/pokedex';
}

/** Lenis-native scroll to the card — avoids window.scrollY drift. */
export function scrollToPokedexAnchor(anchorId: number): boolean {
  const el = document.querySelector(`[data-pdex-id="${anchorId}"]`);
  if (!(el instanceof HTMLElement)) return false;

  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(el, { offset: -112, immediate: true });
  } else {
    el.scrollIntoView({ block: 'center', behavior: 'instant' });
  }
  return true;
}

export function restoreVisibleCount(
  saved: PokedexScrollRestore,
  sortedLength: number,
  indexById: Map<number, number>,
  batch: number,
): number {
  let need = Math.min(saved.visibleCount, sortedLength);
  const idx = indexById.get(saved.anchorId);
  if (idx != null && idx >= 0) {
    const batchNeed = Math.ceil((idx + 1) / batch) * batch;
    need = Math.max(need, Math.min(sortedLength, batchNeed));
  }
  return need;
}
