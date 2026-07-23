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
import { genEffectivenessOf, genTypeSlugs } from './teambuilder';
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
    return new CalcPokemon(gen, side.slug, {
      level: clampLevel(side.level),
      nature: side.nature,
      evs: side.evs ? evs : undefined,
      ivs: side.ivs ? ivs : undefined,
      ability: side.ability ?? undefined,
      item: side.item ?? undefined,
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

export const EFF_LABEL = (mult: number): string =>
  mult === 0 ? '×0' : mult === 0.25 ? '×¼' : mult === 0.5 ? '×½' : mult === 1 ? '×1' : mult === 2 ? '×2' : '×4';

/* ---------- damage ---------- */

export interface DamageCell {
  move: string; // slug
  /** min/max roll in HP */
  range: [number, number];
  /** min/max as % of defender max HP (0–100+) */
  pct: [number, number];
  /** hits to KO (0 for status/non-damaging) */
  koHits: number;
  /** guaranteed-KO chance 0–1 (1 = guaranteed) */
  koChance: number;
  eff: number;
  /** gen-correct damage category (type-based split in gen 1–3, from the calc move) */
  category?: string;
}

const DAMAGING_CATS = new Set(['physical', 'special']);

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
  if (!DAMAGING_CATS.has(cat) || !mv.bp) return typeEff;
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
  if (!DAMAGING_CATS.has(category) || !mv.bp) return [0, 0];
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

  if (!DAMAGING_CATS.has(category) || !mv.bp) {
    return { move: moveSlug, range: [0, 0], pct: [0, 0], koHits: 0, koChance: 0, eff, category };
  }
  try {
    const res = calculate(gen, atk, def, mv, calcField);
    const [lo, hi] = res.range();
    const maxHp = def.stats.hp || 1;
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
    return {
      move: moveSlug,
      range: [lo, hi],
      pct: [(lo / maxHp) * 100, (hi / maxHp) * 100],
      koHits,
      koChance,
      eff,
      category,
    };
  } catch {
    return null;
  }
}

/** compact KO chip label: OHKO / 2HKO / 3HKO / 4HKO+ / 9HKO+ / — */
export function koLabel(cell: DamageCell | null): string {
  if (!cell || cell.koHits <= 0) return '—';
  if (cell.koHits === 1) return 'OHKO';
  if (cell.koHits <= 3) return `${cell.koHits}HKO`;
  if (cell.koHits >= 9) return '9HKO+';
  return '4HKO+';
}

/* ---------- move pools (PokéAPI payload, sync) ---------- */

export interface PoolEntry {
  slug: string;
  level: number; // level_learned_at (0/1 = start)
  method: string;
}

/** newest version group key that teaches this Pokémon anything */
export function newestVersionGroup(p: Pokemon): string {
  let best = '';
  for (const m of p.moves) {
    for (const d of m.version_group_details) {
      const vg = d.version_group.name;
      if (VERSION_GROUP_RANK[vg] != null && (VERSION_GROUP_RANK[vg] ?? 0) > (VERSION_GROUP_RANK[best] ?? -1)) best = vg;
      else if (!best) best = vg;
    }
  }
  return best;
}

/** version groups newest → oldest (mirrors detail/data.ts ordering, kept lib-local) */
const VERSION_GROUP_RANK: Record<string, number> = {
  'scarlet-violet': 22,
  'sword-shield': 21,
  'lets-go-pikachu-lets-go-eevee': 20,
  'ultra-sun-ultra-moon': 19,
  'sun-moon': 18,
  'omega-ruby-alpha-sapphire': 17,
  'x-y': 16,
  'black-2-white-2': 15,
  'black-white': 14,
  'heartgold-soulsilver': 13,
  platinum: 12,
  'diamond-pearl': 11,
  emerald: 10,
  'firered-leafgreen': 9,
  'ruby-sapphire': 8,
  colosseum: 7,
  xd: 6,
  crystal: 5,
  'gold-silver': 4,
  yellow: 3,
  'red-blue': 2,
};

/** full legal pool in the given version group (any method), deduped, for autocomplete */
export function legalMoveSlugs(p: Pokemon, versionGroup?: string, ctx?: VersusContext): string[] {
  const vg = ctx?.versionGroup ?? versionGroup ?? newestVersionGroup(p);
  const set = new Set<string>();
  for (const m of p.moves) {
    if (m.version_group_details.some((d) => d.version_group.name === vg)) set.add(m.move.name);
  }
  return [...set].sort();
}

/** level-up pool (sorted by learn level) in the given version group */
export function levelUpPool(p: Pokemon, versionGroup?: string, ctx?: VersusContext): PoolEntry[] {
  const vg = ctx?.versionGroup ?? versionGroup ?? newestVersionGroup(p);
  const bySlug = new Map<string, number>();
  for (const m of p.moves) {
    for (const d of m.version_group_details) {
      if (d.version_group.name !== vg || d.move_learn_method.name !== 'level-up') continue;
      const prev = bySlug.get(m.move.name);
      const lv = d.level_learned_at;
      if (prev == null || (lv > 0 && lv < prev)) bySlug.set(m.move.name, lv);
    }
  }
  return [...bySlug.entries()]
    .map(([slug, level]) => ({ slug, level, method: 'level-up' }))
    .sort((a, b) => a.level - b.level || a.slug.localeCompare(b.slug));
}

/**
 * Stage 2 — WILD: the 4 most recently learned level-up moves at `level`
 * (newest version group). Fewer than 4 if the pool is thin.
 */
export function wildMoveset(p: Pokemon, level: number, versionGroup?: string, ctx?: VersusContext): string[] {
  const pool = levelUpPool(p, versionGroup, ctx).filter((e) => e.level <= level);
  return pool.slice(-4).map((e) => e.slug);
}

/* ---------- top-4 heuristic (versus.md) ----------
 * STAB first · score = base power × accuracy · dedupe per type ·
 * physical/special by the better attack stat. */

export interface ScoredMove {
  slug: string;
  type: string;
  category: string;
  power: number;
  accuracy: number;
  stab: boolean;
  score: number;
}

export function scoreMoves(
  candidates: Array<{ slug: string; detail: Move }>,
  ownTypes: string[],
  opts?: { preferCategory?: 'physical' | 'special' },
): ScoredMove[] {
  const out: ScoredMove[] = [];
  for (const { slug, detail } of candidates) {
    const cat = detail.damage_class.name;
    if (!DAMAGING_CATS.has(cat)) continue;
    const power = detail.power ?? 0;
    if (power <= 0) continue;
    const acc = detail.accuracy ?? 100;
    const type = detail.type.name;
    const stab = ownTypes.includes(type);
    let score = power * (acc / 100) * (stab ? 1.5 : 1);
    if (opts?.preferCategory && cat === opts.preferCategory) score *= 1.15;
    out.push({ slug, type, category: cat, power, accuracy: acc, stab, score });
  }
  return out.sort((a, b) => b.score - a.score);
}

/**
 * Pick the best 4 damaging moves: dedupe per type (best score wins),
 * STAB types ranked first, then coverage by score.
 */
export function pickTopMoves(
  candidates: Array<{ slug: string; detail: Move }>,
  ownTypes: string[],
  opts?: { preferCategory?: 'physical' | 'special'; count?: number },
): string[] {
  const count = opts?.count ?? 4;
  const scored = scoreMoves(candidates, ownTypes, opts);
  const byType = new Map<string, ScoredMove>();
  for (const s of scored) if (!byType.has(s.type)) byType.set(s.type, s);
  const unique = [...byType.values()].sort((a, b) => Number(b.stab) - Number(a.stab) || b.score - a.score);
  return unique.slice(0, count).map((s) => s.slug);
}

/** species types in slot order */
export function pokemonBaseTypes(p: Pokemon): string[] {
  return [...p.types].sort((a, b) => a.slot - b.slot).map((t) => t.type.name);
}

/** which attack stat is stronger on the species' base stats */
export function preferredCategory(p: Pokemon): 'physical' | 'special' {
  const atk = p.stats.find((s) => s.stat.name === 'attack')?.base_stat ?? 0;
  const spa = p.stats.find((s) => s.stat.name === 'special-attack')?.base_stat ?? 0;
  return atk >= spa ? 'physical' : 'special';
}

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
    parts.push(`${stab}${nameOfMove(best.move, lang)} ${koLabel(best)}`);
  } else {
    parts.push(t('versus.reasonNoAnswer'));
  }
  if (worstIn)
    parts.push(
      inHits > 0
        ? t('versus.reasonTakes', { ko: inHits >= 4 ? '4HKO+' : `${inHits}HKO` })
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
