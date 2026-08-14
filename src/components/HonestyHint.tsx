import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type HonestyHintProps = {
  show: boolean;
  tone?: 'muted' | 'gold';
  truncate?: boolean;
  className?: string;
  children: ReactNode;
};

export function HonestyHint({
  show,
  tone = 'muted',
  truncate = false,
  className,
  children,
}: HonestyHintProps) {
  if (!show) return null;
  const text = typeof children === 'string' ? children : undefined;
  return (
    <p
      className={cn(
        'min-w-0 font-sans text-[10px] leading-snug',
        tone === 'gold' ? 'text-gold/90' : 'text-tx-muted',
        truncate && 'truncate',
        className,
      )}
      title={truncate ? text : undefined}
    >
      {children}
    </p>
  );
}

export default HonestyHint;
