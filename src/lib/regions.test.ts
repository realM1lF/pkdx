/* Shared Region Contract — defaults, postGame flags, additive nodes, graph edges. */
import { describe, expect, it } from 'vitest';
import { regionById, versionLabel } from './regions';
import { resolveInteractiveMapLink } from './interactive-maps';
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
    expect(hasEdge('johto', 'johto-route-48', 'johto-safari-zone')).toBe(true);
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

describe('kanto pokemon-tower', () => {
  it('is connected to Lavender Town', () => {
    expect(hasEdge('kanto', 'lavender-town', 'pokemon-tower')).toBe(true);
  });
});

describe('sinnoh platinum postGame', () => {
  it('keeps platinum as default', () => {
    expect(regionById('sinnoh')!.defaultVersion).toBe('platinum');
  });

  it('marks Battle Zone / Distortion World / late routes postGame when present', () => {
    const byId = new Map(regionById('sinnoh')!.nodes.map((n) => [n.id, n]));
    const maybe = [
      'fight-area',
      'survival-area',
      'resort-area',
      'distortion-world',
      'sinnoh-route-219',
      'sinnoh-route-224',
      'sinnoh-route-225',
      'sinnoh-route-230',
    ];
    for (const id of maybe) {
      const n = byId.get(id);
      if (n) expect(n.postGame, id).toBe(true);
    }
    expect(byId.get('turnback-cave')?.postGame).toBe(true);
    expect(byId.get('stark-mountain')?.postGame).toBe(true);
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
