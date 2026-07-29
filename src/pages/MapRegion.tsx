/* MapRegion — `/maps/:region` ops-deck (maps.md §2): 56px command bar,
 * left KPI rail, SVG transit-map canvas, 400px detail drawer, minimap.
 * Deep links ?node= / ?v= · progressive scan light-up · desktop full-deck. */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { LocaleLink } from '@/lib/locale-link';
import { AnimatePresence, useReducedMotion } from 'framer-motion';
import CommandBar from './maps/CommandBar';
import type { MapViewMode } from './maps/CommandBar';
import LeftRail, { computeRailStats } from './maps/LeftRail';
import MapCanvas from './maps/MapCanvas';
import OriginalCanvas from './maps/OriginalCanvas';
import { originalAvailable } from '@/lib/maps-geo';
import DetailDrawer from './maps/DetailDrawer';
import Minimap from './maps/Minimap';
import { useMapCamera } from './maps/useMapCamera';
import type { MapNode } from '@/lib/regions';
import { nodeIndex, regionById, viewBoxParts } from '@/lib/regions';
import type { MethodBucket } from '@/lib/mapdata';
import { METHOD_BUCKETS, useRegionData } from '@/lib/mapdata';
import { getLenis } from '@/lib/smooth';
import { cn } from '@/lib/utils';
import './maps/maps.css';

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const fn = () => setMatches(mq.matches);
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, [query]);
  return matches;
}

/* ---- 404: unknown region id (maps.md §2.7) ---- */

function UnchartedSector() {
  const { t } = useTranslation();
  return (
    <div className="relative flex min-h-[70dvh] flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* glitch map-grid silhouette */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.05]" aria-hidden>
        <defs>
          <pattern id="uncharted-grid" width={48} height={48} patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#F4F6FC" strokeWidth={1} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#uncharted-grid)" />
      </svg>
      <p className="pixel-label text-[10px] text-gold">ERROR — 404</p>
      <h1 className="mt-4 font-display text-[clamp(28px,4vw,44px)] font-extrabold uppercase text-tx-primary">
        {t('maps.uncharted')}
      </h1>
      <p className="mt-3 max-w-[420px] text-[14px] font-medium text-tx-secondary">
        {t('maps.unchartedBody')}
      </p>
      <LocaleLink
        to="/maps"
        className="mt-6 inline-flex h-11 items-center rounded-md border border-gold/60 bg-gradient-to-br from-gold/25 to-gold/10 px-6 font-display text-[13px] font-bold uppercase tracking-wider text-tx-primary transition-all hover:-translate-y-0.5 hover:shadow-[0_0_24px_rgba(246,201,69,0.35)]"
      >
        {t('maps.backToAtlas')}
      </LocaleLink>
    </div>
  );
}

/* ---- the deck ---- */

