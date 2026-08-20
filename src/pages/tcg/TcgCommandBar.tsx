/* TcgCommandBar — sticky filter row (CommandBar DNA). */
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Grid2X2, Rows3, RotateCcw, Search, SlidersHorizontal, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { MicroChip } from '@/pages/detail/ui';
import { useLanguage } from '@/lib/i18n-data';
import { tcgFacets } from '@/lib/tcg-search';
import { tcgFilterActiveCount, buildTcgFilterChips } from '@/lib/tcg-filters';
import type { TcgCardSummary, TcgFilterState, TcgSortKey } from '@/lib/tcg-types';
import { DEFAULT_TCG_FILTERS } from '@/lib/tcg-types';
import { cn } from '@/lib/utils';

const SORT_KEYS: TcgSortKey[] = ['release', 'price-desc', 'price-asc', 'set', 'number', 'name', 'rarity'];

function RangeInput({
  label,
  min,
  max,
  onMin,
  onMax,
}: {
  label: string;
  min: number | null;
  max: number | null;
  onMin: (v: number | null) => void;
  onMax: (v: number | null) => void;
}) {
  return (
    <div className="space-y-1">
      <span className="font-sans text-micro11 font-semibold text-tx-secondary">{label}</span>
      <div className="flex gap-2">
        <input
          type="number"
          min={0}
          step={0.01}
          value={min ?? ''}
          onChange={(e) => onMin(e.target.value === '' ? null : Number(e.target.value))}
          placeholder="min"
          className="h-8 w-full rounded-md border border-hairline bg-surface2 px-2 font-sans text-micro12 tabular-nums text-tx-primary"
        />
        <input
          type="number"
          min={0}
          step={0.01}
          value={max ?? ''}
          onChange={(e) => onMax(e.target.value === '' ? null : Number(e.target.value))}
          placeholder="max"
          className="h-8 w-full rounded-md border border-hairline bg-surface2 px-2 font-sans text-micro12 tabular-nums text-tx-primary"
        />
      </div>
    </div>
  );
}

