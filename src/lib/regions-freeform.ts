/* regions-freeform — EP5.3: MAP-LESS regions (Gen 6–9) for Nuzlocke
 * text-mode runs. These regions carry a full route/location list (generated
 * from PokéAPI by scripts/build-freeform-regions.mjs) but intentionally NO
 * map geometry (edges: [], x/y: 0) — they are decoupled from /maps and are
 * NOT part of the atlas (REGIONS in regions.ts). Nuzlocke lookups should use
 * anyRegionById(); /maps keeps using the atlas-only regionById(). */

import kalosJson from '@/data/regions/kalos.json';
import alolaJson from '@/data/regions/alola.json';
import galarJson from '@/data/regions/galar.json';
import hisuiJson from '@/data/regions/hisui.json';
import paldeaJson from '@/data/regions/paldea.json';
import { regionById } from './regions';
import type { RegionMap } from './regions';

export type FreeformRegionId = 'kalos' | 'alola' | 'galar' | 'hisui' | 'paldea';

/** Map-less Nuzlocke regions, in canonical order. */
export const FREEFORM_REGIONS: readonly RegionMap[] = [
  kalosJson as RegionMap,
  alolaJson as RegionMap,
  galarJson as RegionMap,
  hisuiJson as RegionMap,
  paldeaJson as RegionMap,
];

const FREEFORM_BY_ID = new Map<string, RegionMap>(FREEFORM_REGIONS.map((r) => [r.region, r]));

export function isFreeformRegion(id: string | undefined | null): boolean {
  return !!id && FREEFORM_BY_ID.has(id);
}

export function freeformRegionById(id: string | undefined | null): RegionMap | undefined {
  if (!id) return undefined;
  return FREEFORM_BY_ID.get(id);
}

/** Nuzlocke-wide region lookup: atlas first, then freeform (map-less). */
export function anyRegionById(id: string | undefined | null): RegionMap | undefined {
  return regionById(id) ?? freeformRegionById(id);
}
