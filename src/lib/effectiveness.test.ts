import { describe, expect, it } from 'vitest';
import { chartTypeSlugs, genEffectivenessOf, splitMatchups } from './effectiveness';
import { genFor, genTypesOf } from './gen-dex';
import type { PokemonType } from './types';

const ZERO_TYPES: PokemonType[] = ['normal'];

function nationalIds(vgId: string, lastNum: number): string[] {
  const ids: string[] = [];
  for (const sp of genFor(vgId).species) {
    if (!sp.exists || sp.num < 1 || sp.num > lastNum || sp.forme) continue;
    ids.push(sp.id);
  }
  return ids;
}

describe('genEffectivenessOf — encyclopedia type-chart consensus', () => {
  it('Gen 1 Psychic is immune to Ghost (×0), not weak', () => {
    expect(genEffectivenessOf(1, 'ghost', ['psychic'])).toBe(0);
    expect(genEffectivenessOf(9, 'ghost', ['psychic'])).toBe(2);
  });

  it('Gen 1 Bug is super-effective vs Poison; later gens reverse that', () => {
    expect(genEffectivenessOf(1, 'bug', ['poison'])).toBe(2);
    expect(genEffectivenessOf(2, 'bug', ['poison'])).toBe(0.5);
  });

  it('Gen 1 grass/poison (Bulbasaur line) is 4× weak to Bug', () => {
    expect(genEffectivenessOf(1, 'bug', ['grass', 'poison'])).toBe(4);
    expect(genEffectivenessOf(9, 'bug', ['grass', 'poison'])).toBe(1);
  });

  it('Gen 1 chart has no Dark, Steel, or Fairy attacking types', () => {
    const types = chartTypeSlugs(1);
    expect(types).not.toContain('dark');
    expect(types).not.toContain('steel');
    expect(types).not.toContain('fairy');
    expect(types).toEqual(expect.arrayContaining(['normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon']));
    expect(types).toHaveLength(15);
  });

  it('Steel appears in Gen 2; Fairy appears in Gen 6', () => {
    expect(chartTypeSlugs(2)).toContain('steel');
    expect(chartTypeSlugs(2)).toContain('dark');
    expect(chartTypeSlugs(2)).not.toContain('fairy');
    expect(chartTypeSlugs(6)).toContain('fairy');
  });

  it('Dragon vs Dragon is 2× in every gen that has Dragon', () => {
    expect(genEffectivenessOf(1, 'dragon', ['dragon'])).toBe(2);
    expect(genEffectivenessOf(9, 'dragon', ['dragon'])).toBe(2);
  });

  it('Gen 1 Ice vs Fire is neutral; from Gen 2 Ice is resisted', () => {
    expect(genEffectivenessOf(1, 'ice', ['fire'])).toBe(1);
    expect(genEffectivenessOf(2, 'ice', ['fire'])).toBe(0.5);
    const g1 = splitMatchups(['fire'], 1);
    expect([...g1.resist, ...g1.quarter, ...g1.weak, ...g1.quad]).not.toContain('ice');
    expect(splitMatchups(['fire'], 2).resist).toContain('ice');
  });

  it('Gen 1 Poison vs Bug is 2×; from Gen 2 it is neutral', () => {
    expect(genEffectivenessOf(1, 'poison', ['bug'])).toBe(2);
    expect(genEffectivenessOf(2, 'poison', ['bug'])).toBe(1);
  });
});

describe('splitMatchups — detail-page buckets stay gen-correct for every Kanto species', () => {
  it('no Gen 1 species lists Dark/Steel/Fairy as an attacking matchup', () => {
    for (const id of nationalIds('red-blue', 151)) {
      const types = genTypesOf('red-blue', id, ZERO_TYPES);
      const m = splitMatchups(types, 1);
      const atk = [...m.quad, ...m.weak, ...m.resist, ...m.quarter, ...m.immune];
      expect(atk, id).not.toContain('dark');
      expect(atk, id).not.toContain('steel');
      expect(atk, id).not.toContain('fairy');
    }
  });

  it('Mewtwo RB: weak to Bug, immune to Ghost, not weak to Dark/Fairy', () => {
    const m = splitMatchups(['psychic'], 1);
    expect(m.weak).toContain('bug');
    expect(m.immune).toContain('ghost');
    expect(m.weak).not.toContain('dark');
    expect(m.weak).not.toContain('fairy');
    expect(m.immune).not.toContain('dark');
  });

  it('Mewtwo SV: weak to Bug/Ghost/Dark', () => {
    const m = splitMatchups(['psychic'], 9);
    expect(m.weak).toEqual(expect.arrayContaining(['bug', 'ghost', 'dark']));
  });
});
