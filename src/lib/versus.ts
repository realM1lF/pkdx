/* MyPokePanion — VERSUS matchup math (versus.md §Datengrundlage).
 * Gen-aware mechanics (gen 1–9) via @smogon/calc (damage ranges, KO chips,
 * speed checks) + the @pkmn/data per-gen type chart for effectiveness.
 * Pure/sync — PokéAPI payloads (Pokemon, Move) are passed in by the caller,
 * which also orchestrates async fetching (getPokemon/getMove, SWR-cached).
 * No engine/sim: calculation only. */

import { calculate, Field, Generations, Move as CalcMove, Pokemon as CalcPokemon, toID } from '@smogon/calc';
import type { StatsTable } from '@smogon/calc';
import type { Move, Pokemon, StatKey } from './types';
import { STAT_ORDER } from './types';
import i18n from '@/i18n';
import { nameOfMove } from './i18n-data';
import {
  DAMAGING_MOVE_CATS,
  genEffectivenessOf,
  genTypeSlugs,
  newestVersionGroup,
  pickTopMoves,
  preferredCategory,
} from './teambuilder';
import { effMultLabel, splitMatchups } from './effectiveness';
import type { SplitMatchups } from './effectiveness';
import type { GenerationNum } from '@pkmn/data';
import {
  defaultVersusContext,
  type VersusContext,
  type VersusField,
  type VersusTerrain,
  type VersusWeather,
  sanitizeVersusField,
} from './versus-context';

export type { VersusContext, VersusField, VersusWeather, VersusTerrain } from './versus-context';
export {
  defaultVersusContext,
  versusContextFromGame,
  versusContextFromRun,
  VERSUS_GAME_OPTIONS,
  versusGameOptions,
  gameDisplayName,
  sanitizeVersusField,
  versusTerrainForContext,
  versusTerrainForGen,
  versusTerrainForVersionGroup,
  versusWeatherForContext,
  versusWeatherForGen,
  versusWeatherForVersionGroup,
  fieldMechanicsForVersionGroup,
} from './versus-context';

/* move-pool helpers live in teambuilder.ts (pure, no @smogon/calc) so the
 * team builder + detail page share the same resolution — re-exported here
 * to keep the existing versus.ts API stable */
export {
  levelUpPool,
  wildMoveset,
  scoreMoves,
  pickTopMoves,
  pokemonBaseTypes,
  preferredCategory,
  newestVersionGroup,
} from './teambuilder';
export type { PoolEntry, ScoredMove } from './teambuilder';

const genCache = new Map<number, ReturnType<typeof Generations.get>>();

function getGen(ctx: VersusContext = defaultVersusContext()): ReturnType<typeof Generations.get> {
  const cached = genCache.get(ctx.gen);
  if (cached) return cached;
  const gen = Generations.get(ctx.gen as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9);
  genCache.set(ctx.gen, gen);
  return gen;
}

/* PokéAPI slug → calc name when the two datasets disagree (Vise Grip spelling). */
const CALC_NAME_ALIAS: Record<string, string> = {
  'vice-grip': 'vise-grip',
};

const calcId = (slug: string) => toID(CALC_NAME_ALIAS[slug] ?? slug);

/* ---------- side model ---------- */

export interface VersusSide {
  /** PokéAPI species slug (or numeric id as string) */
  slug: string;
  level: number; // 1–100
  /** calc nature display name, e.g. 'Adamant' — omit for neutral */
  nature?: string;
  evs?: Partial<Record<StatKey, number>>;
  ivs?: Partial<Record<StatKey, number>>;
  /** up to 4 PokéAPI move slugs */
  moves: string[];
  ability?: string | null;
  item?: string | null;
  /** UI status names — mapped to calc (brn, par, psn, slp, frz) in buildMon */
  status?: 'none' | 'burn' | 'par' | 'psn' | 'slp' | 'frz' | null;
}

export type MovesetSource = 'trainer' | 'wild' | 'assumed' | 'custom';

export const MOVESET_LABEL: Record<MovesetSource, string> = {
  trainer: 'TRAINER SET',
  wild: 'WILD SET',
  assumed: 'ASSUMED SET',
  custom: 'CUSTOM SET',
};

const clampLevel = (lv: number) => Math.min(100, Math.max(1, Math.round(lv) || 1));

const STAT_TO_CALC: Record<StatKey, keyof StatsTable> = {
  hp: 'hp',
  attack: 'atk',
  defense: 'def',
  'special-attack': 'spa',
  'special-defense': 'spd',
  speed: 'spe',
};

