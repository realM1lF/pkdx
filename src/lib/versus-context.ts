/* Versus calc context — ties damage math to game version / region. */
import type { RegionId } from './regions';
import type { RunState } from './nuzlocke-store';
import { gameSlugOf, resolveVersionGroup } from './edition-nav';
import { VERSION_GROUPS, versionGroupById } from './version-groups';

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

/** Default game slug for the standalone /versus lab when no `?game=` param is set. */
export const DEFAULT_VERSUS_PAGE_GAME = 'firered';

export function defaultVersusPageContext(): VersusContext {
  return versusContextFromGame(DEFAULT_VERSUS_PAGE_GAME, null);
}

export function versusContextFromGame(game: string | null | undefined, region?: RegionId | null): VersusContext {
  const vg = resolveVersionGroup(game) ?? 'scarlet-violet';
  /* gen comes from the version-group table — covers gen 1–9 games without
   * a second hand-maintained map (previously gen 6–9 fell through to 9) */
  const gen = game ? versionGroupById(vg).gen : 9;
  return { gen, versionGroup: vg, game: gameSlugOf(game) ?? game ?? null, region: region ?? null };
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

const WEATHER_NONE: VersusWeather[] = [];
const WEATHER_GEN2: VersusWeather[] = ['none', 'sun', 'rain', 'sand'];
const WEATHER_GEN3_TO_8: VersusWeather[] = ['none', 'sun', 'rain', 'sand', 'hail'];
const WEATHER_GEN9: VersusWeather[] = ['none', 'sun', 'rain', 'sand', 'snow'];
const TERRAIN_NONE: VersusTerrain[] = [];
const TERRAIN_ALL: VersusTerrain[] = ['none', 'electric', 'grassy', 'misty', 'psychic'];

export interface VersusFieldMechanics {
  weather: VersusWeather[];
  terrain: VersusTerrain[];
}

/**
 * Battle-field toggles allowed per version group (not just gen number).
 *
 * Defaults follow main-series mechanics by generation; overrides cover remakes
 * and spin-offs where gen in @smogon/calc ≠ in-game field rules:
 *
 * - FRLG: no battle abilities → no ability-driven weather; wild fights start
 *   clear — field toggles would mislead Nuzlocke users (weather moves exist but
 *   are not a persistent “arena field” like modern gens).
 * - LGPE / LA: simplified or alternate battle systems — no weather/terrain UI.
 * - BDSP: Gen-4 weather (incl. hail), but terrain is Gen 6+ only.
 */
const VERSION_GROUP_FIELD_OVERRIDES: Partial<Record<string, VersusFieldMechanics>> = {
  'firered-leafgreen': { weather: WEATHER_NONE, terrain: TERRAIN_NONE },
  'lets-go-pikachu-eevee': { weather: WEATHER_NONE, terrain: TERRAIN_NONE },
  'legends-arceus': { weather: WEATHER_NONE, terrain: TERRAIN_NONE },
  'brilliant-diamond-shining-pearl': { weather: WEATHER_GEN3_TO_8, terrain: TERRAIN_NONE },
};

function defaultFieldMechanicsForGen(gen: number): VersusFieldMechanics {
  if (gen < 2) return { weather: WEATHER_NONE, terrain: TERRAIN_NONE };
  const weather = gen >= 9 ? WEATHER_GEN9 : gen >= 3 ? WEATHER_GEN3_TO_8 : WEATHER_GEN2;
  const terrain = gen >= 6 ? TERRAIN_ALL : TERRAIN_NONE;
  return { weather, terrain };
}

/** Resolve weather + terrain toggles for a version-group id. */
export function fieldMechanicsForVersionGroup(versionGroup: string): VersusFieldMechanics {
  const override = VERSION_GROUP_FIELD_OVERRIDES[versionGroup];
  if (override) return override;
  return defaultFieldMechanicsForGen(versionGroupById(versionGroup).gen);
}

export function versusWeatherForVersionGroup(versionGroup: string): VersusWeather[] {
  return fieldMechanicsForVersionGroup(versionGroup).weather;
}

export function versusTerrainForVersionGroup(versionGroup: string): VersusTerrain[] {
  return fieldMechanicsForVersionGroup(versionGroup).terrain;
}

export function versusWeatherForContext(ctx: VersusContext): VersusWeather[] {
  return versusWeatherForVersionGroup(ctx.versionGroup);
}

export function versusTerrainForContext(ctx: VersusContext): VersusTerrain[] {
  return versusTerrainForVersionGroup(ctx.versionGroup);
}

/** @deprecated Prefer `versusWeatherForContext` / `versusWeatherForVersionGroup`. */
export function versusWeatherForGen(gen: number): VersusWeather[] {
  return defaultFieldMechanicsForGen(gen).weather;
}

/** @deprecated Prefer `versusTerrainForContext` / `versusTerrainForVersionGroup`. */
export function versusTerrainForGen(gen: number): VersusTerrain[] {
  return defaultFieldMechanicsForGen(gen).terrain;
}

function resolveFieldContext(ctxOrVersionGroup: VersusContext | string): VersusFieldMechanics {
  const vg = typeof ctxOrVersionGroup === 'string' ? ctxOrVersionGroup : ctxOrVersionGroup.versionGroup;
  return fieldMechanicsForVersionGroup(vg);
}

/**
 * Neutralize field effects the selected game/version group doesn't support.
 * Exported for tests and field-bar reset logic.
 */
export function sanitizeVersusField(
  field: VersusField | undefined,
  ctxOrVersionGroup: VersusContext | string,
): VersusField {
  const mech = resolveFieldContext(ctxOrVersionGroup);
  if (!field) return { weather: 'none', terrain: 'none' };

  let weather: VersusWeather = field.weather ?? 'none';
  if (!mech.weather.length) weather = 'none';
  else if (!mech.weather.includes(weather)) weather = 'none';

  let terrain: VersusTerrain = field.terrain ?? 'none';
  if (!mech.terrain.length) terrain = 'none';
  else if (!mech.terrain.includes(terrain)) terrain = 'none';

  return { weather, terrain };
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
