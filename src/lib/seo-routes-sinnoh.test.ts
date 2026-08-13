/* Sinnoh SEO route data validity (routes-sinnoh.json + slug mapping).
 *
 * Guards the generated snapshot against the region contract:
 *  - every mapped/generated node exists in src/data/regions/sinnoh.json
 *  - localized slugs are unique (no URL collisions, de and en)
 *  - every generated node carries encounter rows for DPPt versions
 *  - pages exist only when Platinum has wild (non-static) encounters
 *  - dex + names tables cover every referenced species id
 *  - meta descriptions stay ≤ 160 chars */
import { describe, expect, it } from 'vitest';
import sinnohJson from '@/data/regions/sinnoh.json';
import routesSinnohJson from '@/data/routes-sinnoh.json';
import metaGen from '@/data/seo-meta-gen.json';
import { metaForPath } from './seo';
import {
  SINNOH_ROUTE_PAGES,
  SINNOH_ROUTE_SLUGS,
  localizeSinnohRoutePath,
  resolveSinnohRouteParam,
} from './seo-routes-sinnoh';

const REGION_NODE_IDS = new Set(sinnohJson.nodes.map((n) => n.id));

interface EncounterRow {
  id: number;
  method: string;
  chance: number;
  isStatic?: boolean;
}
interface RouteNodeData {
  nameDe: string;
  nameEn: string;
  versions: Record<string, Array<{ rows: EncounterRow[] }>>;
}

const NODES = routesSinnohJson.nodes as unknown as Record<string, RouteNodeData>;
const DEX = routesSinnohJson.dex as unknown as Record<string, { slug: string }>;
const NAMES = routesSinnohJson.names as unknown as Record<string, { de: string; en: string }>;

const DPPT = ['diamond', 'pearl', 'platinum'];

describe('seo-routes-sinnoh', () => {
  it('every slug-table node exists in regions/sinnoh.json', () => {
    for (const nodeId of Object.keys(SINNOH_ROUTE_SLUGS)) {
      expect(REGION_NODE_IDS.has(nodeId), `slug table node ${nodeId}`).toBe(true);
    }
  });

  it('no slug collides across nodes (de and en may match within one node)', () => {
    const owner = new Map<string, string>();
    for (const [nodeId, s] of Object.entries(SINNOH_ROUTE_SLUGS)) {
      for (const slug of [s.de, s.en]) {
        const prev = owner.get(slug);
        expect(prev === undefined || prev === nodeId, `slug ${slug}: ${prev} vs ${nodeId}`).toBe(true);
        owner.set(slug, nodeId);
      }
    }
  });

  it('every generated node exists in regions/sinnoh.json', () => {
    for (const nodeId of Object.keys(NODES)) {
      expect(REGION_NODE_IDS.has(nodeId), `generated node ${nodeId}`).toBe(true);
    }
  });

  it('every generated node has encounter rows for at least one DPPt version', () => {
    for (const [nodeId, data] of Object.entries(NODES)) {
      const versions = Object.keys(data.versions);
      expect(versions.length, nodeId).toBeGreaterThan(0);
      for (const v of versions) {
        expect(DPPT, `${nodeId} version ${v}`).toContain(v);
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

  it('rendered pages = slug table ∩ Platinum wild encounters (routesSinnoh)', () => {
    const meta = (metaGen as unknown as { routesSinnoh: Record<string, unknown> }).routesSinnoh;
    expect(meta).toBeDefined();
    for (const nodeId of Object.keys(meta)) {
      expect(NODES[nodeId], `meta node ${nodeId}`).toBeDefined();
      const pt = NODES[nodeId].versions.platinum;
      expect(pt, `${nodeId} framing Platinum`).toBeDefined();
      const wild = (pt ?? []).flatMap((g) => g.rows).filter((r) => !r.isStatic);
      expect(wild.length, `${nodeId} wild Platinum rows`).toBeGreaterThan(0);
    }
    expect([...SINNOH_ROUTE_PAGES].sort()).toEqual(
      Object.keys(SINNOH_ROUTE_SLUGS)
        .filter((id) => meta[id])
        .sort(),
    );
  });

  it('param resolution works in both locales and rejects unknown slugs', () => {
    expect(resolveSinnohRouteParam('route-201')).toBe('sinnoh-route-201');
    expect(resolveSinnohRouteParam('ewigwald')).toBe('eterna-forest');
    expect(resolveSinnohRouteParam('eterna-forest')).toBe('eterna-forest');
    expect(resolveSinnohRouteParam('route-999')).toBeNull();
    expect(resolveSinnohRouteParam(undefined)).toBeNull();
  });

  it('localizeSinnohRoutePath swaps DE/EN slugs', () => {
    expect(localizeSinnohRoutePath('/maps/sinnoh/ewigwald', 'en')).toBe('/maps/sinnoh/eterna-forest');
    expect(localizeSinnohRoutePath('/maps/sinnoh/eterna-forest', 'de')).toBe('/maps/sinnoh/ewigwald');
    expect(localizeSinnohRoutePath('/maps/sinnoh/unknown', 'de')).toBe('/maps/sinnoh/unknown');
  });

  it('meta descriptions stay ≤ 160 chars in both locales', () => {
    for (const nodeId of SINNOH_ROUTE_PAGES) {
      const slugs = SINNOH_ROUTE_SLUGS[nodeId];
      const meta = metaForPath(`/maps/sinnoh/${slugs.de}`);
      expect(meta.description.de.length, `${nodeId} de`).toBeLessThanOrEqual(160);
      expect(meta.description.en.length, `${nodeId} en`).toBeLessThanOrEqual(160);
    }
  });
});
