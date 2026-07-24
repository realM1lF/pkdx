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

const PILOT_IDS: ReadonlySet<number> = new Set([25]);

/** True when the detail route param resolves to a pilot Pokémon with SEO sections. */
export function hasPokemonSeoSections(queryId: string): boolean {
  const id = resolveDexId(queryId);
  return id != null && PILOT_IDS.has(id);
}
