/* WHERE TO FIND panel — /pokemon/:id (density-addendum §3, Row 3 stack).
 * Data: pokemon/{id}/encounters via cachedJson (SWR). Location-area slugs
 * resolve to shared RegionMap nodes via node.locationSlug — strip '-area',
 * then longest-prefix strip sub-areas ('rock-tunnel-1f' → 'rock-tunnel');
 * kanto victory-road variants → 'kanto-victory-road-2'. Aggregated per node
 * across all versions (best rate wins); rows deep-link /maps/{region}?node=. */
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cachedJson, displayName } from '@/lib/pokeapi';
import { nameOfMethod, useLanguage } from '@/lib/i18n-data';
import { LocaleLink } from '@/lib/locale-link';
import { REGIONS, accentRgb, nodeName, regionName } from '@/lib/regions';
import type { MapNode, RegionId, RegionMap } from '@/lib/regions';
import { methodBucket } from '@/lib/mapdata';
import type { MethodBucket } from '@/lib/mapdata';
import { cn } from '@/lib/utils';

/* ---------- PokéAPI encounter payload (local shapes — lib types untouched) ---------- */

interface EncounterDetail {
  chance: number;
  min_level: number;
  max_level: number;
  method: { name: string };
}

interface EncounterVersionDetail {
  max_chance: number;
  version: { name: string };
  encounter_details: EncounterDetail[];
}

