/* Type SEO hub (SEO rollout) — slugs, display names and URL helpers for the
 * 18 type pages (/de/typen/:type · /en/types/:type).
 *
 * LIGHT BY DESIGN: no @pkmn/data imports here — src/lib/seo.ts (entry bundle)
 * consumes the slug maps for meta/canonical resolution. The matchup math
 * lives in the page components via src/lib/versus.ts (lazy route chunks).
 *
 * German display names match src/data/i18n/de/types.json (official game
 * terminology); duplicated inline so the sync meta registry can use them
 * without the async i18n artifacts. */

export const TYPE_SLUGS: Record<string, { de: string; en: string }> = {
  normal: { de: 'normal', en: 'normal' },
  fire: { de: 'feuer', en: 'fire' },
  water: { de: 'wasser', en: 'water' },
  electric: { de: 'elektro', en: 'electric' },
  grass: { de: 'pflanze', en: 'grass' },
  ice: { de: 'eis', en: 'ice' },
  fighting: { de: 'kampf', en: 'fighting' },
  poison: { de: 'gift', en: 'poison' },
  ground: { de: 'boden', en: 'ground' },
  flying: { de: 'flug', en: 'flying' },
  psychic: { de: 'psycho', en: 'psychic' },
  bug: { de: 'kafer', en: 'bug' },
  rock: { de: 'gestein', en: 'rock' },
  ghost: { de: 'geist', en: 'ghost' },
  dragon: { de: 'drache', en: 'dragon' },
  dark: { de: 'unlicht', en: 'dark' },
  steel: { de: 'stahl', en: 'steel' },
  fairy: { de: 'fee', en: 'fairy' },
};

export const TYPE_NAMES_DE: Record<string, string> = {
  normal: 'Normal',
  fire: 'Feuer',
  water: 'Wasser',
  electric: 'Elektro',
  grass: 'Pflanze',
  ice: 'Eis',
  fighting: 'Kampf',
  poison: 'Gift',
  ground: 'Boden',
  flying: 'Flug',
  psychic: 'Psycho',
  bug: 'Käfer',
  rock: 'Gestein',
  ghost: 'Geist',
  dragon: 'Drache',
  dark: 'Unlicht',
  steel: 'Stahl',
  fairy: 'Fee',
};

const TYPE_NAMES_EN: Record<string, string> = {
  normal: 'Normal',
  fire: 'Fire',
  water: 'Water',
  electric: 'Electric',
  grass: 'Grass',
  ice: 'Ice',
  fighting: 'Fighting',
  poison: 'Poison',
  ground: 'Ground',
  flying: 'Flying',
  psychic: 'Psychic',
  bug: 'Bug',
  rock: 'Rock',
  ghost: 'Ghost',
  dragon: 'Dragon',
  dark: 'Dark',
  steel: 'Steel',
  fairy: 'Fairy',
};

/** Sync display name (no async i18n artifact needed). */
export function typeName(slug: string, lang: 'de' | 'en'): string {
  return (lang === 'de' ? TYPE_NAMES_DE : TYPE_NAMES_EN)[slug] ?? slug;
}

/** Resolve a URL param ('wasser' | 'water' | 'kafer' | 'käfer' …) to a type slug. */
export function resolveTypeParam(param: string | undefined): string | null {
  if (!param) return null;
  const p = param.toLowerCase();
  for (const [slug, slugs] of Object.entries(TYPE_SLUGS)) {
    if (slugs.de === p || slugs.en === p) return slug;
  }
  if (p === 'käfer') return 'bug'; // umlaut variant of the DE slug
  return null;
}

/** Locale-aware path of a type detail page: /typen/wasser (de) · /types/water (en). */
export function typeDetailPath(lang: 'de' | 'en', slug: string): string {
  return lang === 'de' ? `/typen/${TYPE_SLUGS[slug].de}` : `/types/${TYPE_SLUGS[slug].en}`;
}

/** Locale-aware path of the type overview: /typen (de) · /types (en). */
export function typeOverviewPath(lang: 'de' | 'en'): string {
  return lang === 'de' ? '/typen' : '/types';
}

/**
 * Map a locale-stripped app path between locales (for canonical/hreflang):
 * '/typen/wasser' ↔ '/types/water'. Unknown paths pass through unchanged.
 */
export function localizeTypePath(rest: string, lang: 'de' | 'en'): string {
  if (rest === '/typen' || rest === '/types') return typeOverviewPath(lang);
  const m = rest.match(/^\/(typen|types)\/([^/]+)$/);
  if (m) {
    const slug = resolveTypeParam(m[2]);
    if (slug) return typeDetailPath(lang, slug);
  }
  return rest;
}
