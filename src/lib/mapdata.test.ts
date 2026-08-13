/* Encounter-method classification invariants (encounter-consistency fix).
 * Guards the method census: one-off event methods (Poké Flute, trades,
 * Squirt Bottle, Devon Scope) must stay out of the wild buckets, and the
 * fishing/surfing/walking variants must land in their proper bucket. */
import { describe, expect, it } from 'vitest';
import { aggregateArea, areaShortLabel, methodBucket, spawnLeaders, STATIC_METHODS, summarizeAreas } from './mapdata';
import type { NodeMapData } from './mapdata';
import routesKantoJson from '@/data/routes-kanto.json';
import routesHoennJson from '@/data/routes-hoenn.json';

interface SnapRow {
  slug: string;
  method: string;
  chance: number;
  isStatic?: boolean;
}
interface SnapNode {
  versions: Record<string, Array<{ rows: SnapRow[] }>>;
}

function det(
  chance: number,
  method: string,
  conditions: string[] = [],
  min = 2,
  max = 4,
) {
  return {
    chance,
    min_level: min,
    max_level: max,
    method: { name: method, url: '' },
    condition_values: conditions.map((name) => ({ name, url: '' })),
  };
}

function areaOf(
  areaName: string,
  version: string,
  species: Array<{ slug: string; id: number; details: ReturnType<typeof det>[] }>,
) {
  return {
    id: 1,
    name: areaName,
    pokemon_encounters: species.map((s) => ({
      pokemon: { name: s.slug, url: `https://pokeapi.co/api/v2/pokemon/${s.id}/` },
      version_details: [
        {
          version: { name: version, url: '' },
          max_chance: 999,
          encounter_details: s.details,
        },
      ],
    })),
  };
}

describe('aggregateArea chance semantics', () => {
  const area = {
    id: 1,
    name: 'kanto-route-19-area',
    pokemon_encounters: [
      {
        pokemon: { name: 'horsea', url: 'https://pokeapi.co/api/v2/pokemon/116/' },
        version_details: [
          {
            version: { name: 'firered', url: '' },
            /* raw PokéAPI max_chance would be 170 — summing across mutually
               exclusive methods must never happen */
            max_chance: 170,
            encounter_details: [
              { chance: 40, min_level: 5, max_level: 10, method: { name: 'old-rod', url: '' } },
              { chance: 60, min_level: 5, max_level: 15, method: { name: 'good-rod', url: '' } },
              { chance: 60, min_level: 15, max_level: 25, method: { name: 'super-rod', url: '' } },
              { chance: 10, min_level: 20, max_level: 30, method: { name: 'super-rod', url: '' } },
            ],
          },
        ],
      },
    ],
  };

  it('sums slots per method, then takes the max across methods (never > 100)', () => {
    const g = aggregateArea(area, 'kanto-route-19', 'firered');
    const horsea = g.entries.find((e) => e.slug === 'horsea');
    expect(horsea).toBeDefined();
    /* super-rod 60+10=70 is the best bucket; old-rod 40, good-rod 60 */
    expect(horsea!.maxChance).toBe(70);
    expect(horsea!.maxChance).toBeLessThanOrEqual(100);
    expect(horsea!.minLevel).toBe(5);
    expect(horsea!.maxLevel).toBe(30);
    expect(horsea!.methods).toEqual(['FISH']);
  });
});

describe('methodBucket', () => {
  it('classifies the rod family as FISH', () => {
    for (const m of ['old-rod', 'good-rod', 'super-rod', 'super-rod-spots']) {
      expect(methodBucket(m)).toBe('FISH');
    }
  });

  it('classifies water walking variants as SURF', () => {
    expect(methodBucket('surf')).toBe('SURF');
    expect(methodBucket('surf-spots')).toBe('SURF');
  });

  it('classifies tree/overhead wild variants as WALK', () => {
    for (const m of ['walk', 'dark-grass', 'grass-spots', 'honey-tree', 'honey-trees']) {
      expect(methodBucket(m)).toBe('WALK');
    }
  });

  it('classifies headbutt as OTHER (own chip, not grass)', () => {
    for (const m of ['headbutt', 'headbutt-low', 'headbutt-normal', 'headbutt-high']) {
      expect(methodBucket(m)).toBe('OTHER');
    }
  });

  it('classifies the swarm method as OTHER, not WALK', () => {
    expect(methodBucket('swarm')).toBe('OTHER');
  });

  it('keeps one-off event methods out of the wild buckets', () => {
    for (const m of ['gift', 'gift-egg', 'only-one', 'static', 'pokeflute', 'npc-trade', 'squirt-bottle', 'devon-scope', 'feebas-tile-fishing']) {
      expect(methodBucket(m)).toBe('OTHER');
      expect(STATIC_METHODS.has(m)).toBe(true);
    }
  });
});

