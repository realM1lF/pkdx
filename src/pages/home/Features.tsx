/* Feature Highlights — "BUILT FOR TRAINERS" (home.md §6).
 * Three live micro-demos + locked roadmap marquee. */
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LocaleLink } from '@/lib/locale-link';
import { nameOfPokemon, nameOfType, useLanguage } from '@/lib/i18n-data';
import { AnimatePresence, animate, motion, useInView } from 'framer-motion';
import Sprite from '@/components/Sprite';
import StatBar from '@/components/StatBar';
import TypeGlyph from '@/components/TypeGlyph';
import { sprites } from '@/lib/sprites';
import { STAT_LABELS, STAT_ORDER, TYPE_COLORS } from '@/lib/types';
import type { PokemonType, StatKey } from '@/lib/types';
import { cn } from '@/lib/utils';

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

/* ---------- demo 1: Filter in a flash ---------- */

const MINIS: Array<{ id: number; name: string; types: PokemonType[] }> = [
  { id: 1, name: 'Bulbasaur', types: ['grass', 'poison'] },
  { id: 2, name: 'Ivysaur', types: ['grass', 'poison'] },
  { id: 3, name: 'Venusaur', types: ['grass', 'poison'] },
  { id: 4, name: 'Charmander', types: ['fire'] },
  { id: 5, name: 'Charmeleon', types: ['fire'] },
  { id: 6, name: 'Charizard', types: ['fire', 'flying'] },
];
const FILTER_TYPES: PokemonType[] = ['grass', 'fire', 'water'];

