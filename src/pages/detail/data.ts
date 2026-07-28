/* Detail-page data helpers — type matchups, version groups, species extras.
 * Page-local only (density-addendum §5); shared lib files are untouched. */
import { cachedJson } from '@/lib/pokeapi';
import i18n from '@/i18n';
import { nameOfItem, nameOfType, type Lang } from '@/lib/i18n-data';
import type { EvolutionDetail, NamedAPIResource, PokemonSpecies, PokemonType } from '@/lib/types';
import { POKEMON_TYPES, TYPE_COLORS } from '@/lib/types';

/* ---------- species payload extras (present at runtime, absent from shared type) ---------- */

export interface SpeciesExtras {
  capture_rate?: number;
  base_happiness?: number;
  hatch_counter?: number;
  gender_rate?: number; // -1 = genderless, else eighths female
  growth_rate?: NamedAPIResource;
  egg_groups?: NamedAPIResource[];
}

export function speciesExtras(s: PokemonSpecies | null): SpeciesExtras {
  return (s ?? {}) as PokemonSpecies & SpeciesExtras;
}

/* ---------- ability details (lazy one-line descriptions) ---------- */

interface AbilityPayload {
  name: string;
  effect_entries: Array<{ short_effect: string; language: NamedAPIResource }>;
  flavor_text_entries?: Array<{ flavor_text: string; language: NamedAPIResource }>;
}

export function getAbilityShort(name: string, lang: Lang = 'en'): Promise<string> {
  return cachedJson<AbilityPayload>(`ability:${name}`, `https://pokeapi.co/api/v2/ability/${name}`).then((a) => {
    // de: PokéAPI ships localized flavor_text_entries (short in-game text) for most
    // abilities — the long effect_entries stay en-only (documented data limitation)
    if (lang === 'de') {
      const fl = a.flavor_text_entries?.filter((f) => f.language.name === 'de').pop();
      if (fl) return fl.flavor_text.replace(/[\f\n\r]+/g, ' ');
    }
    const en = a.effect_entries.find((e) => e.language.name === 'en');
    if (en) return en.short_effect;
    const fl = a.flavor_text_entries?.filter((f) => f.language.name === 'en').pop();
    return fl ? fl.flavor_text.replace(/[\f\n\r]+/g, ' ') : '';
  });
}

/* ---------- version groups (move pool picker, newest → oldest) ---------- */

export interface VersionGroup {
  key: string;
  label: string;
}

export const VERSION_GROUPS: VersionGroup[] = [
  { key: 'scarlet-violet', label: 'Scarlet / Violet' },
  { key: 'sword-shield', label: 'Sword / Shield' },
  { key: 'ultra-sun-ultra-moon', label: 'Ultra Sun / Moon' },
  { key: 'sun-moon', label: 'Sun / Moon' },
  { key: 'omega-ruby-alpha-sapphire', label: 'Omega Ruby / Alpha Sapph.' },
  { key: 'x-y', label: 'X / Y' },
  { key: 'black-2-white-2', label: 'Black 2 / White 2' },
  { key: 'black-white', label: 'Black / White' },
  { key: 'heartgold-soulsilver', label: 'HeartGold / SoulSilver' },
  { key: 'platinum', label: 'Platinum' },
  { key: 'diamond-pearl', label: 'Diamond / Pearl' },
  { key: 'emerald', label: 'Emerald' },
  { key: 'firered-leafgreen', label: 'FireRed / LeafGreen' },
  { key: 'ruby-sapphire', label: 'Ruby / Sapphire' },
  { key: 'crystal', label: 'Crystal' },
  { key: 'gold-silver', label: 'Gold / Silver' },
  { key: 'yellow', label: 'Yellow' },
  { key: 'red-blue', label: 'Red / Blue' },
];

/* ---------- defensive type chart (attacking → defending multipliers) ---------- */

