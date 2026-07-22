/* Nuzlocke run — visible BOX storage (nuzlocke.md §2.6 extension).
 * Alive catches marked in_party=false land here. Per player a dense row:
 * color chip + name + count, then sprite cells. Drag a cell into a party
 * grid above to activate it (drop onto a party card = swap); drop a party
 * card on a box row to box it. */
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useLocalePath } from '@/lib/locale-link';
import { motion } from 'framer-motion';
import { ArrowUpFromLine } from 'lucide-react';
import Sprite from '@/components/Sprite';
import { boxedOf, pushToast, setEncounterParty } from '@/lib/nuzlocke-store';
import type { NuzEncounterRow, RunState } from '@/lib/nuzlocke-store';
import { cn } from '@/lib/utils';
import { PixelLabel } from './ui';
import { ENC_DND_MIME, encDnd } from './dnd';

function BoxCell({
  enc,
  color,
  nameOf,
  routeLabel,
  index,
}: {
  enc: NuzEncounterRow;
  color: string;
  nameOf: (id: number) => string;
  routeLabel: (key: string) => string;
  index: number;
}) {
  const navigate = useNavigate();
  const localePath = useLocalePath();
  const { t } = useTranslation();
  const nick = enc.nickname ?? nameOf(enc.pokemon_id);
  const [dragging, setDragging] = useState(false);
  return (
    <motion.div
      role="link"
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.25, delay: Math.min(index, 10) * 0.03 }}
      draggable
      onDragStart={(e: any) => {
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
      onClick={() => navigate(localePath(`/pokemon/${enc.pokemon_id}`))}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${color}88`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '';
      }}
      title={t('nuz.box.cellTip', { name: nick, level: enc.level, route: routeLabel(enc.route_key) })}
      aria-label={t('nuz.box.openDexAria', { name: nick })}
      className={cn(
        'group/box relative flex w-[64px] cursor-pointer flex-col items-center gap-0 rounded-sm border border-hairline bg-surface2/60 px-1 pb-1 pt-0.5 transition-all duration-150',
        dragging && 'opacity-40',
      )}
    >
      <span className="transition-transform duration-200 group-hover/box:-translate-y-[6%]">
        <Sprite id={enc.pokemon_id} name={nameOf(enc.pokemon_id)} className="h-[40px] w-[40px]" skeleton={false} />
      </span>
      <span className="max-w-full truncate text-[9px] font-semibold leading-tight text-tx-primary">{nick}</span>
      <span className="font-display text-[7px] font-bold tabular-nums text-tx-muted">
        LV {enc.level}
        {enc.is_shiny && <img src="/sparkle.svg" alt={t('nuz.shinyCatch')} title={t('nuz.shinyCatch')} className="ml-0.5 inline h-2 w-2 align-[-1px]" />}
      </span>
      <span className="max-w-full truncate font-pixel text-[6px] uppercase leading-[1.6] text-tx-muted/80">
        {routeLabel(enc.route_key)}
      </span>
      {/* non-drag path (touch devices): direct "move to team" action */}
      <button
        type="button"
        aria-label={t('nuz.dnd.toTeam')}
        title={t('nuz.dnd.toTeam')}
        onClick={(e) => {
          e.stopPropagation();
          const res = setEncounterParty(enc.run_id, enc.id, true);
          if (!res.ok && res.reason === 'full') pushToast('info', t('nuz.dnd.teamFull'));
          else if (res.ok) pushToast('info', t('nuz.dnd.movedTeam', { name: nick }));
        }}
        className="absolute right-0.5 top-0.5 grid h-5 w-5 place-items-center rounded-sm border border-hairline bg-void/90 text-tx-muted opacity-0 transition-opacity hover:text-gold group-hover/box:opacity-100"
      >
        <ArrowUpFromLine size={11} />
      </button>
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
  const total = players.reduce((n, p) => n + boxedOf(state, p.id).length, 0);
  const [dropPlayer, setDropPlayer] = useState<string | null>(null);

  return (
    <section className="rounded-lg border border-hairline bg-surface1 p-4" aria-label={t('nuz.box.aria')}>
      <div className="flex items-baseline gap-3">
        <h4 className="font-sans text-[15px] font-bold text-tx-primary">{t('nuz.box.title')}</h4>
        <PixelLabel>{t('nuz.box.note')}</PixelLabel>
        <span className="ml-auto font-display text-[12px] font-bold tabular-nums text-tx-muted">{t('nuz.box.count', { count: total })}</span>
      </div>
      <div className="mt-3">
        {players.map((p) => {
          const boxed = boxedOf(state, p.id);
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
              <div className="flex h-10 w-full shrink-0 items-center gap-1.5 sm:w-[140px]">
                <span className="h-2.5 w-2.5 shrink-0 rounded-[3px]" style={{ background: p.color }} />
                <span className="truncate font-display text-[12px] font-bold text-tx-primary">{p.name}</span>
                <span className="ml-auto text-[10px] tabular-nums text-tx-muted">{boxed.length}</span>
              </div>
              {boxed.length === 0 ? (
                <div
                  className={cn(
                    'grid h-10 flex-1 place-items-center rounded-sm border border-dashed transition-colors',
                    dropPlayer === p.id ? 'border-gold/50 opacity-100' : 'border-hairline2 opacity-50',
                  )}
                >
                  <PixelLabel>{dropPlayer === p.id ? t('nuz.dnd.dropHere') : t('nuz.box.empty')}</PixelLabel>
                </div>
              ) : (
                <div className="flex min-w-0 flex-1 flex-wrap gap-1.5">
                  {boxed.map((enc, i) => (
                    <BoxCell key={enc.id} enc={enc} color={p.color} nameOf={nameOf} routeLabel={routeLabel} index={i} />
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
