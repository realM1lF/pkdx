export function editionFallback(requestedVg: string | null | undefined, present: Set<string>): boolean {
  if (!requestedVg) return false;
  return present.size > 0 && !present.has(requestedVg);
}

export function formNotInGame(existsInVg: boolean): boolean {
  return !existsInVg;
}

export function paddedWild(wildCount: number, shownCount: number): boolean {
  return wildCount > 0 && shownCount > wildCount;
}

/** True when the published effect text carries modern numbers (or a known
 * mechanic that changed without digits in the short line, e.g. Exp. Share). */
export function itemEffectIsMixedGen(item: {
  slug?: string;
  effectEn?: string;
  effectDe?: string;
}): boolean {
  if (item.slug === 'exp-share') return true;
  return /\d/.test(`${item.effectEn ?? ''} ${item.effectDe ?? ''}`);
}
