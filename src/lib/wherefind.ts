/* WHERE-TO-FIND aggregation — pure logic behind the detail-page panel
 * (src/pages/detail/WhereToFind.tsx). Kept component-free so it stays
 * unit-testable (fast-refresh rule) and reusable.
 *
 * Wild rows are aggregated per RegionMap node. Optional `version` keeps
 * only that game's slots (Pidgey Route 1 is 20% FireRed, 45% HeartGold).
 * Without a filter, all versions stay on one row and the best rate wins.
 * Gift / static / trade encounters (STATIC_METHODS — e.g. game-corner
 * prizes, Poké-Flute Snorlax, in-game trades) are flagged `special` with
 * the specific sub-area ('PRIZE CORNER') and version list, so a one-off
 * gift never reads as a wild encounter. */

import { displayName } from './pokeapi';
import { REGIONS } from './regions';
import type { MapNode, RegionMap } from './regions';
import { areaShortLabel, methodBucket, STATIC_METHODS } from './mapdata';
import type { MethodBucket } from './mapdata';

/* ---------- PokéAPI encounter payload (local shapes — lib types untouched) ---------- */

export interface EncounterDetail {
  chance: number;
  min_level: number;
  max_level: number;
  method: { name: string };
}

export interface EncounterVersionDetail {
  max_chance: number;
  version: { name: string };
  encounter_details: EncounterDetail[];
}

export interface EncounterAreaEntry {
  location_area: { name: string; url: string };
  version_details: EncounterVersionDetail[];
}

/* ---------- area → RegionMap node resolution ---------- */

interface NodeHit {
  region: RegionMap;
  nodeId: string;
  label: string;
  node: MapNode;
}

const SLUG_INDEX = new Map<string, NodeHit>();
for (const region of REGIONS) {
  for (const node of region.nodes) {
    if (node.locationSlug)
      SLUG_INDEX.set(node.locationSlug, { region, nodeId: node.id, label: node.label, node });
  }
}

function resolveArea(areaName: string): NodeHit | null {
  const base = areaName.replace(/-area$/, '');
  /* special case: all kanto victory-road variants map to the one VR node */
  if (/^kanto-victory-road-\d/.test(base)) {
    const vr = SLUG_INDEX.get('kanto-victory-road-2');
    if (vr) return vr;
  }
  let cand = base;
  for (;;) {
    const hit = SLUG_INDEX.get(cand);
    if (hit) return hit;
    const cut = cand.lastIndexOf('-');
    if (cut < 0) return null;
    cand = cand.slice(0, cut);
  }
}

/* ---------- versions + maps deep-link ---------- */

export function encounterVersions(areas: EncounterAreaEntry[]): string[] {
  const set = new Set<string>();
  for (const area of areas) {
    for (const vd of area.version_details) {
      if (vd.encounter_details.length > 0) set.add(vd.version.name);
    }
  }
  return [...set].sort();
}

export function mapsPath(regionId: string, nodeId: string, version?: string | null): string {
  const q = new URLSearchParams();
  q.set('node', nodeId);
  if (version) q.set('v', version);
  return `/maps/${regionId}?${q.toString()}`;
}

/* ---------- aggregation (per node; optional version filter) ---------- */

export interface WhereRow {
  key: string;
  label: string;
  /** uniform sub-area label inside the node (e.g. 'PRIZE CORNER'), else null */
  sub: string | null;
  node: MapNode | null;
  region: RegionMap | null;
  regionPrefix: string;
  nodeId: string | null;
  methods: string[];
  /** all game versions this row's encounters come from (sorted) */
  versions: string[];
  /** every method is gift/static/trade — never a wild encounter */
  special: boolean;
  maxChance: number;
  minLevel: number;
  maxLevel: number;
}

const BUCKET_ORDER: Record<MethodBucket, number> = { WALK: 0, SURF: 1, FISH: 2, OTHER: 3 };

export function aggregate(areas: EncounterAreaEntry[], version?: string | readonly string[] | null): WhereRow[] {
  const allowed =
    version == null || version === ''
      ? null
      : new Set(typeof version === 'string' ? [version] : [...version]);
  const byKey = new Map<
    string,
    WhereRow & { methodSet: Set<string>; versionSet: Set<string>; subSet: Set<string> }
  >();
  for (const area of areas) {
    const base = area.location_area.name.replace(/-area$/, '');
    const hit = resolveArea(area.location_area.name);
    const key = hit ? hit.nodeId : `area:${base}`;
    for (const vd of area.version_details) {
      if (allowed && !allowed.has(vd.version.name)) continue;
      if (vd.encounter_details.length === 0) continue;
      let row = byKey.get(key);
      if (!row) {
        row = {
          key,
          label: hit ? hit.label : displayName(base),
          sub: null,
          node: hit ? hit.node : null,
          region: hit ? hit.region : null,
          regionPrefix: base.split('-')[0] ?? '',
          nodeId: hit ? hit.nodeId : null,
          methods: [],
          versions: [],
          special: false,
          methodSet: new Set<string>(),
          versionSet: new Set<string>(),
          subSet: new Set<string>(),
          maxChance: 0,
          minLevel: Infinity,
          maxLevel: -Infinity,
        };
        byKey.set(key, row);
      }
      if (hit) row.subSet.add(areaShortLabel(area.location_area.name, hit.node.locationSlug ?? base));
      /* PokéAPI max_chance sums across mutually exclusive methods (can exceed
         100) — sum slots per exact method, then take the max (mapdata parity) */
      const byMethod = new Map<string, number>();
      row.versionSet.add(vd.version.name);
      for (const det of vd.encounter_details) {
        byMethod.set(det.method.name, (byMethod.get(det.method.name) ?? 0) + det.chance);
        row.methodSet.add(det.method.name);
        row.minLevel = Math.min(row.minLevel, det.min_level);
        row.maxLevel = Math.max(row.maxLevel, det.max_level);
      }
      if (byMethod.size > 0) row.maxChance = Math.max(row.maxChance, Math.min(100, Math.max(...byMethod.values())));
    }
  }
  return [...byKey.values()]
    .map(({ methodSet, versionSet, subSet, ...row }) => {
      const methods = [...methodSet].sort(
        (a, b) => BUCKET_ORDER[methodBucket(a)] - BUCKET_ORDER[methodBucket(b)] || a.localeCompare(b),
      );
      const subs = [...subSet].filter((s) => s !== 'MAIN');
      return {
        ...row,
        minLevel: Number.isFinite(row.minLevel) ? row.minLevel : 0,
        maxLevel: Number.isFinite(row.maxLevel) ? row.maxLevel : 0,
        methods,
        versions: [...versionSet].sort(),
        special: methods.length > 0 && methods.every((m) => STATIC_METHODS.has(m)),
        sub: subs.length === 1 ? (subs[0] ?? null) : null,
      };
    })
    .sort((a, b) => b.maxChance - a.maxChance || a.label.localeCompare(b.label));
}
