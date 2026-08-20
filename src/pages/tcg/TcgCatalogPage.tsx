/* /tcg — global TCG card catalog. */
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { motion } from 'framer-motion';
import { Layers } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import MotionRoot from '@/components/MotionRoot';
import HonestyHint from '@/components/HonestyHint';
import { useLanguage } from '@/lib/i18n-data';
import { parseTcgParams, buildTcgParams } from '@/lib/tcg-filters';
import { loadTcgCatalog } from '@/lib/tcgdex';
import type { TcgCardSummary, TcgFilterState } from '@/lib/tcg-types';
import TcgGrid from './TcgGrid';
import './tcg.css';

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];
const reveal = (i: number) => ({
  initial: { opacity: 0, y: 40, filter: 'blur(8px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  transition: { duration: 0.6, ease: EASE, delay: i * 0.06 },
});

export default function TcgCatalogPage() {
  const { t } = useTranslation();
  const lang = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [cards, setCards] = useState<TcgCardSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<TcgFilterState>(() => parseTcgParams(searchParams));

  useEffect(() => {
    let on = true;
    setLoading(true);
    loadTcgCatalog(lang)
      .then((artifact) => {
        if (on) setCards(artifact.cards);
      })
      .finally(() => {
        if (on) setLoading(false);
      });
    return () => {
      on = false;
    };
  }, [lang]);

  useEffect(() => {
    setFilters(parseTcgParams(searchParams));
  }, [searchParams]);

  const updateFilters = (f: TcgFilterState) => {
    setFilters(f);
    setSearchParams(buildTcgParams(f), { replace: true });
  };

  return (
    <MotionRoot>
      <div className="relative pb-16">
        <header className="mx-auto flex max-w-content flex-wrap items-end justify-between gap-6 px-4 pb-8 pt-12 sm:px-8">
          <div className="max-w-[37.5rem]">
            <motion.p {...reveal(0)} className="pixel-label text-[14px] text-gold">
              {t('tcg.eyebrow')}
            </motion.p>
            <motion.h1 {...reveal(1)} className="mt-3 font-display text-[clamp(2rem,4.5vw,52px)] font-extrabold leading-[1.1] text-tx-primary">
              {t('tcg.title')}
            </motion.h1>
            <motion.p {...reveal(2)} className="mt-3 max-w-[35rem] text-[0.875rem] font-medium leading-relaxed text-tx-secondary">
              {t('tcg.blurb')}
            </motion.p>
          </div>
          <motion.div {...reveal(3)} className="hidden items-center gap-2 text-micro12 font-medium text-tx-muted md:flex">
            <Layers size={13} className="text-gold" />
            <span className="font-display text-[0.875rem] font-bold tabular-nums text-tx-primary">{cards.length}</span>
            {t('tcg.total')}
          </motion.div>
        </header>

        <div className="mx-auto max-w-content px-4 sm:px-8">
          <HonestyHint show className="mb-4">
            {t('tcg.disclaimer')}
          </HonestyHint>
          <TcgGrid cards={cards} filters={filters} onFiltersChange={updateFilters} loading={loading} showDexFilter />
        </div>
      </div>
    </MotionRoot>
  );
}
