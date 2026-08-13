/* MyPokePanion — Nuzlocke unified run store (nuzlocke.md §0)
 * Solo mode  → localStorage mirror (`pdx2.nuz.*`), instant.
 * Multi mode → Supabase Postgres + Realtime (postgres_changes + presence).
 * Identical UI in both modes. All writes optimistic; failed remote writes
 * replay with a gold retry toast — never red. */
import { useEffect, useReducer, useState } from 'react';
import i18n from '@/i18n';
import type { RealtimeChannel } from '@supabase/supabase-js';
import {
  dropChannel,
  isMultiCapable,
  nuzTables,
  runChannel,
  supabase,
} from './supabase';
import type {
  NuzEncounterRow,
  NuzEncounterStatus,
  NuzPlayerRow,
  NuzRules,
  NuzRunRow,
  NuzRunStatus,
} from './supabase';
import { nodeIndex, routeOrder } from './regions';
import { regionForRun } from './orre';
import { padNum } from './pokeapi';
import {
  dupesClaimingStatuses,
  formatRunSummary,
  isSlotConsuming,
  normalizeRules,
  validateLogDraft,
} from './nuzlocke-rules';
import type { LogValidationError } from './nuzlocke-rules';
import {
  cachedEvolutionFamilyIds,
  fetchEvolutionChainIds,
  isValidEvolutionTarget,
  normalizeEncounter,
  normalizeEncounters,
  prefetchEvolutionFamiliesForEncounters,
} from './nuzlocke-evolution';
import { readLocalJson, removeLocalKey, writeLocalJson } from './storage';
import { ensureRunIdentity, getAuthUser, isAuthReady, useAuth } from './auth';
import {
  cascadeRestoreTargets,
  findEvoLineDupeViolations,
  isCurrentOp,
  isStatusDowngrade,
  livingCascadeTargets,
  mergeRemoteWithOutbox,
  nextOpGen,
} from './nuzlocke-concurrency';
import type { Outbox, OutboxOpKind } from './nuzlocke-concurrency';

export type {
  NuzEncounterRow,
  NuzEncounterStatus,
  NuzPlayerRow,
  NuzRules,
  NuzRunRow,
  NuzRunStatus,
};

/* ---------- constants ---------- */

export const PLAYER_COLORS = ['#FFD60A', '#45C8FF', '#FF7A45', '#63D96B'] as const;
export const MAX_PLAYERS = 4;

export const DEFAULT_RULES: NuzRules = {
  dupes: true,
  dupesDead: false,
  dupesEncounter: false,
  shiny: true,
  nicknames: true,
  soulLink: false,
  soulLinkCascade: true,
  releaseOnDeath: true,
  levelCap: null,
  autoLevelCap: false,
  badgesCleared: 0,
  randomizer: false,
};

const LS_INDEX = 'pdx2.nuz.runs';
/** Archived run ids — payload stays under LS_RUN; excluded from the active hub. */
const LS_ARCHIVED = 'pdx2.nuz.archived';
/** Last server-confirmed account membership ids — reconcile must not resurrect these from LS_RUN. */
const LS_ACCOUNT_RUNS = 'pdx2.nuz.accountRuns';
/** Runs purged after lost membership — reconcile skips even if a stale LS_RUN remains. */
const LS_ACCOUNT_PURGED = 'pdx2.nuz.accountPurged';
const LS_RUN = (id: string) => `pdx2.nuz.run.${id}`;
const LS_MEMBERS = 'pdx2.nuz.memberships';
const LS_OWNERS = 'pdx2.nuz.owners';

export type RunMode = 'solo' | 'multi';

export interface RunState {
  run: NuzRunRow;
  mode: RunMode;
  players: NuzPlayerRow[];
  encounters: NuzEncounterRow[];
}

/* Fire-and-forget party → linked TB sync (dynamic import avoids cycles).
 * `syncLinkedTeamsForRun` awaits network (species slug lookups) and does its
 * own read-modify-write of the linked team blob (loadTeams → project →
 * saveTeam). A burst of encounter edits (e.g. a SoulLink cascade touching
 * several rows at once) fires several overlapping calls; without
 * serialization the slower-finishing one can clobber a faster one's newer
 * projection. Chain every call behind the previous one for the same
 * (run, owned player) key — regardless of which `playerId` a caller passes,
 * only this browser's owned player ever actually writes (nuzlocke-linked-
 * teams.ts `ownedPlayerId` no-ops for anyone else), so keying on the owned
 * player collapses every call for this run onto one queue (concurrency
 * plan §2.4). */
const linkedSyncChains = new Map<string, Promise<void>>();

function scheduleLinkedSync(state: RunState, playerId?: string): void {
  const key = `${state.run.id}:${myPlayerId(state.run.id) ?? playerId ?? '*'}`;
  const prev = linkedSyncChains.get(key) ?? Promise.resolve();
  const next = prev.catch(() => undefined).then(() =>
    import('./nuzlocke-linked-teams')
      .then((m) => m.syncLinkedTeamsForRun(state, playerId))
      .catch((err) => console.warn('[nuzlocke] linked team sync failed', err)),
  );
  linkedSyncChains.set(key, next);
}

/* ---------- feed ---------- */

export type FeedKind =
  | 'catch'
  | 'death'
  | 'missed'
  | 'duped'
  | 'lost'
  | 'link'
  | 'join'
  | 'rule'
  | 'milestone'
  | 'presence'
  | 'status';

export interface FeedEvent {
  id: string;
  t: number;
  kind: FeedKind;
  color?: string;
  title: string;
  meta?: string;
}

/* ---------- toasts ---------- */

export interface NuzToast {
  id: number;
  kind: 'sync' | 'link' | 'info' | 'success';
  text: string;
}

type ToastListener = (t: NuzToast) => void;
const toastListeners = new Set<ToastListener>();
let toastSeq = 1;

export function pushToast(kind: NuzToast['kind'], text: string): void {
  const t: NuzToast = { id: toastSeq++, kind, text };
  toastListeners.forEach((fn) => fn(t));
}

export function onToast(fn: ToastListener): () => void {
  toastListeners.add(fn);
  return () => toastListeners.delete(fn);
}

/* ---------- local persistence ---------- */

