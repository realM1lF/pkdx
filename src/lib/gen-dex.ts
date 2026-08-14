/* Gen-correct species / move facts from @pkmn/dex.
 * Lightweight: no teambuilder, no versus, no supabase.
 * Overview detail page and Versus both read this so one edition
 * cannot show SV types next to an FRLG learnset. */
import { Generations } from '@pkmn/data';
import { Dex } from '@pkmn/dex';
import type { Specie } from '@pkmn/data';
import { displayName } from './pokeapi';
import type { PokemonType, StatKey } from './types';
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
  'lets-go-pikachu-eevee': { abilities: false, items: false },
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

export interface GenMoveMeta {
  type: string;
  category: 'physical' | 'special' | 'status';
  power: number | null;
  accuracy: number | null;
  pp: number | null;
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
