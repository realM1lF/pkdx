/* Stats Band — counters (home.md §7, motion §6.2-12). */
import { useEffect, useRef, useState } from 'react';
import { animate, useInView } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/lib/i18n-data';

const STATS: Array<{ target: number; labelKey: string; suffix?: string }> = [
  { target: 1025, labelKey: 'home.statsband.pokemon' },
  { target: 18, labelKey: 'home.statsband.types' },
  { target: 9, labelKey: 'home.statsband.generations' },
  { target: 10000, labelKey: 'home.statsband.sprites', suffix: '+' },
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
    <span ref={ref} className="font-display text-[2.5rem] font-extrabold leading-none text-gold tabular-nums">
      {text}
    </span>
  );
}

export default function StatsBand() {
  const { t } = useTranslation();
  const lang = useLanguage();
  // locale-aware thousands separator (de: 1.025 / en: 1,025)
  const fmt = (v: number, suffix = '') => `${v.toLocaleString(lang === 'de' ? 'de-DE' : 'en-US')}${suffix}`;
  return (
    <section className="relative overflow-x-clip border-y border-hairline bg-surface1">
      {/* faint aura blobs — water left, fire right */}
      <div
        aria-hidden
        className="absolute left-[-10%] top-1/2 h-[15rem] w-[26.25rem] -translate-y-1/2 rounded-full blur-[80px]"
        style={{ background: 'radial-gradient(circle, rgba(69,200,255,0.10), transparent 70%)' }}
      />
      <div
        aria-hidden
        className="absolute right-[-10%] top-1/2 h-[15rem] w-[26.25rem] -translate-y-1/2 rounded-full blur-[80px]"
        style={{ background: 'radial-gradient(circle, rgba(255,122,69,0.10), transparent 70%)' }}
      />
      <div className="relative mx-auto grid max-w-content grid-cols-2 gap-10 px-4 py-16 md:px-8 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <div key={s.labelKey} className="flex flex-col items-center gap-3 text-center">
            <Counter target={s.target} format={(v) => fmt(v, s.suffix)} delay={i * 0.15} />
            <span className="pixel-label text-[14px] text-tx-muted">{t(s.labelKey)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
