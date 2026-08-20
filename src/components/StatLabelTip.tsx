/* StatLabelTip — hover tooltip on stat abbreviations (detail combat panel).
 * Holo-Dex shell per design.md §9.11; cursor-help on the label trigger.
 * z-[100]: above z-[95] modals (TcgCard, EntityDesc, AddToTeam). */
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { remPx } from '@/lib/viewport';
import { cn } from '@/lib/utils';

interface StatLabelTipProps {
  label: string;
  tip: string;
  className?: string;
}

export default function StatLabelTip({ label, tip, className }: StatLabelTipProps) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ left: number; top: number; place: 'above' | 'below' } | null>(null);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tipRef = useRef<HTMLSpanElement>(null);
  const timer = useRef<number | null>(null);

  const place = () => {
    const el = triggerRef.current;
    const tip = tipRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const tipW = tip?.offsetWidth ?? remPx(13.75);
    const tipH = tip?.offsetHeight ?? remPx(4.5);
    const gap = remPx(0.5);
    let left = r.left + r.width / 2;
    left = Math.min(window.innerWidth - tipW / 2 - gap, Math.max(tipW / 2 + gap, left));
    const preferAbove = r.top - tipH - gap >= gap;
    if (preferAbove) setCoords({ left, top: r.top - gap, place: 'above' });
    else setCoords({ left, top: r.bottom + gap, place: 'below' });
  };

  const show = () => {
    timer.current = window.setTimeout(() => setOpen(true), 200);
  };
  const hide = () => {
    if (timer.current) window.clearTimeout(timer.current);
    setOpen(false);
    setCoords(null);
  };

  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current); }, []);

  useLayoutEffect(() => {
    if (!open) return undefined;
    place();
    const raf = window.requestAnimationFrame(place);
    const onReposition = () => place();
    window.addEventListener('scroll', onReposition, true);
    window.addEventListener('resize', onReposition);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onReposition, true);
      window.removeEventListener('resize', onReposition);
    };
  }, [open, tip]);

  return (
    <span
      ref={triggerRef}
      className={cn('inline-flex cursor-help items-center', className)}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
      tabIndex={0}
      aria-label={tip}
    >
      {label}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.span
                ref={tipRef}
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                className={cn(
                  'pointer-events-none fixed z-[100] w-max max-w-[16.25rem] -translate-x-1/2 rounded-sm border border-hairline2 border-l-2 border-l-gold bg-surface2 px-3 py-2 text-left font-sans text-micro12 normal-case leading-[1.5] tracking-normal text-tx-secondary shadow-[0_8px_32px_rgba(0,0,0,0.45)]',
                  coords?.place === 'below' ? 'translate-y-0' : '-translate-y-full',
                )}
                style={
                  {
                    left: coords?.left ?? -9999,
                    top: coords?.top ?? -9999,
                    visibility: coords ? 'visible' : 'hidden',
                  } as CSSProperties
                }
                role="tooltip"
              >
                {tip}
                <span
                  className={cn(
                    'absolute left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-hairline2 bg-surface2',
                    coords?.place === 'below'
                      ? 'bottom-full translate-y-1 border-l border-t'
                      : 'top-full -translate-y-1 border-b border-r',
                  )}
                />
              </motion.span>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </span>
  );
}
