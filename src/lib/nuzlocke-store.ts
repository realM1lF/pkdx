/* Pokédex 2.0 — Nuzlocke unified run store (nuzlocke.md §0)
 * Solo mode  → localStorage mirror (`pdx2.nuz.*`), instant.
 * Multi mode → Supabase Postgres + Realtime (postgres_changes + presence).
 * Identical UI in both modes. All writes optimistic; failed remote writes
 * replay with a gold `RETRYING SYNC…` toast — never red. */
import { useEffect, useReducer, useState } from 'react';
import i18n from '@/i18n';
import type { RealtimeChannel } from '@supabase/supabase-js';
import {
  dropChannel,
  isMultiCapable,
  nuzTables,
  runChannel,
} from './supabase';
import type {
  NuzEncounterRow,
  NuzEncounterStatus,
  NuzPlayerRow,
  NuzRules,
  NuzRunRow,
  NuzRunStatus,
} from './supabase';
import { nodeIndex, regionById, routeOrder } from './regions';
import type { RegionId } from './regions';
import { padNum } from './pokeapi';
import { formatRunSummary, normalizeRules, validateLogDraft } from './nuzlocke-rules';
import type { LogValidationError } from './nuzlocke-rules';
import { readLocalJson, removeLocalKey, writeLocalJson } from './storage';

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
  shiny: true,
  nicknames: true,
  soulLink: false,
  releaseOnDeath: true,
};

const LS_INDEX = 'pdx2.nuz.runs';
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

/* ---------- feed ---------- */

export type FeedKind =
  | 'catch'
  | 'death'
  | 'missed'
  | 'duped'
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

/** Recover runs whose payload exists but index entry was lost (quota race, etc.). */
function reconcileRunIndex(): void {
  const indexed = new Set(readRunIndex());
  const recovered: string[] = [];
  const prefix = 'pdx2.nuz.run.';
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key?.startsWith(prefix)) continue;
      const id = key.slice(prefix.length);
      if (id && !indexed.has(id) && loadLocalRun(id)) recovered.push(id);
    }
  } catch {
    /* ignore */
  }
  if (recovered.length) writeRunIndex([...recovered, ...readRunIndex()]);
}

export function readRunIndex(): string[] {
  return readJson<string[]>(LS_INDEX, []);
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
  return { ...s, run: { ...s.run, rules: normalizeRules(s.run.rules) } };
}

