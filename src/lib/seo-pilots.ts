/* seo-pilots — registry gate for the question-driven SEO content sections
 * (SEO pilot). Only pilot Pokémon carry content sections; the registry is
 * keyed by dex id so further pilots can be added without touching the page
 * wiring (src/pages/detail/PokemonSeoSections.tsx renders the content). */
import slugsJson from '@/data/pokemon-slugs.json';

const SLUG_TO_ID = new Map((slugsJson as string[]).map((s, i) => [s, i + 1]));

/** Resolve a route param ('25' or 'pikachu') to a dex id. */
export function resolveDexId(queryId: string): number | null {
  const q = queryId.trim().toLowerCase();
  if (/^\d+$/.test(q)) {
    const n = Number(q);
    return n >= 1 && n <= 1025 ? n : null;
  }
  return SLUG_TO_ID.get(q) ?? null;
}

/* SEO rollout 2: Pikachu (25) keeps its curated pilot module; the other 34
 * render generated sections (src/pages/detail/PokemonSeoGeneric.tsx). Keep in
 * sync with POKEMON_IDS in scripts/generate-pokemon-seo.mjs. */
const PILOT_IDS: ReadonlySet<number> = new Set([
  1, 2, 3, 4, 5, 6, 7, 8, 9, 25, 26, 133, 143, 150, 151, 149, 130, 94, 18, 20,
  24, 97, 105, 65, 112,
  /* Tranche 26–35 */
  134, 135, 136, 131, 142, 144, 145, 146, 59, 68,
]);

/** True when the detail route param resolves to a Pokémon with SEO sections. */
export function hasPokemonSeoSections(queryId: string): boolean {
  const id = resolveDexId(queryId);
  return id != null && PILOT_IDS.has(id);
}
