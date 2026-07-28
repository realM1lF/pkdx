/* MyPokePanion — move pools + default movesets.
 * Pure PokéAPI-payload helpers, deliberately dependency-light (only ./types)
 * so they can be bundled for Node scripts (matchup simulations) without
 * pulling the i18n/PokéAPI/Supabase import chain. teambuilder.ts re-exports
 * everything to keep its public API stable; versus.ts re-exports from there. */
import type { Move, Pokemon } from './types';
import type { VersusContext } from './versus-context';

export const DAMAGING_MOVE_CATS = new Set(['physical', 'special']);

export interface PoolEntry {
  slug: string;
  level: number; // level_learned_at (0/1 = start)
  method: string;
}

/** version groups newest → oldest (mirrors detail/data.ts ordering, kept lib-local) */
const VERSION_GROUP_RANK: Record<string, number> = {
  'scarlet-violet': 24,
  'legends-arceus': 23,
  'brilliant-diamond-shining-pearl': 22,
  'sword-shield': 21,
  'lets-go-pikachu-eevee': 20,
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
 * WILD set: the 4 most recently learned level-up moves at `level`
 * (newest version group). Fewer than 4 if the pool is thin.
 */
export function wildMoveset(p: Pokemon, level: number, versionGroup?: string, ctx?: VersusContext): string[] {
  const pool = levelUpPool(p, versionGroup, ctx).filter((e) => e.level <= level);
  return pool.slice(-4).map((e) => e.slug);
}

/* ---------- top-4 heuristic ----------
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
    if (!DAMAGING_MOVE_CATS.has(cat)) continue;
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