function saveLocalRun(state: RunState): void {
  if (!writeJson(LS_RUN(state.run.id), state)) notifyStorageFailure();
  else addToIndex(state.run.id);
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

function mintInviteCode(): string {
  const abc = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 3; i++) s += abc[Math.floor(Math.random() * abc.length)];
  return `SOUL-${s}`;
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
  const region = regionById(run.region);
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

/** SoulLink pairs: same route, different players, both caught (or one dead). */
export function soulLinksOf(state: RunState): SoulLink[] {
  if (!state.run.rules.soulLink) return [];
  const byRoute = new Map<string, NuzEncounterRow[]>();
  for (const e of state.encounters) {
    if (e.status !== 'caught' && e.status !== 'dead') continue;
    const list = byRoute.get(e.route_key) ?? [];
    list.push(e);
    byRoute.set(e.route_key, list);
  }
  const slotOf = (p: string) => state.players.find((pl) => pl.id === p)?.slot ?? 99;
  const links: SoulLink[] = [];
  for (const [routeKey, list] of byRoute) {
    const sorted = [...list].sort((x, y) => slotOf(x.player_id) - slotOf(y.player_id));
    for (let i = 0; i + 1 < sorted.length; i++) {
      const a = sorted[i];
      const b = sorted[i + 1];
      links.push({ routeKey, a, b, broken: a.status === 'dead' || b.status === 'dead' });
    }
  }
  return links;
}

/** The linked partner encounter, if any. */
export function linkPartnerOf(state: RunState, encId: string): NuzEncounterRow | null {
  for (const l of soulLinksOf(state)) {
    if (l.a.id === encId) return l.b;
    if (l.b.id === encId) return l.a;
  }
  return null;
}

export function isLinked(state: RunState, encId: string): boolean {
  return linkPartnerOf(state, encId) !== null;
}

/** Party membership: explicit `in_party` flag (drag & drop). Legacy runs
 * (localStorage from before the flag existed) fall back to the derived rule
 * "6 most recent alive catches = party" until the first manual move. */
function hasPartyFlags(state: RunState): boolean {
  return state.encounters.some((e) => e.in_party !== undefined);
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

/** Initialize in_party on legacy rows with the old derived rule (idempotent). */
function ensurePartyFlags(s: RunState): void {
  if (hasPartyFlags(s)) return;
  for (const p of s.players) {
    const alive = aliveOf(s, p.id);
    alive.forEach((e, i) => {
      e.in_party = i >= alive.length - 6;
    });
  }
}

export function graveyardOf(state: RunState): NuzEncounterRow[] {
  return state.encounters
    .filter((e) => e.status === 'dead')
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
  const links = soulLinksOf(state);
  const routes = new Set(state.encounters.map((e) => e.route_key));
  const region = regionById(state.run.region);
  return {
    caught: state.encounters.filter((e) => e.status === 'caught').length,
    dead: state.encounters.filter((e) => e.status === 'dead').length,
    missed: state.encounters.filter((e) => e.status === 'missed' || e.status === 'duped').length,
    links: links.length,
    routesDone: routes.size,
    routesTotal: region ? region.nodes.length : 0,
  };
}

/** First route in canonical order with any pending player slot (§2.3 marker). */
export function youAreHereKey(state: RunState): string | null {
  const region = regionById(state.run.region);
  if (!region) return null;
  const used = new Set(state.encounters.map((e) => `${e.player_id}:${e.route_key}`));
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
  /** encounter ids awaiting server ack (§2.9 latency honesty) */
  pendingSync: Set<string>;
  milestones: Set<string>;
  listeners: Set<() => void>;
  refs: number;
  channel: RealtimeChannel | null;
  remoteLoaded: boolean;
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
    milestones: new Set(),
    listeners: new Set(),
    refs: 0,
    channel: null,
    remoteLoaded: false,
    teardownTimer: null,
  };
}

function emit(entry: RunEntry): void {
  entry.listeners.forEach((fn) => fn());
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
      e.status = local.mode === 'multi' ? 'connecting' : 'local';
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
};

function encounterFeedEvent(state: RunState, enc: NuzEncounterRow, _live: boolean): FeedEvent {
  const p = state.players.find((pl) => pl.id === enc.player_id);
  const species = enc.nickname ?? speciesNamer(enc.pokemon_id);
  const kind: FeedKind = enc.status === 'caught' ? 'catch' : enc.status === 'dead' ? 'death' : enc.status === 'duped' ? 'duped' : 'missed';
  const route = routeLabelOf(state.run, enc.route_key).toUpperCase();
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
    mode: 'multi',
    players: (players ?? []) as NuzPlayerRow[],
    encounters: (encounters ?? []) as NuzEncounterRow[],
  };
}

async function refreshRemote(entry: RunEntry): Promise<void> {
  const local = entry.state;
  if (local && local.mode !== 'multi') {
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
    const remote = await fetchRemoteRun(entry.id);
    if (remote) {
      entry.state = remote;
      entry.phase = 'ready';
      saveLocalRun(remote);
      addToIndex(entry.id);
      /* authoritative re-seed — includes encounter history, not just joins */
      seedFeed(entry);
    } else if (!local) {
      entry.phase = 'missing';
    }
  } catch {
    if (!local) entry.phase = 'missing';
  }
  entry.remoteLoaded = true;
  emit(entry);
}

/* ---------- realtime (nuzlocke.md §2.9) ---------- */

function presenceMe(entry: RunEntry): { player_id: string; name: string; color: string } | null {
  const s = entry.state;
  if (!s) return null;
  const mine = myPlayerId(entry.id);
  const p = s.players.find((pl) => pl.id === mine) ?? s.players[0];
  return p ? { player_id: p.id, name: p.name, color: p.color } : null;
}