const STATUS_TO_CALC: Record<Exclude<NonNullable<VersusSide['status']>, 'none'>, 'brn' | 'par' | 'psn' | 'slp' | 'frz'> = {
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

function calcStatus(side: Pick<VersusSide, 'status'>): 'brn' | 'par' | 'psn' | 'slp' | 'frz' | '' | undefined {
  if (!side.status || side.status === 'none') return undefined;
  return STATUS_TO_CALC[side.status];
}

/**
 * Neutralize field effects the selected game/version group doesn't support.
 */
function sanitizeField(field: VersusField | undefined, ctx: VersusContext): VersusField | undefined {
  if (!field) return undefined;
  return sanitizeVersusField(field, ctx);
}

function buildCalcField(field?: VersusField, ctx: VersusContext = defaultVersusContext()): Field | undefined {
  const clean = sanitizeField(field, ctx);
  if (!clean) return undefined;
  const weather = clean.weather && clean.weather !== 'none' ? WEATHER_TO_CALC[clean.weather] : undefined;
  const terrain = clean.terrain && clean.terrain !== 'none' ? TERRAIN_TO_CALC[clean.terrain] : undefined;
  if (!weather && !terrain) return undefined;
  return new Field({ weather, terrain });
}

function buildMon(
  side: Pick<VersusSide, 'slug' | 'level' | 'nature' | 'evs' | 'ivs' | 'ability' | 'item' | 'status'>,
  ctx: VersusContext = defaultVersusContext(),
): CalcPokemon | null {
  try {
    const gen = getGen(ctx);
    const evs: Partial<StatsTable> = {};
    const ivs: Partial<StatsTable> = {};
    if (side.evs) for (const [k, v] of Object.entries(side.evs)) evs[STAT_TO_CALC[k as StatKey]] = Math.min(252, Math.max(0, v ?? 0));
    if (side.ivs) for (const [k, v] of Object.entries(side.ivs)) ivs[STAT_TO_CALC[k as StatKey]] = Math.min(31, Math.max(0, v ?? 31));
    const status = calcStatus(side);
    /* callers pass either display names ('Life Orb') or PokéAPI slugs
     * ('life-orb') — the calc only resolves display names and silently drops
     * unknown ones, so normalize slugs via the gen dex first */
    const ability = side.ability ? (gen.abilities.get(toID(side.ability))?.name ?? side.ability) : undefined;
    const item = side.item ? (gen.items.get(toID(side.item))?.name ?? side.item) : undefined;
    return new CalcPokemon(gen, side.slug, {
      level: clampLevel(side.level),
      nature: side.nature,
      evs: side.evs ? evs : undefined,
      ivs: side.ivs ? ivs : undefined,
      ability,
      item,
      status,
    });
  } catch {
    return null;
  }
}

/** Production CalcPokemon builder — parity tests call this + `calculate()` directly. */
export function pokemonFromVersusSide(
  side: Pick<VersusSide, 'slug' | 'level' | 'nature' | 'evs' | 'ivs' | 'ability' | 'item' | 'status'>,
  ctx: VersusContext = defaultVersusContext(),
): CalcPokemon | null {
  return buildMon(side, ctx);
}

/** Production Field builder — parity tests mirror `damageBetween` field handling. */
export function fieldFromVersusField(field?: VersusField, ctx: VersusContext = defaultVersusContext()): Field | undefined {
  return buildCalcField(field, ctx);
}

/** Fully computed stats (level + nature + EV/IV applied). Keys = PokéAPI StatKey. */
export function statsOf(
  side: Pick<VersusSide, 'slug' | 'level' | 'nature' | 'evs' | 'ivs' | 'ability' | 'item' | 'status'>,
  ctx: VersusContext = defaultVersusContext(),
): Record<StatKey, number> | null {
  const mon = buildMon(side, ctx);
  if (!mon) return null;
  const out = {} as Record<StatKey, number>;
  for (const key of STAT_ORDER) out[key] = mon.stats[STAT_TO_CALC[key]];
  if (out.speed != null) out.speed = effectiveSpeed(out.speed, side, ctx.gen);
  return out;
}

/** Gen-accurate paralysis speed reduction (matches @smogon/calc getFinalSpeed). */
function effectiveSpeed(rawSpe: number, side: Pick<VersusSide, 'status'>, gen: number): number {
  if (side.status === 'par') return Math.floor(rawSpe * (gen < 7 ? 0.25 : 0.5));
  return rawSpe;
}

export function speedOf(
  side: Pick<VersusSide, 'slug' | 'level' | 'nature' | 'evs' | 'ivs' | 'ability' | 'item' | 'status'>,
  ctx: VersusContext = defaultVersusContext(),
): number | null {
  return statsOf(side, ctx)?.speed ?? null;
}

export interface SpeedCheck {
  you: number;
  foe: number;
  delta: number; // positive = you outspeed
}

export function speedCheck(
  you: Pick<VersusSide, 'slug' | 'level' | 'nature' | 'evs' | 'ivs' | 'ability' | 'item' | 'status'>,
  foe: Pick<VersusSide, 'slug' | 'level' | 'nature' | 'evs' | 'ivs' | 'ability' | 'item' | 'status'>,
  ctx: VersusContext = defaultVersusContext(),
): SpeedCheck | null {
  const a = speedOf(you, ctx);
  const b = speedOf(foe, ctx);
  if (a == null || b == null) return null;
  return { you: a, foe: b, delta: a - b };
}

/* ---------- natures (TUNE expander) ---------- */

export interface NatureInfo {
  name: string;
  plus: StatKey | null;
  minus: StatKey | null;
}

export const NATURES: NatureInfo[] = [
  { name: 'Hardy', plus: null, minus: null },
  { name: 'Lonely', plus: 'attack', minus: 'defense' },
  { name: 'Brave', plus: 'attack', minus: 'speed' },
  { name: 'Adamant', plus: 'attack', minus: 'special-attack' },
  { name: 'Naughty', plus: 'attack', minus: 'special-defense' },
  { name: 'Bold', plus: 'defense', minus: 'attack' },
  { name: 'Docile', plus: null, minus: null },
  { name: 'Relaxed', plus: 'defense', minus: 'speed' },
  { name: 'Impish', plus: 'defense', minus: 'special-attack' },
  { name: 'Lax', plus: 'defense', minus: 'special-defense' },
  { name: 'Timid', plus: 'speed', minus: 'attack' },
  { name: 'Hasty', plus: 'speed', minus: 'defense' },
  { name: 'Serious', plus: null, minus: null },
  { name: 'Jolly', plus: 'speed', minus: 'special-attack' },
  { name: 'Naive', plus: 'speed', minus: 'special-defense' },
  { name: 'Modest', plus: 'special-attack', minus: 'attack' },
  { name: 'Mild', plus: 'special-attack', minus: 'defense' },
  { name: 'Quiet', plus: 'special-attack', minus: 'speed' },
  { name: 'Bashful', plus: null, minus: null },
  { name: 'Rash', plus: 'special-attack', minus: 'special-defense' },
  { name: 'Calm', plus: 'special-defense', minus: 'attack' },
  { name: 'Gentle', plus: 'special-defense', minus: 'defense' },
  { name: 'Sassy', plus: 'special-defense', minus: 'speed' },
  { name: 'Careful', plus: 'special-defense', minus: 'special-attack' },
  { name: 'Quirky', plus: null, minus: null },
];

/* ---------- type effectiveness (per-gen chart via @pkmn/data) ---------- */

/**
 * Gen-correct effectiveness of an attacking type against defending types.
 * Defaults to the gen 9 chart when no gen is given.
 */
export function effectivenessOf(attackType: string, defendingTypes: string[], gen = 9): number {
  return genEffectivenessOf(gen as GenerationNum, attackType, defendingTypes);
}

/** gen-aware defensive profile: weak/resist/immune attacking types for `defendingTypes` */
export interface GenMatchups {
  weak: string[];
  resist: string[];
  immune: string[];
}

export function genMatchupsOf(defendingTypes: string[], gen = 9): GenMatchups {
  const g = gen as GenerationNum;
  const weak: string[] = [];
  const resist: string[] = [];
  const immune: string[] = [];
  for (const atk of genTypeSlugs(g)) {
    const mult = genEffectivenessOf(g, atk, defendingTypes);
    if (mult === 0) immune.push(atk);
    else if (mult >= 2) weak.push(atk);
    else if (mult < 1) resist.push(atk);
  }
  return { weak, resist, immune };
}

/** Ability slugs (lowercase) → attacking types they grant immunity to in calc. */
const ABILITY_TYPE_IMMUNITIES: Record<string, string[]> = {
  levitate: ['ground'],
  'volt absorb': ['electric'],
  'water absorb': ['water'],
  'flash fire': ['fire'],
  'sap sipper': ['grass'],
  'motor drive': ['electric'],
  'earth eater': ['ground'],
  bulbproof: ['grass'],
};

/**
 * Defensive profile adjusted for a known held ability (Levitate → Ground immune, etc.).
 * Typ chart stays gen-correct; ability only moves types between weak and immune.
 */
export function genMatchupsForSide(defendingTypes: string[], gen = 9, ability?: string | null): GenMatchups {
  const base = genMatchupsOf(defendingTypes, gen);
  if (!ability) return base;
  const granted = ABILITY_TYPE_IMMUNITIES[ability.toLowerCase()];
  if (!granted?.length) return base;
  const immune = new Set(base.immune);
  const weak = base.weak.filter((t) => {
    if (granted.includes(t)) {
      immune.add(t);
      return false;
    }
    return true;
  });
  return { weak, resist: base.resist, immune: [...immune].sort() };
}

/** display label for an effectiveness multiplier — shared helper, exact
 * glyphs incl. ×4/×¼ and ability-modified intermediates (×3, ×1½, …) */
export const EFF_LABEL = effMultLabel;

/**
 * Defensive profile with dual-type extremes kept separate (×4 / ×¼ rows),
 * adjusted for a known held ability (Levitate → Ground immune, etc.).
 * Type chart stays gen-correct; ability only moves types between buckets.
 */
export function genSplitMatchupsForSide(defendingTypes: string[], gen = 9, ability?: string | null): SplitMatchups {
  const base = splitMatchups(defendingTypes, gen as GenerationNum);
  if (!ability) return base;
  const granted = ABILITY_TYPE_IMMUNITIES[ability.toLowerCase()];
  if (!granted?.length) return base;
  const immune = new Set(base.immune);
  const strip = (list: string[]) =>
    list.filter((t) => {
      if (granted.includes(t)) {
        immune.add(t);
        return false;
      }
      return true;
    });
  return {
    quad: strip(base.quad),
    weak: strip(base.weak),
    resist: base.resist,
    quarter: base.quarter,
    immune: [...immune].sort(),
  };
}

/* ---------- damage ---------- */

export interface DamageCell {
  move: string; // slug
  /** min/max roll in HP (multi-hit: total across all hits) */
  range: [number, number];
  /** min/max as % of defender max HP (0–100+) */
  pct: [number, number];
  /** hits to KO (0 for status/non-damaging; ramping moves: cumulative hits) */
  koHits: number;
  /** guaranteed-KO chance 0–1 (1 = guaranteed) */
  koChance: number;
  eff: number;
  /** gen-correct damage category (type-based split in gen 1–3, from the calc move) */
  category?: string;
  /** OHKO move (Fissure & co): no range — KOs when it hits, at this accuracy */
  ohko?: { accuracy: number };
  /** multi-hit move (Bullet Seed & co): hits per use + per-hit damage + total */
  multihit?: {
    hits: [number, number];
    hitRange: [number, number];
    total: [number, number];
  };
  /** progressive move (Rollout, Fury Cutter…): damage grows each consecutive
   * hit; `koHits` = consecutive hits until the cumulative damage KOs */
  ramp?: {
    perHit: Array<[number, number]>;
    koHits: number | null;
  };
  /** defender survives the first hit from full HP (Focus Sash / Sturdy gen 5+) */
  survivesFirstHit?: boolean;
}

function normalizeEff(eff: number): number {
  if (eff <= 0) return 0;
  for (const step of [0.25, 0.5, 1, 2, 4]) {
    if (Math.abs(eff - step) < 0.08) return step;
  }
  return Math.round(eff * 100) / 100;
}

/**
 * Combined type × ability effectiveness shown in the EFF column.
 * Compares calc damage with vs without the defender's ability (Thick Fat → ×2 becomes ×1).
 */
function calcEffectiveMultiplier(
  gen: ReturnType<typeof getGen>,
  atk: CalcPokemon,
  def: CalcPokemon,
  mv: CalcMove,
  calcField: Field | undefined,
  typeEff: number,
): number {
  if (typeEff === 0) return 0;
  const cat = (mv.category ?? 'status').toLowerCase();
  if (!DAMAGING_MOVE_CATS.has(cat) || !mv.bp) return typeEff;
  try {
    const [lo, hi] = calculate(gen, atk, def, mv, calcField).range();
    if (lo === 0 && hi === 0) return 0;
    const defBare = new CalcPokemon(gen, def.name, {
      level: def.level,
      nature: def.nature,
      ivs: def.ivs,
      evs: def.evs,
      item: def.item,
      status: def.status,
      ability: '',
    });
    const [blo, bhi] = calculate(gen, atk, defBare, mv, calcField).range();
    const avgBare = (blo + bhi) / 2;
    if (avgBare === 0) return typeEff;
    return normalizeEff(typeEff * ((lo + hi) / 2 / avgBare));
  } catch {
    return typeEff;
  }
}

/* Fixed-damage legacy moves common in FRLG trainer sets — Gen-9 calc data
 * carries them with bp 0 (removed from SV), so resolve them explicitly. */
const FIXED_DAMAGE: Record<string, number | 'level' | 'half' | 'psywave'> = {
  'sonic-boom': 20,
  'dragon-rage': 40,
  'night-shade': 'level',
  'seismic-toss': 'level',
  'super-fang': 'half',
  psywave: 'psywave',
};

/* OHKO moves — no damage range; they KO when they hit (30% accuracy). */
const OHKO_MOVES = new Set(['fissure', 'guillotine', 'horn-drill', 'sheer-cold']);

/* Progressive moves: every consecutive hit is stronger. power(base, k) gives
 * the base power of hit #k; the base power itself is already gen-aware via
 * the calc move data (Fury Cutter: 10 in gen 2–4, 20 in gen 5, 40 in gen 6+). */
const RAMPING_MOVES: Record<string, { power: (bp: number, hit: number) => number; maxHits: number }> = {
  rollout: { power: (bp, k) => bp * 2 ** (k - 1), maxHits: 5 },
  'ice-ball': { power: (bp, k) => bp * 2 ** (k - 1), maxHits: 5 },
  'fury-cutter': { power: (bp, k) => Math.min(160, bp * 2 ** (k - 1)), maxHits: 9 },
  'echoed-voice': { power: (bp, k) => Math.min(200, bp + 40 * (k - 1)), maxHits: 9 },
};

/**
 * Defender survives any single hit from full HP: Focus Sash (gen 4+),
 * Sturdy (gen 5+; in gen 3–4 Sturdy only blocks OHKO moves).
 * The versus matrix always assumes full HP.
 */
function survivesFirstHit(defender: Pick<VersusSide, 'item' | 'ability'>, gen: number): boolean {
  if (gen >= 4 && toID(defender.item ?? '') === 'focussash') return true;
  if (gen >= 5 && toID(defender.ability ?? '') === 'sturdy') return true;
  return false;
}

/** Independent @smogon/calc range for parity assertions (handles fixed-damage moves). */
export function smogonReferenceRange(
  attacker: VersusSide,
  defender: VersusSide,
  moveSlug: string,
  ctx: VersusContext = defaultVersusContext(),
  field?: VersusField,
): [number, number] | null {
  const gen = getGen(ctx);
  const atk = buildMon(attacker, ctx);
  const def = buildMon(defender, ctx);
  if (!atk || !def) return null;
  let mv: CalcMove;
  try {
    mv = new CalcMove(gen, calcId(moveSlug));
  } catch {
    return null;
  }
  const calcField = buildCalcField(field, ctx);
  const fixed = FIXED_DAMAGE[moveSlug];
  if (fixed) {
    const maxHp = def.stats.hp || 1;
    const moveType = (mv.type ?? 'normal').toLowerCase();
    const typeEff = effectivenessOf(moveType, def.species.types.map((t) => t.toLowerCase()), ctx.gen);
    let lo: number;
    let hi: number;
    if (fixed === 'level') lo = hi = atk.level;
    else if (fixed === 'half') lo = hi = Math.max(1, Math.floor(maxHp / 2));
    else if (fixed === 'psywave') {
      lo = Math.max(1, Math.floor(atk.level * 0.5));
      hi = Math.max(1, Math.floor(atk.level * 1.5));
    } else lo = hi = fixed;
    if (typeEff === 0) lo = hi = 0;
    return [lo, hi];
  }
  const category = (mv.category ?? 'status').toLowerCase();
  if (!DAMAGING_MOVE_CATS.has(category) || !mv.bp) return [0, 0];
  try {
    return calculate(gen, atk, def, mv, calcField).range() as [number, number];
  } catch {
    return null;
  }
}

/**
 * Damage of `moveSlug` from attacker → defender.
 * Returns null only when the move/species can't be resolved in calc data.
 * Status moves resolve to a zero cell (koHits 0).
 */
export function damageBetween(
  attacker: VersusSide,
  defender: VersusSide,
  moveSlug: string,
  moveDetail?: Move,
  ctx: VersusContext = defaultVersusContext(),
  field?: VersusField,
): DamageCell | null {
  const gen = getGen(ctx);
  const atk = buildMon(attacker, ctx);
  const def = buildMon(defender, ctx);
  if (!atk || !def) return null;
  let mv: CalcMove;
  try {
    mv = new CalcMove(gen, calcId(moveSlug));
  } catch {
    return null;
  }
  /* raw dex entry for gen-correct multihit data */
  const moveData = gen.moves.get(calcId(moveSlug));
  const calcField = buildCalcField(field, ctx);
  /* gen-correct category: the calc move is type-split in gen 1–3, so prefer it
   * over the SV-era PokéAPI damage_class (F4). */
  const category = (mv.category ?? moveDetail?.damage_class.name ?? 'status').toLowerCase();
  const moveType = (moveDetail?.type.name ?? mv.type ?? 'normal').toLowerCase();
  const typeEff = effectivenessOf(moveType, def.species.types.map((t) => t.toLowerCase()), ctx.gen);
  const eff = calcEffectiveMultiplier(gen, atk, def, mv, calcField, typeEff);

  /* fixed-damage legacy moves (immune → 0) */
  const fixed = FIXED_DAMAGE[moveSlug];
  if (fixed) {
    const maxHp = def.stats.hp || 1;
    let lo: number;
    let hi: number;
    if (fixed === 'level') lo = hi = atk.level;
    else if (fixed === 'half') lo = hi = Math.max(1, Math.floor(maxHp / 2));
    else if (fixed === 'psywave') {
      lo = Math.max(1, Math.floor(atk.level * 0.5));
      hi = Math.max(1, Math.floor(atk.level * 1.5));
    } else lo = hi = fixed;
    if (eff === 0) lo = hi = 0;
    const koHits = hi > 0 ? Math.min(9, Math.max(1, Math.ceil(maxHp / ((lo + hi) / 2)))) : 0;
    return {
      move: moveSlug,
      range: [lo, hi],
      pct: [(lo / maxHp) * 100, (hi / maxHp) * 100],
      koHits,
      koChance: lo >= maxHp ? 1 : 0,
      eff,
      category,
    };
  }

  /* OHKO moves (Fissure & co): no damage range — an explicit cell instead.
   * Accuracy is 30% in every generation for all four OHKO moves (the calc
   * move data doesn't carry an accuracy field, so it's constant here). */
  if (OHKO_MOVES.has(moveSlug)) {
    return { move: moveSlug, range: [0, 0], pct: [0, 0], koHits: 0, koChance: 0, eff, category, ohko: { accuracy: 30 } };
  }

  if (!DAMAGING_MOVE_CATS.has(category) || !mv.bp) {
    return { move: moveSlug, range: [0, 0], pct: [0, 0], koHits: 0, koChance: 0, eff, category };
  }
  try {
    const res = calculate(gen, atk, def, mv, calcField);
    const [lo, hi] = res.range();
    const maxHp = def.stats.hp || 1;

    /* multi-hit (Bullet Seed & co): the calc sums damage over a default hit
     * count (min+1) — expose the per-hit range and the full hit-count span */
    let multihit: DamageCell['multihit'];
    const mhData = moveData?.multihit;
    if (mhData && hi > 0) {
      const rows =
        Array.isArray(res.damage) && Array.isArray((res.damage as unknown[])[0])
          ? (res.damage as number[][])
          : null;
      const hitLo = rows ? Math.min(...rows.map((r) => r[0])) : Math.round(lo / mv.hits);
      const hitHi = rows ? Math.max(...rows.map((r) => r[r.length - 1])) : Math.round(hi / mv.hits);
      let hits: [number, number] = typeof mhData === 'number' ? [mhData, mhData] : [mhData[0], mhData[1]];
      if (toID(atk.ability ?? '') === 'skilllink') hits = [hits[1], hits[1]];
      multihit = { hits, hitRange: [hitLo, hitHi], total: [hitLo * hits[0], hitHi * hits[1]] };
    }

    /* progressive moves (Rollout, Fury Cutter…): per-hit ranges + cumulative
     * hits to KO ("3 hits" when 30/60/120 cumulative damage suffices) */
    let ramp: DamageCell['ramp'];
    const rampRule = RAMPING_MOVES[moveSlug];
    if (rampRule && mv.bp && hi > 0) {
      const perHit: Array<[number, number]> = [[lo, hi]];
      let cumLo = lo;
      let cumHi = hi;
      let guaranteed: number | null = cumLo >= maxHp ? 1 : null;
      let possible: number | null = cumHi >= maxHp ? 1 : null;
      for (let k = 2; k <= rampRule.maxHits && guaranteed === null; k++) {
        let kRange: [number, number];
        try {
          const kmv = new CalcMove(gen, calcId(moveSlug), { overrides: { basePower: rampRule.power(mv.bp, k) } });
          kRange = calculate(gen, atk, def, kmv, calcField).range();
        } catch {
          break;
        }
        perHit.push(kRange);
        cumLo += kRange[0];
        cumHi += kRange[1];
        if (possible === null && cumHi >= maxHp) possible = k;
        if (cumLo >= maxHp) guaranteed = k;
      }
      ramp = { perHit, koHits: guaranteed ?? possible };
    }

    /* the matrix shows the full per-use total for multi-hit moves */
    const range: [number, number] = multihit ? multihit.total : [lo, hi];

    let koHits = 0;
    let koChance = 0;
    try {
      const ko = res.kochance(false);
      koHits = ko.n;
      koChance = ko.chance ?? 0;
    } catch {
      /* multi-hit 2D ranges etc. — fall back to average rolls */
    }
    /* kochance gives up (n=0) on very weak moves — derive hits from the average roll */
    if (koHits === 0 && hi > 0) koHits = Math.min(9, Math.max(1, Math.ceil(maxHp / ((lo + hi) / 2))));
    if (ramp?.koHits) koHits = ramp.koHits;

    /* Focus Sash / Sturdy: at full HP the defender always survives the first
     * hit of a single-hit move — never claim a guaranteed OHKO. Multi-hit
     * moves break the sash with their later hits and stay unaffected. */
    const sashLike = survivesFirstHit(defender, ctx.gen);
    if (sashLike && !multihit && !ramp && hi > 0 && koHits <= 1) {
      if (lo >= maxHp) {
        koHits = 2;
        koChance = 1; // sash leaves the defender at 1 HP → any second hit finishes
      } else {
        koChance = 0; // a one-hit KO is impossible
        if (hi >= maxHp) koHits = Math.min(9, Math.max(2, Math.ceil(maxHp / ((lo + hi) / 2))));
      }
    }

    return {
      move: moveSlug,
      range,
      pct: [(range[0] / maxHp) * 100, (range[1] / maxHp) * 100],
      koHits,
      koChance,
      eff,
      category,
      multihit,
      ramp,
      survivesFirstHit: sashLike || undefined,
    };
  } catch {
    return null;
  }
}

/** Plain-language KO chip from hit count (1 → "1× for KO", 2 → "Use 2× for KO", …). */
export function koLabelFromHits(hits: number, lang: 'en' | 'de' = 'en'): string {
  if (hits <= 0) return i18n.t('versus.ko.none', { lng: lang });
  if (hits === 1) return i18n.t('versus.ko.one', { lng: lang });
  if (hits <= 3) return i18n.t('versus.ko.n', { lng: lang, n: hits });
  if (hits >= 9) return i18n.t('versus.ko.plus9', { lng: lang });
  return i18n.t('versus.ko.plus4', { lng: lang });
}

/** KO chip for a damage cell — same wording as {@link koLabelFromHits}. */
export function koLabel(cell: DamageCell | null, lang: 'en' | 'de' = 'en'): string {
  if (!cell || cell.koHits <= 0) return koLabelFromHits(0, lang);
  return koLabelFromHits(cell.koHits, lang);
}

/* ---------- move pools (PokéAPI payload, sync) ---------- */

/** full legal pool in the given version group (any method), deduped, for autocomplete */
export function legalMoveSlugs(p: Pokemon, versionGroup?: string, ctx?: VersusContext): string[] {
  const vg = ctx?.versionGroup ?? versionGroup ?? newestVersionGroup(p);
  const set = new Set<string>();
  for (const m of p.moves) {
    if (m.version_group_details.some((d) => d.version_group.name === vg)) set.add(m.move.name);
  }
  return [...set].sort();
}

/* Stage 2 (WILD) + top-4 heuristic moved to teambuilder.ts (re-exported
 * above) — levelUpPool / wildMoveset / scoreMoves / pickTopMoves /
 * pokemonBaseTypes / preferredCategory. */

/**
 * Stage 3 — ASSUMED SET: best legal moves (STAB + coverage heuristic)
 * over the full legal pool. Requires fetched move details for candidates.
 */
export function assumedMoveset(p: Pokemon, details: Map<string, Move>, ctx?: VersusContext): string[] {
  const vg = ctx?.versionGroup ?? newestVersionGroup(p);
  const candidates = legalMoveSlugs(p, vg, ctx)
    .map((slug) => ({ slug, detail: details.get(slug) }))
    .filter((c): c is { slug: string; detail: Move } => Boolean(c.detail));
  return pickTopMoves(candidates, p.types.map((t) => t.type.name), { preferCategory: preferredCategory(p) });
}

/* ---------- best-answer ranking (versus.md UI 2) ---------- */

export type AnswerTier = 'SAFE' | 'OK' | 'RISKY' | 'AVOID';

export interface AnswerVerdict {
  tier: AnswerTier;
  /** composite score, higher = safer */
  score: number;
  /** one-line reason, e.g. "STAB Drill Peck 2HKO · only takes 4HKO" */
  reason: string;
  bestMove: string | null;
  outHits: number; // your hits to KO the foe (0 = can't damage)
  inHits: number; // foe hits to KO you
  outspeed: boolean | null;
  bestEff: number;
}

const hitsFromPct = (pct: number): number => (pct <= 0 ? 0 : Math.min(9, Math.max(1, Math.ceil(100 / pct))));

/**
 * Rank one own Pokémon against the opponent.
 * outCells: your move results vs the foe · inCells: foe results vs you.
 */
export function judgeMatchup(
  outCells: DamageCell[],
  inCells: DamageCell[],
  outspeed: boolean | null,
  lang: 'en' | 'de' = 'en',
): AnswerVerdict {
  const damaging = outCells.filter((c) => c.range[1] > 0);
  const best = damaging.sort((a, b) => b.pct[1] - a.pct[1])[0] ?? null;
  const worstIn = inCells.filter((c) => c.range[1] > 0).sort((a, b) => b.pct[1] - a.pct[1])[0] ?? null;

  const outHits = best ? hitsFromPct((best.pct[0] + best.pct[1]) / 2) : 0;
  const inHits = worstIn ? hitsFromPct((worstIn.pct[0] + worstIn.pct[1]) / 2) : 0;

  let score = 0;
  if (outHits > 0) score += Math.max(0, 5 - outHits); // faster KO = better
  if (inHits > 0) score += Math.min(4, inHits) * 0.8; // surviving longer = better
  else score += 4.5; // immune to everything the foe has
  if (outHits === 0) score -= 6; // can't hurt it at all
  if (outspeed === true) score += 1.25;
  if (outspeed === false) score -= 0.75;
  if (best && best.eff >= 2) score += 0.75;
  if (worstIn && worstIn.eff >= 2) score -= 2.25;
  if (worstIn && worstIn.eff === 0) score += 1.5;

  /* striking first effectively shaves one incoming hit */
  const effInHits = inHits > 0 ? inHits + (outspeed ? 0.5 : 0) : 99;
  let tier: AnswerTier;
  if (outHits > 0 && outHits <= 2 && effInHits >= 3) tier = 'SAFE';
  else if (outHits > 0 && outHits <= 2 && effInHits >= 2) tier = 'OK';
  else if (outHits > 0 && outHits <= 4 && effInHits >= 2) tier = score >= 7 ? 'OK' : 'RISKY';
  else if (outHits > 0 && inHits >= 3) tier = 'RISKY';
  else tier = 'AVOID';

  const t = (key: string, opts?: Record<string, unknown>) => i18n.t(key, { lng: lang, ...opts });
  const parts: string[] = [];
  if (best) {
    const stab = best.eff >= 2 ? `${t('versus.reasonSuper')} ` : '';
    parts.push(`${stab}${nameOfMove(best.move, lang)} ${koLabel(best, lang)}`);
  } else {
    parts.push(t('versus.reasonNoAnswer'));
  }
  if (worstIn)
    parts.push(
      inHits > 0
        ? t('versus.reasonTakes', {
            hits: inHits >= 4 ? t('versus.reasonHitsPlus', { n: 4 }) : t('versus.reasonHits', { n: inHits }),
          })
        : t('versus.reasonChip'),
    );
  else parts.push(t('versus.reasonUntouched'));
  if (outspeed === true) parts.push(t('versus.reasonOutspeeds'));
  if (outspeed === false && inHits > 0 && inHits <= 2) parts.push(t('versus.reasonOutsped'));

  return { tier, score, reason: parts.join(' · '), bestMove: best?.move ?? null, outHits, inHits, outspeed, bestEff: best?.eff ?? 1 };
}

export const TIER_ORDER: Record<AnswerTier, number> = { SAFE: 0, OK: 1, RISKY: 2, AVOID: 3 };

/* ---------- enriched trainer data (kanto.json) ---------- */

export interface EnrichedPartyMember {
  species: string;
  level: number;
  moves?: string[];
}

export interface EnrichedTrainer {
  name: string;
  class: string;
  party: EnrichedPartyMember[];
  important?: boolean;
  node: string; // map node key
}

interface EnrichedNode {
  trainers?: Array<Omit<EnrichedTrainer, 'node'>>;
}

/** flatten enriched region json → trainer list, important first, leaders ahead */
export function trainerIndex(json: { nodes?: Record<string, EnrichedNode> }): EnrichedTrainer[] {
  const out: EnrichedTrainer[] = [];
  for (const [node, data] of Object.entries(json.nodes ?? {})) {
    for (const t of data.trainers ?? []) out.push({ ...t, node });
  }
  const classRank = (c: string) =>
    c === 'Leader' ? 0 : c === 'Elite Four' ? 1 : c === 'Champion' ? 2 : c === 'Boss' ? 3 : c === 'Rival' ? 4 : 5;
  return out.sort((a, b) => {
    const imp = Number(b.important ?? false) - Number(a.important ?? false);
    if (imp) return imp;
    return classRank(a.class) - classRank(b.class) || a.name.localeCompare(b.name);
  });
}
