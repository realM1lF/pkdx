import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import * as versus from '@/lib/versus';
import { executeRegisteredTool } from './registry';
import { JUDGE_MATCHUP, judgeMatchupFromArgs, judgeMatchupPair } from './judge-matchup';
import type { Move, Pokemon } from '@/lib/types';

const ROOT = resolve(import.meta.dirname, '../../..');

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

const charizardMon = mon('charizard', ['fire', 'flying'], [
  { move: 'scratch', vg: RB, level: 1 },
  { move: 'growl', vg: RB, level: 1 },
  { move: 'ember', vg: RB, level: 1 },
  { move: 'leer', vg: RB, level: 15 },
  { move: 'rage', vg: RB, level: 20 },
  { move: 'slash', vg: RB, level: 33 },
  { move: 'flamethrower', vg: RB, level: 44 },
]);

const geodudeMon = mon('geodude', ['rock', 'ground'], [
  { move: 'tackle', vg: RB, level: 1 },
  { move: 'defense-curl', vg: RB, level: 1 },
  { move: 'rock-throw', vg: RB, level: 11 },
  { move: 'self-destruct', vg: RB, level: 40 },
  { move: 'harden', vg: RB, level: 20 },
  { move: 'bide', vg: RB, level: 29 },
]);

const moveMap = new Map<string, Move>([
  ['scratch', moveDetail('scratch', 'normal', 'physical', 40)],
  ['growl', moveDetail('growl', 'normal', 'physical', 0)],
  ['ember', moveDetail('ember', 'fire', 'special', 40)],
  ['leer', moveDetail('leer', 'normal', 'physical', 0)],
  ['rage', moveDetail('rage', 'normal', 'physical', 20)],
  ['slash', moveDetail('slash', 'normal', 'physical', 70)],
  ['flamethrower', moveDetail('flamethrower', 'fire', 'special', 95)],
  ['tackle', moveDetail('tackle', 'normal', 'physical', 35)],
  ['defense-curl', moveDetail('defense-curl', 'normal', 'physical', 0)],
  ['rock-throw', moveDetail('rock-throw', 'rock', 'physical', 50)],
  ['self-destruct', moveDetail('self-destruct', 'normal', 'physical', 130)],
  ['harden', moveDetail('harden', 'normal', 'physical', 0)],
  ['bide', moveDetail('bide', 'normal', 'physical', 0)],
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

describe('judgeMatchupPair', () => {
  it('judges Glurak vs Kleinstein in Red via versus.ts (Gen I Special, no sim)', async () => {
    const damageSpy = vi.spyOn(versus, 'damageBetween');
    const speedSpy = vi.spyOn(versus, 'speedCheck');
    const judgeSpy = vi.spyOn(versus, 'judgeMatchup');

    const result = await judgeMatchupPair('Glurak', 'Kleinstein', 'rote Edition');
    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.game).toMatchObject({ versionGroup: 'red-blue', gen: 1 });
    expect(result.you).toMatchObject({ slug: 'charizard' });
    expect(result.foe).toMatchObject({ slug: 'geodude' });
    expect(result.you.stats).not.toHaveProperty('special_attack');
    expect(result.you.stats).not.toHaveProperty('special_defense');
    expect(result.foe.stats).not.toHaveProperty('special_attack');
    expect(result.foe.stats.special).toBeTypeOf('number');
    expect(result.verdict.tier).toBeTruthy();
    expect(result.verdict.bestMove).toBeTruthy();
    expect(result.key_cells.you_vs_foe.length).toBeGreaterThan(0);
    expect(result.spoken_hint).toMatch(/charizard/i);

    expect(damageSpy).toHaveBeenCalled();
    expect(speedSpy).toHaveBeenCalled();
    expect(judgeSpy).toHaveBeenCalled();
  });

  it('reuses session game when game is null', async () => {
    const result = await judgeMatchupFromArgs(
      { you_query: 'Charizard', foe_query: 'Geodude', game: null },
      { gameQuery: 'red' },
    );
    expect(result).toMatchObject({
      ok: true,
      game: { versionGroup: 'red-blue', gen: 1 },
      you: { slug: 'charizard' },
      foe: { slug: 'geodude' },
    });
  });

  it('rejects unknown species', async () => {
    expect(await judgeMatchupPair('NotAMon', 'Geodude', 'red')).toMatchObject({
      ok: false,
      error: 'unknown_species',
    });
  });

  it('runs through executeRegisteredTool', async () => {
    const result = await executeRegisteredTool(
      JUDGE_MATCHUP,
      { you_query: 'Glurak', foe_query: 'Kleinstein', game: 'rote Edition' },
      {},
    );
    expect(result).toMatchObject({
      ok: true,
      game: { gen: 1 },
      you: { slug: 'charizard' },
      foe: { slug: 'geodude' },
      verdict: { tier: expect.any(String), reason: expect.any(String) },
    });
  });
});

describe('wrapper contract', () => {
  it('imports versus.ts functions and not @pkmn/sim', () => {
    const src = readFileSync(resolve(ROOT, 'src/lib/gpt-live/judge-matchup.ts'), 'utf8');
    expect(src).toContain("from '@/lib/versus'");
    expect(src).toContain('resolveDefaultSet');
    expect(src).toContain('computeMatrix');
    expect(src).toContain('sideToVersus');
    expect(src).toContain('prefetchSlugs');
    expect(src).toContain('judgeMatchup');
    expect(src).toContain('speedCheck');
    expect(src).not.toMatch(/resolveMatchupSet\s*\(/);
    expect(src).not.toMatch(/from ['"]@\/lib\/battle\/sim-batch['"]/);
    expect(src).not.toMatch(/from ['"]@pkmn\/sim['"]/);
    expect(src).not.toMatch(/from ['"]@\/lib\/battle\/engine['"]/);
  });
});
