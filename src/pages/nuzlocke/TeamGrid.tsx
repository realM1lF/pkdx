/* Nuzlocke run — ACTIVE PARTIES team grid (nuzlocke.md §2.6).
 * players × 6 slots; click → /pokemon/:id. Boxed survivors render in the
 * always-visible BOX section below (BoxSection) — no hidden drawer.
 * Drag & drop: drag a party card onto a BOX row to box it; drop a boxed
 * card here to add it (onto a card = swap when the party is full). */
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useLocalePath } from '@/lib/locale-link';
import { AnimatePresence, motion } from 'framer-motion';
import { ExternalLink, MoreVertical } from 'lucide-react';
import Sprite from '@/components/Sprite';
import { LocaleLink } from '@/lib/locale-link';
import { hasEvolved, speciesIdFor } from '@/lib/nuzlocke-evolution';
import { myPlayerId, partyOf, pushToast, setEncounterParty, swapParty } from '@/lib/nuzlocke-store';
import type { NuzEncounterRow, RunState } from '@/lib/nuzlocke-store';
import { getPokemon, pokemonTypes } from '@/lib/pokeapi';
import { TYPE_COLORS } from '@/lib/types';
import { nameOfType, useLanguage } from '@/lib/i18n-data';
import type { PokemonType } from '@/lib/types';
import { cn } from '@/lib/utils';
import { PixelLabel } from './ui';
import { ENC_DND_MIME, encDnd } from './dnd';

function useTypes(id: number): string[] {
  const [types, setTypes] = useState<string[]>([]);
  useEffect(() => {
    let live = true;
    void getPokemon(id)
      .then((p) => {
        if (live) setTypes(pokemonTypes(p));
      })
      .catch(() => undefined);
    return () => {
      live = false;
    };
  }, [id]);
  return types;
}

function TypeChip({ type }: { type: string }) {
  const lang = useLanguage();
  const c = TYPE_COLORS[type as PokemonType];
  return (
    <span
      className="min-w-0 max-w-[4.5rem] truncate rounded-full px-1.5 text-[9px] font-bold uppercase leading-[14px]"
      style={{ background: `rgba(${c?.rgb ?? '168,176,181'},0.18)`, color: c?.base ?? '#A9B0B5' }}
    >
      {nameOfType(type, lang)}
    </span>
  );
}

