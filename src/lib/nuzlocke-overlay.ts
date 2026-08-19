/* OBS overlay — token URL, snapshot RPC, pure selectors, broadcast helper. */
import { normalizeRules } from '@/lib/nuzlocke-rules';
import { effectiveRegionForRun } from '@/lib/nuzlocke-routes';
import { anyRegionById } from '@/lib/regions-freeform';
import { nodeIndex } from '@/lib/regions';
import {
  kpisOf,
  partyOf,
  soulLinkGroupsOf,
  youAreHereKey,
  type RunState,
  type SoulLinkGroup,
} from '@/lib/nuzlocke-store';
import type { Lang } from '@/lib/i18n-data';
import { SITE_URL } from '@/lib/seo';
import { supabase } from '@/lib/supabase';
import type { NuzEncounterRow, NuzEncounterStatus, NuzPlayerRow, NuzRules, NuzRunStatus } from '@/lib/supabase';

export type OverlayLayout = 'streamer' | 'compact' | 'soul-link-dual' | 'minimal';

export interface OverlayWidgets {
  party: boolean;
  deaths: boolean;
  route: boolean;
  badges: boolean;
  recentEvent: boolean;
  levelCap: boolean;
  rules: boolean;
}

export interface OverlayConfig {
  layout: OverlayLayout;
  widgets: OverlayWidgets;
  playerIds: string[] | null;
  locale: Lang;
}

export const OVERLAY_WIDGET_DEFAULTS: OverlayWidgets = {
  party: true,
  deaths: true,
  route: true,
  badges: true,
  recentEvent: true,
  levelCap: false,
  rules: false,
};

export const OVERLAY_CONFIG_DEFAULT: OverlayConfig = {
  layout: 'streamer',
  widgets: { ...OVERLAY_WIDGET_DEFAULTS },
  playerIds: null,
  locale: 'en',
};

export interface OverlaySnapshotPlayer {
  id: string;
  name: string;
  color: string;
  slot: number;
}

export interface OverlaySnapshotEncounter {
  id: string;
  player_id: string;
  route_key: string;
  pokemon_id: number;
  nickname: string | null;
  level: number;
  status: NuzEncounterStatus;
  is_shiny: boolean;
  in_party: boolean | null | undefined;
  created_at: string;
}

export interface OverlaySnapshot {
  run: {
    name: string;
    game: string;
    region: string;
    status: NuzRunStatus;
    rules: NuzRules;
  };
  players: OverlaySnapshotPlayer[];
  encounters: OverlaySnapshotEncounter[];
  config: Partial<OverlayConfig>;
  updated_at: string;
}

export type OverlayRecentKind = 'catch' | 'death' | 'missed' | 'duped' | 'lost';

function overlayRecentKind(status: NuzEncounterStatus): OverlayRecentKind | null {
  if (status === 'caught') return 'catch';
  if (status === 'dead') return 'death';
  if (status === 'missed') return 'missed';
  if (status === 'duped') return 'duped';
  if (status === 'lost') return 'lost';
  return null;
}

export interface OverlayRecentEvent {
  id: string;
  kind: OverlayRecentKind;
  playerId: string;
  playerName: string;
  playerColor: string;
  pokemonId: number;
  nickname: string | null;
  routeKey: string;
  level: number;
  createdAt: string;
}

