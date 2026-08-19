/* Page-local UI primitives — dense panel chrome + SegmentedControl (design.md §9.8
 * sized down per density-addendum §1: 24–28px tracks, 10–12px labels). */
import type { CSSProperties, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/* ---------- Panel ---------- */

interface PanelProps {
  eyebrow?: string;
  title?: string;
  right?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  style?: CSSProperties;
  id?: string;
}

export function Panel({ eyebrow, title, right, children, className, bodyClassName, style, id }: PanelProps) {
  return (
    <section id={id} className={cn('dx-panel', className)} style={style}>
      {(eyebrow || title || right) && (
        <header className="relative z-10 flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-hairline px-4 py-2.5">
          <div className="flex min-w-0 items-baseline gap-2.5">
            {eyebrow && <span className="pixel-label shrink-0 text-[9px] text-gold">{eyebrow}</span>}
            {title && (
              <h2 className="truncate font-display text-base font-bold tracking-wide text-tx-primary">
                {title}
              </h2>
            )}
          </div>
          {right && <div className="ml-auto flex items-center gap-2">{right}</div>}
        </header>
      )}
      <div className={cn('relative z-10', bodyClassName)}>{children}</div>
    </section>
  );
}

/* ---------- SegmentedControl (compact, gliding thumb via layoutId) ---------- */

export interface SegOption {
  value: string;
  label: ReactNode;
  disabled?: boolean;
  title?: string;
}

interface SegmentedControlProps {
  options: SegOption[];
  value: string;
  onChange: (value: string) => void;
  /** layoutId scope — unique per control instance */
  id: string;
  size?: 'xs' | 'sm';
  className?: string;
  ariaLabel?: string;
}

export function SegmentedControl({
  options,
  value,
  onChange,
  id,
  size = 'sm',
  className,
  ariaLabel,
}: SegmentedControlProps) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        'inline-flex items-center gap-0.5 rounded-pill border border-hairline bg-abyss/60 p-0.5',
        size === 'xs' ? 'h-6' : 'h-7',
        className,
      )}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={active}
            disabled={opt.disabled}
            title={opt.title}
            onClick={() => onChange(opt.value)}
            className={cn(
              'relative flex h-full items-center gap-1 rounded-pill px-2.5 font-sans font-semibold transition-colors duration-150',
              size === 'xs' ? 'text-[14px] leading-none' : 'text-[11px] leading-none',
              active ? 'text-tx-primary' : 'text-tx-muted hover:text-tx-secondary',
              opt.disabled && 'cursor-not-allowed opacity-35 hover:text-tx-muted',
            )}
          >
            {active && (
              <motion.span
                layoutId={`seg-${id}`}
                className="absolute inset-0 rounded-pill border border-gold/50 bg-surface3"
                transition={{ type: 'spring', stiffness: 420, damping: 30 }}
              />
            )}
            <span className="relative z-10 inline-flex items-center gap-1 whitespace-nowrap">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ---------- micro chip ---------- */

export function MicroChip({
  children,
  className,
  style,
  title,
  onClick,
  active,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  title?: string;
  onClick?: () => void;
  active?: boolean;
}) {
  const Comp = onClick ? 'button' : 'span';
  return (
    <Comp
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      title={title}
      data-active={active ? 'true' : undefined}
      className={cn(
        'inline-flex h-[22px] items-center gap-1 rounded-pill border border-hairline bg-surface2 px-2',
        'font-sans text-[14px] font-semibold leading-none text-tx-secondary transition-all duration-150',
        onClick && 'hover:border-hairline2 hover:text-tx-primary',
        active && 'border-gold/60 bg-gold-soft text-gold',
        className,
      )}
      style={style}
    >
      {children}
    </Comp>
  );
}
