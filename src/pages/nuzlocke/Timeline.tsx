/* Nuzlocke run — THE TIMELINE (nuzlocke.md §2.3): horizontal route-card
 * track in canonical order + SoulLink pulse on player border-lefts.
 * Drag / shift-wheel scroll. */
import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { LocaleLink } from '@/lib/locale-link';
import { isRegionId, nodeName } from '@/lib/regions';
import { useLanguage } from '@/lib/i18n-data';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import Sprite from '@/components/Sprite';
import { routeOrder } from '@/lib/regions';
import type { MapNode, RegionMap } from '@/lib/regions';
import { speciesIdFor } from '@/lib/nuzlocke-evolution';
import { youAreHereKey } from '@/lib/nuzlocke-store';
import { isSlotConsuming } from '@/lib/nuzlocke-rules';
import type { NuzEncounterRow, RunState, SoulLinkGroup } from '@/lib/nuzlocke-store';
import { cn } from '@/lib/utils';
import { PixelLabel, StatusDot, timeAgo } from './ui';

const CARD_W = 188;
const GAP = 14;
const STRIDE = CARD_W + GAP;
const HEADER_H = 32;
const SLOT_H = 58;
const FOOTER_H = 24;

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

/* ---------- SoulLink: glow dot travels along slot border-lefts ---------- */

function SoulLinkPulse({
  firstSlot,
  lastSlot,
  broken,
  label,
}: {
  firstSlot: number;
  lastSlot: number;
  broken: boolean;
  label: string;
}) {
  const top = firstSlot * SLOT_H;
  const height = (lastSlot - firstSlot + 1) * SLOT_H;
  return (
    <div
      className="pointer-events-none absolute left-0 z-10 w-[2px]"
      style={{ top, height }}
      title={label}
      aria-hidden
    >
      {!broken && <span className="nz-sl-dot" />}
    </div>
  );
}

/* ---------- player slot ---------- */

interface SlotProps {
  enc: NuzEncounterRow | undefined;
  color: string;
  playerName: string;
  pendingSync: boolean;
  flashed: boolean;
  cascade: boolean;
  /** this slot is part of a SoulLink group on the route */
  linked?: boolean;
  linkBroken?: boolean;
  nameOf: (id: number) => string;
  onPrefill: () => void;
  onOpen: (enc: NuzEncounterRow, x: number, y: number) => void;
}

