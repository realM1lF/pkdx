/* Nuzlocke — encounter context menu: mark dead (with note) / mark missed /
 * evolve / edit level / edit nickname / remove. Fixed-position at pointer,
 * gold-only feedback. */
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Archive, ArrowUpRight, Check, HeartCrack, Hash, Pencil, Trash2, Wind } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { listEvolutionOptions, speciesIdFor } from '@/lib/nuzlocke-evolution';
import { deleteEncounter, evolveEncounter, pushToast, setEncounterParty, updateEncounter } from '@/lib/nuzlocke-store';
import type { NuzEncounterRow, RunState } from '@/lib/nuzlocke-store';
import { effectiveLevelCap } from '@/lib/nuzlocke-rules';
import { remPx } from '@/lib/viewport';
import { cn } from '@/lib/utils';
import { GoldHint, useShake } from './ui';

export interface MenuTarget {
  enc: NuzEncounterRow;
  x: number;
  y: number;
  /** false when restoring to caught would collide with the route's resolved
   * encounter (route slot already taken by a later catch) */
  canRestore?: boolean;
}

type SubMode = 'none' | 'note' | 'nick' | 'evolve' | 'level';

/* SoulLink death/miss cascade is auto-applied inside `updateEncounter`
 * (feed + gold toast) — no confirm dialog needed here anymore. */
