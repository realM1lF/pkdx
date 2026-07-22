/* tcg — EP4.3: pokemontcg.io card gallery data (free API, no key needed at
 * our volume; 24h localStorage cache; SILENT failure — any error yields []
 * and the gallery simply does not render). */

export interface TcgCard {
  id: string;
  name: string;
  setName: string;
  imageSmall: string;
  imageLarge: string;
}

const API = 'https://api.pokemontcg.io/v2/cards';
const CACHE_PREFIX = 'pdx2.tcg.';
const CACHE_TTL = 24 * 60 * 60 * 1000;
const TIMEOUT_MS = 8000;

interface CacheEntry {
  at: number;
  cards: TcgCard[];
}

function readCache(key: string): TcgCard[] | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;
    const entry = JSON.parse(raw) as CacheEntry;
    if (Date.now() - entry.at > CACHE_TTL) return null;
    return entry.cards;
  } catch {
    return null;
  }
}

function writeCache(key: string, cards: TcgCard[]): void {
  try {
    const entry: CacheEntry = { at: Date.now(), cards };
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
  } catch {
    /* storage full/blocked — gallery still works uncached */
  }
}

/** Latest cards for a Pokémon (EN card pool — pokemontcg.io has no reliable
 * DE filter). `enName` is the species/pokedex name slug in title case. */
export async function fetchTcgCards(enName: string, pageSize = 12): Promise<TcgCard[]> {
  const key = enName.toLowerCase();
  const cached = readCache(key);
  if (cached) return cached;
  try {
    const q = encodeURIComponent(`name:"${enName}"`);
    const url = `${API}?q=${q}&select=id,name,images,set&pageSize=${pageSize}&orderBy=-set.releaseDate`;
    const ctrl = new AbortController();
    const timer = window.setTimeout(() => ctrl.abort(), TIMEOUT_MS);
    const res = await fetch(url, { signal: ctrl.signal });
    window.clearTimeout(timer);
    if (!res.ok) return [];
    const json = (await res.json()) as {
      data?: Array<{ id: string; name: string; set?: { name?: string }; images?: { small?: string; large?: string } }>;
    };
    const cards = (json.data ?? [])
      .filter((c) => c.images?.small)
      .map((c) => ({
        id: c.id,
        name: c.name,
        setName: c.set?.name ?? '',
        imageSmall: c.images!.small!,
        imageLarge: c.images?.large ?? c.images!.small!,
      }));
    writeCache(key, cards);
    return cards;
  } catch {
    return []; /* silent fallback — offline, rate-limited, or service down */
  }
}
