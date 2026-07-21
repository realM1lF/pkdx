/* Shared localStorage helpers — detect quota failures instead of swallowing them. */

const POKE_CACHE_PREFIX = 'pdx:';

export class StorageWriteError extends Error {
  constructor(message = 'localStorage write failed') {
    super(message);
    this.name = 'StorageWriteError';
  }
}

/** Drop oldest PokéAPI cache entries to make room for user data (runs, teams). */
export function trimPokeApiCache(maxRemove = 48): number {
  const entries: { key: string; t: number }[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key?.startsWith(POKE_CACHE_PREFIX)) continue;
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      try {
        const env = JSON.parse(raw) as { t?: number };
        entries.push({ key, t: env.t ?? 0 });
      } catch {
        entries.push({ key, t: 0 });
      }
    }
  } catch {
    return 0;
  }
  entries.sort((a, b) => a.t - b.t);
  let removed = 0;
  for (const entry of entries.slice(0, maxRemove)) {
    try {
      localStorage.removeItem(entry.key);
      removed++;
    } catch {
      /* ignore */
    }
  }
  return removed;
}

export function readLocalJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

/** Persist JSON; trims PokéAPI cache once on quota error, then retries. */
export function writeLocalJson(key: string, value: unknown): boolean {
  const payload = JSON.stringify(value);
  try {
    localStorage.setItem(key, payload);
    return true;
  } catch {
    trimPokeApiCache();
    try {
      localStorage.setItem(key, payload);
      return true;
    } catch {
      return false;
    }
  }
}

export function removeLocalKey(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}
