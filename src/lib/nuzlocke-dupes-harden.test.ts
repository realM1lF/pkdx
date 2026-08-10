/* Dupes Clause hardening — fail-open family fetch, cache poison, bidirectional validate. */
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  cachedEvolutionFamilyIds,
  clearEvolutionFamilyCache,
  fetchEvolutionFamilyIds,
  primeEvolutionFamilyCache,
} from './nuzlocke-evolution';
import { validateLogDraft } from './nuzlocke-rules';
import { DEFAULT_RULES } from './nuzlocke-store';
import type { RunState } from './nuzlocke-store';
import type { EvolutionChain } from './types';

const MANKEY = 56;
const PRIMEAPE = 57;
const ANNIHILAPE = 979;

const mankeyChain: EvolutionChain = {
  id: 24,
  chain: {
    is_baby: false,
    evolution_details: [],
    species: { name: 'mankey', url: 'https://pokeapi.co/api/v2/pokemon-species/56/' },
    evolves_to: [
      {
        is_baby: false,
        evolution_details: [],
        species: { name: 'primeape', url: 'https://pokeapi.co/api/v2/pokemon-species/57/' },
        evolves_to: [
          {
            is_baby: false,
            evolution_details: [],
            species: { name: 'annihilape', url: 'https://pokeapi.co/api/v2/pokemon-species/979/' },
            evolves_to: [],
          },
        ],
      },
    ],
  },
};

vi.mock('./pokeapi', async () => {
  const actual = await vi.importActual<typeof import('./pokeapi')>('./pokeapi');
  return {
    ...actual,
    getSpecies: vi.fn(),
    getEvolutionChain: vi.fn(),
  };
});

import { getEvolutionChain, getSpecies } from './pokeapi';

const getSpeciesMock = vi.mocked(getSpecies);
const getEvolutionChainMock = vi.mocked(getEvolutionChain);

function livingMenkiState(): RunState {
  return {
    run: { rules: { ...DEFAULT_RULES, nicknames: false, dupes: true } },
    mode: 'multi',
    players: [],
    encounters: [
      {
        id: 'e1',
        run_id: 'r',
        player_id: 'p1',
        route_key: 'route-22',
        pokemon_id: MANKEY,
        caught_pokemon_id: MANKEY,
        nickname: 'Menki',
        level: 5,
        status: 'caught',
        note: null,
        created_at: '2026-01-01T00:00:00.000Z',
      },
    ],
  } as unknown as RunState;
}

beforeEach(() => {
  clearEvolutionFamilyCache();
  getSpeciesMock.mockReset();
  getEvolutionChainMock.mockReset();
});

describe('evolution family cache — fail-open must not poison', () => {
  it('does not cache a failed fetch as a permanent singleton', async () => {
    getSpeciesMock.mockRejectedValueOnce(new Error('offline'));
    const first = await fetchEvolutionFamilyIds(PRIMEAPE);
    expect(first).toEqual([PRIMEAPE]);
    expect(cachedEvolutionFamilyIds(PRIMEAPE)).toBeUndefined();

    getSpeciesMock.mockResolvedValueOnce({
      evolution_chain: { url: 'https://pokeapi.co/api/v2/evolution-chain/24/' },
    } as Awaited<ReturnType<typeof getSpecies>>);
    getEvolutionChainMock.mockResolvedValueOnce(mankeyChain);

    const second = await fetchEvolutionFamilyIds(PRIMEAPE);
    expect(second).toEqual([MANKEY, PRIMEAPE, ANNIHILAPE]);
    expect(cachedEvolutionFamilyIds(PRIMEAPE)).toEqual([MANKEY, PRIMEAPE, ANNIHILAPE]);
  });

  it('heals a singleton-poisoned stage from a richer sibling family in cache', () => {
    primeEvolutionFamilyCache([MANKEY, PRIMEAPE, ANNIHILAPE]);
    /* simulate the old fail-open write that overwrote only Primeape */
    primeEvolutionFamilyCache([PRIMEAPE]);
    expect(cachedEvolutionFamilyIds(PRIMEAPE)).toEqual([MANKEY, PRIMEAPE, ANNIHILAPE]);
    expect(cachedEvolutionFamilyIds(MANKEY)).toEqual([MANKEY, PRIMEAPE, ANNIHILAPE]);
  });
});

describe('validateLogDraft — bidirectional evo-line check', () => {
  it('blocks Rasaff when Menki is alive even if the candidate family fetch fails open', async () => {
    /* candidate (57) fails → singleton; living Menki (56) resolves the full line */
    getSpeciesMock.mockImplementation(async (id) => {
      const n = Number(id);
      if (n === PRIMEAPE) throw new Error('offline');
      return {
        evolution_chain: { url: 'https://pokeapi.co/api/v2/evolution-chain/24/' },
      } as Awaited<ReturnType<typeof getSpecies>>;
    });
    getEvolutionChainMock.mockResolvedValue(mankeyChain);

    const err = await validateLogDraft(livingMenkiState(), {
      playerId: 'p2',
      routeKey: 'viridian-forest',
      pokemonId: PRIMEAPE,
      nickname: 'Rasaff',
      level: 5,
      status: 'caught',
    });
    expect(err).toBe('speciesDupe');
  });
});
