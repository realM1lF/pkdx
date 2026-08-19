import { describe, expect, it } from 'vitest';
import {
  isOverlayToken,
  kpisFromSnapshot,
  mintOverlayToken,
  normalizeOverlayConfig,
  overlayUrl,
  partyFromSnapshot,
  recentEventsFromSnapshot,
  routeLabelFromSnapshot,
  snapshotToRunState,
  youAreHereFromSnapshot,
  type OverlaySnapshot,
} from './nuzlocke-overlay';
import { kpisOf, partyOf, youAreHereKey } from './nuzlocke-store';
import { normalizeRules } from './nuzlocke-rules';

const FIXTURE: OverlaySnapshot = {
  run: {
    name: 'Test Run',
    game: 'firered',
    region: 'kanto',
    status: 'active',
    rules: normalizeRules({
      routeTracking: 'manual',
      customRoutes: [
        { id: 'route-1', label: 'Route 1', kind: 'route', order: 1 },
        { id: 'route-2', label: 'Route 2', kind: 'route', order: 2 },
      ],
      soulLink: true,
      badgesCleared: 2,
    }),
  },
  players: [{ id: 'p1', name: 'Ash', color: '#F6C945', slot: 0 }],
  encounters: [
    {
      id: 'e1',
      player_id: 'p1',
      route_key: 'route-1',
      pokemon_id: 1,
      nickname: 'Bulby',
      level: 10,
      status: 'caught',
      is_shiny: false,
      in_party: true,
      created_at: '2026-01-01T10:00:00.000Z',
    },
    {
      id: 'e2',
      player_id: 'p1',
      route_key: 'route-2',
      pokemon_id: 16,
      nickname: null,
      level: 8,
      status: 'dead',
      is_shiny: true,
      in_party: false,
      created_at: '2026-01-02T10:00:00.000Z',
    },
  ],
  config: { layout: 'streamer', widgets: { party: true, deaths: true, route: true, badges: true, recentEvent: true, levelCap: false, rules: false }, playerIds: null, locale: 'en' },
  updated_at: '2026-01-02T10:00:00.000Z',
};

describe('nuzlocke-overlay', () => {
  it('mints valid overlay tokens', () => {
    const token = mintOverlayToken();
    expect(isOverlayToken(token)).toBe(true);
    expect(token.startsWith('OVERLAY-')).toBe(true);
  });

  it('builds overlay URL with encoded token', () => {
    const url = overlayUrl('OVERLAY-ABCDEFGH', 'de', 'https://example.test');
    expect(url).toBe('https://example.test/de/overlay/nuzlocke/OVERLAY-ABCDEFGH');
  });

  it('normalizes overlay config defaults', () => {
    const cfg = normalizeOverlayConfig({});
    expect(cfg.layout).toBe('streamer');
    expect(cfg.widgets.party).toBe(true);
    expect(cfg.locale).toBe('en');
  });

  it('party/kpis/youAreHere match store selectors on equivalent state', () => {
    const state = snapshotToRunState(FIXTURE);
    expect(partyFromSnapshot(FIXTURE, 'p1').map((e) => e.id)).toEqual(partyOf(state, 'p1').map((e) => e.id));
    expect(kpisFromSnapshot(FIXTURE)).toEqual(kpisOf(state));
    expect(youAreHereFromSnapshot(FIXTURE)).toBe(youAreHereKey(state));
  });

  it('resolves manual route labels', () => {
    expect(routeLabelFromSnapshot(FIXTURE, 'route-1', 'en')).toBe('Route 1');
  });

  it('recent events prefers newest encounter', () => {
    const events = recentEventsFromSnapshot(FIXTURE, 1);
    expect(events[0]?.id).toBe('e2');
    expect(events[0]?.kind).toBe('death');
  });
});