export default function TcgCommandBar({
  allCards,
  filters,
  onChange,
  resultCount,
  showDexFilter,
}: {
  allCards: TcgCardSummary[];
  filters: TcgFilterState;
  onChange: (f: TcgFilterState) => void;
  resultCount: number;
  showDexFilter: boolean;
}) {
  const { t } = useTranslation();
  const lang = useLanguage();
  const [drawer, setDrawer] = useState(false);
  const [draft, setDraft] = useState(filters);
  const btnRef = useRef<HTMLButtonElement>(null);
  const facets = useMemo(() => tcgFacets(allCards), [allCards]);
  const active = tcgFilterActiveCount(filters);

  useEffect(() => {
    if (drawer) setDraft(filters);
  }, [drawer, filters]);

  const patch = (partial: Partial<TcgFilterState>) => onChange({ ...filters, ...partial });

  const applyDraft = () => {
    onChange(draft);
    setDrawer(false);
  };

  const chips = useMemo(
    () => buildTcgFilterChips(filters, facets, t, lang, showDexFilter),
    [filters, facets, t, lang, showDexFilter],
  );

  return (
    <div className="sticky top-16 z-30 mb-4 space-y-2 border-b border-hairline bg-void/95 py-3 backdrop-blur-md md:top-[6.5rem]">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[12rem] flex-1">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-tx-muted" />
          <input
            value={filters.q}
            onChange={(e) => patch({ q: e.target.value })}
            placeholder={t('tcg.searchPlaceholder')}
            aria-label={t('tcg.searchPlaceholder')}
            className="h-10 w-full rounded-md border border-hairline bg-surface2 pl-9 pr-3 font-sans text-sm text-tx-primary placeholder:text-tx-muted focus:border-gold/50 focus:outline-none"
          />
        </div>

        <select
          value={filters.sort}
          onChange={(e) => patch({ sort: e.target.value as TcgSortKey })}
          aria-label={t('tcg.sort')}
          title={filters.sort === 'price-desc' ? t('tcg.sort.priceDescHint') : undefined}
          className="h-10 rounded-md border border-hairline bg-surface2 px-2 font-sans text-micro12 text-tx-primary"
        >
          {SORT_KEYS.map((k) => (
            <option key={k} value={k}>
              {t(`tcg.sort.${k}`)}
            </option>
          ))}
        </select>

        <div className="flex shrink-0 items-center gap-0.5 rounded-pill border border-hairline bg-surface1 p-0.5">
          {(['compact', 'list'] as const).map((d) => (
            <button
              key={d}
              type="button"
              aria-pressed={filters.density === d}
              onClick={() => patch({ density: d })}
              className={cn(
                'grid h-8 w-8 place-items-center rounded-pill',
                filters.density === d ? 'text-gold' : 'text-tx-muted hover:text-tx-primary',
              )}
            >
              {d === 'compact' ? <Grid2X2 size={14} /> : <Rows3 size={14} />}
            </button>
          ))}
        </div>

        <button
          ref={btnRef}
          type="button"
          onClick={() => setDrawer(true)}
          className={cn(
            'inline-flex h-10 items-center gap-1.5 rounded-md border border-hairline bg-surface2 px-3 font-sans text-micro12 font-semibold text-tx-secondary hover:border-gold/50',
            active > 0 && 'border-gold/40 text-gold',
          )}
        >
          <SlidersHorizontal size={14} />
          {t('tcg.filters')}
          {active > 0 && <span className="rounded-pill bg-gold/20 px-1.5 text-[10px] tabular-nums">{active}</span>}
        </button>

        <span className="pixel-label hidden text-[8px] text-tx-muted sm:inline">
          {t('tcg.resultCount', { count: resultCount })}
        </span>
      </div>

      {chips.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5">
          {chips.map((c) => (
            <MicroChip key={c.key} active onClick={() => onChange(c.clear(filters))} className="gap-1 !pr-1">
              {c.label}
              <X size={10} />
            </MicroChip>
          ))}
          <button
            type="button"
            onClick={() => onChange({ ...DEFAULT_TCG_FILTERS, q: filters.q, sort: filters.sort, density: filters.density })}
            className="inline-flex items-center gap-1 font-sans text-micro11 text-tx-muted hover:text-gold"
          >
            <RotateCcw size={11} />
            {t('tcg.resetFilters')}
          </button>
        </div>
      )}

      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {drawer && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[85] bg-void/60 backdrop-blur-sm"
                onClick={() => setDrawer(false)}
              >
                <motion.aside
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                  className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-hairline bg-surface1 shadow-elevate"
                  onClick={(e) => e.stopPropagation()}
                  data-lenis-prevent
                >
                  <header className="flex items-center justify-between border-b border-hairline px-4 py-3">
                    <span className="pixel-label text-[9px] text-gold">{t('tcg.filters')}</span>
                    <button type="button" onClick={() => setDrawer(false)} aria-label={t('desc.close')}>
                      <X size={16} className="text-tx-muted hover:text-gold" />
                    </button>
                  </header>
                  <div className="tcg-filter-drawer flex-1 overflow-y-auto px-4 py-3 dx-scroll space-y-4">
                    <details open className="rounded-md border border-hairline bg-surface2/30">
                      <summary className="cursor-pointer px-3 py-2 font-sans text-micro12 font-semibold text-tx-secondary">{t('tcg.filter.cardDetails')}</summary>
                      <div className="space-y-4 border-t border-hairline px-3 py-3">
                    <label className="block space-y-1">
                      <span className="font-sans text-micro11 font-semibold text-tx-secondary">{t('tcg.filter.set')}</span>
                      <select
                        value={draft.setId ?? ''}
                        onChange={(e) => setDraft({ ...draft, setId: e.target.value || null })}
                        className="h-9 w-full rounded-md border border-hairline bg-surface2 px-2 text-micro12"
                      >
                        <option value="">{t('tcg.filter.any')}</option>
                        {facets.sets.map(([id, name]) => (
                          <option key={id} value={id}>{name}</option>
                        ))}
                      </select>
                    </label>
                    <label className="block space-y-1">
                      <span className="font-sans text-micro11 font-semibold text-tx-secondary">{t('tcg.filter.series')}</span>
                      <select
                        value={draft.seriesId ?? ''}
                        onChange={(e) => setDraft({ ...draft, seriesId: e.target.value || null })}
                        className="h-9 w-full rounded-md border border-hairline bg-surface2 px-2 text-micro12"
                      >
                        <option value="">{t('tcg.filter.any')}</option>
                        {facets.series.map(([id, name]) => (
                          <option key={id} value={id}>{name}</option>
                        ))}
                      </select>
                    </label>
                    <label className="block space-y-1">
                      <span className="font-sans text-micro11 font-semibold text-tx-secondary">{t('tcg.filter.rarity')}</span>
                      <select
                        multiple
                        value={draft.rarities}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            rarities: [...e.target.selectedOptions].map((o) => o.value),
                          })
                        }
                        className="min-h-[5rem] w-full rounded-md border border-hairline bg-surface2 px-2 py-1 text-micro12"
                      >
                        {facets.rarities.map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </label>
                    <label className="block space-y-1">
                      <span className="font-sans text-micro11 font-semibold text-tx-secondary">{t('tcg.filter.category')}</span>
                      <select
                        value={draft.category ?? ''}
                        onChange={(e) => setDraft({ ...draft, category: e.target.value || null })}
                        className="h-9 w-full rounded-md border border-hairline bg-surface2 px-2 text-micro12"
                      >
                        <option value="">{t('tcg.filter.any')}</option>
                        {facets.categories.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </label>
                    {showDexFilter && (
                      <label className="block space-y-1">
                        <span className="font-sans text-micro11 font-semibold text-tx-secondary">{t('tcg.filter.dex')}</span>
                        <input
                          type="number"
                          min={1}
                          max={1025}
                          value={draft.dexId ?? ''}
                          onChange={(e) => setDraft({ ...draft, dexId: e.target.value === '' ? null : Number(e.target.value) })}
                          className="h-9 w-full rounded-md border border-hairline bg-surface2 px-2 text-micro12"
                        />
                      </label>
                    )}
                    <div className="space-y-2">
                      <span className="font-sans text-micro11 font-semibold text-tx-secondary">{t('tcg.filter.variants')}</span>
                      <div className="flex flex-wrap gap-1.5">
                        {([
                          ['variantNormal', 'vn'],
                          ['variantHolo', 'vh'],
                          ['variantReverse', 'vr'],
                          ['variantFirstEdition', 'vfe'],
                        ] as const).map(([key, labelKey]) => (
                          <MicroChip
                            key={key}
                            active={draft[key]}
                            onClick={() => setDraft({ ...draft, [key]: !draft[key] })}
                          >
                            {t(`tcg.filter.${labelKey}`)}
                          </MicroChip>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <RangeInput label={t('tcg.filter.hp')} min={draft.hpMin} max={draft.hpMax} onMin={(v) => setDraft({ ...draft, hpMin: v })} onMax={(v) => setDraft({ ...draft, hpMax: v })} />
                    </div>
                    <label className="block space-y-1">
                      <span className="font-sans text-micro11 font-semibold text-tx-secondary">{t('tcg.filter.stage')}</span>
                      <select
                        multiple
                        value={draft.stages}
                        onChange={(e) => setDraft({ ...draft, stages: [...e.target.selectedOptions].map((o) => o.value) })}
                        className="min-h-[4rem] w-full rounded-md border border-hairline bg-surface2 px-2 py-1 text-micro12"
                      >
                        {facets.stages.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </label>
                    <label className="block space-y-1">
                      <span className="font-sans text-micro11 font-semibold text-tx-secondary">{t('tcg.filter.types')}</span>
                      <select
                        multiple
                        value={draft.types}
                        onChange={(e) => setDraft({ ...draft, types: [...e.target.selectedOptions].map((o) => o.value) })}
                        className="min-h-[4rem] w-full rounded-md border border-hairline bg-surface2 px-2 py-1 text-micro12"
                      >
                        {facets.types.map((ty) => (
                          <option key={ty} value={ty}>{ty}</option>
                        ))}
                      </select>
                    </label>
                    <label className="block space-y-1">
                      <span className="font-sans text-micro11 font-semibold text-tx-secondary">{t('tcg.filter.regulation')}</span>
                      <select
                        value={draft.regulationMark ?? ''}
                        onChange={(e) => setDraft({ ...draft, regulationMark: e.target.value || null })}
                        className="h-9 w-full rounded-md border border-hairline bg-surface2 px-2 text-micro12"
                      >
                        <option value="">{t('tcg.filter.any')}</option>
                        {facets.regulationMarks.map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </label>
                    <div className="space-y-2">
                      <span className="font-sans text-micro11 font-semibold text-tx-secondary">{t('tcg.filter.legal')}</span>
                      <div className="flex flex-wrap gap-1.5">
                        <MicroChip active={draft.legalStandard} onClick={() => setDraft({ ...draft, legalStandard: !draft.legalStandard })}>
                          {t('tcg.filter.std')}
                        </MicroChip>
                        <MicroChip active={draft.legalExpanded} onClick={() => setDraft({ ...draft, legalExpanded: !draft.legalExpanded })}>
                          {t('tcg.filter.exp')}
                        </MicroChip>
                      </div>
                    </div>
                    <label className="block space-y-1">
                      <span className="font-sans text-micro11 font-semibold text-tx-secondary">{t('tcg.filter.illustrator')}</span>
                      <input
                        list="tcg-illustrators"
                        value={draft.illustrator ?? ''}
                        onChange={(e) => setDraft({ ...draft, illustrator: e.target.value || null })}
                        className="h-9 w-full rounded-md border border-hairline bg-surface2 px-2 text-micro12"
                      />
                      <datalist id="tcg-illustrators">
                        {facets.illustrators.map((a) => (
                          <option key={a} value={a} />
                        ))}
                      </datalist>
                    </label>
                      </div>
                    </details>
                    <details className="rounded-md border border-hairline bg-surface2/30">
                      <summary className="cursor-pointer px-3 py-2 font-sans text-micro12 font-semibold text-tx-secondary">{t('tcg.filter.cmPrices')}</summary>
                      <div className="grid grid-cols-2 gap-2 border-t border-hairline px-3 py-3">
                      <RangeInput label={t('tcg.prices.low')} min={draft.cmLow.min ?? null} max={draft.cmLow.max ?? null} onMin={(v) => setDraft({ ...draft, cmLow: { ...draft.cmLow, min: v } })} onMax={(v) => setDraft({ ...draft, cmLow: { ...draft.cmLow, max: v } })} />
                      <RangeInput label={t('tcg.prices.trend')} min={draft.cmTrend.min ?? null} max={draft.cmTrend.max ?? null} onMin={(v) => setDraft({ ...draft, cmTrend: { ...draft.cmTrend, min: v } })} onMax={(v) => setDraft({ ...draft, cmTrend: { ...draft.cmTrend, max: v } })} />
                      <RangeInput label={t('tcg.prices.avg')} min={draft.cmAvg.min ?? null} max={draft.cmAvg.max ?? null} onMin={(v) => setDraft({ ...draft, cmAvg: { ...draft.cmAvg, min: v } })} onMax={(v) => setDraft({ ...draft, cmAvg: { ...draft.cmAvg, max: v } })} />
                      <RangeInput label={t('tcg.prices.avg1')} min={draft.cmAvg1.min ?? null} max={draft.cmAvg1.max ?? null} onMin={(v) => setDraft({ ...draft, cmAvg1: { ...draft.cmAvg1, min: v } })} onMax={(v) => setDraft({ ...draft, cmAvg1: { ...draft.cmAvg1, max: v } })} />
                      <RangeInput label={t('tcg.prices.avg7')} min={draft.cmAvg7.min ?? null} max={draft.cmAvg7.max ?? null} onMin={(v) => setDraft({ ...draft, cmAvg7: { ...draft.cmAvg7, min: v } })} onMax={(v) => setDraft({ ...draft, cmAvg7: { ...draft.cmAvg7, max: v } })} />
                      <RangeInput label={t('tcg.prices.avg30')} min={draft.cmAvg30.min ?? null} max={draft.cmAvg30.max ?? null} onMin={(v) => setDraft({ ...draft, cmAvg30: { ...draft.cmAvg30, min: v } })} onMax={(v) => setDraft({ ...draft, cmAvg30: { ...draft.cmAvg30, max: v } })} />
                      <RangeInput label={t('tcg.prices.lowHolo')} min={draft.cmLowHolo.min ?? null} max={draft.cmLowHolo.max ?? null} onMin={(v) => setDraft({ ...draft, cmLowHolo: { ...draft.cmLowHolo, min: v } })} onMax={(v) => setDraft({ ...draft, cmLowHolo: { ...draft.cmLowHolo, max: v } })} />
                      <RangeInput label={t('tcg.prices.trendHolo')} min={draft.cmTrendHolo.min ?? null} max={draft.cmTrendHolo.max ?? null} onMin={(v) => setDraft({ ...draft, cmTrendHolo: { ...draft.cmTrendHolo, min: v } })} onMax={(v) => setDraft({ ...draft, cmTrendHolo: { ...draft.cmTrendHolo, max: v } })} />
                      <RangeInput label={t('tcg.prices.avgHolo')} min={draft.cmAvgHolo.min ?? null} max={draft.cmAvgHolo.max ?? null} onMin={(v) => setDraft({ ...draft, cmAvgHolo: { ...draft.cmAvgHolo, min: v } })} onMax={(v) => setDraft({ ...draft, cmAvgHolo: { ...draft.cmAvgHolo, max: v } })} />
                      <RangeInput label={t('tcg.prices.avg1Holo')} min={draft.cmAvg1Holo.min ?? null} max={draft.cmAvg1Holo.max ?? null} onMin={(v) => setDraft({ ...draft, cmAvg1Holo: { ...draft.cmAvg1Holo, min: v } })} onMax={(v) => setDraft({ ...draft, cmAvg1Holo: { ...draft.cmAvg1Holo, max: v } })} />
                      <RangeInput label={t('tcg.prices.avg7Holo')} min={draft.cmAvg7Holo.min ?? null} max={draft.cmAvg7Holo.max ?? null} onMin={(v) => setDraft({ ...draft, cmAvg7Holo: { ...draft.cmAvg7Holo, min: v } })} onMax={(v) => setDraft({ ...draft, cmAvg7Holo: { ...draft.cmAvg7Holo, max: v } })} />
                      <RangeInput label={t('tcg.prices.avg30Holo')} min={draft.cmAvg30Holo.min ?? null} max={draft.cmAvg30Holo.max ?? null} onMin={(v) => setDraft({ ...draft, cmAvg30Holo: { ...draft.cmAvg30Holo, min: v } })} onMax={(v) => setDraft({ ...draft, cmAvg30Holo: { ...draft.cmAvg30Holo, max: v } })} />
                      </div>
                    </details>
                    {lang === 'en' && (
                      <details className="rounded-md border border-hairline bg-surface2/30">
                        <summary className="cursor-pointer px-3 py-2 font-sans text-micro12 font-semibold text-tx-secondary">{t('tcg.filter.tpPrices')}</summary>
                        <div className="grid grid-cols-2 gap-2 border-t border-hairline px-3 py-3">
                          <RangeInput label={t('tcg.prices.market')} min={draft.tpMarket.min ?? null} max={draft.tpMarket.max ?? null} onMin={(v) => setDraft({ ...draft, tpMarket: { ...draft.tpMarket, min: v } })} onMax={(v) => setDraft({ ...draft, tpMarket: { ...draft.tpMarket, max: v } })} />
                          <RangeInput label={t('tcg.prices.low')} min={draft.tpLow.min ?? null} max={draft.tpLow.max ?? null} onMin={(v) => setDraft({ ...draft, tpLow: { ...draft.tpLow, min: v } })} onMax={(v) => setDraft({ ...draft, tpLow: { ...draft.tpLow, max: v } })} />
                          <RangeInput label={t('tcg.prices.mid')} min={draft.tpMid.min ?? null} max={draft.tpMid.max ?? null} onMin={(v) => setDraft({ ...draft, tpMid: { ...draft.tpMid, min: v } })} onMax={(v) => setDraft({ ...draft, tpMid: { ...draft.tpMid, max: v } })} />
                          <RangeInput label={t('tcg.prices.high')} min={draft.tpHigh.min ?? null} max={draft.tpHigh.max ?? null} onMin={(v) => setDraft({ ...draft, tpHigh: { ...draft.tpHigh, min: v } })} onMax={(v) => setDraft({ ...draft, tpHigh: { ...draft.tpHigh, max: v } })} />
                        </div>
                      </details>
                    )}
                  </div>
                  <footer className="flex gap-2 border-t border-hairline p-4">
                    <button
                      type="button"
                      onClick={() => setDraft(DEFAULT_TCG_FILTERS)}
                      className="flex-1 rounded-md border border-hairline py-2 font-sans text-micro12 font-semibold text-tx-secondary"
                    >
                      {t('tcg.resetFilters')}
                    </button>
                    <button
                      type="button"
                      onClick={applyDraft}
                      className="flex-1 rounded-md border border-gold/50 bg-gold/10 py-2 font-sans text-micro12 font-semibold text-gold"
                    >
                      {t('tcg.applyFilters')}
                    </button>
                  </footer>
                </motion.aside>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}
