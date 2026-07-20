/* Nuzlocke — page-local UI primitives (Holo-Dex + command-deck density).
 * Tooltips per design.md §9.11 with gold left border; errors = shake + gold, never red. */
import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { NuzEncounterStatus } from '@/lib/nuzlocke-store';

/* ---------- tooltip (§9.11 shell, gold left border, 200ms intent) ---------- */

export function InfoTip({ text, className, iconSize = 12 }: { text: string; className?: string; iconSize?: number }) {
  const [open, setOpen] = useState(false);
  const timer = useRef<number | null>(null);
  const show = () => {
    timer.current = window.setTimeout(() => setOpen(true), 200);
  };
  const hide = () => {
    if (timer.current) window.clearTimeout(timer.current);
    setOpen(false);
  };
  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current); }, []);
  return (
    <span className={cn('relative inline-flex items-center', className)} onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
      <Info size={iconSize} className="text-tx-muted/40 transition-colors hover:text-tx-muted" />
      <AnimatePresence>
        {open && (
          <motion.span
            initial={{ scale: 0.92, y: 4, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 420, damping: 30 }}
            className="absolute bottom-full left-1/2 z-50 mb-2 w-max max-w-[260px] -translate-x-1/2 rounded-sm border border-hairline2 border-l-2 border-l-gold bg-surface2 px-3 py-2 text-left text-[12px] leading-[1.5] text-tx-secondary shadow-[0_8px_32px_rgba(0,0,0,0.45)]"
            role="tooltip"
          >
            {text}
            <span className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 border-b border-r border-hairline2 bg-surface2" />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

/* ---------- gold hint bubble (validation — §6.2-9, never red) ---------- */

export function GoldHint({ text, show, className }: { text: string; show: boolean; className?: string }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'pointer-events-none absolute left-0 top-full z-50 mt-1.5 w-max max-w-[280px] rounded-sm border border-gold/50 bg-surface2 px-2.5 py-1.5 text-[11px] leading-snug text-gold shadow-[0_8px_32px_rgba(0,0,0,0.45)]',
            className,
          )}
          role="alert"
        >
          {text}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- shake trigger hook ---------- */

export function useShake(): [number, () => void] {
  const [key, setKey] = useState(0);
  return [key, () => setKey((k) => k + 1)];
}

/* ---------- status dots (§1.3 / §2.3) ---------- */

export function StatusDot({ status, color, size = 8, className }: { status: NuzEncounterStatus | 'pending'; color?: string; size?: number; className?: string }) {
  if (status === 'dead') {
    return (
      <svg width={size} height={size} viewBox="0 0 8 8" className={cn('shrink-0 text-tx-muted', className)} aria-label="dead">
        <path d="M1 1l6 6M7 1l-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (status === 'missed' || status === 'duped') {
    return <span className={cn('shrink-0 rounded-full border border-gold/70', className)} style={{ width: size, height: size }} aria-label={status} />;
  }
  if (status === 'pending') {
    return <span className={cn('shrink-0 rounded-full border border-tx-muted/40', className)} style={{ width: size, height: size }} aria-label="pending" />;
  }
  return <span className={cn('shrink-0 rounded-full', className)} style={{ width: size, height: size, background: color ?? '#63D96B' }} aria-label="caught" />;
}

/* ---------- pixel micro-label ---------- */

export function PixelLabel({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn('font-pixel text-[8px] uppercase tracking-[0.08em] text-tx-muted', className)}>{children}</span>;
}

/* ---------- 28px pill switch (§2.2) ---------- */

export function GoldSwitch({
  checked,
  onChange,
  disabled,
  label,
  tip,
}: {
  checked: boolean;
  onChange?: (v: boolean) => void;
  disabled?: boolean;
  label: string;
  tip?: string;
}) {
  return (
    <span className={cn('inline-flex items-center gap-1.5', disabled && 'opacity-40')}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={cn(
          'relative h-[16px] w-[28px] shrink-0 rounded-full border transition-colors duration-200',
          checked ? 'border-gold/70 bg-gold/25' : 'border-hairline2 bg-surface3',
          !disabled && 'hover:border-gold',
        )}
      >
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 420, damping: 30 }}
          className={cn('absolute top-1/2 h-[10px] w-[10px] -translate-y-1/2 rounded-full', checked ? 'left-[15px] bg-gold' : 'left-[3px] bg-tx-muted')}
        />
      </button>
      <span className={cn('font-pixel text-[8px] uppercase tracking-[0.08em]', checked ? 'text-gold' : 'text-tx-muted')}>{label}</span>
      {tip && <InfoTip text={tip} />}
    </span>
  );
}

/* ---------- run status chip ---------- */

export function RunStatusChip({ status }: { status: 'active' | 'complete' | 'failed' }) {
  if (status === 'complete') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/50 bg-gold/10 px-2 py-0.5">
        <span className="h-1.5 w-1.5 rounded-full bg-gold" />
        <img src="/sparkle.svg" alt="" className="h-2.5 w-2.5" />
        <span className="font-pixel text-[7px] tracking-[0.08em] text-gold">COMPLETE</span>
      </span>
    );
  }
  if (status === 'failed') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-hairline2 px-2 py-0.5">
        <span className="h-1.5 w-1.5 rounded-full border border-tx-muted" />
        <span className="font-pixel text-[7px] tracking-[0.08em] text-tx-muted">FAILED</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(99,217,107,0.4)] bg-[rgba(99,217,107,0.08)] px-2 py-0.5">
      <span className="h-1.5 w-1.5 rounded-full bg-[#63D96B]" />
      <span className="font-pixel text-[7px] tracking-[0.08em] text-[#63D96B]">ACTIVE</span>
    </span>
  );
}

