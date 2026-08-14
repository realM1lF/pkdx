import { describe, expect, it } from 'vitest'
import { anyRegionById } from './regions-freeform'
import {
  encounterOptionsForRoute,
  orreRegionForGame,
  pokeSpotById,
  pokeSpots,
  shadowsFor,
  snagSpeciesForRoute,
  wildSpeciesForRoute,
} from './orre'

describe('xd poke spots', () => {
  it('has exactly three spots with three encounters summing to 100%', () => {
    const spots = pokeSpots()
    expect(spots).toHaveLength(3)
    for (const spot of spots) {
      expect(spot.encounters).toHaveLength(3)
      expect(spot.encounters.reduce((sum, e) => sum + e.rate, 0)).toBe(100)
    }
  })

  it('has unique species per spot and nine distinct species overall', () => {
    const spots = pokeSpots()
    for (const spot of spots) {
      expect(new Set(spot.encounters.map((e) => e.species)).size).toBe(spot.encounters.length)
    }
    const all = spots.flatMap((s) => s.encounters.map((e) => e.species))
    expect(all).toHaveLength(9)
    expect(new Set(all).size).toBe(9)
  })

  it('keeps levels sane and the rarest species matching the 15% slot', () => {
    for (const spot of pokeSpots()) {
      for (const e of spot.encounters) {
        expect(e.minLevel).toBeGreaterThan(0)
        expect(e.maxLevel).toBeGreaterThanOrEqual(e.minLevel)
      }
      const rarest = spot.encounters.find((e) => e.species === spot.rarest)
      expect(rarest?.rate).toBe(15)
      expect(spot.trade.give).toBe(spot.rarest)
    }
  })

  it('is ordered rock → oasis → cave', () => {
    expect(pokeSpots().map((s) => s.terrain)).toEqual(['rock', 'oasis', 'cave'])
    expect(pokeSpots().map((s) => s.order)).toEqual([1, 2, 3])
  })

  it('exposes spots by id', () => {
    expect(pokeSpotById('orre-oasis-poke-spot')?.terrain).toBe('oasis')
    expect(pokeSpotById('orre-does-not-exist')).toBeUndefined()
  })

  it('uses the official German Poké Spot names', () => {
    const byId = new Map(pokeSpots().map((s) => [s.id, s.nameDe]))
    expect(byId.get('orre-rock-poke-spot')).toBe('Wüsten-Platz')
    expect(byId.get('orre-oasis-poke-spot')).toBe('Oasen-Platz')
    expect(byId.get('orre-cave-poke-spot')).toBe('Höhlen-Platz')
    for (const nameDe of byId.values()) {
      expect(nameDe).not.toMatch(/Fels/)
      expect(nameDe).not.toMatch(/Poké-?Spot/)
    }
  })

  it('lists Munchlax and Bonsly as uncatchable visitors, not as encounters', () => {
    const species = new Set(pokeSpots().flatMap((s) => s.encounters.map((e) => e.species)))
    expect(species.has('munchlax')).toBe(false)
    expect(species.has('bonsly')).toBe(false)
  })

  it('spot ids exist as nodes on region orre', () => {
    const region = anyRegionById('orre')
    expect(region).toBeTruthy()
    const nodeIds = new Set(region!.nodes.map((n) => n.id))
    for (const spot of pokeSpots()) {
      expect(nodeIds.has(spot.id), spot.id).toBe(true)
    }
    expect(nodeIds.has('orre-rock-poke-spot')).toBe(true)
    expect(nodeIds.has('orre-oasis-poke-spot')).toBe(true)
  })

  it('gives the Poké Spot nodes route kind and German names', () => {
    const region = anyRegionById('orre')!
    for (const spot of pokeSpots()) {
      const node = region.nodes.find((n) => n.id === spot.id)!
      expect(node.kind).toBe('route')
      expect(node.nameDe).toBe(spot.nameDe)
      expect(node.label).toBe(spot.label)
    }
  })
})

describe('wild species lookup', () => {
  it('returns nothing for Colosseum', () => {
    expect(wildSpeciesForRoute('colosseum', 'orre-cave-poke-spot')).toEqual([])
    expect(wildSpeciesForRoute('colosseum', 'orre-rock-poke-spot')).toEqual([])
  })

  it('returns the curated table for XD spots', () => {
    expect(wildSpeciesForRoute('xd', 'orre-rock-poke-spot')).toEqual(['sandshrew', 'gligar', 'trapinch'])
    expect(wildSpeciesForRoute('xd', 'orre-onbs-1')).toEqual([])
  })

  it('keeps snagSpeciesForRoute shadow-only', () => {
    expect(snagSpeciesForRoute('xd', 'orre-cave-poke-spot')).toEqual(['voltorb'])
    expect(snagSpeciesForRoute('xd', 'orre-rock-poke-spot')).toEqual([])
  })

  it('unions shadow and wild species for the Cave Poké Spot', () => {
    const options = encounterOptionsForRoute('xd', 'orre-cave-poke-spot')
    expect(options.map((o) => o.species)).toEqual(['voltorb', 'zubat', 'aron', 'wooper'])
    expect(options.find((o) => o.species === 'voltorb')).toMatchObject({
      kind: 'shadow',
      rate: 100,
      shadowId: 'xd-shadow-voltorb',
    })
    expect(options.find((o) => o.species === 'wooper')).toMatchObject({ kind: 'wild', rate: 15, minLevel: 10, maxLevel: 21 })
  })

  it('dedupes by species and falls back to shadows elsewhere', () => {
    const options = encounterOptionsForRoute('xd', 'orre-rock-poke-spot')
    expect(options).toHaveLength(3)
    expect(new Set(options.map((o) => o.species)).size).toBe(3)
    expect(encounterOptionsForRoute('colosseum', 'orre-cave-poke-spot')).toEqual([])
    expect(encounterOptionsForRoute('xd', 'orre-does-not-exist')).toEqual([])
  })
})

describe('orre region with poke spots', () => {
  it('adds the two shadow-less spots to the XD region only', () => {
    const xd = orreRegionForGame('xd')
    const colo = orreRegionForGame('colosseum')
    const xdShadowLocs = new Set(shadowsFor('xd').map((s) => s.locationId))
    expect(xd.nodes.length).toBe(xdShadowLocs.size + 2)
    expect(xd.nodes.length).toBe(85)
    expect(colo.nodes.length).toBe(new Set(shadowsFor('colosseum').map((s) => s.locationId)).size)
    expect(colo.nodes.some((n) => n.id.endsWith('-poke-spot'))).toBe(false)
  })

  it('orders Cipher Lab → Rock → Oasis → Cave → ONBS', () => {
    const ids = orreRegionForGame('xd').nodes.map((n) => n.id)
    const at = (id: string) => ids.indexOf(id)
    expect(at('orre-cipher-lab-11')).toBeLessThan(at('orre-rock-poke-spot'))
    expect(at('orre-rock-poke-spot')).toBeLessThan(at('orre-oasis-poke-spot'))
    expect(at('orre-oasis-poke-spot')).toBeLessThan(at('orre-cave-poke-spot'))
    expect(at('orre-cave-poke-spot')).toBeLessThan(at('orre-onbs-1'))
  })

  it('keeps node order contiguous from 1', () => {
    const orders = orreRegionForGame('xd').nodes.map((n) => n.order)
    expect(orders).toEqual(orders.map((_, i) => i + 1))
  })
})