const CHART: Record<PokemonType, Partial<Record<PokemonType, number>>> = {
  normal: { rock: 0.5, ghost: 0, steel: 0.5 },
  fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
  water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
  grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
  ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
  fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
  poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
  ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
  flying: { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug: { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
  rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
  ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0 },
  dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
  fairy: { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 },
};

export interface Matchups {
  weak: PokemonType[]; // ×2 (but less than ×4)
  quad: PokemonType[]; // ×4 double weakness (dual types multiply)
  resist: PokemonType[]; // ×0.5 (but better than ×0.25)
  quarter: PokemonType[]; // ×0.25 double resist
  immune: PokemonType[]; // ×0
}

export function computeMatchups(defending: string[]): Matchups {
  const weak: PokemonType[] = [];
  const quad: PokemonType[] = [];
  const resist: PokemonType[] = [];
  const quarter: PokemonType[] = [];
  const immune: PokemonType[] = [];
  for (const atk of POKEMON_TYPES) {
    let mult = 1;
    for (const def of defending) {
      mult *= CHART[atk][def as PokemonType] ?? 1;
    }
    if (mult === 0) immune.push(atk);
    else if (mult >= 4) quad.push(atk);
    else if (mult >= 2) weak.push(atk);
    else if (mult <= 0.25) quarter.push(atk);
    else if (mult < 1) resist.push(atk);
  }
  return { weak, quad, resist, quarter, immune };
}

/* ---------- evolution condition formatting ---------- */

const ITEMS_BASE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items';

export interface EvoCondition {
  /** short chip label, e.g. "LV 16" */
  label: string;
  /** optional item sprite url */
  itemIcon?: string;
}

function titleCase(slug: string): string {
  return slug
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');
}

/** Condense PokéAPI evolution_details into one compact chip (first alternative).
 * Labels are localized (item/type names via the de artifact, connective words
 * via detail.evo.* keys); slugs in the data model stay English. */
export function evoCondition(details: EvolutionDetail[], lang: Lang = 'en'): EvoCondition {
  const t = (key: string, opts?: Record<string, unknown>) => i18n.t(key, { lng: lang, ...opts });
  if (!details.length) return { label: '—' };
  const d = details[0];
  const parts: string[] = [];
  let itemIcon: string | undefined;

  if (d.item) {
    parts.push(nameOfItem(d.item.name, lang));
    itemIcon = `${ITEMS_BASE}/${d.item.name}.png`;
  }
  if (d.trigger.name === 'trade') parts.push(t('detail.evo.trade'));
  if (d.trigger.name === 'use-item' && !d.item) parts.push(t('detail.evo.useItem'));
  if (d.min_happiness != null && d.trigger.name !== 'trade') parts.push(t('detail.evo.friendship'));
  if (d.min_affection != null) parts.push(t('detail.evo.affection'));
  if (d.known_move_type)
    parts.push(t('detail.evo.typedMove', { type: nameOfType(d.known_move_type.name, lang) }));
  if (d.min_level != null) parts.push(t('detail.evo.level', { level: d.min_level }));
  if (d.time_of_day) parts.push(t(`detail.evo.${d.time_of_day === 'night' ? 'night' : 'day'}`));
  if (d.trigger.name === 'shed') parts.push(t('detail.evo.shed'));
  /* EP4.2 — remaining condition dimensions */
  if (d.held_item) {
    parts.push(t('detail.evo.heldItem', { item: nameOfItem(d.held_item.name, lang) }));
    if (!itemIcon) itemIcon = `${ITEMS_BASE}/${d.held_item.name}.png`;
  }
  if (d.known_move) parts.push(t('detail.evo.knownMove', { move: titleCase(d.known_move.name) }));
  if (d.min_beauty != null) parts.push(t('detail.evo.beauty'));
  if (d.location) parts.push(t('detail.evo.location', { location: titleCase(d.location.name) }));
  if (d.gender != null) parts.push(t(d.gender === 1 ? 'detail.evo.female' : 'detail.evo.male'));
  if (d.needs_overworld_rain) parts.push(t('detail.evo.rain'));
  if (d.party_species) parts.push(t('detail.evo.partySpecies', { name: titleCase(d.party_species.name) }));
  if (d.party_type) parts.push(t('detail.evo.partyType', { type: nameOfType(d.party_type.name, lang) }));
  if (d.relative_physical_stats != null && d.relative_physical_stats !== 0)
    parts.push(t(d.relative_physical_stats > 0 ? 'detail.evo.atkGtDef' : 'detail.evo.atkLtDef'));
  if (d.trade_species) parts.push(t('detail.evo.tradeSpecies', { name: titleCase(d.trade_species.name) }));
  if (d.turn_upside_down) parts.push(t('detail.evo.upsideDown'));
  // rare triggers (spin, tower-of-darkness, …) fall back to the English slug label
  if (!parts.length) parts.push(titleCase(d.trigger.name));
  return { label: parts.join(' · '), itemIcon };
}

/* ---------- misc ---------- */

export function typeRgb(type: string): string {
  return TYPE_COLORS[type as PokemonType]?.rgb ?? '169,176,181';
}

/* locale-aware decimal (de: "0,7 m" · en: "0.7 m") */
const NF1 = {
  en: new Intl.NumberFormat('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
  de: new Intl.NumberFormat('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
};

const NF01 = {
  en: new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }),
  de: new Intl.NumberFormat('de-DE', { maximumFractionDigits: 1 }),
};

export function formatHeight(dm: number, lang: Lang = 'en'): string {
  return `${NF1[lang].format(dm / 10)} m`;
}

export function formatWeight(hg: number, lang: Lang = 'en'): string {
  return `${NF1[lang].format(hg / 10)} kg`;
}

export function genderLabel(rate: number | undefined, lang: Lang = 'en'): string {
  if (rate == null) return '—';
  if (rate < 0) return i18n.t('detail.side.genderless', { lng: lang });
  const female = (rate / 8) * 100;
  const pct = (v: number) => `${NF01[lang].format(v)} %`;
  return `${pct(100 - female)} ♂ · ${pct(female)} ♀`;
}
