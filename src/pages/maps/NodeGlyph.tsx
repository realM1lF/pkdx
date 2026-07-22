/* NodeGlyph — one map node: kind glyph + order badge + label + data states
 * (maps.md §2.3). Pure SVG; hover glow keys off --ac (accent rgb triplet). */
import { memo } from 'react';
import type { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/lib/i18n-data';
import type { MapNode } from '@/lib/regions';
import { accentRgb, nodeName } from '@/lib/regions';

export type NodeDataState = 'pending' | 'loaded' | 'empty' | 'decor';

interface NodeGlyphProps {
  node: MapNode;
  accent: string;
  state: NodeDataState;
  /** method filter dims non-matching nodes */
  dimmed: boolean;
  selected: boolean;
  showLabel: boolean;
  /** entrance stagger index */
  index: number;
  motionOk: boolean;
  onHover: (node: MapNode | null) => void;
  onSelect: (node: MapNode) => void;
}

const EMPTY_STROKE = 'rgba(255,255,255,0.14)';

function GlyphShape({ node, accent, stroke }: { node: MapNode; accent: string; stroke: string }) {
  const dashed = node.postGame ? '3 3' : undefined;
  switch (node.kind) {
    case 'city':
      return (
        <>
          <polygon
            points="0,-8 8,0 0,8 -8,0"
            fill="#171B27"
            stroke={stroke}
            strokeWidth={2}
            strokeDasharray={dashed}
          />
          <circle r={2} fill={accent} />
        </>
      );
    case 'dungeon':
      return (
        <>
          <rect
            x={-5.5}
            y={-5.5}
            width={11}
            height={11}
            fill="#0D0F16"
            stroke={stroke}
            strokeWidth={1.5}
            strokeOpacity={0.6}
            strokeDasharray={dashed}
          />
          <rect className="maps-flicker" x={-2} y={-2} width={4} height={4} fill={accent} opacity={0.25} />
        </>
      );
    case 'special':
      return (
        <path
          className="maps-star"
          d="M0,-7 L1.8,-1.8 L7,0 L1.8,1.8 L0,7 L-1.8,1.8 L-7,0 L-1.8,-1.8 Z"
          fill="#171B27"
          stroke="#F6C945"
          strokeWidth={1.5}
          strokeDasharray={dashed}
          strokeLinejoin="round"
        />
      );
    case 'route':
    default:
      return (
        <circle
          className="maps-route-fill"
          r={5}
          fill="#1F2433"
          stroke={stroke}
          strokeWidth={1.5}
          strokeDasharray={dashed}
        />
      );
  }
}

function labelOffset(pos: MapNode['labelPos']): { x: number; y: number; anchor: 'middle' | 'start' | 'end' } {
  switch (pos) {
    case 'top':
      return { x: 0, y: -18, anchor: 'middle' };
    case 'left':
      return { x: -14, y: 3, anchor: 'end' };
    case 'right':
      return { x: 14, y: 3, anchor: 'start' };
    case 'bottom':
    default:
      return { x: 0, y: 24, anchor: 'middle' };
  }
}

function NodeGlyph({
  node,
  accent,
  state,
  dimmed,
  selected,
  showLabel,
  index,
  motionOk,
  onHover,
  onSelect,
}: NodeGlyphProps) {
  const { t } = useTranslation();
  const lang = useLanguage();
  const label = nodeName(node, lang);
  const stroke = state === 'empty' ? EMPTY_STROKE : accent;
  const lp = labelOffset(node.labelPos);
  const hoverScale = node.kind === 'city' ? 1.3 : node.kind === 'route' ? 1.45 : 1.35;

  return (
    <g
      className="maps-node"
      transform={`translate(${node.x} ${node.y})`}
      opacity={dimmed ? 0.08 : node.postGame && state !== 'pending' ? 0.55 : 1}
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
      {/* hit area ≥ 28px */}
      <circle r={15} fill="transparent" />
      <circle className="maps-focus-ring" r={16} fill="none" stroke="transparent" />

      <g
        className={motionOk ? 'maps-pop' : undefined}
        style={motionOk ? { animationDelay: `${Math.min(index * 12, 900)}ms` } : undefined}
      >
        {/* selected: gold double ring + pulse */}
        {selected && (
          <>
            <circle r={12} fill="none" stroke="#F6C945" strokeWidth={2} />
            <circle r={15.5} fill="none" stroke="#F6C945" strokeWidth={1} opacity={0.7} />
            {motionOk && <circle className="maps-selected-ring" r={12} fill="none" stroke="#F6C945" strokeWidth={1.5} />}
          </>
        )}

        <g className="maps-glyph" opacity={state === 'pending' ? 0.45 : 1} style={{ transition: 'opacity 300ms ease' }}>
          <GlyphShape node={node} accent={accent} stroke={stroke} />
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
            <circle cx={13} cy={0} r={2} fill={accent} />
          </g>
        )}

        {/* order badge — the "main quest path" number */}
        <text
          y={-13}
          textAnchor="middle"
          fontFamily="Orbitron, sans-serif"
          fontWeight={700}
          fontSize={8}
          fill={accent}
          opacity={0.6}
        >
          {node.order}
        </text>

        {showLabel && (
          <text
            x={lp.x}
            y={lp.y}
            textAnchor={lp.anchor}
            fontFamily="'Press Start 2P', monospace"
            fontSize={8.5}
            letterSpacing={0.5}
            fill="#5E6680"
            stroke="#07080D"
            strokeWidth={3}
            paintOrder="stroke"
          >
            {label.toUpperCase()}
            {node.postGame && (
              <tspan fill="#F6C945" opacity={0.8} dx={4} fontSize={6.5}>
                POST
              </tspan>
            )}
          </text>
        )}
      </g>
    </g>
  );
}

export default memo(NodeGlyph);
