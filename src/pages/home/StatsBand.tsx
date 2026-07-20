/* Stats Band — counters (home.md §7, motion §6.2-12). */
import { useEffect, useRef, useState } from 'react';
import { animate, useInView } from 'framer-motion';

const STATS = [
  { target: 1025, label: 'POKÉMON', format: (v: number) => v.toLocaleString('en-US') },
  { target: 18, label: 'TYPES', format: (v: number) => String(v) },
  { target: 9, label: 'GENERATIONS', format: (v: number) => String(v) },
  { target: 10000, label: 'SPRITES ARCHIVED', format: (v: number) => `${v.toLocaleString('en-US')}+` },
];

function Counter({ target, format, delay }: { target: number; format: (v: number) => string; delay: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-20% 0px' });
  const [text, setText] = useState(format(0));

  useEffect(() => {
    if (!inView) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const controls = animate(0, target, {
      duration: reduced ? 0 : 1.2,
      delay,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      onUpdate: (v) => setText(format(Math.round(v))),
    });
    return () => controls.stop();
  }, [inView, target, delay, format]);

  return (
    <span ref={ref} className="font-display text-[40px] font-extrabold leading-none text-gold tabular-nums">
      {text}
    </span>
  );
}

export default function StatsBand() {
  return (
    <section className="relative border-y border-hairline bg-surface1">
      {/* faint aura blobs — water left, fire right */}
      <div
        aria-hidden
        className="absolute left-[-10%] top-1/2 h-[240px] w-[420px] -translate-y-1/2 rounded-full blur-[80px]"
        style={{ background: 'radial-gradient(circle, rgba(69,200,255,0.10), transparent 70%)' }}
      />
      <div
        aria-hidden
        className="absolute right-[-10%] top-1/2 h-[240px] w-[420px] -translate-y-1/2 rounded-full blur-[80px]"
        style={{ background: 'radial-gradient(circle, rgba(255,122,69,0.10), transparent 70%)' }}
      />
      <div className="relative mx-auto grid max-w-content grid-cols-2 gap-10 px-4 py-16 md:px-8 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <div key={s.label} className="flex flex-col items-center gap-3 text-center">
            <Counter target={s.target} format={s.format} delay={i * 0.15} />
            <span className="pixel-label text-[10px] text-tx-muted">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
