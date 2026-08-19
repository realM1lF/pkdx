/* Nuzlocke run — unified BOX storage (nuzlocke.md §2.6 overhaul).
 * Shows ALL non-team encounters of a player: boxed survivors plus dead,
 * missed, duped and SoulLink-lost rows (replaces the old graveyard).
 * Status badges: dead 💀 / missed 🌫 / lost 🔗 — non-living rows are dimmed
 * and LOCKED (not draggable, cannot enter the team). Filter chips on top:
 * All / Alive / Fallen (dead+lost) / Missed. */
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useLocalePath } from '@/lib/locale-link';
import { pokemonHref } from '@/lib/edition-nav';
import { motion } from 'framer-motion';
import { ArrowUpFromLine } from 'lucide-react';
import Sprite from '@/components/Sprite';
import { hasEvolved, speciesIdFor } from '@/lib/nuzlocke-evolution';
import { boxEntriesOf, pushToast, setEncounterParty } from '@/lib/nuzlocke-store';
import type { NuzEncounterRow, RunState } from '@/lib/nuzlocke-store';
import { cn } from '@/lib/utils';
import { PixelLabel } from './ui';
import { ENC_DND_MIME, encDnd } from './dnd';
import { boxStatusBadgeKey } from './box-status';

type BoxFilter = 'all' | 'alive' | 'fallen' | 'missed';

const FILTERS: BoxFilter[] = ['all', 'alive', 'fallen', 'missed'];

function matchesFilter(enc: NuzEncounterRow, f: BoxFilter): boolean {
  if (f === 'all') return true;
  if (f === 'alive') return enc.status === 'caught';
  if (f === 'fallen') return enc.status === 'dead' || enc.status === 'lost';
  return enc.status === 'missed' || enc.status === 'duped';
}

/* Holo-Dex: errors/fallen state are never red — gold (release reminder is
 * "active", releaseOnDeath ON) or plain muted hairline (releaseOnDeath OFF,
 * boxed forever is fine, no reminder needed — §A4/B5). */
function StatusBadge({ enc, releaseOnDeath }: { enc: NuzEncounterRow; releaseOnDeath: boolean }) {
  const { t } = useTranslation();
  if (enc.status === 'dead') {
    return releaseOnDeath ? (
      <span
        title={t('nuz.box.badge.deadReleaseTip')}
        className="inline-flex max-w-full items-center gap-0.5 rounded-sm border border-gold/50 bg-gold/10 px-1 font-pixel text-[8px] leading-[1.8] tracking-[0.05em] text-gold"
      >
        💀 {t('nuz.box.badge.deadRelease')}
      </span>
    ) : (
      <span
        title={t('nuz.box.badge.deadTip')}
        className="inline-flex max-w-full items-center gap-0.5 rounded-sm border border-hairline2 bg-surface3/60 px-1 font-pixel text-[8px] leading-[1.8] tracking-[0.05em] text-tx-muted"
      >
        💀 {t('nuz.box.badge.dead')}
      </span>
    );
  }
  if (enc.status === 'lost') {
    return (
      <span className="inline-flex max-w-full items-center gap-0.5 rounded-sm border border-gold/50 bg-gold/10 px-1 font-pixel text-[8px] leading-[1.8] tracking-[0.05em] text-gold">
        🔗 {t('nuz.box.badge.lost')}
      </span>
    );
  }
  /* missed vs duped — same muted chip, distinct label */
  return (
    <span className="inline-flex max-w-full items-center gap-0.5 rounded-sm border border-hairline2 bg-surface3/60 px-1 font-pixel text-[8px] leading-[1.8] tracking-[0.05em] text-tx-muted">
      🌫 {t(boxStatusBadgeKey(enc.status))}
    </span>
  );
}

