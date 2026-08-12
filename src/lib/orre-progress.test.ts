import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { OrreGame, OrreShadow } from './orre-types'
import {
  __resetOrreProgressCacheForTests,
  counts,
  getStatus,
  loadProgress,
  setStatus,
} from './orre-progress'

const KEY = 'pdx2.orre.progress'

const orreMocks = vi.hoisted(() => ({
  shadowsFor: vi.fn(),
  shadowById: vi.fn(),
  getAuthUser: vi.fn(() => null as { id: string } | null),
  from: vi.fn(),
}))

vi.mock('./orre', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./orre')>()
  orreMocks.shadowsFor.mockImplementation(actual.shadowsFor)
  orreMocks.shadowById.mockImplementation(actual.shadowById)
  return {
    ...actual,
    shadowsFor: orreMocks.shadowsFor,
    shadowById: orreMocks.shadowById,
  }
})

vi.mock('./auth', () => ({
  getAuthUser: () => orreMocks.getAuthUser(),
}))

vi.mock('./supabase', () => ({
  supabase: {
    from: (...args: unknown[]) => orreMocks.from(...args),
  },
}))

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
  __resetOrreProgressCacheForTests()
  orreMocks.getAuthUser.mockReturnValue(null)
  orreMocks.from.mockReset()
  orreMocks.shadowsFor.mockReset()
  orreMocks.shadowById.mockReset()
  orreMocks.shadowsFor.mockImplementation(() => [])
  orreMocks.shadowById.mockImplementation((_g: OrreGame, id: string) => stubShadow(id))
})

afterEach(() => {
  __resetOrreProgressCacheForTests()
  vi.useRealTimers()
})

describe('orre-progress', () => {
  it('defaults to remaining when unset', () => {
    expect(getStatus('colosseum', 'shadow-a')).toBe('remaining')
    expect(loadProgress()).toEqual({ colosseum: {}, xd: {} })
  })

  it('persists snagged and missed status', () => {
    setStatus('colosseum', 'shadow-b', 'snagged')
    setStatus('xd', 'shadow-c', 'missed')
    expect(getStatus('colosseum', 'shadow-b')).toBe('snagged')
    expect(getStatus('xd', 'shadow-c')).toBe('missed')
    expect(localStorage.getItem(KEY)).toContain('shadow-b')
  })

  it('setStatus remaining removes the key (sparse storage)', () => {
    setStatus('colosseum', 'shadow-d', 'snagged')
    setStatus('colosseum', 'shadow-d', 'remaining')
    const raw = localStorage.getItem(KEY)
    expect(raw).toBeTruthy()
    expect(JSON.parse(raw!)).toEqual({ colosseum: {}, xd: {} })
    expect(getStatus('colosseum', 'shadow-d')).toBe('remaining')
  })

  it('rejects unknown shadow ids', () => {
    orreMocks.shadowById.mockReturnValue(undefined)
    setStatus('colosseum', 'nope', 'snagged')
    expect(getStatus('colosseum', 'nope')).toBe('remaining')
  })

  it('loadProgress returns empty store on corrupt JSON', () => {
    localStorage.setItem(KEY, '{not-json')
    __resetOrreProgressCacheForTests()
    expect(loadProgress()).toEqual({ colosseum: {}, xd: {} })
    expect(getStatus('colosseum', 'shadow-x')).toBe('remaining')
  })

  describe('counts', () => {
    it('returns full remaining when no progress and real artifact data', () => {
      orreMocks.shadowsFor.mockImplementation((game: OrreGame) =>
        game === 'colosseum' ? Array.from({ length: 48 }, (_, i) => stubShadow(`c${i}`)) : Array.from({ length: 83 }, (_, i) => stubShadow(`x${i}`)),
      )
      expect(counts('colosseum')).toEqual({ snagged: 0, missed: 0, remaining: 48 })
      expect(counts('xd')).toEqual({ snagged: 0, missed: 0, remaining: 83 })
    })

    it('derives remaining from shadowsFor total minus tracked statuses', () => {
      orreMocks.shadowsFor.mockReturnValue([stubShadow('s1'), stubShadow('s2'), stubShadow('s3')])
      setStatus('colosseum', 's1', 'snagged')
      setStatus('colosseum', 's2', 'missed')
      expect(counts('colosseum')).toEqual({ snagged: 1, missed: 1, remaining: 1 })
    })
  })

  it('does not call supabase when logged out', () => {
    setStatus('colosseum', 'shadow-guest', 'snagged')
    expect(orreMocks.from).not.toHaveBeenCalled()
  })

  it('schedules upsert when a real account is logged in', async () => {
    vi.useFakeTimers()
    orreMocks.getAuthUser.mockReturnValue({ id: 'user-1' })
    const upsert = vi.fn(async () => ({ error: null }))
    orreMocks.from.mockImplementation(() => ({ upsert }))

    setStatus('colosseum', 'shadow-cloud', 'snagged')
    expect(upsert).not.toHaveBeenCalled()
    await vi.advanceTimersByTimeAsync(500)
    expect(upsert).toHaveBeenCalled()
  })

  it('hydrateOrreProgress replaces cache with DB rows then adopts local-only', async () => {
    const { hydrateOrreProgress } = await import('./orre-progress')
    localStorage.setItem(
      KEY,
      JSON.stringify({
        colosseum: { 'local-only': 'snagged', 'both': 'missed' },
        xd: {},
      }),
    )
    __resetOrreProgressCacheForTests()

    const upserted: unknown[] = []
    orreMocks.from.mockImplementation(() => ({
      select: () => ({
        eq: async () => ({
          data: [
            { game: 'colosseum', shadow_id: 'both', status: 'snagged', updated_at: '2026-08-12T00:00:00Z' },
            { game: 'colosseum', shadow_id: 'remote-only', status: 'missed', updated_at: '2026-08-12T00:00:00Z' },
          ],
          error: null,
        }),
      }),
      upsert: async (row: unknown) => {
        upserted.push(row)
        return { error: null }
      },
      delete: () => ({
        eq: () => ({
          eq: () => ({
            eq: async () => ({ error: null }),
          }),
        }),
      }),
    }))

    await hydrateOrreProgress({ id: 'user-1' } as never)

    expect(getStatus('colosseum', 'both')).toBe('snagged') // DB wins over local missed
    expect(getStatus('colosseum', 'remote-only')).toBe('missed')
    expect(getStatus('colosseum', 'local-only')).toBe('snagged') // adopted
    expect(upserted.some((r) => (r as { shadow_id: string }).shadow_id === 'local-only')).toBe(true)
  })
})
