/* maps-geo — registry for ORIGINAL map views: static geo-JSON imports +
 * natural image dims per region. Geo JSONs map node ids to [x,y] fractions
 * of the original overworld artwork (resolution-independent). */
import kantoGeo from '@/data/regions/kanto-geo.json';
import johtoGeo from '@/data/regions/johto-geo.json';
import hoennGeo from '@/data/regions/hoenn-geo.json';
import sinnohGeo from '@/data/regions/sinnoh-geo.json';
import unovaGeo from '@/data/regions/unova-geo.json';

export interface RegionGeo {
  version: string;
  image: string;
  /** node id → [x, y] fractions of image width/height (0..1) */
  nodes: Record<string, number[]>;
}

export interface OriginalGeoEntry {
  geo: RegionGeo;
  imgW: number;
  imgH: number;
}

const ORIGINAL_GEO: Record<string, OriginalGeoEntry> = {
  kanto: { geo: kantoGeo as RegionGeo, imgW: 2600, imgH: 2549 },
  johto: { geo: johtoGeo as RegionGeo, imgW: 2600, imgH: 1494 },
  hoenn: { geo: hoennGeo as RegionGeo, imgW: 2600, imgH: 1235 },
  sinnoh: { geo: sinnohGeo as RegionGeo, imgW: 2600, imgH: 1839 },
  unova: { geo: unovaGeo as RegionGeo, imgW: 1536, imgH: 1006 },
};

export function originalGeoFor(region: string): OriginalGeoEntry | null {
  return ORIGINAL_GEO[region] ?? null;
}

export function originalAvailable(region: string): boolean {
  return region in ORIGINAL_GEO;
}

export function artworkVersionId(region: string): string | null {
  return originalGeoFor(region)?.geo.version ?? null;
}

/** true when the ripped image is a different edition than the atlas default */
export function artworkEditionMismatchesDefault(region: string, defaultVersion: string): boolean {
  const art = artworkVersionId(region);
  return !!art && art !== defaultVersion;
}
