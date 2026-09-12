import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import type { Move, Pokemon } from '@/lib/types';
import { emptySlot } from '@/lib/teambuilder';
import { executeRegisteredTool } from './registry';
import {
  CHECK_TEAM_COVERAGE,
  checkTeamCoverageFromArgs,
  checkTeamCoveragePair,
} from './check-team-coverage';

const ROOT = resolve(import.meta.dirname, '../../..');
const FRLG = 'firered-leafgreen';

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

const charizardMon = mon('charizard', ['fire', 'flying'], [
  { move: 'ember', vg: FRLG, level: 1 },
  { move: 'flamethrower', vg: FRLG, level: 44 },
]);

const geodudeMon = mon('geodude', ['rock', 'ground'], [
  { move: 'rock-throw', vg: FRLG, level: 11 },
  { move: 'tackle', vg: FRLG, level: 1 },
]);

const moveMap = new Map<string, Move>([
  ['ember', moveDetail('ember', 'fire', 'special', 40)],
  ['flamethrower', moveDetail('flamethrower', 'fire', 'special', 95)],
  ['rock-throw', moveDetail('rock-throw', 'rock', 'physical', 50)],
  ['tackle', moveDetail('tackle', 'normal', 'physical', 35)],
]);

vi.mock('@/lib/pokeapi', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/pokeapi')>();
  return {
    ...actual,
    getPokemon: vi.fn(async (slug: string) => {
      if (slug === 'charizard') return charizardMon;
      if (slug === 'geodude') return geodudeMon;
      throw new Error(`unknown pokemon ${slug}`);
    }),
    getMove: vi.fn(async (slug: string) => {
      const hit = moveMap.get(slug);
      if (!hit) throw new Error(`unknown move ${slug}`);
      return hit;
    }),
  };
});

describe('checkTeamCoveragePair — spoken members', () => {
  it('returns offense gaps and defense rows for two spoken species', async () => {
    const result = await checkTeamCoveragePair('firered', ['Charizard', 'Geodude'], null);
    expect(result).toMatchObject({
      ok: true,
      member_count: 2,
      source: 'spoken',
      game: { versionGroup: FRLG },
    });
    if (!result.ok) return;
    expect(Object.keys(result.offense.se)).not.toContain('fairy');
    expect(result.defense.length).toBeGreaterThan(0);
    expect(result.spoken_hint).toContain('member');
  });

  it('rejects unknown species in members', async () => {
    const result = await checkTeamCoveragePair('firered', ['NotAPokemon'], null);
    expect(result).toMatchObject({ ok: false, error: 'unknown_species' });
  });
});

describe('checkTeamCoveragePair — team snapshot', () => {
  it('uses the browser snapshot when members is null', async () => {
    const slotA = emptySlot();
    slotA.pokemon = 'charizard';
    slotA.pokemonId = 6;
    slotA.moves = ['flamethrower', 'ember', null, null];
    const slotB = emptySlot();
    slotB.pokemon = 'geodude';
    slotB.pokemonId = 74;
    slotB.moves = ['rock-throw', null, null, null];

    const result = await checkTeamCoveragePair('firered', null, {
      versionGroup: FRLG,
      slots: [slotA, slotB, ...Array.from({ length: 4 }, emptySlot)],
    });
    expect(result).toMatchObject({ ok: true, source: 'snapshot', member_count: 2 });
  });

  it('returns no_team without snapshot or members', async () => {
    const result = await checkTeamCoveragePair('firered', null, null);
    expect(result).toMatchObject({ ok: false, error: 'no_team' });
  });
});

describe('check_team_coverage registry', () => {
  it('runs through executeRegisteredTool', async () => {
    const result = await executeRegisteredTool(
      CHECK_TEAM_COVERAGE,
      { game: 'firered', members: ['Charizard', 'Geodude'] },
      {},
    );
    expect(result).toMatchObject({ ok: true, member_count: 2, source: 'spoken' });
    expect(
      await checkTeamCoverageFromArgs({ game: 'firered', members: ['Charizard', 'Geodude'] }, {}),
    ).toEqual(result);
  });
});

describe('wrapper contract', () => {
  it('calls offensiveCoverage and defensiveSynergy from teambuilder.ts', () => {
    const src = readFileSync(resolve(ROOT, 'src/lib/gpt-live/check-team-coverage.ts'), 'utf8');
    expect(src).toContain('offensiveCoverage');
    expect(src).toContain('defensiveSynergy');
    expect(src).toContain('moveTypeForCoverage');
    expect(src).not.toMatch(/saveTeam\s*\(/);
  });
});
