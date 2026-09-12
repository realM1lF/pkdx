import { describe, expect, it } from 'vitest';
import { getSpeciesStats } from './species-stats';
import { speciesStatsViewFromTool } from './species-stats-view';

describe('speciesStatsViewFromTool', () => {
  it('maps Gen I Glurak special onto the combat block', () => {
    const result = getSpeciesStats('Glurak', 'rote Edition');
    const view = speciesStatsViewFromTool(result);
    expect(view).toMatchObject({
      id: 6,
      slug: 'charizard',
      gen: 1,
      types: ['fire', 'flying'],
    });
    expect(view?.block.speed).toBe(100);
    expect(view?.block['special-attack']).toBe(85);
    expect(view?.bst).toBe(425);
  });

  it('rejects failed tool payloads', () => {
    expect(speciesStatsViewFromTool({ ok: false, error: 'unknown_species' })).toBeNull();
    expect(speciesStatsViewFromTool(null)).toBeNull();
  });
});
