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
