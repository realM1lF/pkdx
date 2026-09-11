/* Server-side Dex lookup for the GPT-Live demo.
 * Resolves DE/EN names to the English slug, then reads gen-correct stats
 * from @pkmn/data (same source as the detail page). Gen I Special is the
 * single Special stat — not modern Sp. Atk. */
import pokemonDeJson from '@/data/i18n/de/pokemon.json';
import searchIndexJson from '@/data/i18n/de/search-index.json';
import slugsJson from '@/data/pokemon-slugs.json';
import { bstOf, genSpecies, genStatsOf, genTypesOf, statKeysForGen } from '@/lib/gen-dex';
import { displayName } from '@/lib/pokeapi';
import { VERSION_GROUPS, versionGroupById } from '@/lib/version-groups';
import type { StatKey } from '@/lib/types';

const SLUGS = slugsJson as string[];
const POKEMON_DE = pokemonDeJson as Record<string, { slug: string; name: string; genus: string }>;
const SEARCH_DE = (searchIndexJson as { pokemon: Record<string, number> }).pokemon;

export interface SpeciesHit {
  id: number;
  slug: string;
  nameEn: string;
  nameDe: string;
}

export interface GameHit {
  query: string;
  versionGroup: string;
  gen: number;
  label: string;
  games: string[];
}

export type SpeciesStatsOk = {
  ok: true;
  species: SpeciesHit;
  game: GameHit;
  types: string[];
  bst: number;
  stats: Record<string, number>;
  semantics: {
    generation: number;
    special_is_unified: boolean;
    attack_speed_means: 'speed';
    note: string;
  };
};

export type SpeciesStatsErr = {
  ok: false;
  error: 'unknown_species' | 'unknown_game' | 'not_in_game' | 'invalid_arguments';
  message: string;
  species?: SpeciesHit;
  game?: GameHit;
};

export type SpeciesStatsResult = SpeciesStatsOk | SpeciesStatsErr;

const ZERO: Record<StatKey, number> = {
  hp: 0,
  attack: 0,
  defense: 0,
  'special-attack': 0,
  'special-defense': 0,
  speed: 0,
};

