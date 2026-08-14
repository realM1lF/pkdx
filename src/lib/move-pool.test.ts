import { describe, expect, it } from 'vitest';
import { learnsetFor, levelUpPool, newestVersionGroup } from './move-pool';
import type { Pokemon } from './types';

function mon(
  rows: Array<{ move: string; vg: string; method: string; level: number }>,
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
      move_learn_method: { name: r.method, url: '' },
      version_group: { name: r.vg, url: '' },
    });
  }
  return { moves: [...byMove.values()] } as Pokemon;
}

/** Charizard-shaped: same species, different edition pools (FRLG vs SV vs BDSP). */
const charizardish = mon([
  { move: 'ember', vg: 'firered-leafgreen', method: 'level-up', level: 1 },
  { move: 'ember', vg: 'scarlet-violet', method: 'level-up', level: 1 },
  { move: 'ember', vg: 'brilliant-diamond-shining-pearl', method: 'level-up', level: 1 },
  { move: 'wing-attack', vg: 'firered-leafgreen', method: 'level-up', level: 36 },
  { move: 'air-slash', vg: 'scarlet-violet', method: 'level-up', level: 0 },
  { move: 'flamethrower', vg: 'firered-leafgreen', method: 'machine', level: 0 },
  { move: 'flamethrower', vg: 'scarlet-violet', method: 'level-up', level: 46 },
  { move: 'focus-punch', vg: 'firered-leafgreen', method: 'machine', level: 0 },
  { move: 'tera-blast', vg: 'scarlet-violet', method: 'machine', level: 0 },
  { move: 'belly-drum', vg: 'heartgold-soulsilver', method: 'egg', level: 0 },
  { move: 'blast-burn', vg: 'platinum', method: 'tutor', level: 0 },
  { move: 'outrage', vg: 'brilliant-diamond-shining-pearl', method: 'tutor', level: 0 },
]);

describe('learnsetFor — edition isolation', () => {
  it('level-up: FRLG has Wing Attack 36, not Air Slash; SV is the reverse', () => {
    const frlg = learnsetFor(charizardish, 'firered-leafgreen', 'level-up');
    const sv = learnsetFor(charizardish, 'scarlet-violet', 'level-up');
    expect(frlg.map((e) => [e.slug, e.level])).toEqual([
      ['ember', 1],
      ['wing-attack', 36],
    ]);
    expect(sv.map((e) => [e.slug, e.level])).toEqual([
      ['air-slash', 0],
      ['ember', 1],
      ['flamethrower', 46],
    ]);
    expect(frlg.some((e) => e.slug === 'air-slash')).toBe(false);
    expect(sv.some((e) => e.slug === 'wing-attack')).toBe(false);
  });

  it('machine: Focus Punch is FRLG-only; Tera Blast is SV-only', () => {
    const frlg = learnsetFor(charizardish, 'firered-leafgreen', 'machine').map((e) => e.slug);
    const sv = learnsetFor(charizardish, 'scarlet-violet', 'machine').map((e) => e.slug);
    expect(frlg).toEqual(['flamethrower', 'focus-punch']);
    expect(sv).toEqual(['tera-blast']);
  });

  it('egg and tutor stay on their own edition', () => {
    expect(learnsetFor(charizardish, 'heartgold-soulsilver', 'egg').map((e) => e.slug)).toEqual([
      'belly-drum',
    ]);
    expect(learnsetFor(charizardish, 'firered-leafgreen', 'egg')).toEqual([]);
    expect(learnsetFor(charizardish, 'platinum', 'tutor').map((e) => e.slug)).toEqual(['blast-burn']);
    expect(learnsetFor(charizardish, 'brilliant-diamond-shining-pearl', 'tutor').map((e) => e.slug)).toEqual([
      'outrage',
    ]);
    expect(learnsetFor(charizardish, 'scarlet-violet', 'tutor')).toEqual([]);
  });

  it('levelUpPool is the level-up slice of learnsetFor', () => {
    expect(levelUpPool(charizardish, 'firered-leafgreen')).toEqual(
      learnsetFor(charizardish, 'firered-leafgreen', 'level-up'),
    );
  });

  it('newestVersionGroup sees Legends Arceus', () => {
    const hisui = mon([{ move: 'head-smash', vg: 'legends-arceus', method: 'level-up', level: 1 }]);
    expect(newestVersionGroup(hisui)).toBe('legends-arceus');
  });
});
