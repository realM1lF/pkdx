/* Bridge: Nuzlocke party ↔ per-player linked Team Builder teams.
 * Dynamic-imported from nuzlocke-store to keep the module graph acyclic.
 *
 * Ownership: only `myPlayerId` gets a persisted linked team in the local vault.
 * Other players are viewed via ephemeral view-teams (party snapshot) or a
 * share hash — never auto-created in someone else's tresor. */
import { getPokemon } from './pokeapi';
import {
  isRunArchived,
  loadLocalRun,
  myPlayerId,
  partyOf,
  readRunIndex,
  type RunState,
} from './nuzlocke-store';
import {
  TEAM_SIZE,
  deleteTeam,
  emptySlot,
  emptyTeam,
  extractLinkedSet,
  isLinkedTeam,
  loadDraft,
  loadTeams,
  saveDraft,
  saveTeam,
  type LinkedSetBagEntry,
  type Team,
  type TeamSlot,
} from './teambuilder';
import { versionGroupForGame } from './version-groups';

const slugCache = new Map<number, string>();

async function slugFor(pokemonId: number): Promise<string> {
  const hit = slugCache.get(pokemonId);
  if (hit) return hit;
  try {
    const p = await getPokemon(pokemonId);
    slugCache.set(pokemonId, p.name);
    return p.name;
  } catch {
    const fallback = String(pokemonId);
    slugCache.set(pokemonId, fallback);
    return fallback;
  }
}

export function linkedTeamName(runName: string, playerName: string): string {
  return `${runName.trim() || 'Nuzlocke'} — ${playerName.trim() || 'Player'}`;
}

/**
 * The player slot this browser owns for the run.
 * Membership is set on create/join (works for guests + accounts).
 * Solo fallback: first player if membership was wiped — still one owner.
 */
export function ownedPlayerId(state: RunState): string | null {
  const mine = myPlayerId(state.run.id);
  if (mine && state.players.some((p) => p.id === mine)) return mine;
  if (state.mode === 'solo' && state.players[0]) return state.players[0].id;
  return null;
}

export function findLinkedTeam(runId: string, playerId: string): Team | null {
  return loadTeams().find((t) => t.linkedRunId === runId && t.linkedPlayerId === playerId) ?? null;
}

/** Only the owned player may edit their linked team (solo + multi). */
export function canEditLinkedTeam(state: RunState, playerId: string): boolean {
  return ownedPlayerId(state) === playerId;
}

/** Drop linked teams for this run that belong to other players (vault cleanup). */
export function purgeForeignLinkedTeams(runId: string, keepPlayerId: string | null): number {
  let removed = 0;
  for (const t of loadTeams()) {
    if (t.linkedRunId !== runId) continue;
    if (keepPlayerId && t.linkedPlayerId === keepPlayerId) continue;
    deleteTeam(t.id);
    removed++;
  }
  const draft = loadDraft();
  if (draft?.linkedRunId === runId && draft.linkedPlayerId !== keepPlayerId) {
    saveDraft(null);
  }
  return removed;
}

function upsertOwnedTeam(state: RunState, playerId: string): Team {
  const player = state.players.find((p) => p.id === playerId);
  const vg = versionGroupForGame(state.run.game) ?? 'scarlet-violet';
  let team = findLinkedTeam(state.run.id, playerId);
  if (!team) {
    team = emptyTeam(linkedTeamName(state.run.name, player?.name ?? 'Player'));
    team.linkedRunId = state.run.id;
    team.linkedPlayerId = playerId;
    team.versionGroup = vg;
    team.linkedSetBag = {};
    saveTeam(team);
    return team;
  }
  const nextName = linkedTeamName(state.run.name, player?.name ?? 'Player');
  let dirty = false;
  if (team.name !== nextName) {
    team = { ...team, name: nextName };
    dirty = true;
  }
  if (team.versionGroup !== vg) {
    team = { ...team, versionGroup: vg };
    dirty = true;
  }
  if (!team.linkedSetBag) {
    team = { ...team, linkedSetBag: {} };
    dirty = true;
  }
  if (dirty) saveTeam(team);
  return team;
}

