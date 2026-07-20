/* MiniSchematic — low-detail render of a RegionMap (every 3rd node + edges)
 * used as atlas card background (maps.md §1.2). Same JSON, zero extra art. */
import { memo, useMemo } from 'react';
import type { RegionMap } from '@/lib/regions';
import { nodeIndex } from '@/lib/regions';

interface MiniSchematicProps {
  region: RegionMap;
  /** card hover — brighten + ping */
  active: boolean;
  className?: string;
}

function MiniSchematic({ region, active, className }: MiniSchematicProps) {
  const byId = useMemo(() => nodeIndex(region), [region]);
  const nodes = useMemo(() => region.nodes.filter((_, i) => i % 3 === 0), [region]);

  return (
    <svg viewBox={region.viewBox} preserveAspectRatio="xMaxYMax slice" className={className} aria-hidden>
      <g style={{ opacity: active ? 0.45 : 0.18, transition: 'opacity 300ms ease' }}>
        {region.edges.map((e, i) => {
          const a = byId.get(e.from);
          const b = byId.get(e.to);
          if (!a || !b) return null;
          return (
            <line
              key={`${e.from}-${e.to}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={region.accent}
              strokeWidth={3}
              strokeLinecap="round"
              pathLength={100}
              strokeDasharray={100}
              className="maps-edge-draw"
              style={{ ['--path-len' as string]: 100, animationDelay: `${i * 30}ms` }}
            />
          );
        })}
        {nodes.map((n, i) => (
          <circle
            key={n.id}
            cx={n.x}
            cy={n.y}
            r={6}
            fill={region.accent}
            className={active ? 'maps-schematic-ping' : undefined}
            style={active ? { animationDelay: `${i * 40}ms` } : undefined}
          />
        ))}
      </g>
    </svg>
  );
}

export default memo(MiniSchematic);
