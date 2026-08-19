/* MapCanvas — the abstract SVG transit map (maps.md §2.3): blueprint grid,
 * region aura, water blob, bezier edges with traveling pulses, kind glyphs,
 * hover scout-tooltip, click-to-select, LOD labels, camera readout. */
import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { AnimatePresence } from 'framer-motion';
import NodeGlyph from './NodeGlyph';
import type { NodeDataState } from './NodeGlyph';
import ScoutTooltip from './ScoutTooltip';
import type { MapCamera } from './useMapCamera';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/lib/i18n-data';
import type { MapNode, RegionMap } from '@/lib/regions';
import { accentRgb, nodeName, nodeIndex, regionName } from '@/lib/regions';
import type { MethodBucket, NodeMapData } from '@/lib/mapdata';
import { itemsForNode } from '@/lib/mapdata';
import { cn } from '@/lib/utils';

interface MapCanvasProps {
  region: RegionMap;
  camera: MapCamera;
  data: ReadonlyMap<string, NodeMapData>;
  methods: ReadonlySet<MethodBucket>;
  selectedId: string | null;
  onSelect: (node: MapNode | null) => void;
  version: string;
  motionOk: boolean;
  scanningDone: boolean;
}

/* quadratic bezier, control offset 12% perpendicular (organic, not ruler-straight) */
function edgeD(ax: number, ay: number, bx: number, by: number, sign: number): string {
  const mx = (ax + bx) / 2;
  const my = (ay + by) / 2;
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.hypot(dx, dy) || 1;
  const off = len * 0.12 * sign;
  return `M ${ax} ${ay} Q ${mx + (-dy / len) * off} ${my + (dx / len) * off} ${bx} ${by}`;
}

const EDGE_STYLE: Record<string, { stroke: string; dash?: string; width: number }> = {
  land: { stroke: 'rgba(var(--ac),0.28)', width: 2.5 },
  water: { stroke: 'rgba(69,200,255,0.35)', dash: '8 6', width: 2.5 },
  tunnel: { stroke: 'rgba(246,201,69,0.4)', dash: '2 6', width: 2.5 },
};

