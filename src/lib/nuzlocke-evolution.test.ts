import { describe, expect, it } from 'vitest';
import {
  chainSpeciesIds,
  hasEvolved,
  isValidEvolutionTarget,
  normalizeEncounter,
  speciesIdFor,
} from './nuzlocke-evolution';
import type { NuzEncounterRow } from './supabase';
import type { EvolutionChain } from './types';

function enc(partial: Partial<NuzEncounterRow> & Pick<NuzEncounterRow, 'pokemon_id'>): NuzEncounterRow {
  return {
    id: 'e1',
    run_id: 'r1',
    player_id: 'p1',
    route_key: 'route-1',
    nickname: null,
    level: 16,
    status: 'caught',
    note: null,
    created_at: new Date().toISOString(),
    ...partial,
  };
}

/** Minimal Squirtle → Wartortle → Blastoise chain. */
const squirtleChain: EvolutionChain = {
  id: 1,
  chain: {
    is_baby: false,
    evolution_details: [],
    species: { name: 'squirtle', url: 'https://pokeapi.co/api/v2/pokemon-species/7/' },
    evolves_to: [
      {
        is_baby: false,
        evolution_details: [],
        species: { name: 'wartortle', url: 'https://pokeapi.co/api/v2/pokemon-species/8/' },
        evolves_to: [
          {
            is_baby: false,
            evolution_details: [],
            species: { name: 'blastoise', url: 'https://pokeapi.co/api/v2/pokemon-species/9/' },
            evolves_to: [],
          },
        ],
      },
    ],
  },
};

describe('normalizeEncounter / display', () => {
  it('backfills caught_pokemon_id from pokemon_id', () => {
    const n = normalizeEncounter(enc({ pokemon_id: 7 }));
    expect(n.caught_pokemon_id).toBe(7);
    expect(n.pokemon_id).toBe(7);
  });

  it('preserves distinct caught vs current', () => {
    const n = normalizeEncounter(enc({ pokemon_id: 8, caught_pokemon_id: 7 }));
    expect(speciesIdFor(n, 'caught')).toBe(7);
    expect(speciesIdFor(n, 'current')).toBe(8);
    expect(hasEvolved(n)).toBe(true);
  });
});

describe('evolution chain validation', () => {
  it('accepts wartortle/blastoise from squirtle family', () => {
    const ids = chainSpeciesIds(squirtleChain);
    expect(ids).toEqual([7, 8, 9]);
    expect(isValidEvolutionTarget(ids, 7, 7, 8)).toBe(true);
    expect(isValidEvolutionTarget(ids, 7, 8, 9)).toBe(true);
  });

  it('rejects same form and off-family targets', () => {
    const ids = chainSpeciesIds(squirtleChain);
    expect(isValidEvolutionTarget(ids, 7, 7, 7)).toBe(false);
    expect(isValidEvolutionTarget(ids, 7, 7, 25)).toBe(false);
  });
});
