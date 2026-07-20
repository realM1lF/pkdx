/* StatBar — animated stat row (design.md §9.9 + §6.2-7).
 * Fill 0→value/180 over 900ms ease-out, synced count-up, white sheen sweep. */
import { useEffect, useRef } from 'react';
import { animate, motion, useInView, useMotionValue, useTransform } from 'framer-motion';
import { TYPE_COLORS } from '@/lib/types';
import type { PokemonType } from '@/lib/types';
import { cn } from '@/lib/utils';

const MAX = 180;

interface StatBarProps {
  label: string;
  value: number;
  /** primary type — fills ≥90 with the type gradient */
  type?: PokemonType | string;
  /** stagger delay in ms */
  delay?: number;
  className?: string;
}

function tierGradient(value: number, type?: PokemonType | string): [string, string] {
  if (value >= 90 && type && TYPE_COLORS[type as PokemonType]) return TYPE_COLORS[type as PokemonType].gradient;
  if (value >= 90) return ['#63D96B', '#2FA85C'];
  if (value >= 50) return ['#F6C945', '#E8A520'];
  return ['#FF8A6B', '#E85A3C'];
}

export default function StatBar({ label, value, type, delay = 0, className }: StatBarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15% 0px' });
  const mv = useMotionValue(0);
  const width = useTransform(mv, (v) => `${Math.min(100, (v / MAX) * 100)}%`);
  const display = useTransform(mv, (v) => String(Math.round(v)));
  const [c1, c2] = tierGradient(value, type);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, value, {
      duration: 0.9,
      delay: delay / 1000,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    });
    return () => controls.stop();
  }, [inView, value, delay, mv]);

  return (
    <div ref={ref} className={cn('flex items-center gap-3', className)}>
      <span className="pixel-label w-16 shrink-0 text-[10px] text-tx-muted">{label}</span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-pill bg-surface3">
        <motion.div
          className="relative h-full overflow-hidden rounded-pill"
          style={{ width, background: `linear-gradient(90deg, ${c1}, ${c2})` }}
        >
          {inView && (
            <motion.div
              className="absolute inset-y-0 w-1/3 bg-white/40 blur-[2px]"
              initial={{ x: '-120%' }}
              animate={{ x: '340%' }}
              transition={{ delay: delay / 1000 + 0.95, duration: 0.2, ease: 'easeOut' }}
            />
          )}
        </motion.div>
      </div>
      <motion.span className="w-8 shrink-0 text-right font-display text-base font-extrabold text-tx-primary tabular-nums">
        {display}
      </motion.span>
    </div>
  );
}
