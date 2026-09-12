/** Map get_species_stats tool JSON onto the detail-page GenStatBlock. */
import type { GenStatBlock } from '@/lib/gen-dex';
import { POKEMON_TYPES, type PokemonType } from '@/lib/types';

const TYPE_SET = new Set<string>(POKEMON_TYPES);

export interface SpeciesStatsView {
  id: number;
  slug: string;
  nameEn: string;
  nameDe: string;
  types: PokemonType[];
  gen: number;
  gameLabel: string;
  bst: number;
  block: GenStatBlock;
}

function num(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

function asTypes(raw: unknown): PokemonType[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((row): row is PokemonType => typeof row === 'string' && TYPE_SET.has(row));
}

export function speciesStatsViewFromTool(result: unknown): SpeciesStatsView | null {
  if (!result || typeof result !== 'object') return null;
  const rec = result as Record<string, unknown>;
  if (rec.ok !== true) return null;
  const species = rec.species as Record<string, unknown> | undefined;
  const game = rec.game as Record<string, unknown> | undefined;
  const stats = rec.stats as Record<string, unknown> | undefined;
  if (!species || !game || !stats) return null;
  const id = num(species.id);
  const slug = typeof species.slug === 'string' ? species.slug : '';
  const gen = num(game.gen);
  if (!id || !slug || !gen) return null;

  const special = num(stats.special) || num(stats.special_attack);
  const block: GenStatBlock = {
    hp: num(stats.hp),
    attack: num(stats.attack),
    defense: num(stats.defense),
    'special-attack': special,
    'special-defense': num(stats.special_defense) || (gen < 2 ? special : 0),
    speed: num(stats.speed),
  };

  return {
    id,
    slug,
    nameEn: typeof species.nameEn === 'string' ? species.nameEn : slug,
    nameDe: typeof species.nameDe === 'string' ? species.nameDe : slug,
    types: asTypes(rec.types),
    gen,
    gameLabel: typeof game.label === 'string' ? game.label : '',
    bst: num(rec.bst),
    block,
  };
}
