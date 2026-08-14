/* Shared Region Contract — defaults, postGame flags, additive nodes, graph edges. */
import { describe, expect, it } from 'vitest';
import { regionById, versionLabel } from './regions';
import { resolveInteractiveMapLink } from './interactive-maps';
import hoennGeo from '@/data/regions/hoenn-geo.json';
import johtoGeo from '@/data/regions/johto-geo.json';
import kantoGeo from '@/data/regions/kanto-geo.json';
import sinnohGeo from '@/data/regions/sinnoh-geo.json';
import unovaGeo from '@/data/regions/unova-geo.json';
import itemsSinnoh from '@/data/items-sinnoh.json';
import itemsUnova from '@/data/items-unova.json';
import i18n from '@/i18n';
import de from '@/i18n/locales/de/translation.json';

function nodeIds(regionId: string): Set<string> {
  return new Set(regionById(regionId)!.nodes.map((n) => n.id));
}

function hasEdge(regionId: string, a: string, b: string): boolean {
  return regionById(regionId)!.edges.some(
    (e) => (e.from === a && e.to === b) || (e.from === b && e.to === a),
  );
}

describe('johto region contract', () => {
  it('defaults to HeartGold (GSC chips stay available)', () => {
    const j = regionById('johto')!;
    expect(j.defaultVersion).toBe('heartgold');
    expect(j.versions).toEqual(['gold', 'silver', 'crystal', 'heartgold', 'soulsilver']);
  });

  it('includes HGSS Safari Zone, Route 47, Route 48, Cliff Cave', () => {
    const ids = nodeIds('johto');
    expect(ids.has('johto-safari-zone')).toBe(true);
    expect(ids.has('johto-route-47')).toBe(true);
    expect(ids.has('johto-route-48')).toBe(true);
    expect(ids.has('cliff-cave')).toBe(true);
    const safari = regionById('johto')!.nodes.find((n) => n.id === 'johto-safari-zone')!;
    expect(safari.nameDe).toBe('Safari-Zone');
    expect(safari.locationSlug).toBe('johto-safari-zone');
    expect(regionById('johto')!.nodes.find((n) => n.id === 'cliff-cave')!.nameDe).toBe('Felsenhöhle');
  });

  it('wires Cianwood to the Safari cluster', () => {
    expect(hasEdge('johto', 'cianwood-city', 'johto-route-47')).toBe(true);
    expect(hasEdge('johto', 'johto-route-47', 'cliff-cave')).toBe(true);
    expect(hasEdge('johto', 'johto-route-47', 'johto-route-48')).toBe(true);
    expect(hasEdge('johto', 'johto-route-48', 'safari-zone-gate')).toBe(true);
    expect(hasEdge('johto', 'safari-zone-gate', 'johto-safari-zone')).toBe(true);
    expect(hasEdge('johto', 'johto-route-48', 'johto-safari-zone')).toBe(false);
  });
});

describe('johto remaining map data', () => {
  const remaining = [
    { id: 'johto-lighthouse', locationSlug: 'johto-lighthouse', nameDe: 'Leuchtturm', label: 'Olivine Lighthouse', kind: 'dungeon', order: 48 },
    { id: 'radio-tower', locationSlug: 'radio-tower', nameDe: 'Radio-Turm', label: 'Radio Tower', kind: 'dungeon', order: 49 },
    { id: 'goldenrod-tunnel', locationSlug: 'goldenrod-tunnel', nameDe: 'Dukatia-Passage', label: 'Goldenrod Tunnel', kind: 'dungeon', order: 50 },
    { id: 'team-rocket-hq', locationSlug: 'team-rocket-hq', nameDe: 'Team Rocket-Hauptquartier', label: 'Team Rocket HQ', kind: 'dungeon', order: 51 },
    { id: 'tohjo-falls', locationSlug: 'tohjo-falls', nameDe: 'Tohjo-Fälle', label: 'Tohjo Falls', kind: 'dungeon', order: 52 },
    { id: 'ss-aqua', locationSlug: 'ss-aqua', nameDe: 'M.S. Aqua', label: 'S.S. Aqua', kind: 'dungeon', order: 53 },
    { id: 'safari-zone-gate', locationSlug: 'safari-zone-gate', nameDe: 'Safari-Eingang', label: 'Safari Zone Gate', kind: 'city', order: 54 },
    { id: 'embedded-tower', locationSlug: 'embedded-tower', nameDe: 'Felsenherzturm', label: 'Embedded Tower', kind: 'dungeon', order: 55 },
  ] as const;

  const remainingEdges: Array<[string, string]> = [
    ['olivine-city', 'johto-lighthouse'],
    ['goldenrod-city', 'radio-tower'],
    ['goldenrod-city', 'goldenrod-tunnel'],
    ['mahogany-town', 'team-rocket-hq'],
    ['new-bark-town', 'tohjo-falls'],
    ['olivine-city', 'ss-aqua'],
    ['johto-route-48', 'safari-zone-gate'],
    ['safari-zone-gate', 'johto-safari-zone'],
    ['johto-route-47', 'embedded-tower'],
  ];

  it('includes remaining HGSS landmarks', () => {
    const ids = nodeIds('johto');
    for (const n of remaining) {
      expect(ids.has(n.id), n.id).toBe(true);
    }
  });

  it('sets nameDe, locationSlug, label, kind, and order on each new node', () => {
    const byId = new Map(regionById('johto')!.nodes.map((n) => [n.id, n]));
    for (const spec of remaining) {
      const node = byId.get(spec.id);
      expect(node, spec.id).toBeDefined();
      expect(node!.nameDe, spec.id).toBe(spec.nameDe);
      expect(node!.locationSlug, spec.id).toBe(spec.locationSlug);
      expect(node!.label, spec.id).toBe(spec.label);
      expect(node!.kind, spec.id).toBe(spec.kind);
      expect(node!.order, spec.id).toBe(spec.order);
      expect(node!.x === 0 && node!.y === 0, `${spec.id} stacked at 0,0`).toBe(false);
    }
  });

  it('marks Embedded Tower postGame', () => {
    expect(regionById('johto')!.nodes.find((n) => n.id === 'embedded-tower')!.postGame).toBe(true);
  });

  it('wires remaining landmarks to their neighbors', () => {
    for (const [a, b] of remainingEdges) {
      expect(hasEdge('johto', a, b), `${a}–${b}`).toBe(true);
    }
  });

  it('uses a water edge for S.S. Aqua', () => {
    const edges = regionById('johto')!.edges;
    expect(
      edges.some(
        (e) =>
          e.kind === 'water' &&
          ((e.from === 'olivine-city' && e.to === 'ss-aqua') ||
            (e.from === 'ss-aqua' && e.to === 'olivine-city')),
      ),
    ).toBe(true);
  });

  it('has a geo marker for every johto node and no orphan geo keys', () => {
    expect(johtoGeo.version).toBe('goldsilver');
    const ids = nodeIds('johto');
    const geoIds = new Set(Object.keys(johtoGeo.nodes));
    for (const n of remaining) {
      expect(geoIds.has(n.id), `missing geo for ${n.id}`).toBe(true);
    }
    for (const id of ids) {
      expect(geoIds.has(id), `missing geo for ${id}`).toBe(true);
      const xy = johtoGeo.nodes[id as keyof typeof johtoGeo.nodes];
      expect(xy, id).toHaveLength(2);
      expect(xy[0], `${id} x`).toBeGreaterThanOrEqual(0);
      expect(xy[0], `${id} x`).toBeLessThanOrEqual(1);
      expect(xy[1], `${id} y`).toBeGreaterThanOrEqual(0);
      expect(xy[1], `${id} y`).toBeLessThanOrEqual(1);
    }
    for (const id of geoIds) {
      expect(ids.has(id), `orphan geo ${id}`).toBe(true);
    }
  });

  it('Johto league is johto-pokemon-league, not mt-silver', () => {
    const ids = nodeIds('johto');
    expect(ids.has('johto-pokemon-league')).toBe(true);
    const n = regionById('johto')!.nodes.find((x) => x.id === 'johto-pokemon-league')!;
    expect(n.nameDe).toBe('Pokémon Liga');
    expect(n.label).toBe('Pokémon League');
    expect(n.kind).toBe('special');
    expect(n.locationSlug).toBe('indigo-plateau');
    expect(n.postGame).toBeFalsy();
    expect(hasEdge('johto', 'tohjo-falls', 'johto-pokemon-league')).toBe(true);
    expect(johtoGeo.nodes['johto-pokemon-league']).toEqual(expect.any(Array));
  });
});

