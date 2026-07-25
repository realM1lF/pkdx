/* Batch simulation core for the curated matchup pages (/versus/<slug>).
 *
 * One matchup = 100 seeded 1v1 battles on the real engine (MicroBattle,
 * gen9customgame) with the greedy heuristic driving BOTH sides
 * (MicroBattle.autoBattle). Deterministic: the battle seed fully decides
 * damage rolls, accuracy and speed ties; the greedy picker breaks choice
 * ties by slot order and never touches Math.random.
 *
 * Seed schema (documented for reproduction): a 32-bit FNV-1a hash of the
 * English matchup slug is the stream base; battle j scrambles it with the
 * golden-ratio constant and expands it into the 4-word sim PRNG seed via
 * splitmix32. Same slug + same battle count → same seeds → same results.
 *
 * Standard sets mirror the Versus default resolution (resolveDefaultSet in
 * VersusPanel): the last 4 level-up moves at the level (WILD stage), padded
 * by the STAB+coverage heuristic (ASSUMED stage) when the pool is thin.
 * The versus lab resolves pools in the selected game; the matchup pages
 * standardize on the newest game (scarlet-violet), falling back to the
 * newest version group that teaches the species anything (e.g. Mewtwo). */
import { calculate, Generations, Move as CalcMove, Pokemon as CalcPokemon } from '@smogon/calc';
import { Generations as DataGenerations } from '@pkmn/data';
import { Dex } from '@pkmn/dex';
import type { GenerationNum, TypeName } from '@pkmn/data';
import type { Move, Pokemon } from '../types';
import {
  levelUpPool,
  newestVersionGroup,
  pickTopMoves,
  pokemonBaseTypes,
  preferredCategory,
  wildMoveset,
} from '../move-pool';
import { MicroBattle } from './engine';
import type { BattleSideSetup } from './types';

export const MATCHUP_LEVEL = 50;
export const MATCHUP_BATTLES = 100;
export const MATCHUP_FORMAT = 'gen9customgame';
/** newest game — same default the versus lab/battle landing standardize on */
export const MATCHUP_VERSION_GROUP = 'scarlet-violet';

type Sim = typeof import('@pkmn/sim');
export type SimLoader = () => Promise<Sim>;

/* ---------- standard sets (Versus default resolution) ---------- */

export interface MatchupSet {
  species: string; // PokéAPI slug
  level: number;
  moves: string[];
  source: 'wild' | 'assumed';
  /** version group the level-up pool was read from */
  versionGroup: string;
}

/**
 * Wild-then-assumed default set, gen-9-first with per-species fallback:
 * identical stages to resolveDefaultSet (VersusPanel), but when the newest
 * game doesn't know the species the pool falls back to the newest version
 * group with data instead of degrading to an empty set.
 */
export function resolveMatchupSet(
  p: Pokemon,
  level: number,
  details: Map<string, Move>,
  versionGroup: string = MATCHUP_VERSION_GROUP,
): MatchupSet {
  let vg = versionGroup;
  let wild = wildMoveset(p, level, vg);
  if (!wild.length) {
    vg = newestVersionGroup(p);
    wild = wildMoveset(p, level, vg);
  }
  if (wild.length >= 4) return { species: p.name, level, moves: wild, source: 'wild', versionGroup: vg };
  const types = pokemonBaseTypes(p);
  const cands = levelUpPool(p, vg)
    .map((e) => ({ slug: e.slug, detail: details.get(e.slug) }))
    .filter((c): c is { slug: string; detail: Move } => Boolean(c.detail));
  const top = pickTopMoves(cands, types, { preferCategory: preferredCategory(p) });
  const merged = [...wild];
  for (const t of top) {
    if (merged.length >= 4) break;
    if (!merged.includes(t)) merged.push(t);
  }
  return { species: p.name, level, moves: merged, source: wild.length ? 'wild' : 'assumed', versionGroup: vg };
}

/** move slugs worth fetching details for (assumed-stage candidates) */
export function detailCandidates(p: Pokemon, versionGroup: string = MATCHUP_VERSION_GROUP): string[] {
  const vg = levelUpPool(p, versionGroup).length ? versionGroup : newestVersionGroup(p);
  return levelUpPool(p, vg).map((e) => e.slug);
}

/* ---------- deterministic seed stream ---------- */

