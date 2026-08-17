/* Gen-correct species / move facts from @pkmn/dex.
 * Lightweight: no teambuilder, no versus, no supabase.
 * Overview detail page and Versus both read this so one edition
 * cannot show SV types next to an FRLG learnset. */
import { Generations } from '@pkmn/data';
import { Dex } from '@pkmn/dex';
import type { Specie } from '@pkmn/data';
import { displayName } from './pokeapi';
import type { PokemonType, StatKey } from './types';
import { STAT_LABELS, STAT_ORDER } from './types';
import { versionGroupById } from './version-groups';

const gens = new Generations(Dex);

export function genFor(vgId: string) {
  return gens.get(versionGroupById(vgId).gen);
}

export function genSpecies(vgId: string, nameOrSlug: string | null | undefined): Specie | undefined {
  if (!nameOrSlug) return undefined;
  const gen = genFor(vgId);
  const direct = gen.species.get(nameOrSlug);
  if (direct?.exists) return direct;
  const byDisplay = gen.species.get(displayName(nameOrSlug));
  if (byDisplay?.exists) return byDisplay;
  return undefined;
}

export function genTypesOf(vgId: string, nameOrSlug: string, fallback: PokemonType[]): PokemonType[] {
  const sp = genSpecies(vgId, nameOrSlug);
  if (sp?.exists && sp.types.length) return sp.types.map((t) => t.toLowerCase() as PokemonType);
  return fallback;
}

/** Party / box chips: same as genTypesOf, named for Nuzlocke callers. */
export function typesForPartyMon(vgId: string, nameOrSlug: string, fallback: PokemonType[]): PokemonType[] {
  return genTypesOf(vgId, nameOrSlug, fallback);
}

export function genAbilitiesOf(vgId: string, nameOrSlug: string | null | undefined): string[] {
  return genAbilityRows(vgId, nameOrSlug ?? '').map((a) => displayName(a.slug));
}

const MECHANICS_OVERRIDES: Partial<Record<string, Partial<Record<'abilities' | 'items' | 'natures' | 'evs', boolean>>>> = {
  'lets-go-pikachu-eevee': { abilities: false, items: false, evs: false },
  'legends-arceus': { abilities: false, items: false },
};

export function genHasMechanics(vgId: string): { abilities: boolean; items: boolean; natures: boolean; evs: boolean } {
  const g = versionGroupById(vgId).gen;
  const base = { abilities: g >= 3, items: g >= 2, natures: g >= 3, evs: g >= 3 };
  return { ...base, ...MECHANICS_OVERRIDES[vgId] };
}

function abilitySlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function genAbilityRows(vgId: string, nameOrSlug: string): Array<{ slug: string; hidden: boolean }> {
  if (!genHasMechanics(vgId).abilities) return [];
  const sp = genSpecies(vgId, nameOrSlug);
  if (!sp?.exists) return [];
  const rows: Array<{ slug: string; hidden: boolean }> = [];
  if (sp.abilities[0]) rows.push({ slug: abilitySlug(String(sp.abilities[0])), hidden: false });
  if (sp.abilities[1]) rows.push({ slug: abilitySlug(String(sp.abilities[1])), hidden: false });
  if (sp.abilities.H) rows.push({ slug: abilitySlug(String(sp.abilities.H)), hidden: true });
  return rows;
}

export type GenStatBlock = Record<StatKey, number>;

/** Gen 1 has one Special stat. Encyclopedias count it once (BST 590 for Mewtwo, not 744). */
const GEN1_STAT_ORDER: readonly StatKey[] = ['hp', 'attack', 'defense', 'special-attack', 'speed'];

export function statKeysForGen(gen: number): readonly StatKey[] {
  return gen < 2 ? GEN1_STAT_ORDER : STAT_ORDER;
}

export function statLabelForGen(key: StatKey, gen: number): string {
  if (gen < 2 && key === 'special-attack') return 'SPC';
  return STAT_LABELS[key];
}