describe('hoenn numbered routes', () => {
  const missing = [106, 107, 115, 122, 123, 125, 126, 127, 130, 131, 132, 133, 134];

  it('includes every previously missing numbered route', () => {
    const ids = nodeIds('hoenn');
    for (const n of missing) {
      expect(ids.has(`hoenn-route-${n}`), `hoenn-route-${n}`).toBe(true);
    }
  });

  it('connects Dewford to Slateport via 106/107 and Pacifidlog via 130–134', () => {
    expect(hasEdge('hoenn', 'dewford-town', 'hoenn-route-106')).toBe(true);
    expect(hasEdge('hoenn', 'hoenn-route-106', 'hoenn-route-107')).toBe(true);
    expect(hasEdge('hoenn', 'hoenn-route-107', 'hoenn-route-108')).toBe(true);
    expect(hasEdge('hoenn', 'hoenn-route-122', 'mt-pyre')).toBe(true);
    expect(hasEdge('hoenn', 'hoenn-route-123', 'hoenn-route-118')).toBe(true);
    expect(hasEdge('hoenn', 'pacifidlog-town', 'hoenn-route-132')).toBe(true);
    expect(hasEdge('hoenn', 'hoenn-route-134', 'hoenn-route-109')).toBe(true);
  });
});

describe('unova BW vs B2W2', () => {
  it('keeps Black as default', () => {
    expect(regionById('unova')!.defaultVersion).toBe('black');
  });

  it('marks B2W2-only nodes postGame', () => {
    const ids = [
      'aspertia-city',
      'floccesy-ranch',
      'virbank-city',
      'humilau-city',
      'unova-route-19',
      'unova-route-20',
      'unova-route-21',
      'unova-route-22',
      'unova-route-23',
    ];
    const byId = new Map(regionById('unova')!.nodes.map((n) => [n.id, n]));
    for (const id of ids) {
      expect(byId.get(id)?.postGame, id).toBe(true);
    }
  });

  it('adds missing BW routes and landmarks', () => {
    const ids = nodeIds('unova');
    expect(ids.has('unova-route-15')).toBe(true);
    expect(ids.has('unova-route-17')).toBe(true);
    expect(ids.has('unova-route-18')).toBe(true);
    expect(ids.has('village-bridge')).toBe(true);
    expect(ids.has('marvelous-bridge')).toBe(true);
    expect(ids.has('p2-laboratory')).toBe(true);
    expect(hasEdge('unova', 'unova-route-11', 'village-bridge')).toBe(true);
    expect(hasEdge('unova', 'village-bridge', 'unova-route-12')).toBe(true);
    expect(hasEdge('unova', 'undella-town', 'unova-route-18')).toBe(true);
    expect(hasEdge('unova', 'unova-route-17', 'p2-laboratory')).toBe(true);
  });
});

