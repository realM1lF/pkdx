import { describe, expect, it } from 'vitest';
import { bestCatchByBst, wildSpeciesCount } from './route-stats';

const rows = [
  { id: 16, isStatic: false, chance: 50 },
  { id: 19, isStatic: false, chance: 50 },
  { id: 143, isStatic: true, chance: 100 },
];

const dex = {
  '16': { bst: 251 },
  '19': { bst: 253 },
  '143': { bst: 540 },
};

describe('route-stats', () => {
  it('does not count statics as wild species', () => {
    expect(wildSpeciesCount(rows)).toBe(2);
  });

  it('picks best catch from wild BST only, ignoring gifts', () => {
    expect(bestCatchByBst(rows, dex)).toEqual({ id: 19, bst: 253 });
  });
});
