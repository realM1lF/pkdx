/* MyPokePanion — move pools + default movesets.
 * Pure PokéAPI-payload helpers, deliberately dependency-light (only ./types)
 * so they can be bundled for Node scripts (matchup simulations) without
 * pulling the i18n/PokéAPI/Supabase import chain. teambuilder.ts re-exports
 * everything to keep its public API stable; versus.ts re-exports from there. */
import type { Move, Pokemon } from './types';
import type { VersusContext } from './versus-context';
import { VERSION_GROUPS } from './version-groups';

export const DAMAGING_MOVE_CATS = new Set(['physical', 'special']);

export interface PoolEntry {
  slug: string;
  level: number; // level_learned_at (0/1 = start)
  method: string;
}

/** Same order as `version-groups.ts` (oldest → newest). Higher index = newer. */
const VERSION_GROUP_RANK: Record<string, number> = Object.fromEntries(
  VERSION_GROUPS.map((g, i) => [g.id, i]),
);

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

export type LearnMethod = 'level-up' | 'machine' | 'egg' | 'tutor';

/** UI tabs. PokéAPI still stores TM+HM as `machine`; the panel splits them. */
export type LearnMethodTab = 'level-up' | 'tm' | 'hm' | 'egg' | 'tutor';

/** Serebii/PokéWiki gen-dex tabs: egg from Gen 2, tutors from Gen 3, HMs through Gen 6. */
export function learnMethodsForGen(gen: number): LearnMethod[] {
  const methods: LearnMethod[] = ['level-up', 'machine'];
  if (gen >= 2) methods.push('egg');
  if (gen >= 3) methods.push('tutor');
  return methods;
}

export function learnMethodTabsForGen(gen: number): LearnMethodTab[] {
  const tabs: LearnMethodTab[] = ['level-up', 'tm'];
  if (gen <= 6) tabs.push('hm');
  if (gen >= 2) tabs.push('egg');
  if (gen >= 3) tabs.push('tutor');
  return tabs;
}

/** App id vs PokéAPI slug for the same Let's Go edition. Do not rename the app id. */
const LETS_GO_VG = new Set(['lets-go-pikachu-eevee', 'lets-go-pikachu-lets-go-eevee']);

/** True when both strings name the same version group (incl. Let's Go alias). */
export function sameVersionGroup(a: string, b: string): boolean {
  if (a === b) return true;
  return LETS_GO_VG.has(a) && LETS_GO_VG.has(b);
}

/** Moves taught by one method in one version group. Never mixes editions. */
export function learnsetFor(p: Pokemon, versionGroup: string, method: LearnMethod): PoolEntry[] {
  const bySlug = new Map<string, number>();
  for (const m of p.moves) {
    for (const d of m.version_group_details) {
      if (!sameVersionGroup(d.version_group.name, versionGroup) || d.move_learn_method.name !== method) continue;
      const prev = bySlug.get(m.move.name);
      const lv = d.level_learned_at;
      if (prev == null || (lv > 0 && lv < prev)) bySlug.set(m.move.name, lv);
    }
  }
  return [...bySlug.entries()]
    .map(([slug, level]) => ({ slug, level, method }))
    .sort((a, b) => a.level - b.level || a.slug.localeCompare(b.slug));
}

/**
 * Egg moves for this Pokémon in one edition.
 * PokéAPI only lists eggs on the first stage; Serebii/Wiki show the line on
 * evolutions too. Union the same-edition eggs from `ancestors` (closest first).
 * Never mixes version groups.
 */
export function eggLearnsetFor(
  self: Pokemon,
  ancestors: Pokemon[],
  versionGroup: string,
): { entries: PoolEntry[]; inheritedFromPrevo: boolean } {
  const own = learnsetFor(self, versionGroup, 'egg');
  const bySlug = new Map(own.map((e) => [e.slug, e]));
  let inheritedFromPrevo = false;
  for (const pre of ancestors) {
    for (const e of learnsetFor(pre, versionGroup, 'egg')) {
      if (bySlug.has(e.slug)) continue;
      bySlug.set(e.slug, e);
      inheritedFromPrevo = true;
    }
  }
  const entries = [...bySlug.values()].sort((a, b) => a.level - b.level || a.slug.localeCompare(b.slug));
  return { entries, inheritedFromPrevo };
}

/** level-up pool (sorted by learn level) in the given version group */
export function levelUpPool(p: Pokemon, versionGroup?: string, ctx?: VersusContext): PoolEntry[] {
  const vg = ctx?.versionGroup ?? versionGroup ?? newestVersionGroup(p);
  return learnsetFor(p, vg, 'level-up');
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