function uuid(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `nz-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function readJson<T>(key: string, fallback: T): T {
  return readLocalJson(key, fallback);
}

function writeJson(key: string, value: unknown): boolean {
  return writeLocalJson(key, value);
}

function notifyStorageFailure(): void {
  pushToast('sync', i18n.t('nuz.toast.storageFailed'));
}

function notifyHub(): void {
  hubListeners.forEach((fn) => fn());
}

function readPersistedAccountRunIds(): Set<string> {
  return new Set(readJson<string[]>(LS_ACCOUNT_RUNS, []));
}

function writePersistedAccountRunIds(ids: Iterable<string>): void {
  if (!writeJson(LS_ACCOUNT_RUNS, [...ids])) notifyStorageFailure();
}

function readAccountPurgedIds(): Set<string> {
  return new Set(readJson<string[]>(LS_ACCOUNT_PURGED, []));
}

function tombstoneAccountRun(runId: string): void {
  const purged = readAccountPurgedIds();
  if (purged.has(runId)) return;
  purged.add(runId);
  if (!writeJson(LS_ACCOUNT_PURGED, [...purged])) notifyStorageFailure();
}

function clearAccountRunTombstone(runId: string): void {
  const purged = readAccountPurgedIds();
  if (!purged.has(runId)) return;
  purged.delete(runId);
  if (!writeJson(LS_ACCOUNT_PURGED, [...purged])) notifyStorageFailure();
}

/** Recover runs whose payload exists but index entry was lost (quota race, etc.).
 * Archived ids are skipped — they live in LS_ARCHIVED on purpose.
 * Account-discovered runs are owned by `syncAccountRuns` — never resurrect
 * from LS_RUN here (prevents ghost runs after a lost membership). */
function reconcileRunIndex(): void {
  const indexed = new Set(readRunIndex());
  const archived = new Set(readArchivedIndex());
  const accountManaged = readPersistedAccountRunIds();
  const purged = readAccountPurgedIds();
  const recovered: string[] = [];
  const prefix = 'pdx2.nuz.run.';
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key?.startsWith(prefix)) continue;
      const id = key.slice(prefix.length);
      if (
        id &&
        !indexed.has(id) &&
        !archived.has(id) &&
        !accountManaged.has(id) &&
        !purged.has(id) &&
        loadLocalRun(id)
      ) {
        recovered.push(id);
      }
    }
  } catch {
    /* ignore */
  }
  if (recovered.length) writeRunIndex([...recovered, ...readRunIndex()]);
}

export function readRunIndex(): string[] {
  return readJson<string[]>(LS_INDEX, []);
}

export function readArchivedIndex(): string[] {
  return readJson<string[]>(LS_ARCHIVED, []);
}

function writeArchivedIndex(ids: string[]): void {
  if (!writeJson(LS_ARCHIVED, ids)) notifyStorageFailure();
}

export function isRunArchived(runId: string): boolean {
  return readArchivedIndex().includes(runId);
}

/** Most recently touched run id (hub index head). */
export function getLatestRunId(): string | null {
  return readRunIndex()[0] ?? null;
}

function writeRunIndex(ids: string[]): void {
  if (!writeJson(LS_INDEX, ids)) notifyStorageFailure();
}

function addToIndex(id: string): void {
  writeRunIndex([id, ...readRunIndex().filter((x) => x !== id)]);
}

export function loadLocalRun(id: string): RunState | null {
  const s = readJson<RunState | null>(LS_RUN(id), null);
  if (!s || !s.run) return null;
  return {
    ...s,
    run: { ...s.run, rules: normalizeRules(s.run.rules) },
    encounters: normalizeEncounters(s.encounters ?? []),
  };
}

function saveLocalRun(state: RunState): void {
  if (!writeJson(LS_RUN(state.run.id), state)) notifyStorageFailure();
  else if (!isRunArchived(state.run.id)) addToIndex(state.run.id);
  /* guest blob mirror only — cloud-backed solos persist row-by-row */
  if (!isCloudRun(state)) {
    void import('./cloud-sync')
      .then((m) => m.cloudPushSoloRun(state))
      .catch((err) => console.warn('[nuzlocke] cloud push failed', err));
  }
}

/** public persistence entry for cloud hydration (cloud-sync) */
export function saveLocalRunPublic(state: RunState): void {
  saveLocalRun(state);
}

export function getMemberships(): Record<string, string> {
  return readJson<Record<string, string>>(LS_MEMBERS, {});
}

export function myPlayerId(runId: string): string | null {
  return getMemberships()[runId] ?? null;
}

function setMembership(runId: string, playerId: string): void {
  if (!writeJson(LS_MEMBERS, { ...getMemberships(), [runId]: playerId })) notifyStorageFailure();
}

export function isRunOwner(runId: string): boolean {
  return readJson<string[]>(LS_OWNERS, []).includes(runId);
}

function setRunOwner(runId: string): void {
  const owners = readJson<string[]>(LS_OWNERS, []);
  if (!owners.includes(runId) && !writeJson(LS_OWNERS, [...owners, runId])) notifyStorageFailure();
}

/**
 * Second-device hydrate: nuz_run_members has role but not player_id.
 * Owner → slot-0 player + local owner flag. Member → bind only when
 * unambiguous (single player). Never invent a slot in a full lobby.
 */
function restoreLocalRunIdentity(state: RunState, role: 'owner' | 'member' | null): void {
  if (!role) return;
  if (role === 'owner') setRunOwner(state.run.id);
  if (myPlayerId(state.run.id)) return;
  const sorted = [...state.players].sort((a, b) => a.slot - b.slot);
  if (sorted.length === 0) return;
  if (role === 'owner' || sorted.length === 1) setMembership(state.run.id, sorted[0].id);
}

function isMissingColumnError(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  if (error.code === PG_MISSING_COLUMN) return true;
  return /archived/i.test(error.message ?? '') && /column|schema cache/i.test(error.message ?? '');
}

function isAccountLinkedRun(runId: string): boolean {
  return (
    readPersistedAccountRunIds().has(runId) ||
    accountRunIds.has(runId) ||
    readArchivedIndex().includes(runId)
  );
}

/** Cloud-backed run: logged-in account with rows in nuz_runs (solo or multi).
 * Guests stay purely local (nuz_solo_runs blob only). */
export function isCloudRun(state: RunState): boolean {
  if (!isMultiCapable() || !getAuthUser()) return false;
  if (state.mode === 'multi') return true;
  return isAccountLinkedRun(state.run.id);
}

function registerAccountRun(runId: string): void {
  accountRunIds.add(runId);
  const ids = readPersistedAccountRunIds();
  if (!ids.has(runId)) writePersistedAccountRunIds([...ids, runId]);
}

/** Mark a run as account-linked after a silent local→cloud adopt. */
export function markRunAccountLinked(runId: string): void {
  clearAccountRunTombstone(runId);
  registerAccountRun(runId);
}

/** True when this run id is managed via nuz_run_members / account sync. */
export function isAccountManagedRun(runId: string): boolean {
  return isAccountLinkedRun(runId);
}

/**
 * Guest hub visibility: only pure device-local solos.
 * Multi + account-synced runs stay cached on disk for the next login, but
 * must not appear (or open) while logged out — they belong to the account/DB.
 *
 * Deliberately ignores `readArchivedIndex()` (unlike isAccountLinkedRun):
 * guests may archive a local solo without it becoming "account-owned".
 */
export function isDeviceLocalSoloRun(state: RunState): boolean {
  if (state.mode !== 'solo') return false;
  if (state.run.invite_code) return false;
  if (accountRunIds.has(state.run.id)) return false;
  if (readPersistedAccountRunIds().has(state.run.id)) return false;
  return true;
}

function isHubVisibleWhileLoggedOut(runId: string): boolean {
  const s = entries.get(runId)?.state ?? loadLocalRun(runId);
  return !!s && isDeviceLocalSoloRun(s);
}

async function resolveMembershipRole(runId: string): Promise<'owner' | 'member' | null> {
  const user = getAuthUser();
  if (!user || !isMultiCapable()) return isRunOwner(runId) ? 'owner' : null;

  const { data, error } = await supabase
    .from('nuz_run_members')
    .select('role')
    .eq('run_id', runId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (!error && data) {
    return (data as { role?: string }).role === 'owner' ? 'owner' : 'member';
  }
  if (isRunOwner(runId)) return 'owner';
  if (myPlayerId(runId) || getMemberships()[runId]) return 'member';
  return null;
}

async function remoteDeleteRunForever(runId: string): Promise<void> {
  if (!isMultiCapable()) return;
  const user = getAuthUser();
  if (!user) return;

  const role = await resolveMembershipRole(runId);
  if (role === 'owner') {
    const { error } = await nuzTables.runs().delete().eq('id', runId);
    if (error) console.warn('[nuzlocke] run delete failed', error.message);
    return;
  }
  if (role === 'member') {
    const { error } = await supabase
      .from('nuz_run_members')
      .delete()
      .eq('run_id', runId)
      .eq('user_id', user.id);
    if (error) console.warn('[nuzlocke] leave run failed', error.message);
    return;
  }
  if (isRunOwner(runId) || isAccountLinkedRun(runId)) {
    const { error } = await nuzTables.runs().delete().eq('id', runId);
    if (error) console.warn('[nuzlocke] run delete failed', error.message);
  }
}

async function syncMembershipArchived(runId: string, archived: boolean): Promise<void> {
  const user = getAuthUser();
  if (!user || !isMultiCapable() || !membersArchivedSupported || !isAccountLinkedRun(runId)) return;

  const { error } = await supabase
    .from('nuz_run_members')
    .update({ archived })
    .eq('run_id', runId)
    .eq('user_id', user.id);

  if (error) {
    if (isMissingColumnError(error)) {
      membersArchivedSupported = false;
      return;
    }
    console.warn('[nuzlocke] archive sync failed', error.message);
    return;
  }

  if (archived) accountRunIds.delete(runId);
  else accountRunIds.add(runId);
  notifyHub();
}

function syncLocalArchivedFromServer(archivedIds: Set<string>, activeIds: Set<string>): void {
  let archived = readArchivedIndex();
  let active = readRunIndex();

  for (const id of archivedIds) {
    if (!archived.includes(id)) {
      archived = [id, ...archived.filter((x) => x !== id)];
      active = active.filter((x) => x !== id);
    }
  }
  for (const id of activeIds) {
    if (archived.includes(id)) {
      archived = archived.filter((x) => x !== id);
      if (!active.includes(id)) active = [id, ...active.filter((x) => x !== id)];
    }
  }

  writeArchivedIndex(archived);
  writeRunIndex(active);
}

/* The invite code is the only credential guarding a multiplayer run, so it
 * must be unguessable: 8 symbols from a 31-char alphabet ≈ 2^39.6, drawn from
 * the CSPRNG instead of Math.random(). The alphabet drops I/L/O/0/1 so codes
 * stay dictatable over voice chat. Shorter legacy codes (SOUL-XXX) keep
 * working — only minting changes, lookup is length-agnostic. */
const INVITE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const INVITE_LENGTH = 8;

function mintInviteCode(): string {
  const n = INVITE_ALPHABET.length;
  /* largest multiple of n that fits in a byte — values above it are rejected
   * so every symbol stays equally likely (no modulo bias) */
  const limit = 256 - (256 % n);
  let out = '';
  const buf = new Uint8Array(INVITE_LENGTH);
  while (out.length < INVITE_LENGTH) {
    crypto.getRandomValues(buf);
    for (const b of buf) {
      if (b >= limit) continue;
      out += INVITE_ALPHABET[b % n];
      if (out.length === INVITE_LENGTH) break;
    }
  }
  return `SOUL-${out}`;
}

/** Postgres unique_violation — a minted code already exists, mint another. */
const PG_UNIQUE_VIOLATION = '23505';
/** PostgREST: RPC not found — the DB has not had the RLS migration applied
 * yet, so callers fall back to their previous direct-table behaviour. This
 * is what lets the same build run against both schema states. */
const PG_MISSING_FUNCTION = 'PGRST202';
/** PostgREST: column absent from schema cache — migration 09 not applied yet. */
const PG_MISSING_COLUMN = 'PGRST204';

let membersArchivedSupported = true;

/* Multiplayer rows are scoped to run membership. Runs created before that
 * existed — and sessions whose browser storage was cleared — hold no
 * membership, so re-establish it from the invite code kept in the local run
 * state. Idempotent server-side; tracked per run so it costs one call. */
const accessClaimed = new Set<string>();
/* Set once when the RPCs turn out to be absent, so a pre-migration database
 * costs exactly one probe per page load instead of one per action. */
let membershipRpcsMissing = false;

async function ensureRunAccess(run: NuzRunRow): Promise<void> {
  if (!isMultiCapable()) return;
  await ensureRunIdentity();
  const code = run.invite_code;
  if (!code || membershipRpcsMissing || accessClaimed.has(run.id)) return;
  accessClaimed.add(run.id);
  try {
    const { error } = await supabase.rpc('nuz_claim_access', { p_code: code });
    if (error?.code === PG_MISSING_FUNCTION) membershipRpcsMissing = true;
    /* keep it retryable unless the function is simply absent */
    else if (error) accessClaimed.delete(run.id);
  } catch {
    accessClaimed.delete(run.id);
  }
}

/* ---------- species / route label lookup (registered by pages) ---------- */

let speciesNamer: (id: number) => string = (id) => padNum(id);
/** Pages boot the dex name index and register id → label for feed text. */
export function registerSpeciesNamer(fn: (id: number) => string): void {
  speciesNamer = fn;
}

/** Pages also register a localized route namer (display-only; route_key stays EN). */
let routeNamer: ((run: NuzRunRow, routeKey: string) => string) | null = null;
export function registerRouteNamer(fn: ((run: NuzRunRow, routeKey: string) => string) | null): void {
  routeNamer = fn;
}

function routeLabelOf(run: NuzRunRow, routeKey: string): string {
  if (routeNamer) return routeNamer(run, routeKey);
  const region = regionForRun(run.region, run.game);
  return nodeIndex(region ?? { nodes: [] } as never).get(routeKey)?.label ?? routeKey;
}

/* ---------- derived concepts (nuzlocke.md §0.4) ---------- */

export interface SoulLink {
  routeKey: string;
  a: NuzEncounterRow;
  b: NuzEncounterRow;
  /** one partner is dead — death cascade (§2.3) */
  broken: boolean;
}

/** Full SoulLink group on one route (2–N players). */
export interface SoulLinkGroup {
  routeKey: string;
  members: NuzEncounterRow[];
  /** any member is dead */
  broken: boolean;
}

function soulLinkMembersByRoute(state: RunState): Map<string, NuzEncounterRow[]> {
  const byRoute = new Map<string, NuzEncounterRow[]>();
  if (!state.run.rules.soulLink) return byRoute;
  const slotOf = (p: string) => state.players.find((pl) => pl.id === p)?.slot ?? 99;
  for (const e of state.encounters) {
    if (e.status !== 'caught' && e.status !== 'dead') continue;
    const list = byRoute.get(e.route_key) ?? [];
    list.push(e);
    byRoute.set(e.route_key, list);
  }
  for (const [k, list] of byRoute) {
    byRoute.set(
      k,
      [...list].sort((x, y) => slotOf(x.player_id) - slotOf(y.player_id)),
    );
  }
  return byRoute;
}

/** One group per route with 2+ linked catches (timeline rail). */
export function soulLinkGroupsOf(state: RunState): SoulLinkGroup[] {
  const groups: SoulLinkGroup[] = [];
  for (const [routeKey, members] of soulLinkMembersByRoute(state)) {
    if (members.length < 2) continue;
    groups.push({
      routeKey,
      members,
      broken: members.some((m) => m.status === 'dead'),
    });
  }
  return groups;
}

/** SoulLink pairs (feed / KPI): consecutive slots per route. */
export function soulLinksOf(state: RunState): SoulLink[] {
  const links: SoulLink[] = [];
  for (const [routeKey, sorted] of soulLinkMembersByRoute(state)) {
    /* group broken → every pair reads broken (N-player death) */
    const groupBroken = sorted.some((m) => m.status === 'dead');
    for (let i = 0; i + 1 < sorted.length; i++) {
      const a = sorted[i];
      const b = sorted[i + 1];
      links.push({ routeKey, a, b, broken: groupBroken });
    }
  }
  return links;
}

/** All SoulLink mates on the same route (N-player groups, not just pair chain). */
export function linkPartnersOf(state: RunState, encId: string): NuzEncounterRow[] {
  if (!state.run.rules.soulLink) return [];
  const enc = state.encounters.find((e) => e.id === encId);
  if (!enc || (enc.status !== 'caught' && enc.status !== 'dead')) return [];
  return state.encounters.filter(
    (e) =>
      e.id !== enc.id &&
      e.route_key === enc.route_key &&
      e.player_id !== enc.player_id &&
      (e.status === 'caught' || e.status === 'dead'),
  );
}

/** First linked partner (display / 2-player toast). Prefer a living mate. */
export function linkPartnerOf(state: RunState, encId: string): NuzEncounterRow | null {
  const partners = linkPartnersOf(state, encId);
  return partners.find((p) => p.status === 'caught') ?? partners[0] ?? null;
}

export function isLinked(state: RunState, encId: string): boolean {
  return linkPartnersOf(state, encId).length > 0;
}

/** Party membership: explicit `in_party` flag (drag & drop). Legacy runs
 * (localStorage from before the flag existed) fall back to the derived rule
 * "6 most recent alive catches = party" until the first manual move. */
function hasPartyFlags(state: RunState): boolean {
  /* Explicit true/false means flag-mode. Postgres `null` and missing keys
   * are the pre-flag legacy shape — do not treat null as "boxed". */
  return state.encounters.some((e) => e.in_party === true || e.in_party === false);
}

function aliveOf(state: RunState, playerId: string): NuzEncounterRow[] {
  return state.encounters
    .filter((e) => e.player_id === playerId && e.status === 'caught')
    .sort((a, b) => a.created_at.localeCompare(b.created_at));
}

export function partyOf(state: RunState, playerId: string): NuzEncounterRow[] {
  const alive = aliveOf(state, playerId);
  if (!hasPartyFlags(state)) return alive.slice(-6);
  return alive.filter((e) => e.in_party === true);
}

export function boxedOf(state: RunState, playerId: string): NuzEncounterRow[] {
  const alive = aliveOf(state, playerId);
  if (!hasPartyFlags(state)) return alive.slice(0, Math.max(0, alive.length - 6)).reverse();
  return alive.filter((e) => e.in_party !== true).reverse();
}

/** Initialize in_party on legacy / null rows with the old derived rule (idempotent). */
function ensurePartyFlags(s: RunState): void {
  const needsInit = s.encounters.some((e) => e.in_party !== true && e.in_party !== false);
  if (!needsInit) return;
  if (!hasPartyFlags(s)) {
    for (const p of s.players) {
      const alive = aliveOf(s, p.id);
      alive.forEach((e, i) => {
        e.in_party = i >= alive.length - 6;
      });
    }
    return;
  }
  for (const p of s.players) {
    const alive = aliveOf(s, p.id);
    let slots = Math.max(0, 6 - alive.filter((e) => e.in_party === true).length);
    for (const e of alive) {
      if (e.in_party === true || e.in_party === false) continue;
      e.in_party = slots > 0;
      if (slots > 0) slots -= 1;
    }
  }
}

/** Unified box: EVERY non-team encounter of a player — boxed survivors plus
 * dead / missed / duped / lost rows (the box replaces the old graveyard).
 * Newest first; UI badges + locks by status. */
export function boxEntriesOf(state: RunState, playerId: string): NuzEncounterRow[] {
  const party = new Set(partyOf(state, playerId).map((e) => e.id));
  return state.encounters
    .filter((e) => e.player_id === playerId && !party.has(e.id))
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export interface RunKpis {
  caught: number;
  dead: number;
  missed: number;
  links: number;
  routesDone: number;
  routesTotal: number;
}

export function kpisOf(state: RunState): RunKpis {
  /* one SoulLink per route group (2–N players), not pairwise edges —
   * 3 catches on Alabastia → LINKS 1, not 2 (A–B + B–C). */
  const linkGroups = soulLinkGroupsOf(state);
  /* duped/shiny rows don't resolve a route — only slot-consuming rows count */
  const routes = new Set(state.encounters.filter(isSlotConsuming).map((e) => e.route_key));
  const region = regionForRun(state.run.region, state.run.game);
  return {
    caught: state.encounters.filter((e) => e.status === 'caught').length,
    dead: state.encounters.filter((e) => e.status === 'dead').length,
    missed: state.encounters.filter((e) => e.status === 'missed' || e.status === 'duped').length,
    links: linkGroups.length,
    routesDone: routes.size,
    routesTotal: region ? region.nodes.length : 0,
  };
}

/** First route in canonical order with any pending player slot (§2.3 marker). */
export function youAreHereKey(state: RunState): string | null {
  const region = regionForRun(state.run.region, state.run.game);
  if (!region) return null;
  const used = new Set(state.encounters.filter(isSlotConsuming).map((e) => `${e.player_id}:${e.route_key}`));
  for (const node of routeOrder(region)) {
    if (state.players.some((p) => !used.has(`${p.id}:${node.id}`))) return node.id;
  }
  return null;
}

/* ---------- run entries (per-run live state) ---------- */

export type ConnStatus = 'local' | 'connecting' | 'live' | 'reconnecting';
export type LoadPhase = 'loading' | 'ready' | 'missing';

export interface RunEntry {
  id: string;
  phase: LoadPhase;
  state: RunState | null;
  status: ConnStatus;
  /** player_id → presence meta */
  online: Record<string, { name: string; color: string }>;
  feed: FeedEvent[];
  /** encounter ids (or `run:<id>` for run-level ops) awaiting server ack
   * (§2.9 latency honesty) */
  pendingSync: Set<string>;
  /** durable-per-session outbox: unacked encounter writes keyed by `enc.id`,
   * consulted by `refreshRemote` so a hydrate/reconnect never blind-drops an
   * optimistic insert/patch/delete still in flight (concurrency plan §1.1) */
  outbox: Outbox;
  /** monotonic write generation per `syncKey` — lets `persistWithRetry`
   * ignore a stale write's success/failure once a newer one supersedes it
   * (concurrency plan §1.2) */
  opGen: Map<string, number>;
  /** encounter id → Date.now() of a completed local/peer restore; a delayed
   * `dead` realtime frame must not overwrite this (Finding 6). */
  restoreGuard: Map<string, number>;
  milestones: Set<string>;
  listeners: Set<() => void>;
  refs: number;
  channel: RealtimeChannel | null;
  /** re-track presence when the tab becomes visible again */
  presenceVisHandler: (() => void) | null;
  remoteLoaded: boolean;
  /** set when a cloud-backed run could not load the server snapshot */
  hydrateError: string | null;
  teardownTimer: number | null;
}

const entries = new Map<string, RunEntry>();

function newEntry(id: string): RunEntry {
  return {
    id,
    phase: 'loading',
    state: null,
    status: 'local',
    online: {},
    feed: [],
    pendingSync: new Set(),
    outbox: new Map(),
    opGen: new Map(),
    restoreGuard: new Map(),
    milestones: new Set(),
    listeners: new Set(),
    refs: 0,
    channel: null,
    presenceVisHandler: null,
    remoteLoaded: false,
    hydrateError: null,
    teardownTimer: null,
  };
}

function expectsServerSnapshot(state: RunState | null): boolean {
  if (!state || !getAuthUser()) return false;
  return state.mode === 'multi' || isAccountLinkedRun(state.run.id) || isCloudRun(state);
}

/** True for runs minted in this tab moments ago — first fetch can race RLS. */
function isFreshlyCreatedLocal(state: RunState): boolean {
  const t = Date.parse(state.run.created_at);
  return Number.isFinite(t) && Date.now() - t < 15_000;
}

function markHydrateFailed(entry: RunEntry, opts?: { silent?: boolean }): void {
  const first = !entry.hydrateError;
  entry.hydrateError = 'stale';
  /* Fresh creates: badge only on the first miss (membership trigger race).
   * Stale cache / later retries: toast so the user knows the server view failed. */
  if (first && !opts?.silent) pushToast('sync', i18n.t('nuz.toast.hydrateFailed'));
  emit(entry);
}

function emit(entry: RunEntry): void {
  entry.listeners.forEach((fn) => fn());
}

/** Current in-memory run state (live entry preferred, local mirror fallback). */
export function getRunState(runId: string): RunState | null {
  return entries.get(runId)?.state ?? loadLocalRun(runId);
}

function ensureEntry(runId: string): RunEntry {
  let e = entries.get(runId);
  if (!e) {
    e = newEntry(runId);
    entries.set(runId, e);
    const local = loadLocalRun(runId);
    if (local) {
      e.state = local;
      e.phase = 'ready';
      e.status = isCloudRun(local) ? 'connecting' : 'local';
      ensurePartyFlags(local);
      seedFeed(e);
    }
    void refreshRemote(e);
  }
  return e;
}

function seedFeed(entry: RunEntry): void {
  const s = entry.state;
  if (!s) return;
  const events: FeedEvent[] = [];
  for (const enc of [...s.encounters].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 30)) {
    events.push(encounterFeedEvent(s, enc, false));
  }
  for (const p of s.players) {
    events.push({ id: `join-${p.id}`, t: Date.parse(p.created_at) || 0, kind: 'join', color: p.color, title: i18n.t('nuz.feed.joined', { name: p.name }) });
  }
  entry.feed = events.sort((a, b) => b.t - a.t).slice(0, 60);
}

function pushFeed(entry: RunEntry, ev: Omit<FeedEvent, 'id' | 't'> & { t?: number }): void {
  entry.feed = [{ ...ev, id: uuid(), t: ev.t ?? Date.now() }, ...entry.feed].slice(0, 60);
  emit(entry);
}

const FEED_VERB_KEY: Record<NuzEncounterStatus, string> = {
  caught: 'nuz.feed.verbCaught',
  dead: 'nuz.feed.verbDead',
  missed: 'nuz.feed.verbMissed',
  duped: 'nuz.feed.verbDuped',
  lost: 'nuz.feed.verbLost',
};

function encounterFeedEvent(state: RunState, enc: NuzEncounterRow, _live: boolean): FeedEvent {
  const p = state.players.find((pl) => pl.id === enc.player_id);
  const species = enc.nickname ?? speciesNamer(enc.pokemon_id);
  const kind: FeedKind =
    enc.status === 'caught' ? 'catch'
    : enc.status === 'dead' ? 'death'
    : enc.status === 'duped' ? 'duped'
    : enc.status === 'lost' ? 'lost'
    : 'missed';
  const route = routeLabelOf(state.run, enc.route_key);
  return {
    id: `enc-${enc.id}`,
    t: Date.parse(enc.created_at) || Date.now(),
    kind,
    color: p?.color,
    // feed text is generated in the active language at write time (i18n.t);
    // historical entries keep the language they were written in (accepted)
    title: i18n.t('nuz.feed.encounter', {
      player: p?.name ?? i18n.t('nuz.feed.someone'),
      verb: i18n.t(FEED_VERB_KEY[enc.status]),
      name: species,
      species: speciesNamer(enc.pokemon_id),
    }),
    meta: `${route} · LV ${enc.level}`,
  };
}

/* ---------- remote fetch ---------- */

async function fetchRemoteRun(runId: string): Promise<RunState | null> {
  if (!isMultiCapable()) return null;
  const { data: run, error } = await nuzTables.runs().select('*').eq('id', runId).maybeSingle();
  if (error || !run) return null;
  const [{ data: players }, { data: encounters }] = await Promise.all([
    nuzTables.players().select('*').eq('run_id', runId).order('slot'),
    nuzTables.encounters().select('*').eq('run_id', runId).order('created_at'),
  ]);
  const row = run as NuzRunRow;
  return {
    run: { ...row, rules: { ...DEFAULT_RULES, ...(row.rules as Partial<NuzRules>) } },
    mode: row.invite_code ? 'multi' : 'solo',
    players: (players ?? []) as NuzPlayerRow[],
    encounters: normalizeEncounters((encounters ?? []) as NuzEncounterRow[]),
  };
}

async function refreshRemote(entry: RunEntry): Promise<void> {
  const local = entry.state;
  if (local && !isCloudRun(local)) {
    entry.phase = 'ready';
    emit(entry);
    return;
  }
  if (!isMultiCapable()) {
    if (!local) entry.phase = 'missing';
    emit(entry);
    return;
  }
  try {
    /* membership must exist before the reads below return anything */
    if (local?.run) await ensureRunAccess(local.run);
    const remote = await fetchRemoteRun(entry.id);
    if (remote) {
      /* Never blind `state = remote` while writes are still in flight — the
       * outbox overrides/excludes rows with an unacked insert/patch/delete
       * (concurrency plan §1.1). */
      const { encounters } = mergeRemoteWithOutbox({
        remote: remote.encounters,
        localEncounters: local?.encounters ?? [],
        outbox: entry.outbox,
      });
      const merged = { ...remote, encounters };
      ensurePartyFlags(merged);
      entry.state = merged;
      entry.phase = 'ready';
      entry.hydrateError = null;
      /* Account membership is per user_id, not per browser — restore owner /
       * player binding so a second device is not a read-only stranger. */
      restoreLocalRunIdentity(merged, await resolveMembershipRole(entry.id));
      saveLocalRun(merged);
      if (!isRunArchived(entry.id)) addToIndex(entry.id);
      /* authoritative re-seed — includes encounter history, not just joins */
      seedFeed(entry);
      scheduleLinkedSync(merged);
      /* Heal Dupes violations that snuck in while this client was offline /
       * mid-hydrate — realtime only re-scans on fresh INSERTs, not on a
       * full snapshot replace (Menki+Rasaff both `caught` after reload). */
      void reconcileEvoLineDupes(entry);
    } else if (!local) {
      entry.phase = 'missing';
    } else if (expectsServerSnapshot(local)) {
      markHydrateFailed(entry, { silent: !entry.remoteLoaded && isFreshlyCreatedLocal(local) });
    }
  } catch {
    if (!local) entry.phase = 'missing';
    else if (expectsServerSnapshot(local)) {
      markHydrateFailed(entry, { silent: !entry.remoteLoaded && isFreshlyCreatedLocal(local) });
    }
  }
  entry.remoteLoaded = true;
  emit(entry);
  /* Membership/players may arrive only after hydrate — retry live attach. */
  if (entry.state && isCloudRun(entry.state) && entry.refs > 0 && !entry.channel) goLive(entry);
}

/* ---------- realtime (nuzlocke.md §2.9) ---------- */

function presenceMe(entry: RunEntry): { player_id: string; name: string; color: string } | null {
  const s = entry.state;
  if (!s) return null;
  const mine = myPlayerId(entry.id);
  if (!mine) return null;
  const p = s.players.find((pl) => pl.id === mine);
  return p ? { player_id: p.id, name: p.name, color: p.color } : null;
}

function applyRemoteEncounter(entry: RunEntry, enc: NuzEncounterRow): void {
  const s = entry.state;
  if (!s) return;
  if (entry.outbox.has(enc.id)) {
    /* a local write for this row is still unacked — the optimistic value is
     * already on screen, and this realtime echo predates it (or is stale).
     * Let the in-flight write's own success/failure settle it instead of
     * reverting the UI now (concurrency plan §1.1/§1.2). */
    return;
  }
  const normalized = normalizeEncounter(enc);
  const before = soulLinkGroupsOf(s).length;
  const idx = s.encounters.findIndex((e) => e.id === normalized.id);
  const isNew = idx < 0;
  let applied = normalized;
  if (isNew) {
    s.encounters = [...s.encounters, normalized];
    pushFeed(entry, encounterFeedEvent(s, normalized, true));
    /* another player's fresh catch — Dupes TOCTOU interim re-scan (§1.3) */
    if (normalized.status === 'caught') void reconcileEvoLineDupes(entry, normalized);
  } else {
    const prev = s.encounters[idx];
    const isRestore =
      applied.status === 'caught' && isStatusDowngrade(prev.status, applied.status);
    if (isStatusDowngrade(prev.status, applied.status) && !isRestore) {
      /* stale less-final frame (e.g. caught echo over dead) — keep local */
      return;
    }
    const guardedAt = entry.restoreGuard.get(applied.id);
    if (
      guardedAt &&
      prev.status === 'caught' &&
      applied.status !== 'caught' &&
      Date.now() - guardedAt < 8000
    ) {
      /* delayed death/miss after a completed restore */
      return;
    }
    applied = normalized;
    s.encounters = s.encounters.map((e) => (e.id === applied.id ? applied : e));
    if (isRestore) entry.restoreGuard.set(applied.id, Date.now());
    if (applied.status !== 'caught') entry.restoreGuard.delete(applied.id);
    if (prev.status !== applied.status || prev.pokemon_id !== applied.pokemon_id || prev.level !== applied.level) {
      if (prev.status !== applied.status) {
        pushFeed(entry, encounterFeedEvent(s, applied, true));
        if (applied.status === 'dead') checkCascade(entry, applied);
        if (applied.status === 'missed') checkMissCascade(entry, applied);
        /* restore into a living evo-line may re-open a dupes race (§1.3) */
        if (applied.status === 'caught') {
          checkRestoreCascade(entry, applied, prev.status);
          void reconcileEvoLineDupes(entry, applied);
        }
      }
    }
  }
  entry.pendingSync.delete(applied.id);
  entry.outbox.delete(applied.id);
  saveLocalRun(s);
  const after = soulLinkGroupsOf(s).length;
  if (after > before) announceLink(entry, s, applied);
  checkMilestones(entry);
  scheduleLinkedSync(s, applied.player_id);
  emit(entry);
}

/* ---------- Dupes Clause TOCTOU interim (Phase 1.3) ----------
 * Interim client-side re-check until a server-side RPC validates the family
 * in the same transaction as the insert (plan §2.3). Runs after every insert
 * either client learns about — see call sites in `applyRemoteEncounter`
 * (remote catch) and `logEncounter` (our own ack) — and after hydrate
 * (`refreshRemote`) so a full snapshot replace still heals. Prefetches
 * families for *every* living catch (not only the trigger) so a fail-open
 * singleton on one stage cannot miss a sibling that already resolved the
 * line. `pickDupeLoser` / `findEvoLineDupeViolations` are pure and
 * deterministic (created_at/id), so every online client converges on the
 * same loser without coordinating. */
async function reconcileEvoLineDupes(entry: RunEntry, trigger?: NuzEncounterRow): Promise<void> {
  if (!entry.state || !entry.state.run.rules.dupes) return;
  if (trigger && (trigger.status !== 'caught' || trigger.is_shiny)) return;
  try {
    await prefetchEvolutionFamiliesForEncounters(entry.state.encounters);
  } catch {
    return; /* offline / unknown — no re-check possible, degrade gracefully */
  }
  const s = entry.state;
  if (!s?.run.rules.dupes) return;
  const claiming = dupesClaimingStatuses(s.run.rules);
  if (claiming.length === 0) return;
  const losers = findEvoLineDupeViolations(s.encounters, cachedEvolutionFamilyIds, claiming);
  for (const loser of losers) {
    /* re-check right before writing — a concurrent scan (the other client's
     * own trigger) may have already turned this row into a `duped` no-op */
    if (s.encounters.find((e) => e.id === loser.id)?.status !== 'caught') continue;
    /* updateEncounter already frees in_party for any non-'caught' status */
    updateEncounter(entry.id, loser.id, { status: 'duped' });
    pushToast(
      'info',
      i18n.t('nuz.toast.dupeRace', { name: loser.nickname ?? speciesNamer(loser.pokemon_id) }),
    );
  }
}

function goLive(entry: RunEntry): void {
  const s = entry.state;
  if (!s || !isCloudRun(s) || entry.channel || !isMultiCapable()) return;
  /* Presence key = player id. Never the run id (collides every unbound client).
   * Multi lobby without a membership bind: unique tab key, skip track. */
  const mine = myPlayerId(entry.id);
  const presenceKey =
    mine ??
    (s.mode === 'multi' ? `pending:${uuid()}` : s.players[0]?.id);
  if (!presenceKey) return;
  entry.status = 'connecting';
  const runId = entry.id;
  const ch = runChannel(runId, presenceKey);
  const multiPresence = s.mode === 'multi';
  entry.channel = ch;
  const isCurrent = (): boolean => entry.channel === ch;
  ch.on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'nuz_encounters', filter: `run_id=eq.${runId}` },
    (payload) => {
      if (!isCurrent()) return;
      if (payload.eventType === 'DELETE') {
        const old = payload.old as Partial<NuzEncounterRow>;
        const st = entry.state;
        if (st && old.id) {
          st.encounters = st.encounters.filter((e) => e.id !== old.id);
          entry.pendingSync.delete(old.id);
          entry.outbox.delete(old.id);
          saveLocalRun(st);
          emit(entry);
        }
        return;
      }
      applyRemoteEncounter(entry, payload.new as NuzEncounterRow);
    },
  );
  ch.on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'nuz_players', filter: `run_id=eq.${runId}` },
    (payload) => {
      if (!isCurrent()) return;
      const st = entry.state;
      if (!st) return;
      if (payload.eventType === 'DELETE') {
        const old = payload.old as Partial<NuzPlayerRow>;
        if (old.id) st.players = st.players.filter((p) => p.id !== old.id);
      } else {
        const p = payload.new as NuzPlayerRow;
        if (st.players.some((x) => x.id === p.id)) {
          st.players = st.players.map((x) => (x.id === p.id ? p : x));
        } else {
          st.players = [...st.players, p].sort((a, b) => a.slot - b.slot);
          pushFeed(entry, { kind: 'join', color: p.color, title: i18n.t('nuz.feed.joined', { name: p.name }) });
        }
      }
      saveLocalRun(st);
      emit(entry);
    },
  );
  ch.on(
    'postgres_changes',
    { event: 'UPDATE', schema: 'public', table: 'nuz_runs', filter: `id=eq.${runId}` },
    (payload) => {
      if (!isCurrent()) return;
      const st = entry.state;
      if (!st) return;
      const row = payload.new as NuzRunRow;
      st.run = { ...row, rules: { ...DEFAULT_RULES, ...(row.rules as Partial<NuzRules>) } };
      saveLocalRun(st);
      emit(entry);
    },
  );
  if (multiPresence) {
    ch.on('presence', { event: 'sync' }, () => {
      if (!isCurrent()) return;
      const pres = ch.presenceState<{ player_id: string; name: string; color: string }>();
      const online: Record<string, { name: string; color: string }> = {};
      const wasOnline = new Set(Object.keys(entry.online));
      for (const list of Object.values(pres)) {
        for (const m of list) {
          if (m.player_id) {
            online[m.player_id] = { name: m.name, color: m.color };
            if (!wasOnline.has(m.player_id) && m.player_id !== presenceMe(entry)?.player_id) {
              pushFeed(entry, { kind: 'presence', color: m.color, title: i18n.t('nuz.feed.online', { name: m.name }) });
            }
          }
        }
      }
      entry.online = online;
      emit(entry);
    });
  }
  ch.subscribe((status) => {
    if (!isCurrent()) return;
    if (status === 'SUBSCRIBED') {
      entry.status = 'live';
      if (multiPresence) {
        const me = presenceMe(entry);
        if (me) void ch.track(me);
      }
      /* fill any postgres_changes gap while disconnected */
      void refreshRemote(entry);
    } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
      entry.status = 'reconnecting';
    }
    emit(entry);
  });
  if (multiPresence && !entry.presenceVisHandler) {
    const onVis = (): void => {
      if (document.visibilityState !== 'visible') return;
      if (entry.channel !== ch) return;
      const me = presenceMe(entry);
      if (me) void ch.track(me);
    };
    document.addEventListener('visibilitychange', onVis);
    entry.presenceVisHandler = onVis;
  }
}

function dropLive(entry: RunEntry): void {
  if (entry.presenceVisHandler) {
    document.removeEventListener('visibilitychange', entry.presenceVisHandler);
    entry.presenceVisHandler = null;
  }
  if (entry.channel) {
    dropChannel(entry.channel);
    entry.channel = null;
  }
  if (entry.state && isCloudRun(entry.state)) entry.status = 'connecting';
  entry.online = {};
}

/** Subscribe a component to a run entry; live channel is ref-counted. */
export function subscribeRun(runId: string, listener: () => void): () => void {
  const entry = ensureEntry(runId);
  entry.listeners.add(listener);
  entry.refs += 1;
  if (entry.teardownTimer !== null) {
    window.clearTimeout(entry.teardownTimer);
    entry.teardownTimer = null;
  }
  if (entry.state && isCloudRun(entry.state)) goLive(entry);
  return () => {
    entry.listeners.delete(listener);
    entry.refs -= 1;
    if (entry.refs <= 0) {
      entry.refs = 0;
      entry.teardownTimer = window.setTimeout(() => {
        if (entry.refs === 0) dropLive(entry);
      }, 8000);
    }
  };
}

/* ---------- optimistic writes + retry (§0.1, §2.9) ---------- */

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/** Fire-and-replay a remote write; gold toast on failure, never red.
 * `outbox` (when the write touches an encounter row) records the local
 * snapshot `refreshRemote` must prefer over the server until this write
 * acks — see `mergeRemoteWithOutbox` (concurrency plan §1.1).
 * Every call allocates a fresh `opGen` for `syncKey`; a call superseded by a
 * later one for the same key (e.g. rapid dead → restore) skips its own
 * success/failure side effects once it is no longer current (§1.2) — the
 * newer call owns clearing `pendingSync`/`outbox` and any toast. */
function persistWithRetry(
  entry: RunEntry,
  syncKey: string,
  op: () => PromiseLike<{ error: unknown }>,
  outbox?: { snapshot: NuzEncounterRow; kind: OutboxOpKind },
): void {
  if (!isMultiCapable() || !entry.state || !isCloudRun(entry.state)) return;
  const gen = nextOpGen(entry.opGen, syncKey);
  entry.pendingSync.add(syncKey);
  if (outbox) entry.outbox.set(syncKey, { kind: outbox.kind, snapshot: outbox.snapshot, gen });
  emit(entry);
  const attempt = async (n: number): Promise<void> => {
    if (!isCurrentOp(entry.opGen, syncKey, gen)) return; /* superseded — newer write owns this key now */
    try {
      const { error } = await op();
      if (!isCurrentOp(entry.opGen, syncKey, gen)) return;
      if (!error) {
        entry.pendingSync.delete(syncKey);
        entry.outbox.delete(syncKey);
        emit(entry);
        return;
      }
      if (n === 0) pushToast('sync', i18n.t('nuz.toast.retryingSync'));
      if (n >= 4) return; /* stays flagged — PENDING SYNC caption */
    } catch {
      if (!isCurrentOp(entry.opGen, syncKey, gen)) return;
      if (n === 0) pushToast('sync', i18n.t('nuz.toast.retryingSync'));
      if (n >= 4) return;
    }
    await sleep(900 * 2 ** n);
    return attempt(n + 1);
  };
  void attempt(0);
}

/** Server-confirmed rows from our own `nuz_apply_encounter_status` call —
 * overwrite the matching local rows so any client/server logic drift is
 * corrected without waiting on realtime. No feed/toast here: those already
 * fired when the cascade was applied optimistically (checkCascade /
 * checkMissCascade); this is purely reconciliation. */
function applyOwnWriteResult(entry: RunEntry, rows: NuzEncounterRow[]): void {
  const s = entry.state;
  if (!s || rows.length === 0) return;
  const byId = new Map(rows.map((r) => [r.id, normalizeEncounter(r)]));
  s.encounters = s.encounters.map((e) => byId.get(e.id) ?? e);
  saveLocalRun(s);
  emit(entry);
}

/** Bundles the primary row + every SoulLink partner a local cascade touched
 * into ONE `nuz_apply_encounter_status` RPC call (concurrency plan §2.2) —
 * the server re-derives the same partner set from `route_key`/`soulLink`
 * and applies all of them in a single transaction, so this never sends N
 * separate partner PATCHes. Outbox/opGen bookkeeping is tracked per row id
 * exactly like `persistWithRetry`, just fanned out over every target
 * instead of one, so a stale retry for any single row can still be
 * superseded independently (Phase 1.2). */
function persistStatusRpc(
  entry: RunEntry,
  targets: NuzEncounterRow[],
  args: { p_encounter_id: string; p_new_status: string; p_note: string | null; p_client_op_id?: string },
): void {
  if (!isMultiCapable() || !entry.state || !isCloudRun(entry.state) || targets.length === 0) return;
  const gens = targets.map((row) => ({ id: row.id, row, gen: nextOpGen(entry.opGen, row.id) }));
  for (const g of gens) {
    entry.pendingSync.add(g.id);
    entry.outbox.set(g.id, { kind: 'patch', snapshot: g.row, gen: g.gen });
  }
  emit(entry);
  const attempt = async (n: number): Promise<void> => {
    if (!gens.some((g) => isCurrentOp(entry.opGen, g.id, g.gen))) return; /* every target superseded */
    try {
      const { data, error } = await supabase.rpc('nuz_apply_encounter_status', args);
      const stillCurrent = gens.filter((g) => isCurrentOp(entry.opGen, g.id, g.gen));
      if (!error) {
        for (const g of stillCurrent) {
          entry.pendingSync.delete(g.id);
          entry.outbox.delete(g.id);
        }
        emit(entry);
        const updated = (data as { updated?: NuzEncounterRow[] } | null)?.updated;
        if (updated?.length) applyOwnWriteResult(entry, updated);
        return;
      }
      if (n === 0) pushToast('sync', i18n.t('nuz.toast.retryingSync'));
      if (n >= 4) return;
    } catch {
      if (!gens.some((g) => isCurrentOp(entry.opGen, g.id, g.gen))) return;
      if (n === 0) pushToast('sync', i18n.t('nuz.toast.retryingSync'));
      if (n >= 4) return;
    }
    await sleep(900 * 2 ** n);
    return attempt(n + 1);
  };
  void attempt(0);
}

/* ---------- milestones ---------- */

function checkMilestones(entry: RunEntry): void {
  const s = entry.state;
  if (!s) return;
  const k = kpisOf(s);
  const fire = (key: string, title: string, meta?: string) => {
    if (entry.milestones.has(key)) return;
    entry.milestones.add(key);
    pushFeed(entry, { kind: 'milestone', color: '#F6C945', title, meta });
  };
  if (k.caught >= 10) fire('caught-10', i18n.t('nuz.feed.msCaught'), i18n.t('nuz.feed.msCaughtMeta'));
  if (k.dead >= 1) fire('first-blood', i18n.t('nuz.feed.msBlood'), i18n.t('nuz.feed.msBloodMeta'));
  if (k.routesTotal > 0 && k.routesDone >= Math.ceil(k.routesTotal / 2)) {
    fire('halfway', i18n.t('nuz.feed.msHalfway', { done: k.routesDone, total: k.routesTotal }));
  }
  if (s.run.status === 'complete') fire('complete', i18n.t('nuz.feed.msComplete'), i18n.t('nuz.feed.msCompleteMeta'));
}

function announceLink(entry: RunEntry, s: RunState, enc: NuzEncounterRow): void {
  const partner = linkPartnerOf(s, enc.id);
  if (!partner) return;
  const aName = enc.nickname ?? speciesNamer(enc.pokemon_id);
  const bName = partner.nickname ?? speciesNamer(partner.pokemon_id);
  pushFeed(entry, {
    kind: 'link',
    color: '#F6C945',
    title: i18n.t('nuz.feed.linkFormed', { a: aName, b: bName }),
    meta: routeLabelOf(s.run, enc.route_key),
  });
  pushToast('link', i18n.t('nuz.toast.soulLink', { a: aName, b: bName }));
}

/** Death cascade (concurrency plan §2.1/2.2 — product decision: auto-apply,
 * mirroring the miss→`lost` cascade). PURELY local: mutates `s.encounters` +
 * feed/toast and returns the touched partner rows; it never talks to the
 * network itself. The caller decides how to persist:
 *  - `updateEncounter` (interactive mark-dead) bundles the returned rows
 *    into one `nuz_apply_encounter_status` RPC call together with the
 *    primary row (`persistStatusRpc`).
 *  - `logEncounter` (logging an encounter that is already dead) fires the
 *    same RPC once its own insert has landed.
 *  - `applyRemoteEncounter` (a REMOTE client's death arriving via realtime)
 *    calls this only to keep the local view predictively in sync — it must
 *    NOT re-persist, since the originating client's RPC already owns that
 *    write server-side. Re-running this against already-dead partners is a
 *    no-op (idempotent): `livingCascadeTargets` only returns `caught` rows. */
function checkCascade(entry: RunEntry, deadEnc: NuzEncounterRow): NuzEncounterRow[] {
  const s = entry.state;
  if (!s || !s.run.rules.soulLink) return [];
  /* N-player SoulLink: every living catch on the route cascades — not just
   * the next slot in the pairwise chain (that missed player 3+). */
  const partners = livingCascadeTargets(s.encounters, deadEnc);
  if (partners.length === 0) return [];
  const route = routeLabelOf(s.run, deadEnc.route_key);
  const cascadeOn = s.run.rules.soulLinkCascade;
  const touched: NuzEncounterRow[] = [];
  for (const partner of partners) {
    const name = partner.nickname ?? speciesNamer(partner.pokemon_id);
    /* cascade rule on: partner falls too (auto-applied, no confirm needed).
     * cascade rule off (owner choice): partner is only auto-boxed. */
    s.encounters = s.encounters.map((e) =>
      e.id === partner.id ? { ...e, status: cascadeOn ? ('dead' as const) : e.status, in_party: false } : e,
    );
    const updated = s.encounters.find((e) => e.id === partner.id)!;
    touched.push(updated);
    saveLocalRun(s);
    scheduleLinkedSync(s, partner.player_id);
    pushFeed(entry, {
      kind: 'link',
      color: '#F6C945',
      title: i18n.t(cascadeOn ? 'nuz.feed.linkCascade' : 'nuz.feed.linkCascadeBoxed', { name }),
      meta: route,
    });
    pushToast('info', i18n.t(cascadeOn ? 'nuz.toast.cascade' : 'nuz.toast.cascadeBoxed', { name }));
  }
  return touched;
}

/** Restore cascade — undo of death/miss. Local only; caller persists via RPC. */
function checkRestoreCascade(
  entry: RunEntry,
  restoredEnc: NuzEncounterRow,
  prevStatus: NuzEncounterStatus,
): NuzEncounterRow[] {
  const s = entry.state;
  if (!s || !s.run.rules.soulLink || !s.run.rules.soulLinkCascade) return [];
  if (restoredEnc.status !== 'caught') return [];
  const partners = cascadeRestoreTargets(s.encounters, restoredEnc, prevStatus);
  if (partners.length === 0) return [];
  const route = routeLabelOf(s.run, restoredEnc.route_key);
  const touched: NuzEncounterRow[] = [];
  for (const partner of partners) {
    const name = partner.nickname ?? speciesNamer(partner.pokemon_id);
    s.encounters = s.encounters.map((e) =>
      e.id === partner.id ? { ...e, status: 'caught' as const } : e,
    );
    const updated = s.encounters.find((e) => e.id === partner.id)!;
    touched.push(updated);
    entry.restoreGuard.set(updated.id, Date.now());
    saveLocalRun(s);
    scheduleLinkedSync(s, partner.player_id);
    pushFeed(entry, {
      kind: 'link',
      color: '#F6C945',
      title: i18n.t('nuz.feed.linkRestored', { name }),
      meta: route,
    });
    pushToast('info', i18n.t('nuz.toast.cascadeRestored', { name }));
  }
  return touched;
}

/* ---------- SoulLink missed cascade ----------
 * Mirror of the death cascade (§2.3): when a player MISSES the encounter on a
 * route, the linked partner loses that route too.
 * - Partner has a LIVING catch on the route → cascade rule on: the catch
 *   becomes 'lost' (unusable, not dead) and leaves the party; rule off: it is
 *   auto-boxed like in the death cascade.
 * - Partner has NOT played the route yet → the route is locked for them; see
 *   the route-lock check in logEncounter (a later catch there logs as 'lost').
 * Cascade only ever fires FROM a missed row AT living ('caught') partners —
 * dead/lost/missed partners are untouched, so a realtime double-miss race
 * cannot loop. */
function livingPartnersOnRoute(s: RunState, enc: NuzEncounterRow): NuzEncounterRow[] {
  return livingCascadeTargets(s.encounters, enc);
}

/** Miss cascade — same local-only contract as `checkCascade` above (returns
 * touched partner rows, never persists itself). */
function checkMissCascade(entry: RunEntry, missedEnc: NuzEncounterRow): NuzEncounterRow[] {
  const s = entry.state;
  if (!s || !s.run.rules.soulLink || missedEnc.status !== 'missed') return [];
  const route = routeLabelOf(s.run, missedEnc.route_key);
  const cascadeOn = s.run.rules.soulLinkCascade;
  const touched: NuzEncounterRow[] = [];
  for (const partner of livingPartnersOnRoute(s, missedEnc)) {
    const name = partner.nickname ?? speciesNamer(partner.pokemon_id);
    /* link-lost (cascade on): NOT dead — own 'lost' status, out of the party.
     * cascade off: partner stays alive but is auto-boxed immediately. */
    s.encounters = s.encounters.map((e) =>
      e.id === partner.id ? { ...e, status: cascadeOn ? ('lost' as const) : e.status, in_party: false } : e,
    );
    const updated = s.encounters.find((e) => e.id === partner.id)!;
    touched.push(updated);
    saveLocalRun(s);
    scheduleLinkedSync(s, partner.player_id);
    if (cascadeOn) {
      pushFeed(entry, { kind: 'lost', color: '#F6C945', title: i18n.t('nuz.feed.linkLost', { name }), meta: route });
      pushToast('info', i18n.t('nuz.toast.linkLost', { name }));
    } else {
      pushFeed(entry, { kind: 'link', color: '#F6C945', title: i18n.t('nuz.feed.linkMissBoxed', { name }), meta: route });
      pushToast('info', i18n.t('nuz.toast.cascadeBoxed', { name }));
    }
  }
  return touched;
}

/* ---------- SoulLink box-link (§A1) ----------
 * Mirror of NU Soul Link's "box link": boxing one half of a pair boxes the
 * other too — independent of `soulLinkCascade` (that toggle only governs
 * the death/miss cascade above). Always on with SoulLink. Deliberately
 * one-directional: pulling a mon INTO the party never force-moves a
 * partner along (their party could already be full), only boxing does. */
function boxLinkPartners(entry: RunEntry, boxedEnc: NuzEncounterRow): NuzEncounterRow[] {
  const s = entry.state;
  if (!s || !s.run.rules.soulLink) return [];
  const partners = s.encounters.filter(
    (e) =>
      e.id !== boxedEnc.id &&
      e.route_key === boxedEnc.route_key &&
      e.player_id !== boxedEnc.player_id &&
      e.status === 'caught' &&
      e.in_party === true,
  );
  if (partners.length === 0) return [];
  const route = routeLabelOf(s.run, boxedEnc.route_key);
  const touched: NuzEncounterRow[] = [];
  for (const partner of partners) {
    const name = partner.nickname ?? speciesNamer(partner.pokemon_id);
    s.encounters = s.encounters.map((e) => (e.id === partner.id ? { ...e, in_party: false } : e));
    const updated = s.encounters.find((e) => e.id === partner.id)!;
    touched.push(updated);
    saveLocalRun(s);
    scheduleLinkedSync(s, partner.player_id);
    pushFeed(entry, { kind: 'link', color: '#F6C945', title: i18n.t('nuz.feed.linkBoxed', { name }), meta: route });
    pushToast('info', i18n.t('nuz.toast.linkBoxed', { name }));
  }
  return touched;
}

/** SoulLink route lock: a linked partner already MISSED this route, so any
 * catch logged here is link-lost from the start. Only applies with the
 * cascade rule on (rule off keeps partners usable, hence no lock). */
export function isRouteLinkLocked(state: RunState, playerId: string, routeKey: string): boolean {
  if (!state.run.rules.soulLink || !state.run.rules.soulLinkCascade) return false;
  return state.encounters.some(
    (e) => e.route_key === routeKey && e.player_id !== playerId && e.status === 'missed' && !e.is_shiny,
  );
}

/** Restore to caught is allowed when the route slot is free. SoulLink
 * miss-cascade victims (`lost` while a mate is still `missed`) must not
 * restore alone — restore the missed trigger so the group stays in sync. */
export function canRestoreEncounter(state: RunState, enc: NuzEncounterRow): boolean {
  if (enc.status === 'caught') return true;
  const slotTaken = state.encounters.some(
    (e) =>
      e.id !== enc.id &&
      e.player_id === enc.player_id &&
      e.route_key === enc.route_key &&
      isSlotConsuming(e),
  );
  if (slotTaken) return false;
  if (
    state.run.rules.soulLink &&
    enc.status === 'lost' &&
    state.encounters.some(
      (e) =>
        e.id !== enc.id &&
        e.route_key === enc.route_key &&
        e.player_id !== enc.player_id &&
        e.status === 'missed',
    )
  ) {
    return false;
  }
  return true;
}

/* ---------- actions: create / join / upgrade ---------- */

/** Hub cache only. Membership is never written from the REST client
 * (migrations 12–13): owner → `nuz_runs_grant_owner` on INSERT; member →
 * `nuz_join_by_code` / `nuz_claim_access`. Finding 19: guests cannot create
 * runs (`getAuthUser` / `isRealUser` gate) — that is intentional. */
function linkRunToAccount(runId: string, _role: 'owner' | 'member'): void {
  if (!getAuthUser()) return;
  registerAccountRun(runId);
}


export interface NewRunPlayer {
  name: string;
  color: string;
}

export interface NewRunConfig {
  name: string;
  /** atlas RegionId or freeform region id (kalos/alola/galar/hisui/paldea) */
  region: string;
  game: string;
  players: NewRunPlayer[];
  rules: NuzRules;
  online: boolean;
}

export interface CreatedRun {
  state: RunState;
  inviteCode: string | null;
  /** fell back to solo because the remote write failed */
  offlineFallback: boolean;
}

/** Thrown when creating or joining a run is attempted without a real account. */
export class NuzLoginRequiredError extends Error {
  constructor() {
    super('login_required');
    this.name = 'NuzLoginRequiredError';
  }
}

/** Online lobby: only the host is created; partners join via invite. Offline: full crew. */
export function resolveCreateCrew(crew: NewRunPlayer[], online: boolean): NewRunPlayer[] {
  if (online) return crew.slice(0, 1);
  return crew;
}

/** Lowest free slot in `0 .. MAX_PLAYERS-1`, or `MAX_PLAYERS` when full. */
export function nextPlayerSlot(players: Pick<NuzPlayerRow, 'slot'>[]): number {
  const taken = new Set(players.map((p) => p.slot));
  for (let s = 0; s < MAX_PLAYERS; s++) if (!taken.has(s)) return s;
  return MAX_PLAYERS;
}

/* Insert the run row, re-minting the invite code when the unique index
 * rejects it. Without the retry a collision downgraded the run to offline. */
async function insertRunWithFreshInvite(
  baseRun: NuzRunRow,
): Promise<{ invite: string | null; error: { message: string } | null }> {
  let last: { code?: string; message: string } | null = null;
  for (let attempt = 0; attempt < 5; attempt++) {
    const invite = mintInviteCode();
    const { error } = await nuzTables.runs().insert({ ...baseRun, invite_code: invite });
    if (!error) return { invite, error: null };
    last = error;
    if (error.code !== PG_UNIQUE_VIOLATION) break;
  }
  return { invite: null, error: last };
}

export async function createRun(cfg: NewRunConfig): Promise<CreatedRun> {
  const wantOnline = cfg.online && isMultiCapable();
  /* Every run — solo included — belongs to an account: the DB row is the
   * source of truth, localStorage only mirrors it. Without an account a run
   * would be stuck on one browser. */
  if (!getAuthUser()) {
    pushToast('info', i18n.t(wantOnline ? 'nuz.toast.loginRequiredOnline' : 'nuz.toast.loginRequiredRun'));
    throw new NuzLoginRequiredError();
  }

  const id = uuid();
  const now = new Date().toISOString();
  /* Open Lobby: online create inserts only the host — no placeholder crew in DB. */
  const crew = resolveCreateCrew(cfg.players, wantOnline);
  const players: NuzPlayerRow[] = crew.map((p, i) => ({
    id: uuid(),
    run_id: id,
    name: p.name.trim() || `PLAYER ${i + 1}`,
    color: p.color,
    slot: i,
    created_at: now,
  }));
  const baseRun: NuzRunRow = {
    id,
    invite_code: null,
    name: cfg.name.trim(),
    game: cfg.game,
    region: cfg.region,
    rules: { ...cfg.rules },
    status: 'active',
    created_at: now,
  };

  let mode: RunMode = 'solo';
  let invite: string | null = null;
  let offlineFallback = false;
  let cloudBacked = false;

  if (wantOnline) {
    /* the insert policy requires an identity; the DB trigger then records
     * this session as the run's owner */
    await ensureRunIdentity();
    const inserted = await insertRunWithFreshInvite(baseRun);
    invite = inserted.invite;
    const { error: plErr } = inserted.error ? { error: inserted.error } : await nuzTables.players().insert(players);
    if (!plErr && invite) {
      mode = 'multi';
      baseRun.invite_code = invite;
      linkRunToAccount(id, 'owner');
      registerAccountRun(id);
      cloudBacked = true;
    } else {
      offlineFallback = true;
      pushToast('sync', i18n.t('nuz.toast.offlineSaved'));
    }
  } else if (getAuthUser() && isMultiCapable()) {
    const { error: runErr } = await nuzTables.runs().insert({ ...baseRun, invite_code: null });
    if (!runErr) {
      const { error: plErr } = await nuzTables.players().insert(players);
      if (!plErr) {
        linkRunToAccount(id, 'owner');
        registerAccountRun(id);
        cloudBacked = true;
      } else {
        await nuzTables.runs().delete().eq('id', id);
        pushToast('sync', i18n.t('nuz.toast.cloudPlayerFailed'));
      }
    }
  }

  const state: RunState = { run: baseRun, mode, players, encounters: [] };
  saveLocalRun(state);
  setRunOwner(id);
  setMembership(id, players[0].id);
  const entry = ensureEntry(id);
  entry.state = state;
  entry.phase = 'ready';
  entry.status = cloudBacked ? 'connecting' : 'local';
  seedFeed(entry);
  if (cloudBacked) goLive(entry);
  void import('./nuzlocke-linked-teams')
    .then((m) => {
      m.ensureLinkedTeams(state);
    })
    .catch((err) => console.warn('[nuzlocke] linked team init failed', err));
  emit(entry);
  notifyHub();
  return { state, inviteCode: invite, offlineFallback };
}

export interface JoinLookup {
  run: NuzRunRow;
  players: NuzPlayerRow[];
}

export async function lookupByCode(code: string): Promise<JoinLookup | null> {
  if (!isMultiCapable()) return null;
  if (!getAuthUser()) {
    pushToast('info', i18n.t('nuz.toast.loginRequiredJoin'));
    return null;
  }
  /* tolerate whitespace pasted along with the code */
  const clean = code.replace(/\s+/g, '').toUpperCase();
  if (!clean) return null;

  /* The invite code is the credential, so redeeming it happens server-side:
   * nuz_join_by_code records the membership and hands back the run. Reading
   * nuz_runs directly cannot work once rows are membership-scoped — an
   * outsider must not be able to filter by invite_code at all. */
  await ensureRunIdentity();
  if (!membershipRpcsMissing) {
    try {
      const { data, error } = await supabase.rpc('nuz_join_by_code', { p_code: clean });
      if (!error) {
        if (!data) return null;
        const payload = data as { run: NuzRunRow; players: NuzPlayerRow[] } | null;
        if (!payload?.run) return null;
        accessClaimed.add(payload.run.id);
        return {
          run: { ...payload.run, rules: normalizeRules(payload.run.rules as Partial<NuzRules>) },
          players: payload.players ?? [],
        };
      }
      if (error.code === PG_MISSING_FUNCTION) membershipRpcsMissing = true;
      /* any other error is a genuine failure, not a reason to fall back */
      else return null;
    } catch {
      /* fall through to the pre-migration path */
    }
  }

  /* legacy path — DB without the RLS migration */
  try {
    const { data, error } = await nuzTables.runs().select('*').eq('invite_code', clean).maybeSingle();
    if (error || !data) return null;
    const { data: players } = await nuzTables.players().select('*').eq('run_id', data.id).order('slot');
    const row = data as NuzRunRow;
    return {
      run: { ...row, rules: normalizeRules(row.rules as Partial<NuzRules>) },
      players: (players ?? []) as NuzPlayerRow[],
    };
  } catch {
    return null;
  }
}

/** Join a looked-up run as a new player (nuzlocke.md §1.4). Open Lobby: always a new slot. */
export async function joinRun(lookup: JoinLookup, name: string, color: string): Promise<RunState | null> {
  if (!getAuthUser()) {
    pushToast('info', i18n.t('nuz.toast.loginRequiredJoin'));
    return null;
  }
  if (lookup.players.length >= MAX_PLAYERS) return null;
  const taken = new Set(lookup.players.map((p) => p.color));
  const finalColor = taken.has(color) ? (PLAYER_COLORS.find((c) => !taken.has(c)) ?? color) : color;
  let snapshot = [...lookup.players];
  let player: NuzPlayerRow | null = null;
  for (let attempt = 0; attempt < 5; attempt++) {
    if (snapshot.length >= MAX_PLAYERS) return null;
    const slot = nextPlayerSlot(snapshot);
    if (slot >= MAX_PLAYERS) return null;
    player = {
      id: uuid(),
      run_id: lookup.run.id,
      name: name.trim() || `PLAYER ${slot + 1}`,
      color: finalColor,
      slot,
      created_at: new Date().toISOString(),
    };
    const { error } = await nuzTables.players().insert(player);
    if (!error) break;
    player = null;
    if (!isUniqueViolation(error)) return null;
    const { data } = await nuzTables.players().select('*').eq('run_id', lookup.run.id).order('slot');
    snapshot = (data ?? snapshot) as NuzPlayerRow[];
  }
  if (!player) return null;
  linkRunToAccount(lookup.run.id, 'member');
  const state: RunState = {
    run: lookup.run,
    mode: 'multi',
    players: [...snapshot.filter((p) => p.id !== player!.id), player],
    encounters: [],
  };
  saveLocalRun(state);
  setMembership(lookup.run.id, player.id);
  const entry = ensureEntry(lookup.run.id);
  entry.state = state;
  entry.phase = 'ready';
  seedFeed(entry);
  void import('./nuzlocke-linked-teams')
    .then((m) => m.ensureLinkedTeams(state))
    .catch((err) => console.warn('[nuzlocke] linked team init failed', err));
  void refreshRemote(entry).then(() => {
    goLive(entry);
    if (entry.state) scheduleLinkedSync(entry.state);
  });
  emit(entry);
  notifyHub();
  return state;
}

/** Solo → multi upgrade (nuzlocke.md §0.2 "Go online"). */
export async function goOnline(runId: string): Promise<boolean> {
  const entry = ensureEntry(runId);
  const s = entry.state;
  if (!s) return false;
  if (s.mode === 'multi') return true;
  if (!isMultiCapable()) return false;
  if (!getAuthUser()) {
    pushToast('info', i18n.t('nuz.toast.loginRequiredOnline'));
    return false;
  }
  /* covers both cases: a brand-new online run (identity for the insert
   * policy) and a run that already carries a code from an earlier attempt
   * (membership for the update policy) */
  await ensureRunAccess(s.run);
  /* an already-issued code stays valid; a freshly minted one is re-rolled if
   * the unique index rejects it */
  const existing = s.run.invite_code;
  let runRow = { ...s.run, invite_code: existing ?? mintInviteCode() };
  let rErr = (await nuzTables.runs().upsert(runRow)).error;
  for (let attempt = 0; !existing && rErr?.code === PG_UNIQUE_VIOLATION && attempt < 4; attempt++) {
    runRow = { ...s.run, invite_code: mintInviteCode() };
    rErr = (await nuzTables.runs().upsert(runRow)).error;
  }
  if (rErr) {
    pushToast('sync', i18n.t('nuz.toast.retryingSync'));
    return false;
  }
  const invite = runRow.invite_code;
  if (s.players.length > 0) {
    const { error: pErr } = await nuzTables.players().upsert(s.players);
    if (pErr) {
      pushToast('sync', i18n.t('nuz.toast.goOnlineFailed'));
      return false;
    }
  }
  if (s.encounters.length > 0) {
    const uploaded = await uploadEncountersForGoOnline(s.encounters);
    if (!uploaded) {
      pushToast('sync', i18n.t('nuz.toast.goOnlineFailed'));
      return false;
    }
  }
  s.mode = 'multi';
  s.run = runRow;
  saveLocalRun(s);
  entry.status = 'connecting';
  goLive(entry);
  emit(entry);
  pushToast('success', i18n.t('nuz.toast.onlineInvite', { code: invite }));
  return true;
}

/* ---------- actions: encounters ---------- */

export interface LogDraft {
  playerId: string;
  routeKey: string;
  pokemonId: number;
  nickname: string | null;
  level: number;
  status: NuzEncounterStatus;
  note?: string | null;
  /** shiny catch — may bypass dupes clause when shiny rule is on */
  isShiny?: boolean;
  /** logged via full-dex override (not from route table) */
  offRoute?: boolean;
}

export interface LogResult {
  ok: boolean;
  error?: LogValidationError;
  encounter?: NuzEncounterRow;
  linkedWith?: NuzEncounterRow | null;
}

/** The encounter that resolves (player, route) — duped/shiny rows leave the slot open. */
export function encounterAt(state: RunState, playerId: string, routeKey: string): NuzEncounterRow | undefined {
  return state.encounters.find((e) => e.player_id === playerId && e.route_key === routeKey && isSlotConsuming(e));
}

export async function logEncounter(runId: string, draft: LogDraft): Promise<LogResult> {
  const entry = ensureEntry(runId);
  const s = entry.state;
  if (!s) return { ok: false };
  ensurePartyFlags(s);
  const region = regionForRun(s.run.region, s.run.game);
  const node = region ? nodeIndex(region).get(draft.routeKey) : undefined;
  const violation = await validateLogDraft(s, draft, node);
  if (violation) return { ok: false, error: violation };

  const enc: NuzEncounterRow = {
    id: uuid(),
    run_id: runId,
    player_id: draft.playerId,
    route_key: draft.routeKey,
    pokemon_id: draft.pokemonId,
    caught_pokemon_id: draft.pokemonId,
    nickname: draft.nickname?.trim() ? draft.nickname.trim() : null,
    level: draft.level,
    status: draft.status,
    note: draft.note ?? null,
    is_shiny: !!draft.isShiny,
    /* auto-join party while there is a free slot (mirrors the old derived rule) */
    in_party: draft.status === 'caught' && partyOf(s, draft.playerId).length < 6,
    created_at: new Date().toISOString(),
  };

  /* SoulLink route lock: the linked partner missed this route — a catch
   * logged now is link-lost from the start (never enters the party). */
  if (enc.status === 'caught' && isRouteLinkLocked(s, draft.playerId, draft.routeKey)) {
    enc.status = 'lost';
    enc.in_party = false;
  }

  const before = soulLinkGroupsOf(s).length;
  s.encounters = [...s.encounters, enc];
  saveLocalRun(s);
  pushFeed(entry, encounterFeedEvent(s, enc, false));
  const after = soulLinkGroupsOf(s).length;
  const linkedWith = after > before || isLinked(s, enc.id) ? linkPartnerOf(s, enc.id) : null;
  if (after > before) announceLink(entry, s, enc);
  let cascadePartners: NuzEncounterRow[] = [];
  if (enc.status === 'dead') cascadePartners = checkCascade(entry, enc);
  if (enc.status === 'missed') cascadePartners = checkMissCascade(entry, enc);
  if (enc.status === 'lost' && draft.status === 'caught') {
    pushToast('info', i18n.t('nuz.toast.linkLost', { name: enc.nickname ?? speciesNamer(enc.pokemon_id) }));
  }
  checkMilestones(entry);

  if (isCloudRun(s)) {
    persistWithRetry(
      entry,
      enc.id,
      async () => {
        const res = await nuzTables.encounters().insert(enc);
        /* unique-violation on the route slot (multi-client race): adopt the
         * server row instead of staying pendingSync forever (audit P0-5) */
        if (res.error && isUniqueViolation(res.error) && (await reconcileRouteConflict(entry, enc))) {
          /* drop any optimistic SoulLink cascade speculation for the lost insert */
          void refreshRemote(entry);
          return { error: null };
        }
        if (!res.error) {
          /* our insert landed — Dupes TOCTOU interim re-scan (§1.3) */
          void reconcileEvoLineDupes(entry, enc);
          /* the row now exists server-side, so the SoulLink cascade for a
           * directly-logged dead/missed encounter can go through the same
           * single-TX RPC as the interactive mark-dead/missed flow */
          if (cascadePartners.length > 0) {
            persistStatusRpc(entry, [enc, ...cascadePartners], {
              p_encounter_id: enc.id,
              p_new_status: enc.status,
              p_note: enc.note,
            });
          }
        }
        return res;
      },
      { snapshot: enc, kind: 'insert' },
    );
  }
  scheduleLinkedSync(s, enc.player_id);
  emit(entry);
  return { ok: true, encounter: enc, linkedWith };
}

/* ---------- insert conflict reconcile (unique route slot) ---------- */

function isUniqueViolation(error: unknown): boolean {
  return !!error && typeof error === 'object' && (error as { code?: string }).code === '23505';
}

/** goOnline cannot target the partial unique index via upsert — insert each
 * row and treat 23505 as "already on the server" (PK or slot). */
async function uploadEncountersForGoOnline(rows: NuzEncounterRow[]): Promise<boolean> {
  const up = await nuzTables.encounters().upsert(rows);
  if (!up.error) return true;
  for (const enc of rows) {
    const res = await nuzTables.encounters().insert(enc);
    if (!res.error) continue;
    if (isUniqueViolation(res.error)) {
      /* already present — do not fail the upgrade */
      continue;
    }
    return false;
  }
  return true;
}

/** Our insert lost the race: fetch the winning server row and replace the
 * local mirror with it. Returns false when no slot-consuming row exists. */
async function reconcileRouteConflict(entry: RunEntry, enc: NuzEncounterRow): Promise<boolean> {
  const s = entry.state;
  if (!s) return false;
  try {
    const { data, error } = await nuzTables
      .encounters()
      .select('*')
      .eq('run_id', enc.run_id)
      .eq('player_id', enc.player_id)
      .eq('route_key', enc.route_key)
      .order('created_at');
    if (error) return false;
    const winner = ((data ?? []) as NuzEncounterRow[]).find((r) => r.id !== enc.id && isSlotConsuming(r));
    if (!winner) return false;
    s.encounters = s.encounters.filter((e) => e.id !== enc.id);
    applyRemoteEncounter(entry, winner);
    pushToast('sync', i18n.t('nuz.toast.routeConflict'));
    return true;
  } catch {
    return false;
  }
}

export interface UpdateResult {
  ok: boolean;
  /** @deprecated use cascadePartners — kept as first living mate for older callers */
  cascadePartner?: NuzEncounterRow | null;
  /** every SoulLink mate the cascade already touched (dead/lost or boxed) —
   * informational for feed/UI only; cascade is auto-applied, no confirm
   * step required to see this effect (concurrency plan §2.1). */
  cascadePartners?: NuzEncounterRow[];
}

/** Mark dead / mark missed / restore / edit nickname / note (§2.5–2.7 flows).
 * `fromCascade`: reserved for callers that already resolved the whole
 * SoulLink group themselves — skips nested cascade discovery. Nothing in
 * this codebase needs to pass it anymore (cascades are auto-applied inside
 * `checkCascade`/`checkMissCascade` themselves), it stays as a defensive
 * guard against double-processing. */
export function updateEncounter(
  runId: string,
  encId: string,
  patch: Partial<Pick<NuzEncounterRow, 'status' | 'note' | 'nickname' | 'level' | 'pokemon_id'>>,
  opts?: { fromCascade?: boolean },
): UpdateResult {
  const entry = ensureEntry(runId);
  const s = entry.state;
  const enc = s?.encounters.find((e) => e.id === encId);
  if (!s || !enc) return { ok: false };
  if (patch.nickname !== undefined && s.run.rules.nicknames && !String(patch.nickname ?? '').trim()) {
    return { ok: false };
  }
  const prevStatus = enc.status;
  /* leaving the living world frees the party slot (persisted too) */
  const freesSlot = Boolean(patch.status && patch.status !== 'caught');
  if (freesSlot) enc.in_party = false;
  Object.assign(enc, patch);
  const persistedPatch = freesSlot ? { ...patch, in_party: false } : patch;
  saveLocalRun(s);
  let cascadePartners: NuzEncounterRow[] = [];
  const isStatusChange = Boolean(patch.status && patch.status !== prevStatus);
  if (isStatusChange) {
    pushFeed(entry, encounterFeedEvent(s, enc, false));
    if (patch.status === 'dead') {
      entry.restoreGuard.delete(enc.id);
      if (!opts?.fromCascade && s.run.rules.soulLink) cascadePartners = checkCascade(entry, enc);
      if (s.run.rules.releaseOnDeath) {
        pushToast('info', i18n.t('nuz.toast.releaseRule', { name: enc.nickname ?? speciesNamer(enc.pokemon_id) }));
      }
    } else if (patch.status === 'missed') {
      if (!opts?.fromCascade) cascadePartners = checkMissCascade(entry, enc);
    } else if (patch.status === 'caught') {
      cascadePartners = checkRestoreCascade(entry, enc, prevStatus);
      entry.restoreGuard.set(enc.id, Date.now());
      /* restore may re-open an evo-line dupes race (§1.3) */
      void reconcileEvoLineDupes(entry, enc);
    }
  }
  if (isCloudRun(s)) {
    if (isStatusChange) {
      /* single-TX RPC: this row's status/note + every SoulLink partner the
       * local cascade above touched apply server-side in one transaction —
       * a remote client can never observe the primary fallen without its
       * linked partner (or vice versa). Replaces the old bare PATCH + N
       * separate partner PATCHes (concurrency plan §2.2). */
      persistStatusRpc(entry, [enc, ...cascadePartners], {
        p_encounter_id: enc.id,
        p_new_status: enc.status,
        p_note: patch.note ?? null,
        p_client_op_id: uuid(),
      });
    } else {
      persistWithRetry(
        entry,
        enc.id,
        () => nuzTables.encounters().update(persistedPatch).eq('id', enc.id),
        { snapshot: enc, kind: 'patch' },
      );
    }
  }
  scheduleLinkedSync(s, enc.player_id);
  emit(entry);
  return {
    ok: true,
    cascadePartners,
    cascadePartner: cascadePartners[0] ?? null,
  };
}

/** Change current form; Timeline keeps `caught_pokemon_id`. */
export async function evolveEncounter(
  runId: string,
  encId: string,
  toPokemonId: number,
): Promise<{ ok: boolean; error?: 'missing' | 'invalid' | 'chain' }> {
  const entry = ensureEntry(runId);
  const s = entry.state;
  const enc = s?.encounters.find((e) => e.id === encId);
  if (!s || !enc) return { ok: false, error: 'missing' };
  if (enc.status !== 'caught') return { ok: false, error: 'invalid' };
  const normalized = normalizeEncounter(enc);
  const caughtId = normalized.caught_pokemon_id ?? normalized.pokemon_id;
  try {
    const chainIds = await fetchEvolutionChainIds(caughtId);
    if (!isValidEvolutionTarget(chainIds, caughtId, normalized.pokemon_id, toPokemonId)) {
      return { ok: false, error: 'chain' };
    }
  } catch {
    return { ok: false, error: 'chain' };
  }
  /* mutate + persist directly (single PATCH) instead of delegating to
   * updateEncounter — that used to fire its OWN patch({ pokemon_id }) and
   * then a second patch({ pokemon_id, caught_pokemon_id }) right after for
   * the same row, i.e. two network writes for one evolution (concurrency
   * plan §2.4 cleanup). */
  const nextCaughtId =
    typeof enc.caught_pokemon_id === 'number' && enc.caught_pokemon_id > 0 ? enc.caught_pokemon_id : caughtId;
  enc.pokemon_id = toPokemonId;
  enc.caught_pokemon_id = nextCaughtId;
  saveLocalRun(s);
  if (isCloudRun(s)) {
    persistWithRetry(
      entry,
      enc.id,
      () =>
        nuzTables
          .encounters()
          .update({ pokemon_id: toPokemonId, caught_pokemon_id: nextCaughtId })
          .eq('id', enc.id),
      { snapshot: enc, kind: 'patch' },
    );
  }
  pushFeed(entry, {
    kind: 'catch',
    color: '#F6C945',
    title: i18n.t('nuz.feed.evolved', {
      name: enc.nickname ?? speciesNamer(toPokemonId),
    }),
    meta: routeLabelOf(s.run, enc.route_key),
  });
  scheduleLinkedSync(s, enc.player_id);
  return { ok: true };
}

/* ---------- actions: party management (drag & drop / menu) ---------- */

export interface PartyMoveResult {
  ok: boolean;
  /** 'full' → target party already has 6 · 'wrong-state' → only living catches can move */
  reason?: 'full' | 'wrong-state';
}

/** Move a living catch into the party (inParty=true) or into the box (false). */
export function setEncounterParty(runId: string, encId: string, inParty: boolean): PartyMoveResult {
  const entry = ensureEntry(runId);
  const s = entry.state;
  const enc = s?.encounters.find((e) => e.id === encId);
  if (!s || !enc) return { ok: false };
  if (enc.status !== 'caught') return { ok: false, reason: 'wrong-state' };
  ensurePartyFlags(s);
  if (inParty && !enc.in_party && partyOf(s, enc.player_id).length >= 6) {
    return { ok: false, reason: 'full' };
  }
  if (Boolean(enc.in_party) === inParty) return { ok: true };
  enc.in_party = inParty;
  saveLocalRun(s);
  /* box-link (§A1): boxing this catch also boxes its SoulLink partners.
   * Unboxing never pulls a partner along (their party slot may be full). */
  const boxedPartners = inParty ? [] : boxLinkPartners(entry, enc);
  if (isCloudRun(s)) {
    persistWithRetry(
      entry,
      enc.id,
      () => nuzTables.encounters().update({ in_party: inParty }).eq('id', enc.id),
      { snapshot: enc, kind: 'patch' },
    );
    for (const partner of boxedPartners) {
      persistWithRetry(
        entry,
        partner.id,
        () => nuzTables.encounters().update({ in_party: false }).eq('id', partner.id),
        { snapshot: partner, kind: 'patch' },
      );
    }
  }
  scheduleLinkedSync(s, enc.player_id);
  emit(entry);
  return { ok: true };
}

/** Swap party membership of two living catches (box → party onto a full slot). */
export function swapParty(runId: string, boxEncId: string, partyEncId: string): PartyMoveResult {
  const entry = ensureEntry(runId);
  const s = entry.state;
  const a = s?.encounters.find((e) => e.id === boxEncId);
  const b = s?.encounters.find((e) => e.id === partyEncId);
  if (!s || !a || !b) return { ok: false };
  if (a.status !== 'caught' || b.status !== 'caught') return { ok: false, reason: 'wrong-state' };
  if (a.player_id !== b.player_id) return { ok: false };
  ensurePartyFlags(s);
  a.in_party = true;
  b.in_party = false;
  saveLocalRun(s);
  /* box-link (§A1): `b` just got boxed by this swap, so its SoulLink
   * partners get boxed too (the incoming `a` is not affected). */
  const boxedPartners = boxLinkPartners(entry, b);
  if (isCloudRun(s)) {
    persistWithRetry(entry, a.id, () => nuzTables.encounters().update({ in_party: true }).eq('id', a.id), {
      snapshot: a,
      kind: 'patch',
    });
    persistWithRetry(entry, b.id, () => nuzTables.encounters().update({ in_party: false }).eq('id', b.id), {
      snapshot: b,
      kind: 'patch',
    });
    for (const partner of boxedPartners) {
      persistWithRetry(
        entry,
        partner.id,
        () => nuzTables.encounters().update({ in_party: false }).eq('id', partner.id),
        { snapshot: partner, kind: 'patch' },
      );
    }
  }
  scheduleLinkedSync(s, a.player_id);
  emit(entry);
  return { ok: true };
}

export function deleteEncounter(runId: string, encId: string): void {
  const entry = ensureEntry(runId);
  const s = entry.state;
  if (!s) return;
  const removed = s.encounters.find((e) => e.id === encId);
  s.encounters = s.encounters.filter((e) => e.id !== encId);
  saveLocalRun(s);
  if (isCloudRun(s) && removed) {
    persistWithRetry(entry, encId, () => nuzTables.encounters().delete().eq('id', encId), {
      snapshot: removed,
      kind: 'delete',
    });
  }
  if (removed) scheduleLinkedSync(s, removed.player_id);
  emit(entry);
}

/* ---------- actions: run-level ---------- */

export function renameRun(runId: string, name: string): void {
  const entry = ensureEntry(runId);
  const s = entry.state;
  if (!s || !name.trim()) return;
  s.run.name = name.trim();
  saveLocalRun(s);
  if (isCloudRun(s)) {
    persistWithRetry(entry, `run:${runId}`, () => nuzTables.runs().update({ name: s.run.name }).eq('id', runId));
  }
  scheduleLinkedSync(s);
  emit(entry);
}

/** Rename own trainer only — membership-scoped; never another player's slot. */
export function renamePlayer(runId: string, playerId: string, name: string): boolean {
  const entry = ensureEntry(runId);
  const s = entry.state;
  const trimmed = name.trim();
  if (!s || !trimmed) return false;
  if (myPlayerId(runId) !== playerId) return false;
  const player = s.players.find((p) => p.id === playerId);
  if (!player) return false;
  player.name = trimmed.slice(0, 18);
  saveLocalRun(s);
  if (isCloudRun(s)) {
    persistWithRetry(entry, `player:${playerId}`, () =>
      nuzTables.players().update({ name: player.name }).eq('id', playerId).eq('run_id', runId),
    );
  }
  scheduleLinkedSync(s);
  emit(entry);
  return true;
}

export function setRunRules(runId: string, rules: Partial<NuzRules>): void {
  const entry = ensureEntry(runId);
  const s = entry.state;
  if (!s) return;
  const prev = s.run.rules;
  const next = normalizeRules({ ...prev, ...rules });
  s.run.rules = next;
  saveLocalRun(s);
  pushFeed(entry, { kind: 'rule', color: '#F6C945', title: i18n.t('nuz.feed.rulesUpdated'), meta: rulesSummary(s.run.rules) });
  if (isCloudRun(s)) {
    persistWithRetry(entry, `run:${runId}`, () => nuzTables.runs().update({ rules: s.run.rules }).eq('id', runId));
  }
  /* Tightening Dupes (dead/encounter claims) may invalidate living catches
   * that were legal under the previous rules — re-scan like a TOCTOU heal. */
  const dupesTightened =
    (!prev.dupes && next.dupes) ||
    (!prev.dupesDead && next.dupesDead) ||
    (!prev.dupesEncounter && next.dupesEncounter);
  if (dupesTightened) void reconcileEvoLineDupes(entry);
  emit(entry);
}

function rulesSummary(r: NuzRules): string {
  const bits = [
    i18n.t(r.dupes ? 'nuz.feed.dupesOn' : 'nuz.feed.dupesOff'),
    i18n.t(r.shiny ? 'nuz.feed.shinyOn' : 'nuz.feed.shinyOff'),
  ];
  if (r.dupes && r.dupesDead) bits.push(i18n.t('nuz.feed.dupesDeadOn'));
  if (r.dupes && r.dupesEncounter) bits.push(i18n.t('nuz.feed.dupesEncounterOn'));
  if (r.soulLink) bits.push(i18n.t('nuz.feed.soulLinkOn'));
  if (r.randomizer) bits.push(i18n.t('nuz.feed.randomizerOn'));
  return bits.join(' · ');
}

export function exportRunSummary(state: RunState, opts: Parameters<typeof formatRunSummary>[1]): string {
  return formatRunSummary(state, opts);
}

export function setRunStatus(runId: string, status: NuzRunStatus): void {
  const entry = ensureEntry(runId);
  const s = entry.state;
  if (!s) return;
  s.run.status = status;
  saveLocalRun(s);
  pushFeed(entry, {
    kind: 'status',
    color: status === 'complete' ? '#F6C945' : '#5E6680',
    title:
      status === 'complete'
        ? i18n.t('nuz.feed.statusComplete')
        : status === 'failed'
          ? i18n.t('nuz.feed.statusFailed')
          : i18n.t('nuz.feed.statusActive'),
  });
  checkMilestones(entry);
  if (isCloudRun(s)) {
    persistWithRetry(entry, `run:${runId}`, () => nuzTables.runs().update({ status }).eq('id', runId));
  }
  emit(entry);
}

/** Archive = hide from the active hub; payload stays on device (restorable). */
export function archiveRun(runId: string): void {
  writeRunIndex(readRunIndex().filter((id) => id !== runId));
  writeArchivedIndex([runId, ...readArchivedIndex().filter((id) => id !== runId)]);
  accountRunIds.delete(runId);
  /* multi realtime can keep running if the page is still open; hub just hides it */
  const entry = entries.get(runId);
  if (entry?.state && isCloudRun(entry.state)) dropLive(entry);
  void syncMembershipArchived(runId, true);
  notifyHub();
}

/** Move an archived run back into the active hub. */
export function restoreRun(runId: string): void {
  if (!loadLocalRun(runId) && !entries.get(runId)?.state) return;
  writeArchivedIndex(readArchivedIndex().filter((id) => id !== runId));
  addToIndex(runId);
  if (isAccountLinkedRun(runId)) accountRunIds.add(runId);
  const entry = ensureEntry(runId);
  if (entry.state) scheduleLinkedSync(entry.state);
  void syncMembershipArchived(runId, false);
  notifyHub();
}

function clearLocalRunMeta(runId: string): void {
  const members = { ...getMemberships() };
  if (runId in members) {
    delete members[runId];
    if (!writeJson(LS_MEMBERS, members)) notifyStorageFailure();
  }
  const owners = readJson<string[]>(LS_OWNERS, []).filter((id) => id !== runId);
  if (!writeJson(LS_OWNERS, owners)) notifyStorageFailure();
}

/** Drop local mirror only — no server rows, no cloud solo delete (lost membership). */
function purgeLocalRunMirror(runId: string): void {
  writeRunIndex(readRunIndex().filter((id) => id !== runId));
  writeArchivedIndex(readArchivedIndex().filter((id) => id !== runId));
  removeLocalKey(LS_RUN(runId));
  clearLocalRunMeta(runId);
  const entry = entries.get(runId);
  if (entry) {
    dropLive(entry);
    entry.state = null;
    entry.phase = 'missing';
    emit(entry);
    entries.delete(runId);
  }
}

/** Permanent delete on this device (+ cloud when account-linked). */
export function deleteRunForever(runId: string): void {
  purgeLocalRunMirror(runId);
  tombstoneAccountRun(runId);
  writePersistedAccountRunIds([...readPersistedAccountRunIds()].filter((id) => id !== runId));
  accountRunIds.delete(runId);
  const user = getAuthUser();
  if (user) void remoteDeleteRunForever(runId);
  else
    void import('./cloud-sync')
      .then((m) => m.cloudDeleteSoloRun(runId))
      .catch((err) => console.warn('[nuzlocke] cloud delete failed', err));
  void import('./nuzlocke-linked-teams')
    .then((m) => m.deleteLinkedTeamsForRun(runId))
    .catch((err) => console.warn('[nuzlocke] linked team cleanup failed', err));
  notifyHub();
}

export async function duplicateAsSolo(runId: string): Promise<string | null> {
  /* Same gate as createRun — a copy is a new run and must belong to an account. */
  if (!getAuthUser()) {
    pushToast('info', i18n.t('nuz.toast.loginRequiredRun'));
    return null;
  }
  const src = loadLocalRun(runId) ?? entries.get(runId)?.state ?? null;
  if (!src) return null;
  const id = uuid();
  const now = new Date().toISOString();
  const playerMap = new Map<string, string>();
  const players = src.players.map((p) => {
    const nid = uuid();
    playerMap.set(p.id, nid);
    return { ...p, id: nid, run_id: id, created_at: now };
  });
  const encounterMap = new Map<string, string>();
  const encounters = src.encounters.map((e) => {
    const nid = uuid();
    encounterMap.set(e.id, nid);
    return {
      ...normalizeEncounter(e),
      id: nid,
      run_id: id,
      player_id: playerMap.get(e.player_id) ?? e.player_id,
      created_at: now,
    };
  });
  const state: RunState = {
    run: { ...src.run, id, invite_code: null, name: `${src.run.name} (COPY)`, created_at: now },
    mode: 'solo',
    players,
    encounters,
  };
  saveLocalRun(state);
  setRunOwner(id);
  if (players[0]) setMembership(id, players[0].id);
  if (getAuthUser() && isMultiCapable()) {
    const { error: runErr } = await nuzTables.runs().insert({ ...state.run, invite_code: null });
    if (!runErr) {
      const { error: plErr } = await nuzTables.players().insert(players);
      if (plErr) {
        await nuzTables.runs().delete().eq('id', id);
        pushToast('sync', i18n.t('nuz.toast.cloudPlayerFailed'));
      } else {
        if (encounters.length > 0) {
          const { error: encErr } = await nuzTables.encounters().insert(encounters);
          if (encErr) {
            for (const e of encounters) {
              const res = await nuzTables.encounters().insert(e);
              if (res.error && !isUniqueViolation(res.error)) break;
            }
          }
        }
        linkRunToAccount(id, 'owner');
      }
    }
  }
  void import('./nuzlocke-linked-teams')
    .then((m) => {
      m.cloneLinkedTeamsForDuplicate(src.run.id, state, playerMap, encounterMap);
    })
    .catch((err) => console.warn('[nuzlocke] linked team clone failed', err));
  notifyHub();
  return id;
}

/* ---------- hub (runs list) ---------- */

const hubListeners = new Set<() => void>();
let hubLoaded = false;

/** Run ids discovered via nuz_run_members for the logged-in account. */
const accountRunIds = new Set<string>();
let accountWatchUserId: string | null = null;
let accountChannel: RealtimeChannel | null = null;
let accountSyncInFlight: Promise<void> | null = null;
let accountSyncNeedsFollowUp = false;

function hubRunIds(): string[] {
  const merged = [...new Set([...readRunIndex(), ...accountRunIds])];
  /* Before auth resolves, don't guest-filter — callers should treat the hub
   * as loading so we never flash "logged out" for a signed-in session. */
  if (!isAuthReady() || getAuthUser()) return merged;
  return merged.filter(isHubVisibleWhileLoggedOut);
}

function hubArchivedIds(): string[] {
  const archived = readArchivedIndex();
  if (!isAuthReady() || getAuthUser()) return archived;
  return archived.filter(isHubVisibleWhileLoggedOut);
}

/** Merged active hub ids (localStorage index + account discovery). */
export function getHubRunIds(): string[] {
  return hubRunIds();
}

function dropAccountWatch(): void {
  if (accountChannel) {
    dropChannel(accountChannel);
    accountChannel = null;
  }
  accountWatchUserId = null;
}

/** Tear down account-level realtime (logout). */
export function stopAccountRunsWatch(): void {
  dropAccountWatch();
  accountRunIds.clear();
  notifyHub();
}

async function performAccountSync(userId: string): Promise<void> {
  const prevKnown = new Set([...accountRunIds, ...readPersistedAccountRunIds()]);
  const purged = readAccountPurgedIds();

  const { data, error } = await supabase
    .from('nuz_run_members')
    .select('run_id, archived, role, nuz_runs(*)')
    .eq('user_id', userId);

  if (error) {
    if (isMissingColumnError(error)) {
      membersArchivedSupported = false;
      const fallback = await supabase
        .from('nuz_run_members')
        .select('run_id, role, nuz_runs(*)')
        .eq('user_id', userId);
      if (fallback.error) {
        console.warn('[nuzlocke] account sync failed', fallback.error.message);
        return;
      }
      return performAccountSyncWithRows(userId, prevKnown, purged, fallback.data ?? []);
    }
    console.warn('[nuzlocke] account sync failed', error.message);
    return;
  }

  await performAccountSyncWithRows(userId, prevKnown, purged, data ?? []);
}

async function performAccountSyncWithRows(
  _userId: string,
  prevKnown: Set<string>,
  purged: Set<string>,
  rows: unknown[],
): Promise<void> {
  const nextIds = new Set<string>();
  const nextActiveIds = new Set<string>();
  const nextArchivedIds = new Set<string>();

  for (const row of rows) {
    const runId = (row as { run_id?: string }).run_id;
    if (!runId || purged.has(runId)) continue;
    nextIds.add(runId);
    const archived = (row as { archived?: boolean }).archived === true;
    if (archived) nextArchivedIds.add(runId);
    else nextActiveIds.add(runId);
  }

  for (const id of prevKnown) {
    if (nextIds.has(id)) continue;
    tombstoneAccountRun(id);
    purgeLocalRunMirror(id);
  }
  for (const id of nextIds) {
    if (!purged.has(id)) clearAccountRunTombstone(id);
  }

  syncLocalArchivedFromServer(nextArchivedIds, nextActiveIds);

  writePersistedAccountRunIds(nextIds);
  accountRunIds.clear();
  for (const id of nextActiveIds) accountRunIds.add(id);

  await Promise.all(
    [...nextIds].map(async (id) => {
      const entry = ensureEntry(id);
      await refreshRemote(entry);
    }),
  );
  notifyHub();
}

/** Fetch nuz_run_members + hydrate each run into the hub cache. */
export async function syncAccountRuns(userId: string): Promise<void> {
  const user = getAuthUser();
  if (!user || user.id !== userId || !isMultiCapable()) return;

  if (accountSyncInFlight) {
    accountSyncNeedsFollowUp = true;
    return accountSyncInFlight;
  }

  accountSyncInFlight = (async () => {
    try {
      do {
        accountSyncNeedsFollowUp = false;
        await performAccountSync(userId);
      } while (accountSyncNeedsFollowUp);
    } finally {
      accountSyncInFlight = null;
    }
  })();

  return accountSyncInFlight;
}

/** Live membership + run metadata changes for the logged-in account. */
export function watchAccountRuns(userId: string): void {
  if (!isMultiCapable()) return;
  const user = getAuthUser();
  if (!user || user.id !== userId) return;
  if (accountWatchUserId === userId && accountChannel) return;

  dropAccountWatch();
  accountWatchUserId = userId;

  const resync = (): void => {
    void syncAccountRuns(userId);
  };

  const resyncIfAccountRun = (payload: {
    eventType: string;
    new?: unknown;
    old?: Partial<{ id: string }>;
  }): void => {
    const id =
      payload.eventType === 'DELETE'
        ? payload.old?.id
        : (payload.new as Partial<{ id: string }> | undefined)?.id;
    if (!id || !accountRunIds.has(id)) return;
    resync();
  };

  const ch = supabase.channel(`account-runs:${userId}`);
  accountChannel = ch;
  ch.on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'nuz_run_members', filter: `user_id=eq.${userId}` },
    resync,
  );
  ch.on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'nuz_runs' }, resyncIfAccountRun);
  ch.on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'nuz_runs' }, resyncIfAccountRun);
  ch.subscribe();
}

function hubRefresh(): void {
  reconcileRunIndex();
  const user = getAuthUser();
  if (user) void syncAccountRuns(user.id);
  for (const id of [...hubRunIds(), ...hubArchivedIds()]) {
    const e = ensureEntry(id);
    if (e.state && isCloudRun(e.state) && !e.remoteLoaded) void refreshRemote(e).then(() => notifyHub());
  }
  notifyHub();
}

export function useHubRuns(): {
  runs: RunState[];
  archived: RunState[];
  loading: boolean;
  entries: RunEntry[];
} {
  const [, force] = useReducer((c: number) => c + 1, 0);
  const { ready: authReady, user } = useAuth();

  useEffect(() => {
    const unsubs = new Map<string, () => void>();
    function syncSubs() {
      const ids = [...hubRunIds(), ...hubArchivedIds()];
      for (const id of ids) if (!unsubs.has(id)) unsubs.set(id, subscribeRun(id, fn));
      for (const [id, u] of [...unsubs]) {
        if (!ids.includes(id)) {
          u();
          unsubs.delete(id);
        }
      }
    }
    function fn() {
      syncSubs();
      force();
    }
    hubListeners.add(fn);
    if (!hubLoaded) {
      hubLoaded = true;
      hubRefresh();
    }
    syncSubs();
    return () => {
      hubListeners.delete(fn);
      unsubs.forEach((u) => u());
    };
  }, []);

  /* Re-filter + resubscribe when auth settles (login/logout / first session). */
  useEffect(() => {
    force();
  }, [authReady, user?.id]);

  if (!authReady) {
    return { runs: [], archived: [], loading: true, entries: [] };
  }

  const list = hubRunIds()
    .map((id) => ensureEntry(id))
    .filter((e): e is RunEntry => !!e.state);
  const runs = list
    .map((e) => e.state as RunState)
    .sort((a, b) => lastActivity(b) - lastActivity(a));

  const archivedEntries = hubArchivedIds()
    .map((id) => ensureEntry(id))
    .filter((e): e is RunEntry => !!e.state);
  const archived = archivedEntries
    .map((e) => e.state as RunState)
    .sort((a, b) => lastActivity(b) - lastActivity(a));

  return {
    runs,
    archived,
    loading: list.some((e) => e.phase === 'loading'),
    entries: [...list, ...archivedEntries],
  };
}

function lastActivity(s: RunState): number {
  const last = s.encounters[s.encounters.length - 1]?.created_at ?? s.run.created_at;
  return Date.parse(last) || 0;
}

/* ---------- run hook ---------- */

export function useRunEntry(runId: string | undefined): RunEntry | null {
  const [, force] = useReducer((c: number) => c + 1, 0);
  const [entry, setEntry] = useState<RunEntry | null>(runId ? ensureEntry(runId) : null);

  useEffect(() => {
    if (!runId) return undefined;
    const e = ensureEntry(runId);
    setEntry(e);
    return subscribeRun(runId, () => force());
  }, [runId]);

  return entry;
}

/* ---------- INTEGRATION HOOK: Team Builder import (phase contract) ---------- */

export interface RunTeamMember {
  pokemon_id: number;
  nickname: string | null;
  level: number;
  status: string;
}

export interface RunTeamPlayer {
  player: string;
  color: string;
  members: RunTeamMember[];
}

/** Current alive team per player (≤6, catch order). Used by the Team Builder phase. */
export async function getRunTeam(runId: string): Promise<RunTeamPlayer[]> {
  let state: RunState | null = loadLocalRun(runId) ?? entries.get(runId)?.state ?? null;
  if ((!state || isCloudRun(state)) && isMultiCapable()) {
    try {
      const remote = await fetchRemoteRun(runId);
      if (remote) state = remote;
    } catch {
      /* fall back to local mirror */
    }
  }
  if (!state) return [];
  const s = state;
  return [...s.players]
    .sort((a, b) => a.slot - b.slot)
    .map((p) => ({
      player: p.name,
      color: p.color,
      members: partyOf(s, p.id).map((e) => ({
        pokemon_id: e.pokemon_id,
        nickname: e.nickname,
        level: e.level,
        status: e.status,
      })),
    }));
}
