/* Item-consistency invariants (item-consistency fix, audit classes A–D).
 * Map drawer and SEO route pages read two different item sources
 * (src/data/items-{region}.json vs. src/data/enriched/{region}.json) — both
 * surfaces MUST show the union of both, so they can never contradict each
 * other again (the "Bad Lavastadt" bug: drawer showed 3 curated items while
 * the SEO page claimed "no items tracked"). */
import { describe, expect, it } from 'vitest';
import {
  canonicalItemSlug,
  itemsForNode,
  seoItemsForNode,
} from './mapdata';
import type { CuratedItem } from './mapdata';

import itemsKanto from '@/data/items-kanto.json';
import itemsHoenn from '@/data/items-hoenn.json';
import enrichedKanto from '@/data/enriched/kanto.json';
import enrichedHoenn from '@/data/enriched/hoenn.json';
import routesKanto from '@/data/routes-kanto.json';
import routesHoenn from '@/data/routes-hoenn.json';
import regionsHoenn from '@/data/regions/hoenn.json';

interface SourceDef {
  region: string;
  curated: Record<string, CuratedItem[]>;
  enriched: Record<string, Array<{ slug: string; kind: string }>>;
  /** nodes that get a prerendered SEO page */
  seoNodes: string[];
}

const SOURCES: SourceDef[] = [
  {
    region: 'kanto',
    curated: itemsKanto as Record<string, CuratedItem[]>,
    enriched: Object.fromEntries(
      Object.entries(enrichedKanto.nodes).map(([k, v]) => [
        k,
        (v as { items?: Array<{ slug: string; kind: string }> }).items ?? [],
      ]),
    ),
    seoNodes: Object.keys(routesKanto.nodes),
  },
  {
    region: 'hoenn',
    curated: itemsHoenn as Record<string, CuratedItem[]>,
    enriched: Object.fromEntries(
      Object.entries(enrichedHoenn.nodes).map(([k, v]) => [
        k,
        (v as { items?: Array<{ slug: string; kind: string }> }).items ?? [],
      ]),
    ),
    seoNodes: Object.keys(routesHoenn.nodes),
  },
];

/** expected union, computed independently from the raw data files */
function expectedUnion(src: SourceDef, nodeId: string): Set<string> {
  const set = new Set<string>();
  for (const i of src.curated[nodeId] ?? []) set.add(canonicalItemSlug(i.itemSlug, i.name));
  for (const i of src.enriched[nodeId] ?? []) set.add(canonicalItemSlug(i.slug));
  return set;
}

describe('map drawer and SEO pages show the same item union', () => {
  for (const src of SOURCES) {
    const nodeIds = new Set([
      ...Object.keys(src.curated),
      ...Object.keys(src.enriched),
      ...src.seoNodes,
    ]);

    it(`${src.region}: SEO item set == union of both sources (every node)`, () => {
      for (const nodeId of nodeIds) {
        const got = new Set(
          seoItemsForNode(src.region, nodeId).map((i) =>
            canonicalItemSlug(i.slug, i.curated?.name),
          ),
        );
        expect(got, `${src.region}/${nodeId}`).toEqual(expectedUnion(src, nodeId));
      }
    });

    it(`${src.region}: drawer item set == union of both sources (every node)`, () => {
      for (const nodeId of nodeIds) {
        const got = new Set(
          itemsForNode(src.region, nodeId).map((i) => canonicalItemSlug(i.itemSlug, i.name)),
        );
        expect(got, `${src.region}/${nodeId}`).toEqual(expectedUnion(src, nodeId));
      }
    });

    it(`${src.region}: "no items" is only shown when BOTH sources are empty`, () => {
      for (const nodeId of src.seoNodes) {
        const unionEmpty = expectedUnion(src, nodeId).size === 0;
        expect(
          seoItemsForNode(src.region, nodeId).length === 0,
          `${src.region}/${nodeId} SEO`,
        ).toBe(unionEmpty);
        expect(
          itemsForNode(src.region, nodeId).length === 0,
          `${src.region}/${nodeId} drawer`,
        ).toBe(unionEmpty);
      }
    });

    it(`${src.region}: every curated key exists as a map node`, () => {
      if (src.region !== 'hoenn') return;
      const nodeIds = new Set(regionsHoenn.nodes.map((n) => n.id));
      for (const key of Object.keys(src.curated)) {
        expect(nodeIds.has(key), `items-hoenn.json key "${key}"`).toBe(true);
      }
    });

    it(`${src.region}: no SEO page claims "no items" while curation has items (class A guard)`, () => {
      for (const nodeId of src.seoNodes) {
        if ((src.curated[nodeId] ?? []).length > 0) {
          expect(
            seoItemsForNode(src.region, nodeId).length,
            `${src.region}/${nodeId}`,
          ).toBeGreaterThan(0);
        }
      }
    });
  }
});