/** Ensure exactly one linked team — for this browser's owned player. */
export function ensureLinkedTeams(state: RunState): Team[] {
  const mine = ownedPlayerId(state);
  purgeForeignLinkedTeams(state.run.id, mine);
  if (!mine) return [];
  return [upsertOwnedTeam(state, mine)];
}

function stashLeavingParty(team: Team, partyIds: Set<string>): Record<string, LinkedSetBagEntry> {
  const bag = { ...(team.linkedSetBag ?? {}) };
  for (const slot of team.slots) {
    const encId = slot.encounterId;
    if (!encId || !slot.pokemonId) continue;
    if (partyIds.has(encId)) continue;
    bag[encId] = extractLinkedSet(slot);
  }
  return bag;
}

function applyBagOrPrior(
  bag: Record<string, LinkedSetBagEntry>,
  priorByEnc: Map<string, TeamSlot>,
  encId: string,
): LinkedSetBagEntry | null {
  if (bag[encId]) return bag[encId];
  const prior = priorByEnc.get(encId);
  return prior ? extractLinkedSet(prior) : null;
}

async function projectPartySlots(
  state: RunState,
  playerId: string,
  prior: Team | null,
): Promise<{ slots: TeamSlot[]; bag: Record<string, LinkedSetBagEntry> }> {
  const party = partyOf(state, playerId).slice(0, TEAM_SIZE);
  const partyIds = new Set(party.map((e) => e.id));
  const priorByEnc = new Map(
    (prior?.slots ?? []).filter((s) => s.encounterId).map((s) => [s.encounterId!, s] as const),
  );
  let bag = prior ? stashLeavingParty(prior, partyIds) : {};
  const livingIds = new Set(state.encounters.map((e) => e.id));
  bag = Object.fromEntries(Object.entries(bag).filter(([id]) => livingIds.has(id)));

  const slots: TeamSlot[] = Array.from({ length: TEAM_SIZE }, emptySlot);
  for (let i = 0; i < party.length; i++) {
    const enc = party[i];
    const slug = await slugFor(enc.pokemon_id);
    const saved = applyBagOrPrior(bag, priorByEnc, enc.id);
    delete bag[enc.id];
    const base = emptySlot();
    slots[i] = {
      ...base,
      id: priorByEnc.get(enc.id)?.id ?? base.id,
      pokemon: slug,
      pokemonId: enc.pokemon_id,
      nickname: enc.nickname,
      level: Math.min(100, Math.max(1, enc.level || 1)),
      shiny: !!enc.is_shiny || !!saved?.shiny,
      encounterId: enc.id,
      moves: saved?.moves ?? base.moves,
      item: saved?.item ?? null,
      ability: saved?.ability ?? null,
      nature: saved?.nature ?? null,
      evs: saved?.evs ?? base.evs,
    };
  }
  return { slots, bag };
}

/** Project owned party into the linked team. No-op for other players / archived. */
export async function syncLinkedTeamRoster(state: RunState, playerId: string): Promise<Team | null> {
  const mine = ownedPlayerId(state);
  if (!mine || playerId !== mine) return null;
  if (isRunArchived(state.run.id)) return findLinkedTeam(state.run.id, playerId);

  ensureLinkedTeams(state);
  const team = findLinkedTeam(state.run.id, playerId);
  if (!team) return null;

  const { slots, bag } = await projectPartySlots(state, playerId, team);
  const next: Team = {
    ...team,
    slots,
    linkedSetBag: bag,
    versionGroup: versionGroupForGame(state.run.game) ?? team.versionGroup,
    name: linkedTeamName(
      state.run.name,
      state.players.find((p) => p.id === playerId)?.name ?? 'Player',
    ),
  };
  saveTeam(next);

  const draft = loadDraft();
  if (draft?.id === next.id) saveDraft(next);
  return next;
}

