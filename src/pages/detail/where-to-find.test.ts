/* WhereToFind aggregation (encounter-consistency fix): gift/static/trade
 * encounters must be flagged `special` with version + sub-area tracking so
 * the UI never presents them as wild encounters, and node resolution keeps
 * the specific sub-area label ('PRIZE CORNER') for the display. */
import { describe, expect, it } from 'vitest';
import { aggregate, encounterVersions, mapsPath } from '@/lib/wherefind';

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

const ROUTE_1_FR_HG = [
  area('kanto-route-1-area', [
    ['firered', [['walk', 20, 2, 4]]],
    ['heartgold', [['walk', 45, 2, 3]]],
  ]),
];

describe('aggregate version filter', () => {
  it('with filter firered keeps only the FRLG rate at the same location', () => {
    const rows = aggregate(ROUTE_1_FR_HG, 'firered');
    expect(rows).toHaveLength(1);
    const r = rows[0]!;
    expect(r.nodeId).toBe('kanto-route-1');
    expect(r.maxChance).toBe(20);
    expect(r.versions).toEqual(['firered']);
  });

  it('without filter keeps both versions labeled on one row (best rate)', () => {
    const rows = aggregate(ROUTE_1_FR_HG);
    expect(rows).toHaveLength(1);
    const r = rows[0]!;
    expect(r.nodeId).toBe('kanto-route-1');
    expect(r.maxChance).toBe(45);
    expect(r.versions).toEqual(['firered', 'heartgold']);
  });

  it('keeps gift/static in a dedicated special row when unfiltered', () => {
    const rows = aggregate([
      ...ROUTE_1_FR_HG,
      area('celadon-city-prize-corner', [['blue-japan', [['gift', 100, 36, 36]]]]),
    ]);
    const wild = rows.filter((r) => !r.special);
    const special = rows.filter((r) => r.special);
    expect(wild).toHaveLength(1);
    expect(special).toHaveLength(1);
    expect(special[0]!.versions).toEqual(['blue-japan']);
  });

  it('drops other-version gifts when filtering firered', () => {
    const rows = aggregate(
      [
        ...ROUTE_1_FR_HG,
        area('celadon-city-prize-corner', [['blue-japan', [['gift', 100, 36, 36]]]]),
      ],
      'firered',
    );
    expect(rows).toHaveLength(1);
    expect(rows[0]!.special).toBe(false);
    expect(rows[0]!.versions).toEqual(['firered']);
  });

  it('keeps same-version gift split from wild when filtering firered', () => {
    const rows = aggregate(
      [
        area('kanto-route-1-area', [['firered', [['walk', 20, 2, 4]]]]),
        area('celadon-city-prize-corner', [['firered', [['gift', 100, 8, 8]]]]),
      ],
      'firered',
    );
    expect(rows.filter((r) => r.special)).toHaveLength(1);
    expect(rows.filter((r) => !r.special)).toHaveLength(1);
  });

  it('takes MAX per method and does not mix rods', () => {
    const rows = aggregate([
      area('kanto-route-1-area', [
        [
          'firered',
          [
            ['old-rod', 40, 5, 10],
            ['super-rod', 60, 15, 25],
            ['super-rod', 10, 20, 30],
          ],
        ],
      ]),
    ]);
    expect(rows[0]!.maxChance).toBe(70);
  });

  it('with filter heartgold uses HG rate and levels, not FireRed', () => {
    const rows = aggregate(ROUTE_1_FR_HG, 'heartgold');
    expect(rows).toHaveLength(1);
    expect(rows[0]!.maxChance).toBe(45);
    expect(rows[0]!.minLevel).toBe(2);
    expect(rows[0]!.maxLevel).toBe(3);
    expect(rows[0]!.versions).toEqual(['heartgold']);
  });

  it('unknown version yields no rows (UI treats unknown ?v= as all)', () => {
    expect(aggregate(ROUTE_1_FR_HG, 'sword')).toHaveLength(0);
  });

  it('null/empty version behaves like no filter', () => {
    const open = aggregate(ROUTE_1_FR_HG);
    expect(aggregate(ROUTE_1_FR_HG, null)).toEqual(open);
    expect(aggregate(ROUTE_1_FR_HG, '')).toEqual(open);
  });
});

describe('encounterVersions', () => {
  it('lists unique versions sorted for chip rendering', () => {
    expect(encounterVersions(ROUTE_1_FR_HG)).toEqual(['firered', 'heartgold']);
  });

  it('skips versions that have no encounter details', () => {
    expect(
      encounterVersions([
        area('kanto-route-1-area', [['firered', [['walk', 20, 2, 4]]]]),
        {
          location_area: { name: 'kanto-route-1-area', url: '' },
          version_details: [{ version: { name: 'yellow' }, max_chance: 0, encounter_details: [] }],
        },
      ]),
    ).toEqual(['firered']);
  });
});

describe('mapsPath', () => {
  it('includes node and version query params', () => {
    expect(mapsPath('kanto', 'kanto-route-1', 'firered')).toBe('/maps/kanto?node=kanto-route-1&v=firered');
  });

  it('omits v when no version is selected', () => {
    expect(mapsPath('kanto', 'kanto-route-1', null)).toBe('/maps/kanto?node=kanto-route-1');
    expect(mapsPath('kanto', 'kanto-route-1')).toBe('/maps/kanto?node=kanto-route-1');
  });
});
