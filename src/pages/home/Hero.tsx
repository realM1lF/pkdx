/* Hero — "THE LIVING DEX" (home.md §1). 100svh, bleeds under fixed nav (-mt-16). */
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { LocaleLink, useLocalePath } from '@/lib/locale-link';
import { nameOfPokemon, useLanguage } from '@/lib/i18n-data';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown, Dices } from 'lucide-react';
import HeroBackdrop from './HeroBackdrop';
import Sprite from '@/components/Sprite';
import { heroArtworkSrc } from '@/lib/img-priority';
import { isDeferredChromeAllowed, scheduleIdle } from '@/lib/idle-boot';
import type { RunState } from '@/lib/nuzlocke-store';
import { MAX_DEX_ID, TYPE_COLORS } from '@/lib/types';
import type { PokemonType } from '@/lib/types';
import { cn } from '@/lib/utils';

const ParticleField = lazy(() => import('./ParticleField'));

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const SPOTLIGHTS: Array<{ id: number; name: string; type: PokemonType; artOffsetX: number }> = [
  { id: 6, name: 'Charizard', type: 'fire', artOffsetX: -18 },
  { id: 3, name: 'Venusaur', type: 'grass', artOffsetX: -10 },
  { id: 9, name: 'Blastoise', type: 'water', artOffsetX: -12 },
];

const ORBITERS = [
  { id: 1, name: 'Bulbasaur' },
  { id: 4, name: 'Charmander' },
  { id: 7, name: 'Squirtle' },
];