function MapRegionDeck({ region }: { region: NonNullable<ReturnType<typeof regionById>> }) {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const motionOk = !useReducedMotion();
  const isMobile = !useMediaQuery('(min-width: 1024px)');
  const byId = useMemo(() => nodeIndex(region), [region]);

  /* version state — ?v= deep link */
  const [version, setVersion] = useState(() => {
    const v = searchParams.get('v');
    return v && region.versions.includes(v) ? v : region.defaultVersion;
  });

  /* node selection — ?node= deep link */
  const [selectedId, setSelectedId] = useState<string | null>(() => {
    const n = searchParams.get('node');
    return n && byId.has(n) ? n : null;
  });

  const [methods, setMethods] = useState<ReadonlySet<MethodBucket>>(() => new Set(METHOD_BUCKETS));
  const [shakeKey, setShakeKey] = useState(0);

  /* SCHEMATIC | ORIGINAL view — persisted (Kanto pilot; others: ORIGINAL disabled) */
  const [view, setView] = useState<MapViewMode>(() => {
    try {
      return window.localStorage.getItem('pdx2.mapview') === 'original' ? 'original' : 'schematic';
    } catch {
      return 'schematic';
    }
  });
  const [origResetSignal, setOrigResetSignal] = useState(0);
  const effectiveView: MapViewMode = originalAvailable(region.region) ? view : 'schematic';
  useEffect(() => {
    try {
      window.localStorage.setItem('pdx2.mapview', view);
    } catch {
      /* private mode — ignore */
    }
  }, [view]);

  const { data, scanned, total, scanning, offline } = useRegionData(region, version);

  const [, , vbW, vbH] = viewBoxParts(region);
  const camera = useMapCamera(vbW, vbH, region.region);

  /* desktop: lock page scroll — the deck owns the viewport */
  useEffect(() => {
    if (isMobile) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const lenis = getLenis();
    lenis?.stop();
    return () => {
      document.body.style.overflow = prev;
      lenis?.start();
    };
  }, [isMobile]);

  /* deep-link fly-to, once the camera has a size */
  const flewRef = useRef(false);
  useEffect(() => {
    if (flewRef.current || camera.size.w === 0 || !selectedId) return;
    const n = byId.get(selectedId);
    if (n) camera.flyTo(n.x, n.y, 1.5, 800);
    flewRef.current = true;
  }, [camera, camera.size.w, selectedId, byId]);

  /* reflect selection + version into the URL */
  useEffect(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (selectedId) next.set('node', selectedId);
        else next.delete('node');
        if (version !== region.defaultVersion) next.set('v', version);
        else next.delete('v');
        return next;
      },
      { replace: true },
    );
  }, [selectedId, version, region.defaultVersion, setSearchParams]);

  const onSelect = useCallback(
    (node: MapNode | null) => {
      setSelectedId(node?.id ?? null);
      if (node) camera.centerOn(node.x, node.y, 600, isMobile ? 0 : -200);
    },
    [camera, isMobile],
  );

  const onPickNode = useCallback(
    (node: MapNode) => {
      setSelectedId(node.id);
      camera.flyTo(node.x, node.y, 1.6, 700);
    },
    [camera],
  );

  /* method toggling — shake the bar (gold, never red) if every node empties */
  const toggleMethod = useCallback(
    (m: MethodBucket) => {
      setMethods((prev) => {
        const next = new Set(prev);
        if (next.has(m)) next.delete(m);
        else next.add(m);
        let anyVisible = next.size > 0;
        if (anyVisible) {
          anyVisible = [...data.values()].some((nd) => {
            if (nd.status !== 'loaded') return true; // pending nodes stay lit
            return Object.keys(nd.methodTop).some((b) => next.has(b as MethodBucket));
          });
        }
        if (!anyVisible) setShakeKey((k) => k + 1);
        return next;
      });
    },
    [data],
  );

  const resetMethods = useCallback(() => setMethods(new Set(METHOD_BUCKETS)), []);

  /* reset view targets the active canvas */
  const onResetView = useCallback(() => {
    if (effectiveView === 'original') setOrigResetSignal((k) => k + 1);
    else camera.resetView();
  }, [effectiveView, camera]);

  /* esc closes the drawer */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedId(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const selectedNode = selectedId ? byId.get(selectedId) ?? null : null;
  const railStats = useMemo(() => computeRailStats(region, data), [region, data]);

  return (
    <div className="flex flex-col lg:h-[calc(100dvh-100px)] lg:overflow-hidden">
      <CommandBar
        region={region}
        version={version}
        onVersion={setVersion}
        methods={methods}
        onToggleMethod={toggleMethod}
        onPickNode={onPickNode}
        scanned={scanned}
        total={total}
        offline={offline}
        onResetView={onResetView}
        shakeKey={shakeKey}
        view={effectiveView}
        onView={setView}
      />

      {/* mobile KPI strip — 4-up grid so every chip is fully visible without scrolling */}
      <div className="grid grid-cols-4 gap-2 px-3 py-2 lg:hidden" aria-label={t('maps.regionStats')}>
        {(
          [
            [t('maps.locations'), railStats.locations],
            [t('maps.species'), railStats.species],
            [t('maps.items'), railStats.items],
            [t('maps.rarest'), railStats.rarest],
          ] as Array<[string, string | number]>
        ).map(([label, value]) => (
          <div key={label} className="min-w-0 rounded-md border border-hairline bg-surface1 px-2 py-1.5">
            <div className="pixel-label text-[7px] text-tx-muted">{label}</div>
            <div className="font-display text-[15px] font-bold tabular-nums" style={{ color: region.accent }}>
              {value}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-1 gap-3 px-3 pb-3 pt-1 sm:px-4 lg:min-h-0 lg:pt-3">
        {/* left KPI rail (desktop) */}
        <div className="hidden h-full overflow-hidden rounded-lg border border-hairline bg-surface1/40 lg:block">
          <LeftRail region={region} data={data} scanned={scanned} total={total} onPickNode={onPickNode} />
        </div>

        {/* canvas + overlays */}
        <div className="relative h-[62dvh] min-w-0 flex-1 lg:h-full">
          {effectiveView === 'original' ? (
            <OriginalCanvas
              region={region}
              data={data}
              methods={methods}
              selectedId={selectedId}
              onSelect={onSelect}
              version={version}
              motionOk={motionOk}
              scanningDone={!scanning}
              isMobile={isMobile}
              resetSignal={origResetSignal}
            />
          ) : (
            <MapCanvas
              region={region}
              camera={camera}
              data={data}
              methods={methods}
              selectedId={selectedId}
              onSelect={onSelect}
              version={version}
              motionOk={motionOk}
              scanningDone={!scanning}
            />
          )}

          {/* minimap + zoom stack (schematic view only) — shifts left when the drawer docks */}
          {effectiveView === 'schematic' && (
            <div
              className={cn(
                'absolute bottom-3 right-3 z-30 transition-[right] duration-300',
                selectedNode && !isMobile && 'right-[412px]',
              )}
            >
              <Minimap region={region} camera={camera} />
            </div>
          )}

          <AnimatePresence>
            {selectedNode && (
              <DetailDrawer
                region={region}
                node={selectedNode}
                nd={data.get(selectedNode.id)}
                version={version}
                methods={methods}
                onToggleMethod={toggleMethod}
                onResetMethods={resetMethods}
                onClose={() => setSelectedId(null)}
                isMobile={isMobile}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function MapRegion() {
  const { region: regionParam } = useParams();
  const region = regionById(regionParam);
  if (!region) return <UnchartedSector />;
  return <MapRegionDeck key={region.region} region={region} />;
}