/** FNV-1a 32-bit — stable across runs and machines */
function fnv1a(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function splitmix32(state: { x: number }): number {
  state.x = (state.x + 0x9e3779b9) >>> 0;
  let z = state.x;
  z = Math.imul(z ^ (z >>> 16), 0x21f0aaad);
  z = Math.imul(z ^ (z >>> 15), 0x735a2d97);
  return (z ^ (z >>> 15)) >>> 0;
}

/** 4-word sim PRNG seed for battle `battleIndex` of matchup `slug` */
export function matchupSeed(slug: string, battleIndex: number): [number, number, number, number] {
  const state = { x: (fnv1a(slug) ^ Math.imul(battleIndex + 1, 0x9e3779b9)) >>> 0 };
  const word = () => splitmix32(state) & 0xffff;
  return [word(), word(), word(), word()];
}

/* ---------- battle batch ---------- */

export interface MatchupBattleStats {
  winsA: number;
  winsB: number;
  ties: number;
  medianTurns: number;
}

function sideSetupOf(set: MatchupSet): BattleSideSetup {
  return { species: set.species, level: set.level, moves: set.moves };
}

/**
 * Run `battles` seeded greedy-vs-greedy battles A (p1) vs B (p2).
 * Half the battles swap the sim sides so first-side artifacts cancel out;
 * swapped battles map p1→B and p2→A.
 */
export async function simulateMatchup(
  setA: MatchupSet,
  setB: MatchupSet,
  slug: string,
  simLoader?: SimLoader,
  battles: number = MATCHUP_BATTLES,
): Promise<MatchupBattleStats> {
  let winsA = 0;
  let winsB = 0;
  let ties = 0;
  const turns: number[] = [];
  for (let j = 0; j < battles; j++) {
    const swapped = j % 2 === 1; // battles 1,3,5… put B on p1
    const mb = await MicroBattle.create(
      {
        gen: 9,
        player: sideSetupOf(swapped ? setB : setA),
        ai: sideSetupOf(swapped ? setA : setB),
      },
      { aiMode: 'greedy', seed: matchupSeed(slug, j), simLoader },
    );
    const end = mb.autoBattle();
    const winner = end.winner; // 'player' | 'ai' | 'tie' | null (turn cap)
    if (winner === 'tie' || winner == null) ties++;
    else if ((winner === 'player') !== swapped) winsA++;
    else winsB++;
    turns.push(end.turn);
  }
  turns.sort((a, b) => a - b);
  const medianTurns = turns.length
    ? turns.length % 2 === 1
      ? turns[(turns.length - 1) / 2]
      : Math.round((turns[turns.length / 2 - 1] + turns[turns.length / 2]) / 2)
    : 0;
  return { winsA, winsB, ties, medianTurns };
}

/* ---------- @smogon/calc key-move rows + speed ---------- */

export interface KeyMoveRow {
  slug: string;
  /** min/max roll in HP against the defender */
  range: [number, number];
  /** min/max as % of the defender's max HP (1 decimal) */
  pct: [number, number];
  /** gen-9 type effectiveness of the move type vs the defender's types */
  eff: number;
}

export interface CalcOverview {
  /** computed stats at the matchup level (for the speed compare) */
  speedA: number;
  speedB: number;
  typesA: string[];
  typesB: string[];
  /** damaging set moves of A vs B, strongest mean pct first */
  movesA: KeyMoveRow[];
  /** damaging set moves of B vs A */
  movesB: KeyMoveRow[];
}

const calcGen9 = Generations.get(9);
const dataGens = new DataGenerations(Dex);

const capType = (slug: string) => (slug.charAt(0).toUpperCase() + slug.slice(1)) as TypeName;

/** gen-9 chart effectiveness (same source as genEffectivenessOf in teambuilder) */
function typeEff(attackType: string, defendingTypes: string[]): number {
  const types = dataGens.get(9 as GenerationNum).types;
  const atk = capType(attackType);
  if (!types.get(atk)?.exists) return 1;
  const defs = defendingTypes.map(capType).filter((d) => types.get(d)?.exists);
  if (!defs.length) return 1;
  return types.totalEffectiveness(atk, defs);
}

function calcMon(speciesSlug: string, level: number): CalcPokemon | null {
  try {
    return new CalcPokemon(calcGen9, speciesSlug, { level });
  } catch {
    return null;
  }
}

function keyRows(attacker: CalcPokemon, defender: CalcPokemon, moves: string[]): KeyMoveRow[] {
  const defTypes = defender.species.types.map((t) => t.toLowerCase());
  const maxHp = defender.stats.hp || 1;
  const rows: KeyMoveRow[] = [];
  for (const slug of moves) {
    try {
      const mv = new CalcMove(calcGen9, slug);
      if (!mv.bp) continue; // status / fixed-damage / OHKO — no range
      const [lo, hi] = calculate(calcGen9, attacker, defender, mv).range();
      if (hi <= 0) continue;
      rows.push({
        slug,
        range: [lo, hi],
        pct: [Math.round((lo / maxHp) * 1000) / 10, Math.round((hi / maxHp) * 1000) / 10],
        eff: typeEff((mv.type ?? 'normal').toLowerCase(), defTypes),
      });
    } catch {
      /* move unknown to the gen-9 calc data — skip */
    }
  }
  return rows.sort((a, b) => (b.pct[0] + b.pct[1]) / 2 - (a.pct[0] + a.pct[1]) / 2);
}

/** calc overview for the matchup page modules (speed + top-move ranges) */
export function calcOverview(setA: MatchupSet, setB: MatchupSet): CalcOverview | null {
  const a = calcMon(setA.species, setA.level);
  const b = calcMon(setB.species, setB.level);
  if (!a || !b) return null;
  return {
    speedA: a.stats.spe,
    speedB: b.stats.spe,
    typesA: a.species.types.map((t) => t.toLowerCase()),
    typesB: b.species.types.map((t) => t.toLowerCase()),
    movesA: keyRows(a, b, setA.moves),
    movesB: keyRows(b, a, setB.moves),
  };
}
