import { describe, expect, it } from 'vitest'
import { anyRegionById } from './regions-freeform'
import {
  ORRE_EXPECTED_COUNTS,
  allLocationIds,
  artifactFor,
  shadowsFor,
} from './orre'
import type { OrreGame } from './orre-types'

const GAMES: OrreGame[] = ['colosseum', 'xd']

describe('orre artifacts', () => {
  for (const game of GAMES) {
    it(`${game} has exact shadow count`, () => {
      expect(artifactFor(game).shadows).toHaveLength(ORRE_EXPECTED_COUNTS[game])
    })

    it(`${game} has unique ids and orders`, () => {
      const shadows = shadowsFor(game)
      expect(new Set(shadows.map((s) => s.id)).size).toBe(shadows.length)
      expect(new Set(shadows.map((s) => s.order)).size).toBe(shadows.length)
    })

    it(`${game} locationIds exist on region orre`, () => {
      const region = anyRegionById('orre')
      expect(region).toBeTruthy()
      const nodeIds = new Set(region!.nodes.map((n) => n.id))
      for (const s of shadowsFor(game)) {
        expect(nodeIds.has(s.locationId), `${s.id} location ${s.locationId}`).toBe(true)
        if (s.reappear?.locationId) {
          expect(nodeIds.has(s.reappear.locationId), `${s.id} reappear`).toBe(true)
        }
      }
    })
  }

  it('allLocationIds are covered by region nodes', () => {
    const region = anyRegionById('orre')
    expect(region).toBeTruthy()
    const nodeIds = new Set(region!.nodes.map((n) => n.id))
    for (const id of allLocationIds()) {
      expect(nodeIds.has(id)).toBe(true)
    }
  })
})
