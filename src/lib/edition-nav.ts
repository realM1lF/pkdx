/* Edition URL contract — ?game= is always a game slug (firered, colosseum, …).
 * Lightweight: version-groups table only, no @pkmn. */
import { VERSION_GROUPS, versionGroupById, versionGroupForGame } from './version-groups';

const VG_IDS = new Set(VERSION_GROUPS.map((v) => v.id));

/** First main-series game slug per generation (Pokédex gen-filter clicks). */
export const FIRST_GAME_BY_GEN: Record<number, string> = {
  1: 'red',
  2: 'gold',
  3: 'ruby',
  4: 'diamond',
  5: 'black',
  6: 'x',
  7: 'sun',
  8: 'sword',
  9: 'scarlet',
};

/** Game slug or version-group id → version-group id. */
export function resolveVersionGroup(gameOrVg: string | null | undefined): string | null {
  if (!gameOrVg) return null;
  if (VG_IDS.has(gameOrVg)) return gameOrVg;
  return versionGroupForGame(gameOrVg);
}

/** Game slug or version-group id → first game slug of that group. */
export function gameSlugOf(gameOrVg: string | null | undefined): string | null {
  if (!gameOrVg) return null;
  if (versionGroupForGame(gameOrVg)) return gameOrVg;
  if (VG_IDS.has(gameOrVg)) return versionGroupById(gameOrVg).games[0] ?? null;
  return null;
}

export interface PokemonHrefOpts {
  game?: string | null;
  from?: string;
  v?: string;
}

function appendQuery(path: string, params: Record<string, string | null | undefined>): string {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v) q.set(k, v);
  }
  const s = q.toString();
  return s ? `${path}?${s}` : path;
}

export function pokemonHref(idOrSlug: string | number, opts: PokemonHrefOpts = {}): string {
  const id = String(idOrSlug).replace(/^\/pokemon\//, '');
  return appendQuery(`/pokemon/${id}`, {
    game: gameSlugOf(opts.game ?? null),
    from: opts.from,
    v: opts.v,
  });
}

export function versusHref(opts: {
  you?: number | string;
  vs?: number | string;
  game?: string | null;
}): string {
  return appendQuery('/versus', {
    you: opts.you != null ? String(opts.you) : undefined,
    vs: opts.vs != null ? String(opts.vs) : undefined,
    game: gameSlugOf(opts.game ?? null),
  });
}

/** Keep only ?game= for in-page species hops (evo / forms / prev-next). */
export function keepEditionSearch(search: URLSearchParams): string {
  const game = gameSlugOf(search.get('game'));
  if (!game) return '';
  return new URLSearchParams({ game }).toString();
}
