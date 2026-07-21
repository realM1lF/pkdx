/* Nuzlocke — encounter context menu: mark dead (with note) / mark missed /
 * edit nickname / remove. Fixed-position at pointer, gold-only feedback. */
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, HeartCrack, Pencil, Trash2, Wind } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { deleteEncounter, updateEncounter } from '@/lib/nuzlocke-store';
import type { NuzEncounterRow, UpdateResult } from '@/lib/nuzlocke-store';

export interface MenuTarget {
  enc: NuzEncounterRow;
  x: number;
  y: number;
}

export default function EncounterMenu({
  target,
  nameOf,
  onClose,
  onCascade,
}: {
  target: MenuTarget | null;
  nameOf: (id: number) => string;
  onClose: () => void;
  onCascade: (res: UpdateResult, enc: NuzEncounterRow) => void;
}) {
  const { t } = useTranslation();
  const [noteMode, setNoteMode] = useState(false);
  const [note, setNote] = useState('');
  const [nickMode, setNickMode] = useState(false);
  const [nick, setNick] = useState('');
  const ref = useRef<HTMLDivElement>(null);

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
    setNoteMode(false);
    setNickMode(false);
    setNote(target?.enc.note ?? '');
    setNick(target?.enc.nickname ?? '');
  }

  if (!target) return null;
  const { enc } = target;
  const x = Math.min(target.x, window.innerWidth - 240);
  const y = Math.min(target.y, window.innerHeight - 260);

  const markDead = () => {
    const res = updateEncounter(enc.run_id, enc.id, { status: 'dead', note: note.trim() || enc.note });
    onCascade(res, enc);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={ref}
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 420, damping: 30 }}
        className="fixed z-[75] w-[220px] rounded-md border border-hairline2 bg-surface2 py-1 shadow-[0_8px_32px_rgba(0,0,0,0.45)]"
        style={{ left: x, top: y }}
        role="menu"
      >
        <div className="border-b border-hairline px-3 py-1.5">
          <span className="text-[12px] font-semibold text-tx-primary">{enc.nickname ?? nameOf(enc.pokemon_id)}</span>
          <span className="ml-2 font-display text-[10px] font-bold text-tx-muted">LV {enc.level}</span>
        </div>

        {enc.status === 'caught' && !noteMode && !nickMode && (
          <>
            <button type="button" onClick={() => setNoteMode(true)} className="flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] text-tx-secondary transition-colors hover:bg-surface3 hover:text-gold" role="menuitem">
              <HeartCrack size={13} /> {t('nuz.menu.markDead')}
            </button>
            <button
              type="button"
              onClick={() => {
                const res = updateEncounter(enc.run_id, enc.id, { status: 'missed' });
                onCascade(res, enc);
                onClose();
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] text-tx-secondary transition-colors hover:bg-surface3 hover:text-gold"
              role="menuitem"
            >
              <Wind size={13} /> {t('nuz.menu.markMissed')}
            </button>
          </>
        )}
        {enc.status !== 'caught' && !noteMode && !nickMode && (
          <button
            type="button"
            onClick={() => {
              updateEncounter(enc.run_id, enc.id, { status: 'caught' });
              onClose();
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] text-tx-secondary transition-colors hover:bg-surface3 hover:text-gold"
            role="menuitem"
          >
            <Check size={13} /> {t('nuz.menu.restoreCaught')}
          </button>
        )}

        {noteMode && (
          <div className="px-3 py-2">
            <label className="font-pixel text-[7px] tracking-[0.08em] text-gold">{t('nuz.menu.deathNote')}</label>
            <input
              autoFocus
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && markDead()}
              placeholder={t('nuz.menu.deathPlaceholder')}
              maxLength={80}
              className="mt-1.5 h-8 w-full rounded-sm border border-hairline2 bg-surface1 px-2 text-[12px] text-tx-primary outline-none placeholder:text-tx-muted focus:border-gold"
            />
            <button type="button" onClick={markDead} className="mt-2 w-full rounded-sm border border-gold/60 bg-gold/10 py-1.5 font-display text-[11px] font-bold uppercase text-gold transition-colors hover:bg-gold/20">
              {t('nuz.menu.confirmDead')}
            </button>
          </div>
        )}

        {!noteMode && !nickMode && (
          <button type="button" onClick={() => setNickMode(true)} className="flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] text-tx-secondary transition-colors hover:bg-surface3 hover:text-gold" role="menuitem">
            <Pencil size={13} /> {t('nuz.menu.editNick')}
          </button>
        )}

        {nickMode && (
          <div className="px-3 py-2">
            <input
              autoFocus
              value={nick}
              onChange={(e) => setNick(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  updateEncounter(enc.run_id, enc.id, { nickname: nick.trim() || null });
                  onClose();
                }
              }}
              placeholder={nameOf(enc.pokemon_id)}
              maxLength={18}
              className="h-8 w-full rounded-sm border border-hairline2 bg-surface1 px-2 text-[12px] text-tx-primary outline-none placeholder:text-tx-muted focus:border-gold"
            />
          </div>
        )}

        {!noteMode && !nickMode && (
          <button
            type="button"
            onClick={() => {
              deleteEncounter(enc.run_id, enc.id);
              onClose();
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] text-tx-muted transition-colors hover:bg-surface3 hover:text-gold"
            role="menuitem"
          >
            <Trash2 size={13} /> {t('nuz.menu.remove')}
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