const GAME_ALIASES: Record<string, string> = {
  red: 'red-blue',
  rot: 'red-blue',
  rote: 'red-blue',
  roten: 'red-blue',
  roter: 'red-blue',
  'rote edition': 'red-blue',
  'roter edition': 'red-blue',
  'roten edition': 'red-blue',
  'pokemon rot': 'red-blue',
  'pokemon red': 'red-blue',
  'red edition': 'red-blue',
  'red version': 'red-blue',
  rb: 'red-blue',
  rby: 'red-blue',
  'red-blue': 'red-blue',
  'red blue': 'red-blue',
  'gen 1': 'red-blue',
  gen1: 'red-blue',
  'generation 1': 'red-blue',
  'generation i': 'red-blue',
  kanto: 'red-blue',
  blue: 'red-blue',
  blau: 'red-blue',
  'blaue edition': 'red-blue',
  'blue edition': 'red-blue',
  yellow: 'yellow',
  gelb: 'yellow',
  'gelbe edition': 'yellow',
  'yellow edition': 'yellow',
  gold: 'gold-silver',
  goldene: 'gold-silver',
  silver: 'gold-silver',
  silber: 'gold-silver',
  gs: 'gold-silver',
  gsc: 'gold-silver',
  crystal: 'crystal',
  kristall: 'crystal',
  ruby: 'ruby-sapphire',
  rubin: 'ruby-sapphire',
  sapphire: 'ruby-sapphire',
  saphir: 'ruby-sapphire',
  rs: 'ruby-sapphire',
  rse: 'ruby-sapphire',
  emerald: 'emerald',
  smaragd: 'emerald',
  firered: 'firered-leafgreen',
  feuerrot: 'firered-leafgreen',
  'feuerrote edition': 'firered-leafgreen',
  leafgreen: 'firered-leafgreen',
  'blattgrun': 'firered-leafgreen',
  blattgruen: 'firered-leafgreen',
  frlg: 'firered-leafgreen',
  colosseum: 'colosseum',
  xd: 'xd',
  diamond: 'diamond-pearl',
  diamant: 'diamond-pearl',
  pearl: 'diamond-pearl',
  perl: 'diamond-pearl',
  dp: 'diamond-pearl',
  platinum: 'platinum',
  platin: 'platinum',
  heartgold: 'heartgold-soulsilver',
  soulsilver: 'heartgold-soulsilver',
  hgss: 'heartgold-soulsilver',
  black: 'black-white',
  schwarz: 'black-white',
  white: 'black-white',
  weiss: 'black-white',
  bw: 'black-white',
  'black 2': 'black-2-white-2',
  'white 2': 'black-2-white-2',
  'schwarz 2': 'black-2-white-2',
  'weiss 2': 'black-2-white-2',
  b2w2: 'black-2-white-2',
  x: 'x-y',
  y: 'x-y',
  xy: 'x-y',
  'omega ruby': 'omega-ruby-alpha-sapphire',
  'omega rubin': 'omega-ruby-alpha-sapphire',
  'alpha sapphire': 'omega-ruby-alpha-sapphire',
  'alpha saphir': 'omega-ruby-alpha-sapphire',
  oras: 'omega-ruby-alpha-sapphire',
  sun: 'sun-moon',
  sonne: 'sun-moon',
  moon: 'sun-moon',
  mond: 'sun-moon',
  sm: 'sun-moon',
  'ultra sun': 'ultra-sun-ultra-moon',
  ultrasonne: 'ultra-sun-ultra-moon',
  'ultra moon': 'ultra-sun-ultra-moon',
  ultramond: 'ultra-sun-ultra-moon',
  usum: 'ultra-sun-ultra-moon',
  'lets go': 'lets-go-pikachu-eevee',
  lgpe: 'lets-go-pikachu-eevee',
  sword: 'sword-shield',
  schwert: 'sword-shield',
  shield: 'sword-shield',
  schild: 'sword-shield',
  swsh: 'sword-shield',
  'brilliant diamond': 'brilliant-diamond-shining-pearl',
  'shining pearl': 'brilliant-diamond-shining-pearl',
  bdsp: 'brilliant-diamond-shining-pearl',
  'legends arceus': 'legends-arceus',
  arceus: 'legends-arceus',
  scarlet: 'scarlet-violet',
  karmesin: 'scarlet-violet',
  violet: 'scarlet-violet',
  purpur: 'scarlet-violet',
  sv: 'scarlet-violet',
};

