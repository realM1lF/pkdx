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

export { trainerSourceMismatchesGame as trainerArtifactMismatch } from './trainer-data';
