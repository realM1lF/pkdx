import type { OrreGame, ShadowStatus } from './orre-types'
import { shadowsFor } from './orre'
import { readLocalJson, writeLocalJson } from './storage'

const KEY = 'pdx2.orre.progress'

type ProgressStore = Record<OrreGame, Partial<Record<string, ShadowStatus>>>

function emptyProgress(): ProgressStore {
  return { colosseum: {}, xd: {} }
}

export function loadProgress(): Record<string, Partial<Record<string, ShadowStatus>>> {
  return readLocalJson<ProgressStore>(KEY, emptyProgress())
}

export function getStatus(game: OrreGame, id: string): ShadowStatus {
  const progress = loadProgress()
  return progress[game]?.[id] ?? 'remaining'
}

export function setStatus(game: OrreGame, id: string, status: ShadowStatus): void {
  const progress = loadProgress()
  const gameProgress = { ...(progress[game] ?? {}) }

  if (status === 'remaining') {
    delete gameProgress[id]
  } else {
    gameProgress[id] = status
  }

  writeLocalJson(KEY, { ...progress, [game]: gameProgress })
}

export function counts(game: OrreGame): { snagged: number; missed: number; remaining: number } {
  const gameProgress = loadProgress()[game] ?? {}
  let snagged = 0
  let missed = 0

  for (const status of Object.values(gameProgress)) {
    if (status === 'snagged') snagged++
    else if (status === 'missed') missed++
  }

  const total = shadowsFor(game).length
  return { snagged, missed, remaining: total - snagged - missed }
}
