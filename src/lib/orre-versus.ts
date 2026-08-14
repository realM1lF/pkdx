/* Orre Versus helpers — location-scoped foes + Hyper Mode gate. */
import { shadowsFor } from './orre';
import type { OrreGame, OrreShadow } from './orre-types';

export function shadowsVersusAtLocation(game: OrreGame, routeKey: string): OrreShadow[] {
  return shadowsFor(game).filter(
    (s) => s.locationId === routeKey || s.reappear?.locationId === routeKey,
  );
}

export function foeShadowsForVersus(
  game: OrreGame,
  routeKey?: string | null,
): { here: OrreShadow[]; elsewhere: OrreShadow[] } {
  const all = shadowsFor(game);
  if (!routeKey) return { here: [], elsewhere: all };
  const here = shadowsVersusAtLocation(game, routeKey);
  const hereIds = new Set(here.map((s) => s.id));
  return { here, elsewhere: all.filter((s) => !hereIds.has(s.id)) };
}

export function hyperModeAvailable(versionGroup: string, moves: string[]): boolean {
  return versionGroup === 'colosseum' && moves.includes('shadow-rush');
}