describe('unova remaining map data', () => {
  const remaining = [
    { id: 'ns-castle', locationSlug: 'ns-castle', nameDe: 'Schloss von N', label: "N's Castle", kind: 'dungeon', order: 57 },
    { id: 'cold-storage', locationSlug: 'cold-storage', nameDe: 'Tiefkühlcontainer', label: 'Cold Storage', kind: 'dungeon', order: 58 },
    { id: 'mistralton-cave', locationSlug: 'mistralton-cave', nameDe: 'Panaero-Höhle', label: 'Mistralton Cave', kind: 'dungeon', order: 59 },
    { id: 'challengers-cave', locationSlug: 'challengers-cave', nameDe: 'Höhle der Schulung', label: "Challenger's Cave", kind: 'dungeon', order: 60 },
    { id: 'driftveil-drawbridge', locationSlug: 'driftveil-drawbridge', nameDe: 'Marea-Zugbrücke', label: 'Driftveil Drawbridge', kind: 'special', order: 61 },
    { id: 'tubeline-bridge', locationSlug: 'tubeline-bridge', nameDe: 'Zylinderbrücke', label: 'Tubeline Bridge', kind: 'special', order: 62 },
    { id: 'undella-bay', locationSlug: 'undella-bay', nameDe: 'Bucht von Ondula', label: 'Undella Bay', kind: 'special', order: 63 },
    { id: 'abyssal-ruins', locationSlug: 'abyssal-ruins', nameDe: 'Unterwasserruine', label: 'Abyssal Ruins', kind: 'dungeon', order: 64 },
    { id: 'black-city', locationSlug: 'black-city', nameDe: 'Schwarze Stadt', label: 'Black City', kind: 'city', order: 65 },
    { id: 'white-forest', locationSlug: 'white-forest', nameDe: 'Weißer Wald', label: 'White Forest', kind: 'special', order: 66 },
  ] as const;

  const remainingEdges: Array<[string, string]> = [
    ['ns-castle', 'unova-victory-road'],
    ['cold-storage', 'driftveil-city'],
    ['mistralton-cave', 'unova-route-6'],
    ['challengers-cave', 'unova-route-13'],
    ['driftveil-drawbridge', 'unova-route-5'],
    ['driftveil-drawbridge', 'driftveil-city'],
    ['tubeline-bridge', 'unova-route-8'],
    ['tubeline-bridge', 'unova-route-9'],
    ['undella-bay', 'undella-town'],
    ['undella-bay', 'abyssal-ruins'],
    ['black-city', 'marvelous-bridge'],
    ['white-forest', 'marvelous-bridge'],
  ];

  it('includes remaining BW landmarks', () => {
    const ids = nodeIds('unova');
    for (const n of remaining) {
      expect(ids.has(n.id), n.id).toBe(true);
    }
  });

  it('sets nameDe, locationSlug, label, kind, and order on each new node', () => {
    const byId = new Map(regionById('unova')!.nodes.map((n) => [n.id, n]));
    for (const spec of remaining) {
      const node = byId.get(spec.id);
      expect(node, spec.id).toBeDefined();
      expect(node!.nameDe, spec.id).toBe(spec.nameDe);
      expect(node!.locationSlug, spec.id).toBe(spec.locationSlug);
      expect(node!.label, spec.id).toBe(spec.label);
      expect(node!.kind, spec.id).toBe(spec.kind);
      expect(node!.order, spec.id).toBe(spec.order);
      expect(node!.x === 0 && node!.y === 0, `${spec.id} stacked at 0,0`).toBe(false);
    }
  });

  it('pins Challenger\'s Cave postGame and N\'s Castle as story', () => {
    const byId = new Map(regionById('unova')!.nodes.map((n) => [n.id, n]));
    expect(byId.get('challengers-cave')!.postGame).toBe(true);
    expect(byId.get('ns-castle')!.postGame).toBeFalsy();
  });

  it('wires remaining landmarks to their neighbors', () => {
    for (const [a, b] of remainingEdges) {
      expect(hasEdge('unova', a, b), `${a}–${b}`).toBe(true);
    }
  });

  it('removes the three superseded land shortcuts', () => {
    expect(hasEdge('unova', 'unova-route-5', 'driftveil-city')).toBe(false);
    expect(hasEdge('unova', 'unova-route-8', 'opelucid-city')).toBe(false);
    expect(hasEdge('unova', 'unova-route-9', 'unova-route-11')).toBe(false);
  });

  it('keeps Moor, Marvelous Bridge, and Opelucid exits', () => {
    expect(hasEdge('unova', 'unova-route-8', 'moor-of-icirrus')).toBe(true);
    expect(hasEdge('unova', 'marvelous-bridge', 'unova-route-15')).toBe(true);
    expect(hasEdge('unova', 'opelucid-city', 'unova-route-9')).toBe(true);
    expect(hasEdge('unova', 'opelucid-city', 'unova-route-11')).toBe(true);
  });

  it('uses water edges for Undella Bay and Abyssal Ruins', () => {
    const edges = regionById('unova')!.edges;
    expect(
      edges.some(
        (e) =>
          e.kind === 'water' &&
          ((e.from === 'undella-town' && e.to === 'undella-bay') ||
            (e.from === 'undella-bay' && e.to === 'undella-town')),
      ),
    ).toBe(true);
    expect(
      edges.some(
        (e) =>
          e.kind === 'water' &&
          ((e.from === 'undella-bay' && e.to === 'abyssal-ruins') ||
            (e.from === 'abyssal-ruins' && e.to === 'undella-bay')),
      ),
    ).toBe(true);
  });

  it('has a geo marker for every unova node and no orphan geo keys', () => {
    expect(unovaGeo.version).toBe('black-2');
    expect(unovaGeo.image).toBe('/maps/unova-original.jpg');
    const ids = nodeIds('unova');
    const geoIds = new Set(Object.keys(unovaGeo.nodes));
    for (const n of remaining) {
      expect(geoIds.has(n.id), `missing geo for ${n.id}`).toBe(true);
    }
    for (const id of ids) {
      expect(geoIds.has(id), `missing geo for ${id}`).toBe(true);
      const xy = unovaGeo.nodes[id as keyof typeof unovaGeo.nodes];
      expect(xy, id).toHaveLength(2);
      expect(xy[0], `${id} x`).toBeGreaterThanOrEqual(0);
      expect(xy[0], `${id} x`).toBeLessThanOrEqual(1);
      expect(xy[1], `${id} y`).toBeGreaterThanOrEqual(0);
      expect(xy[1], `${id} y`).toBeLessThanOrEqual(1);
    }
    for (const id of geoIds) {
      expect(ids.has(id), `orphan geo ${id}`).toBe(true);
    }
  });
});