export default function MapCanvas({
  region,
  camera,
  data,
  methods,
  selectedId,
  onSelect,
  version,
  motionOk,
  scanningDone,
}: MapCanvasProps) {
  const { t } = useTranslation();
  const lang = useLanguage();
  const byId = useMemo(() => nodeIndex(region), [region]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<number | null>(null);
  const rgb = accentRgb(region.accent);

  const [vbX, vbY, vbW, vbH] = useMemo(
    () => region.viewBox.split(/\s+/).map(Number) as [number, number, number, number],
    [region],
  );

  const centroid = useMemo(() => {
    const sx = region.nodes.reduce((s, n) => s + n.x, 0) / region.nodes.length;
    const sy = region.nodes.reduce((s, n) => s + n.y, 0) / region.nodes.length;
    return { x: sx, y: sy, r: Math.max(vbW, vbH) * 0.45 };
  }, [region, vbW, vbH]);

  const waterBlob = useMemo(
    () =>
      `M ${vbX - 80} ${vbY + vbH + 60} ` +
      `C ${vbX + vbW * 0.15} ${vbY + vbH * 0.84}, ${vbX + vbW * 0.32} ${vbY + vbH * 0.99}, ${vbX + vbW * 0.52} ${vbY + vbH * 0.9} ` +
      `C ${vbX + vbW * 0.72} ${vbY + vbH * 0.81}, ${vbX + vbW * 0.85} ${vbY + vbH * 0.95}, ${vbX + vbW + 80} ${vbY + vbH * 0.86} ` +
      `L ${vbX + vbW + 80} ${vbY + vbH + 80} L ${vbX - 80} ${vbY + vbH + 80} Z`,
    [vbX, vbY, vbW, vbH],
  );

  const edgePaths = useMemo(
    () =>
      region.edges.map((e, i) => {
        const a = byId.get(e.from);
        const b = byId.get(e.to);
        if (!a || !b) return null;
        return { e, i, d: edgeD(a.x, a.y, b.x, b.y, i % 2 === 0 ? 1 : -1), mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2, a, b };
      }),
    [region, byId],
  );

  const landEdgePaths = useMemo(() => edgePaths.filter((p) => p && p.e.kind === 'land').slice(0, 10), [edgePaths]);

  const showAllLabels = camera.relZoom >= 0.85;

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

  const edgeDimmed = (a: MapNode, b: MapNode): boolean => nodeDimmed(a) || nodeDimmed(b);

  const hoveredNode = hoveredId ? byId.get(hoveredId) ?? null : null;
  const tipPos = hoveredNode ? camera.worldToScreen(hoveredNode.x, hoveredNode.y) : null;
  const hoveredEdgeData = hoveredEdge !== null ? edgePaths[hoveredEdge] : null;
  const edgeTipPos = hoveredEdgeData ? camera.worldToScreen(hoveredEdgeData.mx, hoveredEdgeData.my) : null;

  return (
    <div
      ref={camera.containerRef}
      className={cn(
        'relative h-full w-full touch-none overflow-hidden rounded-lg border border-hairline bg-[#07080D] outline-none',
        camera.dragging ? 'cursor-grabbing' : 'cursor-grab',
      )}
      style={{ ['--ac' as string]: rgb }}
      role="application"
      aria-label={t('maps.canvasAria', { name: regionName(region, lang) })}
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
          <pattern id={`bp-minor-${region.region}`} width={40} height={40} patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.028)" strokeWidth={1} />
          </pattern>
          <pattern id={`bp-major-${region.region}`} width={200} height={200} patternUnits="userSpaceOnUse">
            <path d="M 200 0 L 0 0 0 200" fill="none" stroke="rgba(255,255,255,0.045)" strokeWidth={1} />
          </pattern>
          <radialGradient id={`aura-${region.region}`}>
            <stop offset="0%" stopColor={region.accent} stopOpacity={0.1} />
            <stop offset="100%" stopColor={region.accent} stopOpacity={0} />
          </radialGradient>
        </defs>

        <g transform={`translate(${camera.cam.x} ${camera.cam.y}) scale(${camera.cam.k})`}>
          {/* blueprint grid (pans/zooms with camera) */}
          <rect data-bg x={vbX - vbW} y={vbY - vbH} width={vbW * 3} height={vbH * 3} fill={`url(#bp-minor-${region.region})`} />
          <rect data-bg x={vbX - vbW} y={vbY - vbH} width={vbW * 3} height={vbH * 3} fill={`url(#bp-major-${region.region})`} />

          {/* water zone */}
          <path d={waterBlob} fill="rgba(69,200,255,0.045)" stroke="rgba(69,200,255,0.12)" strokeWidth={1} pointerEvents="none" />

          {/* region aura (breathing) */}
          <circle
            className={motionOk ? 'maps-aura' : undefined}
            cx={centroid.x}
            cy={centroid.y}
            r={centroid.r}
            fill={`url(#aura-${region.region})`}
            pointerEvents="none"
          />

          {/* edges (under nodes) */}
          {edgePaths.map((p, i) => {
            if (!p) return null;
            const st = EDGE_STYLE[p.e.kind];
            const drawn = motionOk && p.e.kind === 'land';
            const dimmed = edgeDimmed(p.a, p.b);
            const highlighted =
              !dimmed && (hoveredEdge === i || (selectedId !== null && (p.e.from === selectedId || p.e.to === selectedId)));
            return (
              <g key={`${p.e.from}-${p.e.to}-${i}`}>
                <path
                  d={p.d}
                  fill="none"
                  strokeWidth={st.width}
                  strokeLinecap="round"
                  strokeDasharray={drawn ? 100 : st.dash}
                  pathLength={drawn ? 100 : undefined}
                  className={drawn ? 'maps-edge-draw' : undefined}
                  style={
                    {
                      stroke: st.stroke,
                      ['--path-len' as string]: 100,
                      animationDelay: `${i * 25}ms`,
                      strokeOpacity: dimmed ? 0.05 : highlighted ? 0.7 : 1,
                      transition: 'stroke-opacity 200ms ease',
                    } as CSSProperties
                  }
                />
                {/* fat invisible hit-stroke for edge hover */}
                <path
                  d={p.d}
                  fill="none"
                  stroke="transparent"
                  strokeWidth={16}
                  pointerEvents="stroke"
                  onPointerEnter={() => setHoveredEdge(i)}
                  onPointerLeave={() => setHoveredEdge(null)}
                />
              </g>
            );
          })}

          {/* traveling energy pulses (≤ 10, perf budget) */}
          {motionOk &&
            landEdgePaths.map(
              (p, i) =>
                p &&
                !edgeDimmed(p.a, p.b) && (
                  <g key={`pulse-${i}`} pointerEvents="none">
                    <circle r={5} fill={region.accent} opacity={0.25}>
                      <animateMotion dur="6s" begin={`${i * 0.6}s`} repeatCount="indefinite" path={p.d} />
                    </circle>
                    <circle r={2.5} fill={region.accent} opacity={0.9}>
                      <animateMotion dur="6s" begin={`${i * 0.6}s`} repeatCount="indefinite" path={p.d} />
                    </circle>
                  </g>
                ),
            )}

          {/* nodes */}
          {region.nodes.map((n, i) => (
            <NodeGlyph
              key={n.id}
              node={n}
              accent={region.accent}
              state={nodeState(n)}
              dimmed={nodeDimmed(n)}
              selected={selectedId === n.id}
              showLabel={showAllLabels || n.kind === 'city'}
              index={i}
              motionOk={motionOk}
              onHover={(node) => setHoveredId(node?.id ?? null)}
              onSelect={(node) => onSelect(node)}
            />
          ))}
        </g>
      </svg>

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

      {/* edge tooltip */}
      {hoveredEdgeData && edgeTipPos && (
        <div
          className="pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-sm border border-hairline2 bg-surface2 px-2 py-1 text-micro10 font-semibold text-tx-secondary shadow-elevate"
          style={{ left: edgeTipPos.x, top: edgeTipPos.y - 8 }}
        >
          {nodeName(hoveredEdgeData.a, lang)} ↔ {nodeName(hoveredEdgeData.b, lang)}
        </div>
      )}

      {/* live camera readout — ops-deck flavor */}
      <div className="pointer-events-none absolute bottom-2 left-2.5 font-sans text-micro9 font-medium tabular-nums text-tx-muted">
        ZOOM {camera.relZoom.toFixed(1)}× · X {Math.round(-camera.cam.x)} · Y {Math.round(-camera.cam.y)}
      </div>
    </div>
  );
}
