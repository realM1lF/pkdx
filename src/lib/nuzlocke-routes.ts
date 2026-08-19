/* Manual route tracking for Nuzlocke runs (randomizer, ROM hacks, custom playthroughs).
 * Guided runs use the shared region contract unchanged; manual runs store their
 * route list in `NuzRules.customRoutes` and render via `effectiveRegionForRun`. */
import type { MapNode, NodeKind, RegionMap } from './regions';
import { routeOrder } from './regions';
import type { NuzRules } from './supabase';

export type RouteTrackingMode = 'guided' | 'manual';

/** Persisted in rules JSONB — mirrors MapNode fields needed by Timeline/QuickEntry. */
export interface CustomRouteNode {
  id: string;
  label: string;
  nameDe?: string;
  kind: NodeKind;
  order: number;
  locationSlug?: string | null;
}

export const MAX_CUSTOM_ROUTES = 200;
export const MAX_ROUTE_LABEL_LEN = 48;

export function isManualRouteRun(rules: Pick<NuzRules, 'routeTracking'>): boolean {
  return rules.routeTracking === 'manual';
}

export function slugifyRouteLabel(label: string): string {
  return label
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
}

export function normalizeCustomRoutes(raw: unknown): CustomRouteNode[] {
  if (!Array.isArray(raw)) return [];
  const out: CustomRouteNode[] = [];
  const seen = new Set<string>();
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const rec = item as Partial<CustomRouteNode>;
    const id = typeof rec.id === 'string' ? rec.id.trim() : '';
    const label = typeof rec.label === 'string' ? rec.label.trim() : '';
    if (!id || !label || seen.has(id)) continue;
    const kind = rec.kind === 'city' || rec.kind === 'route' || rec.kind === 'dungeon' || rec.kind === 'special' ? rec.kind : 'route';
    const order = typeof rec.order === 'number' && Number.isFinite(rec.order) ? Math.round(rec.order) : out.length + 1;
    seen.add(id);
    out.push({
      id,
      label,
      nameDe: typeof rec.nameDe === 'string' && rec.nameDe.trim() ? rec.nameDe.trim() : undefined,
      kind,
      order,
      locationSlug: rec.locationSlug ?? null,
    });
  }
  return out.sort((a, b) => a.order - b.order || a.label.localeCompare(b.label));
}

export function customRouteToMapNode(r: CustomRouteNode): MapNode {
  return {
    id: r.id,
    label: r.label,
    nameDe: r.nameDe,
    kind: r.kind,
    x: 0,
    y: 0,
    order: r.order,
    locationSlug: r.locationSlug ?? null,
  };
}

export function mapNodeToCustomRoute(n: MapNode): CustomRouteNode {
  return {
    id: n.id,
    label: n.label,
    nameDe: n.nameDe,
    kind: n.kind,
    order: n.order,
    locationSlug: n.locationSlug,
  };
}

/** Copy canonical region nodes as a starting checklist (encounters may not match). */
export function templateRoutesFromRegion(region: RegionMap): CustomRouteNode[] {
  return routeOrder(region).map(mapNodeToCustomRoute);
}

export function makeCustomRouteId(label: string, existingIds: Set<string>): string {
  const base = slugifyRouteLabel(label) || 'location';
  let id = `custom-${base}`;
  let n = 2;
  while (existingIds.has(id)) {
    id = `custom-${base}-${n}`;
    n++;
  }
  return id;
}

export type AddRouteError = 'empty' | 'duplicate' | 'tooMany' | 'tooLong';

export function validateAddRouteLabel(
  label: string,
  existing: CustomRouteNode[],
): { ok: true; label: string } | { ok: false; error: AddRouteError } {
  const trimmed = label.trim();
  if (!trimmed) return { ok: false, error: 'empty' };
  if (trimmed.length > MAX_ROUTE_LABEL_LEN) return { ok: false, error: 'tooLong' };
  const norm = trimmed.toLowerCase();
  if (existing.some((r) => r.label.toLowerCase() === norm)) return { ok: false, error: 'duplicate' };
  if (existing.length >= MAX_CUSTOM_ROUTES) return { ok: false, error: 'tooMany' };
  return { ok: true, label: trimmed };
}

export function buildCustomRoute(label: string, existing: CustomRouteNode[]): CustomRouteNode {
  const ids = new Set(existing.map((r) => r.id));
  const nextOrder = existing.length ? Math.max(...existing.map((r) => r.order)) + 1 : 1;
  return {
    id: makeCustomRouteId(label, ids),
    label,
    kind: 'route',
    order: nextOrder,
    locationSlug: null,
  };
}

/** Re-index `order` after moving one route within the list (ids unchanged). */
export function reorderCustomRoutesList(
  routes: CustomRouteNode[],
  fromIndex: number,
  toIndex: number,
): CustomRouteNode[] {
  if (fromIndex === toIndex) return routes;
  if (fromIndex < 0 || toIndex < 0 || fromIndex >= routes.length || toIndex >= routes.length) return routes;
  const next = routes.slice();
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next.map((r, i) => ({ ...r, order: i + 1 }));
}

export function moveCustomRouteIndex(
  routes: CustomRouteNode[],
  routeId: string,
  direction: 'up' | 'down',
): CustomRouteNode[] {
  const idx = routes.findIndex((r) => r.id === routeId);
  if (idx < 0) return routes;
  const to = direction === 'up' ? idx - 1 : idx + 1;
  return reorderCustomRoutesList(routes, idx, to);
}

/** Region snapshot for Timeline/KPIs — manual runs replace nodes with customRoutes. */
export function effectiveRegionForRun(base: RegionMap | undefined, rules: NuzRules): RegionMap | undefined {
  if (!base) return undefined;
  if (!isManualRouteRun(rules)) return base;
  const nodes = normalizeCustomRoutes(rules.customRoutes).map(customRouteToMapNode);
  return { ...base, nodes, edges: [] };
}

export function routeKeysOfRules(rules: NuzRules): Set<string> {
  if (!isManualRouteRun(rules)) return new Set();
  return new Set(normalizeCustomRoutes(rules.customRoutes).map((r) => r.id));
}

export function hasRouteInRun(rules: NuzRules, routeKey: string, baseRegion?: RegionMap): boolean {
  if (isManualRouteRun(rules)) {
    return routeKeysOfRules(rules).has(routeKey);
  }
  if (!baseRegion) return true;
  return baseRegion.nodes.some((n) => n.id === routeKey);
}

/** Routes referenced by encounters but missing from the manual list (legacy/orphan). */
export function orphanRouteKeys(state: { run: { rules: NuzRules }; encounters: Array<{ route_key: string }> }): string[] {
  if (!isManualRouteRun(state.run.rules)) return [];
  const known = routeKeysOfRules(state.run.rules);
  const orphans = new Set<string>();
  for (const e of state.encounters) {
    if (!known.has(e.route_key)) orphans.add(e.route_key);
  }
  return [...orphans].sort();
}
