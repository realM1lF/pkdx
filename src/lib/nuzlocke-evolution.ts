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

/** True singleton (no evo) or a multi-stage line — never a fail-open poison. */
function cacheFamily(family: number[]): void {
  for (const id of family) familyCache.set(id, family);
}

/**
 * Sync cache read for Dupes Clause scans. Prefer a multi-member family that
 * contains `pokemonId` even when this key was later overwritten by a
 * fail-open singleton (Menki→[56,57,979], Rasaff fail →[57]).
 * Returns undefined on a true miss — callers degrade to a singleton.
 */
export function cachedEvolutionFamilyIds(pokemonId: number): number[] | undefined {
  const hit = familyCache.get(pokemonId);
  if (hit && hit.length > 1) return hit;
  for (const fam of familyCache.values()) {
    if (fam.length > 1 && fam.includes(pokemonId)) {
      cacheFamily(fam);
      return fam;
    }
  }
  return hit;
}

/** Evolution family for Dupes Clause (Schiggy ↔ Schillok ↔ Turtok). Cached. */
export async function fetchEvolutionFamilyIds(pokemonId: number): Promise<number[]> {
  const hit = cachedEvolutionFamilyIds(pokemonId);
  if (hit) return hit;
  try {
    const ids = await fetchEvolutionChainIds(pokemonId);
    const family = ids.length > 0 ? ids : [pokemonId];
    cacheFamily(family);
    return family;
  } catch {
    /* offline / unknown — return singleton for this call only. Do NOT cache:
     * a later sibling fetch (or retry) must still be able to populate the
     * full line; caching [57] used to poison Primeape while Menki kept the
     * rich family and break cross-stage Dupes detection. */
    return [pokemonId];
  }
}

/** Prefetch families for every living catch so Dupes scans see full lines. */
export async function prefetchEvolutionFamiliesForEncounters(
  encounters: Array<Pick<NuzEncounterRow, 'pokemon_id' | 'caught_pokemon_id' | 'status' | 'is_shiny'>>,
): Promise<void> {
  const ids = new Set<number>();
  for (const e of encounters) {
    if (e.status !== 'caught' || e.is_shiny) continue;
    ids.add(speciesIdFor(e, 'caught'));
    ids.add(e.pokemon_id);
  }
  await Promise.all([...ids].map((id) => fetchEvolutionFamilyIds(id)));
}

/** Test helper — seed cache without network. */
export function primeEvolutionFamilyCache(family: number[]): void {
  cacheFamily(family);
}

export function clearEvolutionFamilyCache(): void {
  familyCache.clear();
}

export async function listEvolutionOptions(caughtId: number, currentId: number): Promise<number[]> {
  const ids = await fetchEvolutionFamilyIds(caughtId);
  return ids.filter((id) => id !== currentId);
}