function PlayerSlot({
  enc,
  color,
  playerName,
  pendingSync,
  flashed,
  cascade,
  linked,
  linkBroken,
  nameOf,
  onPrefill,
  onOpen,
}: SlotProps) {
  const { t } = useTranslation();
  const speciesId = enc ? speciesIdFor(enc, 'caught') : 0;
  const speciesName = enc ? nameOf(speciesId) : '';
  const tip = enc
    ? t('nuz.timeline.slotTip', {
        name: `${speciesName}${enc.nickname ? ` '${enc.nickname}'` : ''}`,
        level: enc.level,
        status: t(`nuz.status${enc.status.charAt(0).toUpperCase() + enc.status.slice(1)}`),
        time: timeAgo(enc.created_at),
        player: playerName,
      })
    : undefined;
  return (
    <div
      className={cn(
        'relative flex h-[58px] items-center gap-2 border-b border-hairline px-2 last:border-b-0',
        cascade && 'nz-shake',
        linked && !linkBroken && 'nz-sl-border',
        linked && linkBroken && 'opacity-80',
      )}
      style={
        {
          borderLeft: `${linked && !linkBroken ? 3 : 2}px solid ${color}`,
          ['--sl-c' as string]: color,
        } as CSSProperties
      }
      title={tip}
    >
      {flashed && <span className="nz-ring-flash pointer-events-none absolute inset-0 rounded-sm" style={{ '--ring-c': color } as CSSProperties} />}
      {!enc ? (
        <button
          type="button"
          onClick={onPrefill}
          aria-label={t('nuz.timeline.logFor', { player: playerName })}
          className="mx-auto h-[40px] w-full rounded-sm border border-dashed border-hairline2 transition-colors hover:border-gold/50 hover:bg-gold/[0.04]"
        />
      ) : enc.status === 'dead' || enc.status === 'lost' ? (
        <button
          type="button"
          className="flex min-w-0 flex-1 items-center gap-2 text-left"
          onClick={(e) => {
            e.stopPropagation();
            onOpen(enc, e.clientX, e.clientY);
          }}
          aria-label={t('nuz.timeline.optionsAria', { name: enc.nickname ?? speciesName })}
        >
          <span data-slot-enc={enc.id} className="nz-dead-sprite inline-block shrink-0">
            <Sprite id={speciesId} name={speciesName} className="h-[44px] w-[44px]" skeleton={false} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[12px] font-semibold leading-tight text-tx-muted line-through">
              {enc.nickname ?? speciesName}
              {enc.is_shiny && <img src="/sparkle.svg" alt={t('nuz.shinyCatch')} className="ml-1 inline h-3 w-3 align-[-1px]" />}
            </span>
            <span className="mt-0.5 block font-display text-[10px] font-bold tabular-nums text-tx-muted/70">LV {enc.level}</span>
          </span>
          {enc.status === 'lost' ? (
            <span className="shrink-0 rounded-full border border-gold/60 px-1.5 font-pixel text-[7px] tracking-[0.06em] text-gold" aria-label={t('nuz.statusLost')}>
              🔗
            </span>
          ) : (
            <span className="h-2.5 w-2.5 shrink-0 rounded-full border border-gold/70" aria-label={t('nuz.timeline.fallen')} />
          )}
        </button>
      ) : enc.status === 'missed' || enc.status === 'duped' ? (
        <button
          type="button"
          className="flex min-w-0 flex-1 items-center gap-2 text-left"
          onClick={(e) => {
            e.stopPropagation();
            onOpen(enc, e.clientX, e.clientY);
          }}
          aria-label={t('nuz.timeline.optionsAria', { name: speciesName })}
        >
          <span data-slot-enc={enc.id} className="inline-block shrink-0 opacity-30">
            <Sprite id={speciesId} name={speciesName} className="h-[44px] w-[44px]" skeleton={false} />
          </span>
          <span className="min-w-0 flex-1 truncate text-[12px] text-tx-muted">
            {speciesName}
            {enc.is_shiny && <img src="/sparkle.svg" alt={t('nuz.shinyCatch')} className="ml-1 inline h-3 w-3 align-[-1px]" />}
          </span>
          <span className="shrink-0 rounded-full border border-gold/60 px-1.5 font-pixel text-[7px] tracking-[0.06em] text-gold">
            {t(enc.status === 'missed' ? 'nuz.statusMissed' : 'nuz.statusDuped')}
          </span>
        </button>
      ) : (
        <button
          type="button"
          className="group/slot flex min-w-0 flex-1 items-center gap-2 text-left"
          onClick={(e) => {
            e.stopPropagation();
            onOpen(enc, e.clientX, e.clientY);
          }}
          aria-label={t('nuz.timeline.optionsAria', { name: enc.nickname ?? speciesName })}
        >
          <span data-slot-enc={enc.id} className="inline-block shrink-0 transition-transform duration-200 group-hover/slot:-translate-y-[6%]">
            <Sprite id={speciesId} name={speciesName} className="h-[48px] w-[48px]" skeleton={false} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[12px] font-semibold leading-tight text-tx-primary">
              {enc.nickname ?? speciesName}
              {enc.is_shiny && <img src="/sparkle.svg" alt={t('nuz.shinyCatch')} className="ml-1 inline h-3 w-3 align-[-1px]" />}
            </span>
            <span className="mt-0.5 block font-display text-[10px] font-bold tabular-nums text-tx-muted">LV {enc.level}</span>
          </span>
          {pendingSync && <span className="nz-orbit h-1.5 w-1.5 shrink-0" aria-label={t('nuz.timeline.pendingSync')} />}
        </button>
      )}
      {cascade && enc?.status === 'caught' && (
        <span className="absolute -top-1.5 right-1 rounded-full border border-gold bg-surface2 px-1.5 font-pixel text-[7px] text-gold" title={t('nuz.timeline.boxCascade')}>
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
  groups: SoulLinkGroup[];
  nameOf: (id: number) => string;
  flash: { route: string; playerId: string; key: number } | null;
  cascadeIds: Set<string>;
  pendingSync: Set<string>;
  onPrefill: (routeKey: string, playerId: string) => void;
  onOpenEncounter: (enc: NuzEncounterRow, x: number, y: number) => void;
}

export default function Timeline({ state, region, groups, nameOf, flash, cascadeIds, pendingSync, onPrefill, onOpenEncounter }: TimelineProps) {
  const { t } = useTranslation();
  const lang = useLanguage();
  const nodes = useMemo(() => routeOrder(region), [region]);
  const players = useMemo(() => [...state.players].sort((a, b) => a.slot - b.slot), [state.players]);
  const hereKey = youAreHereKey(state);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragged = useRef(false);
  const [dragging, setDragging] = useState(false);
  const cardIndex = useMemo(() => new Map(nodes.map((n, i) => [n.id, i])), [nodes]);
  const trackW = nodes.length * STRIDE - GAP;
  const groupsByRoute = useMemo(() => new Map(groups.map((g) => [g.routeKey, g])), [groups]);

  const encBy = useMemo(() => {
    /* one slot per (player, route): the slot-consuming row wins; among
     * non-consuming rows (duped/shiny) the newest one shows */
    const m = new Map<string, NuzEncounterRow>();
    for (const e of state.encounters) {
      const k = `${e.player_id}:${e.route_key}`;
      const cur = m.get(k);
      if (!cur || (!isSlotConsuming(cur) && (isSlotConsuming(e) || e.created_at >= cur.created_at))) m.set(k, e);
    }
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
    /* no pointer capture here — capturing on pointerdown retargets the whole
     * gesture (incl. click) to this container, so card clicks / context menus
     * never fire. Capture only once the drag threshold is exceeded. */
  };
  const onPointerMove = (e: ReactPointerEvent) => {
    if (e.buttons !== 1) return;
    const dx = e.clientX - dragState.current.x;
    if (!dragged.current && Math.abs(dx) > 5) {
      dragged.current = true;
      setDragging(true);
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
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
  const cardH = HEADER_H + players.length * SLOT_H + FOOTER_H;

  return (
    <section className="group/tl relative rounded-xl border border-hairline bg-[#07080D]" aria-label={t('nuz.timeline.aria')}>
      <div className="nz-player-hairline rounded-t-xl" style={hairlineVars} />
      <div
        className="pointer-events-none absolute inset-0 rounded-xl opacity-[0.04] mix-blend-overlay"
        style={{ backgroundImage: 'url(/grain.webp)' }}
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
            <ol className="relative flex gap-3.5" role="list">
              {nodes.map((node, i) => {
                const isHere = node.id === hereKey;
                const linkGroup = groupsByRoute.get(node.id);
                const linkedIds = new Set(linkGroup?.members.map((m) => m.player_id) ?? []);
                const linkedSlots = players
                  .map((p, pi) => (linkedIds.has(p.id) ? pi : -1))
                  .filter((pi) => pi >= 0);
                const linkLabel = linkGroup
                  ? linkGroup.members.length === 2
                    ? t('nuz.timeline.soulLinkTip', {
                        a: linkGroup.members[0].nickname ?? nameOf(linkGroup.members[0].pokemon_id),
                        b: linkGroup.members[1].nickname ?? nameOf(linkGroup.members[1].pokemon_id),
                      })
                    : t('nuz.timeline.soulLinkTipGroup', {
                        names: linkGroup.members.map((m) => m.nickname ?? nameOf(m.pokemon_id)).join(' · '),
                      })
                  : '';
                return (
                  <motion.li
                    key={node.id}
                    role="listitem"
                    initial={i < 12 ? { x: 40, opacity: 0 } : false}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.35, delay: i < 12 ? i * 0.02 : 0 }}
                    className={cn(
                      'relative w-[188px] shrink-0 rounded-md border bg-surface1 transition-all duration-200 hover:-translate-y-1 hover:border-gold/30',
                      node.postGame ? 'border-hairline opacity-60' : 'border-hairline',
                      isHere && 'border-gold/60 shadow-[inset_0_2px_0_0_var(--gold),0_0_18px_rgba(246,201,69,0.12)]',
                    )}
                    style={{ height: cardH }}
                    aria-label={nodeName(node, lang)}
                  >
                    {isHere && !(empty && i === 0) && (
                      <span className="nz-bob absolute -top-6 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full border border-gold bg-void px-2 py-0.5 font-pixel text-[8px] tracking-[0.08em] text-gold">
                        {t('nuz.timeline.youAreHere')}
                      </span>
                    )}
                    {empty && i === 0 && (
                      <span className="nz-bob absolute -top-6 left-1/2 z-20 w-max -translate-x-1/2 whitespace-nowrap rounded-full border border-gold/70 bg-surface2 px-2 py-0.5 font-pixel text-[8px] text-gold">
                        {t('nuz.timeline.firstEncounter')}
                      </span>
                    )}
                    {/* header */}
                    <div className="flex h-[32px] items-center gap-1.5 border-b border-hairline px-2.5">
                      <span className="font-display text-[10px] font-bold tabular-nums text-tx-muted">{String(i + 1).padStart(2, '0')}</span>
                      <span className="min-w-0 flex-1 truncate font-pixel text-[8px] uppercase tracking-[0.05em] text-tx-secondary">{nodeName(node, lang)}</span>
                      {node.postGame && <span className="rounded-full border border-hairline2 px-1 font-pixel text-[7px] text-tx-muted">{t('nuz.timeline.post')}</span>}
                      <span className="flex shrink-0 items-center gap-1">
                        {players.map((p) => {
                          const enc = encBy.get(`${p.id}:${node.id}`);
                          return <StatusDot key={p.id} size={5} status={enc ? enc.status : 'pending'} color={p.color} />;
                        })}
                      </span>
                    </div>
                    {/* player slots + SoulLink pulse on the shared left edge */}
                    <div className="relative">
                      {linkedSlots.length >= 2 && linkGroup && (
                        <SoulLinkPulse
                          firstSlot={linkedSlots[0]}
                          lastSlot={linkedSlots[linkedSlots.length - 1]}
                          broken={linkGroup.broken}
                          label={linkLabel}
                        />
                      )}
                      {players.map((p) => {
                        const enc = encBy.get(`${p.id}:${node.id}`);
                        const linked = linkedIds.has(p.id);
                        return (
                          <PlayerSlot
                            key={p.id}
                            enc={enc}
                            color={p.color}
                            playerName={p.name}
                            pendingSync={!!enc && pendingSync.has(enc.id)}
                            flashed={!!flash && flash.route === node.id && flash.playerId === p.id}
                            cascade={!!enc && cascadeIds.has(enc.id)}
                            linked={linked}
                            linkBroken={linked && !!linkGroup?.broken}
                            nameOf={nameOf}
                            onPrefill={() => onPrefill(node.id, p.id)}
                            onOpen={onOpenEncounter}
                          />
                        );
                      })}
                    </div>
                    {/* footer */}
                    <div className="absolute inset-x-0 bottom-0 flex h-[24px] items-center gap-1.5 px-2.5">
                      <KindGlyph kind={node.kind} />
                      <PixelLabel className="text-[8px]">{t(`maps.kind${node.kind.charAt(0).toUpperCase() + node.kind.slice(1)}`, { defaultValue: node.kind.toUpperCase() })}</PixelLabel>
                      {/* EP5.3 — map chip only for atlas regions; freeform
                          (Gen 6–9) runs are decoupled from /maps */}
                      {isRegionId(region.region) && (
                        <LocaleLink
                          to={`/maps/${region.region}?node=${node.id}`}
                          onClick={(e) => e.stopPropagation()}
                          title={t('nuz.openInMaps', { label: nodeName(node, lang) })}
                          aria-label={t('nuz.openInMaps', { label: nodeName(node, lang) })}
                          className="ml-auto flex items-center gap-0.5 text-tx-muted/50 transition-colors hover:text-gold"
                        >
                          <span className="font-pixel text-[7px]">{t('nuz.mapsChip')}</span>
                          <ExternalLink size={10} />
                        </LocaleLink>
                      )}
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
          aria-label={side === 'left' ? t('nuz.timeline.scrollLeft') : t('nuz.timeline.scrollRight')}
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
