/* GameSelect — generic grouped game/version picker (extracted from the
 * team-builder HeaderStrip dropdown). GEN group headers + version chips +
 * checkmark, Esc/outside close, lenis-prevent, visible gold scrollbar +
 * bottom fade so the list obviously scrolls (Gen 1–9 ≠ "ends at Gen 4").
 * Used by: TeamBuilder HeaderStrip, detail MovesPanel, Versus panel. */
import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { genRegionKey } from '@/lib/i18n-data';
import { VERSION_GROUPS } from '@/lib/version-groups';
import { GENERATIONS } from '@/lib/types';
import { cn } from '@/lib/utils';
import './game-select.css';

export interface GameSelectOption {
  /** option id (version-group id or game slug) */
  id: string;
  /** display label, e.g. 'SCARLET · VIOLET' */
  label: string;
  /** short chip, e.g. 'SV' */
  short: string;
  gen: number;
}

export interface GameSelectProps {
  value: string;
  onChange: (id: string) => void;
  /** subset of VERSION_GROUPS (or per-game options with the same shape) */
  options?: GameSelectOption[];
  ariaLabel: string;
  /** cap options to gens ≤ maxGen */
  maxGen?: number;
  /** extra row rendered above the gen groups (e.g. Versus "DEFAULT") */
  defaultOption?: GameSelectOption;
  buttonClassName?: string;
  /** custom trigger content; receives the resolved current option */
  buttonContent?: (current: GameSelectOption, open: boolean) => ReactNode;
  /** align dropdown to the trigger; center keeps the list under a mid-page dock */
  align?: 'left' | 'right' | 'center';
}

export default function GameSelect({
  value,
  onChange,
  options = VERSION_GROUPS,
  ariaLabel,
  maxGen,
  defaultOption,
  buttonClassName,
  buttonContent,
  align = 'left',
}: GameSelectProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [atBottom, setAtBottom] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const visible = maxGen != null ? options.filter((o) => o.gen <= maxGen) : options;
  const fallback = defaultOption ?? visible[visible.length - 1] ?? { id: value, label: value, short: '—', gen: 9 };
  const current: GameSelectOption =
    (defaultOption && value === defaultOption.id ? defaultOption : undefined) ??
    visible.find((o) => o.id === value) ??
    fallback;

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  /* bottom-fade indicator: hide once the list is scrolled to the end
   * (or doesn't overflow at all) */
  useEffect(() => {
    if (!open) return undefined;
    const el = listRef.current;
    if (!el) return undefined;
    const sync = () => setAtBottom(el.scrollTop + el.clientHeight >= el.scrollHeight - 2);
    sync();
    el.addEventListener('scroll', sync, { passive: true });
    return () => el.removeEventListener('scroll', sync);
  }, [open]);

  const pick = (id: string) => {
    onChange(id);
    setOpen(false);
  };

  const renderOption = (o: GameSelectOption) => (
    <button
      key={o.id}
      type="button"
      role="option"
      aria-selected={o.id === value}
      data-active={o.id === value}
      className="gs-option justify-between"
      onClick={() => pick(o.id)}
    >
      <span className="flex items-center gap-2">
        <span className={cn('gs-chip', o.id === value && 'border-gold/60 text-gold')}>{o.short}</span>
        <span>{o.label}</span>
      </span>
      {o.id === value && <Check size={12} className="text-gold" />}
    </button>
  );

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn('gs-trigger', buttonClassName)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
      >
        {buttonContent ? (
          buttonContent(current, open)
        ) : (
          <>
            <span className="gs-chip !px-1.5 !py-0.5 !text-[8px]">{current.short}</span>
            <span className="font-display text-[11px] font-bold tracking-wide text-tx-primary">{current.label}</span>
            <ChevronDown size={12} className={cn('transition-transform duration-200', open && 'rotate-180')} />
          </>
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98, x: align === 'center' ? '-50%' : 0 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: align === 'center' ? '-50%' : 0 }}
            exit={{ opacity: 0, y: -6, scale: 0.98, x: align === 'center' ? '-50%' : 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              'gs-dropdown',
              align === 'right' && '!left-auto right-0',
              align === 'center' && 'gs-dropdown-center',
            )}
          >
            <div ref={listRef} className="gs-list py-1" role="listbox" aria-label={ariaLabel} data-lenis-prevent>
              {defaultOption && renderOption(defaultOption)}
              {GENERATIONS.map((g) => {
                const groups = visible.filter((v) => v.gen === g.gen);
                if (!groups.length) return null;
                return (
                  <div key={g.gen}>
                    <div className="gs-micro px-3 pb-1 pt-2.5 !text-[8px]">
                      Gen {g.roman} · {t(`regions.${genRegionKey(g.region)}`)}
                    </div>
                    {groups.map(renderOption)}
                  </div>
                );
              })}
            </div>
            <div className={cn('gs-fade', atBottom && 'opacity-0')} aria-hidden />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
