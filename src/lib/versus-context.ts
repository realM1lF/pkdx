/* Versus calc context — ties damage math to game version / region. */
import type { RegionId } from './regions';
import type { RunState } from './nuzlocke-store';
import { VERSION_GROUPS, versionGroupForGame } from './teambuilder';

export interface VersusContext {
  /** @smogon/calc generation 1–9 */
  gen: number;
  versionGroup: string;
  game: string | null;
  region: RegionId | null;
}

const GAME_GEN: Record<string, number> = {
  red: 1,
  blue: 1,
  yellow: 1,
  gold: 2,
  silver: 2,
  crystal: 2,
  ruby: 3,
  sapphire: 3,
  emerald: 3,
  firered: 3,
  leafgreen: 3,
  diamond: 4,
  pearl: 4,
  platinum: 4,
  heartgold: 4,
  soulsilver: 4,
  black: 5,
  white: 5,
  'black-2': 5,
  'white-2': 5,
};

export function defaultVersusContext(): VersusContext {
  return { gen: 9, versionGroup: 'scarlet-violet', game: null, region: null };
}

export function versusContextFromGame(game: string | null | undefined, region?: RegionId | null): VersusContext {
  const vg = versionGroupForGame(game) ?? 'scarlet-violet';
  const gen = game ? (GAME_GEN[game] ?? 9) : 9;
  return { gen, versionGroup: vg, game: game ?? null, region: region ?? null };
}

export function versusContextFromRun(state: RunState): VersusContext {
  return versusContextFromGame(state.run.game, state.run.region as RegionId);
}

/* ---------- battle field (weather / terrain) ---------- */

export type VersusWeather = 'none' | 'sun' | 'rain' | 'sand' | 'snow' | 'hail';
export type VersusTerrain = 'none' | 'electric' | 'grassy' | 'misty' | 'psychic';

export type VersusField = {
  weather?: VersusWeather;
  terrain?: VersusTerrain;
};

export const VERSUS_WEATHER_OPTIONS: VersusWeather[] = ['none', 'sun', 'rain', 'sand', 'snow', 'hail'];
export const VERSUS_TERRAIN_OPTIONS: VersusTerrain[] = ['none', 'electric', 'grassy', 'misty', 'psychic'];

/* ---------- game selector (gen 1–5 minimum) ---------- */

export interface VersusGameOption {
  game: string;
  label: string;
  short: string;
  gen: number;
  versionGroup: string;
}

/** Individual game slugs for the versus game picker (default: gens 1–5). */
export function versusGameOptions(maxGen = 5): VersusGameOption[] {
  const out: VersusGameOption[] = [];
  for (const vg of VERSION_GROUPS) {
    if (vg.gen > maxGen) continue;
    for (const game of vg.games) {
      out.push({
        game,
        label: gameDisplayName(game),
        short: gameDisplayName(game),
        gen: vg.gen,
        versionGroup: vg.id,
      });
    }
  }
  return out;
}

/** Human-readable game slug — UI should prefer i18n `versus.games.{slug}`. */
export function gameDisplayName(game: string): string {
  return GAME_DISPLAY[game] ?? game.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

const GAME_DISPLAY: Record<string, string> = {
  red: 'Pokémon Red',
  blue: 'Pokémon Blue',
  yellow: 'Pokémon Yellow',
  gold: 'Pokémon Gold',
  silver: 'Pokémon Silver',
  crystal: 'Pokémon Crystal',
  ruby: 'Pokémon Ruby',
  sapphire: 'Pokémon Sapphire',
  emerald: 'Pokémon Emerald',
  firered: 'Pokémon FireRed',
  leafgreen: 'Pokémon LeafGreen',
  diamond: 'Pokémon Diamond',
  pearl: 'Pokémon Pearl',
  platinum: 'Pokémon Platinum',
  heartgold: 'Pokémon HeartGold',
  soulsilver: 'Pokémon SoulSilver',
  black: 'Pokémon Black',
  white: 'Pokémon White',
  'black-2': 'Pokémon Black 2',
  'white-2': 'Pokémon White 2',
};

export const VERSUS_GAME_OPTIONS = versusGameOptions(5);
