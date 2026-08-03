/* OriginalCanvas — the ORIGINAL map view (Kanto pilot): the ripped FRLG
 * overworld image (public/maps/kanto-original.jpg, voids baked to museum
 * black) as a pannable/zoomable canvas via useMapCamera. Dark-tinted to sit
 * inside Holo-Dex, region-accent vignette + breathing aura, geo-mapped
 * glowing node markers (src/data/regions/kanto-geo.json fractions × image
 * dims), hover = ScoutTooltip, click = same onSelect flow as MapCanvas.
 * useMapCamera is reused as-is (owned by another agent — do not modify). */
import { memo, useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Maximize, Minus, Plus } from 'lucide-react';
import ScoutTooltip from './ScoutTooltip';
import { useMapCamera } from './useMapCamera';
import { originalGeoFor } from '@/lib/maps-geo';
import type { RegionGeo } from '@/lib/maps-geo';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/lib/i18n-data';
import type { MapNode, RegionMap } from '@/lib/regions';
import { accentRgb, nodeName } from '@/lib/regions';
import type { MethodBucket, NodeMapData } from '@/lib/mapdata';
import { itemsForNode } from '@/lib/mapdata';
import { cn } from '@/lib/utils';

/* fallback when a region has no geo entry (ORIGINAL view is only offered
 * when the registry has one — this is a defensive null-guard) */
const EMPTY_GEO: RegionGeo = { version: '', image: '', nodes: {} };

/* marker scale vs. the schematic glyphs — set per render from the region's
 * image width (2600-wide world ≈ 2.1× vs 1200×840 schematic; kanto stays
 * exactly 2.1). Module-level because the marker sub-components read it;
 * only one OriginalCanvas is mounted at a time. */
let S = 2.1;

const EMPTY_STROKE = 'rgba(255,255,255,0.14)';
const GOLD = '#F6C945';

/* authored label nudges for crowded pairs on the original geography */
const LABEL_TOP = new Set([
  'kanto-route-22',
  /* sinnoh: jubilife-city and route-203 sit on the same latitude — route
   * label goes above; route-211/210 cluster near celestic — 211 goes above */
  'sinnoh-route-203',
  'sinnoh-route-211',
]);

/* EP0.5 — region-aware source credit: kanto/johto/hoenn are VGMaps rips,
 * sinnoh/unova are PokéWiki artwork (see public/maps/CREDITS.txt) */
const SOURCE_CREDIT: Record<string, string> = {
  kanto: 'MAP © NINTENDO/GAME FREAK · RIP VIA VGMAPS',
  johto: 'MAP © NINTENDO/GAME FREAK · RIP VIA VGMAPS',
  hoenn: 'MAP © NINTENDO/GAME FREAK · RIP VIA VGMAPS',
  sinnoh: 'MAP © NINTENDO/GAME FREAK · VIA POKÉWIKI',
  unova: 'MAP © NINTENDO/GAME FREAK · VIA POKÉWIKI',
};

type NodeDataState = 'pending' | 'loaded' | 'empty' | 'decor';

interface OriginalMarkerProps {
  node: MapNode;
  x: number;
  y: number;
  accent: string;
  state: NodeDataState;
  dimmed: boolean;
  selected: boolean;
  showLabel: boolean;
  index: number;
  motionOk: boolean;
  onHover: (node: MapNode | null) => void;
  onSelect: (node: MapNode) => void;
}

