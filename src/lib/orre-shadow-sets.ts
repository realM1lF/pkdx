/* Curated Orre Shadow battle sets.
 * Colo: Shadow Rush only, plus sourced Suicune Surf/Hydro Pump.
 * XD: walkthrough battle sets (Bulbapedia). Do not invent missing Colo regulars. */
import artifact from '@/data/orre/shadow-sets.json';
import type { OrreGame } from './orre-types';

export interface ShadowSetVariant {
  locationIds: string[];
  moves: string[];
}

export interface ShadowSet {
  species: string;
  shadowMove: string;
  moves: string[];
  item?: string;
  variants?: ShadowSetVariant[];
}

interface ShadowSetsArtifact {
  source: string;
  verifiedAt: string;
  sets: Record<string, ShadowSet>;
}

const DATA = artifact as ShadowSetsArtifact;

export function shadowSetById(_game: OrreGame, id: string): ShadowSet | undefined {
  return DATA.sets[id];
}

export function shadowSetForSpecies(game: OrreGame, species: string): ShadowSet | undefined {
  const slug = species.toLowerCase();
  const prefix = game === 'colosseum' ? 'colo-shadow-' : 'xd-shadow-';
  return Object.entries(DATA.sets).find(([id, s]) => id.startsWith(prefix) && s.species === slug)?.[1];
}

export function shadowMovesOf(game: OrreGame, id: string, locationId?: string | null): string[] {
  const set = shadowSetById(game, id);
  if (!set) return [];
  const variant = locationId
    ? set.variants?.find((v) => v.locationIds.includes(locationId))
    : undefined;
  const rest = variant?.moves ?? set.moves;
  return [...new Set([set.shadowMove, ...rest].filter(Boolean))].slice(0, 4);
}
