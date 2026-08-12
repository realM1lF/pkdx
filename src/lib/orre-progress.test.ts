import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { OrreGame, OrreShadow } from './orre-types'
import { counts, getStatus, loadProgress, setStatus } from './orre-progress'

const KEY = 'pdx2.orre.progress'

const orreMocks = vi.hoisted(() => ({
  shadowsFor: vi.fn(),
  actualShadowsFor: null as ((game: OrreGame) => OrreShadow[]) | null,
}))

vi.mock('./orre', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./orre')>()
  orreMocks.actualShadowsFor = actual.shadowsFor
  orreMocks.shadowsFor.mockImplementation(actual.shadowsFor)
  return {
    ...actual,
    shadowsFor: orreMocks.shadowsFor,
  }
})

function installMemoryLocalStorage(): void {
  const map = new Map<string, string>()
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      get length() {
        return map.size
      },
      clear: () => map.clear(),
      getItem: (k: string) => (map.has(k) ? map.get(k)! : null),
      setItem: (k: string, v: string) => {
        map.set(String(k), String(v))
      },
      removeItem: (k: string) => {
        map.delete(k)
      },
      key: (i: number) => [...map.keys()][i] ?? null,
    },
  })
}

function stubShadow(id: string): OrreShadow {
  return {
    id,
    species: 'eevee',
    level: 10,
    trainer: 'test',
    locationId: 'orre-outskirt-stand',
    order: 1,
    required: true,
  }
}

beforeEach(() => {
  installMemoryLocalStorage()
  orreMocks.shadowsFor.mockImplementation(orreMocks.actualShadowsFor!)
})

describe('orre-progress', () => {
  it('defaults to remaining when unset', () => {
    expect(getStatus('colosseum', 'shadow-makuhita')).toBe('remaining')
  })

  it('persists snagged and missed status', () => {
    setStatus('colosseum', 'shadow-a', 'snagged')
    setStatus('colosseum', 'shadow-b', 'missed')
    setStatus('xd', 'shadow-c', 'snagged')

    expect(getStatus('colosseum', 'shadow-a')).toBe('snagged')
    expect(getStatus('colosseum', 'shadow-b')).toBe('missed')
    expect(getStatus('xd', 'shadow-c')).toBe('snagged')

    const stored = loadProgress()
    expect(stored.colosseum).toEqual({ 'shadow-a': 'snagged', 'shadow-b': 'missed' })
    expect(stored.xd).toEqual({ 'shadow-c': 'snagged' })
  })

  it('setStatus remaining removes the key (sparse storage)', () => {
    setStatus('xd', 'shadow-d', 'snagged')
    expect(localStorage.getItem(KEY)).toContain('shadow-d')

    setStatus('xd', 'shadow-d', 'remaining')
    expect(getStatus('xd', 'shadow-d')).toBe('remaining')

    const raw = localStorage.getItem(KEY)
    expect(raw).toBeTruthy()
    expect(JSON.parse(raw!)).toEqual({ colosseum: {}, xd: {} })
  })

  it('loadProgress returns empty store on corrupt JSON', () => {
    localStorage.setItem(KEY, '{not-json')
    expect(loadProgress()).toEqual({ colosseum: {}, xd: {} })
    expect(getStatus('colosseum', 'shadow-x')).toBe('remaining')
  })

  describe('counts', () => {
    it('returns full remaining when no progress and real artifact data', () => {
      expect(counts('colosseum')).toEqual({ snagged: 0, missed: 0, remaining: 48 })
      expect(counts('xd')).toEqual({ snagged: 0, missed: 0, remaining: 83 })
    })

    it('derives remaining from shadowsFor total minus tracked statuses', () => {
      orreMocks.shadowsFor.mockReturnValue([
        stubShadow('s1'),
        stubShadow('s2'),
        stubShadow('s3'),
      ])

      setStatus('colosseum', 's1', 'snagged')
      setStatus('colosseum', 's2', 'missed')

      expect(counts('colosseum')).toEqual({ snagged: 1, missed: 1, remaining: 1 })
    })
  })
})