function MarkerShape({ node, accent, stroke }: { node: MapNode; accent: string; stroke: string }) {
  const dashed = node.postGame ? `${5 * S} ${5 * S}` : undefined;
  switch (node.kind) {
    case 'city':
      return (
        <>
          <polygon
            points={`0,${-9 * S} ${9 * S},0 0,${9 * S} ${-9 * S},0`}
            fill="#10131D"
            stroke={stroke}
            strokeWidth={2 * S}
            strokeDasharray={dashed}
            strokeLinejoin="round"
          />
          <circle r={2.2 * S} fill={accent} />
        </>
      );
    case 'dungeon':
      return (
        <>
          <rect
            x={-6 * S}
            y={-6 * S}
            width={12 * S}
            height={12 * S}
            fill="#0B0D14"
            stroke={stroke}
            strokeWidth={1.6 * S}
            strokeOpacity={0.75}
            strokeDasharray={dashed}
          />
          <rect className="maps-flicker" x={-2.2 * S} y={-2.2 * S} width={4.4 * S} height={4.4 * S} fill={accent} opacity={0.3} />
        </>
      );
    case 'special':
      return (
        <path
          className="maps-star"
          d={`M0,${-8 * S} L${2 * S},${-2 * S} L${8 * S},0 L${2 * S},${2 * S} L0,${8 * S} L${-2 * S},${2 * S} L${-8 * S},0 L${-2 * S},${-2 * S} Z`}
          fill="#10131D"
          stroke={GOLD}
          strokeWidth={1.6 * S}
          strokeDasharray={dashed}
          strokeLinejoin="round"
        />
      );
    case 'route':
    default:
      return (
        <circle
          className="maps-route-fill"
          r={5.5 * S}
          fill="#151926"
          stroke={stroke}
          strokeWidth={1.6 * S}
          strokeDasharray={dashed}
        />
      );
  }
}

const OriginalMarker = memo(function OriginalMarker({
  node,
  x,
  y,
  accent,
  state,
  dimmed,
  selected,
  showLabel,
  index,
  motionOk,
  onHover,
  onSelect,
}: OriginalMarkerProps) {
  const { t } = useTranslation();
  const lang = useLanguage();
  const label = nodeName(node, lang);
  const stroke = state === 'empty' ? EMPTY_STROKE : accent;
  const hoverScale = node.kind === 'city' ? 1.25 : 1.35;

  return (
    <g
      className="maps-node"
      transform={`translate(${x} ${y})`}
      opacity={dimmed ? 0.08 : node.postGame && state !== 'pending' ? 0.6 : 1}
      style={{ '--ac': accentRgb(accent), '--hover-scale': hoverScale, transition: 'opacity 200ms ease' } as CSSProperties}
      role="button"
      tabIndex={0}
      aria-label={`${label} — ${t(`maps.kind${node.kind.charAt(0).toUpperCase() + node.kind.slice(1)}`, { defaultValue: node.kind })} ${node.order}`}
      data-node-id={node.id}
      onPointerEnter={() => onHover(node)}
      onPointerLeave={() => onHover(null)}
      onClick={() => onSelect(node)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(node);
        }
      }}
    >
      {/* hit area ≥ 28px on screen */}
      <circle r={16 * S} fill="transparent" />
      <circle className="maps-focus-ring" r={17 * S} fill="none" stroke="transparent" strokeWidth={2} />

      <g
        className={motionOk ? 'maps-pop' : undefined}
        style={motionOk ? { animationDelay: `${Math.min(index * 14, 900)}ms` } : undefined}
      >
        {/* breathing halo — isolated perpetual animation */}
        {motionOk && (
          <circle
            className="maps-orig-pulse"
            r={14 * S}
            fill={accent}
            opacity={0.16}
            style={{ animationDelay: `${(index % 12) * 200}ms` }}
          />
        )}

        {/* dark disc so the glyph reads on the busy map */}
        <circle r={10.5 * S} fill="#07080D" opacity={0.55} />

        {/* selected: radial gold highlight ring */}
        {selected && (
          <>
            <circle r={13 * S} fill="none" stroke={GOLD} strokeWidth={2 * S} />
            <circle r={16.5 * S} fill="none" stroke={GOLD} strokeWidth={1 * S} opacity={0.7} />
            {motionOk && <circle className="maps-selected-ring" r={13 * S} fill="none" stroke={GOLD} strokeWidth={1.5 * S} />}
          </>
        )}

        <g className="maps-glyph" opacity={state === 'pending' ? 0.45 : 1} style={{ transition: 'opacity 300ms ease' }}>
          <MarkerShape node={node} accent={accent} stroke={stroke} />
        </g>

        {/* pending: orbiting scan dot */}
        {state === 'pending' && motionOk && (
          <g>
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 0 0"
              to="360 0 0"
              dur="1.2s"
              repeatCount="indefinite"
            />
            <circle cx={14 * S} cy={0} r={2.2 * S} fill={accent} />
          </g>
        )}

        {/* order badge — the "main quest path" number, haloed for the busy map */}
        <text
          y={-13 * S}
          textAnchor="middle"
          fontFamily="Orbitron, sans-serif"
          fontWeight={700}
          fontSize={8 * S}
          fill={accent}
          opacity={0.85}
          stroke="#07080D"
          strokeWidth={3}
          paintOrder="stroke"
        >
          {node.order}
        </text>

        {showLabel && (
          <text
            y={LABEL_TOP.has(node.id) ? -20 * S : 22 * S}
            textAnchor="middle"
            fontFamily="'Press Start 2P', monospace"
            fontSize={8.5 * S}
            letterSpacing={0.5}
            fill="#C9D2E8"
            stroke="#07080D"
            strokeWidth={4}
            paintOrder="stroke"
          >
            {label}
            {node.postGame && (
              <tspan fill={GOLD} opacity={0.9} dx={6} fontSize={6.5 * S}>
                POST
              </tspan>
            )}
          </text>
        )}
      </g>
    </g>
  );
});

