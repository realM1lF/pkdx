/* TCG grid render limits — shared by TcgGrid + tests. */
export const TCG_INITIAL = 18;
export const TCG_STEP = 18;
export const TCG_MAX_RENDER = 240;

export function tcgVisibleLimit(total: number, visible: number, max = TCG_MAX_RENDER): number {
  if (total <= 120) return total;
  return Math.min(visible, total, max);
}

export function tcgCanLoadMore(total: number, visibleLimit: number, max = TCG_MAX_RENDER): boolean {
  return visibleLimit < total && visibleLimit < max;
}

/** Stable key for resetting visible batch when filters change. */
export function tcgFilterResetSig(f: { q: string; sort: string; density: string }, extra = ''): string {
  return `${extra}|${f.q}|${f.sort}|${f.density}`;
}
