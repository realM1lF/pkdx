import colo from '@/data/orre/colosseum.json'
import xd from '@/data/orre/xd.json'
import xdPokeSpots from '@/data/orre/xd-poke-spots.json'
import type { RegionMap } from './regions'
import { anyRegionById, freeformRegionById } from './regions-freeform'
import type { OrreArtifact, OrreGame, OrreShadow, PokeSpot, PokeSpotArtifact } from './orre-types'

export const ORRE_EXPECTED_COUNTS: Record<OrreGame, number> = {
  colosseum: 48,
  xd: 83,
}

const ARTIFACTS: Record<OrreGame, OrreArtifact> = {
  colosseum: colo as OrreArtifact,
  xd: xd as OrreArtifact,
}

const POKE_SPOTS = xdPokeSpots as PokeSpotArtifact

export function artifactFor(game: OrreGame): OrreArtifact {
  return ARTIFACTS[game]
}

export function pokeSpotArtifact(): PokeSpotArtifact {
  return POKE_SPOTS
}

/** The three XD Poké Spots in story order (Rock → Oasis → Cave). */
export function pokeSpots(): PokeSpot[] {
  return [...POKE_SPOTS.spots].sort((a, b) => a.order - b.order)
}

export function pokeSpotById(id: string): PokeSpot | undefined {
  return POKE_SPOTS.spots.find((s) => s.id === id)
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

/** Note strings the tracker can render. `notes` always; `reappear.note` when present. */
export function shadowNotesToShow(shadow: Pick<OrreShadow, 'notes' | 'reappear'>): {
  notes?: string
  reappearNote?: string
} {
  const out: { notes?: string; reappearNote?: string } = {}
  if (shadow.notes) out.notes = shadow.notes
  if (shadow.reappear?.note) out.reappearNote = shadow.reappear.note
  return out
}

/** Species slugs snaggable at a Nuzlocke route_key for an Orre game. */
export function snagSpeciesForRoute(game: OrreGame, routeKey: string): string[] {
  return shadowsAtLocation(game, routeKey).map((s) => s.species)
}

/** Species slugs catchable wild at a route_key. Colosseum has no wild encounters. */
export function wildSpeciesForRoute(game: OrreGame, routeKey: string): string[] {
  if (game !== 'xd') return []
  return pokeSpotById(routeKey)?.encounters.map((e) => e.species) ?? []
}

export interface OrreEncounterOption {
  species: string
  kind: 'shadow' | 'wild'
  /** shadows are guaranteed (100); wild slots carry their Poké Spot rate */
  rate: number
  minLevel: number
  maxLevel: number
  /** curated Shadow id — only set for kind === 'shadow' */
  shadowId?: string
}

/**
 * Everything a Nuzlocke player can obtain at one Orre route_key: the curated
 * shadows first, then the XD Poké Spot table. Deduped by species — a shadow
 * always wins over a wild slot of the same species.
 */
export function encounterOptionsForRoute(game: OrreGame, routeKey: string): OrreEncounterOption[] {
  const out: OrreEncounterOption[] = []
  const seen = new Set<string>()
  for (const s of shadowsAtLocation(game, routeKey)) {
    if (seen.has(s.species)) continue
    seen.add(s.species)
    out.push({ species: s.species, kind: 'shadow', rate: 100, minLevel: s.level, maxLevel: s.level, shadowId: s.id })
  }
  if (game === 'xd') {
    for (const e of pokeSpotById(routeKey)?.encounters ?? []) {
      if (seen.has(e.species)) continue
      seen.add(e.species)
      out.push({ species: e.species, kind: 'wild', rate: e.rate, minLevel: e.minLevel, maxLevel: e.maxLevel })
    }
  }
  return out
}

/**
 * Orre freeform region filtered to the locations one game can yield a Pokémon
 * at, ordered by first shadow `order` there. XD also lists the three Poké
 * Spots, two of which host no shadow at all. Used by Nuzlocke timeline/KPIs so
 * Colo runs do not list XD-only Citadark slots (and vice versa).
 *
 * Cached per game: callers (NuzlockeRun → useRegionData) treat `region` as a
 * React dependency. Fresh objects every call re-fire setState and hit
 * "Maximum update depth exceeded".
 */
const ORRE_REGION_BY_GAME: Partial<Record<OrreGame, RegionMap>> = {}

export function orreRegionForGame(game: OrreGame): RegionMap {
  const cached = ORRE_REGION_BY_GAME[game]
  if (cached) return cached

  const base = freeformRegionById('orre')
  if (!base) {
    const empty = {
      region: 'orre' as RegionMap['region'],
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
    ORRE_REGION_BY_GAME[game] = empty
    return empty
  }

  const orderByLoc = new Map<string, number>()
  for (const s of shadowsFor(game)) {
    const prev = orderByLoc.get(s.locationId)
    if (prev === undefined || s.order < prev) orderByLoc.set(s.locationId, s.order)
  }
  if (game === 'xd') {
    /* Poké Spots open right after Cipher Lab (shadow order 14), so slot them
     * between 14 and the following ONBS block via a fractional order. */
    for (const spot of pokeSpots()) {
      const slotted = 14 + spot.order / 10
      const prev = orderByLoc.get(spot.id)
      orderByLoc.set(spot.id, prev === undefined ? slotted : Math.min(prev, slotted))
    }
  }

  const nodes = base.nodes
    .filter((n) => orderByLoc.has(n.id))
    .map((n) => ({ ...n, order: orderByLoc.get(n.id)! }))
    .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id))
    .map((n, i) => ({ ...n, order: i + 1 }))

  const species = new Set(shadowsFor(game).map((s) => s.species))
  if (game === 'xd') {
    for (const spot of pokeSpots()) for (const e of spot.encounters) species.add(e.species)
  }

  const built: RegionMap = {
    ...base,
    versions: [game],
    defaultVersion: game,
    speciesCount: species.size,
    nodes,
  }
  ORRE_REGION_BY_GAME[game] = built
  return built
}

/** Region lookup for a run — Orre is game-scoped; everything else is anyRegionById. */
export function regionForRun(regionId: string | null | undefined, game: string | null | undefined): RegionMap | undefined {
  if (!regionId) return undefined
  if (regionId === 'orre' && isOrreGame(game)) return orreRegionForGame(game)
  return anyRegionById(regionId)
}
