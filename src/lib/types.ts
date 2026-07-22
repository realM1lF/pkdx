/* Pokédex 2.0 — shared types & constants (design.md §2.4, §10.1) */

export const POKEMON_TYPES = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground',
  'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
] as const;

export type PokemonType = (typeof POKEMON_TYPES)[number];

export interface TypeColor {
  /** hex base, e.g. #FF7A45 */
  base: string;
  /** "r,g,b" triplet for rgba() composition */
  rgb: string;
  /** gradient stop pair (design.md §2.4) */
  gradient: [string, string];
}

export const TYPE_COLORS: Record<PokemonType, TypeColor> = {
  normal: { base: '#A9B0B5', rgb: '169,176,181', gradient: ['#A9B0B5', '#6E7478'] },
  fire: { base: '#FF7A45', rgb: '255,122,69', gradient: ['#FF7A45', '#E8402A'] },
  water: { base: '#45C8FF', rgb: '69,200,255', gradient: ['#45C8FF', '#2A7FE8'] },
  electric: { base: '#FFD60A', rgb: '255,214,10', gradient: ['#FFD60A', '#F0A500'] },
  grass: { base: '#63D96B', rgb: '99,217,107', gradient: ['#63D96B', '#2FA85C'] },
  ice: { base: '#79E8E0', rgb: '121,232,224', gradient: ['#79E8E0', '#3FB8C8'] },
  fighting: { base: '#F4605E', rgb: '244,96,94', gradient: ['#F4605E', '#B03030'] },
  poison: { base: '#C77DFF', rgb: '199,125,255', gradient: ['#C77DFF', '#8B3FD9'] },
  ground: { base: '#DEB872', rgb: '222,184,114', gradient: ['#DEB872', '#A87838'] },
  flying: { base: '#A78BFA', rgb: '167,139,250', gradient: ['#A78BFA', '#6D5BD0'] },
  psychic: { base: '#FF5CA8', rgb: '255,92,168', gradient: ['#FF5CA8', '#D92A70'] },
  bug: { base: '#B4D94A', rgb: '180,217,74', gradient: ['#B4D94A', '#7FA020'] },
  rock: { base: '#CDBA80', rgb: '205,186,128', gradient: ['#CDBA80', '#8F7A48'] },
  ghost: { base: '#9D7FED', rgb: '157,127,237', gradient: ['#9D7FED', '#5B3FB8'] },
  dragon: { base: '#8C6FFF', rgb: '140,111,255', gradient: ['#8C6FFF', '#5A2FE0'] },
  dark: { base: '#A08CB8', rgb: '160,140,184', gradient: ['#A08CB8', '#5C4A70'] },
  steel: { base: '#9FB3C8', rgb: '159,179,200', gradient: ['#9FB3C8', '#5E7488'] },
  fairy: { base: '#FF9AD5', rgb: '255,154,213', gradient: ['#FF9AD5', '#E05CA0'] },
};

/* ---------- Generations (§10.1) ---------- */

export interface GenerationInfo {
  gen: number; // 1..9
  roman: string;
  region: string;
  year: number;
  range: [number, number]; // national dex ids, inclusive
  starters: [number, number, number]; // grass, fire, water
}

export const GENERATIONS: GenerationInfo[] = [
  { gen: 1, roman: 'I', region: 'Kanto', year: 1996, range: [1, 151], starters: [1, 4, 7] },
  { gen: 2, roman: 'II', region: 'Johto', year: 1999, range: [152, 251], starters: [152, 155, 158] },
  { gen: 3, roman: 'III', region: 'Hoenn', year: 2002, range: [252, 386], starters: [252, 255, 258] },
  { gen: 4, roman: 'IV', region: 'Sinnoh', year: 2006, range: [387, 493], starters: [387, 390, 393] },
  { gen: 5, roman: 'V', region: 'Unova', year: 2010, range: [494, 649], starters: [495, 498, 501] },
  { gen: 6, roman: 'VI', region: 'Kalos', year: 2013, range: [650, 721], starters: [650, 653, 656] },
  { gen: 7, roman: 'VII', region: 'Alola', year: 2016, range: [722, 809], starters: [722, 725, 728] },
  { gen: 8, roman: 'VIII', region: 'Galar / Hisui', year: 2019, range: [810, 905], starters: [810, 813, 816] },
  { gen: 9, roman: 'IX', region: 'Paldea', year: 2022, range: [906, 1025], starters: [906, 909, 912] },
];

export const MAX_DEX_ID = 1025;

export function genOf(id: number): GenerationInfo {
  for (const g of GENERATIONS) if (id >= g.range[0] && id <= g.range[1]) return g;
  return GENERATIONS[GENERATIONS.length - 1];
}