function PartySlot({
  enc,
  color,
  linked,
  partnerName,
  nameOf,
  encounters,
  onMenu,
}: {
  enc: NuzEncounterRow;
  color: string;
  linked: boolean;
  partnerName: string | null;
  nameOf: (id: number) => string;
  encounters: NuzEncounterRow[];
  onMenu: (enc: NuzEncounterRow, x: number, y: number) => void;
}) {
  const navigate = useNavigate();
  const localePath = useLocalePath();
  const { t } = useTranslation();
  const types = useTypes(enc.pokemon_id);
  const [dragging, setDragging] = useState(false);
  const [swapTarget, setSwapTarget] = useState(false);
  return (
    <motion.div
      key={enc.id}
      layout
      exit={{ opacity: 0, scale: 0.8, y: -8, filter: 'grayscale(1)' }}
      transition={{ duration: 0.4 }}
      draggable
      onDragStart={(e: any) => {
        const payload = { id: enc.id, playerId: enc.player_id, from: 'party' as const };
        e.dataTransfer.setData(ENC_DND_MIME, JSON.stringify(payload));
        e.dataTransfer.effectAllowed = 'move';
        encDnd.start(payload);
        setDragging(true);
      }}
      onDragEnd={() => {
        encDnd.end();
        setDragging(false);
        setSwapTarget(false);
      }}
      onDragOver={(e: any) => {
        const d = encDnd.peek();
        /* a boxed card hovering this party card = swap offer */
        if (d && d.from === 'box' && d.playerId === enc.player_id) {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          setSwapTarget(true);
        }
      }}
      onDragLeave={() => setSwapTarget(false)}
      onDrop={(e: any) => {
        e.preventDefault();
        e.stopPropagation();
        setSwapTarget(false);
        const d = encDnd.peek();
        encDnd.end();
        if (!d || d.from !== 'box') return;
        if (d.playerId !== enc.player_id) {
          pushToast('info', t('nuz.dnd.wrongPlayer'));
          return;
        }
        const res = swapParty(enc.run_id, d.id, enc.id);
        if (!res.ok && res.reason === 'wrong-state') {
          pushToast('info', t('nuz.dnd.lockedState'));
          return;
        }
        if (res.ok) {
          const dragged = encounters.find((x) => x.id === d.id);
          const aNick = dragged?.nickname ?? (dragged ? nameOf(dragged.pokemon_id) : '?');
          pushToast('info', t('nuz.dnd.swapped', { a: aNick, b: enc.nickname ?? nameOf(enc.pokemon_id) }));
        }
      }}
      className={cn(
        /* full-width row: sprite left, info column right — never clipped */
        'group/cell relative flex min-h-[120px] w-full min-w-0 cursor-pointer items-center gap-4 overflow-hidden rounded-md border border-hairline bg-surface2 px-4 py-3 transition-all',
        dragging && 'opacity-40',
        swapTarget && 'border-gold/70 shadow-glow-gold',
      )}
      style={{ ['--pc' as string]: color }}
      onClick={() => navigate(localePath(`/pokemon/${enc.pokemon_id}`))}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = `${color}88`)}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = '')}
      title={t('nuz.team.openDex', { name: enc.nickname ?? nameOf(enc.pokemon_id) })}
      role="link"
      aria-label={t('nuz.team.openDexAria', { name: enc.nickname ?? nameOf(enc.pokemon_id) })}
    >
      <span className="shrink-0 self-center transition-transform duration-200 group-hover/cell:-translate-y-[6%]">
        <Sprite id={enc.pokemon_id} name={nameOf(enc.pokemon_id)} className="h-[96px] w-[96px]" skeleton={false} />
      </span>
      <span className="flex min-w-0 flex-1 flex-col justify-center gap-1.5">
        <span className="truncate pr-6 text-[15px] font-semibold leading-tight text-tx-primary">
          {enc.nickname ?? nameOf(enc.pokemon_id)}
        </span>
        <span className="font-display text-[11px] font-bold tabular-nums text-tx-muted">LV {enc.level}</span>
        <span className="flex min-w-0 flex-nowrap items-center gap-1.5">
          {types.slice(0, 2).map((tp) => (
            <TypeChip key={tp} type={tp} />
          ))}
        </span>
        {hasEvolved(enc) && (
          <span className="truncate font-pixel text-[8px] tracking-[0.04em] text-tx-muted/80">
            {t('nuz.team.caughtAs', { name: nameOf(speciesIdFor(enc, 'caught')) })}
          </span>
        )}
      </span>
      {(linked || enc.is_shiny) && (
        <span className="absolute bottom-2 left-2 flex items-center gap-1">
          {linked && (
            <img src="/sparkle.svg" alt="" className="h-3 w-3" title={partnerName ? t('nuz.team.soulLinkedWith', { name: partnerName }) : t('nuz.team.soulLinked')} />
          )}
          {enc.is_shiny && (
            <img src="/sparkle.svg" alt={t('nuz.shinyCatch')} title={t('nuz.shinyCatch')} className="h-3 w-3" />
          )}
        </span>
      )}
      <button
        type="button"
        aria-label={t('nuz.team.options')}
        onClick={(e) => {
          e.stopPropagation();
          onMenu(enc, e.clientX, e.clientY);
        }}
        className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-sm text-tx-muted opacity-0 transition-opacity hover:text-gold group-hover/cell:opacity-100"
      >
        <MoreVertical size={14} />
      </button>
    </motion.div>
  );
}