function SplitChars({
  text,
  started,
  baseDelay = 0,
  gradient = false,
}: {
  text: string;
  started: boolean;
  baseDelay?: number;
  gradient?: boolean;
}) {
  return (
    <span aria-label={text} className="inline-block">
      {Array.from(text).map((ch, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden align-bottom">
          <motion.span
            className={cn('inline-block will-change-transform', gradient && 'text-gradient-alive')}
            initial={started ? false : { y: 60, rotate: 6, opacity: 0 }}
            animate={started ? { y: 0, rotate: 0, opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: baseDelay + i * 0.022, ease: EASE }}
          >
            {ch === ' ' ? ' ' : ch}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

function SpotlightPedestal({ started }: { started: boolean }) {
  const { t } = useTranslation();
  const lang = useLanguage();
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!started) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = window.setInterval(() => setIdx((i) => (i + 1) % SPOTLIGHTS.length), 6000);
    return () => window.clearInterval(t);
  }, [started]);

  const current = SPOTLIGHTS[idx];
  const rgb = TYPE_COLORS[current.type].rgb;

  return (
    <motion.div
      className="relative mx-auto h-[18.75rem] w-[18.75rem] lg:h-[32.5rem] lg:w-[32.5rem]"
      initial={started ? false : { scale: 0.8, opacity: 0 }}
      animate={started ? { scale: 1, opacity: 1 } : {}}
      transition={{ type: 'spring', stiffness: 180, damping: 22, delay: 0.5 }}
    >
      {/* back — aura + plinth */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="sync">
          <motion.div
            key={current.type}
            className="type-aura animate-breathe"
            style={{
              background: `radial-gradient(circle at 50% 55%, rgba(${rgb},0.38) 0%, rgba(${rgb},0.12) 42%, transparent 70%)`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        </AnimatePresence>

        <div className="absolute bottom-[8%] left-1/2 w-[58%] -translate-x-1/2">
          <div
            className="h-6 w-full animate-breathe rounded-[50%] border border-gold/50"
            style={{ boxShadow: '0 0 24px rgba(246,201,69,0.25), inset 0 0 18px rgba(246,201,69,0.12)' }}
          />
        </div>
      </div>

      {/* mid — spotlight artwork (fixed box; crossfade images stacked absolutely) */}
      <div
        className="absolute inset-x-0 bottom-[9%] z-10 mx-auto h-[84%] w-[84%] lg:h-[88%] lg:w-[88%]"
        style={{ transform: `translateX(${current.artOffsetX}px)` }}
      >
        <AnimatePresence mode="sync">
          <motion.img
            key={current.id}
            src={heroArtworkSrc(current.id)}
            alt={t('home.hero.artworkAlt', { name: nameOfPokemon(current.id, lang) })}
            width={475}
            height={475}
            decoding="async"
            draggable={false}
            className="absolute inset-0 h-full w-full object-contain object-bottom drop-shadow-[0_24px_48px_rgba(0,0,0,0.5)]"
            initial={started ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          />
        </AnimatePresence>
      </div>

      {/* front — orbital starters above the spotlight */}
      <div className="absolute inset-0 z-20 hidden animate-spin-slow lg:block" aria-hidden>
        {ORBITERS.map((o, i) => (
          <div
            key={o.id}
            className="absolute left-1/2 top-1/2"
            style={{ transform: `rotate(${i * 120}deg) translateX(212px)` }}
          >
            <div className="animate-spin-rev">
              <div style={{ transform: `rotate(${-i * 120}deg)` }}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={started ? { scale: 1 } : {}}
                  transition={{ type: 'spring', stiffness: 420, damping: 30, delay: 0.9 + i * 0.12 }}
                >
                  <Sprite
                    id={o.id}
                    name={nameOfPokemon(o.id, lang)}
                    era="gen5"
                    skeleton={false}
                    className="-ml-12 -mt-12 h-24 w-24"
                  />
                </motion.div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function Hero({ started }: { started: boolean }) {
  const navigate = useNavigate();
  const localePath = useLocalePath();
  const { t } = useTranslation();
  const lang = useLanguage();
  const heroRef = useRef<HTMLElement>(null);
  const [rattling, setRattling] = useState(false);
  const [particlesReady, setParticlesReady] = useState(false);
  const [latestRun, setLatestRun] = useState<RunState | null>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const contentY = useTransform(scrollYProgress, [0, 0.6], [0, 48]); // soft exit — 0.92× scroll speed

  const surprise = () => {
    if (rattling) return;
    setRattling(true);
    const id = 1 + Math.floor(Math.random() * MAX_DEX_ID);
    window.setTimeout(() => navigate(localePath(`/pokemon/${id}`)), 500);
  };

  useEffect(() => {
    if (!isDeferredChromeAllowed()) return;
    return scheduleIdle(() => {
      setParticlesReady(true);
      void import('@/lib/nuzlocke-store').then((m) => {
        setLatestRun(m.loadLocalRun(m.getLatestRunId() ?? ''));
      });
    });
  }, []);

  return (
    <section ref={heroRef} className="relative -mt-16 flex min-h-[100svh] items-center overflow-hidden md:-mt-[6.5rem]">
      <HeroBackdrop />
      {particlesReady && (
        <Suspense fallback={null}>
          <ParticleField />
        </Suspense>
      )}

      <motion.div
        style={{ y: contentY }}
        className="relative z-10 mx-auto grid w-full max-w-content gap-10 px-4 pb-24 pt-28 md:px-8 lg:grid-cols-12 lg:items-center lg:gap-6 lg:pb-16"
      >
        {/* left — copy */}
        <div className="lg:col-span-7">
          <h1 className="font-display text-[clamp(3rem,8vw,96px)] font-black leading-[1.02] tracking-[0.01em]">
            <SplitChars text={t('home.hero.titleA')} started={started} baseDelay={0.15} />
            <br />
            <SplitChars text={t('home.hero.titleB')} started={started} baseDelay={0.45} />
          </h1>

          <motion.p
            className="mt-6 max-w-[56ch] font-sans text-lg leading-[1.6] text-tx-secondary"
            initial={started ? false : { y: 24, opacity: 0 }}
            animate={started ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.7, ease: EASE }}
          >
            {t('home.hero.blurb')}
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap items-center gap-4"
            initial={started ? false : { y: 24, opacity: 0 }}
            animate={started ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.79, ease: EASE }}
          >
            <LocaleLink
              to="/pokedex"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-md border border-gold/60 bg-[linear-gradient(135deg,rgba(246,201,69,0.25),rgba(246,201,69,0.10))] px-7 py-3.5 font-display text-sm font-bold tracking-[0.06em] text-tx-primary transition-all duration-200 hover:-translate-y-0.5 hover:border-gold hover:shadow-glow-gold active:scale-[0.97]"
            >
              <span className="absolute inset-0 -translate-x-full bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.35)_50%,transparent_70%)] transition-transform duration-sheen group-hover:translate-x-full" />
              <span className="relative">{t('home.hero.cta')}</span>
            </LocaleLink>
            <button
              type="button"
              onClick={surprise}
              className="inline-flex items-center gap-2 rounded-md border border-hairline2 px-7 py-3.5 font-display text-sm font-bold tracking-[0.06em] text-tx-secondary transition-all duration-200 hover:-translate-y-0.5 hover:bg-surface3 hover:text-gold active:scale-[0.97]"
            >
              <motion.span
                animate={rattling ? { rotate: 360 } : { rotate: 0 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="inline-flex"
              >
                <Dices size={18} strokeWidth={1.75} />
              </motion.span>
              {t('home.hero.surprise')}
            </button>
            {latestRun && (
              <LocaleLink
                to={`/nuzlocke/${latestRun.run.id}`}
                className="inline-flex flex-col rounded-md border border-hairline2 px-5 py-3 text-left transition-colors hover:border-gold/50 hover:text-gold"
              >
                <span className="font-display text-micro11 font-bold tracking-[0.06em] text-tx-primary">{t('nuz.continueRun')}</span>
                <span className="mt-0.5 text-micro11 text-tx-muted">{t('nuz.continueRunHint', { name: latestRun.run.name })}</span>
              </LocaleLink>
            )}
          </motion.div>

          <motion.p
            className="pixel-label mt-8 text-[9px] text-tx-muted"
            initial={started ? false : { y: 24, opacity: 0 }}
            animate={started ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.88, ease: EASE }}
          >
            {t('home.hero.stats')}
          </motion.p>
        </div>

        {/* right — spotlight pedestal */}
        <div className="overflow-visible lg:col-span-5">
          <SpotlightPedestal started={started} />
          {/* mobile: static 3-up row instead of orbit */}
          <motion.div
            className="mt-4 flex items-center justify-center gap-6 lg:hidden"
            initial={{ opacity: 0 }}
            animate={started ? { opacity: 1 } : {}}
            transition={{ delay: 1, duration: 0.5 }}
          >
            {ORBITERS.map((o) => (
              <Sprite key={o.id} id={o.id} name={nameOfPokemon(o.id, lang)} era="gen5" skeleton={false} className="h-16 w-16" />
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* scroll cue */}
      <motion.a
        href="#search-gateway"
        className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 text-tx-muted transition-colors hover:text-gold"
        initial={{ opacity: 0 }}
        animate={started ? { opacity: 1 } : {}}
        transition={{ delay: 1.3, duration: 0.5 }}
        aria-label={t('home.hero.scrollAria')}
      >
        <span className="pixel-label text-[9px]">{t('home.hero.scroll')}</span>
        <ChevronDown size={20} strokeWidth={1.75} className="animate-cue-bounce" />
      </motion.a>
    </section>
  );
}
