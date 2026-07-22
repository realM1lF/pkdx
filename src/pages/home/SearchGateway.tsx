/* Search Gateway — "FIND YOUR POKÉMON" (home.md §2). */
import { useTranslation } from 'react-i18next';
import { LocaleLink } from '@/lib/locale-link';
import { nameOfType, useLanguage } from '@/lib/i18n-data';
import { motion } from 'framer-motion';
import SearchCommand from '@/components/SearchCommand';
import TypeGlyph from '@/components/TypeGlyph';
import Reveal from './Reveal';
import { TYPE_COLORS } from '@/lib/types';
import type { PokemonType } from '@/lib/types';
import type { CSSProperties } from 'react';

const POPULAR: PokemonType[] = ['fire', 'water', 'grass', 'electric', 'psychic', 'dragon', 'ghost', 'fairy'];

export default function SearchGateway() {
  const { t } = useTranslation();
  const lang = useLanguage();
  return (
    <section id="search-gateway" className="relative bg-abyss pt-24 pb-12">
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(255,122,69,0.3), rgba(69,200,255,0.3), rgba(255,214,10,0.3), transparent)',
        }}
      />
      <Reveal className="mx-auto flex w-full max-w-[720px] flex-col items-center gap-6 px-4">
        <span className="pixel-label text-[10px] text-gold">{t('home.gateway.eyebrow')}</span>
        <h2 className="text-center font-display text-[clamp(24px,3vw,36px)] font-extrabold uppercase leading-[1.15]">
          {t('home.gateway.title')}
        </h2>

        <SearchCommand variant="inline" className="w-full" />

        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="pixel-label mr-1 text-[9px] text-tx-muted">{t('home.gateway.popular')}</span>
          {POPULAR.map((t, i) => (
            <motion.div
              key={t}
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, margin: '-10% 0px' }}
              transition={{ type: 'spring', stiffness: 420, damping: 30, delay: 0.15 + i * 0.04 }}
            >
              <LocaleLink
                to={`/pokedex?type=${t}`}
                data-type={t}
                className="inline-flex items-center gap-1.5 rounded-pill border border-hairline bg-surface2 px-3 py-1.5 font-sans text-xs font-semibold capitalize text-tx-secondary transition-all duration-200 ease-out-expo hover:-translate-y-0.5 hover:border-[rgba(var(--t),0.8)] hover:bg-[rgba(var(--t),0.18)] hover:text-[rgb(var(--t))] hover:shadow-[0_0_16px_rgba(var(--t),0.35)]"
                style={{ '--t': TYPE_COLORS[t].rgb } as CSSProperties}
              >
                <TypeGlyph type={t} size={16} />
                {nameOfType(t, lang)}
              </LocaleLink>
            </motion.div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
