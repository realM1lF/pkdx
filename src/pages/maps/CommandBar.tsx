/* CommandBar — the 56px ops-deck bar (maps.md §2.1): back, region chip,
 * version chips, SCHEMATIC|ORIGINAL view toggle, WALK/SURF/FISH/OTHER
 * filters, node search, scan status, legend popover, reset view. */
import { useMemo, useRef, useState } from 'react';
import { originalAvailable as hasOriginalGeo } from '@/lib/maps-geo';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { LocaleLink } from '@/lib/locale-link';
import { ChevronLeft, Fish, Footprints, Info, Loader2, RotateCcw, Search, Sparkles, Waves, X } from 'lucide-react';
import { LinkKindGlyphs, NodeKindGlyphs } from './LegendGlyphs';
import { resolveInteractiveMapLink } from '@/lib/interactive-maps';
import type { MapNode, RegionMap } from '@/lib/regions';
import { accentRgb, nodeName, regionName, versionChipLabel } from '@/lib/regions';
import { useLanguage } from '@/lib/i18n-data';
import type { MethodBucket } from '@/lib/mapdata';
import { cn } from '@/lib/utils';

/** map render mode — persisted in localStorage `pdx2.mapview` (MapRegion) */
export type MapViewMode = 'schematic' | 'original';

const METHODS: Array<{ bucket: MethodBucket; labelKey: string; icon: typeof Footprints }> = [
  { bucket: 'WALK', labelKey: 'maps.walk', icon: Footprints },
  { bucket: 'SURF', labelKey: 'maps.surf', icon: Waves },
  { bucket: 'FISH', labelKey: 'maps.fish', icon: Fish },
  { bucket: 'OTHER', labelKey: 'maps.other', icon: Sparkles },
];

/** Fixed height so the active pill (layoutId thumb) matches label bounds with leading-[0]. */
const VIEW_TOGGLE_ITEM = 'relative inline-flex h-6 items-center justify-center rounded-pill px-2';
const VIEW_TOGGLE_LABEL = 'pixel-label relative z-10 text-[7px] leading-[0]';

interface CommandBarProps {
  region: RegionMap;
  version: string;
  onVersion: (v: string) => void;
  methods: ReadonlySet<MethodBucket>;
  onToggleMethod: (m: MethodBucket) => void;
  onPickNode: (n: MapNode) => void;
  scanned: number;
  total: number;
  offline: boolean;
  onResetView: () => void;
  /** bumped to retrigger the empty-filter shake (gold feedback, §6.2-9) */
  shakeKey: number;
  view: MapViewMode;
  onView: (v: MapViewMode) => void;
}

