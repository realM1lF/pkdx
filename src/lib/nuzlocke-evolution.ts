/* Caught vs current species + evolution-chain helpers for Nuzlocke encounters. */
import { evolutionChainId, getEvolutionChain, getSpecies } from './pokeapi';
import type { NuzEncounterRow } from './supabase';
import type { ChainLink, EvolutionChain } from './types';

/** Backfill `caught_pokemon_id` for pre-evolution rows. */
export function normalizeEncounter(enc: NuzEncounterRow): NuzEncounterRow {
  const caught =
    typeof enc.caught_pokemon_id === 'number' && enc.caught_pokemon_id > 0
      ? enc.caught_pokemon_id
      : enc.pokemon_id;
  return { ...enc, caught_pokemon_id: caught };
}

export function normalizeEncounters(list: NuzEncounterRow[]): NuzEncounterRow[] {
  return list.map(normalizeEncounter);
}

/** Timeline / route history uses the original catch; team/box use current form. */
export function speciesIdFor(
  enc: Pick<NuzEncounterRow, 'pokemon_id' | 'caught_pokemon_id'>,
  surface: 'caught' | 'current',
): number {
  if (surface === 'caught') {
    return typeof enc.caught_pokemon_id === 'number' && enc.caught_pokemon_id > 0
      ? enc.caught_pokemon_id
      : enc.pokemon_id;
  }
  return enc.pokemon_id;
}

export function hasEvolved(enc: Pick<NuzEncounterRow, 'pokemon_id' | 'caught_pokemon_id'>): boolean {
  const caught = speciesIdFor(enc, 'caught');
  return caught !== enc.pokemon_id;
}

export function collectSpeciesIdsFromChain(link: ChainLink): number[] {
  const id = Number(link.species.url.replace(/\/$/, '').split('/').pop());
  if (!Number.isFinite(id) || id <= 0) {
    return link.evolves_to.flatMap(collectSpeciesIdsFromChain);
  }
  return [id, ...link.evolves_to.flatMap(collectSpeciesIdsFromChain)];
}

export function chainSpeciesIds(chain: EvolutionChain): number[] {
  return collectSpeciesIdsFromChain(chain.chain);
}

/** Target must share the catch's evolution family and differ from the current form. */
export function isValidEvolutionTarget(
  chainIds: number[],
  caughtId: number,
  currentId: number,
  toId: number,
): boolean {
  if (toId === currentId) return false;
  if (!chainIds.includes(caughtId) || !chainIds.includes(toId)) return false;
  return true;
}

export async function fetchEvolutionChainIds(pokemonId: number): Promise<number[]> {
  const species = await getSpecies(pokemonId);
  const chain = await getEvolutionChain(evolutionChainId(species));
  return chainSpeciesIds(chain);
}

/** pokemonId → full family ids (shared array for every member). */
const familyCache = new Map<number, number[]>();

/** Evolution family for Dupes Clause (Schiggy ↔ Schillok ↔ Turtok). Cached. */
export async function fetchEvolutionFamilyIds(pokemonId: number): Promise<number[]> {
  const hit = familyCache.get(pokemonId);
  if (hit) return hit;
  try {
    const ids = await fetchEvolutionChainIds(pokemonId);
    const family = ids.length > 0 ? ids : [pokemonId];
    for (const id of family) familyCache.set(id, family);
    return family;
  } catch {
    /* offline / unknown species — degrade to singleton so exact dupes still work */
    const singleton = [pokemonId];
    familyCache.set(pokemonId, singleton);
    return singleton;
  }
}

/** Test helper — seed cache without network. */
export function primeEvolutionFamilyCache(family: number[]): void {
  for (const id of family) familyCache.set(id, family);
}

/** Sync cache read (no network/await) — used by the Phase 1.3 dupes TOCTOU
 * re-scan (`findEvoLineDupeViolations` in nuzlocke-concurrency.ts), which
 * runs after `fetchEvolutionFamilyIds` has already resolved for the
 * triggering row and just needs to look up every other living row's family
 * without awaiting anything itself. Returns undefined on a cache miss —
 * callers degrade to a singleton family for that species. */
export function cachedEvolutionFamilyIds(pokemonId: number): number[] | undefined {
  return familyCache.get(pokemonId);
}

export function clearEvolutionFamilyCache(): void {
  familyCache.clear();
}

export async function listEvolutionOptions(caughtId: number, currentId: number): Promise<number[]> {
  const ids = await fetchEvolutionFamilyIds(caughtId);
  return ids.filter((id) => id !== currentId);
}
