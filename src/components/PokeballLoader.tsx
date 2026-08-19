/* PokeballLoader — design.md §9.10, motion §6.2-10.
 * page: full-screen one-shot (drop → squash → wobble → open + burst → onDone).
 * inline: 48px wobble loop (infinite-scroll sentinel / tab loads). */
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PokeballLoaderProps {
  variant?: 'page' | 'inline';
  /** page variant: called once the open burst completes */
  onDone?: () => void;
  className?: string;
}

export default function PokeballLoader({ variant = 'inline', onDone, className }: PokeballLoaderProps) {
  const [phase, setPhase] = useState<'drop' | 'wobble' | 'open'>('drop');

  useEffect(() => {
    if (variant !== 'page') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const t = window.setTimeout(() => onDone?.(), 200);
      return () => window.clearTimeout(t);
    }
    const t1 = window.setTimeout(() => setPhase('wobble'), 300);
    const t2 = window.setTimeout(() => setPhase('open'), 1250);
    const t3 = window.setTimeout(() => onDone?.(), 1800);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, [variant, onDone]);

  if (variant === 'inline') {
    return (
      <img
        src="/pokeball.svg"
        alt="Loading…"
        className={cn('h-12 w-12 animate-wobble', className)}
        draggable={false}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-void">
      <div className="grain-overlay absolute inset-0" />
      <div className="relative flex flex-col items-center gap-8">
        <div className="relative h-24 w-24">
          {phase === 'open' && (
            <motion.div
              className="absolute left-1/2 top-1/2 -z-0 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background: 'radial-gradient(circle, #FFFFFF 0%, #F6C945 35%, transparent 70%)',
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 2.5, opacity: [0, 0.9, 0] }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            />
          )}
          <motion.img
            src={phase === 'open' ? '/pokeball-open.svg' : '/pokeball.svg'}
            alt=""
            draggable={false}
            className={cn('relative h-24 w-24 object-contain', phase === 'wobble' && 'animate-wobble')}
            initial={{ y: -40, scaleY: 1 }}
            animate={
              phase === 'drop'
                ? { y: [-40, 0, -8, 0], scaleY: [1, 0.82, 1.06, 1] }
                : phase === 'open'
                  ? { scale: [1, 1.12, 1], opacity: [1, 1, 0.95] }
                  : {}
            }
            transition={{ duration: phase === 'drop' ? 0.3 : 0.5, ease: 'easeOut' }}
          />
        </div>
        <p className="pixel-label text-[14px] text-tx-muted">
          LOADING NATIONAL DEX
          <span className="inline-block w-8 text-left after:animate-caret-blink after:content-['…']" />
        </p>
      </div>
    </div>
  );
}