export default function TeamGrid({
  state,
  online,
  nameOf,
  linkPartner,
  onMenu,
}: {
  state: RunState;
  online: Record<string, { name: string; color: string }>;
  nameOf: (id: number) => string;
  linkPartner: (encId: string) => NuzEncounterRow | null;
  onMenu: (enc: NuzEncounterRow, x: number, y: number) => void;
}) {
  const { t } = useTranslation();
  const players = useMemo(() => [...state.players].sort((a, b) => a.slot - b.slot), [state.players]);
  const [dropPlayer, setDropPlayer] = useState<string | null>(null);
  const mine =
    myPlayerId(state.run.id) ?? (state.mode === 'solo' ? state.players[0]?.id ?? null : null);

  return (
    <section className="rounded-lg border border-hairline bg-surface1 p-4" aria-label={t('nuz.team.aria')}>
      <div className="flex items-baseline gap-3">
        <h4 className="font-sans text-[15px] font-bold text-tx-primary">{t('nuz.team.title')}</h4>
        <PixelLabel>{t('nuz.team.note')}</PixelLabel>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-4">
        {players.map((p, pi) => {
          const party = partyOf(state, p.id);
          return (
            <motion.div
              key={p.id}
              initial={{ y: 16, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: pi * 0.06 }}
              className={cn(
                'rounded-md border bg-surface2/40 p-3 transition-colors',
                dropPlayer === p.id ? 'border-gold/60' : 'border-hairline',
              )}
              onDragOver={(e: any) => {
                const d = encDnd.peek();
                if (d && d.from === 'box' && d.playerId === p.id) {
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
                if (!d || d.from !== 'box') return;
                if (d.playerId !== p.id) {
                  pushToast('info', t('nuz.dnd.wrongPlayer'));
                  return;
                }
                const res = setEncounterParty(p.run_id, d.id, true);
                if (!res.ok && res.reason === 'full') {
                  pushToast('info', t('nuz.dnd.teamFull'));
                } else if (!res.ok) {
                  /* dead/missed/lost rows are locked — double-safety next to
                   * the box cell not being draggable */
                  pushToast('info', t('nuz.dnd.lockedState'));
                } else if (res.ok) {
                  const dragged = state.encounters.find((x) => x.id === d.id);
                  const nick = dragged?.nickname ?? (dragged ? nameOf(dragged.pokemon_id) : '?');
                  pushToast('info', t('nuz.dnd.movedTeam', { name: nick }));
                }
              }}
            >
              <div className="flex h-8 items-center gap-1.5">
                <span className={cn('h-2.5 w-2.5 rounded-full', online[p.id] && 'nz-presence-ring')} style={{ background: p.color }} />
                <span className="min-w-0 truncate font-display text-[13px] font-bold text-tx-primary">{p.name}</span>
                <span className="text-[10px] tabular-nums text-tx-muted">{party.length}/6</span>
                <LocaleLink
                  to={
                    mine === p.id
                      ? `/team?fromRun=${state.run.id}`
                      : `/team?viewRun=${state.run.id}&player=${p.id}`
                  }
                  className="ml-auto inline-flex items-center gap-1 rounded-sm border border-hairline px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-tx-muted transition-colors hover:border-gold/50 hover:text-gold"
                  title={mine === p.id ? t('nuz.team.openMine') : t('nuz.team.openView')}
                  aria-label={mine === p.id ? t('nuz.team.openMine') : t('nuz.team.openView')}
                >
                  <ExternalLink size={11} />
                  <span className="hidden sm:inline">{mine === p.id ? t('nuz.team.openMineShort') : t('nuz.team.openViewShort')}</span>
                </LocaleLink>
              </div>
              <div className="grid grid-cols-1 gap-2">
                <AnimatePresence mode="popLayout">
                  {party.map((enc) => {
                    const partner = linkPartner(enc.id);
                    const partnerOwner = partner ? state.players.find((pl) => pl.id === partner.player_id) : null;
                    return (
                      <PartySlot
                        key={enc.id}
                        enc={enc}
                        color={p.color}
                        linked={!!partner}
                        partnerName={partner ? `${partnerOwner?.name ?? '?'}'s ${partner.nickname ?? nameOf(partner.pokemon_id)}` : null}
                        nameOf={nameOf}
                        encounters={state.encounters}
                        onMenu={onMenu}
                      />
                    );
                  })}
                </AnimatePresence>
                {Array.from({ length: 6 - party.length }).map((_, i) => (
                  <div
                    key={`e${i}`}
                    className={cn(
                      'grid min-h-[120px] place-items-center rounded-md border border-dashed transition-colors',
                      dropPlayer === p.id ? 'border-gold/50 bg-gold/5' : 'border-hairline2',
                    )}
                  >
                    <span className="h-2 w-2 rounded-full bg-tx-muted/40" />
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
