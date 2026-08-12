/* regions-freeform — MAP-LESS regions for Nuzlocke text-mode runs.
 * Gen 6–9 lists come from scripts/build-freeform-regions.mjs; Orre is curated
 * from src/data/orre/*.json locationIds. No map geometry (edges: [], x/y: 0) —
 * decoupled from /maps / atlas (REGIONS). Nuzlocke: anyRegionById(); maps: regionById(). */

import kalosJson from '@/data/regions/kalos.json';
import alolaJson from '@/data/regions/alola.json';
import galarJson from '@/data/regions/galar.json';
import hisuiJson from '@/data/regions/hisui.json';
import paldeaJson from '@/data/regions/paldea.json';
import orreJson from '@/data/regions/orre.json';
import { regionById } from './regions';
import type { RegionMap } from './regions';

export type FreeformRegionId = 'kalos' | 'alola' | 'galar' | 'hisui' | 'paldea' | 'orre';

/** Map-less Nuzlocke regions, in canonical order. */
export const FREEFORM_REGIONS: readonly RegionMap[] = [
  kalosJson as RegionMap,
  alolaJson as RegionMap,
  galarJson as RegionMap,
  hisuiJson as RegionMap,
  paldeaJson as RegionMap,
  orreJson as RegionMap,
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