describe('areaShortLabel', () => {
  it('maps the main area to MAIN (not AREA)', () => {
    expect(areaShortLabel('celadon-city-area', 'celadon-city')).toBe('MAIN');
    expect(areaShortLabel('mt-moon-area', 'mt-moon')).toBe('MAIN');
  });

  it('derives floor/section labels', () => {
    expect(areaShortLabel('mt-moon-b1f', 'mt-moon')).toBe('B1F');
    expect(areaShortLabel('celadon-city-prize-corner', 'celadon-city')).toBe('PRIZE CORNER');
  });
});

describe('exclusive condition groups (time / swarm / radio / headbutt)', () => {
  it('takes MAX across time-of-day walk groups, never morning+day+night', () => {
    const g = aggregateArea(
      areaOf('kanto-route-1-area', 'gold', [
        {
          slug: 'rattata',
          id: 19,
          details: [
            det(30, 'walk', ['time-morning'], 2, 4),
            det(30, 'walk', ['time-day'], 2, 4),
            det(55, 'walk', ['time-night'], 2, 4),
          ],
        },
      ]),
      'kanto-route-1',
      'gold',
    );
    const rattata = g.entries.find((e) => e.slug === 'rattata' && e.methods.includes('WALK'));
    expect(rattata).toBeDefined();
    expect(rattata!.maxChance).toBe(55);
    expect(rattata!.maxChance).toBeLessThanOrEqual(100);
    expect(rattata!.methods).toEqual(['WALK']);
  });

  it('keeps swarm-yes off the WALK bucket (own chip, not grass)', () => {
    const g = aggregateArea(
      areaOf('kanto-route-1-area', 'heartgold', [
        {
          slug: 'poochyena',
          id: 261,
          details: [
            det(20, 'walk', ['swarm-yes'], 2, 3),
            det(20, 'walk', ['swarm-yes'], 2, 3),
          ],
        },
      ]),
      'kanto-route-1',
      'heartgold',
    );
    const pooch = g.entries.find((e) => e.slug === 'poochyena');
    expect(pooch).toBeDefined();
    expect(pooch!.maxChance).toBe(40);
    expect(pooch!.methods).not.toContain('WALK');
    expect(pooch!.methods).toEqual(['OTHER']);
    expect(pooch!.methodChip).toBe('swarm');
    expect(pooch!.isStatic).toBe(false);
  });

  it('keeps radio-hoenn / radio-sinnoh off the WALK bucket', () => {
    const g = aggregateArea(
      areaOf('kanto-route-1-area', 'heartgold', [
        {
          slug: 'plusle',
          id: 311,
          details: [det(20, 'walk', ['radio-hoenn'], 2, 3)],
        },
        {
          slug: 'shinx',
          id: 403,
          details: [det(20, 'walk', ['radio-sinnoh'], 2, 3), det(20, 'walk', ['radio-sinnoh'], 3, 3)],
        },
      ]),
      'kanto-route-1',
      'heartgold',
    );
    const plusle = g.entries.find((e) => e.slug === 'plusle');
    const shinx = g.entries.find((e) => e.slug === 'shinx');
    expect(plusle!.methods).toEqual(['OTHER']);
    expect(plusle!.methodChip).toBe('radio');
    expect(plusle!.maxChance).toBe(20);
    expect(shinx!.methods).toEqual(['OTHER']);
    expect(shinx!.methodChip).toBe('radio');
    expect(shinx!.maxChance).toBe(40);
    expect(plusle!.isStatic).toBe(false);
  });

  it('takes MAX across exclusive headbutt tree types, not WALK', () => {
    const g = aggregateArea(
      areaOf('kanto-route-1-area', 'gold', [
        {
          slug: 'hoothoot',
          id: 163,
          details: [
            det(50, 'headbutt', ['headbutt-tree-common'], 2, 4),
            det(50, 'headbutt', ['headbutt-tree-rare'], 2, 4),
          ],
        },
      ]),
      'kanto-route-1',
      'gold',
    );
    const hoot = g.entries.find((e) => e.slug === 'hoothoot');
    expect(hoot).toBeDefined();
    expect(hoot!.maxChance).toBe(50);
    expect(hoot!.methods).toEqual(['OTHER']);
    expect(hoot!.methodChip).toBe('headbutt');
    expect(hoot!.isStatic).toBe(false);
  });
});

