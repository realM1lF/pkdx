/* Type matchup math for the SEO type pages (SEO rollout).
 *
 * Everything is computed live from the per-gen type chart (@pkmn/data via
 * src/lib/versus.ts) — the pages ship calculated matrices, not hand-written
 * tables, so the content is unique and always chart-accurate. Gen 9 chart
 * (current mechanics). Only imported by the lazy type route chunks. */
import { POKEMON_TYPES } from './types';
import { effectivenessOf } from './versus';

export interface OffenseProfile {
  /** defending types hit for 2× */
  superEffective: string[];
  /** defending types hit for ½× */
  notVery: string[];
  /** defending types immune (0×) */
  zero: string[];
}

export interface DefenseProfile {
  /** attacking types that hit for 2× */
  weak: string[];
  /** attacking types resisted (½×) */
  resist: string[];
  /** attacking types that cannot hit (0×) */
  immune: string[];
}

/** Offensive matrix of an attacking type against all 18 single types. */
export function offenseProfile(attackType: string): OffenseProfile {
  const superEffective: string[] = [];
  const notVery: string[] = [];
  const zero: string[] = [];
  for (const def of POKEMON_TYPES) {
    const mult = effectivenessOf(attackType, [def], 9);
    if (mult === 0) zero.push(def);
    else if (mult === 2) superEffective.push(def);
    else if (mult < 1) notVery.push(def);
  }
  return { superEffective, notVery, zero };
}

/** Defensive matrix of a single defending type against all 18 attackers. */
export function defenseProfile(defendingType: string): DefenseProfile {
  const weak: string[] = [];
  const resist: string[] = [];
  const immune: string[] = [];
  for (const atk of POKEMON_TYPES) {
    const mult = effectivenessOf(atk, [defendingType], 9);
    if (mult === 0) immune.push(atk);
    else if (mult >= 2) weak.push(atk);
    else if (mult < 1) resist.push(atk);
  }
  return { weak, resist, immune };
}

/**
 * Counter quality of an attacking type against a defending type:
 * how hard it hits (≥2) × how well it tanks the type's own STAB.
 */
export interface CounterInfo {
  type: string;
  /** effectiveness of the counter against the page type (2 or more) */
  hitsFor: number;
  /** effectiveness of the page type against the counter (≤1; 0.5/0 = resists) */
  takesFor: number;
}

export function countersOf(defendingType: string): CounterInfo[] {
  return defenseProfile(defendingType).weak
    .map((atk) => ({
      type: atk,
      hitsFor: effectivenessOf(atk, [defendingType], 9),
      takesFor: effectivenessOf(defendingType, [atk], 9),
    }))
    .sort((a, b) => a.takesFor - b.takesFor);
}

/**
 * Well-known example Pokémon per type for the "what beats X" module:
 * a famous (often dual-typed) Pokémon of that type plus the counter type
 * that exploits it hardest. The shown multiplier is COMPUTED, so 4× cases
 * (Swampert vs. Grass, Charizard vs. Rock, …) fall out of the chart.
 */
export const COUNTER_EXAMPLES: Record<string, { pokemonId: number; types: string[]; counter: string }> = {
  normal: { pokemonId: 143, types: ['normal'], counter: 'fighting' }, // Snorlax
  fire: { pokemonId: 6, types: ['fire', 'flying'], counter: 'rock' }, // Charizard 4×
  water: { pokemonId: 260, types: ['water', 'ground'], counter: 'grass' }, // Swampert 4×
  electric: { pokemonId: 130, types: ['water', 'flying'], counter: 'electric' }, // Gyarados 4×
  grass: { pokemonId: 103, types: ['grass', 'psychic'], counter: 'bug' }, // Exeggutor 4×
  ice: { pokemonId: 131, types: ['water', 'ice'], counter: 'fighting' }, // Lapras
  fighting: { pokemonId: 68, types: ['fighting'], counter: 'psychic' }, // Machamp
  poison: { pokemonId: 94, types: ['ghost', 'poison'], counter: 'ground' }, // Gengar
  ground: { pokemonId: 445, types: ['dragon', 'ground'], counter: 'ice' }, // Garchomp 4×
  flying: { pokemonId: 149, types: ['dragon', 'flying'], counter: 'ice' }, // Dragonite 4×
  psychic: { pokemonId: 65, types: ['psychic'], counter: 'dark' }, // Alakazam
  bug: { pokemonId: 212, types: ['bug', 'steel'], counter: 'fire' }, // Scizor 4×
  rock: { pokemonId: 248, types: ['rock', 'dark'], counter: 'fighting' }, // Tyranitar 4×
  ghost: { pokemonId: 487, types: ['ghost', 'dragon'], counter: 'ghost' }, // Giratina
  dragon: { pokemonId: 373, types: ['dragon', 'flying'], counter: 'ice' }, // Salamence 4×
  dark: { pokemonId: 197, types: ['dark'], counter: 'fighting' }, // Umbreon
  steel: { pokemonId: 376, types: ['steel', 'psychic'], counter: 'fire' }, // Metagross
  fairy: { pokemonId: 282, types: ['psychic', 'fairy'], counter: 'steel' }, // Gardevoir
};

export function exampleMultiplier(example: { types: string[]; counter: string }): number {
  return effectivenessOf(example.counter, example.types, 9);
}

/**
 * Number of Pokémon per type as of Gen 9 — Bulbapedia counting method
 * ("Pokémon that are <type>-type in at least one of their forms, including
 * Mega Evolutions and regional forms"). Computed from @pkmn/dex: per dex
 * number (≤ 1025, CAP/Custom/LGPE/Future excluded) the UNION of types across
 * all formes, one vote per species. Cross-checked against Bulbapedia's
 * Gen-IX type pages (e.g. Dark 84, Poison 89, Water ~160).
 */
export const TYPE_SPECIES_COUNT: Record<string, number> = {
  normal: 133,
  fire: 89,
  water: 161,
  electric: 75,
  grass: 132,
  ice: 60,
  fighting: 84,
  poison: 89,
  ground: 79,
  flying: 114,
  psychic: 111,
  bug: 94,
  rock: 80,
  ghost: 75,
  dragon: 77,
  dark: 84,
  steel: 79,
  fairy: 71,
};

/** Attack-rating inputs for the "is X a good offensive type?" answer. */
export interface AttackRating {
  targets2x: number;
  resistedBy: number;
  immunes: number;
  tier: 'excellent' | 'good' | 'average' | 'rough';
}

export function attackRating(attackType: string): AttackRating {
  const o = offenseProfile(attackType);
  const targets2x = o.superEffective.length;
  const resistedBy = o.notVery.length;
  const immunes = o.zero.length;
  /* grounded in the chart: great coverage = many 2× targets, few roadblocks */
  const score = targets2x * 2 - resistedBy - immunes * 2;
  const tier = score >= 6 ? 'excellent' : score >= 3 ? 'good' : score >= 0 ? 'average' : 'rough';
  return { targets2x, resistedBy, immunes, tier };
}
