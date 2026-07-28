/* Kanto SEO route list regression snapshot (Hoenn rollout guard).
 *
 * The region generalization (seo-routes-hoenn.ts, RoutePage region param,
 * generator region flag) must stay additive: the Kanto slug table and the
 * generated Kanto route pages must not change. This test pins both. */
import { describe, expect, it } from 'vitest';
import routesKantoJson from '@/data/routes-kanto.json';
import kantoJson from '@/data/regions/kanto.json';
import hoennJson from '@/data/regions/hoenn.json';
import { KANTO_ROUTE_SLUGS, ROUTE_PAGES } from './seo-routes-kanto';

/** Pinned slug table (de + en) per Kanto node — byte-level contract. */
const EXPECTED_SLUGS: Record<string, { de: string; en: string }> = {
  'pallet-town': { de: 'alabastia', en: 'pallet-town' },
  'kanto-route-1': { de: 'route-1', en: 'route-1' },
  'viridian-city': { de: 'vertania-city', en: 'viridian-city' },
  'kanto-route-22': { de: 'route-22', en: 'route-22' },
  'kanto-route-2': { de: 'route-2', en: 'route-2' },
  'viridian-forest': { de: 'vertania-wald', en: 'viridian-forest' },
  'digletts-cave': { de: 'digda-hoehle', en: 'digletts-cave' },
  'pewter-city': { de: 'marmoria-city', en: 'pewter-city' },
  'kanto-route-3': { de: 'route-3', en: 'route-3' },
  'mt-moon': { de: 'mondberg', en: 'mt-moon' },
  'kanto-route-4': { de: 'route-4', en: 'route-4' },
  'cerulean-city': { de: 'azuria-city', en: 'cerulean-city' },
  'kanto-route-24': { de: 'route-24', en: 'route-24' },
  'kanto-route-25': { de: 'route-25', en: 'route-25' },
  'cerulean-cave': { de: 'azuria-hoehle', en: 'cerulean-cave' },
  'kanto-route-5': { de: 'route-5', en: 'route-5' },
  'kanto-route-6': { de: 'route-6', en: 'route-6' },
  'vermilion-city': { de: 'orania-city', en: 'vermilion-city' },
  'kanto-route-11': { de: 'route-11', en: 'route-11' },
  'kanto-route-9': { de: 'route-9', en: 'route-9' },
  'kanto-route-10': { de: 'route-10', en: 'route-10' },
  'rock-tunnel': { de: 'felstunnel', en: 'rock-tunnel' },
  'power-plant': { de: 'kraftwerk', en: 'power-plant' },
  'lavender-town': { de: 'lavandia', en: 'lavender-town' },
  'pokemon-tower': { de: 'pokemon-turm', en: 'pokemon-tower' },
  'kanto-route-8': { de: 'route-8', en: 'route-8' },
  'kanto-route-7': { de: 'route-7', en: 'route-7' },
  'celadon-city': { de: 'prismania-city', en: 'celadon-city' },
  'kanto-route-16': { de: 'route-16', en: 'route-16' },
  'kanto-route-17': { de: 'route-17', en: 'route-17' },
  'kanto-route-18': { de: 'route-18', en: 'route-18' },
  'fuchsia-city': { de: 'fuchsania-city', en: 'fuchsia-city' },
  'safari-zone': { de: 'safari-zone', en: 'safari-zone' },
  'kanto-route-12': { de: 'route-12', en: 'route-12' },
  'kanto-route-13': { de: 'route-13', en: 'route-13' },
  'kanto-route-14': { de: 'route-14', en: 'route-14' },
  'kanto-route-15': { de: 'route-15', en: 'route-15' },
  'kanto-route-19': { de: 'route-19', en: 'route-19' },
  'kanto-route-20': { de: 'route-20', en: 'route-20' },
  'seafoam-islands': { de: 'seeschauminseln', en: 'seafoam-islands' },
  'cinnabar-island': { de: 'zinnoberinsel', en: 'cinnabar-island' },
  'kanto-route-21': { de: 'route-21', en: 'route-21' },
  'kanto-route-23': { de: 'route-23', en: 'route-23' },
  'victory-road': { de: 'siegesstrasse', en: 'victory-road' },
  'indigo-plateau': { de: 'indigo-plateau', en: 'indigo-plateau' },
  'saffron-city': { de: 'saffronia-city', en: 'saffron-city' },
};

describe('seo-routes-kanto (regression snapshot)', () => {
  it('slug table is unchanged', () => {
    expect(KANTO_ROUTE_SLUGS).toEqual(EXPECTED_SLUGS);
  });

  it('generated route pages are unchanged (43 nodes with FRLG encounters)', () => {
    /* slug table minus the three nodes without FRLG wild encounters
     * (Pewter City, Lavender Town, Indigo Plateau have no FRLG data) */
    const expectedNodes = Object.keys(EXPECTED_SLUGS)
      .filter((id) => !['pewter-city', 'lavender-town', 'indigo-plateau'].includes(id))
      .sort();
    /* the snapshot may carry additional cross-gen-only nodes (HGSS/GSC
     * headbutt trees in Pewter City) — they feed the map data but get no
     * SEO page, because the page framing is FRLG */
    expect([...ROUTE_PAGES].sort()).toEqual(expectedNodes);
    for (const id of expectedNodes) {
      expect(Object.keys(routesKantoJson.nodes), id).toContain(id);
    }
  });

  /* cross-gen rollout: Kanto is the HGSS/GSC post-game, so the map contract
   * and the SEO snapshot must carry those editions (LGPE deliberately out —
   * different catch system, see cross-gen analysis AP5) */
  it('kanto.json offers GSC + HGSS editions (map toggle / deep-link / Nuzlocke)', () => {
    for (const v of ['gold', 'silver', 'crystal', 'heartgold', 'soulsilver']) {
      expect(kantoJson.versions, v).toContain(v);
    }
  });

  it('hoenn.json offers ORAS editions', () => {
    for (const v of ['omega-ruby', 'alpha-sapphire']) {
      expect(hoennJson.versions, v).toContain(v);
    }
  });

  it('snapshot carries HGSS/GSC tables where the editions have encounters', () => {
    interface NodeData { versions: Record<string, Array<{ rows: Array<{ id: number }> }>> }
    const nodes = routesKantoJson.nodes as unknown as Record<string, NodeData>;
    /* Route 1: HGSS table with the documented cross-gen additions
     * (Sentret/Furret/Hoothoot — Bulbapedia, "Differences among generations") */
    const r1 = nodes['kanto-route-1'];
    expect(Object.keys(r1.versions).sort()).toEqual(
      ['crystal', 'firered', 'gold', 'heartgold', 'leafgreen', 'silver', 'soulsilver'].sort(),
    );
    const hgSpecies = new Set(r1.versions.heartgold.flatMap((g) => g.rows.map((r) => r.id)));
    for (const id of [163, 161, 162, 16, 19]) expect(hgSpecies.has(id), `HGSS species ${id}`).toBe(true);
    /* Cerulean Cave did not exist in GSC — no GSC chips on that page */
    const cc = nodes['cerulean-cave'];
    expect(cc.versions.gold).toBeUndefined();
    expect(cc.versions.heartgold).toBeDefined();
  });
});
