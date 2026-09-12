import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { executeRegisteredTool } from './registry';
import { WHERE_TO_FIND, whereToFindFromArgs, whereToFindPair } from './where-to-find';
import type { EncounterAreaEntry } from '@/lib/wherefind';

const ROOT = resolve(import.meta.dirname, '../../..');

const pidgeyAreas: EncounterAreaEntry[] = [
  {
    location_area: { name: 'kanto-route-1-area', url: '' },
    version_details: [
      {
        version: { name: 'firered' },
        max_chance: 50,
        encounter_details: [{ chance: 45, min_level: 2, max_level: 5, method: { name: 'walk' } }],
      },
    ],
  },
];

const pikachuAreas: EncounterAreaEntry[] = [
  {
    location_area: { name: 'kanto-poke-center-area', url: '' },
    version_details: [
      {
        version: { name: 'firered' },
        max_chance: 100,
        encounter_details: [
          { chance: 100, min_level: 10, max_level: 10, method: { name: 'colosseum-bonus-disc-jpn' } },
        ],
      },
    ],
  },
  {
    location_area: { name: 'viridian-forest-area', url: '' },
    version_details: [
      {
        version: { name: 'firered' },
        max_chance: 5,
        encounter_details: [{ chance: 5, min_level: 3, max_level: 5, method: { name: 'walk' } }],
      },
    ],
  },
  {
    location_area: { name: 'kanto-power-plant-area', url: '' },
    version_details: [
      {
        version: { name: 'firered' },
        max_chance: 25,
        encounter_details: [{ chance: 25, min_level: 22, max_level: 26, method: { name: 'walk' } }],
      },
    ],
  },
];

vi.mock('@/lib/pokeapi', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/pokeapi')>();
  return {
    ...actual,
    cachedJson: vi.fn(async (_key: string, url: string) => {
      if (url.includes('/pokemon/16/encounters')) return pidgeyAreas;
      if (url.includes('/pokemon/25/encounters')) return pikachuAreas;
      throw new Error(`unexpected url ${url}`);
    }),
  };
});

describe('whereToFindPair', () => {
  it('aggregates wild rows for Taubsi in FireRed', async () => {
    const result = await whereToFindPair('Taubsi', 'firered');
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.species.slug).toBe('pidgey');
    expect(result.wild.length).toBeGreaterThan(0);
    expect(result.wild[0]?.nodeId).toBe('kanto-route-1');
    expect(result.wild.every((r) => !r.special)).toBe(true);
  });

  it('reuses session game when game is null', async () => {
    const result = await whereToFindFromArgs({ species_query: 'Pidgey', game: null }, { gameQuery: 'firered' });
    expect(result).toMatchObject({ ok: true, species: { slug: 'pidgey' } });
  });

  it('lists Power Plant and Viridian Forest in spoken_hint for Pikachu in feuerrote Edition', async () => {
    const result = await whereToFindPair('Pikachu', 'feuerrote Edition');
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.wild[0]?.nodeId).toBe('power-plant');
    expect(result.wild.some((row) => row.nodeId === 'viridian-forest')).toBe(true);
    expect(result.spoken_hint).toMatch(/Power Plant/i);
    expect(result.spoken_hint).toMatch(/Viridian Forest/i);
    expect(result.spoken_hint).not.toMatch(/Colosseum/i);
    expect(result.spoken_hint).not.toMatch(/Poke Center/i);
  });

  it('runs through executeRegisteredTool', async () => {
    const result = await executeRegisteredTool(
      WHERE_TO_FIND,
      { species_query: 'Taubsi', game: 'firered' },
      {},
    );
    expect(result).toMatchObject({ ok: true, species: { slug: 'pidgey' } });
  });
});

describe('wrapper contract', () => {
  it('uses wherefind.aggregate, not mapdata spawn math', () => {
    const src = readFileSync(resolve(ROOT, 'src/lib/gpt-live/where-to-find.ts'), 'utf8');
    expect(src).toContain("from '@/lib/wherefind'");
    expect(src).toContain('aggregate(');
    expect(src).not.toContain('aggregateArea');
  });
});
