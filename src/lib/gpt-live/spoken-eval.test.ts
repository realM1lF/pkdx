import { beforeEach, describe, expect, it, vi } from 'vitest';
import { clearEvolutionFamilyCache, primeEvolutionFamilyCache } from '@/lib/nuzlocke-evolution';
import type { Move, Pokemon } from '@/lib/types';
import { executeRegisteredTool } from './registry';
import { getSpeciesStatsFromArgs } from './species-stats';
import { judgeMatchupFromArgs } from './judge-matchup';
import {
  COVERAGE_SPOKEN_EVALS,
  ITEM_SPOKEN_EVALS,
  LEGALITY_SPOKEN_EVALS,
  MATCHUP_SPOKEN_EVALS,
  NUZLOCKE_CAN_CATCH_SPOKEN_EVALS,
  NUZLOCKE_RUN_STATUS_SPOKEN_EVALS,
  ROUTE_SPOKEN_EVALS,
  STATS_SPOKEN_EVALS,
  WHERE_SPOKEN_EVALS,
} from './spoken-eval';
import { checkSlotLegalityFromArgs } from './check-slot-legality';
import { checkTeamCoverageFromArgs } from './check-team-coverage';
import { itemLocationsFromArgs } from './item-locations';
import { nuzlockeCanCatchFromArgs } from './nuzlocke-can-catch';
import { nuzlockeRunStatusFromArgs } from './nuzlocke-run-status';
import { routeEncountersFromArgs } from './route-encounters';
import { whereToFindFromArgs } from './where-to-find';
import type { EncounterAreaEntry } from '@/lib/wherefind';

function mon(
  slug: string,
  types: string[],
  rows: Array<{ move: string; vg: string; level: number }>,
): Pokemon {
  const byMove = new Map<string, Pokemon['moves'][number]>();
  for (const r of rows) {
    let slot = byMove.get(r.move);
    if (!slot) {
      slot = { move: { name: r.move, url: '' }, version_group_details: [] };
      byMove.set(r.move, slot);
    }
    slot.version_group_details.push({
      level_learned_at: r.level,
      move_learn_method: { name: 'level-up', url: '' },
      version_group: { name: r.vg, url: '' },
    });
  }
  return {
    name: slug,
    types: types.map((name, slot) => ({ slot: slot + 1, type: { name } })),
    stats: [
      { stat: { name: 'attack' }, base_stat: 80 },
      { stat: { name: 'special-attack' }, base_stat: 85 },
    ],
    moves: [...byMove.values()],
  } as Pokemon;
}

function moveDetail(slug: string, type: string, category: 'physical' | 'special', power: number): Move {
  return {
    name: slug,
    type: { name: type },
    damage_class: { name: category },
    power,
    accuracy: 100,
  } as Move;
}

const RB = 'red-blue';
const FRLG = 'firered-leafgreen';

const charizardAll = mon('charizard', ['fire', 'flying'], [
  { move: 'scratch', vg: RB, level: 1 },
  { move: 'ember', vg: RB, level: 1 },
  { move: 'flamethrower', vg: RB, level: 44 },
  { move: 'ember', vg: FRLG, level: 1 },
  { move: 'flamethrower', vg: FRLG, level: 44 },
]);

const geodudeAll = mon('geodude', ['rock', 'ground'], [
  { move: 'tackle', vg: RB, level: 1 },
  { move: 'rock-throw', vg: RB, level: 11 },
  { move: 'tackle', vg: FRLG, level: 1 },
  { move: 'rock-throw', vg: FRLG, level: 11 },
]);

const blazikenFrlg = mon('blaziken', ['fire', 'fighting'], [
  { move: 'blaze-kick', vg: 'emerald', level: 36 },
]);
const moveMap = new Map<string, Move>([
  ['scratch', moveDetail('scratch', 'normal', 'physical', 40)],
  ['ember', moveDetail('ember', 'fire', 'special', 40)],
  ['leer', moveDetail('leer', 'normal', 'physical', 0)],
  ['rage', moveDetail('rage', 'normal', 'physical', 20)],
  ['slash', moveDetail('slash', 'normal', 'physical', 70)],
  ['flamethrower', moveDetail('flamethrower', 'fire', 'special', 95)],
  ['tackle', moveDetail('tackle', 'normal', 'physical', 35)],
  ['rock-throw', moveDetail('rock-throw', 'rock', 'physical', 50)],
  ['harden', moveDetail('harden', 'normal', 'physical', 0)],
  ['bide', moveDetail('bide', 'normal', 'physical', 0)],
  ['self-destruct', moveDetail('self-destruct', 'normal', 'physical', 130)],
]);

