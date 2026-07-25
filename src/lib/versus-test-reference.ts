/**
 * Independent @smogon/calc bridge for parity tests.
 * MUST mirror the mapping in versus.ts (VersusSide → CalcPokemon / Field).
 * If these diverge, matrix tests fail — that is intentional.
 */
import { Field, Generations, Pokemon as CalcPokemon, toID } from '@smogon/calc';
import type { StatsTable } from '@smogon/calc';
import type { StatKey } from './types';
import {
  sanitizeVersusField,
  type VersusContext,
  type VersusField,
  type VersusWeather,
  type VersusTerrain,
} from './versus-context';
import type { VersusSide } from './versus';

const CALC_NAME_ALIAS: Record<string, string> = { 'vice-grip': 'vise-grip' };
const calcId = (slug: string) => toID(CALC_NAME_ALIAS[slug] ?? slug);

const STAT_TO_CALC: Record<StatKey, keyof StatsTable> = {
  hp: 'hp',
  attack: 'atk',
  defense: 'def',
  'special-attack': 'spa',
  'special-defense': 'spd',
  speed: 'spe',
};

const STATUS_TO_CALC: Record<
  Exclude<NonNullable<VersusSide['status']>, 'none'>,
  'brn' | 'par' | 'psn' | 'slp' | 'frz'
> = {
  burn: 'brn',
  par: 'par',
  psn: 'psn',
  slp: 'slp',
  frz: 'frz',
};

const WEATHER_TO_CALC: Record<Exclude<VersusWeather, 'none'>, 'Sun' | 'Rain' | 'Sand' | 'Snow' | 'Hail'> = {
  sun: 'Sun',
  rain: 'Rain',
  sand: 'Sand',
  snow: 'Snow',
  hail: 'Hail',
};

const TERRAIN_TO_CALC: Record<Exclude<VersusTerrain, 'none'>, 'Electric' | 'Grassy' | 'Misty' | 'Psychic'> = {
  electric: 'Electric',
  grassy: 'Grassy',
  misty: 'Misty',
  psychic: 'Psychic',
};

const clampLevel = (lv: number) => Math.min(100, Math.max(1, Math.round(lv) || 1));

function calcStatus(side: Pick<VersusSide, 'status'>) {
  if (!side.status || side.status === 'none') return undefined;
  return STATUS_TO_CALC[side.status];
}

export function independentPokemonFromSide(
  side: Pick<VersusSide, 'slug' | 'level' | 'nature' | 'evs' | 'ivs' | 'ability' | 'item' | 'status'>,
  ctx: VersusContext,
): CalcPokemon | null {
  try {
    const gen = Generations.get(ctx.gen as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9);
    const evs: Partial<StatsTable> = {};
    const ivs: Partial<StatsTable> = {};
    if (side.evs)
      for (const [k, v] of Object.entries(side.evs))
        evs[STAT_TO_CALC[k as StatKey]] = Math.min(252, Math.max(0, v ?? 0));
    if (side.ivs)
      for (const [k, v] of Object.entries(side.ivs))
        ivs[STAT_TO_CALC[k as StatKey]] = Math.min(31, Math.max(0, v ?? 31));
    // slug → display-name normalization mirrors buildMon in versus.ts
    const ability = side.ability ? (gen.abilities.get(toID(side.ability))?.name ?? side.ability) : undefined;
    const item = side.item ? (gen.items.get(toID(side.item))?.name ?? side.item) : undefined;
    return new CalcPokemon(gen, calcId(side.slug), {
      level: clampLevel(side.level),
      nature: side.nature,
      evs: side.evs ? evs : undefined,
      ivs: side.ivs ? ivs : undefined,
      ability,
      item,
      status: calcStatus(side),
    });
  } catch {
    return null;
  }
}

export function independentFieldFromVersus(field: VersusField | undefined, ctx: VersusContext): Field | undefined {
  const clean = sanitizeVersusField(field, ctx);
  const weather = clean.weather && clean.weather !== 'none' ? WEATHER_TO_CALC[clean.weather] : undefined;
  const terrain = clean.terrain && clean.terrain !== 'none' ? TERRAIN_TO_CALC[clean.terrain] : undefined;
  if (!weather && !terrain) return undefined;
  return new Field({ weather, terrain });
}
