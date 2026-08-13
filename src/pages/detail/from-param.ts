/* Parse `?from=region:nodeId` (Maps ↔ detail contract, architecture.md §5). */
import { isRegionId, regionById } from '@/lib/regions';
import type { RegionId } from '@/lib/regions';

export interface MapsFromRef {
  region: RegionId;
  nodeId: string;
}

/** `kanto:kanto-route-1` → ref; unknown region/node or bad shape → null. */
export function parseMapsFromParam(from: string | null | undefined): MapsFromRef | null {
  if (!from) return null;
  const parts = from.split(':');
  if (parts.length !== 2) return null;
  const [region, nodeId] = parts;
  if (!isRegionId(region) || !nodeId) return null;
  const map = regionById(region);
  if (!map?.nodes.some((n) => n.id === nodeId)) return null;
  return { region, nodeId };
}
