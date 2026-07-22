/* Versus calc context — ties damage math to game version / region. */
import type { RegionId } from './regions';
import type { RunState } from './nuzlocke-store';
import { VERSION_GROUPS, versionGroupById, versionGroupForGame } from './version-groups';

export interface VersusContext {
  /** @smogon/calc generation 1–9 */
  gen: number;
  versionGroup: string;
  game: string | null;
  region: RegionId | null;
}

export function defaultVersusContext(): VersusContext {
  return { gen: 9, versionGroup: 'scarlet-violet', game: null, region: null };
}

export function versusContextFromGame(game: string | null | undefined, region?: RegionId | null): VersusContext {
  const vg = versionGroupForGame(game) ?? 'scarlet-violet';
  /* gen comes from the version-group table — covers gen 1–9 games without
   * a second hand-maintained map (previously gen 6–9 fell through to 9) */
  const gen = game ? versionGroupById(vg).gen : 9;
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

/**
 * Weather options the given generation actually knows (UI gating).
 * Gen 1: no weather at all. Sun/rain/sand from gen 2, hail gen 3–8,
 * snow replaces hail in gen 9.
 */
export function versusWeatherForGen(gen: number): VersusWeather[] {
  if (gen < 2) return [];
  const out: VersusWeather[] = ['none', 'sun', 'rain', 'sand'];
  if (gen >= 9) out.push('snow');
  else if (gen >= 3) out.push('hail');
  return out;
}

/* ---------- game selector (gen 1–9) ---------- */

export interface VersusGameOption {
  game: string;
  label: string;
  short: string;
  gen: number;
  versionGroup: string;
}

/** Individual game slugs for the versus game picker (default: gens 1–9). */
export function versusGameOptions(maxGen = 9): VersusGameOption[] {
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
  x: 'Pokémon X',
  y: 'Pokémon Y',
  'omega-ruby': 'Pokémon Omega Ruby',
  'alpha-sapphire': 'Pokémon Alpha Sapphire',
  sun: 'Pokémon Sun',
  moon: 'Pokémon Moon',
  'ultra-sun': 'Pokémon Ultra Sun',
  'ultra-moon': 'Pokémon Ultra Moon',
  'lets-go-pikachu': "Pokémon Let's Go Pikachu",
  'lets-go-eevee': "Pokémon Let's Go Eevee",
  sword: 'Pokémon Sword',
  shield: 'Pokémon Shield',
  'brilliant-diamond': 'Pokémon Brilliant Diamond',
  'shining-pearl': 'Pokémon Shining Pearl',
  'legends-arceus': 'Pokémon Legends Arceus',
  scarlet: 'Pokémon Scarlet',
  violet: 'Pokémon Violet',
};

export const VERSUS_GAME_OPTIONS = versusGameOptions(9);
