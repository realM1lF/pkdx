/* Generations Rail — "NINE GENERATIONS" (home.md §5).
 * Framer drag="x" with inertia, arrow buttons, gold progress hairline. */
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LocaleLink } from '@/lib/locale-link';
import { genRegionKey } from '@/lib/i18n-data';
import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Sprite from '@/components/Sprite';
import Reveal from './Reveal';
import { GENERATIONS, TYPE_COLORS } from '@/lib/types';

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];
const CARD_W = 320;
const GAP = 24;

const GLOW_CYCLE = [
  `rgb(${TYPE_COLORS.grass.rgb})`,
  `rgb(${TYPE_COLORS.fire.rgb})`,
  `rgb(${TYPE_COLORS.water.rgb})`,
  `rgb(${TYPE_COLORS.grass.rgb})`,
];

export default function GenerationsRail() {
  const { t } = useTranslation();
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const [maxDrag, setMaxDrag] = useState(0);
  const progress = useTransform(x, (v) => (maxDrag > 0 ? Math.min(1, Math.max(0, -v / maxDrag)) : 0));

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      const viewport = viewportRef.current;
      if (!track || !viewport) return;
      setMaxDrag(Math.max(0, track.scrollWidth - viewport.clientWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (viewportRef.current) ro.observe(viewportRef.current);
    return () => ro.disconnect();
  }, []);

  const nudge = (dir: 1 | -1) => {
    const target = Math.min(0, Math.max(-maxDrag, x.get() + dir * -(CARD_W + GAP)));
    animate(x, target, { duration: 0.4, ease: EASE });
  };

  return (
    <section className="overflow-x-clip py-24">
      <Reveal className="mx-auto mb-10 flex max-w-content flex-wrap items-end justify-between gap-6 px-4 md:px-8">
        <div className="flex flex-col gap-4">
          <span className="pixel-label text-[10px] text-gold">1996 → 2022</span>
          <h2 className="font-display text-[clamp(24px,3vw,36px)] font-extrabold uppercase leading-[1.15]">
            {t('home.generations.title')}
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <span className="pixel-label hidden text-[9px] text-tx-muted sm:block">{t('home.generations.drag')}</span>
          <button
            type="button"
            onClick={() => nudge(-1)}
            aria-label={t('home.generations.prev')}
            className="grid h-10 w-10 place-items-center rounded-md border border-hairline bg-surface2 text-tx-secondary transition-all duration-200 hover:border-gold/60 hover:text-gold"
          >
            <ArrowLeft size={18} strokeWidth={1.75} />
          </button>
          <button
            type="button"
            onClick={() => nudge(1)}
            aria-label={t('home.generations.next')}
            className="grid h-10 w-10 place-items-center rounded-md border border-hairline bg-surface2 text-tx-secondary transition-all duration-200 hover:border-gold/60 hover:text-gold"
          >
            <ArrowRight size={18} strokeWidth={1.75} />
          </button>
        </div>
      </Reveal>

      <motion.div
        initial={{ x: 60, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true, margin: '-20% 0px' }}
        transition={{ duration: 0.7, ease: EASE }}
        className="overflow-x-clip"
      >
        <div ref={viewportRef} className="overflow-hidden">
          <motion.div
            ref={trackRef}
            drag="x"
            style={{ x }}
            dragConstraints={{ left: -maxDrag, right: 0 }}
            dragTransition={{ power: 0.4, timeConstant: 220 }}
            className="flex cursor-grab gap-6 px-4 active:cursor-grabbing md:px-8"
          >
            {GENERATIONS.map((g) => {
              const count = g.range[1] - g.range[0] + 1;
              const era = g.gen <= 5 ? ('gen5' as const) : ('home' as const);
              return (
                <LocaleLink
                  key={g.gen}
                  to={`/pokedex?gen=${g.gen}`}
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                  className="group relative flex h-[360px] w-[260px] shrink-0 flex-col justify-between overflow-hidden rounded-lg border border-hairline bg-surface1 p-6 transition-transform duration-300 ease-out-expo hover:-translate-y-1.5 sm:w-[320px]"
                >
                  {/* border glow cycling starter types */}
                  <motion.div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-lg border opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    animate={{ borderColor: GLOW_CYCLE }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  />
                  {/* roman numeral watermark */}
                  <span
                    aria-hidden
                    className="absolute -right-2 -top-4 select-none font-display text-8xl font-black text-tx-primary/[0.08]"
                  >
                    {g.roman}
                  </span>

                  <div className="flex items-baseline justify-between">
                    <span className="pixel-label text-[10px] text-gold">GEN {g.roman}</span>
                    <span className="font-sans text-xs font-medium text-tx-muted">{g.year}</span>
                  </div>

                  <div className="flex items-end justify-center gap-2">
                    {g.starters.map((id, j) => (
                      <div
                        key={id}
                        className="group-hover:animate-[hop_0.42s_ease-in-out]"
                        style={{ animationDelay: `${j * 100}ms` }}
                      >
                        <Sprite id={id} name={t('home.generations.starterAlt', { roman: g.roman })} era={era} skeleton={false} className="h-20 w-20 sm:h-24 sm:w-24" />
                      </div>
                    ))}
                  </div>

                  <div>
                    <h3 className="font-sans text-lg font-bold text-tx-primary transition-colors duration-200 group-hover:text-gold">
                      {t(`regions.${genRegionKey(g.region)}`)}
                    </h3>
                    <span className="pixel-label mt-1 block text-[9px] text-tx-muted">
                      {t('home.generations.count', { count })}
                    </span>
                  </div>
                </LocaleLink>
              );
            })}
          </motion.div>
        </div>

        {/* progress hairline */}
        <div className="mx-4 mt-6 h-0.5 overflow-hidden rounded-pill bg-surface3 md:mx-8">
          <motion.div
            className="h-full origin-left bg-gradient-to-r from-gold to-type-fire"
            style={{ scaleX: progress }}
          />
        </div>
      </motion.div>
    </section>
  );
}