describe('feebas-tile-fishing is not a route-wide FISH rate', () => {
  it('classifies feebas-tile-fishing as static-like OTHER, not FISH', () => {
    expect(methodBucket('feebas-tile-fishing')).toBe('OTHER');
    expect(STATIC_METHODS.has('feebas-tile-fishing')).toBe(true);
  });

  it('marks Feebas tile fishing static so leaderboards skip it', () => {
    const g = aggregateArea(
      areaOf('hoenn-route-119-area', 'emerald', [
        {
          slug: 'feebas',
          id: 349,
          details: [det(50, 'feebas-tile-fishing', [], 20, 25)],
        },
        {
          slug: 'magikarp',
          id: 129,
          details: [det(70, 'old-rod', [], 5, 10)],
        },
      ]),
      'hoenn-route-119',
      'emerald',
    );
    const feebas = g.entries.find((e) => e.slug === 'feebas');
    const carp = g.entries.find((e) => e.slug === 'magikarp');
    expect(feebas!.isStatic).toBe(true);
    expect(feebas!.methods).toEqual(['OTHER']);
    expect(feebas!.methodChip).toBe('feebas');
    expect(feebas!.maxChance).toBe(50);
    expect(carp!.isStatic).toBe(false);
    expect(carp!.methods).toEqual(['FISH']);

    const nd: NodeMapData = {
      nodeId: 'hoenn-route-119',
      status: 'loaded',
      areas: [g],
      pokemonCount: 2,
      bestRate: 70,
      methodTop: { FISH: 70 },
    };
    const { common } = spawnLeaders(new Map([['hoenn-route-119', nd]]));
    expect(common.map((c) => c.slug)).not.toContain('feebas');
    expect(common.map((c) => c.slug)).toContain('magikarp');
  });
});

describe('static vs wild split and per-bucket rates', () => {
  it('splits Walk and Static into separate rows (Kecleon grass stays wild)', () => {
    const g = aggregateArea(
      areaOf('hoenn-route-119-area', 'emerald', [
        {
          slug: 'kecleon',
          id: 352,
          details: [
            det(1, 'walk', [], 10, 20),
            det(100, 'devon-scope', [], 30, 30),
            det(100, 'devon-scope', [], 30, 30),
          ],
        },
      ]),
      'hoenn-route-119',
      'emerald',
    );
    const rows = g.entries.filter((e) => e.slug === 'kecleon');
    expect(rows).toHaveLength(2);
    const walk = rows.find((e) => e.methods.includes('WALK'));
    const stat = rows.find((e) => e.isStatic);
    expect(walk).toBeDefined();
    expect(walk!.isStatic).toBe(false);
    expect(walk!.maxChance).toBe(1);
    expect(stat).toBeDefined();
    expect(stat!.methods).toEqual(['OTHER']);
    expect(stat!.maxChance).toBe(100);
  });

  it('caps duplicate static slots with MAX, never 200+', () => {
    const g = aggregateArea(
      areaOf('hoenn-route-120-area', 'omega-ruby', [
        {
          slug: 'kecleon',
          id: 352,
          details: [
            det(100, 'devon-scope', [], 30, 30),
            det(100, 'devon-scope', [], 30, 30),
            det(100, 'devon-scope', [], 30, 30),
          ],
        },
      ]),
      'hoenn-route-120',
      'omega-ruby',
    );
    const k = g.entries.find((e) => e.slug === 'kecleon');
    expect(k!.maxChance).toBe(100);
    expect(k!.isStatic).toBe(true);
  });

  it('stores per-bucket chance so Walk 20% is not overwritten by Fish 70%', () => {
    const g = aggregateArea(
      areaOf('kanto-route-12-area', 'firered', [
        {
          slug: 'pidgey',
          id: 16,
          details: [det(20, 'walk', [], 23, 27)],
        },
        {
          slug: 'tentacool',
          id: 72,
          details: [det(70, 'super-rod', [], 15, 25)],
        },
        {
          slug: 'snorlax',
          id: 143,
          details: [det(100, 'pokeflute', [], 30, 30)],
        },
      ]),
      'kanto-route-12',
      'firered',
    );
    const pidgey = g.entries.find((e) => e.slug === 'pidgey');
    const tent = g.entries.find((e) => e.slug === 'tentacool');
    const snorlax = g.entries.find((e) => e.slug === 'snorlax');
    expect(pidgey!.chanceByMethod.WALK).toBe(20);
    expect(tent!.chanceByMethod.FISH).toBe(70);
    expect(snorlax!.chanceByMethod.OTHER).toBe(100);
    expect(pidgey!.maxChance).toBe(20);
    expect(tent!.maxChance).toBe(70);
  });
});

