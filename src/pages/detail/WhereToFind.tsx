/* WHERE TO FIND panel — /pokemon/:id (density-addendum §3, Row 3 stack).
 * Data: pokemon/{id}/encounters via cachedJson (SWR). Location-area slugs
 * resolve to shared RegionMap nodes via node.locationSlug — strip '-area',
 * then longest-prefix strip sub-areas ('rock-tunnel-1f' → 'rock-tunnel');
 * kanto victory-road variants → 'kanto-victory-road-2'.
 *
 * Wild rows are aggregated per node across all versions (best rate wins).
 * Gift / static / trade encounters (STATIC_METHODS — e.g. game-corner
 * prizes, Poké-Flute Snorlax, in-game trades) are split into their own
 * "gift & static" section with the specific sub-area ('PRIZE CORNER') and
 * version chips, so a one-off gift never reads as a wild encounter.
 * Rows only deep-link /maps/{region}?node= when one of their versions is
 * actually covered by that map (a Blue-JP-only prize must not link to the
 * FRLG/RBY Kanto map). */
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cachedJson } from '@/lib/pokeapi';
import { nameOfMethod, useLanguage } from '@/lib/i18n-data';
import { LocaleLink } from '@/lib/locale-link';
import { accentRgb, nodeName, regionName, versionChipLabel } from '@/lib/regions';
import type { RegionId } from '@/lib/regions';
import { methodBucket } from '@/lib/mapdata';
import type { MethodBucket } from '@/lib/mapdata';
import { aggregate } from '@/lib/wherefind';
import type { EncounterAreaEntry, WhereRow } from '@/lib/wherefind';
import { cn } from '@/lib/utils';

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
  /* deep-link only when the map actually covers one of the row's versions —
   * a Blue-JP game-corner prize must not jump to the FRLG/RBY Kanto map */
  const linked =
    nodeId !== null && region !== null && row.versions.some((v) => region.versions.includes(v));
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
      {/* route display name (+ uniform sub-area like 'PRIZE CORNER') */}
      <span className="min-w-0 flex-1 truncate text-[12px] font-semibold text-tx-primary">
        {label}
        {row.sub && <span className="font-normal text-tx-muted"> · {row.sub}</span>}
      </span>
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
      {row.special ? (
        /* gift/static: version chips instead of a misleading "100% rate" bar */
        <span className="flex w-[76px] shrink-0 flex-wrap justify-end gap-0.5" title={versionTitle}>
          {row.versions.slice(0, 3).map((v) => (
            <span
              key={v}
              className="rounded-[3px] border border-gold/40 bg-gold/10 px-1 font-pixel text-[7px] leading-[14px] text-gold"
            >
              {versionChipLabel(v)}
            </span>
          ))}
          {row.versions.length > 3 && (
            <span className="text-[8px] font-bold text-tx-muted">+{row.versions.length - 3}</span>
          )}
        </span>
      ) : (
        /* best rate: micro-bar + % */
        <span className="flex w-[76px] shrink-0 items-center gap-1.5" title={versionTitle}>
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
      )}
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

  if (linked && region) {
    return (
      <LocaleLink
        to={`/maps/${region.region}?node=${nodeId}`}
        className={cls}
        title={t('detail.find.openOnMap', { label, region: regionName(region, lang) })}
      >
        {body}
      </LocaleLink>
    );
  }
  return (
    <div
      className={cls}
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
  /* wild encounters vs. gift/static/trade — separate sections so a one-off
   * prize (e.g. Clefable @ Celadon prize corner, Blue JP only) never reads
   * as a wild encounter */
  const wild = useMemo(() => rows.filter((r) => !r.special), [rows]);
  const special = useMemo(
    () => rows.filter((r) => r.special).sort((a, b) => a.label.localeCompare(b.label)),
    [rows],
  );
  const shown = showAll ? wild : wild.slice(0, TOP_N);

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
      <div className="grid h-[132px] place-items-center px-4">
        <div className="flex flex-col items-center gap-2 text-center">
          <img src="/pokeball.svg" alt="" className="h-8 w-8 opacity-40" />
          <p className={cn('max-w-[260px] text-[12px] font-semibold leading-snug', nothingWild ? 'text-gold' : 'text-tx-muted')}>
            {nothingWild ? t('detail.find.empty') : t('detail.find.error')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="dx-scroll max-h-[368px] overflow-y-auto">
        {wild.length === 0 && (
          /* species exists only as gift/static/trade (e.g. starters) */
          <p className="border-b border-hairline px-3 py-2 text-[11px] font-semibold leading-snug text-gold">
            {t('detail.find.empty')}
          </p>
        )}
        {shown.map((row) => (
          <RowView key={row.key} row={row} />
        ))}
        {special.length > 0 && (
          <>
            <p className="border-b border-t border-hairline bg-surface2/60 px-3 py-1 font-pixel text-[7px] uppercase tracking-[0.08em] text-gold">
              {t('detail.find.special')}
            </p>
            {special.map((row) => (
              <RowView key={row.key} row={row} />
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
