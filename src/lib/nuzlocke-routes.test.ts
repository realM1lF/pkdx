import { describe, expect, it } from 'vitest';
import kanto from '@/data/regions/kanto.json';
import type { RegionMap } from '@/lib/regions';
import {
  buildCustomRoute,
  effectiveRegionForRun,
  isManualRouteRun,
  makeCustomRouteId,
  moveCustomRouteIndex,
  normalizeCustomRoutes,
  templateRoutesFromRegion,
  validateAddRouteLabel,
} from '@/lib/nuzlocke-routes';
import { validateLogDraft } from '@/lib/nuzlocke-rules';
import { DEFAULT_RULES, kpisOf, youAreHereKey } from '@/lib/nuzlocke-store';
import type { RunState } from '@/lib/nuzlocke-store';
import { normalizeRules } from '@/lib/nuzlocke-rules';

const KANTO = kanto as RegionMap;

describe('nuzlocke-routes — manual mode', () => {
  it('defaults legacy runs to guided tracking', () => {
    const rules = normalizeRules({ dupes: true });
    expect(rules.routeTracking).toBe('guided');
    expect(rules.customRoutes).toEqual([]);
    expect(isManualRouteRun(rules)).toBe(false);
  });

  it('template import copies canonical node ids', () => {
    const tpl = templateRoutesFromRegion(KANTO);
    expect(tpl.length).toBeGreaterThan(20);
    expect(tpl.some((r) => r.id === 'pallet-town')).toBe(true);
    expect(tpl.some((r) => r.id === 'kanto-route-1')).toBe(true);
  });

  it('effectiveRegionForRun replaces nodes in manual mode', () => {
    const rules = normalizeRules({
      routeTracking: 'manual',
      customRoutes: [{ id: 'custom-route-3', label: 'Route 3', kind: 'route', order: 1 }],
    });
    const eff = effectiveRegionForRun(KANTO, rules);
    expect(eff?.nodes).toHaveLength(1);
    expect(eff?.nodes[0]?.id).toBe('custom-route-3');
  });

  it('validateAddRouteLabel rejects duplicates case-insensitively', () => {
    const existing = [buildCustomRoute('Route 3', [])];
    expect(validateAddRouteLabel('route 3', existing).ok).toBe(false);
    expect(validateAddRouteLabel('Mt. Moon', existing).ok).toBe(true);
  });

  it('makeCustomRouteId avoids collisions', () => {
    const ids = new Set(['custom-route-3']);
    expect(makeCustomRouteId('Route 3', ids)).toBe('custom-route-3-2');
  });

  it('normalizeCustomRoutes dedupes by id and sorts by order', () => {
    const routes = normalizeCustomRoutes([
      { id: 'b', label: 'B', kind: 'route', order: 2 },
      { id: 'a', label: 'A', kind: 'route', order: 1 },
      { id: 'a', label: 'Dup', kind: 'route', order: 99 },
    ]);
    expect(routes.map((r) => r.id)).toEqual(['a', 'b']);
  });

  it('moveCustomRouteIndex swaps order without changing ids', () => {
    const routes = normalizeCustomRoutes([
      { id: 'a', label: 'A', kind: 'route', order: 1 },
      { id: 'b', label: 'B', kind: 'route', order: 2 },
      { id: 'c', label: 'C', kind: 'route', order: 3 },
    ]);
    const moved = moveCustomRouteIndex(routes, 'b', 'down');
    expect(moved.map((r) => r.id)).toEqual(['a', 'c', 'b']);
    expect(moved.map((r) => r.order)).toEqual([1, 2, 3]);
  });
});

function miniState(rules: ReturnType<typeof normalizeRules>): RunState {
  return {
    run: {
      id: 'run-1',
      invite_code: null,
      name: 'Test',
      game: 'black-white',
      region: 'kanto',
      rules,
      status: 'active',
      created_at: new Date().toISOString(),
    },
    mode: 'solo',
    players: [{ id: 'p1', run_id: 'run-1', name: 'Ash', color: '#FFD60A', slot: 0, created_at: new Date().toISOString() }],
    encounters: [],
  };
}

describe('manual routes — store integration', () => {
  it('kpis use custom route count', () => {
    const state = miniState(
      normalizeRules({
        routeTracking: 'manual',
        customRoutes: [
          { id: 'a', label: 'A', kind: 'route', order: 1 },
          { id: 'b', label: 'B', kind: 'route', order: 2 },
        ],
      }),
    );
    expect(kpisOf(state).routesTotal).toBe(2);
  });

  it('youAreHereKey picks first open manual route', () => {
    const state = miniState(
      normalizeRules({
        routeTracking: 'manual',
        customRoutes: [{ id: 'custom-a', label: 'A', kind: 'route', order: 1 }],
      }),
    );
    expect(youAreHereKey(state)).toBe('custom-a');
  });

  it('validateLogDraft rejects unknown manual routes', async () => {
    const state = miniState(
      normalizeRules({
        routeTracking: 'manual',
        customRoutes: [{ id: 'custom-a', label: 'A', kind: 'route', order: 1 }],
      }),
    );
    const err = await validateLogDraft(state, {
      playerId: 'p1',
      routeKey: 'not-listed',
      pokemonId: 25,
      level: 5,
      status: 'caught',
      nickname: 'Sparky',
    });
    expect(err).toBe('unknownRoute');
  });

  it('validateLogDraft allows listed manual routes', async () => {
    const state = miniState(
      normalizeRules({
        routeTracking: 'manual',
        customRoutes: [{ id: 'custom-a', label: 'A', kind: 'route', order: 1 }],
      }),
    );
    const err = await validateLogDraft(state, {
      playerId: 'p1',
      routeKey: 'custom-a',
      pokemonId: 25,
      level: 5,
      status: 'caught',
      nickname: 'Sparky',
    });
    expect(err).toBeNull();
  });

  it('guided runs keep DEFAULT_RULES behaviour', () => {
    expect(isManualRouteRun(DEFAULT_RULES)).toBe(false);
    const state = miniState(DEFAULT_RULES);
    expect(kpisOf(state).routesTotal).toBe(KANTO.nodes.length);
  });
});
