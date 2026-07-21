/* Lazy loader for enriched trainer JSON per map region (versus community overhaul). */
import type { RegionId } from './regions';
import type { EnrichedTrainer } from './versus';
import { trainerIndex } from './versus';

import kantoJson from '@/data/enriched/kanto.json';
import johtoJson from '@/data/enriched/johto.json';
import hoennJson from '@/data/enriched/hoenn.json';
import sinnohJson from '@/data/enriched/sinnoh.json';
import unovaJson from '@/data/enriched/unova.json';

type EnrichedJson = Parameters<typeof trainerIndex>[0];

const SYNC_JSON: Record<RegionId, EnrichedJson> = {
  kanto: kantoJson as EnrichedJson,
  johto: johtoJson as EnrichedJson,
  hoenn: hoennJson as EnrichedJson,
  sinnoh: sinnohJson as EnrichedJson,
  unova: unovaJson as EnrichedJson,
};

const cache = new Map<RegionId, EnrichedTrainer[]>();

const LOADERS: Record<RegionId, () => Promise<EnrichedJson>> = {
  kanto: () => Promise.resolve(SYNC_JSON.kanto),
  johto: () => Promise.resolve(SYNC_JSON.johto),
  hoenn: () => Promise.resolve(SYNC_JSON.hoenn),
  sinnoh: () => Promise.resolve(SYNC_JSON.sinnoh),
  unova: () => Promise.resolve(SYNC_JSON.unova),
};

/** Sync read from cache — empty until {@link loadTrainersForRegion} resolves. */
export function trainersForRegion(region: RegionId): EnrichedTrainer[] {
  return cache.get(region) ?? trainerIndex(SYNC_JSON[region]);
}

/** Whether a map node has curated trainer data (sync, for maps drawer). */
export function hasTrainersAtNode(region: RegionId, nodeId: string): boolean {
  const node = SYNC_JSON[region]?.nodes?.[nodeId];
  return (node?.trainers?.length ?? 0) > 0;
}

/** Highest-level party member from the first important trainer at a node (link placeholder). */
export function aceSpeciesForNode(region: RegionId, nodeId: string): string | null {
  const trainers = trainersForRegion(region).filter((t) => t.node === nodeId);
  const trainer = trainers.find((t) => t.important) ?? trainers[0];
  if (!trainer?.party.length) return null;
  return trainer.party.reduce((best, m) => (m.level > best.level ? m : best), trainer.party[0]).species;
}

/** Load (once) and cache trainers for a region. */
export async function loadTrainersForRegion(region: RegionId): Promise<EnrichedTrainer[]> {
  const hit = cache.get(region);
  if (hit) return hit;
  const json = await LOADERS[region]();
  const list = trainerIndex(json);
  cache.set(region, list);
  return list;
}

/** Preload kanto synchronously for first paint where dynamic import isn't ready yet. */
export function primeTrainerCache(region: RegionId, list: EnrichedTrainer[]): void {
  cache.set(region, list);
}
