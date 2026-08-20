/* TcgGrid — filtered card grid + modal (shared by catalog + pokemon tab). */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PokeballLoader from '@/components/PokeballLoader';
import TcgCardModal, { useTcgModal } from '@/components/tcg/TcgCardModal';
import TcgCardTile from '@/components/tcg/TcgCardTile';
import HonestyHint from '@/components/HonestyHint';
import { useLanguage } from '@/lib/i18n-data';
import { buildTcgParams } from '@/lib/tcg-filters';
import {
  TCG_INITIAL,
  TCG_MAX_RENDER,
  TCG_STEP,
  tcgCanLoadMore,
  tcgVisibleLimit,
} from '@/lib/tcg-grid';
import { queryTcgCards } from '@/lib/tcg-search';
import type { TcgCardSummary, TcgFilterState } from '@/lib/tcg-types';
import { cn } from '@/lib/utils';
import TcgCommandBar from './TcgCommandBar';

export default function TcgGrid({
  cards,
  filters,
  onFiltersChange,
  dexScope,
  showDexFilter = true,
  loading = false,
}: {
  cards: TcgCardSummary[];
  filters: TcgFilterState;
  onFiltersChange: (f: TcgFilterState) => void;
  dexScope?: number;
  showDexFilter?: boolean;
  loading?: boolean;
}) {
  const { t } = useTranslation();
  const lang = useLanguage();
  const modal = useTcgModal();
  const [visible, setVisible] = useState(TCG_INITIAL);
  const [debouncedQ, setDebouncedQ] = useState(filters.q);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQ(filters.q), 120);
    return () => window.clearTimeout(timer);
  }, [filters.q]);

  const queryFilters = useMemo(() => ({ ...filters, q: debouncedQ }), [filters, debouncedQ]);

  const resetSig = `${buildTcgParams(queryFilters).toString()}|${dexScope ?? ''}`;
  const prevSig = useRef(resetSig);
  useEffect(() => {
    if (prevSig.current !== resetSig) {
      prevSig.current = resetSig;
      setVisible(TCG_INITIAL);
      if (window.scrollY > 240) window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, [resetSig]);

  const results = useMemo(
    () => queryTcgCards(cards, queryFilters, lang, dexScope),
    [cards, queryFilters, lang, dexScope],
  );

  const total = results.length;
  const visibleLimit = tcgVisibleLimit(total, visible);
  const shown = results.slice(0, visibleLimit);
  const hasMore = tcgCanLoadMore(total, visibleLimit);
  const capped = visibleLimit >= TCG_MAX_RENDER && total > TCG_MAX_RENDER;

  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible((v) => Math.min(v + TCG_STEP, TCG_MAX_RENDER));
        }
      },
      { rootMargin: '600px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, total, visibleLimit]);

  return (
    <>
      <TcgCommandBar
        allCards={cards}
        filters={filters}
        onChange={onFiltersChange}
        resultCount={results.length}
        showDexFilter={showDexFilter}
      />

      {loading ? (
        <div className="flex h-48 flex-col items-center justify-center gap-3">
          <PokeballLoader variant="inline" />
          <span className="pixel-label text-[9px] text-tx-muted">{t('tcg.loading')}</span>
        </div>
      ) : results.length === 0 ? (
        <div className="dx-panel flex flex-col items-center gap-2 px-4 py-12 text-center">
          <HonestyHint show tone="gold">
            {t('tcg.noResults')}
          </HonestyHint>
        </div>
      ) : (
        <>
          <div className={cn(filters.density === 'list' ? 'tcg-grid-list' : 'tcg-grid-compact')}>
            {shown.map((card, i) => (
              <TcgCardTile
                key={card.id}
                card={card}
                lang={lang}
                density={filters.density}
                index={i}
                animate={i < 12}
                imageQuality="low"
                onClick={() => modal.open(card)}
              />
            ))}
          </div>
          {capped && (
            <p className="mt-4 text-center font-sans text-micro11 text-tx-muted">{t('tcg.renderCap', { max: TCG_MAX_RENDER })}</p>
          )}
          {hasMore && (
            <>
              <div ref={sentinelRef} className="h-1" aria-hidden />
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisible((v) => Math.min(v + TCG_STEP, TCG_MAX_RENDER))}
                  className="rounded-pill border border-hairline bg-surface2 px-4 py-2 font-sans text-micro13 font-semibold text-gold hover:border-gold/50"
                >
                  {t('tcg.loadMore', { count: Math.min(total - visibleLimit, TCG_STEP) })}
                </button>
              </div>
            </>
          )}
        </>
      )}

      <TcgCardModal {...modal.props} />
    </>
  );
}
