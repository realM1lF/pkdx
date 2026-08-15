/* Orre Shadow Tracker progress — DB is truth for real accounts.
 * Guest / logged-out: localStorage cache only (`pdx2.orre.progress`).
 * Logged-in (isRealUser): hydrate from Supabase; writes upsert/delete rows;
 * localStorage is a fast mirror, never the authority while authed. */
import type { User } from '@supabase/supabase-js'
import { getAuthUser } from './auth'
import { shadowsFor, shadowById } from './orre'
import type { OrreGame, ShadowStatus } from './orre-types'
import { readLocalJson, removeLocalKey, writeLocalJson } from './storage'
import { supabase } from './supabase'

const KEY = 'pdx2.orre.progress'
const OWNER_KEY = 'pdx2.orre.owner'
const DEBOUNCE_MS = 400

type ProgressStore = Record<OrreGame, Partial<Record<string, ShadowStatus>>>

interface ProgressRow {
  game: OrreGame
  shadow_id: string
  status: 'snagged' | 'missed'
  updated_at: string
}

function emptyProgress(): ProgressStore {
  return { colosseum: {}, xd: {} }
}

function normalizeStore(raw: ProgressStore | null | undefined): ProgressStore {
  const base = emptyProgress()
  if (!raw || typeof raw !== 'object') return base
  for (const game of ['colosseum', 'xd'] as OrreGame[]) {
    const bag = raw[game]
    if (!bag || typeof bag !== 'object') continue
    for (const [id, status] of Object.entries(bag)) {
      if (status === 'snagged' || status === 'missed') base[game][id] = status
    }
  }
  return base
}

let cache: ProgressStore | null = null
const listeners = new Set<() => void>()
const pushTimers = new Map<string, ReturnType<typeof setTimeout>>()

function emit(): void {
  for (const fn of listeners) fn()
}

export function subscribeOrreProgress(cb: () => void): () => void {
  listeners.add(cb)
  return () => {
    listeners.delete(cb)
  }
}

function readCache(): ProgressStore {
  if (!cache) cache = normalizeStore(readLocalJson<ProgressStore>(KEY, emptyProgress()))
  return cache
}

function writeCache(next: ProgressStore): void {
  cache = next
  writeLocalJson(KEY, next)
  emit()
}

export function loadProgress(): Record<string, Partial<Record<string, ShadowStatus>>> {
  return readCache()
}

export function getStatus(game: OrreGame, id: string): ShadowStatus {
  return readCache()[game]?.[id] ?? 'remaining'
}

function rowKey(game: OrreGame, id: string): string {
  return `${game}:${id}`
}

function scheduleCloudWrite(game: OrreGame, id: string, status: ShadowStatus): void {
  const user = getAuthUser()
  if (!user) return

  const key = rowKey(game, id)
  const prev = pushTimers.get(key)
  if (prev) clearTimeout(prev)

  pushTimers.set(
    key,
    setTimeout(() => {
      pushTimers.delete(key)
      void flushCloudWrite(user.id, game, id, status)
    }, DEBOUNCE_MS),
  )
}

async function flushCloudWrite(
  userId: string,
  game: OrreGame,
  id: string,
  status: ShadowStatus,
): Promise<void> {
  if (status === 'remaining') {
    const { error } = await supabase
      .from('orre_shadow_progress')
      .delete()
      .eq('user_id', userId)
      .eq('game', game)
      .eq('shadow_id', id)
    if (error) console.warn('[orre-progress] delete failed', error.message)
    return
  }

  const { error } = await supabase.from('orre_shadow_progress').upsert(
    {
      user_id: userId,
      game,
      shadow_id: id,
      status,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,game,shadow_id' },
  )
  if (error) console.warn('[orre-progress] upsert failed', error.message)
}

export function setStatus(game: OrreGame, id: string, status: ShadowStatus): void {
  if (!shadowById(game, id)) {
    console.warn('[orre-progress] unknown shadow id', game, id)
    return
  }

  const progress = { ...readCache(), [game]: { ...(readCache()[game] ?? {}) } }
  const gameProgress = { ...progress[game] }

  if (status === 'remaining') delete gameProgress[id]
  else gameProgress[id] = status

  writeCache({ ...progress, [game]: gameProgress })
  scheduleCloudWrite(game, id, status)
}

export function counts(game: OrreGame): { snagged: number; missed: number; remaining: number } {
  const gameProgress = readCache()[game] ?? {}
  let snagged = 0
  let missed = 0

  for (const status of Object.values(gameProgress)) {
    if (status === 'snagged') snagged++
    else if (status === 'missed') missed++
  }

  const total = shadowsFor(game).length
  return { snagged, missed, remaining: total - snagged - missed }
}

/** Replace local cache from DB rows (DB = truth). */
function storeFromRows(rows: ProgressRow[]): ProgressStore {
  const next = emptyProgress()
  for (const row of rows) {
    if (row.game !== 'colosseum' && row.game !== 'xd') continue
    if (row.status !== 'snagged' && row.status !== 'missed') continue
    if (!shadowById(row.game, row.shadow_id)) continue
    next[row.game][row.shadow_id] = row.status
  }
  return next
}

/**
 * On login: pull remote progress (authority), then push any local-only
 * statuses that the server does not have yet (silent adopt).
 */
export function clearOrreLocalProgress(): void {
  cache = null
  removeLocalKey(KEY)
  removeLocalKey(OWNER_KEY)
  emit()
}

function readOrreOwner(): string | null {
  const v = readLocalJson<string | null>(OWNER_KEY, null)
  return typeof v === 'string' && v ? v : null
}

export async function hydrateOrreProgress(user: User): Promise<void> {
  const prevOwner = readOrreOwner()
  const switching = Boolean(prevOwner && prevOwner !== user.id)
  const localBefore = switching ? emptyProgress() : readCache()
  let data: ProgressRow[] | null = null
  try {
    const res = await supabase
      .from('orre_shadow_progress')
      .select('game, shadow_id, status, updated_at')
      .eq('user_id', user.id)
    if (res.error) {
      console.warn('[orre-progress] hydrate failed', res.error.message)
      return
    }
    data = (res.data as ProgressRow[] | null) ?? []
  } catch (err) {
    console.warn('[orre-progress] hydrate failed', err)
    return
  }

  const remote = storeFromRows(data ?? [])
  writeCache(remote)
  writeLocalJson(OWNER_KEY, user.id)
  if (switching) return

  /* adopt local-only keys missing remotely */
  for (const game of ['colosseum', 'xd'] as OrreGame[]) {
    for (const [id, status] of Object.entries(localBefore[game] ?? {})) {
      if (status !== 'snagged' && status !== 'missed') continue
      if (remote[game][id]) continue
      if (!shadowById(game, id)) continue
      /* keep adopted value in cache and push */
      const merged = readCache()
      writeCache({
        ...merged,
        [game]: { ...merged[game], [id]: status },
      })
      await flushCloudWrite(user.id, game, id, status)
    }
  }
}

/** Test helper — clear in-memory cache between cases. */
export function __resetOrreProgressCacheForTests(): void {
  cache = null
  for (const t of pushTimers.values()) clearTimeout(t)
  pushTimers.clear()
}
