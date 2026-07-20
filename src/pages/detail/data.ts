/* Detail-page data helpers — type matchups, version groups, species extras.
 * Page-local only (density-addendum §5); shared lib files are untouched. */
import { cachedJson } from '@/lib/pokeapi';
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

export function getAbilityShort(name: string): Promise<string> {
  return cachedJson<AbilityPayload>(`ability:${name}`, `https://pokeapi.co/api/v2/ability/${name}`).then((a) => {
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
  weak: PokemonType[]; // ×2 or worse
  resist: PokemonType[]; // ×0.5 or better (but > 0)
  immune: PokemonType[]; // ×0
}

export function computeMatchups(defending: string[]): Matchups {
  const weak: PokemonType[] = [];
  const resist: PokemonType[] = [];
  const immune: PokemonType[] = [];
  for (const atk of POKEMON_TYPES) {
    let mult = 1;
    for (const def of defending) {
      mult *= CHART[atk][def as PokemonType] ?? 1;
    }
    if (mult === 0) immune.push(atk);
    else if (mult >= 2) weak.push(atk);
    else if (mult < 1) resist.push(atk);
  }
  return { weak, resist, immune };
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

/** Condense PokéAPI evolution_details into one compact chip (first alternative). */
export function evoCondition(details: EvolutionDetail[]): EvoCondition {
  if (!details.length) return { label: '—' };
  const d = details[0];
  const parts: string[] = [];
  let itemIcon: string | undefined;

  if (d.item) {
    parts.push(titleCase(d.item.name));
    itemIcon = `${ITEMS_BASE}/${d.item.name}.png`;
  }
  if (d.trigger.name === 'trade') parts.push('Trade');
  if (d.trigger.name === 'use-item' && !d.item) parts.push('Use item');
  if (d.min_happiness != null && d.trigger.name !== 'trade') parts.push('High friendship');
  if (d.min_affection != null) parts.push('Affection');
  if (d.known_move_type) parts.push(`${titleCase(d.known_move_type.name)} move`);
  if (d.min_level != null) parts.push(`Lv ${d.min_level}`);
  if (d.time_of_day) parts.push(`(${d.time_of_day})`);
  if (d.trigger.name === 'shed') parts.push('Shed');
  if (!parts.length) parts.push(titleCase(d.trigger.name));
  return { label: parts.join(' · '), itemIcon };
}

/* ---------- misc ---------- */

export function typeRgb(type: string): string {
  return TYPE_COLORS[type as PokemonType]?.rgb ?? '169,176,181';
}

export function formatHeight(dm: number): string {
  return `${(dm / 10).toFixed(1)} m`;
}

export function formatWeight(hg: number): string {
  return `${(hg / 10).toFixed(1)} kg`;
}

export function genderLabel(rate: number | undefined): string {
  if (rate == null) return '—';
  if (rate < 0) return 'Genderless';
  const female = (rate / 8) * 100;
  return `${100 - female}% ♂ · ${female}% ♀`;
}
