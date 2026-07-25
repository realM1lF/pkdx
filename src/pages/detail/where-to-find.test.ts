/* WhereToFind aggregation (encounter-consistency fix): gift/static/trade
 * encounters must be flagged `special` with version + sub-area tracking so
 * the UI never presents them as wild encounters, and node resolution keeps
 * the specific sub-area label ('PRIZE CORNER') for the display. */
import { describe, expect, it } from 'vitest';
import { aggregate } from '@/lib/wherefind';

const area = (
  name: string,
  versions: Array<[string, Array<[string, number, number, number]>]>,
) => ({
  location_area: { name, url: `https://pokeapi.co/api/v2/location-area/${name}/` },
  version_details: versions.map(([v, dets]) => ({
    version: { name: v },
    max_chance: Math.max(...dets.map((d) => d[1])),
    encounter_details: dets.map(([m, chance, min, max]) => ({
      chance,
      min_level: min,
      max_level: max,
      method: { name: m },
    })),
  })),
});

describe('aggregate', () => {
  it('flags a game-corner prize as special with node, sub-area and versions', () => {
    /* Clefable: celadon prize corner, gift, Blue JP only — the Anlass-Fall */
    const rows = aggregate([
      area('celadon-city-prize-corner', [['blue-japan', [['gift', 100, 36, 36]]]]),
    ]);
    expect(rows).toHaveLength(1);
    const r = rows[0]!;
    expect(r.nodeId).toBe('celadon-city');
    expect(r.region?.region).toBe('kanto');
    expect(r.sub).toBe('PRIZE CORNER');
    expect(r.special).toBe(true);
    expect(r.versions).toEqual(['blue-japan']);
  });

  it('keeps wild encounters non-special and aggregates per node', () => {
    const rows = aggregate([
      area('mt-moon-1f', [['firered', [['walk', 5, 8, 8]]]]),
      area('mt-moon-b2f', [['leafgreen', [['walk', 10, 10, 12]]]]),
    ]);
    expect(rows).toHaveLength(1);
    const r = rows[0]!;
    expect(r.nodeId).toBe('mt-moon');
    expect(r.special).toBe(false);
    expect(r.sub).toBeNull(); // mixed sub-areas → no single sub label
    expect(r.maxChance).toBe(10);
    expect(r.minLevel).toBe(8);
    expect(r.maxLevel).toBe(12);
    expect(r.versions).toEqual(['firered', 'leafgreen']);
  });

  it('treats a node with both wild and gift methods as wild', () => {
    const rows = aggregate([
      area('celadon-city-area', [['firered', [['surf', 99, 5, 40]]]]),
      area('celadon-city-prize-corner', [['firered', [['gift', 100, 8, 8]]]]),
    ]);
    const r = rows[0]!;
    expect(r.nodeId).toBe('celadon-city');
    expect(r.special).toBe(false); // wild present → row is a wild row
  });

  it('flags pokeflute/npc-trade as special (one-off events, not wild)', () => {
    const rows = aggregate([
      area('kanto-route-12-area', [['firered', [['pokeflute', 100, 30, 30]]]]),
      area('kanto-route-2-area', [['red', [['npc-trade', 100, 5, 5]]]]),
    ]);
    expect(rows.map((r) => r.special)).toEqual([true, true]);
    expect(rows.map((r) => r.nodeId)).toEqual(['kanto-route-12', 'kanto-route-2']);
  });

  it('leaves unmapped areas node-less with the raw display label', () => {
    const rows = aggregate([
      area('motostoke-riverbank-area', [['sword', [['walk', 5, 10, 13]]]]),
    ]);
    const r = rows[0]!;
    expect(r.nodeId).toBeNull();
    expect(r.label).toBe('Motostoke Riverbank');
  });
});
