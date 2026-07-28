/* Quadruple-damage (dual-type multiplication) — reproduction + regression.
 * Gyarados (Water/Flying) vs Electric = ×4, Rhyperior (Ground/Rock) vs
 * Grass = ×4, double resist (Electric vs Grass/Dragon) = ×¼ — in every
 * display path (team builder matrix, versus EFF label, battle log). */
import { describe, expect, it } from 'vitest';
import { effectivenessVsMember, genEffectivenessOf } from './teambuilder';
import { EFF_LABEL, effectivenessOf, genSplitMatchupsForSide } from './versus';
import { effMultLabel, splitMatchups } from './effectiveness';

describe('dual-type effectiveness math', () => {
  it('Gyarados (water/flying) takes ×4 from Electric', () => {
    expect(genEffectivenessOf(9, 'electric', ['water', 'flying'])).toBe(4);
    expect(effectivenessOf('electric', ['water', 'flying'], 9)).toBe(4);
  });

  it('Rhyperior (ground/rock) takes ×4 from Grass', () => {
    expect(genEffectivenessOf(9, 'grass', ['ground', 'rock'])).toBe(4);
  });

  it('double resist: Electric vs grass/dragon = ×¼', () => {
    expect(genEffectivenessOf(9, 'electric', ['grass', 'dragon'])).toBe(0.25);
  });

  it('team-builder member math multiplies dual types', () => {
    expect(
      effectivenessVsMember('electric', { types: ['water', 'flying'], ability: null }, 'scarlet-violet'),
    ).toBe(4);
  });

  it('Solid Rock softens ×4 to ×3', () => {
    expect(
      effectivenessVsMember('electric', { types: ['water', 'flying'], ability: 'solid-rock' }, 'scarlet-violet'),
    ).toBe(3);
  });

  it('Lightning Rod grants Electric immunity in gen 5+, not in gen 4', () => {
    expect(
      effectivenessVsMember('electric', { types: ['water', 'flying'], ability: 'lightning-rod' }, 'scarlet-violet'),
    ).toBe(0);
    expect(
      effectivenessVsMember('electric', { types: ['water', 'flying'], ability: 'lightning-rod' }, 'heartgold-soulsilver'),
    ).toBe(4);
  });
});

describe('EFF labels', () => {
  it('shows ×4 / ×¼ and ability-modified intermediates exactly', () => {
    expect(EFF_LABEL(4)).toBe('×4');
    expect(EFF_LABEL(2)).toBe('×2');
    expect(EFF_LABEL(1)).toBe('×1');
    expect(EFF_LABEL(0.5)).toBe('×½');
    expect(EFF_LABEL(0.25)).toBe('×¼');
    expect(EFF_LABEL(0)).toBe('×0');
    // Solid Rock / Filter results — must not collapse to ×4
    expect(EFF_LABEL(3)).toBe('×3');
    expect(EFF_LABEL(1.5)).toBe('×1½');
  });
});

describe('split matchups — dual-type extremes get their own buckets', () => {
  it('Gyarados (water/flying): Electric lands in quad, not weak', () => {
    const m = splitMatchups(['water', 'flying'], 9);
    expect(m.quad).toContain('electric');
    expect(m.weak).not.toContain('electric');
    expect(m.weak).toContain('rock'); // plain ×2 stays weak
  });

  it('Rhyperior (ground/rock): Grass + Water are ×4', () => {
    const m = splitMatchups(['ground', 'rock'], 9);
    expect(m.quad).toEqual(expect.arrayContaining(['grass', 'water']));
  });

  it('grass/dragon: Electric is a ×¼ double resist', () => {
    const m = splitMatchups(['grass', 'dragon'], 9);
    expect(m.quarter).toContain('electric');
    expect(m.resist).not.toContain('electric');
  });

  it('ability immunity moves a ×4 weakness into immune (Motor Drive)', () => {
    const m = genSplitMatchupsForSide(['water', 'flying'], 9, 'Motor Drive');
    expect(m.immune).toContain('electric');
    expect(m.quad).not.toContain('electric');
  });

  it('mono types never produce quad/quarter buckets', () => {
    const m = splitMatchups(['fire'], 9);
    expect(m.quad).toEqual([]);
    expect(m.quarter).toEqual([]);
    expect(m.weak).toContain('water');
  });
});

describe('effMultLabel — shared helper', () => {
  it('covers chart + ability-modified values', () => {
    expect(effMultLabel(4)).toBe('×4');
    expect(effMultLabel(0.25)).toBe('×¼');
    expect(effMultLabel(3)).toBe('×3');
    expect(effMultLabel(1.25)).toBe('×1¼');
    expect(effMultLabel(0.125)).toBe('×⅛');
  });
});
