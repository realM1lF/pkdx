/* Spotlight of the Day — "TODAY'S SPOTLIGHT" (home.md §3). */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LocaleLink } from '@/lib/locale-link';
import { genusOfPokemon, nameOfPokemon, useLanguage } from '@/lib/i18n-data';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import StatBar from '@/components/StatBar';
import TypeBadge from '@/components/TypeBadge';
import PokeballLoader from '@/components/PokeballLoader';
import { englishGenus, getPokemon, getSpecies, latestFlavor, padNum, statOf } from '@/lib/pokeapi';
import { sprites } from '@/lib/sprites';
import { MAX_DEX_ID, TYPE_COLORS } from '@/lib/types';
import type { Pokemon, PokemonSpecies, PokemonType } from '@/lib/types';
import { cn } from '@/lib/utils';

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

function dayOfYear(): number {
  const now = new Date();
  return Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000);
}

function pickId(offset: number): number {
  return ((dayOfYear() + offset) * 137) % MAX_DEX_ID + 1;
}

/** 8-particle sparkle burst (design.md §6.2-6) */
function SparkleBurst({ burstKey }: { burstKey: number }) {
  const vectors = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2 + Math.random() * 0.5;
        const dist = 60 + Math.random() * 60;
        return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [burstKey],
  );
  if (burstKey === 0) return null;
  return (
    <div key={burstKey} className="pointer-events-none absolute inset-0 z-20" aria-hidden>
      {vectors.map((v, i) => (
        <motion.img
          key={i}
          src="/sparkle.svg"
          alt=""
          className="absolute left-1/2 top-1/2 h-4 w-4"
          initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
          animate={{ x: v.x, y: v.y, scale: [0, 1, 0], opacity: [1, 1, 0] }}
          transition={{ duration: 0.7, delay: i * 0.03, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}

export default function Spotlight() {
  const { t } = useTranslation();
  const lang = useLanguage();
  const [offset, setOffset] = useState(0);
  const id = pickId(offset);
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [species, setSpecies] = useState<PokemonSpecies | null>(null);
  const [shiny, setShiny] = useState(false);
  const [burst, setBurst] = useState(0);

  /* reset on id change — derived-state-during-render pattern */
  const [prevId, setPrevId] = useState(id);
  if (prevId !== id) {
    setPrevId(id);
    setPokemon(null);
    setSpecies(null);
    setShiny(false);
  }

  useEffect(() => {
    let alive = true;
    Promise.all([getPokemon(id), getSpecies(id)])
      .then(([p, s]) => {
        if (!alive) return;
        setPokemon(p);
        setSpecies(s);
      })
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, [id]);

  /* artwork tilt toward cursor (±4°) + specular sheen */
  const stageRef = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 180, damping: 22 });
  const sry = useSpring(ry, { stiffness: 180, damping: 22 });
  const [sheen, setSheen] = useState({ x: 50, y: 50, o: 0 });

  const onTilt = (e: React.PointerEvent) => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    ry.set((px - 0.5) * 8);
    rx.set(-(py - 0.5) * 8);
    setSheen({ x: px * 100, y: py * 100, o: 1 });
  };
  const resetTilt = () => {
    rx.set(0);
    ry.set(0);
    setSheen((s) => ({ ...s, o: 0 }));
  };

  const types = (pokemon?.types ?? [])
    .sort((a, b) => a.slot - b.slot)
    .map((t) => t.type.name as PokemonType);
  const primary = types[0] ?? 'normal';
  const secondary = types[1] ?? primary;
  const legendary = species?.is_legendary || species?.is_mythical;

  return (
    <section className="mx-auto max-w-content px-4 py-24 md:px-8">
      <motion.div
        initial={{ clipPath: 'inset(12% 8% 12% 8% round 24px)', opacity: 0.4 }}
        whileInView={{ clipPath: 'inset(0% 0% 0% 0% round 24px)', opacity: 1 }}
        viewport={{ once: true, margin: '-25% 0px' }}
        transition={{ duration: 0.9, ease: EASE }}
        className={cn(
          'relative overflow-hidden rounded-xl border border-hairline bg-surface1',
          legendary && 'legendary-ring',
        )}
      >
        {/* dynamic type mesh — two radial blobs at 18% alpha */}
        <div
          aria-hidden
          className="absolute inset-0 transition-[background] duration-700"
          style={{
            background: `radial-gradient(640px 420px at 18% 30%, rgba(${TYPE_COLORS[primary].rgb},0.18), transparent 70%), radial-gradient(560px 400px at 85% 75%, rgba(${TYPE_COLORS[secondary].rgb},0.14), transparent 70%)`,
          }}
        />
        <div className="grain-overlay absolute inset-0" />

        <div className="relative grid gap-10 p-6 md:p-10 lg:grid-cols-12 lg:gap-6">
          {/* left — artwork stage */}
          <div className="lg:col-span-5">
            <motion.div
              ref={stageRef}
              onPointerMove={onTilt}
              onPointerLeave={resetTilt}
              className="relative mx-auto aspect-square w-full max-w-[400px]"
              initial={{ x: -40, opacity: 0, filter: 'blur(12px)' }}
              whileInView={{ x: 0, opacity: 1, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-25% 0px' }}
              transition={{ duration: 0.7, ease: EASE }}
              style={{ perspective: 800 }}
            >
              <div
                className="type-aura animate-breathe"
                style={{
                  background: `radial-gradient(circle at 50% 55%, rgba(${TYPE_COLORS[primary].rgb},0.38) 0%, rgba(${TYPE_COLORS[primary].rgb},0.12) 42%, transparent 70%)`,
                }}
              />
              <div className="absolute bottom-[8%] left-1/2 h-6 w-[58%] -translate-x-1/2 animate-breathe rounded-[50%] border border-gold/40" />
              <AnimatePresence mode="sync">
                <motion.div
                  key={id + String(shiny)}
                  className="absolute inset-0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ rotateX: srx, rotateY: sry }}
                >
                  {pokemon && (
                    <img
                      src={shiny ? sprites.artworkShiny(id) : sprites.artwork(id)}
                      alt={`${t('home.hero.artworkAlt', { name: nameOfPokemon(id, lang) })}${shiny ? t('detail.hero.shinySuffix') : ''}`}
                      draggable={false}
                      className="h-full w-full object-contain drop-shadow-[0_24px_48px_rgba(0,0,0,0.5)]"
                    />
                  )}
                  {!pokemon && (
                    <div className="grid h-full w-full place-items-center">
                      <PokeballLoader variant="inline" />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
              {/* specular sheen */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 transition-opacity duration-300"
                style={{
                  opacity: sheen.o,
                  background: `radial-gradient(240px 240px at ${sheen.x}% ${sheen.y}%, rgba(255,255,255,0.10), transparent 70%)`,
                }}
              />
              <SparkleBurst burstKey={burst} />
              {/* shiny toggle */}
              <button
                type="button"
                aria-pressed={shiny}
                aria-label={t('detail.hero.shinyArtwork')}
                onClick={() => {
                  setShiny((s) => !s);
                  setBurst((b) => b + 1);
                }}
                className={cn(
                  'absolute right-0 top-0 z-10 grid h-10 w-10 place-items-center rounded-md border transition-all duration-200',
                  shiny
                    ? 'border-gold/60 bg-gold-soft text-gold shadow-glow-gold'
                    : 'border-hairline bg-surface2/80 text-tx-muted hover:border-hairline2 hover:text-gold',
                )}
              >
                <Sparkles size={18} strokeWidth={1.75} />
              </button>
            </motion.div>
          </div>

          {/* right — info */}
          <div className="flex flex-col justify-center gap-4 lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col gap-4"
              >
                {[
                  <span key="num" className="pixel-label text-[11px] text-gold">
                    {padNum(id)}
                  </span>,
                  <div key="name">
                    <h2 className="font-display text-[clamp(24px,3vw,36px)] font-extrabold leading-[1.15]">
                      {pokemon ? nameOfPokemon(id, lang) : '…'}
                    </h2>
                    <p className="mt-1 font-sans text-base italic text-tx-secondary">
                      {lang === 'de' ? genusOfPokemon(id, lang) : species ? englishGenus(species) : ' '}
                    </p>
                  </div>,
                  <div key="types" className="flex flex-wrap gap-2">
                    {types.map((t) => (
                      <TypeBadge key={t} type={t} glow />
                    ))}
                  </div>,
                  <p key="flavor" className="max-w-[62ch] font-sans text-base leading-[1.55] text-tx-secondary">
                    {species ? latestFlavor(species, lang) : t('home.spotlight.loadingFlavor')}
                  </p>,
                  <div key="stats" className="flex max-w-[440px] flex-col gap-2.5">
                    <StatBar label="HP" value={pokemon ? statOf(pokemon, 'hp') : 0} type={primary} />
                    <StatBar label="ATK" value={pokemon ? statOf(pokemon, 'attack') : 0} type={primary} delay={80} />
                    <StatBar label="DEF" value={pokemon ? statOf(pokemon, 'defense') : 0} type={primary} delay={160} />
                  </div>,
                  <div key="cta" className="mt-2 flex flex-wrap gap-4">
                    <LocaleLink
                      to={`/pokemon/${id}`}
                      className="group relative inline-flex items-center gap-2 overflow-hidden rounded-md border px-6 py-3 font-display text-sm font-bold tracking-[0.06em] text-tx-primary transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.97]"
                      style={{
                        borderColor: `rgba(${TYPE_COLORS[primary].rgb},0.6)`,
                        background: `linear-gradient(135deg, rgba(${TYPE_COLORS[primary].rgb},0.25), rgba(${TYPE_COLORS[primary].rgb},0.10))`,
                        boxShadow: `0 0 0 rgba(${TYPE_COLORS[primary].rgb},0)`,
                      }}
                    >
                      <span className="absolute inset-0 -translate-x-full bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.35)_50%,transparent_70%)] transition-transform duration-sheen group-hover:translate-x-full" />
                      <span className="relative">{t('home.spotlight.viewEntry')}</span>
                    </LocaleLink>
                    <button
                      type="button"
                      onClick={() => setOffset((o) => o + 1)}
                      className="rounded-md border border-hairline2 px-6 py-3 font-display text-sm font-bold tracking-[0.06em] text-tx-secondary transition-all duration-200 hover:-translate-y-0.5 hover:bg-surface3 hover:text-gold active:scale-[0.97]"
                    >
                      {t('home.spotlight.next')}
                    </button>
                  </div>,
                ].map((node, i) => (
                  <motion.div
                    key={node.key}
                    initial={{ y: 24, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, margin: '-20% 0px' }}
                    transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
                  >
                    {node}
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