/** Display BST: Gen 1 sums five stats; Gen 2+ sums all six. */
export function bstOf(block: GenStatBlock, gen: number): number {
  return statKeysForGen(gen).reduce((sum, k) => sum + block[k], 0);
}

export function genStatsOf(vgId: string, nameOrSlug: string, fallback: GenStatBlock): GenStatBlock {
  const sp = genSpecies(vgId, nameOrSlug);
  if (!sp?.exists) return fallback;
  const b = sp.baseStats;
  return {
    hp: b.hp,
    attack: b.atk,
    defense: b.def,
    'special-attack': b.spa,
    'special-defense': b.spd,
    speed: b.spe,
  };
}

/** True when @pkmn has no species for this edition, so stats/types use PokéAPI. */
export function usedApiStatFallback(vgId: string, nameOrSlug: string): boolean {
  return !genSpecies(vgId, nameOrSlug)?.exists;
}

export interface GenMoveMeta {
  type: string;
  category: 'physical' | 'special' | 'status';
  power: number | null;
  accuracy: number | null;
  pp: number | null;
}

/** Battle-power shown in Versus slots: gen-correct when a VG is set. */
export function movePowerForDisplay(
  vgId: string | undefined,
  slug: string,
  apiPower?: number | null,
): number | null {
  if (vgId) {
    const gen = genMoveOf(vgId, slug);
    if (gen) return gen.power;
  }
  return apiPower && apiPower > 0 ? apiPower : null;
}

type ApiMoveBits = {
  type: { name: string };
  damage_class: { name: string };
  power: number | null;
  accuracy: number | null;
  pp: number | null;
};

const UNKNOWN_MOVE_META: GenMoveMeta & { ready: boolean } = {
  type: '',
  category: 'status',
  power: null,
  accuracy: null,
  pp: null,
  ready: true,
};

/**
 * Detail-table move row. If a version group is set, @pkmn wins; a miss
 * stays empty (never modern PokéAPI power/type/PP).
 */
export function moveMetaForDisplay(
  vgId: string | undefined,
  slug: string,
  api?: ApiMoveBits | null,
): GenMoveMeta & { ready: boolean } {
  if (vgId) {
    const gen = genMoveOf(vgId, slug);
    if (gen) return { ...gen, ready: true };
    return UNKNOWN_MOVE_META;
  }
  if (!api) {
    return { type: 'normal', category: 'status', power: null, accuracy: null, pp: null, ready: false };
  }
  const cat = api.damage_class.name;
  return {
    type: api.type.name,
    category: cat === 'physical' || cat === 'special' ? cat : 'status',
    power: api.power,
    accuracy: api.accuracy,
    pp: api.pp,
    ready: true,
  };
}

export function genMoveOf(vgId: string, slug: string): GenMoveMeta | null {
  const gen = genFor(vgId);
  const mv = gen.moves.get(slug) ?? gen.moves.get(displayName(slug));
  if (!mv?.exists) return null;
  const cat = String(mv.category).toLowerCase();
  const acc = mv.accuracy;
  return {
    type: String(mv.type).toLowerCase(),
    category: cat === 'physical' || cat === 'special' ? cat : 'status',
    power: mv.basePower > 0 ? mv.basePower : null,
    accuracy: acc === true ? 100 : typeof acc === 'number' ? acc : null,
    pp: mv.pp ?? null,
  };
}

export function statsFromPokemon(p: { stats: Array<{ base_stat: number; stat: { name: string } }> }): GenStatBlock {
  const pick = (k: StatKey) => p.stats.find((s) => s.stat.name === k)?.base_stat ?? 0;
  return {
    hp: pick('hp'),
    attack: pick('attack'),
    defense: pick('defense'),
    'special-attack': pick('special-attack'),
    'special-defense': pick('special-defense'),
    speed: pick('speed'),
  };
}