export function regionOf(id: number): string {
  return genOf(id).region;
}

/* ---------- Type exemplars (home page type-spectrum hover trios, ≤ 649 for Gen-V GIFs) ---------- */

export const TYPE_EXEMPLARS: Record<PokemonType, [number, number, number]> = {
  normal: [143, 113, 115],
  fire: [4, 5, 6],
  water: [7, 8, 9],
  electric: [25, 26, 135],
  grass: [1, 2, 3],
  ice: [124, 131, 144],
  fighting: [106, 107, 68],
  poison: [23, 24, 110],
  ground: [27, 28, 51],
  flying: [21, 22, 142],
  psychic: [63, 64, 150],
  bug: [10, 12, 15],
  rock: [74, 75, 76],
  ghost: [92, 93, 94],
  dragon: [147, 148, 149],
  dark: [197, 215, 229],
  steel: [208, 212, 227],
  fairy: [35, 39, 700], // Sylveon has no Gen-V GIF — Sprite falls back to static
};

/* ---------- PokéAPI payloads (§10.1) ---------- */

export interface NamedAPIResource {
  name: string;
  url: string;
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: NamedAPIResource;
}

export interface PokemonTypeSlot {
  slot: number;
  type: NamedAPIResource;
}

export interface PokemonAbility {
  ability: NamedAPIResource;
  is_hidden: boolean;
  slot: number;
}

export interface PokemonMoveSlot {
  move: NamedAPIResource;
  version_group_details: Array<{
    level_learned_at: number;
    move_learn_method: NamedAPIResource;
    version_group: NamedAPIResource;
  }>;
}

export interface PokemonCrySet {
  latest: string;
  legacy: string;
}

export interface Pokemon {
  id: number;
  name: string;
  height: number; // decimetres
  weight: number; // hectograms
  base_experience: number;
  stats: PokemonStat[];
  types: PokemonTypeSlot[];
  abilities: PokemonAbility[];
  moves: PokemonMoveSlot[];
  species: NamedAPIResource;
  sprites: {
    front_default: string | null;
    back_default: string | null;
    front_shiny: string | null;
    back_shiny: string | null;
  };
  cries?: PokemonCrySet;
}

export interface FlavorTextEntry {
  flavor_text: string;
  language: NamedAPIResource;
  version: NamedAPIResource;
}

export interface PokemonSpecies {
  id: number;
  name: string;
  genera: Array<{ genus: string; language: NamedAPIResource }>;
  flavor_text_entries: FlavorTextEntry[];
  is_legendary: boolean;
  is_mythical: boolean;
  evolution_chain: { url: string };
  generation: NamedAPIResource;
}

export interface EvolutionDetail {
  min_level: number | null;
  item: NamedAPIResource | null;
  trigger: NamedAPIResource;
  held_item: NamedAPIResource | null;
  time_of_day: string;
  min_happiness: number | null;
  min_affection: number | null;
  known_move_type: NamedAPIResource | null;
  location: NamedAPIResource | null;
  gender: number | null;
  /* EP4.2 — the remaining PokéAPI evolution_detail fields (all nullable) */
  known_move: NamedAPIResource | null;
  min_beauty: number | null;
  needs_overworld_rain: boolean;
  party_species: NamedAPIResource | null;
  party_type: NamedAPIResource | null;
  relative_physical_stats: number | null;
  trade_species: NamedAPIResource | null;
  turn_upside_down: boolean;
}

export interface ChainLink {
  species: NamedAPIResource;
  is_baby: boolean;
  evolution_details: EvolutionDetail[];
  evolves_to: ChainLink[];
}

export interface EvolutionChain {
  id: number;
  chain: ChainLink;
}

export interface Move {
  id: number;
  name: string;
  power: number | null;
  accuracy: number | null;
  pp: number | null;
  priority: number;
  type: NamedAPIResource;
  damage_class: NamedAPIResource; // physical | special | status
  effect_entries: Array<{ effect: string; short_effect: string; language: NamedAPIResource }>;
  flavor_text_entries?: FlavorTextEntry[];
}

/** Lightweight entry in the boot name index (search/autocomplete) */
export interface DexIndexEntry {
  id: number;
  name: string; // api slug, e.g. "mr-mime"
  label: string; // display name, e.g. "Mr. Mime"
  num: string; // padded "#025"
  gen: number;
}

export type StatKey = 'hp' | 'attack' | 'defense' | 'special-attack' | 'special-defense' | 'speed';

export const STAT_LABELS: Record<StatKey, string> = {
  hp: 'HP',
  attack: 'ATK',
  defense: 'DEF',
  'special-attack': 'SPA',
  'special-defense': 'SPD',
  speed: 'SPE',
};

export const STAT_ORDER: StatKey[] = ['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'];
