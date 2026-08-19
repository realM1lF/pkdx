/* Type Spectrum — "EIGHTEEN ENERGIES" (home.md §4).
 * 6×3 grid, radial-wave entrance, hover lights the cell + pops 3 Gen-V sprites. */
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useLocalePath } from '@/lib/locale-link';
import { nameOfType, useLanguage } from '@/lib/i18n-data';
import { AnimatePresence, motion } from 'framer-motion';
import Sprite from '@/components/Sprite';
import TypeGlyph from '@/components/TypeGlyph';
import Reveal from './Reveal';
import { POKEMON_TYPES, TYPE_COLORS, TYPE_EXEMPLARS } from '@/lib/types';
import type { PokemonType } from '@/lib/types';
import { cn } from '@/lib/utils';

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];
const COARSE = () => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

export default function TypeSpectrum() {
  const navigate = useNavigate();
  const localePath = useLocalePath();
  const { t: t8n } = useTranslation();
  const lang = useLanguage();
  const [active, setActive] = useState<PokemonType | null>(null);

  const handlePick = (t: PokemonType) => {
    if (COARSE() && active !== t) {
      setActive(t); // first tap lights the cell; second tap navigates
      return;
    }
    navigate(localePath(`/pokedex?type=${t}`));
  };

  return (
    <section className="mx-auto max-w-content overflow-x-clip px-4 py-24 md:px-8">
      <Reveal className="mb-12 flex flex-col items-center gap-4 text-center">
        <span className="pixel-label text-[14px] text-gold">{t8n('home.spectrum.eyebrow')}</span>
        <h2 className="font-display text-[clamp(1.5rem,3vw,36px)] font-extrabold leading-[1.15]">
          {t8n('home.spectrum.title')}
        </h2>
        <p className="max-w-[52ch] font-sans text-base text-tx-secondary">
          {t8n('home.spectrum.blurb')}
        </p>
      </Reveal>

      {/* desktop grid / mobile snap row */}
      <div className="flex w-full min-w-0 snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain pb-4 sm:grid sm:grid-cols-6 sm:overflow-visible sm:pb-0">
        {POKEMON_TYPES.map((t, i) => {
          const row = Math.floor(i / 6);
          const col = i % 6;
          const dist = Math.abs(row - 1) + Math.abs(col - 2.5);
          const lit = active === t;
          const rgb = TYPE_COLORS[t].rgb;
          return (
            <motion.button
              key={t}
              type="button"
              data-type={t}
              onClick={() => handlePick(t)}
              onMouseEnter={() => !COARSE() && setActive(t)}
              onMouseLeave={() => !COARSE() && setActive(null)}
              className={cn(
                'group relative flex h-24 w-24 shrink-0 snap-center flex-col items-center justify-center gap-2 rounded-md border sm:h-24 sm:w-auto',
                'transition-colors duration-300 focus-visible:border-[rgba(var(--t),0.8)]',
                lit ? 'border-[rgba(var(--t),0.6)]' : 'border-hairline bg-surface1',
              )}
              style={
                {
                  '--t': rgb,
                  background: lit ? `radial-gradient(circle at 50% 60%, rgba(${rgb},0.22), transparent 75%)` : undefined,
                  backgroundColor: lit ? undefined : undefined,
                } as React.CSSProperties
              }
              initial={{ scale: 0.6, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, margin: '-20% 0px' }}
              transition={{ duration: 0.5, delay: dist * 0.035, ease: EASE }}
            >
              {/* mini sprite trio pops above (desktop hover) */}
              <AnimatePresence>
                {lit && (
                  <div className="pointer-events-none absolute -top-14 left-1/2 z-20 hidden -translate-x-1/2 gap-1 sm:flex">
                    {TYPE_EXEMPLARS[t].map((id, j) => (
                      <motion.div
                        key={id}
                        initial={{ scale: 0, y: 8 }}
                        animate={{ scale: 1, y: [8, -4, 0] }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 420, damping: 30, delay: j * 0.06 }}
                      >
                        <Sprite id={id} name={nameOfType(t, lang)} era="gen5" skeleton={false} className="h-12 w-12" />
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>

              <motion.span
                animate={lit ? { scale: [1, 1.18, 0.96, 1], rotate: [0, -4, 3, 0] } : { scale: 1, rotate: 0 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  'transition-all duration-300',
                  lit
                    ? 'text-[rgb(var(--t))] opacity-100 drop-shadow-[0_0_12px_rgba(var(--t),0.8)]'
                    : 'text-tx-secondary opacity-35 grayscale',
                )}
                style={{ '--t': rgb } as React.CSSProperties}
              >
                <TypeGlyph type={t} size={32} />
              </motion.span>
              <span
                className={cn(
                  'pixel-label text-[9px] transition-colors duration-300',
                  lit ? 'text-[rgb(var(--t))]' : 'text-tx-muted',
                )}
                style={{ '--t': rgb } as React.CSSProperties}
              >
                {t}
              </span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