describe('unova black white items', () => {
  type ItemRow = { itemSlug: string; name: string; note: string; moveSlug?: string; pocket: string; hidden?: boolean };
  const catalog = itemsUnova as Record<string, ItemRow[]>;

  const requiredSlugs: Record<string, string[]> = {
    'striaton-city': ['pal-pad', 'great-ball', 'x-speed', 'full-heal', 'big-pearl'],
    'nuvema-town': ['town-map', 'xtransceiver', 'super-rod'],
    'unova-route-1': ['poke-ball', 'potion', 'max-ether', 'pearl', 'persim-berry'],
    'accumula-town': ['poke-ball', 'oran-berry'],
    'unova-route-2': ['potion', 'poke-ball', 'great-ball', 'rare-candy'],
    'dreamyard': ['twisted-spoon', 'hyper-potion', 'revive', 'paralyze-heal', 'x-defense', 'repel'],
    'unova-route-3': ['super-potion', 'heal-ball', 'great-ball', 'antidote', 'awakening', 'max-ether', 'full-heal', 'hp-up', 'repel'],
    'nacrene-city': ['dowsing-machine', 'light-stone', 'dark-stone', 'miracle-seed', 'charcoal', 'mystic-water'],
    'pinwheel-forest': ['dragon-skull', 'moon-stone', 'quick-claw', 'miracle-seed', 'silver-powder', 'big-root', 'net-ball', 'great-ball', 'super-potion'],
    'castelia-city': ['dusk-ball', 'master-ball', 'exp-share', 'amulet-coin', 'eviolite', 'choice-scarf', 'fire-stone', 'leaf-stone'],
    'unova-route-4': ['great-ball', 'super-potion', 'hyper-potion', 'ether', 'burn-heal', 'x-accuracy'],
    'desert-resort': ['rage-candy-bar', 'black-glasses', 'soft-sand', 'fire-stone', 'heart-scale', 'stardust', 'fresh-water'],
    'relic-castle': ['cover-fossil', 'plume-fossil', 'sun-stone', 'max-revive', 'max-potion', 'revive', 'pp-up'],
    'nimbasa-city': ['bicycle', 'vs-recorder', 'prop-case', 'sun-stone', 'soothe-bell', 'macho-brace', 'nugget', 'rare-candy'],
    'unova-route-5': ['great-ball', 'hyper-potion', 'revive', 'zinc'],
    'driftveil-drawbridge': ['health-wing', 'muscle-wing', 'resist-wing'],
    'driftveil-city': ['expert-belt', 'shell-bell', 'water-stone', 'heart-scale', 'big-pearl', 'ultra-ball', 'repeat-ball'],
    'cold-storage': ['never-melt-ice', 'rocky-helmet', 'net-ball', 'ice-heal', 'hyper-potion', 'ether', 'protein', 'heart-scale'],
    'unova-route-6': ['shiny-stone', 'leaf-stone', 'silk-scarf', 'hyper-potion', 'elixir'],
    'mistralton-cave': ['dusk-stone', 'hard-stone', 'iron', 'rare-candy', 'hyper-potion', 'revive', 'max-repel'],
    'chargestone-cave': ['lucky-egg', 'magnet', 'thunder-stone', 'bright-powder', 'heal-ball', 'timer-ball', 'nugget', 'rare-candy', 'hyper-potion', 'revive', 'paralyze-heal'],
    'mistralton-city': ['sharp-beak'],
    'unova-route-7': ['ultra-ball', 'max-ether', 'pp-up'],
    'celestial-tower': ['spell-tag', 'hyper-potion', 'revive'],
    'twist-mountain': ['moon-stone', 'nugget', 'pp-up', 'max-potion', 'ultra-ball', 'ether', 'full-heal', 'revive'],
    'icirrus-city': ['cleanse-tag', 'exp-share', 'rage-candy-bar'],
    'dragonspiral-tower': ['old-gateau', 'dragon-fang', 'shiny-stone', 'hyper-potion', 'revive', 'max-elixir', 'star-piece'],
    'unova-route-8': ['full-restore', 'damp-rock', 'heat-rock', 'icy-rock', 'smooth-rock', 'poison-barb', 'full-heal', 'ultra-ball'],
    'moor-of-icirrus': ['max-elixir', 'max-potion', 'max-revive', 'carbos', 'ultra-ball'],
    'opelucid-city': ['master-ball', 'cell-battery', 'destiny-knot', 'float-stone', 'ring-target'],
    'unova-route-9': ['full-restore', 'max-ether', 'hp-up', 'pp-up', 'thunder-stone', 'lemonade'],
    'unova-route-11': ['protector', 'hyper-potion', 'max-revive'],
    'village-bridge': ['dive-ball', 'leftovers', 'calcium'],
    'unova-route-12': ['full-heal', 'revive'],
    'lacunosa-town': ['gracidea'],
    'unova-route-13': ['prism-scale', 'reaper-cloth', 'razor-claw', 'electirizer', 'magmarizer', 'dubious-disc', 'up-grade', 'kings-rock', 'rare-candy', 'max-revive'],
    'challengers-cave': ['black-belt', 'oval-stone', 'nugget', 'protein', 'pp-up', 'timer-ball'],
    'unova-route-14': ['reaper-cloth', 'ultra-ball'],
    'abundant-shrine': ['razor-fang', 'rare-candy', 'hyper-potion'],
    'unova-route-16': ['rare-candy'],
    'lostlorn-forest': ['rare-candy', 'big-mushroom'],
    'marvelous-bridge': ['adamant-orb', 'lustrous-orb', 'griseous-orb'],
    'unova-route-15': ['up-grade'],
    'unova-route-10': ['max-revive', 'dawn-stone', 'dusk-stone', 'full-restore', 'full-heal', 'hyper-potion'],
    'unova-victory-road': ['calcium', 'rare-candy', 'nugget', 'max-revive', 'full-heal', 'ultra-ball'],
    'ns-castle': ['full-restore', 'max-potion', 'max-revive', 'rare-candy', 'ultra-ball'],
    'unova-route-18': ['max-elixir', 'dragon-scale', 'heart-scale'],
    'unova-route-17': ['deep-sea-tooth'],
    'p2-laboratory': ['dubious-disc'],
    'undella-bay': ['heart-scale', 'pearl'],
    'abyssal-ruins': ['relic-crown', 'relic-statue', 'relic-band', 'relic-vase', 'relic-gold', 'relic-silver', 'relic-copper'],
  };

  const requiredMoves: Record<string, string[]> = {
    'striaton-city': ['cut', 'work-up'],
    'nuvema-town': ['false-swipe', 'protect', 'hidden-power'],
    'dreamyard': ['swords-dance', 'dream-eater'],
    'nacrene-city': ['retaliate'],
    'pinwheel-forest': ['solar-beam', 'grass-knot', 'rock-smash'],
    'castelia-city': ['struggle-bug', 'rest', 'attract', 'flash'],
    'unova-route-4': ['dig', 'torment'],
    'desert-resort': ['rock-tomb'],
    'relic-castle': ['calm-mind', 'earthquake', 'shadow-ball'],
    'nimbasa-city': ['volt-switch', 'strength'],
    'driftveil-city': ['bulldoze', 'fly'],
    'cold-storage': ['hone-claws', 'scald'],
    'unova-route-6': ['poison-jab'],
    'mistralton-cave': ['rock-slide'],
    'chargestone-cave': ['rock-polish'],
    'mistralton-city': ['acrobatics', 'aerial-ace', 'sky-drop'],
    'unova-route-7': ['charge-beam', 'x-scissor'],
    'celestial-tower': ['will-o-wisp', 'shadow-claw'],
    'twist-mountain': ['surf', 'flash-cannon', 'substitute'],
    'icirrus-city': ['frost-breath', 'brick-break'],
    'dragonspiral-tower': ['embargo'],
    'unova-route-8': ['sludge-bomb', 'facade'],
    'tubeline-bridge': ['flame-charge', 'fling'],
    'opelucid-city': ['dragon-tail'],
    'unova-route-11': ['overheat'],
    'unova-route-12': ['energy-ball'],
    'unova-route-13': ['psychic', 'u-turn'],
    'challengers-cave': ['stone-edge'],
    'unova-route-14': ['bulk-up'],
    'abundant-shrine': ['flamethrower', 'trick-room'],
    'unova-route-16': ['payback'],
    'unova-route-15': ['venoshock'],
    'unova-route-10': ['roar'],
    'unova-victory-road': ['dragon-claw', 'taunt', 'wild-charge'],
    'unova-route-18': ['waterfall', 'telekinesis', 'double-team'],
    'unova-route-17': ['toxic'],
    'p2-laboratory': ['thunderbolt'],
    'wellspring-cave': ['thief', 'low-sweep', 'focus-blast'],
    'giant-chasm': ['ice-beam', 'psyshock'],
    'undella-town': ['dive'],
  };

  it('keeps existing rows and adds required item slugs', () => {
    for (const [nodeId, slugs] of Object.entries(requiredSlugs)) {
      const got = (catalog[nodeId] ?? []).map((i) => i.itemSlug);
      for (const slug of slugs) {
        expect(got, nodeId).toContain(slug);
      }
    }
  });

  it('places required TMs and HMs by moveSlug', () => {
    for (const [nodeId, moves] of Object.entries(requiredMoves)) {
      const got = (catalog[nodeId] ?? []).map((i) => i.moveSlug);
      for (const move of moves) {
        expect(got, nodeId).toContain(move);
      }
    }
  });

  it('keeps Striaton Cut and drops dusk-ball plus oran-berry', () => {
    const rows = catalog['striaton-city'] ?? [];
    expect(rows.some((i) => i.moveSlug === 'cut')).toBe(true);
    expect(rows.some((i) => i.itemSlug === 'dusk-ball')).toBe(false);
    expect(rows.some((i) => i.itemSlug === 'oran-berry')).toBe(false);
  });

  it('keeps the original three rows on Wellspring, Giant Chasm, and Undella', () => {
    expect((catalog['wellspring-cave'] ?? []).slice(0, 3).map((i) => i.moveSlug)).toEqual([
      'thief',
      'low-sweep',
      'focus-blast',
    ]);
    expect((catalog['giant-chasm'] ?? []).slice(0, 3).map((i) => i.itemSlug)).toEqual([
      'tm-ice',
      'tm-psychic',
      'comet-shard',
    ]);
    expect((catalog['undella-town'] ?? []).slice(0, 3).map((i) => i.itemSlug)).toEqual([
      'hm-water',
      'big-nugget',
      'prism-scale',
    ]);
  });

  it('skips empty arrays and the B2W2 / version-town keys', () => {
    for (const key of [
      'aspertia-city',
      'floccesy-ranch',
      'virbank-city',
      'humilau-city',
      'unova-route-19',
      'unova-route-20',
      'unova-route-21',
      'unova-route-22',
      'unova-route-23',
      'black-city',
      'white-forest',
    ]) {
      expect(catalog[key], key).toBeUndefined();
    }
    for (const [key, items] of Object.entries(catalog)) {
      expect(items.length, key).toBeGreaterThan(0);
      expect(items.length, `${key} cap`).toBeLessThanOrEqual(12);
    }
  });

  it('marks hidden leftovers and Undella Bay pearls', () => {
    expect((catalog['village-bridge'] ?? []).some((i) => i.itemSlug === 'leftovers' && i.hidden)).toBe(true);
    expect((catalog['undella-bay'] ?? []).some((i) => i.itemSlug === 'heart-scale' && i.hidden)).toBe(true);
    expect((catalog['undella-bay'] ?? []).some((i) => i.itemSlug === 'pearl' && i.hidden)).toBe(true);
  });

  it('uses Black/White notes on new rows', () => {
    const legacyKeys = new Set(['wellspring-cave', 'giant-chasm', 'undella-town']);
    for (const [key, items] of Object.entries(catalog)) {
      for (const item of items) {
        if (legacyKeys.has(key) || item.moveSlug === 'cut') continue;
        expect(String(item.note), `${key}/${item.name}`).toMatch(/Black|White/);
      }
    }
  });

  it('requires moveSlug on every TM/HM and keys that match map nodes', () => {
    const ids = nodeIds('unova');
    for (const [key, items] of Object.entries(catalog)) {
      expect(ids.has(key), `items-unova.json key "${key}"`).toBe(true);
      for (const item of items) {
        if (/^(?:TM|HM)\d+/.test(item.name)) {
          expect(item.moveSlug, `${key}/${item.name}`).toBeTruthy();
        }
      }
    }
  });
});

