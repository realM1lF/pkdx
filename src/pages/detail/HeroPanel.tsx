/* Hero panel — density-addendum §3 Row 1 (span 7).
 * Artwork 220–260px + breathing type aura + shiny toggle/sparkle burst + cry button,
 * identity column: # / name / TypeBadges / flavor+version chips / quick-facts 2×4. */
import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { LocaleLink } from '@/lib/locale-link';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import { ArrowRight, Sparkles, Volume2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import TypeBadge from '@/components/TypeBadge';
import { englishGenus, flavorsByVersion, padNum, pokemonTypes } from '@/lib/pokeapi';
import { genRegionKey, genusOfPokemon, nameOfAbility, nameOfEggGroup, nameOfGrowth, nameOfPokemon, useLanguage } from '@/lib/i18n-data';
import { getLenis } from '@/lib/smooth';
import { useShiny } from '@/lib/shiny';
import { sprites } from '@/lib/sprites';
import { genOf } from '@/lib/types';
import type { Pokemon, PokemonSpecies, PokemonType } from '@/lib/types';
import { cn } from '@/lib/utils';
import { formatHeight, formatWeight, speciesExtras, typeRgb } from './data';

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

/* ---------- sparkle burst (design.md §6.2-6) ---------- */

function SparkleBurst({ burstKey }: { burstKey: number }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2 + Math.random() * 0.6;
        const dist = 60 + Math.random() * 60;
        return {
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist,
          size: 10 + Math.random() * 14,
          delay: i * 0.03,
        };
      }),
    // recompute per burst
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [burstKey],
  );
  if (!burstKey) return null;
  return (
    <span className="pointer-events-none absolute inset-0 z-20 grid place-items-center" aria-hidden>
      {particles.map((p, i) => (
        <motion.img
          key={`${burstKey}-${i}`}
          src="/sparkle.svg"
          alt=""
          className="absolute"
          style={{ width: p.size, height: p.size }}
          initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
          animate={{ x: p.x, y: p.y, scale: [0, 1, 0], opacity: [1, 1, 0] }}
          transition={{ duration: 0.7, delay: p.delay, ease: EASE }}
        />
      ))}
    </span>
  );
}

/* ---------- quick fact cell ---------- */

function Fact({ label, children, span = 1 }: { label: string; children: React.ReactNode; span?: 1 | 2 }) {
  return (
    <div
      className={cn(
        'min-w-0 rounded-md border border-hairline bg-abyss/50 px-2.5 py-1.5',
        span === 2 && 'col-span-2',
      )}
    >
      <div className="pixel-label text-[8px] leading-[1.4] text-tx-muted">{label}</div>
      <div className="mt-0.5 truncate font-sans text-[13px] font-semibold text-tx-primary">{children}</div>
    </div>
  );
}

/* ---------- catch-rate 3-segment meter ---------- */

function CatchMeter({ rate }: { rate: number }) {
  const filled = Math.max(1, Math.round((rate / 255) * 3));
  return (
    <span className="inline-flex items-center gap-2">
      {rate}
      <span className="inline-flex gap-0.5" aria-hidden>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={cn('h-1.5 w-3 rounded-pill', i < filled ? 'bg-gold' : 'bg-surface3')}
          />
        ))}
      </span>
    </span>
  );
}

/* ---------- hero panel ---------- */

interface HeroPanelProps {
  pokemon: Pokemon;
  species: PokemonSpecies | null;
}

