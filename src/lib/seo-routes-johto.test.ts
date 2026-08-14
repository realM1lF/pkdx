/* Johto SEO route data validity (routes-johto.json + slug mapping).
 *
 * Guards the generated snapshot against the region contract:
 *  - every mapped/generated node exists in src/data/regions/johto.json
 *  - localized slugs are unique (no URL collisions, de and en)
 *  - every generated node carries encounter rows for HGSS/GSC versions
 *  - pages exist only when HeartGold has wild (non-static) encounters
 *  - dex + names tables cover every referenced species id
 *  - meta descriptions stay ≤ 160 chars */
import { describe, expect, it } from 'vitest';
import johtoJson from '@/data/regions/johto.json';
import routesJohtoJson from '@/data/routes-johto.json';
import metaGen from '@/data/seo-meta-gen.json';
import { metaForPath } from './seo';
import {
  JOHTO_ROUTE_PAGES,
  JOHTO_ROUTE_SLUGS,
  localizeJohtoRoutePath,
  resolveJohtoRouteParam,
} from './seo-routes-johto';

const REGION_NODE_IDS = new Set(johtoJson.nodes.map((n) => n.id));

interface EncounterRow {
  id: number;
  slug?: string;
  method: string;
  chance: number;
  isStatic?: boolean;
}
interface RouteNodeData {
  nameDe: string;
  nameEn: string;
  versions: Record<string, Array<{ rows: EncounterRow[] }>>;
}

const NODES = routesJohtoJson.nodes as unknown as Record<string, RouteNodeData>;
const DEX = routesJohtoJson.dex as unknown as Record<string, { slug: string }>;
const NAMES = routesJohtoJson.names as unknown as Record<string, { de: string; en: string }>;

const HGSS_GSC = ['heartgold', 'soulsilver', 'gold', 'silver', 'crystal'];

describe('seo-routes-johto', () => {
  it('every slug-table node exists in regions/johto.json', () => {
    for (const nodeId of Object.keys(JOHTO_ROUTE_SLUGS)) {
      expect(REGION_NODE_IDS.has(nodeId), `slug table node ${nodeId}`).toBe(true);
    }
  });

  it('no slug collides across nodes (de and en may match within one node)', () => {
    const owner = new Map<string, string>();
    for (const [nodeId, s] of Object.entries(JOHTO_ROUTE_SLUGS)) {
      for (const slug of [s.de, s.en]) {
        const prev = owner.get(slug);
        expect(prev === undefined || prev === nodeId, `slug ${slug}: ${prev} vs ${nodeId}`).toBe(true);
        owner.set(slug, nodeId);
      }
    }
  });

  it('every generated node exists in regions/johto.json', () => {
    for (const nodeId of Object.keys(NODES)) {
      expect(REGION_NODE_IDS.has(nodeId), `generated node ${nodeId}`).toBe(true);
    }
  });

  it('every generated node has encounter rows for at least one HGSS/GSC version', () => {
    for (const [nodeId, data] of Object.entries(NODES)) {
      const versions = Object.keys(data.versions);
      expect(versions.length, nodeId).toBeGreaterThan(0);
      for (const v of versions) {
        expect(HGSS_GSC, `${nodeId} version ${v}`).toContain(v);
        expect(data.versions[v].length, `${nodeId} ${v}`).toBeGreaterThan(0);
        for (const g of data.versions[v]) expect(g.rows.length, `${nodeId} ${v}`).toBeGreaterThan(0);
      }
    }
  });

  it('dex and names cover every referenced species id', () => {
    for (const [nodeId, data] of Object.entries(NODES)) {
      for (const groups of Object.values(data.versions)) {
        for (const g of groups) {
          for (const row of g.rows) {
            expect(DEX[String(row.id)], `dex ${row.id} (${nodeId})`).toBeDefined();
            expect(NAMES[String(row.id)], `names ${row.id} (${nodeId})`).toBeDefined();
          }
        }
      }
    }
  });

  it('rendered pages = slug table ∩ HeartGold wild encounters (routesJohto)', () => {
    const meta = (metaGen as unknown as { routesJohto: Record<string, unknown> }).routesJohto;
    expect(meta).toBeDefined();
    for (const nodeId of Object.keys(meta)) {
      expect(NODES[nodeId], `meta node ${nodeId}`).toBeDefined();
      const hg = NODES[nodeId].versions.heartgold;
      expect(hg, `${nodeId} framing HeartGold`).toBeDefined();
      const wild = (hg ?? []).flatMap((g) => g.rows).filter((r) => !r.isStatic);
      expect(wild.length, `${nodeId} wild HeartGold rows`).toBeGreaterThan(0);
    }
    expect([...JOHTO_ROUTE_PAGES].sort()).toEqual(
      Object.keys(JOHTO_ROUTE_SLUGS)
        .filter((id) => meta[id])
        .sort(),
    );
  });

  it('param resolution works in both locales and rejects unknown slugs', () => {
    expect(resolveJohtoRouteParam('route-29')).toBe('johto-route-29');
    expect(resolveJohtoRouteParam('steineichenwald')).toBe('ilex-forest');
    expect(resolveJohtoRouteParam('ilex-forest')).toBe('ilex-forest');
    expect(resolveJohtoRouteParam('route-999')).toBeNull();
    expect(resolveJohtoRouteParam(undefined)).toBeNull();
  });

  it('localizeJohtoRoutePath swaps DE/EN slugs', () => {
    expect(localizeJohtoRoutePath('/maps/johto/steineichenwald', 'en')).toBe('/maps/johto/ilex-forest');
    expect(localizeJohtoRoutePath('/maps/johto/ilex-forest', 'de')).toBe('/maps/johto/steineichenwald');
    expect(localizeJohtoRoutePath('/maps/johto/unknown', 'de')).toBe('/maps/johto/unknown');
  });

  it('Route 32 HeartGold Qwilfish swarm is OTHER, not FISH 90', () => {
    const hg = NODES['johto-route-32']?.versions.heartgold ?? [];
    const qwil = hg.flatMap((g) => g.rows).filter((r) => r.id === 211 || r.slug === 'qwilfish');
    expect(qwil.length).toBeGreaterThan(0);
    const swarmish = qwil.find((r) => r.chance === 90) ?? qwil[0];
    expect(swarmish.method).not.toBe('FISH');
    expect(swarmish.method).toBe('OTHER');
  });

  it('meta descriptions stay ≤ 160 chars in both locales', () => {
    for (const nodeId of JOHTO_ROUTE_PAGES) {
      const slugs = JOHTO_ROUTE_SLUGS[nodeId];
      const meta = metaForPath(`/maps/johto/${slugs.de}`);
      expect(meta.description.de.length, `${nodeId} de`).toBeLessThanOrEqual(160);
      expect(meta.description.en.length, `${nodeId} en`).toBeLessThanOrEqual(160);
    }
  });
});