describe('hoenn remaining map data', () => {
  const remaining = [
    { id: 'abandoned-ship', locationSlug: 'abandoned-ship', nameDe: 'Schiffswrack', label: 'Abandoned Ship', order: 62 },
    { id: 'jagged-pass', locationSlug: 'jagged-pass', nameDe: 'Steilpass', label: 'Jagged Pass', order: 63 },
    { id: 'magma-hideout', locationSlug: 'magma-hideout', nameDe: 'Team Magmas Versteck', label: 'Magma Hideout', order: 64 },
    { id: 'new-mauville', locationSlug: 'new-mauville', nameDe: 'Neu Malvenfroh', label: 'New Mauville', order: 65 },
    { id: 'seafloor-cavern', locationSlug: 'seafloor-cavern', nameDe: 'Tiefseehöhle', label: 'Seafloor Cavern', order: 66 },
    { id: 'cave-of-origin', locationSlug: 'cave-of-origin', nameDe: 'Urzeithöhle', label: 'Cave of Origin', order: 67 },
    { id: 'team-aqua-hideout', locationSlug: 'team-aqua-hideout', nameDe: 'Team Aquas Versteck', label: 'Team Aqua Hideout', order: 68 },
  ] as const;

  const remainingEdges: Array<[string, string]> = [
    ['hoenn-route-108', 'abandoned-ship'],
    ['mt-chimney', 'jagged-pass'],
    ['jagged-pass', 'lavaridge-town'],
    ['jagged-pass', 'magma-hideout'],
    ['hoenn-route-110', 'new-mauville'],
    ['hoenn-route-128', 'seafloor-cavern'],
    ['sootopolis-city', 'cave-of-origin'],
    ['lilycove-city', 'team-aqua-hideout'],
    ['lilycove-city', 'hoenn-route-124'],
    ['hoenn-route-105', 'hoenn-route-106'],
  ];

  it('includes remaining story dungeons', () => {
    const ids = nodeIds('hoenn');
    for (const n of remaining) {
      expect(ids.has(n.id), n.id).toBe(true);
    }
  });

  it('sets nameDe, locationSlug, label, kind, and order on each new node', () => {
    const byId = new Map(regionById('hoenn')!.nodes.map((n) => [n.id, n]));
    for (const spec of remaining) {
      const node = byId.get(spec.id);
      expect(node, spec.id).toBeDefined();
      expect(node!.nameDe, spec.id).toBe(spec.nameDe);
      expect(node!.locationSlug, spec.id).toBe(spec.locationSlug);
      expect(node!.label, spec.id).toBe(spec.label);
      expect(node!.kind, spec.id).toBe('dungeon');
      expect(node!.order, spec.id).toBe(spec.order);
      expect(node!.x === 0 && node!.y === 0, `${spec.id} stacked at 0,0`).toBe(false);
    }
  });

  it('pins New Mauville / Magma Hideout / Aqua Hideout slugs and German names', () => {
    const byId = new Map(regionById('hoenn')!.nodes.map((n) => [n.id, n]));
    expect(byId.get('new-mauville')!.nameDe).toBe('Neu Malvenfroh');
    expect(byId.get('new-mauville')!.nameDe).not.toBe('Neu Mauville');
    expect(byId.get('magma-hideout')!.locationSlug).toBe('magma-hideout');
    expect(byId.get('magma-hideout')!.locationSlug).not.toBe('team-magma-hideout');
    expect(byId.get('team-aqua-hideout')!.locationSlug).toBe('team-aqua-hideout');
  });

  it('wires remaining dungeons and the two missing water links', () => {
    for (const [a, b] of remainingEdges) {
      expect(hasEdge('hoenn', a, b), `${a}–${b}`).toBe(true);
    }
  });

  it('keeps Mt. Chimney–Lavaridge and Mt. Pyre–Route 124', () => {
    expect(hasEdge('hoenn', 'mt-chimney', 'lavaridge-town')).toBe(true);
    expect(hasEdge('hoenn', 'mt-pyre', 'hoenn-route-124')).toBe(true);
  });

  it('has a geo marker for every hoenn node and no orphan geo keys', () => {
    expect(hoennGeo.version).toBe('rubysapphire');
    const ids = nodeIds('hoenn');
    const geoIds = new Set(Object.keys(hoennGeo.nodes));
    for (const n of remaining) {
      expect(geoIds.has(n.id), `missing geo for ${n.id}`).toBe(true);
    }
    for (const id of ids) {
      expect(geoIds.has(id), `missing geo for ${id}`).toBe(true);
      const xy = hoennGeo.nodes[id as keyof typeof hoennGeo.nodes];
      expect(xy, id).toHaveLength(2);
      expect(xy[0], `${id} x`).toBeGreaterThanOrEqual(0);
      expect(xy[0], `${id} x`).toBeLessThanOrEqual(1);
      expect(xy[1], `${id} y`).toBeGreaterThanOrEqual(0);
      expect(xy[1], `${id} y`).toBeLessThanOrEqual(1);
    }
    for (const id of geoIds) {
      expect(ids.has(id), `orphan geo ${id}`).toBe(true);
    }
  });
});

describe('kanto pokemon-tower', () => {
  it('is connected to Lavender Town', () => {
    expect(hasEdge('kanto', 'lavender-town', 'pokemon-tower')).toBe(true);
  });
});

