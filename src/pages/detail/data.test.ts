/* Detail-page defensive matchups must follow @pkmn/data via the Versus
 * helpers — not a hardcoded Gen-VI+ chart. Versus tests are the oracle. */
import { describe, expect, it } from 'vitest';
import { genSplitMatchupsForSide } from '@/lib/versus';
import { computeMatchups, genOfVersionGroup } from './data';

function allAttacking(m: ReturnType<typeof computeMatchups>): string[] {
  return [...m.quad, ...m.weak, ...m.resist, ...m.quarter, ...m.immune];
}

describe('computeMatchups — same buckets as genSplitMatchupsForSide', () => {
  it('grass/poison gen 9: weak to fire/flying/psychic/ice, no bug quad', () => {
    const m = computeMatchups(['grass', 'poison'], 9);
    expect(m).toEqual(genSplitMatchupsForSide(['grass', 'poison'], 9));
    expect(m.weak).toEqual(expect.arrayContaining(['fire', 'flying', 'ice', 'psychic']));
    expect(m.quad).not.toContain('bug');
    expect(m.weak).not.toContain('bug');
  });

  it('gen 1 psychic: ghost does not hit the modern way (immune, not ×2)', () => {
    const m = computeMatchups(['psychic'], 1);
    expect(m).toEqual(genSplitMatchupsForSide(['psychic'], 1));
    expect(m.immune).toContain('ghost');
    expect(m.weak).not.toContain('ghost');
    expect(m.quad).not.toContain('ghost');
  });

  it('gen 9 psychic: ghost is a ×2 weakness (modern chart)', () => {
    const m = computeMatchups(['psychic'], 9);
    expect(m.weak).toContain('ghost');
    expect(m.immune).not.toContain('ghost');
  });

  it('gen 1 grass/poison: bug is ×4 (gen-1 Bug vs Poison/Grass), not neutral', () => {
    const m = computeMatchups(['grass', 'poison'], 1);
    expect(m).toEqual(genSplitMatchupsForSide(['grass', 'poison'], 1));
    expect(m.quad).toContain('bug');
  });

  it('keeps dual-type ×4 in the quad row (water/flying vs electric)', () => {
    const m = computeMatchups(['water', 'flying'], 9);
    expect(m).toEqual(genSplitMatchupsForSide(['water', 'flying'], 9));
    expect(m.quad).toContain('electric');
    expect(m.weak).not.toContain('electric');
  });
});

describe('computeMatchups — types missing or different before gen 6', () => {
  it('gen 1: steel, dark and fairy do not appear in any bucket', () => {
    const m = computeMatchups(['normal'], 1);
    expect(m).toEqual(genSplitMatchupsForSide(['normal'], 1));
    const types = allAttacking(m);
    expect(types).not.toContain('steel');
    expect(types).not.toContain('dark');
    expect(types).not.toContain('fairy');
  });

  it('gen 2 steel: resists dark/ghost, fairy absent; gen 9 steel does not resist them', () => {
    const g2 = computeMatchups(['steel'], 2);
    expect(g2).toEqual(genSplitMatchupsForSide(['steel'], 2));
    expect(g2.resist).toContain('dark');
    expect(g2.resist).toContain('ghost');
    expect(allAttacking(g2)).not.toContain('fairy');

    const g9 = computeMatchups(['steel'], 9);
    expect(g9).toEqual(genSplitMatchupsForSide(['steel'], 9));
    expect(g9.resist).not.toContain('dark');
    expect(g9.resist).not.toContain('ghost');
    /* Fairy is on the gen-9 chart (absent in gen 2). Bucket follows
     * genSplitMatchupsForSide / @pkmn/data, not a hand-maintained SE list. */
    expect(allAttacking(g9)).toContain('fairy');
  });
});

describe('genOfVersionGroup', () => {
  it('maps move-pool version groups to the @pkmn generation number', () => {
    expect(genOfVersionGroup('red-blue')).toBe(1);
    expect(genOfVersionGroup('yellow')).toBe(1);
    expect(genOfVersionGroup('gold-silver')).toBe(2);
    expect(genOfVersionGroup('firered-leafgreen')).toBe(3);
    expect(genOfVersionGroup('x-y')).toBe(6);
    expect(genOfVersionGroup('scarlet-violet')).toBe(9);
  });

  it('defaults to gen 9 when the version group is missing', () => {
    expect(genOfVersionGroup(undefined)).toBe(9);
    expect(genOfVersionGroup('')).toBe(9);
  });
});
