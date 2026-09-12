import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { executeRegisteredTool } from './registry';
import { ROUTE_ENCOUNTERS, routeEncountersFromArgs, routeEncountersPair } from './route-encounters';

const ROOT = resolve(import.meta.dirname, '../../..');

const route1Loc = {
  areas: [{ name: 'kanto-route-1-area', url: '' }],
};

const route1Area = {
  name: 'kanto-route-1-area',
  pokemon_encounters: [
    {
      pokemon: { name: 'pidgey', url: 'https://pokeapi.co/api/v2/pokemon/16/' },
      version_details: [
        {
          version: { name: 'firered' },
          max_chance: 45,
          encounter_details: [{ chance: 45, min_level: 2, max_level: 5, method: { name: 'walk' } }],
        },
      ],
    },
    {
      pokemon: { name: 'snorlax', url: 'https://pokeapi.co/api/v2/pokemon/143/' },
      version_details: [
        {
          version: { name: 'firered' },
          max_chance: 100,
          encounter_details: [{ chance: 100, min_level: 30, max_level: 30, method: { name: 'pokeflute' } }],
        },
      ],
    },
  ],
};

vi.mock('@/lib/pokeapi', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/pokeapi')>();
  return {
    ...actual,
    cachedJson: vi.fn(async (_key: string, url: string) => {
      if (url.includes('/location/kanto-route-1')) return route1Loc;
      if (url.includes('/location-area/kanto-route-1-area')) return route1Area;
      throw new Error(`unexpected url ${url}`);
    }),
  };
});

describe('routeEncountersPair', () => {
  it('lists wild spawns and separates static on Route 1', async () => {
    const result = await routeEncountersPair('Route 1', 'firered');
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.nodeId).toBe('kanto-route-1');
    expect(result.wild.some((r) => r.slug === 'pidgey')).toBe(true);
    expect(result.wild.every((r) => r.maxChance <= 100)).toBe(true);
    expect(result.special.some((r) => r.slug === 'snorlax')).toBe(true);
    expect(result.wild.some((r) => r.slug === 'snorlax')).toBe(false);
  });

  it('requires a resolvable game version', async () => {
    const result = await routeEncountersFromArgs({ route_query: 'Route 1', game: null }, {});
    expect(result.ok).toBe(false);
  });

  it('runs through executeRegisteredTool', async () => {
    const result = await executeRegisteredTool(
      ROUTE_ENCOUNTERS,
      { route_query: 'Route 1', game: 'firered' },
      {},
    );
    expect(result).toMatchObject({ ok: true, nodeId: 'kanto-route-1' });
  });
});

describe('wrapper contract', () => {
  it('uses mapdata.aggregateArea', () => {
    const src = readFileSync(resolve(ROOT, 'src/lib/gpt-live/route-encounters.ts'), 'utf8');
    expect(src).toContain('aggregateArea');
    expect(src).not.toContain('wherefind');
  });
});
