/* Lazy loader for enriched trainer JSON per map region (versus community overhaul). */
import type { RegionId } from './regions';
import type { EnrichedTrainer } from './versus';
import { trainerIndex } from './versus';
import { VERSION_GROUPS, versionGroupForGame } from './version-groups';

import kantoJson from '@/data/enriched/kanto.json';
import johtoJson from '@/data/enriched/johto.json';
import hoennJson from '@/data/enriched/hoenn.json';
import sinnohJson from '@/data/enriched/sinnoh.json';
import unovaJson from '@/data/enriched/unova.json';

type EnrichedJson = Parameters<typeof trainerIndex>[0] & { game?: string };

export type TrainerCoverage = 'routes' | 'key-battles' | 'none';

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

/** Trainers attached to one map node (same join as gyms / versus picker). */
export function trainersAtNode(region: RegionId, nodeId: string): EnrichedTrainer[] {
  return trainersForRegion(region).filter((t) => t.node === nodeId);
}

export function trainerGroupKey(t: { class: string }): 'leaders' | 'e4' | 'boss' | 'rival' | 'route' {
  if (t.class === 'Leader') return 'leaders';
  if (t.class === 'Elite Four' || t.class === 'Champion') return 'e4';
  if (t.class === 'Boss') return 'boss';
  if (t.class === 'Rival') return 'rival';
  return 'route';
}

/** How complete curated trainer data is for a region. */
export function trainerCoverage(region: RegionId): TrainerCoverage {
  const list = trainersForRegion(region);
  if (!list.length) return 'none';
  if (list.some((t) => trainerGroupKey(t) === 'route')) return 'routes';
  return 'key-battles';
}

/** Tab count: `null` when 0 would lie (region has no route trainers in data). */
export function mapsTrainerTabCount(region: RegionId, count: number): number | null {
  if (count > 0) return count;
  return trainerCoverage(region) === 'routes' ? 0 : null;
}

export function mapsTrainerEmptyKey(region: RegionId): 'maps.noTrainers' | 'maps.noTrainersKeyBattles' {
  return trainerCoverage(region) === 'key-battles' ? 'maps.noTrainersKeyBattles' : 'maps.noTrainers';
}

function resolveVersionGroup(game: string | null | undefined): string | null {
  if (!game) return null;
  return versionGroupForGame(game) ?? (VERSION_GROUPS.some((v) => v.id === game) ? game : null);
}

/** Enriched JSON `game` field (firered, heartgold, emerald, platinum, black-white). */
export function trainerArtifactGame(region: RegionId): string | null {
  return SYNC_JSON[region]?.game ?? null;
}

/** Artifact game → version-group id; accepts a VG id such as `black-white`. */
export function trainerArtifactVersionGroup(region: RegionId): string | null {
  return resolveVersionGroup(trainerArtifactGame(region));
}

/** True when the selected game's version group is not the artifact's. */
export function trainerSourceMismatchesGame(region: RegionId, selectedGame: string): boolean {
  const artifactVg = trainerArtifactVersionGroup(region);
  const selectedVg = resolveVersionGroup(selectedGame);
  return artifactVg !== selectedVg;
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