describe('kanto pokemon-mansion', () => {
  it('exists as a dungeon off Cinnabar Island', () => {
    const mansion = regionById('kanto')!.nodes.find((n) => n.id === 'pokemon-mansion');
    const cinnabar = regionById('kanto')!.nodes.find((n) => n.id === 'cinnabar-island')!;
    expect(mansion).toBeDefined();
    expect(mansion!.nameDe).toBe('Pokémon-Villa');
    expect(mansion!.locationSlug).toBe('pokemon-mansion');
    expect(mansion!.kind).toBe('dungeon');
    expect(hasEdge('kanto', 'cinnabar-island', 'pokemon-mansion')).toBe(true);
    expect(mansion!.x === 0 && mansion!.y === 0, 'stacked at 0,0').toBe(false);
    expect(mansion!.x === cinnabar.x && mansion!.y === cinnabar.y, 'stacked on cinnabar').toBe(false);
    expect('pokemon-mansion' in kantoGeo.nodes, 'missing geo').toBe(true);
  });
});

describe('sinnoh platinum postGame', () => {
  it('keeps platinum as default', () => {
    expect(regionById('sinnoh')!.defaultVersion).toBe('platinum');
  });

  it('marks Battle Zone and late routes postGame when present', () => {
    const byId = new Map(regionById('sinnoh')!.nodes.map((n) => [n.id, n]));
    const post = [
      'fight-area',
      'survival-area',
      'resort-area',
      'sinnoh-route-224',
      'sinnoh-route-225',
      'sinnoh-route-226',
      'sinnoh-route-227',
      'sinnoh-route-228',
      'sinnoh-route-229',
      'sinnoh-route-230',
    ];
    for (const id of post) {
      const n = byId.get(id);
      if (n) expect(n.postGame, id).toBe(true);
    }
    expect(byId.get('turnback-cave')?.postGame).toBe(true);
    expect(byId.get('stark-mountain')?.postGame).toBe(true);
  });

  it('does not mark Distortion World or routes 219–221 as postGame', () => {
    const byId = new Map(regionById('sinnoh')!.nodes.map((n) => [n.id, n]));
    for (const id of ['distortion-world', 'sinnoh-route-219', 'sinnoh-route-220', 'sinnoh-route-221']) {
      expect(byId.get(id)?.postGame, id).toBeFalsy();
    }
  });

  it('uses PokéAPI sea slugs on water routes 220/223/226/230', () => {
    const byId = new Map(regionById('sinnoh')!.nodes.map((n) => [n.id, n]));
    expect(byId.get('sinnoh-route-220')!.locationSlug).toBe('sinnoh-sea-route-220');
    expect(byId.get('sinnoh-route-223')!.locationSlug).toBe('sinnoh-sea-route-223');
    expect(byId.get('sinnoh-route-226')!.locationSlug).toBe('sinnoh-sea-route-226');
    expect(byId.get('sinnoh-route-230')!.locationSlug).toBe('sinnoh-sea-route-230');
  });
});

describe('sinnoh remaining map data', () => {
  const remaining = [
    { id: 'lake-verity', locationSlug: 'lake-verity', nameDe: 'See der Wahrheit', label: 'Lake Verity', kind: 'special', order: 63 },
    { id: 'oreburgh-gate', locationSlug: 'oreburgh-gate', nameDe: 'Erzelingen-Tor', label: 'Oreburgh Gate', kind: 'dungeon', order: 64 },
    { id: 'old-chateau', locationSlug: 'old-chateau', nameDe: 'Alte Villa', label: 'Old Chateau', kind: 'dungeon', order: 65 },
    { id: 'floaroma-meadow', locationSlug: 'floaroma-meadow', nameDe: 'Auen von Flori', label: 'Floaroma Meadow', kind: 'special', order: 66 },
    { id: 'fuego-ironworks', locationSlug: 'fuego-ironworks', nameDe: 'Feurio-Hütte', label: 'Fuego Ironworks', kind: 'dungeon', order: 67 },
    { id: 'trophy-garden', locationSlug: 'trophy-garden', nameDe: 'Pokémon-Landgut', label: 'Trophy Garden', kind: 'special', order: 68 },
    { id: 'galactic-hq', locationSlug: 'galactic-hq', nameDe: 'Team Galaktik Zentrale', label: 'Galactic HQ', kind: 'dungeon', order: 69 },
    { id: 'valor-lakefront', locationSlug: 'valor-lakefront', nameDe: 'Kühnheitsufer', label: 'Valor Lakefront', kind: 'special', order: 70 },
    { id: 'lake-valor', locationSlug: 'lake-valor', nameDe: 'See der Kühnheit', label: 'Lake Valor', kind: 'special', order: 71 },
    { id: 'acuity-lakefront', locationSlug: 'acuity-lakefront', nameDe: 'Stärkeufer', label: 'Acuity Lakefront', kind: 'special', order: 72 },
    { id: 'lake-acuity', locationSlug: 'lake-acuity', nameDe: 'See der Stärke', label: 'Lake Acuity', kind: 'special', order: 73 },
    { id: 'sendoff-spring', locationSlug: 'sendoff-spring', nameDe: 'Scheidequelle', label: 'Sendoff Spring', kind: 'special', order: 74 },
    { id: 'snowpoint-temple', locationSlug: 'snowpoint-temple', nameDe: 'Blizzach-Tempel', label: 'Snowpoint Temple', kind: 'dungeon', order: 75 },
  ] as const;

  const remainingEdges: Array<[string, string]> = [
    ['lake-verity', 'sinnoh-route-201'],
    ['oreburgh-gate', 'sinnoh-route-203'],
    ['oreburgh-gate', 'oreburgh-city'],
    ['old-chateau', 'eterna-forest'],
    ['floaroma-meadow', 'floaroma-town'],
    ['floaroma-meadow', 'fuego-ironworks'],
    ['fuego-ironworks', 'sinnoh-route-205'],
    ['trophy-garden', 'sinnoh-route-212'],
    ['galactic-hq', 'veilstone-city'],
    ['valor-lakefront', 'sinnoh-route-213'],
    ['valor-lakefront', 'sinnoh-route-214'],
    ['valor-lakefront', 'sinnoh-route-222'],
    ['valor-lakefront', 'lake-valor'],
    ['acuity-lakefront', 'sinnoh-route-217'],
    ['acuity-lakefront', 'lake-acuity'],
    ['sendoff-spring', 'sinnoh-route-214'],
    ['sendoff-spring', 'turnback-cave'],
    ['snowpoint-temple', 'snowpoint-city'],
  ];

  it('includes remaining Platinum landmarks', () => {
    const ids = nodeIds('sinnoh');
    for (const n of remaining) {
      expect(ids.has(n.id), n.id).toBe(true);
    }
  });

  it('sets nameDe, locationSlug, label, kind, and order on each new node', () => {
    const byId = new Map(regionById('sinnoh')!.nodes.map((n) => [n.id, n]));
    for (const spec of remaining) {
      const node = byId.get(spec.id);
      expect(node, spec.id).toBeDefined();
      expect(node!.nameDe, spec.id).toBe(spec.nameDe);
      expect(node!.locationSlug, spec.id).toBe(spec.locationSlug);
      expect(node!.label, spec.id).toBe(spec.label);
      expect(node!.kind, spec.id).toBe(spec.kind);
      expect(node!.order, spec.id).toBe(spec.order);
      expect(node!.x === 0 && node!.y === 0, `${spec.id} stacked at 0,0`).toBe(false);
    }
  });

  it('marks Snowpoint Temple and Sendoff Spring postGame', () => {
    const byId = new Map(regionById('sinnoh')!.nodes.map((n) => [n.id, n]));
    expect(byId.get('snowpoint-temple')!.postGame).toBe(true);
    expect(byId.get('sendoff-spring')!.postGame).toBe(true);
  });

  it('wires remaining landmarks to their neighbors', () => {
    for (const [a, b] of remainingEdges) {
      expect(hasEdge('sinnoh', a, b), `${a}–${b}`).toBe(true);
    }
  });

  it('keeps Route 203–Oreburgh, Route 214–Turnback Cave, and Pastoria–222', () => {
    expect(hasEdge('sinnoh', 'sinnoh-route-203', 'oreburgh-city')).toBe(true);
    expect(hasEdge('sinnoh', 'sinnoh-route-214', 'turnback-cave')).toBe(true);
    expect(hasEdge('sinnoh', 'pastoria-city', 'sinnoh-route-222')).toBe(true);
  });

  it('uses a water edge for Fuego Ironworks–Route 205', () => {
    const edges = regionById('sinnoh')!.edges;
    expect(
      edges.some(
        (e) =>
          e.kind === 'water' &&
          ((e.from === 'fuego-ironworks' && e.to === 'sinnoh-route-205') ||
            (e.from === 'sinnoh-route-205' && e.to === 'fuego-ironworks')),
      ),
    ).toBe(true);
  });

  it('has a geo marker for every sinnoh node and no orphan geo keys', () => {
    expect(sinnohGeo.version).toBe('diamond');
    const ids = nodeIds('sinnoh');
    const geoIds = new Set(Object.keys(sinnohGeo.nodes));
    for (const n of remaining) {
      expect(geoIds.has(n.id), `missing geo for ${n.id}`).toBe(true);
    }
    for (const id of ids) {
      expect(geoIds.has(id), `missing geo for ${id}`).toBe(true);
      const xy = sinnohGeo.nodes[id as keyof typeof sinnohGeo.nodes];
      expect(xy, id).toHaveLength(2);
      expect(xy[0], `${id} x`).toBeGreaterThanOrEqual(0);
      expect(xy[0], `${id} x`).toBeLessThanOrEqual(1);
      expect(xy[1], `${id} y`).toBeGreaterThanOrEqual(0);
      expect(xy[1], `${id} y`).toBeLessThanOrEqual(1);
    }
    for (const id of geoIds) {
      expect(ids.has(id), `orphan geo ${id}`).toBe(true);
    }
  });
});

