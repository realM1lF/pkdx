/* TcgPanel — Pokémon detail tab: cards for this dex id. */
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import HonestyHint from '@/components/HonestyHint';
import { useLanguage } from '@/lib/i18n-data';
import { loadTcgCatalog } from '@/lib/tcgdex';
import { Panel } from './ui';
import { DEFAULT_TCG_FILTERS, type TcgCardSummary, type TcgFilterState } from '@/lib/tcg-types';
import TcgGrid from '../tcg/TcgGrid';
import '../tcg/tcg.css';

export default function TcgPanel({ dexId, pokemonName }: { dexId: number; pokemonName: string }) {
  const { t } = useTranslation();
  const lang = useLanguage();
  const [cards, setCards] = useState<TcgCardSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<TcgFilterState>(DEFAULT_TCG_FILTERS);

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

  const scopedCount = useMemo(
    () => cards.filter((c) => c.dexIds?.includes(dexId)).length,
    [cards, dexId],
  );

  return (
    <Panel eyebrow={t('tcg.eyebrow')} title={t('tcg.panelTitle', { name: pokemonName })} className="col-span-12">
      <div className="p-4 md:p-5">
        <HonestyHint show className="mb-4">
          {t('tcg.panelHint', { count: scopedCount })}
        </HonestyHint>
        <TcgGrid
          cards={cards}
          filters={filters}
          onFiltersChange={setFilters}
          dexScope={dexId}
          showDexFilter={false}
          loading={loading}
        />
      </div>
    </Panel>
  );
}