export default function HeroPanel({ pokemon, species }: HeroPanelProps) {
  const types = pokemonTypes(pokemon);
  const primary = types[0] ?? 'normal';
  const secondary = types[1];
  const { shiny: globalShiny } = useShiny();
  const { t } = useTranslation();
  const lang = useLanguage();
  const name = nameOfPokemon(pokemon.id, lang);
  const [shiny, setShiny] = useState(globalShiny);
  const [burst, setBurst] = useState(0);
  const [crying, setCrying] = useState(false);
  const [hopKey, setHopKey] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pressTimer = useRef<number | null>(null);
  const longPressed = useRef(false);

  /* artwork tilt (desktop, fine pointers only) */
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 180, damping: 22 });
  const sry = useSpring(ry, { stiffness: 180, damping: 22 });

  const flavors = useMemo(() => (species ? flavorsByVersion(species, lang) : []), [species, lang]);
  const versionChips = useMemo(() => {
    const seen = new Set<string>();
    const out: Array<{ version: string; text: string }> = [];
    for (let i = flavors.length - 1; i >= 0 && out.length < 6; i--) {
      if (!seen.has(flavors[i].version)) {
        seen.add(flavors[i].version);
        out.push(flavors[i]);
      }
    }
    return out;
  }, [flavors]);
  const [version, setVersion] = useState<string | null>(null);
  const activeFlavor = versionChips.find((f) => f.version === version) ?? versionChips[0];

  const extras = speciesExtras(species);
  const genus = lang === 'de' ? genusOfPokemon(pokemon.id, lang) : species ? englishGenus(species) : '';
  const gen = genOf(pokemon.id);
  const hiddenAbbr = t('detail.hero.hiddenAbbr');
  const abilityNames = pokemon.abilities.map(
    (a) => nameOfAbility(a.ability.name, lang) + (a.is_hidden ? ` ${hiddenAbbr}` : ''),
  );
  const eggGroups = extras.egg_groups?.map((g) => nameOfEggGroup(g.name, lang)).join(' · ') || '—';
  const growth = extras.growth_rate ? nameOfGrowth(extras.growth_rate.name, lang) : '—';

  /* reset shiny per entry */
  const [prevId, setPrevId] = useState(pokemon.id);
  if (prevId !== pokemon.id) {
    setPrevId(pokemon.id);
    setShiny(globalShiny);
    setVersion(null);
  }

  useEffect(() => () => audioRef.current?.pause(), []);

  const playCry = (legacy: boolean) => {
    const url = legacy
      ? (pokemon.cries?.legacy ?? sprites.cryLegacy(pokemon.id))
      : (pokemon.cries?.latest ?? sprites.cry(pokemon.id));
    audioRef.current?.pause();
    const audio = new Audio(url);
    audioRef.current = audio;
    setCrying(true);
    setHopKey((k) => k + 1);
    void audio.play().catch(() => setCrying(false));
    audio.onended = () => setCrying(false);
    audio.onerror = () => setCrying(false);
  };

  const toggleShiny = () => {
    setShiny((s) => !s);
    setBurst((b) => b + 1);
  };

  const scrollToMuseum = () => {
    const el = document.getElementById('sprite-museum');
    if (!el) return;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(el, { duration: 0.8, offset: -72 });
    else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const auraColor = (t: string) => `rgba(${typeRgb(t)},0.38)`;

  return (
    <div className="grid gap-4 p-4 sm:grid-cols-[240px_1fr] md:p-5 lg:grid-cols-[250px_1fr]">
      {/* ---- artwork stage ---- */}
      <div
        className="relative flex min-h-[240px] items-center justify-center"
        onPointerMove={(e) => {
          if (!window.matchMedia('(pointer: fine)').matches) return;
          const r = e.currentTarget.getBoundingClientRect();
          ry.set(((e.clientX - r.left) / r.width - 0.5) * 10);
          rx.set(-((e.clientY - r.top) / r.height - 0.5) * 10);
        }}
        onPointerLeave={() => {
          rx.set(0);
          ry.set(0);
        }}
      >
        {/* breathing aura(s) */}
        <span
          aria-hidden
          className="type-aura animate-breathe"
          style={{
            background: `radial-gradient(circle at 50% 55%, ${auraColor(primary)} 0%, rgba(${typeRgb(primary)},0.12) 42%, transparent 70%)`,
            transform: secondary ? 'translateX(-15%)' : undefined,
          }}
        />
        {secondary && (
          <span
            aria-hidden
            className="type-aura animate-breathe"
            style={{
              background: `radial-gradient(circle at 50% 55%, ${auraColor(secondary)} 0%, rgba(${typeRgb(secondary)},0.12) 42%, transparent 70%)`,
              transform: 'translateX(15%)',
              animationDelay: '-1.6s',
            }}
          />
        )}
        <span aria-hidden className="dx-plinth" />

        {/* artwork (tilt outer, float inner) */}
        <motion.div
          style={{ rotateX: srx, rotateY: sry, transformPerspective: 600 }}
          className="relative z-10 h-[220px] w-[220px] md:h-[240px] md:w-[240px]"
        >
          <motion.div
            key={hopKey}
            animate={hopKey ? { y: [0, -10, 0] } : undefined}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="h-full w-full"
          >
            <div className="h-full w-full animate-bob">
              <AnimatePresence mode="wait" initial={false}>
                <motion.img
                  key={shiny ? 'shiny' : 'normal'}
                  src={shiny ? sprites.artworkShiny(pokemon.id) : sprites.artwork(pokemon.id)}
                  alt={`${t('detail.hero.artworkAlt', { name })}${shiny ? t('detail.hero.shinySuffix') : ''}`}
                  className="h-full w-full object-contain drop-shadow-[0_16px_32px_rgba(0,0,0,0.5)]"
                  draggable={false}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>

        <SparkleBurst burstKey={burst} />

        {/* shiny toggle */}
        <button
          type="button"
          onClick={toggleShiny}
          aria-pressed={shiny}
          aria-label={t('detail.hero.shinyArtwork')}
          className={cn(
            'absolute right-1 top-1 z-20 grid h-10 w-10 place-items-center rounded-md border backdrop-blur-sm transition-all duration-200',
            shiny
              ? 'border-gold/70 bg-gold-soft text-gold shadow-glow-gold'
              : 'border-hairline bg-abyss/50 text-tx-muted hover:border-hairline2 hover:text-gold',
          )}
        >
          <Sparkles size={17} strokeWidth={1.75} />
        </button>

        {/* cry button */}
        <button
          type="button"
          aria-label={t('detail.hero.playCry')}
          onClick={() => {
            if (longPressed.current) {
              longPressed.current = false;
              return;
            }
            playCry(false);
          }}
          onContextMenu={(e) => {
            e.preventDefault();
            playCry(true);
          }}
          onPointerDown={() => {
            pressTimer.current = window.setTimeout(() => {
              longPressed.current = true;
              playCry(true);
            }, 550);
          }}
          onPointerUp={() => {
            if (pressTimer.current) window.clearTimeout(pressTimer.current);
          }}
          onPointerLeave={() => {
            if (pressTimer.current) window.clearTimeout(pressTimer.current);
          }}
          className={cn(
            'absolute bottom-0 left-1/2 z-20 flex h-8 -translate-x-1/2 items-center gap-2 rounded-pill border px-3.5 backdrop-blur-sm transition-all duration-200',
            crying
              ? 'border-gold/70 bg-gold-soft text-gold'
              : 'border-hairline bg-abyss/50 text-tx-secondary hover:border-gold/50 hover:text-gold',
          )}
        >
          {crying && (
            <>
              <span className="dx-cry-ring" />
              <span className="dx-cry-ring" style={{ animationDelay: '200ms' }} />
            </>
          )}
          <Volume2 size={14} strokeWidth={1.75} />
          <span className="pixel-label text-[9px]">{t('detail.hero.cry')}</span>
        </button>
      </div>

      {/* ---- identity column ---- */}
      <div className="relative min-w-0">
        <span aria-hidden className="dx-ghost-num hidden lg:block">
          {String(pokemon.id).padStart(3, '0')}
        </span>

        <motion.div
          initial="off"
          animate="on"
          variants={{ on: { transition: { staggerChildren: 0.05 } } }}
          className="relative flex min-w-0 flex-col gap-2.5"
        >
          <motion.div variants={{ off: { y: 16, opacity: 0 }, on: { y: 0, opacity: 1 } }} transition={{ duration: 0.4, ease: EASE }}>
            <div className="flex items-baseline gap-3">
              <span className="pixel-label text-[11px] text-gold">{padNum(pokemon.id)}</span>
              <span className="pixel-label text-[8px] text-tx-muted">
                {t(`regions.${genRegionKey(gen.region)}`)} · GEN {gen.roman}
              </span>
            </div>
            <h1 className="mt-0.5 font-display text-[32px] font-black uppercase leading-[1.05] tracking-wide text-tx-primary md:text-[38px]">
              {name}
            </h1>
          </motion.div>

          <motion.div
            variants={{ off: { y: 16, opacity: 0 }, on: { y: 0, opacity: 1 } }}
            transition={{ duration: 0.4, ease: EASE }}
            className="flex flex-wrap items-center gap-1.5"
            data-type={primary}
          >
            {types.map((t) => (
              <TypeBadge key={t} type={t} glow className="!px-2.5 !py-0.5 !text-[11px]" />
            ))}
            {(species?.is_legendary || species?.is_mythical) && (
              <span className="legendary-ring rounded-pill px-2.5 py-0.5 font-sans text-[10px] font-bold uppercase tracking-wider text-gold">
                {species.is_mythical ? t('pokedex.mythical') : t('pokedex.legendary')}
              </span>
            )}
          </motion.div>

          {/* flavor text + version chips */}
          <motion.div
            variants={{ off: { y: 16, opacity: 0 }, on: { y: 0, opacity: 1 } }}
            transition={{ duration: 0.4, ease: EASE }}
            className="rounded-md border border-hairline bg-abyss/50 p-2.5"
          >
            {versionChips.length > 1 && (
              <div className="mb-1.5 flex flex-wrap gap-1">
                {versionChips.map((f) => (
                  <button
                    key={f.version}
                    type="button"
                    onClick={() => setVersion(f.version)}
                    className={cn(
                      'rounded-pill border px-1.5 py-px font-sans text-[10px] font-semibold uppercase transition-all duration-150',
                      activeFlavor?.version === f.version
                        ? 'border-gold/60 bg-gold-soft text-gold'
                        : 'border-hairline text-tx-muted hover:border-hairline2 hover:text-tx-secondary',
                    )}
                  >
                    {f.version}
                  </button>
                ))}
              </div>
            )}
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={activeFlavor?.version ?? 'none'}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: EASE }}
                className="line-clamp-3 font-sans text-[13px] leading-snug text-tx-secondary"
              >
                {activeFlavor?.text ?? t('detail.hero.noFlavor')}
              </motion.p>
            </AnimatePresence>
          </motion.div>

          {/* quick facts 2×4 */}
          <motion.div
            variants={{ off: { y: 16, opacity: 0 }, on: { y: 0, opacity: 1 } }}
            transition={{ duration: 0.4, ease: EASE }}
            className="grid grid-cols-2 gap-1.5 sm:grid-cols-4"
          >
            <Fact label={t('detail.hero.height')}>{formatHeight(pokemon.height, lang)}</Fact>
            <Fact label={t('detail.hero.weight')}>{formatWeight(pokemon.weight, lang)}</Fact>
            <Fact label={t('detail.hero.catchRate')}>
              {extras.capture_rate != null ? <CatchMeter rate={extras.capture_rate} /> : '—'}
            </Fact>
            <Fact label={t('detail.hero.baseExp')}>{pokemon.base_experience ?? '—'}</Fact>
            <Fact label={t('detail.hero.abilities')} span={2}>
              <span className="text-[12px]" title={abilityNames.join(' · ')}>
                {abilityNames.map((n, i) => (
                  <span key={n}>
                    {i > 0 && <span className="text-tx-muted"> · </span>}
                    <span className={n.endsWith(hiddenAbbr) ? 'text-gold' : undefined}>{n}</span>
                  </span>
                ))}
              </span>
            </Fact>
            <Fact label={t('detail.hero.eggGroups')} span={2}>
              <span className="text-[12px]">{eggGroups}</span>
            </Fact>
            <Fact label={t('detail.hero.genus')} span={2}>
              <span className="text-[12px] italic">{genus || '—'}</span>
            </Fact>
            <Fact label={t('detail.hero.growth')} span={2}>
              <span className="text-[12px]">{growth}</span>
            </Fact>
          </motion.div>

          {/* CTA row */}
          <motion.div
            variants={{ off: { y: 16, opacity: 0 }, on: { y: 0, opacity: 1 } }}
            transition={{ duration: 0.4, ease: EASE }}
            className="flex flex-wrap gap-2 pt-0.5"
          >
            <button
              type="button"
              onClick={scrollToMuseum}
              className="group inline-flex h-8 items-center gap-2 rounded-md border px-3.5 font-display text-[11px] font-bold uppercase tracking-wider text-tx-primary transition-all duration-200 hover:-translate-y-0.5"
              style={
                {
                  borderColor: `rgba(${typeRgb(primary)},0.6)`,
                  background: `linear-gradient(135deg, rgba(${typeRgb(primary)},0.25), rgba(${typeRgb(primary)},0.10))`,
                  '--t': typeRgb(primary),
                } as CSSProperties
              }
              data-type={primary as PokemonType}
            >
              {t('detail.hero.museum')}
              <ArrowRight size={13} strokeWidth={2} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
            <LocaleLink
              to="/pokedex"
              className="inline-flex h-8 items-center rounded-md border border-hairline2 px-3.5 font-sans text-[11px] font-semibold uppercase tracking-wider text-tx-secondary transition-all duration-200 hover:bg-surface3 hover:text-gold"
            >
              {t('detail.hero.backToGrid')}
            </LocaleLink>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
