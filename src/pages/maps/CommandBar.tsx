/* CommandBar — the 56px ops-deck bar (maps.md §2.1): back, region chip,
 * version chips, SCHEMATIC|ORIGINAL view toggle, WALK/SURF/FISH/OTHER
 * filters, node search, scan status, legend popover, reset view. */
import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { ChevronLeft, Fish, Footprints, Info, Loader2, RotateCcw, Search, Sparkles, Waves, X } from 'lucide-react';
import { LinkKindGlyphs, NodeKindGlyphs } from './LegendGlyphs';
import type { MapNode, RegionMap } from '@/lib/regions';
import { accentRgb, versionChipLabel } from '@/lib/regions';
import type { MethodBucket } from '@/lib/mapdata';
import { cn } from '@/lib/utils';

/** map render mode — persisted in localStorage `pdx2.mapview` (MapRegion) */
export type MapViewMode = 'schematic' | 'original';

const METHODS: Array<{ bucket: MethodBucket; label: string; icon: typeof Footprints }> = [
  { bucket: 'WALK', label: 'WALK', icon: Footprints },
  { bucket: 'SURF', label: 'SURF', icon: Waves },
  { bucket: 'FISH', label: 'FISH', icon: Fish },
  { bucket: 'OTHER', label: 'OTHER', icon: Sparkles },
];

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
  const rgb = accentRgb(region.accent);
  const originalAvailable = region.region === 'kanto';
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [legend, setLegend] = useState(false);
  const blurTimer = useRef(0);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return [];
    return region.nodes
      .filter((n) => n.label.toLowerCase().includes(needle) || n.id.includes(needle))
      .slice(0, 6);
  }, [q, region]);

  const scanning = scanned < total;

  return (
    <div
      key={shakeKey}
      className={cn(
        'sticky top-0 z-40 flex h-14 items-center gap-2.5 overflow-x-auto border-b border-hairline px-3 sm:px-4',
        shakeKey > 0 && 'maps-shake',
      )}
      style={{ background: 'rgba(13,15,22,0.72)', backdropFilter: 'blur(16px) saturate(1.4)' }}
    >
      {/* back */}
      <Link
        to="/maps"
        aria-label="Back to atlas"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-hairline bg-surface2 text-tx-secondary transition-colors hover:border-hairline2 hover:text-gold"
      >
        <ChevronLeft size={16} />
      </Link>

      {/* region chip */}
      <div className="flex shrink-0 items-center gap-2">
        <span className="h-2 w-2 rounded-full" style={{ background: region.accent, boxShadow: `0 0 8px rgba(${rgb},0.9)` }} />
        <span className="font-display text-[13px] font-bold uppercase tracking-wide text-tx-primary">{region.name}</span>
        <span className="pixel-label hidden text-[7px] text-tx-muted sm:inline">{region.gen}</span>
      </div>

      <span className="h-5 w-px shrink-0 bg-hairline" aria-hidden />

      {/* version chips */}
      <div className="flex shrink-0 rounded-pill border border-hairline bg-surface1 p-0.5" role="group" aria-label="Game version">
        {region.versions.map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => onVersion(v)}
            aria-pressed={version === v}
            className="relative rounded-pill px-2 py-1"
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
                'pixel-label relative z-10 text-[8px]',
                version === v ? 'text-gold' : 'text-tx-muted hover:text-tx-secondary',
              )}
            >
              {versionChipLabel(v)}
            </span>
          </button>
        ))}
      </div>

      <span className="h-5 w-px shrink-0 bg-hairline" aria-hidden />

      {/* view toggle — SCHEMATIC | ORIGINAL (Kanto pilot) */}
      <div
        className="flex h-7 shrink-0 items-center rounded-pill border border-hairline bg-surface1 p-0.5"
        role="group"
        aria-label="Map view"
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
              title={disabled ? 'Original map — SOON for this region' : mode === 'original' ? 'Original game map' : 'Schematic transit map'}
              onClick={() => onView(mode)}
              className={cn('relative rounded-pill px-2 py-1', disabled && 'cursor-not-allowed opacity-50')}
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
                  'pixel-label relative z-10 text-[7px]',
                  active ? 'text-tx-primary' : 'text-tx-muted hover:text-tx-secondary',
                )}
              >
                {mode.toUpperCase()}
                {disabled && <span className="ml-1 text-gold/70">SOON</span>}
              </span>
            </button>
          );
        })}
      </div>

      <span className="h-5 w-px shrink-0 bg-hairline" aria-hidden />

      {/* method filters */}
      <div className="flex shrink-0 items-center gap-1" role="group" aria-label="Encounter method filter">
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
                'inline-flex h-8 items-center gap-1 rounded-pill border px-2 text-[10px] font-semibold transition-all duration-150',
                active ? 'border-current' : 'border-hairline text-tx-muted hover:text-tx-secondary',
              )}
              style={
                active
                  ? { color: region.accent, background: `rgba(${rgb},0.16)`, boxShadow: `0 0 10px rgba(${rgb},0.25)` }
                  : undefined
              }
            >
              <Icon size={12} />
              <span className="hidden sm:inline">{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* node search */}
      <div className="relative min-w-[150px] shrink-0">
        <div className="flex h-8 items-center gap-1.5 rounded-md border border-hairline bg-surface2 px-2 transition-colors focus-within:border-hairline2">
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
            placeholder="SEARCH NODE…"
            aria-label="Search map nodes"
            className="pixel-label w-full min-w-0 bg-transparent text-[8px] tracking-wider text-tx-primary outline-none placeholder:text-tx-muted"
          />
          {q && (
            <button type="button" aria-label="Clear" onClick={() => setQ('')} className="text-tx-muted hover:text-tx-primary">
              <X size={12} />
            </button>
          )}
        </div>
        {open && results.length > 0 && (
          <div className="absolute left-0 top-9 z-50 w-[220px] overflow-hidden rounded-md border border-hairline2 bg-surface2 shadow-elevate">
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
                className="flex w-full items-center justify-between gap-2 px-2.5 py-1.5 text-left text-[12px] font-medium text-tx-secondary transition-colors hover:bg-surface3 hover:text-tx-primary"
              >
                <span className="truncate">{n.label}</span>
                <span className="pixel-label shrink-0 text-[7px] text-tx-muted">
                  #{n.order} {n.kind.toUpperCase()}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1" />

      {/* scan status */}
      {offline ? (
        <span className="pixel-label inline-flex shrink-0 items-center gap-1.5 text-[8px] text-gold">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          OFFLINE — CACHED
        </span>
      ) : scanning ? (
        <span className="pixel-label inline-flex shrink-0 items-center gap-1.5 text-[8px] text-tx-secondary" aria-live="polite">
          <Loader2 size={11} className="animate-spin" style={{ color: region.accent }} />
          SCANNING {scanned}/{total}
        </span>
      ) : (
        <span className="pixel-label inline-flex shrink-0 items-center gap-1.5 text-[8px] text-tx-secondary">
          <span className="h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_6px_rgba(246,201,69,0.9)]" />
          ONLINE
        </span>
      )}

      {/* legend popover */}
      <div className="relative shrink-0">
        <button
          type="button"
          aria-label="Map legend"
          aria-expanded={legend}
          onClick={() => setLegend((s) => !s)}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-hairline bg-surface2 text-tx-secondary transition-colors hover:border-hairline2 hover:text-gold"
        >
          <Info size={14} />
        </button>
        {legend && (
          <>
            <button
              type="button"
              aria-label="Close legend"
              className="fixed inset-0 z-40 cursor-default"
              onClick={() => setLegend(false)}
            />
            <div className="absolute right-0 top-10 z-50 w-[240px] rounded-md border border-hairline2 bg-surface2 p-3.5 shadow-elevate">
              <div className="pixel-label mb-2.5 text-[8px] text-tx-muted">NODE KINDS</div>
              <NodeKindGlyphs />
              <div className="pixel-label mb-2.5 mt-4 text-[8px] text-tx-muted">LINK KINDS</div>
              <LinkKindGlyphs />
              <p className="mt-4 border-t border-hairline pt-2.5 text-[10px] font-medium leading-relaxed text-tx-muted">
                Gold star = special · dashed = post-game. Edges are schematic, not to scale.
              </p>
            </div>
          </>
        )}
      </div>

      {/* reset view */}
      <button
        type="button"
        onClick={onResetView}
        className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border border-hairline bg-surface2 px-2.5 text-[11px] font-semibold text-tx-secondary transition-colors hover:border-hairline2 hover:text-gold"
      >
        <RotateCcw size={13} />
        <span className="hidden sm:inline">RESET VIEW</span>
      </button>
    </div>
  );
}