interface EncounterAreaEntry {
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

/* ---------- aggregation (per node, across versions — best rate) ---------- */

interface WhereRow {
  key: string;
  label: string;
  node: MapNode | null;
  region: RegionMap | null;
  regionPrefix: string;
  nodeId: string | null;
  methods: string[];
  maxChance: number;
  minLevel: number;
  maxLevel: number;
}

const BUCKET_ORDER: Record<MethodBucket, number> = { WALK: 0, SURF: 1, FISH: 2, OTHER: 3 };

function aggregate(areas: EncounterAreaEntry[]): WhereRow[] {
  const byKey = new Map<string, WhereRow & { methodSet: Set<string> }>();
  for (const area of areas) {
    const base = area.location_area.name.replace(/-area$/, '');
    const hit = resolveArea(area.location_area.name);
    const key = hit ? hit.nodeId : `area:${base}`;
    let row = byKey.get(key);
    if (!row) {
      row = {
        key,
        label: hit ? hit.label : displayName(base),
        node: hit ? hit.node : null,
        region: hit ? hit.region : null,
        regionPrefix: base.split('-')[0] ?? '',
        nodeId: hit ? hit.nodeId : null,
        methods: [],
        methodSet: new Set<string>(),
        maxChance: 0,
        minLevel: Infinity,
        maxLevel: -Infinity,
      };
      byKey.set(key, row);
    }
    for (const vd of area.version_details) {
      row.maxChance = Math.max(row.maxChance, vd.max_chance);
      for (const det of vd.encounter_details) {
        row.methodSet.add(det.method.name);
        row.minLevel = Math.min(row.minLevel, det.min_level);
        row.maxLevel = Math.max(row.maxLevel, det.max_level);
      }
    }
  }
  return [...byKey.values()]
    .map(({ methodSet, ...row }) => ({
      ...row,
      minLevel: Number.isFinite(row.minLevel) ? row.minLevel : 0,
      maxLevel: Number.isFinite(row.maxLevel) ? row.maxLevel : 0,
      methods: [...methodSet].sort(
        (a, b) => BUCKET_ORDER[methodBucket(a)] - BUCKET_ORDER[methodBucket(b)] || a.localeCompare(b),
      ),
    }))
    .sort((a, b) => b.maxChance - a.maxChance || a.label.localeCompare(b.label));
}

/* ---------- presentation ---------- */

const BUCKET_RGB: Record<MethodBucket, string> = {
  WALK: '99,217,107', // grass
  SURF: '69,200,255', // water
  FISH: '121,232,224', // ice
  OTHER: '168,176,196', // muted
};

const REGION_ABBR: Record<RegionId, string> = { kanto: 'KAN', johto: 'JOH', hoenn: 'HOE', sinnoh: 'SIN', unova: 'UNO' };

const TOP_N = 12;

function RowView({ row }: { row: WhereRow }) {
  const { t } = useTranslation();
  const lang = useLanguage();
  const region = row.region;
  const nodeId = row.nodeId;
  const linked = nodeId !== null && region !== null;
  const accent = region?.accent ?? null;
  const abbr = row.region ? REGION_ABBR[row.region.region] : row.regionPrefix.slice(0, 3).toUpperCase();
  const lv =
    row.minLevel === row.maxLevel
      ? t('detail.find.level', { level: row.minLevel })
      : t('detail.find.levelRange', { min: row.minLevel, max: row.maxLevel });
  const label = row.node ? nodeName(row.node, lang) : row.label;

  const body = (
    <>
      {/* region accent chip */}
      <span
        className={cn(
          'w-[32px] shrink-0 rounded-[3px] border px-0.5 text-center font-pixel text-[7px] leading-[14px]',
          !accent && 'border-hairline2 text-tx-muted/70',
        )}
        style={
          accent
            ? { color: accent, borderColor: `rgba(${accentRgb(accent)},0.45)`, background: `rgba(${accentRgb(accent)},0.10)` }
            : undefined
        }
      >
        {abbr || '???'}
      </span>
      {/* route display name */}
      <span className="min-w-0 flex-1 truncate text-[12px] font-semibold text-tx-primary">{label}</span>
      {/* method chips (type-style, bucket-colored) */}
      <span className="hidden shrink-0 items-center gap-1 md:flex">
        {row.methods.slice(0, 3).map((m) => {
          const rgb = BUCKET_RGB[methodBucket(m)];
          return (
            <span
              key={m}
              className="rounded-full px-1.5 py-px text-[8px] font-bold uppercase leading-[14px]"
              style={{ color: `rgb(${rgb})`, background: `rgba(${rgb},0.14)` }}
            >
              {nameOfMethod(m, lang)}
            </span>
          );
        })}
        {row.methods.length > 3 && <span className="text-[8px] font-bold text-tx-muted">+{row.methods.length - 3}</span>}
      </span>
      {/* level range */}
      <span className="shrink-0 font-display text-[9px] font-bold tabular-nums text-tx-muted">{lv}</span>
      {/* best rate: micro-bar + % */}
      <span className="flex w-[76px] shrink-0 items-center gap-1.5">
        <span className="h-[3px] flex-1 overflow-hidden rounded-full bg-surface3">
          <motion.span
            className="block h-full rounded-full bg-gold"
            initial={{ width: 0 }}
            whileInView={{ width: `${Math.min(100, row.maxChance)}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </span>
        <span className="w-[28px] text-right font-display text-[10px] font-bold tabular-nums text-tx-primary">
          {Math.min(100, row.maxChance)}%
        </span>
      </span>
      {linked && (
        <>
          <ArrowUpRight size={12} className="shrink-0 text-tx-muted transition-colors duration-150 group-hover/wtf:text-gold" />
          <span className="pointer-events-none absolute right-7 top-1/2 -translate-y-1/2 rounded-[3px] border border-gold/40 bg-surface2 px-1.5 py-0.5 font-pixel text-[7px] text-gold opacity-0 transition-opacity duration-150 group-hover/wtf:opacity-100">
            {t('detail.find.openInMap')}
          </span>
        </>
      )}
    </>
  );

  const cls = cn(
    'group/wtf relative flex h-9 items-center gap-2 border-b border-hairline px-3 transition-colors duration-150 last:border-0',
    linked && 'hover:bg-surface2',
  );

  return linked ? (
    <LocaleLink
      to={`/maps/${region.region}?node=${nodeId}`}
      className={cls}
      title={t('detail.find.openOnMap', { label, region: regionName(region, lang) })}
    >
      {body}
    </LocaleLink>
  ) : (
    <div className={cls} title={t('detail.find.noCoverage')}>
      {body}
    </div>
  );
}

export default function WhereToFind({ id }: { id: number }) {
  const { t } = useTranslation();
  const [areas, setAreas] = useState<EncounterAreaEntry[] | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'empty' | 'error'>('loading');
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    let on = true;
    const apply = (d: EncounterAreaEntry[]) => {
      if (!on) return;
      setAreas(d);
      setStatus(d.length === 0 ? 'empty' : 'ready');
    };
    cachedJson<EncounterAreaEntry[]>(`encounters:${id}`, `https://pokeapi.co/api/v2/pokemon/${id}/encounters`, apply)
      .then(apply)
      .catch(() => {
        if (on) setStatus('error');
      });
    return () => {
      on = false;
    };
  }, [id]);

  const rows = useMemo(() => (areas ? aggregate(areas) : []), [areas]);
  const shown = showAll ? rows : rows.slice(0, TOP_N);

  /* loading skeleton rows */
  if (status === 'loading') {
    return (
      <div className="p-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="dx-skel mb-1.5 h-7 w-full rounded-sm" style={{ animationDelay: `${i * 90}ms` }} />
        ))}
      </div>
    );
  }

  /* gold hint states (never red) */
  if (status === 'empty' || status === 'error') {
    return (
      <div className="grid h-[132px] place-items-center px-4">
        <div className="flex flex-col items-center gap-2 text-center">
          <img src="/pokeball.svg" alt="" className="h-8 w-8 opacity-40" />
          <p className={cn('max-w-[260px] text-[12px] font-semibold leading-snug', status === 'empty' ? 'text-gold' : 'text-tx-muted')}>
            {status === 'empty' ? t('detail.find.empty') : t('detail.find.error')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="dx-scroll max-h-[368px] overflow-y-auto" data-lenis-prevent>
        {shown.map((row) => (
          <RowView key={row.key} row={row} />
        ))}
      </div>
      {rows.length > TOP_N && (
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="flex h-8 w-full items-center justify-center gap-1 border-t border-hairline font-pixel text-[8px] uppercase tracking-[0.08em] text-tx-muted transition-colors duration-150 hover:text-gold"
        >
          {showAll ? t('detail.find.showTop', { count: TOP_N }) : t('detail.find.showAll', { count: rows.length })}
        </button>
      )}
    </div>
  );
}
