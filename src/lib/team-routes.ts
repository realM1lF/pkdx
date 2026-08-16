/* Team Builder URL contract.
 * /team           → vault hub (never auto-opens a draft)
 * /team/:teamId   → editor for that vault/draft id
 * /team/s/:payload → view-only shared page (payload stays in the URL)
 * Legacy `#team=` hashes redirect onto /team/s/:payload. */
import { isLinkedTeam, TEAM_HASH_PREFIX, type Team } from './teambuilder';
import type { Lang } from './i18n-data';

export { TEAM_HASH_PREFIX };
export const TEAM_SHARE_SEGMENT = 's';

export function teamHubPath(): '/team' {
  return '/team';
}

export function teamEditPath(teamId: string): string {
  return `/team/${teamId}`;
}

export function teamSharePath(payload: string): string {
  return `/team/${TEAM_SHARE_SEGMENT}/${payload}`;
}

export function readLegacyTeamHash(hash: string): string | null {
  if (!hash.startsWith(TEAM_HASH_PREFIX)) return null;
  const payload = hash.slice(TEAM_HASH_PREFIX.length);
  return payload || null;
}

export function legacyShareRedirectPath(hash: string): string | null {
  const payload = readLegacyTeamHash(hash);
  return payload ? teamSharePath(payload) : null;
}

export function teamShareHref(origin: string, lang: Lang, payload: string): string {
  const base = origin.replace(/\/$/, '');
  return `${base}/${lang}${teamSharePath(payload)}/`;
}

/** Vault rows a Pokédex add can target. Linked Nuzlocke teams are party projections. */
export function addableTeams(teams: Team[]): Team[] {
  return teams.filter((t) => !isLinkedTeam(t));
}

/** Prefer an unsaved draft of this id when it is newer than the vault row. */
export function teamForEditPath(teamId: string, vault: Team[], draft: Team | null): Team | null {
  const fromVault = vault.find((t) => t.id === teamId) ?? null;
  if (draft?.id === teamId && (!fromVault || draft.updatedAt >= fromVault.updatedAt)) return draft;
  return fromVault;
}