function fold(raw: string): string {
  return raw
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/ß/g, 'ss')
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/pokemon|pokémon|edition|version|spiel/g, ' ')
    .replace(/\b(in|der|die|das|dem|den|einer|eine|einem|the|of|a|an)\b/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function slugify(raw: string): string {
  return fold(raw).replace(/\s+/g, '-');
}

function entryForId(id: number): SpeciesHit | null {
  if (!Number.isInteger(id) || id < 1 || id > SLUGS.length) return null;
  const slug = SLUGS[id - 1];
  if (!slug) return null;
  return {
    id,
    slug,
    nameEn: displayName(slug),
    nameDe: POKEMON_DE[String(id)]?.name ?? displayName(slug),
  };
}

export function resolveSpecies(query: string): SpeciesHit | null {
  const raw = query.trim();
  if (!raw) return null;

  const asNum = Number(raw.replace(/^#/, ''));
  if (Number.isInteger(asNum)) {
    const hit = entryForId(asNum);
    if (hit) return hit;
  }

  const folded = fold(raw);
  const slugged = slugify(raw);

  const deId = SEARCH_DE[folded] ?? SEARCH_DE[raw.toLowerCase()] ?? SEARCH_DE[slugged];
  if (deId) return entryForId(deId);

  const slugIdx = SLUGS.indexOf(slugged);
  if (slugIdx >= 0) return entryForId(slugIdx + 1);

  for (const [id, row] of Object.entries(POKEMON_DE)) {
    if (fold(row.name) === folded) return entryForId(Number(id));
  }

  for (let i = 0; i < SLUGS.length; i++) {
    const slug = SLUGS[i];
    if (fold(slug) === folded || fold(displayName(slug)) === folded) {
      return entryForId(i + 1);
    }
  }

  return null;
}

export function resolveGame(query: string): GameHit | null {
  const raw = query.trim();
  if (!raw) return null;
  const folded = fold(raw);
  const slugged = slugify(raw);

  const vgId = GAME_ALIASES[folded] ?? GAME_ALIASES[slugged];
  if (vgId) {
    const vg = versionGroupById(vgId);
    return { query: raw, versionGroup: vg.id, gen: vg.gen, label: vg.label, games: vg.games };
  }

  const byId = VERSION_GROUPS.find((v) => v.id === slugged || fold(v.id) === folded);
  if (byId) {
    return { query: raw, versionGroup: byId.id, gen: byId.gen, label: byId.label, games: byId.games };
  }

  for (const vg of VERSION_GROUPS) {
    if (vg.games.some((g) => fold(g) === folded || slugify(g) === slugged)) {
      return { query: raw, versionGroup: vg.id, gen: vg.gen, label: vg.label, games: vg.games };
    }
  }

  return null;
}

function publicStats(block: Record<StatKey, number>, gen: number): Record<string, number> {
  const keys = statKeysForGen(gen);
  const out: Record<string, number> = {};
  for (const key of keys) {
    if (gen < 2 && key === 'special-attack') out.special = block[key];
    else if (key === 'special-attack') out.special_attack = block[key];
    else if (key === 'special-defense') out.special_defense = block[key];
    else out[key] = block[key];
  }
  return out;
}

function gen1Note(): string {
  return [
    'Generation I has HP, Attack, Defense, Special and Speed.',
    'There is no Attack Speed stat; that phrase means Speed (initiative).',
    'Special is a single stat, not the later Sp. Atk / Sp. Def split.',
  ].join(' ');
}

function modernNote(): string {
  return [
    'This edition uses six stats: HP, Attack, Defense, Sp. Atk, Sp. Def, Speed.',
    'Colloquial Attack Speed maps to Speed (initiative), not Attack.',
  ].join(' ');
}

export function getSpeciesStats(speciesQuery: string, gameQuery: string): SpeciesStatsResult {
  const species = resolveSpecies(speciesQuery);
  if (!species) {
    return {
      ok: false,
      error: 'unknown_species',
      message: `No species matched "${speciesQuery.trim()}". Use a German or English Pokédex name or a national-dex number.`,
    };
  }

  const game = resolveGame(gameQuery);
  if (!game) {
    return {
      ok: false,
      error: 'unknown_game',
      message: `No game matched "${gameQuery.trim()}". Try red, blue, yellow, firered, or another version-group name.`,
      species,
    };
  }

  if (!genSpecies(game.versionGroup, species.slug)?.exists) {
    return {
      ok: false,
      error: 'not_in_game',
      message: `${species.nameEn} / ${species.nameDe} is not in ${game.label} (Gen ${game.gen}).`,
      species,
      game,
    };
  }

  const block = genStatsOf(game.versionGroup, species.slug, ZERO);
  const types = genTypesOf(game.versionGroup, species.slug, []);
  const gen = game.gen;

  return {
    ok: true,
    species,
    game,
    types,
    bst: bstOf(block, gen),
    stats: publicStats(block, gen),
    semantics: {
      generation: gen,
      special_is_unified: gen < 2,
      attack_speed_means: 'speed',
      note: gen < 2 ? gen1Note() : modernNote(),
    },
  };
}

export function getSpeciesStatsFromArgs(args: unknown): SpeciesStatsResult {
  if (!args || typeof args !== 'object') {
    return { ok: false, error: 'invalid_arguments', message: 'Expected an object with species_query and game.' };
  }
  const rec = args as Record<string, unknown>;
  const speciesQuery = typeof rec.species_query === 'string' ? rec.species_query : '';
  const gameQuery = typeof rec.game === 'string' ? rec.game : '';
  if (!speciesQuery.trim() || !gameQuery.trim()) {
    return { ok: false, error: 'invalid_arguments', message: 'species_query and game are required strings.' };
  }
  return getSpeciesStats(speciesQuery, gameQuery);
}
