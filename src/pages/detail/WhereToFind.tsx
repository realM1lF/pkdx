/* WHERE TO FIND panel — /pokemon/:id (density-addendum §3, Row 3 stack).
 * Data: pokemon/{id}/encounters via cachedJson (SWR). Location-area slugs
 * resolve to shared RegionMap nodes via node.locationSlug — strip '-area',
 * then longest-prefix strip sub-areas ('rock-tunnel-1f' → 'rock-tunnel');
 * kanto victory-road variants → 'kanto-victory-road-2'.
 *
 * Wild rows are aggregated per node. `?v=` (and the compact chips) keep
 * only that game's rate — Pidgey Route 1 is 20% FireRed vs 45% HeartGold.
 * Without a filter, all versions stay visible (best rate wins) so we
 * never hide data. Gift / static / trade stay in their own section.
 * Rows deep-link /maps/{region}?node=&v= when the map covers a row version. */
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { cachedJson } from '@/lib/pokeapi';
import { nameOfMethod, useLanguage } from '@/lib/i18n-data';
import { LocaleLink } from '@/lib/locale-link';
import { accentRgb, nodeName, regionName, versionChipLabel } from '@/lib/regions';
import type { RegionId } from '@/lib/regions';
import { methodBucket } from '@/lib/mapdata';
import type { MethodBucket } from '@/lib/mapdata';
import { aggregate, encounterVersions, mapsPath } from '@/lib/wherefind';
import type { EncounterAreaEntry, WhereRow } from '@/lib/wherefind';
import HonestyHint from '@/components/HonestyHint';
import { cn } from '@/lib/utils';
import type { MapsFromRef } from './from-param';

/* ---------- presentation ---------- */

const BUCKET_RGB: Record<MethodBucket, string> = {
  WALK: '99,217,107', // grass
  SURF: '69,200,255', // water
  FISH: '121,232,224', // ice
  OTHER: '168,176,196', // muted
};

const REGION_ABBR: Record<RegionId, string> = { kanto: 'KAN', johto: 'JOH', hoenn: 'HOE', sinnoh: 'SIN', unova: 'UNO' };

const TOP_N = 12;