/* ---------- sync badge (§1.2 / §2.1) ---------- */

export function SyncBadge({ status }: { status: 'local' | 'connecting' | 'live' | 'reconnecting' }) {
  if (status === 'live') {
    return (
      <span className="inline-flex items-center gap-1.5" title="Multiplayer — live sync">
        <span className="nz-dot-live h-2 w-2 rounded-full bg-[#45C8FF]" />
        <span className="font-pixel text-[7px] tracking-[0.08em] text-[#45C8FF]">LIVE</span>
      </span>
    );
  }
  if (status === 'reconnecting' || status === 'connecting') {
    return (
      <span className="inline-flex items-center gap-1.5" title="Reconnecting to realtime sync">
        <span className="nz-orbit h-2.5 w-2.5" />
        <span className="font-pixel text-[7px] tracking-[0.08em] text-gold">RECONNECTING…</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5" title="Solo — local save on this device">
      <span className="h-2 w-2 rounded-full bg-gold" />
      <span className="font-pixel text-[7px] tracking-[0.08em] text-gold">LOCAL</span>
    </span>
  );
}

/* ---------- sparkle burst (§6.2-6) ---------- */

const BURST = [
  ['-58px', '-34px'], ['52px', '-46px'], ['64px', '18px'], ['-62px', '24px'],
  ['-18px', '-64px'], ['22px', '58px'], ['-40px', '52px'], ['44px', '-12px'],
] as const;

export function SparkleBurst({ burstKey, className }: { burstKey: number; className?: string }) {
  if (!burstKey) return null;
  return (
    <span key={burstKey} className={cn('pointer-events-none absolute inset-0', className)} aria-hidden>
      {BURST.map(([dx, dy], i) => (
        <img
          key={i}
          src="/sparkle.svg"
          alt=""
          className="nz-spark left-1/2 top-1/2 h-3 w-3"
          style={{ '--dx': dx, '--dy': dy, animationDelay: `${i * 30}ms` } as CSSProperties}
        />
      ))}
    </span>
  );
}

/* ---------- glass modal shell (§1.5) ---------- */

export function NuzModal({ open, onClose, children, wide }: { open: boolean; onClose: () => void; children: ReactNode; wide?: boolean }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[80] grid place-items-center bg-void/70 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -16, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: -8, scale: 0.98, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 180, damping: 22 }}
            className={cn(
              'relative max-h-[88dvh] w-full overflow-y-auto rounded-xl border border-hairline2 bg-[rgba(13,15,22,0.92)] shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-xl nz-slim-scroll',
              wide ? 'max-w-[640px]' : 'max-w-[560px]',
            )}
            data-lenis-prevent
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-md border border-hairline bg-surface2 text-tx-muted transition-all hover:rotate-90 hover:border-gold/50 hover:text-gold"
            >
              <X size={14} />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- dropdown popover (outside-click close) ---------- */

export function Popover({
  open,
  onClose,
  anchor,
  children,
  className,
  align = 'left',
}: {
  open: boolean;
  onClose: () => void;
  anchor: ReactNode;
  children: ReactNode;
  className?: string;
  align?: 'left' | 'right';
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return undefined;
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
  }, [open, onClose]);
  return (
    <div ref={ref} className="relative">
      {anchor}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ scale: 0.95, y: 4, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.97, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 420, damping: 30 }}
            className={cn(
              'absolute top-full z-[60] mt-1.5 overflow-hidden rounded-md border border-hairline2 bg-surface2 shadow-[0_8px_32px_rgba(0,0,0,0.45)]',
              align === 'right' ? 'right-0' : 'left-0',
              className,
            )}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- time ago ---------- */

export function timeAgo(iso: string | number): string {
  const t = typeof iso === 'number' ? iso : Date.parse(iso);
  const s = Math.max(0, (Date.now() - t) / 1000);
  if (s < 60) return 'NOW';
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}M AGO`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}H AGO`;
  const d = Math.floor(h / 24);
  return `${d}D AGO`;
}