function applyRemoteEncounter(entry: RunEntry, enc: NuzEncounterRow): void {
  const s = entry.state;
  if (!s) return;
  const before = soulLinksOf(s).length;
  const idx = s.encounters.findIndex((e) => e.id === enc.id);
  const isNew = idx < 0;
  if (isNew) {
    s.encounters = [...s.encounters, enc];
    pushFeed(entry, encounterFeedEvent(s, enc, true));
  } else {
    const prev = s.encounters[idx];
    s.encounters = s.encounters.map((e) => (e.id === enc.id ? enc : e));
    if (prev.status !== enc.status) {
      pushFeed(entry, encounterFeedEvent(s, enc, true));
      if (enc.status === 'dead') checkCascade(entry, enc);
    }
  }
  entry.pendingSync.delete(enc.id);
  saveLocalRun(s);
  const after = soulLinksOf(s).length;
  if (after > before) announceLink(entry, s, enc);
  checkMilestones(entry);
  emit(entry);
}

function goLive(entry: RunEntry): void {
  const s = entry.state;
  if (!s || s.mode !== 'multi' || entry.channel || !isMultiCapable()) return;
  entry.status = 'connecting';
  const runId = entry.id;
  const ch = runChannel(runId);
  entry.channel = ch;
  ch.on(
    'postgres_changes',
    { event: '*', schema: 'public', table: 'nuz_encounters', filter: `run_id=eq.${runId}` },
    (payload) => {
      if (payload.eventType === 'DELETE') {
        const old = payload.old as Partial<NuzEncounterRow>;
        const st = entry.state;
        if (st && old.id) {
          st.encounters = st.encounters.filter((e) => e.id !== old.id);
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
      const st = entry.state;
      if (!st) return;
      const row = payload.new as NuzRunRow;
      st.run = { ...row, rules: { ...DEFAULT_RULES, ...(row.rules as Partial<NuzRules>) } };
      saveLocalRun(st);
      emit(entry);
    },
  );
  ch.on('presence', { event: 'sync' }, () => {
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
  ch.subscribe((status) => {
    if (status === 'SUBSCRIBED') {
      entry.status = 'live';
      const me = presenceMe(entry);
      if (me) void ch.track(me);
    } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
      if (entry.channel) entry.status = 'reconnecting';
    }
    emit(entry);
  });
}

function dropLive(entry: RunEntry): void {
  if (entry.channel) {
    dropChannel(entry.channel);
    entry.channel = null;
  }
  if (entry.state?.mode === 'multi') entry.status = 'connecting';
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
  if (entry.state?.mode === 'multi') goLive(entry);
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

/** Fire-and-replay a remote write; gold toast on failure, never red. */
function persistWithRetry(entry: RunEntry, syncKey: string, op: () => PromiseLike<{ error: unknown }>): void {
  if (!isMultiCapable() || entry.state?.mode !== 'multi') return;
  entry.pendingSync.add(syncKey);
  emit(entry);
  const attempt = async (n: number): Promise<void> => {
    try {
      const { error } = await op();
      if (!error) {
        entry.pendingSync.delete(syncKey);
        emit(entry);
        return;
      }
      if (n === 0) pushToast('sync', 'RETRYING SYNC…');
      if (n >= 4) return; /* stays flagged — PENDING SYNC caption */
    } catch {
      if (n === 0) pushToast('sync', 'RETRYING SYNC…');
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
    meta: routeLabelOf(s.run, enc.route_key).toUpperCase(),
  });
  pushToast('link', i18n.t('nuz.toast.soulLink', { a: aName.toUpperCase(), b: bName.toUpperCase() }));
}

function checkCascade(entry: RunEntry, deadEnc: NuzEncounterRow): void {
  const s = entry.state;
  if (!s) return;
  const partner = linkPartnerOf(s, deadEnc.id);
  if (!partner || partner.status !== 'caught') return;
  const name = partner.nickname ?? speciesNamer(partner.pokemon_id);
  pushFeed(entry, {
    kind: 'link',
    color: '#F6C945',
    title: i18n.t('nuz.feed.linkCascade', { name }),
    meta: routeLabelOf(s.run, deadEnc.route_key).toUpperCase(),
  });
  pushToast('info', i18n.t('nuz.toast.cascade', { name: name.toUpperCase() }));
}

/* ---------- actions: create / join / upgrade ---------- */

export interface NewRunPlayer {
  name: string;
  color: string;
}

export interface NewRunConfig {
  name: string;
  region: RegionId;
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

export async function createRun(cfg: NewRunConfig): Promise<CreatedRun> {
  const id = uuid();
  const now = new Date().toISOString();
  const players: NuzPlayerRow[] = cfg.players.map((p, i) => ({
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

  if (cfg.online && isMultiCapable()) {
    invite = mintInviteCode();
    const runRow = { ...baseRun, invite_code: invite };
    const { error: runErr } = await nuzTables.runs().insert(runRow);
    const { error: plErr } = runErr ? { error: runErr } : await nuzTables.players().insert(players);
    if (!plErr) {
      mode = 'multi';
      baseRun.invite_code = invite;
    } else {
      offlineFallback = true;
      pushToast('sync', 'OFFLINE — RUN SAVED TO THIS DEVICE');
    }
  }

  const state: RunState = { run: baseRun, mode, players, encounters: [] };
  saveLocalRun(state);
  setRunOwner(id);
  setMembership(id, players[0].id);
  const entry = ensureEntry(id);
  entry.state = state;
  entry.phase = 'ready';
  entry.status = mode === 'multi' ? 'connecting' : 'local';
  seedFeed(entry);
  if (mode === 'multi') goLive(entry);
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
  const clean = code.trim().toUpperCase();
  if (!clean) return null;
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

/** Join a looked-up run as a new player (nuzlocke.md §1.4). */
export async function joinRun(lookup: JoinLookup, name: string, color: string): Promise<RunState | null> {
  const taken = new Set(lookup.players.map((p) => p.color));
  const finalColor = taken.has(color) ? (PLAYER_COLORS.find((c) => !taken.has(c)) ?? color) : color;
  const player: NuzPlayerRow = {
    id: uuid(),
    run_id: lookup.run.id,
    name: name.trim() || `PLAYER ${lookup.players.length + 1}`,
    color: finalColor,
    slot: lookup.players.length,
    created_at: new Date().toISOString(),
  };
  const { error } = await nuzTables.players().insert(player);
  if (error) return null;
  const state: RunState = {
    run: lookup.run,
    mode: 'multi',
    players: [...lookup.players, player],
    encounters: [],
  };
  saveLocalRun(state);
  setMembership(lookup.run.id, player.id);
  const entry = ensureEntry(lookup.run.id);
  entry.state = state;
  entry.phase = 'ready';
  seedFeed(entry);
  void refreshRemote(entry).then(() => goLive(entry));
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
  const invite = s.run.invite_code ?? mintInviteCode();
  const runRow = { ...s.run, invite_code: invite };
  const { error: rErr } = await nuzTables.runs().upsert(runRow);
  if (rErr) {
    pushToast('sync', 'RETRYING SYNC…');
    return false;
  }
  if (s.players.length > 0) await nuzTables.players().upsert(s.players);
  if (s.encounters.length > 0) await nuzTables.encounters().upsert(s.encounters);
  s.mode = 'multi';
  s.run = runRow;
  saveLocalRun(s);
  entry.status = 'connecting';
  goLive(entry);
  emit(entry);
  pushToast('success', `ONLINE — INVITE ${invite}`);
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

export function encounterAt(state: RunState, playerId: string, routeKey: string): NuzEncounterRow | undefined {
  return state.encounters.find((e) => e.player_id === playerId && e.route_key === routeKey);
}

export function logEncounter(runId: string, draft: LogDraft): LogResult {
  const entry = ensureEntry(runId);
  const s = entry.state;
  if (!s) return { ok: false };
  const region = regionById(s.run.region);
  const node = region ? nodeIndex(region).get(draft.routeKey) : undefined;
  const violation = validateLogDraft(s, draft, node);
  if (violation) return { ok: false, error: violation };

  const enc: NuzEncounterRow = {
    id: uuid(),
    run_id: runId,
    player_id: draft.playerId,
    route_key: draft.routeKey,
    pokemon_id: draft.pokemonId,
    nickname: draft.nickname?.trim() ? draft.nickname.trim() : null,
    level: draft.level,
    status: draft.status,
    note: draft.note ?? null,
    /* auto-join party while there is a free slot (mirrors the old derived rule) */
    in_party: draft.status === 'caught' && partyOf(s, draft.playerId).length < 6,
    created_at: new Date().toISOString(),
  };

  const before = soulLinksOf(s).length;
  s.encounters = [...s.encounters, enc];
  saveLocalRun(s);
  pushFeed(entry, encounterFeedEvent(s, enc, false));
  const after = soulLinksOf(s).length;
  const linkedWith = after > before ? linkPartnerOf(s, enc.id) : null;
  if (after > before) announceLink(entry, s, enc);
  if (enc.status === 'dead') checkCascade(entry, enc);
  checkMilestones(entry);

  if (s.mode === 'multi') {
    persistWithRetry(entry, enc.id, () => nuzTables.encounters().insert(enc));
  }
  emit(entry);
  return { ok: true, encounter: enc, linkedWith };
}

export interface UpdateResult {
  ok: boolean;
  cascadePartner?: NuzEncounterRow | null;
}

/** Mark dead / mark missed / edit nickname / note (§2.5–2.7 flows). */
export function updateEncounter(
  runId: string,
  encId: string,
  patch: Partial<Pick<NuzEncounterRow, 'status' | 'note' | 'nickname' | 'level'>>,
): UpdateResult {
  const entry = ensureEntry(runId);
  const s = entry.state;
  const enc = s?.encounters.find((e) => e.id === encId);
  if (!s || !enc) return { ok: false };
  const prevStatus = enc.status;
  /* leaving the living world frees the party slot (persisted too) */
  const freesSlot = Boolean(patch.status && patch.status !== 'caught');
  if (freesSlot) enc.in_party = false;
  Object.assign(enc, patch);
  const persistedPatch = freesSlot ? { ...patch, in_party: false } : patch;
  saveLocalRun(s);
  let cascadePartner: NuzEncounterRow | null = null;
  if (patch.status && patch.status !== prevStatus) {
    pushFeed(entry, encounterFeedEvent(s, enc, false));
    if (patch.status === 'dead') {
      cascadePartner = linkPartnerOf(s, enc.id);
      checkCascade(entry, enc);
      if (s.run.rules.releaseOnDeath) {
        pushToast('info', i18n.t('nuz.toast.releaseRule', { name: enc.nickname ?? speciesNamer(enc.pokemon_id) }));
      }
    }
  }
  if (s.mode === 'multi') {
    persistWithRetry(entry, enc.id, () =>
      nuzTables.encounters().update(persistedPatch).eq('id', enc.id),
    );
  }
  emit(entry);
  return { ok: true, cascadePartner };
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
  if (s.mode === 'multi') {
    persistWithRetry(entry, enc.id, () => nuzTables.encounters().update({ in_party: inParty }).eq('id', enc.id));
  }
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
  if (s.mode === 'multi') {
    persistWithRetry(entry, a.id, () => nuzTables.encounters().update({ in_party: true }).eq('id', a.id));
    persistWithRetry(entry, b.id, () => nuzTables.encounters().update({ in_party: false }).eq('id', b.id));
  }
  emit(entry);
  return { ok: true };
}

export function deleteEncounter(runId: string, encId: string): void {
  const entry = ensureEntry(runId);
  const s = entry.state;
  if (!s) return;
  s.encounters = s.encounters.filter((e) => e.id !== encId);
  saveLocalRun(s);
  if (s.mode === 'multi') {
    persistWithRetry(entry, encId, () => nuzTables.encounters().delete().eq('id', encId));
  }
  emit(entry);
}

/* ---------- actions: run-level ---------- */

export function renameRun(runId: string, name: string): void {
  const entry = ensureEntry(runId);
  const s = entry.state;
  if (!s || !name.trim()) return;
  s.run.name = name.trim();
  saveLocalRun(s);
  if (s.mode === 'multi') {
    persistWithRetry(entry, `run:${runId}`, () => nuzTables.runs().update({ name: s.run.name }).eq('id', runId));
  }
  emit(entry);
}

export function setRunRules(runId: string, rules: Partial<NuzRules>): void {
  const entry = ensureEntry(runId);
  const s = entry.state;
  if (!s) return;
  const next = normalizeRules({ ...s.run.rules, ...rules });
  s.run.rules = next;
  saveLocalRun(s);
  pushFeed(entry, { kind: 'rule', color: '#F6C945', title: i18n.t('nuz.feed.rulesUpdated'), meta: rulesSummary(s.run.rules) });
  if (s.mode === 'multi') {
    persistWithRetry(entry, `run:${runId}`, () => nuzTables.runs().update({ rules: s.run.rules }).eq('id', runId));
  }
  emit(entry);
}

function rulesSummary(r: NuzRules): string {
  const bits = [
    i18n.t(r.dupes ? 'nuz.feed.dupesOn' : 'nuz.feed.dupesOff'),
    i18n.t(r.shiny ? 'nuz.feed.shinyOn' : 'nuz.feed.shinyOff'),
  ];
  if (r.soulLink) bits.push('SOULLINK');
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
  if (s.mode === 'multi') {
    persistWithRetry(entry, `run:${runId}`, () => nuzTables.runs().update({ status }).eq('id', runId));
  }
  emit(entry);
}

/** Archive = remove from this device (remote rows untouched). */
export function archiveRun(runId: string): void {
  writeRunIndex(readRunIndex().filter((id) => id !== runId));
  removeLocalKey(LS_RUN(runId));
  const entry = entries.get(runId);
  if (entry) {
    dropLive(entry);
    entry.state = null;
    entry.phase = 'missing';
    emit(entry);
    entries.delete(runId);
  }
  notifyHub();
}

export function duplicateAsSolo(runId: string): string | null {
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
  const encounters = src.encounters.map((e) => ({
    ...e,
    id: uuid(),
    run_id: id,
    player_id: playerMap.get(e.player_id) ?? e.player_id,
    created_at: now,
  }));
  const state: RunState = {
    run: { ...src.run, id, invite_code: null, name: `${src.run.name} (COPY)`, created_at: now },
    mode: 'solo',
    players,
    encounters,
  };
  saveLocalRun(state);
  setRunOwner(id);
  if (players[0]) setMembership(id, players[0].id);
  notifyHub();
  return id;
}

/* ---------- hub (runs list) ---------- */

const hubListeners = new Set<() => void>();
let hubLoaded = false;

function hubRefresh(): void {
  reconcileRunIndex();
  for (const id of readRunIndex()) {
    const e = ensureEntry(id);
    if (e.state?.mode === 'multi' && !e.remoteLoaded) void refreshRemote(e).then(() => notifyHub());
  }
  notifyHub();
}

export function useHubRuns(): { runs: RunState[]; loading: boolean; entries: RunEntry[] } {
  const [, force] = useReducer((c: number) => c + 1, 0);

  useEffect(() => {
    const unsubs = new Map<string, () => void>();
    function syncSubs() {
      const ids = readRunIndex();
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

  const list = readRunIndex()
    .map((id) => entries.get(id))
    .filter((e): e is RunEntry => !!e && !!e.state);
  const runs = list
    .map((e) => e.state as RunState)
    .sort((a, b) => lastActivity(b) - lastActivity(a));
  return { runs, loading: list.some((e) => e.phase === 'loading'), entries: list };
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
  if ((!state || state.mode === 'multi') && isMultiCapable()) {
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
