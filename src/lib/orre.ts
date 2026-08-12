import colo from '@/data/orre/colosseum.json'
import xd from '@/data/orre/xd.json'
import type { RegionMap } from './regions'
import { anyRegionById, freeformRegionById } from './regions-freeform'
import type { OrreArtifact, OrreGame, OrreShadow } from './orre-types'

export const ORRE_EXPECTED_COUNTS: Record<OrreGame, number> = {
  colosseum: 48,
  xd: 83,
}

const ARTIFACTS: Record<OrreGame, OrreArtifact> = {
  colosseum: colo as OrreArtifact,
  xd: xd as OrreArtifact,
}

export function artifactFor(game: OrreGame): OrreArtifact {
  return ARTIFACTS[game]
}

export function shadowsFor(game: OrreGame): OrreShadow[] {
  return [...ARTIFACTS[game].shadows].sort((a, b) => a.order - b.order)
}

export function shadowById(game: OrreGame, id: string): OrreShadow | undefined {
  return ARTIFACTS[game].shadows.find((s) => s.id === id)
}

export function shadowsAtLocation(game: OrreGame, locationId: string): OrreShadow[] {
  return shadowsFor(game).filter((s) => s.locationId === locationId)
}

export function allLocationIds(game?: OrreGame): string[] {
  const games: OrreGame[] = game ? [game] : ['colosseum', 'xd']
  const set = new Set<string>()
  for (const g of games) {
    for (const s of ARTIFACTS[g].shadows) {
      set.add(s.locationId)
      if (s.reappear?.locationId) set.add(s.reappear.locationId)
    }
  }
  return [...set].sort()
}

export function isOrreGame(game: string | null | undefined): game is OrreGame {
  return game === 'colosseum' || game === 'xd'
}

/** Species slugs snaggable at a Nuzlocke route_key for an Orre game. */
export function snagSpeciesForRoute(game: OrreGame, routeKey: string): string[] {
  return shadowsAtLocation(game, routeKey).map((s) => s.species)
}

/**
 * Orre freeform region filtered to snag locations for one game, ordered by
 * first shadow `order` at that location. Used by Nuzlocke timeline/KPIs so
 * Colo runs do not list XD-only Citadark slots (and vice versa).
 */
export function orreRegionForGame(game: OrreGame): RegionMap {
  const base = freeformRegionById('orre')
  if (!base) {
    return {
      region: 'orre',
      name: 'Orre',
      nameDe: 'Orre',
      gen: 'III',
      accent: '#C4A35A',
      viewBox: '0 0 1200 840',
      versions: [game],
      defaultVersion: game,
      coverage: 1,
      speciesCount: 0,
      nodes: [],
      edges: [],
    } as RegionMap
  }

  const orderByLoc = new Map<string, number>()
  for (const s of shadowsFor(game)) {
    const prev = orderByLoc.get(s.locationId)
    if (prev === undefined || s.order < prev) orderByLoc.set(s.locationId, s.order)
  }

  const nodes = base.nodes
    .filter((n) => orderByLoc.has(n.id))
    .map((n) => ({ ...n, order: orderByLoc.get(n.id)! }))
    .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id))
    .map((n, i) => ({ ...n, order: i + 1 }))

  return {
    ...base,
    versions: [game],
    defaultVersion: game,
    speciesCount: new Set(shadowsFor(game).map((s) => s.species)).size,
    nodes,
  }
}

/** Region lookup for a run — Orre is game-scoped; everything else is anyRegionById. */
export function regionForRun(regionId: string | null | undefined, game: string | null | undefined): RegionMap | undefined {
  if (!regionId) return undefined
  if (regionId === 'orre' && isOrreGame(game)) return orreRegionForGame(game)
  return anyRegionById(regionId)
}
