export type OrreGame = 'colosseum' | 'xd'

export type ReappearKind = 'reappear' | 'miror-radar' | 'story-lock' | 'postgame'

export interface OrreReappear {
  locationId?: string
  note: string
  kind?: ReappearKind
}

export interface OrreShadow {
  id: string
  species: string
  level: number
  trainer: string
  locationId: string
  order: number
  required: boolean
  reappear?: OrreReappear
  notes?: string
}

export interface OrreArtifact {
  game: OrreGame
  source: string
  verifiedAt: string
  shadows: OrreShadow[]
}

export type ShadowStatus = 'remaining' | 'snagged' | 'missed'

export type PokeSpotTerrain = 'rock' | 'oasis' | 'cave'

export interface PokeSpotEncounter {
  species: string
  minLevel: number
  maxLevel: number
  rate: number
}

export interface PokeSpotTrade {
  give: string
  receive: string
  npc: string
  npcDe: string
}

export interface PokeSpot {
  id: string
  terrain: PokeSpotTerrain
  label: string
  nameDe: string
  order: number
  rarest: string
  trade: PokeSpotTrade
  encounters: PokeSpotEncounter[]
}

/** Poké Spot walk-ins that eat the bait — never battled, never caught. */
export interface PokeSpotVisitor {
  species: string
  chance: number
  catchable: false
  repeatable: boolean
  note: string
}

export interface PokeSpotArtifact {
  game: 'xd'
  source: string
  verifiedAt: string
  bait: string
  spots: PokeSpot[]
  visitors: PokeSpotVisitor[]
}