function RowView({ row, highlight, filter }: { row: WhereRow; highlight: boolean; filter: string | null }) {
  const { t } = useTranslation();
  const lang = useLanguage();
  const region = row.region;
  const nodeId = row.nodeId;
  /* deep-link only when the map actually covers one of the row's versions —
   * a Blue-JP game-corner prize must not jump to the FRLG/RBY Kanto map */
  const linked =
    nodeId !== null && region !== null && row.versions.some((v) => region.versions.includes(v));
  const mapVersion =
    (filter && row.versions.includes(filter) ? filter : null) ??
    row.versions.find((v) => region?.versions.includes(v)) ??
    null;
  const accent = region?.accent ?? null;
  const abbr = row.region ? REGION_ABBR[row.region.region] : row.regionPrefix.slice(0, 3).toUpperCase();
  const lv =
    row.minLevel === row.maxLevel
      ? t('detail.find.level', { level: row.minLevel })
      : t('detail.find.levelRange', { min: row.minLevel, max: row.maxLevel });
  const label = row.node ? nodeName(row.node, lang) : row.label;
  const versionTitle = row.versions.map(versionChipLabel).join(' · ');

  const body = (
    <>
      {/* region accent chip */}
      <span
        className={cn(
          'w-[2rem] shrink-0 rounded-[0.1875rem] border px-0.5 text-center font-pixel text-[8px] leading-[0.875rem]',
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
      {/* route display name (+ uniform sub-area like 'PRIZE CORNER') */}
      <span className="min-w-0 flex-1 truncate text-micro12 font-semibold text-tx-primary">
        {label}
        {row.sub && <span className="font-normal text-tx-muted"> · {row.sub}</span>}
        {highlight && (
          <span className="ml-1 font-pixel text-[8px] uppercase tracking-[0.06em] text-gold">{t('detail.find.fromHere')}</span>
        )}
      </span>
      {/* method chips (type-style, bucket-colored) */}
      <span className="hidden shrink-0 items-center gap-1 md:flex">
        {row.methods.slice(0, 3).map((m) => {
          const rgb = BUCKET_RGB[methodBucket(m)];
          return (
            <span
              key={m}
              className="rounded-full px-1.5 py-px text-micro8 font-bold uppercase leading-[0.875rem]"
              style={{ color: `rgb(${rgb})`, background: `rgba(${rgb},0.14)` }}
            >
              {nameOfMethod(m, lang)}
            </span>
          );
        })}
        {row.methods.length > 3 && <span className="text-micro8 font-bold text-tx-muted">+{row.methods.length - 3}</span>}
      </span>
      {/* level range */}
      <span className="shrink-0 font-display text-micro9 font-bold tabular-nums text-tx-muted">{lv}</span>
      {row.special ? (
        /* gift/static: version chips instead of a misleading "100% rate" bar */
        <span className="flex w-[4.75rem] shrink-0 flex-wrap justify-end gap-0.5" title={versionTitle}>
          {row.versions.slice(0, 3).map((v) => (
            <span
              key={v}
              className="rounded-[0.1875rem] border border-gold/40 bg-gold/10 px-1 font-pixel text-[8px] leading-[0.875rem] text-gold"
            >
              {versionChipLabel(v)}
            </span>
          ))}
          {row.versions.length > 3 && (
            <span className="text-micro8 font-bold text-tx-muted">+{row.versions.length - 3}</span>
          )}
        </span>
      ) : (
        /* best rate: micro-bar + % */
        <span className="flex w-[4.75rem] shrink-0 items-center gap-1.5" title={versionTitle}>
          <span className="h-[0.1875rem] flex-1 overflow-hidden rounded-full bg-surface3">
            <motion.span
              className="block h-full rounded-full bg-gold"
              initial={{ width: 0 }}
              whileInView={{ width: `${Math.min(100, row.maxChance)}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </span>
          <span className="w-[1.75rem] text-right font-display text-micro10 font-bold tabular-nums text-tx-primary">
            {Math.min(100, row.maxChance)}%
          </span>
        </span>
      )}
      {linked && (
        <>
          <ArrowUpRight size={12} className="shrink-0 text-tx-muted transition-colors duration-150 group-hover/wtf:text-gold" />
          <span className="pointer-events-none absolute right-7 top-1/2 -translate-y-1/2 rounded-[0.1875rem] border border-gold/40 bg-surface2 px-1.5 py-0.5 font-pixel text-[8px] text-gold opacity-0 transition-opacity duration-150 group-hover/wtf:opacity-100">
            {t('detail.find.openInMap')}
          </span>
        </>
      )}
    </>
  );

  const cls = cn(
    'group/wtf relative flex h-9 items-center gap-2 border-b border-hairline px-3 transition-colors duration-150 last:border-0',
    linked && 'hover:bg-surface2',
    highlight && 'bg-gold/10 ring-1 ring-inset ring-gold/50',
  );

  if (linked && region && nodeId) {
    return (
      <LocaleLink
        to={mapsPath(region.region, nodeId, mapVersion)}
        className={cls}
        data-wtf-from={highlight || undefined}
        title={t('detail.find.openOnMap', { label, region: regionName(region, lang) })}
      >
        {body}
      </LocaleLink>
    );
  }
  return (
    <div
      className={cls}
      data-wtf-from={highlight || undefined}
      title={
        row.nodeId !== null
          ? t('detail.find.otherVersions', { versions: versionTitle })
          : t('detail.find.noCoverage')
      }
    >
      {body}
    </div>
  );
}

export default function WhereToFind({
  id,
  highlight,
  version: versionParam,
  editionGames,
}: {
  id: number;
  highlight?: MapsFromRef | null;
  version?: string | null;
  /** when set and `?v=` is empty/invalid, keep only these games (the active edition) */
  editionGames?: readonly string[];
}) {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
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

  const versions = useMemo(() => {
    const all = areas ? encounterVersions(areas) : [];
    if (!editionGames?.length) return all;
    const allowed = new Set(editionGames);
    return all.filter((v) => allowed.has(v));
  }, [areas, editionGames]);
  const active = versionParam && versions.includes(versionParam) ? versionParam : null;
  const rows = useMemo(
    () => (areas ? aggregate(areas, active ?? (editionGames?.length ? editionGames : null)) : []),
    [areas, active, editionGames],
  );
  /* wild encounters vs. gift/static/trade — separate sections so a one-off
   * prize (e.g. Clefable @ Celadon prize corner, Blue JP only) never reads
   * as a wild encounter */
  const wild = useMemo(() => rows.filter((r) => !r.special), [rows]);
  const special = useMemo(
    () => rows.filter((r) => r.special).sort((a, b) => a.label.localeCompare(b.label)),
    [rows],
  );
  const shown = showAll ? wild : wild.slice(0, TOP_N);
  const isFrom = (row: WhereRow) =>
    Boolean(highlight && row.region?.region === highlight.region && row.nodeId === highlight.nodeId);

  useEffect(() => {
    setShowAll(false);
  }, [active]);

  useEffect(() => {
    if (!highlight) return;
    const beyond = wild.findIndex((r) => isFrom(r));
    if (beyond >= TOP_N) setShowAll(true);
  }, [highlight, wild]);

  const setVersion = (v: string | null) => {
    const next = new URLSearchParams(searchParams);
    if (v) next.set('v', v);
    else next.delete('v');
    setSearchParams(next, { replace: true });
  };

  useEffect(() => {
    document.querySelector('[data-wtf-from]')?.scrollIntoView({ block: 'nearest' });
  }, [shown, special, highlight]);

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
  if (status === 'empty' || status === 'error' || (wild.length === 0 && special.length === 0)) {
    const nothingWild = status !== 'error';
    return (
      <div className="grid h-[8.25rem] place-items-center px-4">
        <div className="flex flex-col items-center gap-2 text-center">
          <img src="/pokeball.svg" alt="" className="h-8 w-8 opacity-40" />
          <p className={cn('max-w-[16.25rem] text-micro12 font-semibold leading-snug', nothingWild ? 'text-gold' : 'text-tx-muted')}>
            {nothingWild ? t('detail.find.empty') : t('detail.find.error')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {versions.length > 1 && (
        <div
          className="flex h-9 min-w-0 items-center gap-1 overflow-x-auto border-b border-hairline px-3"
          data-lenis-prevent
          role="group"
          aria-label={t('detail.where.versions')}
        >
          <button
            type="button"
            aria-pressed={active === null}
            onClick={() => setVersion(null)}
            className={cn(
              'shrink-0 rounded-[0.1875rem] border px-1.5 font-pixel text-[8px] leading-[1.125rem] uppercase',
              active === null
                ? 'border-gold/60 bg-gold/10 text-gold'
                : 'border-hairline text-tx-muted hover:border-hairline2 hover:text-tx-secondary',
            )}
          >
            {t('detail.where.all')}
          </button>
          {versions.map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={active === v}
              onClick={() => setVersion(v)}
              title={versionChipLabel(v)}
              className={cn(
                'min-w-0 shrink-0 truncate rounded-[0.1875rem] border px-1.5 font-pixel text-[8px] leading-[1.125rem] uppercase',
                active === v
                  ? 'border-gold/60 bg-gold/10 text-gold'
                  : 'border-hairline text-tx-muted hover:border-hairline2 hover:text-tx-secondary',
              )}
            >
              {versionChipLabel(v)}
            </button>
          ))}
        </div>
      )}
      <HonestyHint show={active === null && versions.length > 1} className="border-b border-hairline px-3 py-1.5" truncate>
        {t('honesty.siblingMix')}
      </HonestyHint>
      <div className="dx-scroll max-h-[23rem] overflow-y-auto" data-lenis-prevent>
        {wild.length === 0 && (
          /* species exists only as gift/static/trade (e.g. starters) */
          <p className="border-b border-hairline px-3 py-2 text-micro11 font-semibold leading-snug text-gold">
            {t('detail.find.empty')}
          </p>
        )}
        {shown.map((row) => (
          <RowView key={row.key} row={row} highlight={isFrom(row)} filter={active} />
        ))}
        {special.length > 0 && (
          <>
            <p className="border-b border-t border-hairline bg-surface2/60 px-3 py-1 font-pixel text-[8px] uppercase tracking-[0.08em] text-gold">
              {t('detail.find.special')}
            </p>
            {special.map((row) => (
              <RowView key={row.key} row={row} highlight={isFrom(row)} filter={active} />
            ))}
          </>
        )}
      </div>
      {wild.length > TOP_N && (
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="flex h-8 w-full items-center justify-center gap-1 border-t border-hairline font-pixel text-[8px] uppercase tracking-[0.08em] text-tx-muted transition-colors duration-150 hover:text-gold"
        >
          {showAll ? t('detail.find.showTop', { count: TOP_N }) : t('detail.find.showAll', { count: wild.length })}
        </button>
      )}
    </div>
  );
}
