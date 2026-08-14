/* Shared type-effectiveness math + multiplier labels.
 * PURE module (@pkmn/data/@pkmn/dex only — no i18n, no supabase) so every
 * bundle can import it, including the lazy battle engine chunk.
 * teambuilder.ts re-exports genEffectivenessOf/genTypeSlugs to keep its
 * public API stable. */

import { Generations } from '@pkmn/data';
import { Dex } from '@pkmn/dex';
import type { GenerationNum, TypeName } from '@pkmn/data';

const gens = new Generations(Dex);

const capType = (slug: string) => (slug.charAt(0).toUpperCase() + slug.slice(1)) as TypeName;

/**
 * Gen-correct effectiveness of an attacking type vs defending type slugs.
 * Dual types multiply (Electric vs Water/Flying = ×4, Electric vs
 * Grass/Dragon = ×¼). Uses the per-gen chart from @pkmn/data (gen 1:
 * Ghost vs Psychic ×0, Bug↔Poison ×2; gen 2–5: Steel resists Dark/Ghost; …).
 * Types that don't exist in the gen resolve neutral.
 */
export function genEffectivenessOf(genNum: GenerationNum, attackType: string, defendingTypes: string[]): number {
  const types = gens.get(genNum).types;
  const atk = capType(attackType);
  if (!types.get(atk)?.exists) return 1;
  const defs = defendingTypes.map(capType).filter((d) => types.get(d)?.exists);
  if (!defs.length) return 1;
  return types.totalEffectiveness(atk, defs);
}

/** type slugs (lowercase) existing in this gen */
export function genTypeSlugs(genNum: GenerationNum): string[] {
  return [...gens.get(genNum).types].map((t) => t.name.toLowerCase());
}

/** chart / UI types — skips the gen 2–4 Curse placeholder `???` */
export function chartTypeSlugs(genNum: GenerationNum): string[] {
  return genTypeSlugs(genNum).filter((s) => s !== '???');
}

/** exact glyphs for every multiplier the chart + abilities can produce
 * (Filter/Solid Rock 4→3, 2→1½, ½→⅜…; Dry Skin 1→1¼, 2→2½, 4→5, ½→⅝…) */
const MULT_LABELS: Record<number, string> = {
  0: '×0',
  0.125: '×⅛',
  0.25: '×¼',
  0.375: '×⅜',
  0.5: '×½',
  0.625: '×⅝',
  0.75: '×¾',
  1: '×1',
  1.25: '×1¼',
  1.5: '×1½',
  2: '×2',
  2.5: '×2½',
  3: '×3',
  4: '×4',
  5: '×5',
};

/** display label for an effectiveness multiplier (×4, ×2, ×½, ×¼, ×3, …) */
export function effMultLabel(mult: number): string {
  return MULT_LABELS[mult] ?? `×${Math.round(mult * 100) / 100}`;
}

/** defensive matchup buckets that keep dual-type extremes separate:
 * ×4 (double weakness) and ×¼ (double resist) get their own rows instead
 * of being lumped into ×2 / ×½ */
export interface SplitMatchups {
  /** attacking types hitting for ×4 or more */
  quad: string[];
  /** attacking types hitting for ×2 (but less than ×4) */
  weak: string[];
  /** attacking types resisted at ×½ (but better than ×¼) */
  resist: string[];
  /** attacking types resisted at ×¼ or less (but > 0) */
  quarter: string[];
  /** attacking types that cannot hit (×0) */
  immune: string[];
}

export function splitMatchups(defendingTypes: string[], genNum: GenerationNum): SplitMatchups {
  const quad: string[] = [];
  const weak: string[] = [];
  const resist: string[] = [];
  const quarter: string[] = [];
  const immune: string[] = [];
  for (const atk of chartTypeSlugs(genNum)) {
    const mult = genEffectivenessOf(genNum, atk, defendingTypes);
    if (mult === 0) immune.push(atk);
    else if (mult >= 4) quad.push(atk);
    else if (mult >= 2) weak.push(atk);
    else if (mult <= 0.25) quarter.push(atk);
    else if (mult < 1) resist.push(atk);
  }
  return { quad, weak, resist, quarter, immune };
}
