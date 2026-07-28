/* Hoenn SEO route data validity (routes-hoenn.json + slug mapping).
 *
 * Guards the generated snapshot against the region contract:
 *  - every mapped/generated node exists in src/data/regions/hoenn.json
 *  - localized slugs are unique (no URL collisions, de and en)
 *  - every generated node carries encounter rows for the RSE versions
 *  - dex + names tables cover every referenced species id */
import { describe, expect, it } from 'vitest';
import hoennJson from '@/data/regions/hoenn.json';
import routesHoennJson from '@/data/routes-hoenn.json';
import metaGen from '@/data/seo-meta-gen.json';
import { HOENN_ROUTE_PAGES, HOENN_ROUTE_SLUGS, resolveHoennRouteParam } from './seo-routes-hoenn';

const REGION_NODE_IDS = new Set(hoennJson.nodes.map((n) => n.id));

interface EncounterRow {
  id: number;
  method: string;
  chance: number;
}
interface RouteNodeData {
  nameDe: string;
  nameEn: string;
  versions: Record<string, Array<{ rows: EncounterRow[] }>>;
}

const NODES = routesHoennJson.nodes as unknown as Record<string, RouteNodeData>;
const DEX = routesHoennJson.dex as unknown as Record<string, { slug: string }>;
const NAMES = routesHoennJson.names as unknown as Record<string, { de: string; en: string }>;

describe('seo-routes-hoenn', () => {
  it('every slug-table node exists in regions/hoenn.json', () => {
    for (const nodeId of Object.keys(HOENN_ROUTE_SLUGS)) {
      expect(REGION_NODE_IDS.has(nodeId), `slug table node ${nodeId}`).toBe(true);
    }
  });

  it('no slug collides across nodes (de and en may match within one node)', () => {
    const owner = new Map<string, string>();
    for (const [nodeId, s] of Object.entries(HOENN_ROUTE_SLUGS)) {
      for (const slug of [s.de, s.en]) {
        const prev = owner.get(slug);
        expect(prev === undefined || prev === nodeId, `slug ${slug}: ${prev} vs ${nodeId}`).toBe(true);
        owner.set(slug, nodeId);
      }
    }
  });

  it('every generated node exists in regions/hoenn.json', () => {
    for (const nodeId of Object.keys(NODES)) {
      expect(REGION_NODE_IDS.has(nodeId), `generated node ${nodeId}`).toBe(true);
    }
  });

  it('every generated node has encounter rows for at least one RSE version', () => {
    for (const [nodeId, data] of Object.entries(NODES)) {
      const versions = Object.keys(data.versions);
      expect(versions.length, nodeId).toBeGreaterThan(0);
      for (const v of versions) {
        expect(['ruby', 'sapphire', 'emerald'], `${nodeId} version ${v}`).toContain(v);
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

  it('rendered pages = slug table ∩ generated meta (routesHoenn)', () => {
    const meta = (metaGen as unknown as { routesHoenn: Record<string, unknown> }).routesHoenn;
    expect(Object.keys(meta).sort()).toEqual(Object.keys(NODES).sort());
    expect([...HOENN_ROUTE_PAGES].sort()).toEqual(
      Object.keys(HOENN_ROUTE_SLUGS)
        .filter((id) => meta[id])
        .sort(),
    );
  });

  it('param resolution works in both locales and rejects unknown slugs', () => {
    expect(resolveHoennRouteParam('route-101')).toBe('hoenn-route-101');
    expect(resolveHoennRouteParam('bluetenburgwald')).toBe('petalburg-woods');
    expect(resolveHoennRouteParam('petalburg-woods')).toBe('petalburg-woods');
    expect(resolveHoennRouteParam('route-999')).toBeNull();
    expect(resolveHoennRouteParam(undefined)).toBeNull();
  });
});
