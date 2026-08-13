/* Minimap — 150×105 overview with gold viewport rect + zoom stack
 * (maps.md §2.3 corner controls). Click/drag moves the camera. */
import { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { PointerEvent as ReactPointerEvent } from 'react';
import { Maximize, Minus, Plus } from 'lucide-react';
import type { RegionMap } from '@/lib/regions';
import { nodeIndex, regionName } from '@/lib/regions';
import { useLanguage } from '@/lib/i18n-data';
import type { MapCamera } from './useMapCamera';

const MW = 150;
const MH = 105;

interface MinimapProps {
  region: RegionMap;
  camera: MapCamera;
}

export default function Minimap({ region, camera }: MinimapProps) {
  const { t } = useTranslation();
  const lang = useLanguage();
  const svgRef = useRef<SVGSVGElement>(null);
  const draggingRef = useRef(false);
  const byId = useMemo(() => nodeIndex(region), [region]);

  const [vbX, vbY, vbW, vbH] = useMemo(
    () => region.viewBox.split(/\s+/).map(Number) as [number, number, number, number],
    [region],
  );
  const s = Math.min(MW / vbW, MH / vbH);
  const ox = (MW - vbW * s) / 2 - vbX * s;
  const oy = (MH - vbH * s) / 2 - vbY * s;
  const toMini = (x: number, y: number) => ({ x: x * s + ox, y: y * s + oy });

  const { cam, size } = camera;
  const view = {
    x: -cam.x / cam.k,
    y: -cam.y / cam.k,
    w: size.w / cam.k,
    h: size.h / cam.k,
  };
  const vp = toMini(view.x, view.y);

  const jump = (e: ReactPointerEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    camera.centerOn((mx - ox) / s, (my - oy) / s, 350);
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="overflow-hidden rounded-md border border-hairline bg-surface1/90 shadow-elevate backdrop-blur">
        <svg
          ref={svgRef}
          width={MW}
          height={MH}
          className="block cursor-crosshair"
          role="img"
          aria-label={t('maps.minimapAria', { name: regionName(region, lang) })}
          onPointerDown={(e) => {
            draggingRef.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
            jump(e);
          }}
          onPointerMove={(e) => {
            if (draggingRef.current) jump(e);
          }}
          onPointerUp={() => {
            draggingRef.current = false;
          }}
        >
          {region.edges.map((e, i) => {
            const a = byId.get(e.from);
            const b = byId.get(e.to);
            if (!a || !b) return null;
            const p1 = toMini(a.x, a.y);
            const p2 = toMini(b.x, b.y);
            return (
              <line
                key={i}
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke={region.accent}
                strokeWidth={0.8}
                opacity={0.2}
              />
            );
          })}
          {region.nodes.map((n) => {
            const p = toMini(n.x, n.y);
            return <circle key={n.id} cx={p.x} cy={p.y} r={n.kind === 'city' ? 2.2 : 1.5} fill={region.accent} opacity={0.45} />;
          })}
          <rect
            x={vp.x}
            y={vp.y}
            width={Math.max(6, view.w * s)}
            height={Math.max(4, view.h * s)}
            fill="rgba(246,201,69,0.05)"
            stroke="#F6C945"
            strokeWidth={1}
          />
        </svg>
      </div>

      {/* zoom stack */}
      <div className="flex flex-col overflow-hidden rounded-md border border-hairline bg-surface1/90 shadow-elevate backdrop-blur">
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
    </div>
  );
}