describe('summarizeAreas KPIs', () => {
  it('sets methodTop from per-bucket chance and bestRate from wild only', () => {
    const g = aggregateArea(
      areaOf('kanto-route-12-area', 'firered', [
        {
          slug: 'pidgey',
          id: 16,
          details: [det(20, 'walk', [], 23, 27)],
        },
        {
          slug: 'tentacool',
          id: 72,
          details: [det(70, 'super-rod', [], 15, 25)],
        },
        {
          slug: 'snorlax',
          id: 143,
          details: [det(100, 'pokeflute', [], 30, 30)],
        },
      ]),
      'kanto-route-12',
      'firered',
    );
    const kpi = summarizeAreas([g]);
    expect(kpi.methodTop.WALK).toBe(20);
    expect(kpi.methodTop.FISH).toBe(70);
    expect(kpi.methodTop.OTHER).toBe(100);
    expect(kpi.bestRate).toBe(70);
    expect(kpi.pokemonCount).toBe(3);
  });
});

describe('generated SEO snapshots (condition-aware aggregation)', () => {
  const kanto = routesKantoJson.nodes as unknown as Record<string, SnapNode>;
  const hoenn = routesHoennJson.nodes as unknown as Record<string, SnapNode>;

  it('Gold Rattata on Route 1 is WALK 55, never morning+day+night', () => {
    const rows = kanto['kanto-route-1'].versions.gold.flatMap((g) => g.rows);
    const rattata = rows.filter((r) => r.slug === 'rattata');
    expect(rattata.length).toBeGreaterThan(0);
    for (const r of rattata) {
      expect(r.chance).toBeLessThanOrEqual(100);
      if (r.method === 'WALK') expect(r.chance).toBe(55);
    }
  });

  it('no Kanto/Hoenn snapshot row exceeds 100%', () => {
    for (const pack of [kanto, hoenn]) {
      for (const nd of Object.values(pack)) {
        for (const groups of Object.values(nd.versions)) {
          for (const g of groups) {
            for (const r of g.rows) expect(r.chance).toBeLessThanOrEqual(100);
          }
        }
      }
    }
  });

  it('HGSS swarm/radio/headbutt are OTHER, not WALK grass', () => {
    const rows = kanto['kanto-route-1'].versions.heartgold.flatMap((g) => g.rows);
    const bySlug = (slug: string) => rows.filter((r) => r.slug === slug);
    expect(bySlug('poochyena').every((r) => r.method === 'OTHER')).toBe(true);
    expect(bySlug('plusle').every((r) => r.method === 'OTHER')).toBe(true);
    expect(bySlug('shinx').every((r) => r.method === 'OTHER')).toBe(true);
    const hootHead = bySlug('hoothoot').find((r) => r.method === 'OTHER');
    expect(hootHead).toBeDefined();
    expect(hootHead!.chance).toBe(50);
  });

  it('Feebas on Route 119 is STATIC, not FISH; Kecleon grass is not static', () => {
    const rows = hoenn['hoenn-route-119'].versions.emerald.flatMap((g) => g.rows);
    const feebas = rows.filter((r) => r.slug === 'feebas');
    expect(feebas.length).toBeGreaterThan(0);
    for (const r of feebas) {
      expect(r.method).toBe('STATIC');
      expect(r.isStatic).toBe(true);
      expect(r.chance).toBe(50);
    }
    const kecleon = rows.filter((r) => r.slug === 'kecleon');
    const walk = kecleon.find((r) => r.method === 'WALK');
    const stat = kecleon.find((r) => r.method === 'STATIC');
    expect(walk!.isStatic).toBe(false);
    expect(walk!.chance).toBe(1);
    expect(stat!.isStatic).toBe(true);
    expect(stat!.chance).toBe(100);
  });
});