interface OriginalCanvasProps {
  region: RegionMap;
  data: ReadonlyMap<string, NodeMapData>;
  methods: ReadonlySet<MethodBucket>;
  selectedId: string | null;
  onSelect: (node: MapNode | null) => void;
  version: string;
  motionOk: boolean;
  scanningDone: boolean;
  isMobile: boolean;
  /** bumped by the command bar's RESET VIEW while ORIGINAL is active */
  resetSignal: number;
}

export default function OriginalCanvas({
  region,
  data,
  methods,
  selectedId,
  onSelect,
  version,
  motionOk,
  scanningDone,
  isMobile,
  resetSignal,
}: OriginalCanvasProps) {
  const { t } = useTranslation();
  const lang = useLanguage();
  /* registry lookup: natural image dims become the camera world; marker
   * scale mirrors the schematic glyphs (2600-wide world ≈ 2.1× vs 1200×840
   * schematic — kanto stays exactly 2.1 via imgW / 1238) */
  const entry = originalGeoFor(region.region);
  const GEO = entry?.geo ?? EMPTY_GEO;
  const IMG_W = entry?.imgW ?? 2600;
  const IMG_H = entry?.imgH ?? 2549;
  S = IMG_W / 1238;
  const camera = useMapCamera(IMG_W, IMG_H, `${region.region}-original`);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const rgb = accentRgb(region.accent);

  const positioned = useMemo(
    () =>
      region.nodes
        .map((n, i) => {
          const f = GEO.nodes[n.id];
          return f ? { node: n, index: i, x: f[0] * IMG_W, y: f[1] * IMG_H } : null;
        })
        .filter((p): p is { node: MapNode; index: number; x: number; y: number } => p !== null),
    [region],
  );
  const posById = useMemo(() => new Map(positioned.map((p) => [p.node.id, p])), [positioned]);

  /* command-bar RESET VIEW while ORIGINAL is active */
  const firstReset = useRef(resetSignal);
  useEffect(() => {
    if (resetSignal !== firstReset.current) camera.resetView();
  }, [resetSignal, camera]);

  /* selection → pan the geo point into view (mirrors MapRegion.onSelect);
   * also covers deep links (?node=) and search picks once sized */
  useEffect(() => {
    if (!selectedId || camera.size.w === 0) return;
    const p = posById.get(selectedId);
    if (p) camera.centerOn(p.x, p.y, 600, isMobile ? 0 : -200);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, camera.size.w]);

  const nodeState = (n: MapNode): NodeDataState => {
    if (!n.locationSlug) return 'decor';
    const nd = data.get(n.id);
    if (!nd) return scanningDone ? 'empty' : 'pending';
    if (nd.status === 'loaded') return 'loaded';
    return 'empty';
  };

  const nodeDimmed = (n: MapNode): boolean => {
    const nd = data.get(n.id);
    if (!nd || nd.status !== 'loaded') return false;
    return !Object.keys(nd.methodTop).some((m) => methods.has(m as MethodBucket));
  };

  const showAllLabels = camera.relZoom >= 0.85;
  const hoveredNode = hoveredId ? posById.get(hoveredId)?.node ?? null : null;
  const hoveredPos = hoveredId ? posById.get(hoveredId) : undefined;
  const tipPos = hoveredPos ? camera.worldToScreen(hoveredPos.x, hoveredPos.y) : null;

  return (
    <div
      ref={camera.containerRef}
      className={cn(
        'relative h-full w-full touch-none overflow-hidden rounded-lg border border-hairline bg-[#07080D] outline-none',
        camera.dragging ? 'cursor-grabbing' : 'cursor-grab',
      )}
      style={{ ['--ac' as string]: rgb }}
      role="application"
      aria-label={`${region.name} original map — drag to pan, scroll to zoom`}
      tabIndex={0}
      onKeyDown={(e) => {
        const step = 60;
        if (e.key === 'ArrowLeft') camera.nudge(step, 0);
        else if (e.key === 'ArrowRight') camera.nudge(-step, 0);
        else if (e.key === 'ArrowUp') camera.nudge(0, step);
        else if (e.key === 'ArrowDown') camera.nudge(0, -step);
        else if (e.key === '+' || e.key === '=') camera.zoomBy(1.15);
        else if (e.key === '-') camera.zoomBy(1 / 1.15);
        else return;
        e.preventDefault();
      }}
      {...camera.handlers}
      onClickCapture={(e) => {
        if (camera.suppressClickRef.current) {
          e.stopPropagation();
          e.preventDefault();
        }
      }}
    >
      <svg
        className="block h-full w-full select-none"
        onClick={(e) => {
          if ((e.target as SVGElement).dataset?.bg !== undefined) onSelect(null);
        }}
      >
        <defs>
          <radialGradient id={`orig-aura-${region.region}`}>
            <stop offset="0%" stopColor={region.accent} stopOpacity={0.12} />
            <stop offset="100%" stopColor={region.accent} stopOpacity={0} />
          </radialGradient>
        </defs>

        <g transform={`translate(${camera.cam.x} ${camera.cam.y}) scale(${camera.cam.k})`}>
          {/* background click catcher */}
          <rect data-bg x={-IMG_W} y={-IMG_H} width={IMG_W * 3} height={IMG_H * 3} fill="transparent" />

          {/* region aura behind the map (breathing) */}
          <circle
            className={motionOk ? 'maps-aura' : undefined}
            cx={IMG_W / 2}
            cy={IMG_H / 2}
            r={IMG_W * 0.52}
            fill={`url(#orig-aura-${region.region})`}
            pointerEvents="none"
          />

          {/* the original FRLG world map, dark-tinted into Holo-Dex */}
          <image
            data-bg
            href={GEO.image}
            x={0}
            y={0}
            width={IMG_W}
            height={IMG_H}
            style={{ filter: 'brightness(.8) saturate(.85)' }}
          />

          {/* geo-mapped nodes */}
          {positioned.map((p) => (
            <OriginalMarker
              key={p.node.id}
              node={p.node}
              x={p.x}
              y={p.y}
              accent={region.accent}
              state={nodeState(p.node)}
              dimmed={nodeDimmed(p.node)}
              selected={selectedId === p.node.id}
              showLabel={showAllLabels || p.node.kind === 'city'}
              index={p.index}
              motionOk={motionOk}
              onHover={(node) => setHoveredId(node?.id ?? null)}
              onSelect={(node) => onSelect(node)}
            />
          ))}
        </g>
      </svg>

      {/* region-accent vignette */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          boxShadow: `inset 0 0 140px 24px rgba(3,4,8,0.88), inset 0 0 320px 60px rgba(${rgb},0.07)`,
        }}
      />
      <div className="maps-canvas-grain absolute inset-0" aria-hidden />

      {/* visually-hidden node list alternative (a11y §2.11) */}
      <ul className="sr-only">
        {region.nodes.map((n) => {
          const nd = data.get(n.id);
          const items = itemsForNode(region.region, n.id).length;
          return (
            <li key={`sr-${n.id}`}>
              <button
                type="button"
                aria-label={t('maps.nodeAria', { label: nodeName(n, lang), count: nd?.pokemonCount ?? 0, items })}
                onClick={() => onSelect(n)}
              >
                {nodeName(n, lang)}
              </button>
            </li>
          );
        })}
      </ul>

      {/* scout tooltip (HTML overlay anchored to node) */}
      <AnimatePresence>
        {hoveredNode && tipPos && (
          <ScoutTooltip
            node={hoveredNode}
            region={region}
            nd={data.get(hoveredNode.id)}
            itemCount={itemsForNode(region.region, hoveredNode.id).length}
            version={version}
            x={tipPos.x}
            y={tipPos.y}
            flipX={tipPos.x > camera.size.w - 210}
            flipY={tipPos.y < 140}
          />
        )}
      </AnimatePresence>

      {/* zoom stack (minimap stays schematic-only) — docks left when the drawer opens */}
      <div
        className={cn(
          'absolute bottom-3 right-3 z-30 flex flex-col overflow-hidden rounded-md border border-hairline bg-surface1/90 shadow-elevate backdrop-blur transition-[right] duration-300',
          selectedId && !isMobile && 'right-[412px]',
        )}
      >
        <button
          type="button"
          aria-label={t('maps.zoomIn')}
          onClick={() => camera.zoomBy(1.25)}
          className="flex h-8 w-8 items-center justify-center text-tx-secondary transition-colors hover:bg-surface3 hover:text-gold"
        >
          <Plus size={14} />
        </button>
        <button
          type="button"
          aria-label={t('maps.zoomOut')}
          onClick={() => camera.zoomBy(1 / 1.25)}
          className="flex h-8 w-8 items-center justify-center border-t border-hairline text-tx-secondary transition-colors hover:bg-surface3 hover:text-gold"
        >
          <Minus size={14} />
        </button>
        <button
          type="button"
          aria-label={t('maps.zoomReset')}
          onClick={() => camera.resetView()}
          className="flex h-8 w-8 items-center justify-center border-t border-hairline text-tx-secondary transition-colors hover:bg-surface3 hover:text-gold"
        >
          <Maximize size={13} />
        </button>
      </div>

      {/* live camera readout — ops-deck flavor */}
      <div className="pointer-events-none absolute bottom-2 left-2.5 font-sans text-[9px] font-medium tabular-nums text-tx-muted">
        ZOOM {camera.relZoom.toFixed(1)}× · X {Math.round(-camera.cam.x)} · Y {Math.round(-camera.cam.y)}
      </div>

      {/* source credit (see public/maps/CREDITS.txt) — clears the zoom stack */}
      <div className="pixel-label pointer-events-none absolute bottom-2 right-14 text-[7px] text-tx-muted/60">
        {SOURCE_CREDIT[region.region] ?? 'MAP © NINTENDO/GAME FREAK'}
      </div>
    </div>
  );
}