const pidgeyAreas: EncounterAreaEntry[] = [
  {
    location_area: { name: 'kanto-route-1-area', url: '' },
    version_details: [
      {
        version: { name: 'firered' },
        max_chance: 45,
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

const route1Loc = { areas: [{ name: 'kanto-route-1-area', url: '' }] };
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
  ],
};

vi.mock('@/lib/pokeapi', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/pokeapi')>();
  const frlgMoveMap = new Map<string, Move>([
    ['ember', moveDetail('ember', 'fire', 'special', 40)],
    ['flamethrower', moveDetail('flamethrower', 'fire', 'special', 95)],
    ['rock-throw', moveDetail('rock-throw', 'rock', 'physical', 50)],
    ['tackle', moveDetail('tackle', 'normal', 'physical', 35)],
  ]);
  return {
    ...actual,
    getPokemon: vi.fn(async (slug: string) => {
      if (slug === 'charizard') return charizardAll;
      if (slug === 'geodude') return geodudeAll;
      if (slug === 'blaziken') return blazikenFrlg;
      throw new Error(`unknown pokemon ${slug}`);
    }),
    getMove: vi.fn(async (slug: string) => {
      const hit = frlgMoveMap.get(slug) ?? moveMap.get(slug);
      if (!hit) throw new Error(`unknown move ${slug}`);
      return hit;
    }),
    cachedJson: vi.fn(async (_key: string, url: string) => {
      if (url.includes('/pokemon/16/encounters')) return pidgeyAreas;
      if (url.includes('/pokemon/25/encounters')) return pikachuAreas;
      if (url.includes('/location/kanto-route-1')) return route1Loc;
      if (url.includes('/location-area/kanto-route-1-area')) return route1Area;
      throw new Error(`unexpected url ${url}`);
    }),
  };
});

describe('spoken stats eval', () => {
  it.each(STATS_SPOKEN_EVALS)('$id resolves through the tool, not memory', async (row) => {
    const result = await executeRegisteredTool(row.tool, row.args, {});
    expect(result).toMatchObject({
      ok: true,
      species: { slug: row.expect.slug },
      game: { gen: row.expect.gen },
      stats: row.expect.stats,
    });
    if (result && typeof result === 'object' && 'stats' in result) {
      const stats = (result as { stats: Record<string, number> }).stats;
      for (const key of row.expect.forbiddenKeys ?? []) {
        expect(stats).not.toHaveProperty(key);
      }
    }
    const direct = getSpeciesStatsFromArgs(row.args);
    expect(direct).toEqual(result);
  });
});

describe('spoken matchup eval', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it.each(MATCHUP_SPOKEN_EVALS)('$id resolves through judge_matchup', async (row) => {
    const result = await executeRegisteredTool(row.tool, row.args, {});
    expect(result).toMatchObject({
      ok: true,
      you: { slug: row.expect.youSlug },
      foe: { slug: row.expect.foeSlug },
      game: { gen: row.expect.gen },
    });
    if (result && typeof result === 'object' && 'ok' in result && (result as { ok: boolean }).ok) {
      const rowOk = result as unknown as {
        you: { stats: Record<string, number> };
        foe: { stats: Record<string, number> };
        verdict: Record<string, unknown>;
      };
      for (const key of row.expect.forbiddenSideKeys ?? []) {
        expect(rowOk.you.stats).not.toHaveProperty(key);
        expect(rowOk.foe.stats).not.toHaveProperty(key);
      }
      for (const key of row.expect.verdictKeys) {
        expect(rowOk.verdict).toHaveProperty(key);
      }
    }
    const direct = await judgeMatchupFromArgs(row.args);
    expect(direct).toEqual(result);
  });
});

describe('spoken where eval', () => {
  it.each(WHERE_SPOKEN_EVALS)('$id resolves through where_to_find', async (row) => {
    const result = await executeRegisteredTool(row.tool, row.args, {});
    expect(result).toMatchObject({ ok: true, species: { slug: row.expect.slug } });
    if (result && typeof result === 'object' && 'ok' in result && (result as { ok: boolean }).ok && row.expect.wildNodeId) {
      const wild = (result as unknown as { wild: Array<{ nodeId: string | null }> }).wild;
      expect(wild.some((r) => r.nodeId === row.expect.wildNodeId)).toBe(true);
      if (row.id === 'pikachu-feuerrote-de') {
        const hint = (result as unknown as { spoken_hint: string }).spoken_hint;
        expect(hint).toMatch(/Power Plant/i);
        expect(hint).toMatch(/Viridian Forest/i);
        expect(hint).not.toMatch(/Colosseum/i);
      }
    }
    expect(await whereToFindFromArgs(row.args)).toEqual(result);
  });
});

