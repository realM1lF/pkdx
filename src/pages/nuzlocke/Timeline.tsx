/* Nuzlocke run — THE TIMELINE (nuzlocke.md §2.3): horizontal route-card
 * track in canonical order + SoulLink SVG overlay (gradient curves,
 * traveling pulses, death-cascade dashes). Drag / shift-wheel scroll. */
import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ExternalLink, Plus } from 'lucide-react';
import Sprite from '@/components/Sprite';
import { routeOrder } from '@/lib/regions';
import type { MapNode, RegionMap } from '@/lib/regions';
import { youAreHereKey } from '@/lib/nuzlocke-store';
import type { NuzEncounterRow, RunState, SoulLink } from '@/lib/nuzlocke-store';
import { cn } from '@/lib/utils';
import { PixelLabel, StatusDot, timeAgo } from './ui';

const CARD_W = 150;
const GAP = 12;
const STRIDE = CARD_W + GAP;
const HEADER_H = 28;
const SLOT_H = 44;

/* node-kind glyphs (§2.3 footer) */
function KindGlyph({ kind }: { kind: MapNode['kind'] }) {
  const cls = 'text-tx-muted';
  if (kind === 'city')
    return (
      <svg width="10" height="10" viewBox="0 0 10 10" className={cls} aria-hidden>
        <rect x="1.5" y="1.5" width="7" height="7" fill="none" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    );
  if (kind === 'dungeon')
    return (
      <svg width="10" height="10" viewBox="0 0 10 10" className={cls} aria-hidden>
        <path d="M5 1l4 8H1z" fill="none" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    );
  if (kind === 'special')
    return (
      <svg width="10" height="10" viewBox="0 0 10 10" className={cls} aria-hidden>
        <path d="M5 1l4 4-4 4-4-4z" fill="none" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    );
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" className={cls} aria-hidden>
      <circle cx="5" cy="5" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

/* ---------- SoulLink overlay ---------- */

function linkGeometry(cardIdx: number, slotA: number, slotB: number) {
  const x = cardIdx * STRIDE + 8;
  /* S-curve bulges into the 12px card gap (or into the card for the first card) */
  const cx = cardIdx === 0 ? x + 14 : x - 22;
  const yA = HEADER_H + slotA * SLOT_H + SLOT_H / 2;
  const yB = HEADER_H + slotB * SLOT_H + SLOT_H / 2;
  const d = `M ${x} ${yA} C ${cx} ${yA}, ${cx} ${yB}, ${x} ${yB}`;
  const mx = 0.25 * x + 0.75 * cx;
  const my = (yA + yB) / 2;
  return { d, mx, my };
}

function SoulLinkOverlay({
  links,
  state,
  cardIndex,
  width,
  height,
  nameOf,
}: {
  links: SoulLink[];
  state: RunState;
  cardIndex: Map<string, number>;
  width: number;
  height: number;
  nameOf: (id: number) => string;
}) {
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const slotOf = (pid: string) => state.players.findIndex((p) => p.id === pid);
  const colorOf = (pid: string) => state.players.find((p) => p.id === pid)?.color ?? '#F6C945';

  return (
    <svg width={width} height={height} className="pointer-events-none absolute left-0 top-7 z-10" aria-hidden>
      <defs>
        {links.map((l, i) => (
          <linearGradient key={i} id={`nz-lg-${i}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={colorOf(l.a.player_id)} />
            <stop offset="1" stopColor={colorOf(l.b.player_id)} />
          </linearGradient>
        ))}
      </defs>
      {links.map((l, i) => {
        const ci = cardIndex.get(l.routeKey);
        if (ci === undefined) return null;
        const sa = slotOf(l.a.player_id);
        const sb = slotOf(l.b.player_id);
        if (sa < 0 || sb < 0) return null;
        const { d, mx, my } = linkGeometry(ci, Math.min(sa, sb), Math.max(sa, sb));
        const label = `SOUL LINK — ${l.a.nickname ?? nameOf(l.a.pokemon_id)} ⇄ ${l.b.nickname ?? nameOf(l.b.pokemon_id)}. If one falls, the other is boxed.`;
        return (
          <g key={`${l.routeKey}-${l.a.id}-${l.b.id}`}>
            <path
              d={d}
              fill="none"
              stroke={`url(#nz-lg-${i})`}
              strokeWidth="3"
              strokeLinecap="round"
              pathLength={1}
              className={l.broken ? 'nz-curve-broken' : 'nz-curve'}
              style={l.broken ? undefined : { animationDelay: `${i * 120}ms` }}
            />
            {/* fat invisible hover stroke with native tooltip */}
            <path d={d} fill="none" stroke="transparent" strokeWidth="14" style={{ pointerEvents: 'stroke' }}>
              <title>{label}</title>
            </path>
            {!l.broken && (
              <image href="/sparkle.svg" x={mx - 5} y={my - 5} width="10" height="10">
                <title>{label}</title>
              </image>
            )}
            {!l.broken && !reduced && (
              <circle r="3" fill="#FFF7D6" opacity="0.9">
                <animateMotion dur="2.4s" begin={`${i * 0.3}s`} repeatCount="indefinite" path={d} />
              </circle>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ---------- player slot ---------- */

interface SlotProps {
  enc: NuzEncounterRow | undefined;
  color: string;
  playerName: string;
  pendingSync: boolean;
  overCap: boolean;
  flashed: boolean;
  cascade: boolean;
  nameOf: (id: number) => string;
  onPrefill: () => void;
  onOpen: (enc: NuzEncounterRow, x: number, y: number) => void;
}

function PlayerSlot({ enc, color, playerName, pendingSync, overCap, flashed, cascade, nameOf, onPrefill, onOpen }: SlotProps) {
  const tip = enc
    ? `${nameOf(enc.pokemon_id)}${enc.nickname ? ` '${enc.nickname}'` : ''} · Lv ${enc.level} · ${enc.status} ${timeAgo(enc.created_at)} — ${playerName}`
    : undefined;
  return (
    <div
      className={cn('relative flex h-[44px] items-center gap-1.5 border-b border-hairline px-1.5 last:border-b-0', cascade && 'nz-shake')}
      style={{ borderLeft: `2px solid ${color}` }}
      title={tip}
    >
      {flashed && <span className="nz-ring-flash pointer-events-none absolute inset-0 rounded-sm" style={{ '--ring-c': color } as CSSProperties} />}
      {!enc ? (
        <button
          type="button"
          onClick={onPrefill}
          aria-label={`Log encounter for ${playerName} on this route`}
          className="mx-auto flex h-[30px] w-full items-center justify-center rounded-sm border border-dashed border-hairline2 text-tx-muted transition-colors hover:border-gold/50 hover:text-gold"
        >
          <Plus size={12} />
        </button>
      ) : enc.status === 'dead' ? (
        <>
          <span data-slot-enc={enc.id} className="nz-dead-sprite inline-block shrink-0">
            <Sprite id={enc.pokemon_id} name={nameOf(enc.pokemon_id)} className="h-[28px] w-[28px]" skeleton={false} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[11px] font-semibold text-tx-muted line-through">{enc.nickname ?? nameOf(enc.pokemon_id)}</span>
            <span className="block font-display text-[9px] font-bold text-tx-muted/70">LV {enc.level}</span>
          </span>
          <span className="h-2 w-2 shrink-0 rounded-full border border-gold/70" aria-label="fallen" />
        </>
      ) : enc.status === 'missed' || enc.status === 'duped' ? (
        <>
          <span className="inline-block shrink-0 opacity-30">
            <Sprite id={enc.pokemon_id} name={nameOf(enc.pokemon_id)} className="h-[30px] w-[30px]" skeleton={false} />
          </span>
          <span className="min-w-0 flex-1 truncate text-[10px] text-tx-muted">{nameOf(enc.pokemon_id)}</span>
          <span className="shrink-0 rounded-full border border-gold/60 px-1 font-pixel text-[6px] tracking-[0.06em] text-gold">
            {enc.status === 'missed' ? 'MISSED' : 'DUPED'}
          </span>
        </>
      ) : (
        <button
          type="button"
          className="group/slot flex min-w-0 flex-1 items-center gap-1.5 text-left"
          onClick={(e) => {
            e.stopPropagation();
            onOpen(enc, e.clientX, e.clientY);
          }}
          aria-label={`${enc.nickname ?? nameOf(enc.pokemon_id)} options`}
        >
          <span data-slot-enc={enc.id} className="inline-block shrink-0 transition-transform duration-200 group-hover/slot:-translate-y-[6%]">
            <Sprite id={enc.pokemon_id} name={nameOf(enc.pokemon_id)} className="h-[36px] w-[36px]" skeleton={false} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[11px] font-semibold text-tx-primary">{enc.nickname ?? nameOf(enc.pokemon_id)}</span>
            <span className="block font-display text-[9px] font-bold text-tx-muted">LV {enc.level}</span>
          </span>
          {overCap && (
            <span className="shrink-0 rounded-full border border-gold/60 px-1 font-pixel text-[6px] text-gold" title={`Above cap — logged over the level cap`}>
              CAP+
            </span>
          )}
          {pendingSync && <span className="nz-orbit h-1.5 w-1.5 shrink-0" aria-label="pending sync" />}
        </button>
      )}
      {cascade && enc?.status === 'caught' && (
        <span className="absolute -top-1.5 right-1 rounded-full border border-gold bg-surface2 px-1 font-pixel text-[6px] text-gold" title="SoulLink rule — this partner must be boxed or released.">
          BOX?
        </span>
      )}
    </div>
  );
}

/* ---------- timeline ---------- */

interface TimelineProps {
  state: RunState;
  region: RegionMap;
  links: SoulLink[];
  nameOf: (id: number) => string;
  flash: { route: string; playerId: string; key: number } | null;
  cascadeIds: Set<string>;
  pendingSync: Set<string>;
  onPrefill: (routeKey: string, playerId: string) => void;
  onOpenEncounter: (enc: NuzEncounterRow, x: number, y: number) => void;
}

export default function Timeline({ state, region, links, nameOf, flash, cascadeIds, pendingSync, onPrefill, onOpenEncounter }: TimelineProps) {
  const nodes = useMemo(() => routeOrder(region), [region]);
  const players = useMemo(() => [...state.players].sort((a, b) => a.slot - b.slot), [state.players]);
  const hereKey = youAreHereKey(state);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragged = useRef(false);
  const [dragging, setDragging] = useState(false);
  const cardIndex = useMemo(() => new Map(nodes.map((n, i) => [n.id, i])), [nodes]);
  const trackW = nodes.length * STRIDE - GAP;

  const encBy = useMemo(() => {
    const m = new Map<string, NuzEncounterRow>();
    for (const e of state.encounters) m.set(`${e.player_id}:${e.route_key}`, e);
    return m;
  }, [state.encounters]);

  /* auto-scroll the YOU ARE HERE card into view on load (§2.3) */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !hereKey) return;
    const idx = cardIndex.get(hereKey);
    if (idx === undefined) return;
    const t = window.setTimeout(() => {
      el.scrollTo({ left: Math.max(0, idx * STRIDE - 80), behavior: 'smooth' });
    }, 350);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* drag to scroll */
  const dragState = useRef({ x: 0, left: 0 });
  const onPointerDown = (e: ReactPointerEvent) => {
    dragState.current = { x: e.clientX, left: scrollRef.current?.scrollLeft ?? 0 };
    dragged.current = false;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: ReactPointerEvent) => {
    if (e.buttons !== 1) return;
    const dx = e.clientX - dragState.current.x;
    if (Math.abs(dx) > 5) {
      dragged.current = true;
      setDragging(true);
    }
    if (dragged.current && scrollRef.current) scrollRef.current.scrollLeft = dragState.current.left - dx;
  };
  const endDrag = () => {
    setDragging(false);
    window.setTimeout(() => {
      dragged.current = false;
    }, 0);
  };

  const hairlineVars = {
    '--p1': players[0]?.color ?? 'transparent',
    '--p2': players[1]?.color ?? players[0]?.color ?? 'transparent',
    '--p3': players[2]?.color ?? players[1]?.color ?? 'transparent',
    '--p4': players[3]?.color ?? 'transparent',
  } as CSSProperties;

  const empty = state.encounters.length === 0;
  const cap = state.run.rules.levelCap;
  const cardH = HEADER_H + players.length * SLOT_H + 22;

  return (
    <section className="group/tl relative rounded-xl border border-hairline bg-[#07080D]" aria-label="Route timeline">
      <div className="nz-player-hairline rounded-t-xl" style={hairlineVars} />
      <div
        className="pointer-events-none absolute inset-0 rounded-xl opacity-[0.04] mix-blend-overlay"
        style={{ backgroundImage: 'url(/grain.png)' }}
        aria-hidden
      />
      <div
        ref={scrollRef}
        className={cn('nz-timeline nz-fade-x overflow-x-auto', dragging && 'nz-dragging')}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={(e) => {
          if (dragged.current) {
            e.stopPropagation();
            e.preventDefault();
          }
        }}
        onWheel={(e) => {
          if (e.shiftKey && scrollRef.current) {
            e.preventDefault();
            scrollRef.current.scrollLeft += e.deltaY;
          }
        }}
      >
        <div className="relative w-fit px-4 pb-3 pt-7" style={{ minWidth: '100%' }}>
          <div className="relative" style={{ width: trackW }}>
            <SoulLinkOverlay links={links} state={state} cardIndex={cardIndex} width={trackW} height={cardH} nameOf={nameOf} />
            <ol className="relative flex gap-3" role="list">
              {nodes.map((node, i) => {
                const isHere = node.id === hereKey;
                return (
                  <motion.li
                    key={node.id}
                    role="listitem"
                    initial={i < 12 ? { x: 40, opacity: 0 } : false}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.35, delay: i < 12 ? i * 0.02 : 0 }}
                    className={cn(
                      'relative w-[150px] shrink-0 rounded-md border bg-surface1 transition-all duration-200 hover:-translate-y-1 hover:border-gold/30',
                      node.postGame ? 'border-hairline opacity-60' : 'border-hairline',
                      isHere && 'border-gold/60 shadow-[inset_0_2px_0_0_var(--gold),0_0_18px_rgba(246,201,69,0.12)]',
                    )}
                    style={{ height: cardH }}
                    aria-label={node.label}
                  >
                    {isHere && !(empty && i === 0) && (
                      <span className="nz-bob absolute -top-6 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full border border-gold bg-void px-2 py-0.5 font-pixel text-[7px] tracking-[0.08em] text-gold">
                        YOU ARE HERE
                      </span>
                    )}
                    {empty && i === 0 && (
                      <span className="nz-bob absolute -top-6 left-1/2 z-20 w-max -translate-x-1/2 whitespace-nowrap rounded-full border border-gold/70 bg-surface2 px-2 py-0.5 font-pixel text-[7px] text-gold">
                        LOG YOUR FIRST ENCOUNTER BELOW ↓
                      </span>
                    )}
                    {/* header */}
                    <div className="flex h-[28px] items-center gap-1.5 border-b border-hairline px-2">
                      <span className="font-display text-[9px] font-bold tabular-nums text-tx-muted">{String(i + 1).padStart(2, '0')}</span>
                      <span className="min-w-0 flex-1 truncate font-pixel text-[7px] uppercase tracking-[0.05em] text-tx-secondary">{node.label}</span>
                      {node.postGame && <span className="rounded-full border border-hairline2 px-1 font-pixel text-[6px] text-tx-muted">POST</span>}
                      <span className="flex shrink-0 items-center gap-[3px]">
                        {players.map((p) => {
                          const enc = encBy.get(`${p.id}:${node.id}`);
                          return <StatusDot key={p.id} size={4} status={enc ? enc.status : 'pending'} color={p.color} />;
                        })}
                      </span>
                    </div>
                    {/* player slots */}
                    <div>
                      {players.map((p) => {
                        const enc = encBy.get(`${p.id}:${node.id}`);
                        return (
                          <PlayerSlot
                            key={p.id}
                            enc={enc}
                            color={p.color}
                            playerName={p.name}
                            pendingSync={!!enc && pendingSync.has(enc.id)}
                            overCap={!!enc && !!cap && enc.level > cap && enc.status === 'caught'}
                            flashed={!!flash && flash.route === node.id && flash.playerId === p.id}
                            cascade={!!enc && cascadeIds.has(enc.id)}
                            nameOf={nameOf}
                            onPrefill={() => onPrefill(node.id, p.id)}
                            onOpen={onOpenEncounter}
                          />
                        );
                      })}
                    </div>
                    {/* footer */}
                    <div className="absolute inset-x-0 bottom-0 flex h-[20px] items-center gap-1 px-2">
                      <KindGlyph kind={node.kind} />
                      <PixelLabel className="text-[6px]">{node.kind.toUpperCase()}</PixelLabel>
                      <Link
                        to={`/maps/${region.region}?node=${node.id}`}
                        onClick={(e) => e.stopPropagation()}
                        title={`Open ${node.label} in Maps`}
                        aria-label={`Open ${node.label} in Maps`}
                        className="ml-auto flex items-center gap-0.5 text-tx-muted/50 transition-colors hover:text-gold"
                      >
                        <span className="font-pixel text-[6px]">MAPS</span>
                        <ExternalLink size={9} />
                      </Link>
                    </div>
                  </motion.li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>

      {/* edge scroll buttons */}
      {[
        { side: 'left' as const, icon: ChevronLeft, dir: -1 },
        { side: 'right' as const, icon: ChevronRight, dir: 1 },
      ].map(({ side, icon: Icon, dir }) => (
        <button
          key={side}
          type="button"
          aria-label={side === 'left' ? 'Scroll timeline left' : 'Scroll timeline right'}
          onClick={() => scrollRef.current?.scrollBy({ left: dir * STRIDE * 3, behavior: 'smooth' })}
          className={cn(
            'absolute top-1/2 z-20 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full border border-hairline2 bg-[rgba(13,15,22,0.85)] text-tx-secondary opacity-0 backdrop-blur transition-all hover:border-gold hover:text-gold group-hover/tl:opacity-100',
            side === 'left' ? 'left-2' : 'right-2',
          )}
        >
          <Icon size={15} />
        </button>
      ))}
    </section>
  );
}