export async function syncLinkedTeamsForRun(state: RunState, playerId?: string): Promise<void> {
  const mine = ownedPlayerId(state);
  if (!mine) {
    purgeForeignLinkedTeams(state.run.id, null);
    return;
  }
  if (playerId && playerId !== mine) return;
  ensureLinkedTeams(state);
  await syncLinkedTeamRoster(state, mine);
}

/**
 * Ephemeral read-only team from a player's current party (not persisted).
 * Used to inspect crew mates without putting their team in your vault.
 * Sets (moves/ability/…) are empty unless this browser somehow has a bag —
 * full sets travel via share links from the owner.
 */
export async function buildViewTeamFromParty(state: RunState, playerId: string): Promise<Team | null> {
  if (!state.players.some((p) => p.id === playerId)) return null;
  const player = state.players.find((p) => p.id === playerId)!;
  const { slots } = await projectPartySlots(state, playerId, null);
  const team = emptyTeam(linkedTeamName(state.run.name, player.name));
  team.versionGroup = versionGroupForGame(state.run.game) ?? team.versionGroup;
  team.slots = slots;
  /* mark provenance without claiming vault ownership */
  team.linkedRunId = state.run.id;
  team.linkedPlayerId = playerId;
  return team;
}

export function deleteLinkedTeamsForRun(runId: string): void {
  for (const t of loadTeams()) {
    if (t.linkedRunId === runId) deleteTeam(t.id);
  }
  const draft = loadDraft();
  if (draft?.linkedRunId === runId) saveDraft(null);
}

/** After duplicateAsSolo: clone only the owned player's linked team. */
export function cloneLinkedTeamsForDuplicate(
  srcRunId: string,
  dst: RunState,
  playerMap: Map<string, string>,
  encounterMap: Map<string, string>,
): void {
  const srcMine = myPlayerId(srcRunId);
  const srcTeams = loadTeams().filter(
    (t) => t.linkedRunId === srcRunId && (!srcMine || t.linkedPlayerId === srcMine),
  );
  for (const src of srcTeams) {
    if (!src.linkedPlayerId) continue;
    const newPlayerId = playerMap.get(src.linkedPlayerId);
    if (!newPlayerId) continue;
    const team = emptyTeam(
      linkedTeamName(dst.run.name, dst.players.find((p) => p.id === newPlayerId)?.name ?? 'Player'),
    );
    team.linkedRunId = dst.run.id;
    team.linkedPlayerId = newPlayerId;
    team.versionGroup = versionGroupForGame(dst.run.game) ?? src.versionGroup;
    const bag: Record<string, LinkedSetBagEntry> = {};
    for (const [oldEnc, set] of Object.entries(src.linkedSetBag ?? {})) {
      const nid = encounterMap.get(oldEnc);
      if (nid) bag[nid] = set;
    }
    team.linkedSetBag = bag;
    team.slots = src.slots.map((s) => {
      const encId = s.encounterId ? (encounterMap.get(s.encounterId) ?? null) : null;
      return { ...s, id: emptySlot().id, encounterId: encId };
    });
    saveTeam(team);
  }
  /* dst membership is players[0]; ensure + sync that one */
  void syncLinkedTeamsForRun(dst);
}

/** Repair after cloud hydrate / login mid-run — own team only, purge foreign. */
export function repairAllLinkedTeams(): void {
  for (const id of readRunIndex()) {
    const s = loadLocalRun(id);
    if (!s) continue;
    ensureLinkedTeams(s);
    void syncLinkedTeamsForRun(s);
  }
}

/** Detach linked metadata so a view/share can be saved as a personal copy. */
export function detachAsCopy(team: Team, name?: string): Team {
  const copy = emptyTeam(name ?? `${team.name}`);
  copy.versionGroup = team.versionGroup;
  copy.slots = team.slots.map((s) => ({
    ...s,
    id: emptySlot().id,
    encounterId: null,
  }));
  delete copy.linkedRunId;
  delete copy.linkedPlayerId;
  delete copy.linkedSetBag;
  return copy;
}

export { isLinkedTeam };