describe('sinnoh platinum items', () => {
  type ItemRow = { itemSlug: string; name: string; note: string; moveSlug?: string; pocket: string };
  const catalog = itemsSinnoh as Record<string, ItemRow[]>;

  const requiredSlugs: Record<string, string[]> = {
    'jubilife-city': ['vs-recorder', 'old-rod', 'poketch', 'town-map'],
    'eterna-city': ['bicycle', 'explorer-kit'],
    'hearthome-city': ['poffin-case', 'amulet-coin'],
    'celestic-town': ['choice-specs'],
    'wayward-cave': ['grip-claw'],
    'floaroma-town': ['sprayduck'],
    'twinleaf-town': ['journal', 'parcel'],
    'sandgem-town': ['poke-radar'],
    'sinnoh-route-201': ['potion'],
    'sinnoh-route-202': ['poke-ball', 'potion'],
    'sinnoh-route-203': ['poke-ball', 'repel', 'x-defense'],
    'oreburgh-gate': ['earth-plate'],
    'oreburgh-mine': ['escape-rope', 'potion'],
    'sinnoh-route-204': ['paralyze-heal', 'awakening', 'sea-incense'],
    'ravaged-path': ['luck-incense'],
    'floaroma-meadow': ['works-key', 'honey', 'miracle-seed', 'leaf-stone'],
    'valley-windworks': ['electirizer'],
    'fuego-ironworks': ['fire-stone', 'rock-incense'],
    'eterna-forest': ['soothe-bell', 'insect-plate'],
    'old-chateau': ['old-gateau', 'dread-plate', 'rare-candy'],
    'sinnoh-route-205': ['heal-ball', 'super-potion', 'antidote'],
    'sinnoh-route-206': ['exp-share', 'poison-barb', 'burn-heal'],
    'sinnoh-route-207': ['vs-seeker', 'pp-up'],
    'sinnoh-route-208': ['odd-keystone', 'great-ball', 'ether'],
    'sinnoh-route-209': ['good-rod', 'hyper-potion'],
    'lost-tower': ['cleanse-tag', 'oval-stone'],
    'solaceon-town': ['seal-case'],
    'solaceon-ruins': ['odd-incense', 'mind-plate', 'nugget'],
    'sinnoh-route-210': ['old-charm', 'smoke-ball'],
    'trophy-garden': ['luxury-ball', 'soothe-bell'],
    'pastoria-city': ['mystic-water', 'macho-brace'],
    'great-marsh': ['toxic-plate'],
    'sinnoh-route-213': ['hyper-potion'],
    'valor-lakefront': ['suite-key', 'secret-potion'],
    'acuity-lakefront': ['reaper-cloth'],
    'sinnoh-route-214': ['razor-fang', 'magmarizer', 'big-root'],
    'veilstone-city': ['coin-case'],
    'galactic-hq': ['storage-key', 'galactic-key', 'master-ball', 'dubious-disc'],
    'sinnoh-route-215': ['fist-plate'],
    'sinnoh-route-218': ['x-accuracy'],
    'iron-island': ['protector', 'metal-coat', 'magnet', 'shiny-stone'],
    'mt-coronet': ['light-clay', 'soft-sand'],
    'spear-pillar': ['adamant-orb', 'lustrous-orb'],
    'distortion-world': ['griseous-orb'],
    'sinnoh-route-216': ['mental-herb'],
    'sinnoh-route-217': ['spell-tag', 'icicle-plate'],
    'snowpoint-temple': ['never-melt-ice'],
    'sinnoh-route-219': ['splash-plate', 'max-repel'],
    'sinnoh-route-221': ['expert-belt', 'focus-sash', 'pure-incense'],
    'sinnoh-route-222': ['carbos'],
    'sunyshore-city': ['zap-plate'],
    'sinnoh-route-223': ['dive-ball', 'ultra-ball', 'rare-candy'],
    'sinnoh-victory-road': ['leftovers', 'razor-claw'],
    'sinnoh-route-224': ['destiny-knot', 'razor-claw', 'up-grade'],
    'fight-area': ['super-rod'],
    'survival-area': ['rare-candy'],
    'sinnoh-route-225': ['lax-incense', 'dawn-stone', 'razor-fang'],
    'sinnoh-route-226': ['lagging-tail'],
    'sinnoh-route-227': ['charcoal', 'life-orb'],
    'stark-mountain': ['flame-plate', 'magma-stone'],
    'sinnoh-route-228': ['shed-shell', 'protector'],
    'resort-area': ['rare-candy'],
    'sinnoh-route-229': ['reaper-cloth', 'thunder-stone'],
    'sinnoh-route-230': ['ultra-ball', 'rare-candy'],
  };

  const requiredMoves: Record<string, string[]> = {
    'eterna-city': ['grass-knot', 'recycle'],
    'hearthome-city': ['shadow-claw', 'secret-power', 'attract'],
    'sandgem-town': ['return'],
    'oreburgh-gate': ['rock-smash', 'flash', 'brick-break', 'focus-punch'],
    'oreburgh-city': ['stealth-rock'],
    'sinnoh-route-204': ['bullet-seed', 'captivate'],
    'ravaged-path': ['rock-tomb', 'water-pulse'],
    'valley-windworks': ['thunderbolt'],
    'fuego-ironworks': ['flamethrower'],
    'eterna-forest': ['sleep-talk'],
    'old-chateau': ['substitute'],
    'sinnoh-route-209': ['giga-drain', 'steel-wing'],
    'lost-tower': ['return'],
    'solaceon-ruins': ['defog'],
    'sinnoh-route-210': ['roost', 'shadow-ball', 'psychic'],
    'sinnoh-route-211': ['taunt', 'psych-up'],
    'trophy-garden': ['swagger'],
    'sinnoh-route-212': ['toxic', 'sunny-day', 'silver-wind', 'poison-jab'],
    'pastoria-city': ['brine'],
    'sinnoh-route-213': ['roar', 'aerial-ace', 'trick-room'],
    'valor-lakefront': ['dream-eater'],
    'lake-verity': ['fire-blast'],
    'lake-valor': ['thunder'],
    'lake-acuity': ['blizzard'],
    'sinnoh-route-214': ['dig'],
    'veilstone-city': ['drain-punch', 'embargo'],
    'galactic-hq': ['fly', 'frustration', 'sludge-bomb', 'snatch'],
    'sinnoh-route-215': ['shock-wave', 'payback'],
    'canalave-city': ['flash-cannon', 'skill-swap', 'u-turn'],
    'iron-island': ['strength', 'iron-tail'],
    'mt-coronet': ['rock-polish', 'rock-slide', 'dragon-claw'],
    'sinnoh-route-216': ['ice-beam'],
    'sinnoh-route-217': ['rock-climb', 'hail'],
    'snowpoint-city': ['avalanche'],
    'sinnoh-route-221': ['x-scissor'],
    'sinnoh-route-222': ['fling'],
    'sunyshore-city': ['charge-beam', 'waterfall'],
    'sinnoh-route-223': ['rain-dance'],
    'sinnoh-victory-road': ['torment', 'stone-edge', 'dragon-pulse', 'dark-pulse'],
    'survival-area': ['facade'],
    'sinnoh-route-226': ['energy-ball'],
    'stark-mountain': ['overheat'],
    'sinnoh-route-228': ['sandstorm'],
  };

  it('keeps existing rows and adds required item slugs', () => {
    for (const [nodeId, slugs] of Object.entries(requiredSlugs)) {
      const got = (catalog[nodeId] ?? []).map((i) => i.itemSlug);
      for (const slug of slugs) {
        expect(got, nodeId).toContain(slug);
      }
    }
  });

  it('places required TMs and HMs by moveSlug', () => {
    for (const [nodeId, moves] of Object.entries(requiredMoves)) {
      const got = (catalog[nodeId] ?? []).map((i) => i.moveSlug);
      for (const move of moves) {
        expect(got, nodeId).toContain(move);
      }
    }
  });

  it('puts TM29 Psychic only on Route 210 and Secret Potion only on Valor Lakefront', () => {
    const psychicNodes = Object.entries(catalog)
      .filter(([, items]) => items.some((i) => i.moveSlug === 'psychic'))
      .map(([id]) => id);
    expect(psychicNodes).toEqual(['sinnoh-route-210']);
    const potionNodes = Object.entries(catalog)
      .filter(([, items]) => items.some((i) => i.itemSlug === 'secret-potion'))
      .map(([id]) => id);
    expect(potionNodes).toEqual(['valor-lakefront']);
  });

  it('skips empty arrays and the two OK-empty keys', () => {
    expect(catalog['sinnoh-route-220']).toBeUndefined();
    expect(catalog['sendoff-spring']).toBeUndefined();
    for (const [key, items] of Object.entries(catalog)) {
      expect(items.length, key).toBeGreaterThan(0);
      expect(items.length, `${key} cap`).toBeLessThanOrEqual(12);
    }
  });

  it('uses carbos on Route 222 and Platinum notes on new rows', () => {
    expect((catalog['sinnoh-route-222'] ?? []).some((i) => i.itemSlug === 'carbos')).toBe(true);
    expect((catalog['sinnoh-route-222'] ?? []).some((i) => i.itemSlug === 'carb-os')).toBe(false);
    const legacy = new Set([
      'vs-recorder', 'old-rod', 'quick-claw', 'fashion-case', 'potion', 'stardust',
      'oran-berry', 'cheri-berry', 'sprayduck', 'gracidea',
      'bicycle', 'explorer-kit', 'super-potion', 'draco-plate', 'moon-stone',
      'poffin-case', 'shell-bell', 'big-mushroom',
      'choice-specs', 'black-glasses', 'wise-glasses', 'dragon-fang', 'kings-rock',
      'revive', 'max-ether', 'grip-claw', 'rare-candy', 'dusk-stone',
    ]);
    const legacyMoves = new Set(['pluck', 'cut', 'thief', 'earthquake', 'double-team', 'surf']);
    for (const [key, items] of Object.entries(catalog)) {
      for (const item of items) {
        const isLegacy = legacy.has(item.itemSlug) || (item.moveSlug && legacyMoves.has(item.moveSlug));
        if (isLegacy) continue;
        expect(String(item.note), `${key}/${item.name}`).toMatch(/Platinum/);
      }
    }
  });

  it('requires moveSlug on every TM/HM and keys that match map nodes', () => {
    const ids = nodeIds('sinnoh');
    for (const [key, items] of Object.entries(catalog)) {
      expect(ids.has(key), `items-sinnoh.json key "${key}"`).toBe(true);
      for (const item of items) {
        if (/^(?:TM|HM)\d+/.test(item.name)) {
          expect(item.moveSlug, `${key}/${item.name}`).toBeTruthy();
        }
      }
    }
  });
});

describe('versionLabel i18n', () => {
  it('uses localized full names, not slug dumps', async () => {
    expect(versionLabel('firered')).toBe('FireRed');
    i18n.addResourceBundle('de', 'translation', de, true, true);
    await i18n.changeLanguage('de');
    expect(versionLabel('firered')).toBe('Feuerrot');
    expect(versionLabel('heartgold')).toBe('HeartGold');
    await i18n.changeLanguage('en');
  });
});

describe('interactive map labels match the URL', () => {
  it('does not label the Platinum pkmnmap as Diamond & Pearl', () => {
    const dp = resolveInteractiveMapLink('sinnoh', 'diamond')!;
    expect(dp.url).toMatch(/Platinum/i);
    expect(dp.game).not.toMatch(/Diamond/i);
  });

  it('labels Unova as non-retail / PokeMMO', () => {
    const u = resolveInteractiveMapLink('unova', 'black')!;
    expect(u.game.toLowerCase()).toMatch(/pokemmo|not retail/);
  });
});