export default function EncounterMenu({
  target,
  nameOf,
  state,
  onClose,
}: {
  target: MenuTarget | null;
  nameOf: (id: number) => string;
  state: RunState;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const [sub, setSub] = useState<SubMode>('none');
  const [note, setNote] = useState('');
  const [nick, setNick] = useState('');
  const [level, setLevel] = useState(1);
  const [evoOpts, setEvoOpts] = useState<number[]>([]);
  const [evoLoading, setEvoLoading] = useState(false);
  const [shakeKey, shake] = useShake();
  const [levelHint, setLevelHint] = useState('');
  const [nickHint, setNickHint] = useState('');
  /* level-cap is a soft warning here too (mirrors QuickEntry's capAck):
   * first commit over cap warns, the acknowledged second commit sets it anyway */
  const [capAck, setCapAck] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const cap = effectiveLevelCap(state);

  useEffect(() => {
    if (!target) return undefined;
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [target, onClose]);

  /* reset sub-modes when a new target opens */
  const [prev, setPrev] = useState<MenuTarget | null>(null);
  if (target !== prev) {
    setPrev(target);
    setSub('none');
    setNote(target?.enc.note ?? '');
    setNick(target?.enc.nickname ?? '');
    setLevel(target?.enc.level ?? 1);
    setEvoOpts([]);
    setEvoLoading(false);
    setCapAck(false);
    setLevelHint('');
    setNickHint('');
  }

  useEffect(() => setCapAck(false), [level]);

  useEffect(() => {
    if (!target || sub !== 'evolve') return undefined;
    let alive = true;
    setEvoLoading(true);
    const caughtId = speciesIdFor(target.enc, 'caught');
    void listEvolutionOptions(caughtId, target.enc.pokemon_id)
      .then((ids) => {
        if (alive) setEvoOpts(ids);
      })
      .catch(() => {
        if (alive) {
          setEvoOpts([]);
          shake();
          pushToast('info', t('nuz.toast.evolveFailed'));
        }
      })
      .finally(() => {
        if (alive) setEvoLoading(false);
      });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- shake/t are stable enough; only re-fetch on target/sub
  }, [target, sub]);

  if (!target) return null;
  const { enc } = target;
  const menuW = remPx(15);
  const menuH = remPx(20);
  const x = Math.min(target.x, window.innerWidth - menuW);
  const y = Math.min(target.y, window.innerHeight - menuH);
  const idle = sub === 'none';

  const markDead = () => {
    updateEncounter(enc.run_id, enc.id, { status: 'dead', note: note.trim() || enc.note });
    onClose();
  };

  const commitLevel = () => {
    const n = Math.max(1, Math.min(100, Math.round(level) || 1));
    if (cap !== null && n > cap && !capAck) {
      setCapAck(true);
      shake();
      setLevelHint(t('nuz.err.levelCap', { level: n, cap }));
      window.setTimeout(() => setLevelHint(''), 2600);
      return;
    }
    updateEncounter(enc.run_id, enc.id, { level: n });
    onClose();
  };

  const pickEvolve = async (toId: number) => {
    const res = await evolveEncounter(enc.run_id, enc.id, toId);
    if (!res.ok) {
      shake();
      pushToast('info', t('nuz.toast.evolveFailed'));
      return;
    }
    pushToast(
      'success',
      t('nuz.toast.evolved', {
        name: enc.nickname ?? nameOf(enc.pokemon_id),
        to: nameOf(toId),
      }),
    );
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={ref}
        key={shakeKey}
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 420, damping: 30 }}
        className={cn(
          'fixed z-[75] w-[13.75rem] rounded-md border border-hairline2 bg-surface2 py-1 shadow-[0_8px_32px_rgba(0,0,0,0.45)]',
          shakeKey > 0 && 'nz-shake',
        )}
        style={{ left: x, top: y }}
        role="menu"
      >
        <div className="border-b border-hairline px-3 py-1.5">
          <span className="text-micro12 font-semibold text-tx-primary">{enc.nickname ?? nameOf(enc.pokemon_id)}</span>
          <span className="ml-2 font-display text-micro10 font-bold text-tx-muted">LV {enc.level}</span>
        </div>

        {enc.status === 'caught' && idle && (
          <>
            <button type="button" onClick={() => setSub('note')} className="flex w-full items-center gap-2 px-3 py-2 text-left text-micro12 text-tx-secondary transition-colors hover:bg-surface3 hover:text-gold" role="menuitem">
              <HeartCrack size={13} /> {t('nuz.menu.markDead')}
            </button>
            <button
              type="button"
              onClick={() => {
                updateEncounter(enc.run_id, enc.id, { status: 'missed' });
                onClose();
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-micro12 text-tx-secondary transition-colors hover:bg-surface3 hover:text-gold"
              role="menuitem"
            >
              <Wind size={13} /> {t('nuz.menu.markMissed')}
            </button>
            <button
              type="button"
              onClick={() => setSub('evolve')}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-micro12 text-tx-secondary transition-colors hover:bg-surface3 hover:text-gold"
              role="menuitem"
            >
              <ArrowUpRight size={13} /> {t('nuz.menu.evolve')}
            </button>
            <button
              type="button"
              onClick={() => {
                setLevel(enc.level);
                setSub('level');
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-micro12 text-tx-secondary transition-colors hover:bg-surface3 hover:text-gold"
              role="menuitem"
            >
              <Hash size={13} /> {t('nuz.menu.editLevel')}
            </button>
            {/* non-drag path (touch devices): box this party member */}
            {enc.in_party !== false && (
              <button
                type="button"
                onClick={() => {
                  const res = setEncounterParty(enc.run_id, enc.id, false);
                  if (res.ok) pushToast('info', t('nuz.dnd.movedBox', { name: enc.nickname ?? nameOf(enc.pokemon_id) }));
                  onClose();
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-micro12 text-tx-secondary transition-colors hover:bg-surface3 hover:text-gold"
                role="menuitem"
              >
                <Archive size={13} /> {t('nuz.dnd.toBox')}
              </button>
            )}
          </>
        )}
        {enc.status !== 'caught' && idle && target.canRestore !== false && (
          <button
            type="button"
            onClick={() => {
              updateEncounter(enc.run_id, enc.id, { status: 'caught' });
              onClose();
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-micro12 text-tx-secondary transition-colors hover:bg-surface3 hover:text-gold"
            role="menuitem"
          >
            <Check size={13} /> {t('nuz.menu.restoreCaught')}
          </button>
        )}

        {sub === 'note' && (
          <div className="px-3 py-2">
            <label className="font-pixel text-[8px] tracking-[0.08em] text-gold">{t('nuz.menu.deathNote')}</label>
            <input
              autoFocus
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && markDead()}
              placeholder={t('nuz.menu.deathPlaceholder')}
              maxLength={80}
              className="mt-1.5 h-8 w-full rounded-sm border border-hairline2 bg-surface1 px-2 text-micro12 text-tx-primary outline-none placeholder:text-tx-muted focus:border-gold"
            />
            <button type="button" onClick={markDead} className="mt-2 w-full rounded-sm border border-gold/60 bg-gold/10 py-1.5 font-display text-micro11 font-bold text-gold transition-colors hover:bg-gold/20">
              {t('nuz.menu.confirmDead')}
            </button>
          </div>
        )}

        {sub === 'evolve' && (
          <div className="max-h-[13.75rem] overflow-y-auto px-1 py-1" data-lenis-prevent>
            {evoLoading && (
              <span className="block px-2 py-2 font-pixel text-[8px] tracking-[0.08em] text-tx-muted">…</span>
            )}
            {!evoLoading && evoOpts.length === 0 && (
              <span className="block px-2 py-2 text-micro11 text-tx-muted">{t('nuz.toast.evolveFailed')}</span>
            )}
            {evoOpts.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => void pickEvolve(id)}
                className="flex w-full items-center gap-2 rounded-sm px-2 py-2 text-left text-micro12 text-tx-secondary transition-colors hover:bg-surface3 hover:text-gold"
                role="menuitem"
              >
                <ArrowUpRight size={12} className="shrink-0 text-gold/70" />
                {t('nuz.menu.evolveTo', { name: nameOf(id) })}
              </button>
            ))}
          </div>
        )}

        {sub === 'level' && (
          <div className="relative px-3 py-2">
            <label className="font-pixel text-[8px] tracking-[0.08em] text-gold">{t('nuz.menu.levelLabel')}</label>
            <input
              autoFocus
              type="number"
              min={1}
              max={100}
              value={level}
              onChange={(e) => setLevel(Number(e.target.value))}
              onKeyDown={(e) => e.key === 'Enter' && commitLevel()}
              title={cap !== null ? t('nuz.rules.capTitle', { cap }) : undefined}
              className={cn(
                'mt-1.5 h-8 w-full rounded-sm border bg-surface1 px-2 text-micro12 tabular-nums text-tx-primary outline-none focus:border-gold',
                cap !== null && Number(level) > cap ? 'border-gold/70' : 'border-hairline2',
              )}
            />
            <button
              type="button"
              onClick={commitLevel}
              className="mt-2 w-full rounded-sm border border-gold/60 bg-gold/10 py-1.5 font-display text-micro11 font-bold text-gold transition-colors hover:bg-gold/20"
            >
              {t('nuz.menu.levelLabel')} {Math.max(1, Math.min(100, Math.round(level) || 1))}
            </button>
            <GoldHint text={levelHint} show={!!levelHint} />
          </div>
        )}

        {idle && (
          <button type="button" onClick={() => setSub('nick')} className="flex w-full items-center gap-2 px-3 py-2 text-left text-micro12 text-tx-secondary transition-colors hover:bg-surface3 hover:text-gold" role="menuitem">
            <Pencil size={13} /> {t('nuz.menu.editNick')}
          </button>
        )}

        {sub === 'nick' && (
          <div className="relative px-3 py-2">
            <input
              autoFocus
              value={nick}
              onChange={(e) => {
                setNick(e.target.value);
                setNickHint('');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  if (state.run.rules.nicknames && !nick.trim()) {
                    shake();
                    setNickHint(t('nuz.err.nicknameRequired'));
                    return;
                  }
                  updateEncounter(enc.run_id, enc.id, { nickname: nick.trim() || null });
                  onClose();
                }
              }}
              placeholder={nameOf(enc.pokemon_id)}
              maxLength={18}
              className="h-8 w-full rounded-sm border border-hairline2 bg-surface1 px-2 text-micro12 text-tx-primary outline-none placeholder:text-tx-muted focus:border-gold"
            />
            <GoldHint text={nickHint} show={!!nickHint} />
          </div>
        )}

        {idle && (
          <button
            type="button"
            onClick={() => {
              deleteEncounter(enc.run_id, enc.id);
              onClose();
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-micro12 text-tx-muted transition-colors hover:bg-surface3 hover:text-gold"
            role="menuitem"
          >
            <Trash2 size={13} /> {t('nuz.menu.remove')}
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