function BoxCell({
  enc,
  color,
  nameOf,
  routeLabel,
  index,
  releaseOnDeath,
  game,
}: {
  enc: NuzEncounterRow;
  color: string;
  nameOf: (id: number) => string;
  routeLabel: (key: string) => string;
  index: number;
  releaseOnDeath: boolean;
  game: string;
}) {
  const navigate = useNavigate();
  const localePath = useLocalePath();
  const { t } = useTranslation();
  const nick = enc.nickname ?? nameOf(enc.pokemon_id);
  const [dragging, setDragging] = useState(false);
  /* non-living rows are locked: no drag source, no team action */
  const locked = enc.status !== 'caught';
  return (
    <motion.div
      role="link"
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.25, delay: Math.min(index, 10) * 0.03 }}
      draggable={!locked}
      onDragStart={(e: any) => {
        if (locked) {
          e.preventDefault();
          return;
        }
        const payload = { id: enc.id, playerId: enc.player_id, from: 'box' as const };
        e.dataTransfer.setData(ENC_DND_MIME, JSON.stringify(payload));
        e.dataTransfer.effectAllowed = 'move';
        encDnd.start(payload);
        setDragging(true);
      }}
      onDragEnd={() => {
        encDnd.end();
        setDragging(false);
      }}
      onClick={() => navigate(localePath(pokemonHref(enc.pokemon_id, { game })))}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${color}88`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '';
      }}
      title={
        locked
          ? t('nuz.box.cellTipLost', {
              name: nick,
              level: enc.level,
              status: t(`nuz.status${enc.status.charAt(0).toUpperCase() + enc.status.slice(1)}`),
              route: routeLabel(enc.route_key),
            })
          : t('nuz.box.cellTip', { name: nick, level: enc.level, route: routeLabel(enc.route_key) })
      }
      aria-label={t('nuz.box.openDexAria', { name: nick })}
      aria-disabled={locked}
      className={cn(
        'group/box relative flex w-[6.5rem] cursor-pointer flex-col items-center gap-0.5 overflow-hidden rounded-md border border-hairline bg-surface2/60 px-1.5 pb-1.5 pt-1 transition-all duration-150',
        dragging && 'opacity-40',
        locked && 'cursor-default opacity-50',
      )}
    >
      <span className={cn('transition-transform duration-200 group-hover/box:-translate-y-[6%]', enc.status === 'dead' && 'grayscale')}>
        <Sprite id={enc.pokemon_id} name={nameOf(enc.pokemon_id)} className="h-[4rem] w-[4rem]" skeleton={false} />
      </span>
      <span className={cn('max-w-full truncate text-micro11 font-semibold leading-tight text-tx-primary', locked && 'text-tx-muted', enc.status === 'dead' && 'line-through')}>{nick}</span>
      <span className="font-display text-micro9 font-bold tabular-nums text-tx-muted">
        LV {enc.level}
        {enc.is_shiny && <img src="/sparkle.svg" alt={t('nuz.shinyCatch')} title={t('nuz.shinyCatch')} className="ml-0.5 inline h-2.5 w-2.5 align-[-1px]" />}
      </span>
      {hasEvolved(enc) && (
        <span className="max-w-full truncate font-pixel text-[8px] tracking-[0.04em] text-tx-muted/70">
          {t('nuz.team.caughtAs', { name: nameOf(speciesIdFor(enc, 'caught')) })}
        </span>
      )}
      {locked ? (
        <StatusBadge enc={enc} releaseOnDeath={releaseOnDeath} />
      ) : (
        <span className="max-w-full truncate font-pixel text-[8px] leading-[1.6] text-tx-muted/80">
          {routeLabel(enc.route_key)}
        </span>
      )}
      {/* non-drag path (touch devices): direct "move to team" action — living only */}
      {!locked && (
        <button
          type="button"
          aria-label={t('nuz.dnd.toTeam')}
          title={t('nuz.dnd.toTeam')}
          onClick={(e) => {
            e.stopPropagation();
            const res = setEncounterParty(enc.run_id, enc.id, true);
            if (!res.ok && res.reason === 'full') pushToast('info', t('nuz.dnd.teamFull'));
            else if (!res.ok) pushToast('info', t('nuz.dnd.lockedState'));
            else pushToast('info', t('nuz.dnd.movedTeam', { name: nick }));
          }}
          className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-sm border border-hairline bg-void/90 text-tx-muted opacity-0 transition-opacity hover:text-gold group-hover/box:opacity-100"
        >
          <ArrowUpFromLine size={12} />
        </button>
      )}
    </motion.div>
  );
}

export default function BoxSection({
  state,
  nameOf,
  routeLabel,
}: {
  state: RunState;
  nameOf: (id: number) => string;
  routeLabel: (key: string) => string;
}) {
  const { t } = useTranslation();
  const players = useMemo(() => [...state.players].sort((a, b) => a.slot - b.slot), [state.players]);
  const [filter, setFilter] = useState<BoxFilter>('all');
  const [dropPlayer, setDropPlayer] = useState<string | null>(null);
  /* no useMemo: the store mutates state in place, so memoized derivations
   * would go stale (same object reference after every store update) */
  const entriesOf = new Map<string, NuzEncounterRow[]>();
  for (const p of players) entriesOf.set(p.id, boxEntriesOf(state, p.id).filter((e) => matchesFilter(e, filter)));
  const total = players.reduce((n, p) => n + (entriesOf.get(p.id)?.length ?? 0), 0);

  return (
    <section className="rounded-lg border border-hairline bg-surface1 p-4" aria-label={t('nuz.box.aria')}>
      <div className="flex flex-wrap items-baseline gap-3">
        <h4 className="font-sans text-[0.9375rem] font-bold text-tx-primary">{t('nuz.box.title')}</h4>
        <PixelLabel>{t('nuz.box.note')}</PixelLabel>
        <span className="ml-auto font-display text-micro12 font-bold tabular-nums text-tx-muted">{t('nuz.box.count', { count: total })}</span>
      </div>
      {/* filter chips */}
      <div className="mt-2 flex flex-wrap items-center gap-1" role="group" aria-label={t('nuz.box.aria')}>
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
            className={cn(
              'rounded-full border px-2.5 py-1 font-display text-micro10 font-bold tracking-[0.04em] transition-colors',
              filter === f
                ? 'border-gold/60 bg-gold/10 text-gold'
                : 'border-hairline2 text-tx-muted hover:border-gold/40 hover:text-tx-secondary',
            )}
          >
            {t(`nuz.box.filter.${f}`)}
          </button>
        ))}
      </div>
      <div className="mt-3">
        {players.map((p) => {
          const boxed = entriesOf.get(p.id) ?? [];
          return (
            <div
              key={p.id}
              className={cn(
                'flex flex-col gap-2 border-t py-2 transition-colors first:border-t-0 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:gap-3',
                dropPlayer === p.id ? 'border-gold/50 bg-gold/5' : 'border-hairline',
              )}
              onDragOver={(e: any) => {
                const d = encDnd.peek();
                if (d && d.from === 'party' && d.playerId === p.id) {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'move';
                  setDropPlayer(p.id);
                }
              }}
              onDragLeave={(e: any) => {
                if (!e.currentTarget.contains(e.relatedTarget as Node)) setDropPlayer(null);
              }}
              onDrop={(e: any) => {
                e.preventDefault();
                setDropPlayer(null);
                const d = encDnd.peek();
                encDnd.end();
                if (!d || d.from !== 'party') return;
                if (d.playerId !== p.id) {
                  pushToast('info', t('nuz.dnd.wrongPlayer'));
                  return;
                }
                const res = setEncounterParty(p.run_id, d.id, false);
                if (res.ok) {
                  const dragged = state.encounters.find((x) => x.id === d.id);
                  const nick = dragged?.nickname ?? (dragged ? nameOf(dragged.pokemon_id) : '?');
                  pushToast('info', t('nuz.dnd.movedBox', { name: nick }));
                }
              }}
            >
              {/* identity cluster: color chip + name + boxed count */}
              <div className="flex h-10 w-full shrink-0 items-center gap-1.5 sm:w-[8.75rem]">
                <span className="h-2.5 w-2.5 shrink-0 rounded-[0.1875rem]" style={{ background: p.color }} />
                <span className="truncate font-display text-micro12 font-bold text-tx-primary">{p.name}</span>
                <span className="ml-auto text-micro10 tabular-nums text-tx-muted">{boxed.length}</span>
              </div>
              {boxed.length === 0 ? (
                <div
                  className={cn(
                    'grid min-h-[4.5rem] flex-1 place-items-center rounded-md border border-dashed transition-colors',
                    dropPlayer === p.id ? 'border-gold/50 opacity-100' : 'border-hairline2 opacity-50',
                  )}
                >
                  <PixelLabel>{dropPlayer === p.id ? t('nuz.dnd.dropHere') : t('nuz.box.empty')}</PixelLabel>
                </div>
              ) : (
                <div className="flex min-w-0 flex-1 flex-wrap gap-2">
                  {boxed.map((enc, i) => (
                    <BoxCell
                      key={enc.id}
                      enc={enc}
                      color={p.color}
                      nameOf={nameOf}
                      routeLabel={routeLabel}
                      index={i}
                      releaseOnDeath={state.run.rules.releaseOnDeath}
                      game={state.run.game}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