function FilterDemo({ live }: { live: boolean }) {
  const { t: t8n } = useTranslation();
  const lang = useLanguage();
  const [active, setActive] = useState<PokemonType | null>(null);
  const shown = MINIS.filter((m) => !active || m.types.includes(active));
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        {FILTER_TYPES.map((t) => {
          const on = active === t;
          return (
            <button
              key={t}
              type="button"
              aria-pressed={on}
              onClick={() => setActive(on ? null : t)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-pill border px-2.5 py-1 font-sans text-xs font-semibold capitalize transition-all duration-200',
                on
                  ? '-translate-y-0.5 border-[rgba(var(--t),0.8)] bg-[rgba(var(--t),0.18)] text-[rgb(var(--t))] shadow-[0_0_12px_rgba(var(--t),0.35)]'
                  : 'border-hairline bg-surface2 text-tx-muted hover:text-tx-secondary',
              )}
              style={{ '--t': TYPE_COLORS[t].rgb } as React.CSSProperties}
            >
              <TypeGlyph type={t} size={14} />
              {nameOfType(t, lang)}
            </button>
          );
        })}
      </div>
      <motion.div layout className="grid min-h-[9.25rem] grid-cols-3 content-start gap-2">
        <AnimatePresence mode="popLayout">
          {shown.map((m) => (
            <motion.div
              key={m.id}
              layout
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="relative flex flex-col items-center gap-1 rounded-md border border-hairline bg-surface2 p-2"
            >
              <div
                aria-hidden
                className="absolute inset-x-2 top-1 h-8 rounded-full blur-md"
                style={{ background: `rgba(${TYPE_COLORS[m.types[0]].rgb},0.25)` }}
              />
              <Sprite id={m.id} name={nameOfPokemon(m.id, lang)} era="gen5" skeleton={false} eager={live} className="relative h-14 w-14" />
              <span className="font-sans text-micro11 font-semibold text-tx-secondary">{nameOfPokemon(m.id, lang)}</span>
            </motion.div>
          ))}
        </AnimatePresence>
        {shown.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-3 flex flex-col items-center gap-2 py-6"
          >
            <img src="/empty-dex.svg" alt="" className="h-14 w-auto opacity-70" />
            <span className="font-sans text-xs font-medium text-gold">{t8n('home.features.emptyDemo')}</span>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

/* ---------- demo 2: Stats that move ---------- */

const PIKACHU: Record<StatKey, number> = {
  hp: 35,
  attack: 55,
  defense: 40,
  'special-attack': 50,
  'special-defense': 50,
  speed: 90,
};

function Radar({ values, prog }: { values: number[]; prog: number }) {
  const ref = useRef<SVGPolygonElement>(null);
  const R = 62;
  const C = 80;
  useEffect(() => {
    const pts = values
      .map((v, i) => {
        const a = (-90 + i * 60) * (Math.PI / 180);
        const r = (v / 180) * R * prog;
        return `${C + Math.cos(a) * r},${C + Math.sin(a) * r}`;
      })
      .join(' ');
    ref.current?.setAttribute('points', pts);
  }, [values, prog]);
  const rings = [0.33, 0.66, 1];
  return (
    <svg viewBox="0 0 160 160" className="h-[10rem] w-[10rem]">
      {rings.map((r) => (
        <polygon
          key={r}
          points={Array.from({ length: 6 }, (_, i) => {
            const a = (-90 + i * 60) * (Math.PI / 180);
            return `${C + Math.cos(a) * R * r},${C + Math.sin(a) * R * r}`;
          }).join(' ')}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
        />
      ))}
      {Array.from({ length: 6 }, (_, i) => {
        const a = (-90 + i * 60) * (Math.PI / 180);
        return (
          <line
            key={i}
            x1={C}
            y1={C}
            x2={C + Math.cos(a) * R}
            y2={C + Math.sin(a) * R}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
          />
        );
      })}
      <polygon ref={ref} fill="rgba(255,214,10,0.25)" stroke="#FFD60A" strokeWidth="1.5" />
    </svg>
  );
}

function StatsDemo({ live }: { live: boolean }) {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'bars' | 'radar'>('bars');
  const [cycle, setCycle] = useState(0);
  const [prog, setProg] = useState(0);

  /* loop the fill animation every 4s while in view */
  useEffect(() => {
    if (!live) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = window.setInterval(() => setCycle((c) => c + 1), 4000);
    return () => window.clearInterval(t);
  }, [live]);

  /* radar spring 0→1 (600ms) */
  useEffect(() => {
    if (mode !== 'radar') return;
    const controls = animate(0, 1, { duration: 0.6, ease: EASE, onUpdate: setProg });
    return () => controls.stop();
  }, [mode, cycle]);

  const values = STAT_ORDER.map((k) => PIKACHU[k]);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative flex w-fit rounded-pill border border-hairline bg-surface1 p-1">
        {(['bars', 'radar'] as const).map((m) => (
          <button
            key={m}
            type="button"
            aria-pressed={mode === m}
            onClick={() => setMode(m)}
            className={cn(
              'relative rounded-pill px-3 py-1 font-sans text-micro13 font-semibold capitalize transition-colors',
              mode === m ? 'text-gold' : 'text-tx-muted hover:text-tx-secondary',
            )}
          >
            {mode === m && (
              <motion.span
                layoutId="stats-thumb"
                className="absolute inset-0 rounded-pill border border-gold/50 bg-surface3"
                transition={{ type: 'spring', stiffness: 420, damping: 30 }}
              />
            )}
            <span className="relative">{t(`detail.combat.${m}`)}</span>
          </button>
        ))}
      </div>
      <div className="grid min-h-[9.25rem] place-items-center">
        <AnimatePresence mode="wait">
          {mode === 'bars' ? (
            <motion.div
              key={`bars-${cycle}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex w-full flex-col gap-2"
            >
              {STAT_ORDER.map((k, i) => (
                <StatBar key={k} label={STAT_LABELS[k]} value={PIKACHU[k]} type="electric" delay={i * 60} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key={`radar-${cycle}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Radar values={values} prog={prog} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---------- demo 3: Sprite Museum scrubber ---------- */

const ERAS = [
  { year: 1996, label: 'GEN I', era: 'gen1' as const, rgb: TYPE_COLORS.normal.rgb },
  { year: 1999, label: 'GEN II', era: 'gen2' as const, rgb: TYPE_COLORS.electric.rgb },
  { year: 2004, label: 'GEN IV', era: 'gen4' as const, rgb: TYPE_COLORS.grass.rgb },
  { year: 2010, label: 'GEN V', era: 'gen5' as const, rgb: TYPE_COLORS.water.rgb },
  { year: 2016, label: '3D ERA', era: 'showdown' as const, rgb: TYPE_COLORS.fire.rgb },
];

function MuseumDemo() {
  const { t } = useTranslation();
  const [idx, setIdx] = useState(0);
  const era = ERAS[idx];
  const src =
    era.era === 'gen1'
      ? sprites.gen1RedBlue(25)
      : era.era === 'gen2'
        ? sprites.gen2Crystal(25)
        : era.era === 'gen4'
          ? sprites.gen4Platinum(25)
          : era.era === 'gen5'
            ? sprites.gen5Animated(25)
            : sprites.showdown(25);

  return (
    <div className="flex flex-col gap-3">
      <div className="relative mx-auto grid h-[9.25rem] w-[9.25rem] place-items-center">
        {/* glowing plinth — hue shifts per era */}
        <div
          aria-hidden
          className="absolute bottom-4 h-5 w-24 rounded-[50%] blur-[6px] transition-colors duration-500"
          style={{ background: `rgba(${era.rgb},0.35)`, boxShadow: `0 0 24px rgba(${era.rgb},0.4)` }}
        />
        <AnimatePresence mode="sync">
          <motion.img
            key={era.year}
            src={src}
            alt={`Pikachu — ${era.label} sprite`}
            draggable={false}
            className={cn('relative h-24 w-24 object-contain', era.era !== 'showdown' && 'pixelated')}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />
        </AnimatePresence>
      </div>
      <input
        type="range"
        min={0}
        max={ERAS.length - 1}
        step={1}
        value={idx}
        onChange={(e) => setIdx(Number(e.target.value))}
        aria-label={t('home.features.scrubberAria')}
        className="w-full accent-gold"
      />
      <div className="flex justify-between">
        {ERAS.map((e, i) => (
          <button
            key={e.year}
            type="button"
            onClick={() => setIdx(i)}
            className={cn(
              'pixel-label text-[8px] transition-colors',
              i === idx ? 'text-gold' : 'text-tx-muted hover:text-tx-secondary',
            )}
          >
            {e.year}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ---------- section ---------- */

const CARDS = [
  { titleKey: 'home.features.filterTitle', captionKey: 'home.features.filterCaption', Demo: FilterDemo },
  { titleKey: 'home.features.statsTitle', captionKey: 'home.features.statsCaption', Demo: StatsDemo },
  { titleKey: 'home.features.museumTitle', captionKey: 'home.features.museumCaption', Demo: MuseumDemo },
];

/* Toolkit teasers — live features shipped after Phase 01. */
function DemoCard({ titleKey, captionKey, Demo, index }: { titleKey: string; captionKey: string; Demo: (p: { live: boolean }) => React.JSX.Element; index: number }) {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-20% 0px' });
  return (
    <motion.div
      ref={ref}
      initial={{ y: 40, opacity: 0, filter: 'blur(8px)' }}
      whileInView={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-20% 0px' }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: EASE }}
      className="flex flex-col gap-4 rounded-xl border border-hairline bg-surface1 p-6 lg:aspect-[5/6]"
    >
      <Demo live={inView} />
      <div className="mt-auto">
        <h3 className="font-display text-lg font-bold">{t(titleKey)}</h3>
        <p className="mt-1 font-sans text-sm text-tx-secondary">{t(captionKey)}</p>
      </div>
    </motion.div>
  );
}

export default function Features() {
  const { t } = useTranslation();
  return (
    <section className="mx-auto max-w-content overflow-x-clip px-4 py-24 md:px-8">
      <div className="mb-12 flex flex-col gap-4">
        <span className="pixel-label text-[14px] text-gold">{t('home.features.eyebrow')}</span>
        <h2 className="font-display text-[clamp(1.5rem,3vw,36px)] font-extrabold leading-[1.15]">
          {t('home.features.title')}
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {CARDS.map((c, i) => (
          <DemoCard key={c.titleKey} titleKey={c.titleKey} captionKey={c.captionKey} Demo={c.Demo} index={i} />
        ))}
      </div>

      {/* feedback teaser — replaces the roadmap marquee: bugs & ideas wanted */}
      <div className="mt-10 flex flex-wrap items-center gap-5 rounded-lg border border-gold/35 bg-[linear-gradient(135deg,rgba(246,201,69,0.10),rgba(246,201,69,0.03))] px-6 py-6">
        <div className="min-w-[13.75rem] flex-1">
          <p className="pixel-label text-[9px] text-gold">{t('home.feedbackTeaser.eyebrow')}</p>
          <h3 className="mt-1.5 font-display text-lg font-extrabold tracking-wide text-tx-primary">
            {t('home.feedbackTeaser.title')}
          </h3>
          <p className="mt-1.5 max-w-[56ch] font-sans text-micro13 leading-relaxed text-tx-secondary">
            {t('home.feedbackTeaser.text')}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <LocaleLink
            to="/feedback"
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-gold/60 bg-[linear-gradient(135deg,rgba(246,201,69,0.25),rgba(246,201,69,0.10))] px-4 font-display text-micro12 font-bold tracking-wider text-tx-primary transition-all duration-200 hover:-translate-y-0.5 hover:shadow-glow-gold"
          >
            {t('home.feedbackTeaser.bugCta')}
          </LocaleLink>
          <LocaleLink
            to="/feedback"
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-hairline2 px-4 font-display text-micro12 font-bold tracking-wider text-tx-secondary transition-colors duration-200 hover:border-gold/50 hover:text-gold"
          >
            {t('home.feedbackTeaser.featureCta')}
          </LocaleLink>
        </div>
      </div>
    </section>
  );
}
