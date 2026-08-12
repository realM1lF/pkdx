import colo from '@/data/orre/colosseum.json'
import xd from '@/data/orre/xd.json'
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