export default function CommandBar({
  region,
  version,
  onVersion,
  methods,
  onToggleMethod,
  onPickNode,
  scanned,
  total,
  offline,
  onResetView,
  shakeKey,
  view,
  onView,
}: CommandBarProps) {
  const { t } = useTranslation();
  const lang = useLanguage();
  const rgb = accentRgb(region.accent);
  const originalAvailable = hasOriginalGeo(region.region);
  const interactive = resolveInteractiveMapLink(region.region, version);
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [legend, setLegend] = useState(false);
  const blurTimer = useRef(0);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return [];
    return region.nodes
      .filter(
        (n) =>
          n.label.toLowerCase().includes(needle) ||
          n.id.includes(needle) ||
          (n.nameDe?.toLowerCase().includes(needle) ?? false),
      )
      .slice(0, 6);
  }, [q, region]);

  const scanning = scanned < total;

  return (
    <div
      key={shakeKey}
      className={cn(
        'sticky top-0 z-50 shrink-0 border-b border-hairline',
        shakeKey > 0 && 'maps-shake',
      )}
      style={{ background: 'rgba(13,15,22,0.72)', backdropFilter: 'blur(16px) saturate(1.4)' }}
    >
      <div className="flex flex-wrap items-center gap-2 px-3 py-2 sm:h-14 sm:min-h-14 sm:max-h-14 sm:flex-nowrap sm:gap-2.5 sm:px-4 sm:py-0">
        {/* pinned left */}
        <LocaleLink
          to="/maps"
          aria-label={t('maps.backAtlas')}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-hairline bg-surface2 text-tx-secondary transition-colors hover:border-hairline2 hover:text-gold sm:h-8 sm:w-8"
        >
          <ChevronLeft size={16} />
        </LocaleLink>

        <div className="flex shrink-0 items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: region.accent, boxShadow: `0 0 8px rgba(${rgb},0.9)` }} />
          <span className="font-display text-[13px] font-bold uppercase tracking-wide text-tx-primary">{regionName(region, lang)}</span>
          <span className="pixel-label hidden text-[7px] leading-none text-tx-muted sm:inline">{region.gen}</span>
        </div>

        <span className="h-5 w-px shrink-0 bg-hairline" aria-hidden />

        {/* scrollable middle — full-width second row on mobile, fixed 56px height on sm+ */}
        <div className="maps-bar-scroll order-last flex h-11 w-full min-w-0 flex-1 items-center gap-2.5 sm:order-none sm:h-14 sm:w-auto">
          <div
            id="maps-version-switcher"
            className="flex shrink-0 rounded-pill border border-hairline bg-surface1 p-0.5"
            role="group"
            aria-label={t('maps.version')}
            tabIndex={-1}
          >
            {region.versions.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => onVersion(v)}
                aria-pressed={version === v}
                className="relative rounded-pill px-2.5 py-2.5 sm:px-2 sm:py-1"
              >
                {version === v && (
                  <motion.span
                    layoutId="maps-version-thumb"
                    className="absolute inset-0 rounded-pill border border-gold/60 bg-surface3"
                    transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                  />
                )}
                <span
                  className={cn(
                    'pixel-label relative z-10 text-[8px] leading-none',
                    version === v ? 'text-gold' : 'text-tx-muted hover:text-tx-secondary',
                  )}
                >
                  {versionChipLabel(v)}
                </span>
              </button>
            ))}
          </div>

          <span className="h-5 w-px shrink-0 bg-hairline" aria-hidden />

          <div
            className="flex h-11 shrink-0 items-center rounded-pill border border-hairline bg-surface1 p-0.5 sm:h-7"
            role="group"
            aria-label={t('maps.view')}
          >
            {(['schematic', 'original'] as const).map((mode) => {
              const disabled = mode === 'original' && !originalAvailable;
              const active = view === mode && !disabled;
              return (
                <button
                  key={mode}
                  type="button"
                  disabled={disabled}
                  aria-pressed={active}
                  title={disabled ? t('maps.viewSoon') : mode === 'original' ? t('maps.viewOriginal') : t('maps.viewSchematic')}
                  onClick={() => onView(mode)}
                  className={cn(VIEW_TOGGLE_ITEM, disabled && 'cursor-not-allowed opacity-50')}
                >
                  {active && (
                    <motion.span
                      layoutId="maps-view-thumb"
                      className="absolute inset-0 rounded-pill border"
                      style={{ borderColor: `rgba(${rgb},0.6)`, background: `rgba(${rgb},0.16)` }}
                      transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                    />
                  )}
                  <span
                    className={cn(
                      VIEW_TOGGLE_LABEL,
                      active ? 'text-tx-primary' : 'text-tx-muted hover:text-tx-secondary',
                    )}
                  >
                    {t(`maps.${mode}`)}
                    {disabled && <span className="ml-1 text-gold/70">{t('maps.soon')}</span>}
                  </span>
                </button>
              );
            })}
            {interactive && (
              <a
                href={interactive.url}
                target="_blank"
                rel="noopener noreferrer"
                title={t('maps.interactiveTitle', { site: interactive.site, game: interactive.game })}
                className={cn(VIEW_TOGGLE_ITEM, 'text-tx-muted transition-colors hover:text-gold')}
              >
                <span className={cn(VIEW_TOGGLE_LABEL, 'inline-flex items-center gap-0.5')}>
                  {t('maps.interactiveCta')}
                  <span aria-hidden className="text-[8px] leading-[0] opacity-80">
                    ↗
                  </span>
                </span>
              </a>
            )}
          </div>

          <span className="h-5 w-px shrink-0 bg-hairline" aria-hidden />

          <div className="flex shrink-0 items-center gap-1 pr-1" role="group" aria-label={t('maps.methodAria')}>
            {METHODS.map((m) => {
              const active = methods.has(m.bucket);
              const Icon = m.icon;
              return (
                <button
                  key={m.bucket}
                  type="button"
                  aria-pressed={active}
                  onClick={() => onToggleMethod(m.bucket)}
                  className={cn(
                    'inline-flex h-11 shrink-0 items-center gap-1 rounded-pill border px-2.5 text-[10px] font-semibold leading-none transition-all duration-150 sm:h-8 sm:px-2',
                    active ? 'border-current' : 'border-hairline text-tx-muted hover:text-tx-secondary',
                  )}
                  style={
                    active
                      ? { color: region.accent, background: `rgba(${rgb},0.16)`, boxShadow: `0 0 10px rgba(${rgb},0.25)` }
                      : undefined
                  }
                >
                  <Icon size={12} />
                  <span className="hidden sm:inline">{t(m.labelKey)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* pinned right — search + status + actions (outside scroll so dropdown is not clipped) */}
        <div className="ml-auto flex shrink-0 items-center gap-2 sm:ml-0 sm:gap-2.5">
          <div className="relative w-[120px] sm:w-[150px]">
            <div className="flex h-11 items-center gap-1.5 rounded-md border border-hairline bg-surface2 px-2 transition-colors focus-within:border-hairline2 sm:h-8">
              <Search size={13} className="shrink-0 text-tx-muted" />
              <input
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                onBlur={() => {
                  blurTimer.current = window.setTimeout(() => setOpen(false), 120);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && results.length > 0) {
                    onPickNode(results[0]);
                    setQ('');
                    setOpen(false);
                  } else if (e.key === 'Escape') {
                    setQ('');
                    setOpen(false);
                  }
                }}
                placeholder={t('maps.searchPlaceholder')}
                aria-label={t('maps.searchAria')}
                className="pixel-label w-full min-w-0 bg-transparent text-[8px] leading-none tracking-wider text-tx-primary outline-none placeholder:text-tx-muted"
              />
              {q && (
                <button type="button" aria-label={t('maps.clear')} onClick={() => setQ('')} className="text-tx-muted hover:text-tx-primary">
                  <X size={12} />
                </button>
              )}
            </div>
            {open && results.length > 0 && (
              <div className="absolute right-0 top-[calc(100%+4px)] z-[70] w-[240px] overflow-hidden rounded-md border border-hairline2 bg-surface2 shadow-elevate">
                {results.map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      onPickNode(n);
                      setQ('');
                      setOpen(false);
                    }}
                    className="flex w-full items-center justify-between gap-2 px-2.5 py-2 text-left font-sans text-[13px] font-semibold text-tx-primary transition-colors hover:bg-surface3"
                  >
                    <span className="truncate">{nodeName(n, lang)}</span>
                    <span className="pixel-label shrink-0 text-[7px] text-tx-muted">
                      #{n.order}{' '}
                      {t(`maps.kind${n.kind.charAt(0).toUpperCase() + n.kind.slice(1)}`, { defaultValue: n.kind.toUpperCase() })}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {offline ? (
            <span className="pixel-label hidden shrink-0 items-center gap-1.5 text-[8px] leading-none text-gold md:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              {t('maps.offline')}
            </span>
          ) : scanning ? (
            <span className="pixel-label hidden shrink-0 items-center gap-1.5 text-[8px] leading-none text-tx-secondary md:inline-flex" aria-live="polite">
              <Loader2 size={11} className="animate-spin" style={{ color: region.accent }} />
              {t('maps.scanning', { scanned, total })}
            </span>
          ) : (
            <span className="pixel-label hidden shrink-0 items-center gap-1.5 text-[8px] leading-none text-tx-secondary md:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_6px_rgba(246,201,69,0.9)]" />
              {t('maps.online')}
            </span>
          )}

          <div className="relative shrink-0">
            <button
              type="button"
              aria-label={t('maps.legend')}
              aria-expanded={legend}
              onClick={() => setLegend((s) => !s)}
              className="flex h-11 w-11 items-center justify-center rounded-md border border-hairline bg-surface2 text-tx-secondary transition-colors hover:border-hairline2 hover:text-gold sm:h-8 sm:w-8"
            >
              <Info size={14} />
            </button>
            {legend && (
              <>
                <button
                  type="button"
                  aria-label={t('maps.closeLegend')}
                  className="fixed inset-0 z-40 cursor-default"
                  onClick={() => setLegend(false)}
                />
                <div className="absolute right-0 top-10 z-50 w-[240px] rounded-md border border-hairline2 bg-surface2 p-3.5 shadow-elevate">
                  <div className="pixel-label mb-2.5 text-[8px] text-tx-muted">{t('maps.howNodeKinds')}</div>
                  <NodeKindGlyphs />
                  <div className="pixel-label mb-2.5 mt-4 text-[8px] text-tx-muted">{t('maps.howLinkKinds')}</div>
                  <LinkKindGlyphs />
                  <p className="mt-4 border-t border-hairline pt-2.5 text-[10px] font-medium leading-relaxed text-tx-muted">
                    {t('maps.legendNote')}
                    {interactive && <> {t('maps.legendInteractive', { site: interactive.site })}</>}
                  </p>
                </div>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={onResetView}
            className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-md border border-hairline bg-surface2 px-3 text-[11px] font-semibold leading-none text-tx-secondary transition-colors hover:border-hairline2 hover:text-gold sm:h-8 sm:px-2.5"
          >
            <RotateCcw size={13} />
            <span className="hidden sm:inline">{t('maps.resetView')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