describe('spoken route eval', () => {
  it.each(ROUTE_SPOKEN_EVALS)('$id resolves through route_encounters', async (row) => {
    const result = await executeRegisteredTool(row.tool, row.args, {});
    expect(result).toMatchObject({ ok: true, nodeId: row.expect.nodeId });
    if (row.expect.wildSlug && result && typeof result === 'object' && 'ok' in result && (result as { ok: boolean }).ok) {
      const wild = (result as unknown as { wild: Array<{ slug: string }> }).wild;
      expect(wild.some((r) => r.slug === row.expect.wildSlug)).toBe(true);
    }
    expect(await routeEncountersFromArgs(row.args)).toEqual(result);
  });
});

describe('spoken item eval', () => {
  it.each(ITEM_SPOKEN_EVALS)('$id resolves through item_locations', async (row) => {
    const result = await executeRegisteredTool(row.tool, row.args, {});
    expect(result).toMatchObject({ ok: true, itemSlug: row.expect.itemSlug });
    if (row.expect.nodeId && result && typeof result === 'object' && 'ok' in result && (result as { ok: boolean }).ok) {
      const locations = (result as unknown as { locations: Array<{ nodeId: string }> }).locations;
      expect(locations.some((l) => l.nodeId === row.expect.nodeId)).toBe(true);
    }
    expect(itemLocationsFromArgs(row.args)).toEqual(result);
  });
});

describe('spoken legality eval', () => {
  it.each(LEGALITY_SPOKEN_EVALS)('$id resolves through check_slot_legality', async (row) => {
    const result = await executeRegisteredTool(row.tool, row.args, {});
    expect(result).toMatchObject({
      ok: true,
      species: { slug: row.expect.slug },
      legal: row.expect.legal,
    });
    if (row.expect.reasonKeys && result && typeof result === 'object' && 'ok' in result && (result as { ok: boolean }).ok) {
      const reasons = (result as unknown as { reasons: Array<{ key: string }> }).reasons;
      for (const key of row.expect.reasonKeys) {
        expect(reasons.some((r) => r.key === key)).toBe(true);
      }
    }
    expect(await checkSlotLegalityFromArgs(row.args)).toEqual(result);
  });
});

describe('spoken coverage eval', () => {
  it.each(COVERAGE_SPOKEN_EVALS)('$id resolves through check_team_coverage', async (row) => {
    const result = await executeRegisteredTool(row.tool, row.args, {});
    expect(result).toMatchObject({ ok: true, member_count: row.expect.memberCount, source: 'spoken' });
    if (row.expect.minGaps != null && result && typeof result === 'object' && 'ok' in result && (result as { ok: boolean }).ok) {
      const gaps = (result as unknown as { offense: { gaps: unknown[] } }).offense.gaps;
      expect(gaps.length).toBeGreaterThanOrEqual(row.expect.minGaps);
    }
    expect(await checkTeamCoverageFromArgs(row.args)).toEqual(result);
  });
});

describe('spoken nuzlocke run status eval', () => {
  it.each(NUZLOCKE_RUN_STATUS_SPOKEN_EVALS)('$id resolves through nuzlocke_run_status', async (row) => {
    const ctx = { run: row.run };
    const result = await executeRegisteredTool(row.tool, row.args, ctx);
    expect(result).toMatchObject({ ok: true, runName: row.expect.runName, levelCap: row.expect.levelCap });
    expect(await nuzlockeRunStatusFromArgs(row.args, ctx)).toEqual(result);
  });
});

describe('spoken nuzlocke can catch eval', () => {
  beforeEach(() => {
    clearEvolutionFamilyCache();
    primeEvolutionFamilyCache([7, 8, 9]);
  });

  it.each(NUZLOCKE_CAN_CATCH_SPOKEN_EVALS)('$id resolves through nuzlocke_can_catch', async (row) => {
    const ctx = { run: row.run };
    const result = await executeRegisteredTool(row.tool, row.args, ctx);
    expect(result).toMatchObject({
      ok: true,
      canCatch: row.expect.canCatch,
      validationError: row.expect.validationError ?? null,
    });
    if (row.expect.slug) {
      expect(result).toMatchObject({ species: { slug: row.expect.slug } });
    }
    expect(await nuzlockeCanCatchFromArgs(row.args, ctx)).toEqual(result);
  });
});
