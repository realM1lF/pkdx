import { describe, expect, it } from 'vitest'
import { anyRegionById } from './regions-freeform'
import {
  ORRE_EXPECTED_COUNTS,
  allLocationIds,
  artifactFor,
  orreRegionForGame,
  shadowsFor,
  snagSpeciesForRoute,
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

  it('snagSpeciesForRoute returns curated species for a location', () => {
    const sample = shadowsFor('colosseum')[0]
    expect(sample).toBeTruthy()
    expect(snagSpeciesForRoute('colosseum', sample!.locationId)).toContain(sample!.species)
    expect(snagSpeciesForRoute('colosseum', 'orre-does-not-exist')).toEqual([])
  })

  it('orreRegionForGame only includes obtainable locations for that game', () => {
    const colo = orreRegionForGame('colosseum')
    const xd = orreRegionForGame('xd')
    expect(colo.nodes.length).toBe(new Set(shadowsFor('colosseum').map((s) => s.locationId)).size)
    /* XD adds the Rock and Oasis Poké Spots, which host no shadow */
    expect(xd.nodes.length).toBe(new Set(shadowsFor('xd').map((s) => s.locationId)).size + 2)
    expect(colo.nodes.some((n) => n.id.startsWith('orre-citadark'))).toBe(false)
    expect(xd.nodes.some((n) => n.id.startsWith('orre-citadark'))).toBe(true)
  })

  /* useRegionData keys off `region` by reference. A fresh Orre map every
   * render retriggers its effect → setState → Maximum update depth. */
  it('orreRegionForGame returns a stable reference per game', () => {
    expect(orreRegionForGame('xd')).toBe(orreRegionForGame('xd'))
    expect(orreRegionForGame('colosseum')).toBe(orreRegionForGame('colosseum'))
    expect(orreRegionForGame('xd')).not.toBe(orreRegionForGame('colosseum'))
  })
})
