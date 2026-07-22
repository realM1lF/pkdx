/* Game version-group table (RBY … SV) — lightweight, no @pkmn/* value imports.
 * Extracted from teambuilder.ts so that routes which only need the
 * game → version-group mapping (e.g. PokemonDetail via versus-context)
 * do not pull the full @pkmn/dex data layer into their initial chunk. */
import type { GenerationNum } from '@pkmn/data';

export interface VersionGroupInfo {
  /** PokéAPI version-group slug, e.g. 'scarlet-violet' */
  id: string;
  /** display label, e.g. 'SCARLET · VIOLET' */
  label: string;
  /** short chip, e.g. 'SV' */
  short: string;
  gen: GenerationNum;
  /** individual game slugs belonging to this group (nuzlocke `run.game` values) */
  games: string[];
}

export const VERSION_GROUPS: VersionGroupInfo[] = [
  { id: 'red-blue', label: 'RED · BLUE', short: 'RB', gen: 1, games: ['red', 'blue'] },
  { id: 'yellow', label: 'YELLOW', short: 'Y', gen: 1, games: ['yellow'] },
  { id: 'gold-silver', label: 'GOLD · SILVER', short: 'GS', gen: 2, games: ['gold', 'silver'] },
  { id: 'crystal', label: 'CRYSTAL', short: 'C', gen: 2, games: ['crystal'] },
  { id: 'ruby-sapphire', label: 'RUBY · SAPPHIRE', short: 'RS', gen: 3, games: ['ruby', 'sapphire'] },
  { id: 'emerald', label: 'EMERALD', short: 'E', gen: 3, games: ['emerald'] },
  { id: 'firered-leafgreen', label: 'FIRE RED · LEAF GREEN', short: 'FRLG', gen: 3, games: ['firered', 'leafgreen'] },
  { id: 'diamond-pearl', label: 'DIAMOND · PEARL', short: 'DP', gen: 4, games: ['diamond', 'pearl'] },
  { id: 'platinum', label: 'PLATINUM', short: 'PT', gen: 4, games: ['platinum'] },
  { id: 'heartgold-soulsilver', label: 'HEART GOLD · SOUL SILVER', short: 'HGSS', gen: 4, games: ['heartgold', 'soulsilver'] },
  { id: 'black-white', label: 'BLACK · WHITE', short: 'BW', gen: 5, games: ['black', 'white'] },
  { id: 'black-2-white-2', label: 'BLACK 2 · WHITE 2', short: 'B2W2', gen: 5, games: ['black-2', 'white-2'] },
  { id: 'x-y', label: 'X · Y', short: 'XY', gen: 6, games: ['x', 'y'] },
  { id: 'omega-ruby-alpha-sapphire', label: 'OMEGA RUBY · ALPHA SAPPHIRE', short: 'ORAS', gen: 6, games: ['omega-ruby', 'alpha-sapphire'] },
  { id: 'sun-moon', label: 'SUN · MOON', short: 'SM', gen: 7, games: ['sun', 'moon'] },
  { id: 'ultra-sun-ultra-moon', label: 'ULTRA SUN · ULTRA MOON', short: 'USUM', gen: 7, games: ['ultra-sun', 'ultra-moon'] },
  { id: 'lets-go-pikachu-eevee', label: "LET'S GO PIKACHU · EEVEE", short: 'LGPE', gen: 7, games: ['lets-go-pikachu', 'lets-go-eevee'] },
  { id: 'sword-shield', label: 'SWORD · SHIELD', short: 'SWSH', gen: 8, games: ['sword', 'shield'] },
  { id: 'brilliant-diamond-shining-pearl', label: 'BRILLIANT DIAMOND · SHINING PEARL', short: 'BDSP', gen: 8, games: ['brilliant-diamond', 'shining-pearl'] },
  { id: 'legends-arceus', label: 'LEGENDS ARCEUS', short: 'LA', gen: 8, games: ['legends-arceus'] },
  { id: 'scarlet-violet', label: 'SCARLET · VIOLET', short: 'SV', gen: 9, games: ['scarlet', 'violet'] },
];

export const DEFAULT_VERSION_GROUP = 'scarlet-violet';

export function versionGroupById(id: string): VersionGroupInfo {
  return VERSION_GROUPS.find((v) => v.id === id) ?? VERSION_GROUPS[VERSION_GROUPS.length - 1];
}

/** nuzlocke `run.game` ('firered', 'heartgold', …) → version-group id ('firered-leafgreen', …) */
export const GAME_TO_VERSION_GROUP: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  for (const vg of VERSION_GROUPS) for (const g of vg.games) map[g] = vg.id;
  return map;
})();

export function versionGroupForGame(game: string | null | undefined): string | null {
  if (!game) return null;
  return GAME_TO_VERSION_GROUP[game] ?? null;
}