const OVERLAY_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const OVERLAY_LENGTH = 8;
const OVERLAY_PREFIX = 'OVERLAY-';
const OVERLAY_TOKEN_RE = /^OVERLAY-[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{8}$/;

export function isOverlayToken(value: string): boolean {
  return OVERLAY_TOKEN_RE.test(value.trim().toUpperCase());
}

export function mintOverlayToken(): string {
  const n = OVERLAY_ALPHABET.length;
  const limit = 256 - (256 % n);
  let out = '';
  const buf = new Uint8Array(OVERLAY_LENGTH);
  while (out.length < OVERLAY_LENGTH) {
    crypto.getRandomValues(buf);
    for (const b of buf) {
      if (b >= limit) continue;
      out += OVERLAY_ALPHABET[b % n];
      if (out.length === OVERLAY_LENGTH) break;
    }
  }
  return `${OVERLAY_PREFIX}${out}`;
}

export function normalizeOverlayConfig(raw: unknown): OverlayConfig {
  const rec = raw && typeof raw === 'object' ? (raw as Partial<OverlayConfig>) : {};
  const layout =
    rec.layout === 'compact' || rec.layout === 'soul-link-dual' || rec.layout === 'minimal'
      ? rec.layout
      : 'streamer';
  const widgetsRaw = (rec.widgets && typeof rec.widgets === 'object' ? rec.widgets : {}) as Partial<OverlayWidgets>;
  const widgets: OverlayWidgets = {
    party: widgetsRaw.party !== false,
    deaths: widgetsRaw.deaths !== false,
    route: widgetsRaw.route !== false,
    badges: widgetsRaw.badges !== false,
    recentEvent: widgetsRaw.recentEvent !== false,
    levelCap: widgetsRaw.levelCap === true,
    rules: widgetsRaw.rules === true,
  };
  const playerIds = Array.isArray(rec.playerIds)
    ? rec.playerIds.filter((id): id is string => typeof id === 'string' && id.length > 0)
    : null;
  const locale: Lang = rec.locale === 'de' ? 'de' : 'en';
  return { layout, widgets, playerIds: playerIds?.length ? playerIds : null, locale };
}

export function overlayUrl(token: string, lang: Lang, origin?: string): string {
  const clean = token.trim().toUpperCase();
  const base =
    origin ??
    (typeof window !== 'undefined' ? window.location.origin : SITE_URL);
  return `${base.replace(/\/$/, '')}/${lang}/overlay/nuzlocke/${encodeURIComponent(clean)}`;
}

export async function overlayChannelName(token: string): Promise<string> {
  const data = new TextEncoder().encode(token.trim().toUpperCase());
  const hash = await crypto.subtle.digest('SHA-256', data);
  const hex = Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return `overlay:${hex.slice(0, 32)}`;
}

export function snapshotToRunState(snapshot: OverlaySnapshot): RunState {
  const rules = normalizeRules(snapshot.run.rules);
  return {
    run: {
      id: 'overlay',
      invite_code: null,
      name: snapshot.run.name,
      game: snapshot.run.game,
      region: snapshot.run.region,
      rules,
      status: snapshot.run.status,
      created_at: snapshot.updated_at,
      overlay_enabled: true,
      overlay_token: null,
      overlay_config: normalizeOverlayConfig(snapshot.config) as unknown as Record<string, unknown>,
    },
    mode: snapshot.players.length > 1 ? 'multi' : 'solo',
    players: snapshot.players.map(
      (p): NuzPlayerRow => ({
        id: p.id,
        run_id: 'overlay',
        name: p.name,
        color: p.color,
        slot: p.slot,
        created_at: snapshot.updated_at,
      }),
    ),
    encounters: snapshot.encounters.map(
      (e): NuzEncounterRow => ({
        id: e.id,
        run_id: 'overlay',
        player_id: e.player_id,
        route_key: e.route_key,
        pokemon_id: e.pokemon_id,
        nickname: e.nickname,
        level: e.level,
        status: e.status,
        note: null,
        is_shiny: e.is_shiny,
        in_party: e.in_party ?? undefined,
        created_at: e.created_at,
      }),
    ),
  };
}

export function partyFromSnapshot(snapshot: OverlaySnapshot, playerId: string): NuzEncounterRow[] {
  return partyOf(snapshotToRunState(snapshot), playerId);
}

export function kpisFromSnapshot(snapshot: OverlaySnapshot) {
  return kpisOf(snapshotToRunState(snapshot));
}

export function youAreHereFromSnapshot(snapshot: OverlaySnapshot): string | null {
  return youAreHereKey(snapshotToRunState(snapshot));
}

export function soulLinkGroupsFromSnapshot(snapshot: OverlaySnapshot): SoulLinkGroup[] {
  return soulLinkGroupsOf(snapshotToRunState(snapshot));
}

export function resolveSnapshotRegion(snapshot: OverlaySnapshot) {
  const base = anyRegionById(snapshot.run.region);
  if (!base) return null;
  return effectiveRegionForRun(base, normalizeRules(snapshot.run.rules));
}

export function routeLabelFromSnapshot(snapshot: OverlaySnapshot, routeKey: string, lang: Lang): string {
  const region = resolveSnapshotRegion(snapshot);
  if (!region) return routeKey;
  const node = nodeIndex(region).get(routeKey);
  if (!node) return routeKey;
  return lang === 'de' && node.nameDe ? node.nameDe : node.label;
}

export function recentEventsFromSnapshot(snapshot: OverlaySnapshot, limit = 3): OverlayRecentEvent[] {
  const players = new Map(snapshot.players.map((p) => [p.id, p]));
  return [...snapshot.encounters]
    .map((e) => ({ e, kind: overlayRecentKind(e.status) }))
    .filter((row): row is { e: OverlaySnapshotEncounter; kind: OverlayRecentKind } => row.kind !== null)
    .sort((a, b) => b.e.created_at.localeCompare(a.e.created_at))
    .slice(0, limit)
    .map(({ e, kind }) => {
      const p = players.get(e.player_id);
      return {
        id: e.id,
        kind,
        playerId: e.player_id,
        playerName: p?.name ?? '?',
        playerColor: p?.color ?? '#F6C945',
        pokemonId: e.pokemon_id,
        nickname: e.nickname,
        routeKey: e.route_key,
        level: e.level,
        createdAt: e.created_at,
      };
    });
}

export function visiblePlayersFromSnapshot(snapshot: OverlaySnapshot): OverlaySnapshotPlayer[] {
  const sorted = [...snapshot.players].sort((a, b) => a.slot - b.slot);
  const cfg = normalizeOverlayConfig(snapshot.config);
  if (!cfg.playerIds?.length) return sorted;
  const pick = new Set(cfg.playerIds);
  return sorted.filter((p) => pick.has(p.id));
}

export async function fetchOverlaySnapshot(token: string): Promise<OverlaySnapshot | null> {
  const clean = token.trim().toUpperCase();
  if (!isOverlayToken(clean)) return null;
  const { data, error } = await supabase.rpc('nuz_overlay_snapshot', { p_token: clean });
  if (error || !data) return null;
  const raw = data as OverlaySnapshot;
  if (!raw?.run?.name) return null;
  return {
    ...raw,
    config: normalizeOverlayConfig(raw.config),
    encounters: Array.isArray(raw.encounters) ? raw.encounters : [],
    players: Array.isArray(raw.players) ? raw.players : [],
  };
}

export async function sendOverlayBroadcast(token: string, updatedAt: string): Promise<void> {
  if (!token) return;
  const name = await overlayChannelName(token);
  const ch = supabase.channel(name);
  await new Promise<void>((resolve) => {
    ch.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        void ch
          .send({ type: 'broadcast', event: 'overlay', payload: { v: updatedAt } })
          .finally(() => {
            void supabase.removeChannel(ch);
            resolve();
          });
      } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        void supabase.removeChannel(ch);
        resolve();
      }
    });
  });
}

export function subscribeOverlayBroadcast(
  token: string,
  onTick: (updatedAt: string | null) => void,
): () => void {
  let live = true;
  let channel: ReturnType<typeof supabase.channel> | null = null;
  void overlayChannelName(token).then((name) => {
    if (!live) return;
    channel = supabase.channel(name);
    channel.on('broadcast', { event: 'overlay' }, (msg) => {
      const v = msg.payload && typeof msg.payload === 'object' && 'v' in msg.payload ? String(msg.payload.v) : null;
      onTick(v);
    });
    channel.subscribe();
  });
  return () => {
    live = false;
    if (channel) void supabase.removeChannel(channel);
  };
}
