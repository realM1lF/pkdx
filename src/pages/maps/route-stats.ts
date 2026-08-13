/* Pure stats for SEO route pages — wild-only species count and best-catch BST. */

export function wildSpeciesCount(rows: Array<{ id: number; isStatic: boolean }>): number {
  return new Set(rows.filter((r) => !r.isStatic).map((r) => r.id)).size;
}

export function bestCatchByBst(
  rows: Array<{ id: number; isStatic: boolean }>,
  dex: Record<string, { bst: number }>,
): { id: number; bst: number } | null {
  let best: { id: number; bst: number } | null = null;
  for (const r of rows) {
    if (r.isStatic) continue;
    const bst = dex[String(r.id)]?.bst;
    if (bst && (!best || bst > best.bst)) best = { id: r.id, bst };
  }
  return best;
}
