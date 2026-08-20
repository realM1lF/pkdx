/* TcgPriceBlock — Cardmarket + TCGPlayer prices with plain labels and tooltips. */
import { ExternalLink, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import StatLabelTip from '@/components/StatLabelTip';
import type { TcgCardmarketPrices, TcgTcgplayerPriceRow, TcgTcgplayerPrices } from '@/lib/tcg-types';
import { tcgCardmarketUrl, tcgTcgplayerUrl } from '@/lib/tcg-types';
import { cn } from '@/lib/utils';

const TP_KEYS = ['normal', 'holofoil', 'reverseHolofoil', '1stEdition', '1stEditionHolofoil'] as const;

function fmt(v: number | null | undefined, unit: string) {
  if (v == null) return '—';
  return `${unit === 'USD' ? '$' : '€'}${v.toFixed(2)}`;
}

function Metric({
  label,
  tip,
  value,
  unit,
  highlight,
}: {
  label: string;
  tip: string;
  value: number | null | undefined;
  unit: string;
  highlight?: boolean;
}) {
  if (value == null) return null;
  return (
    <div
      className={cn(
        'flex flex-col gap-0.5 rounded-md border px-2.5 py-2',
        highlight ? 'border-gold/35 bg-gold/5' : 'border-hairline bg-surface2/60',
      )}
    >
      <span className={cn('font-display text-lg font-bold tabular-nums', highlight ? 'text-gold' : 'text-tx-primary')}>
        {fmt(value, unit)}
      </span>
      <StatLabelTip
        label={label}
        tip={tip}
        className="pixel-label text-[8px] text-tx-muted"
      />
    </div>
  );
}

function DetailMetric({
  label,
  tip,
  value,
  unit,
  shortLabel,
}: {
  label: string;
  tip: string;
  value: number | null | undefined;
  unit: string;
  shortLabel?: string;
}) {
  if (value == null) return null;
  return (
    <div className="min-w-0 rounded-md border border-hairline/80 bg-surface2/40 px-2 py-1.5">
      <div className="font-sans text-micro13 font-bold tabular-nums text-tx-primary">{fmt(value, unit)}</div>
      <StatLabelTip
        label={shortLabel ?? label}
        tip={tip}
        className="pixel-label mt-0.5 line-clamp-2 truncate text-[8px] text-tx-muted"
      />
    </div>
  );
}

function CmSection({
  title,
  prefix,
  cm,
  unit,
  t,
}: {
  title: string;
  prefix: 'normal' | 'holo';
  cm: TcgCardmarketPrices;
  unit: string;
  t: (k: string) => string;
}) {
  const keys =
    prefix === 'normal'
      ? (['low', 'trend', 'avg', 'avg1', 'avg7', 'avg30'] as const)
      : (['lowHolo', 'trendHolo', 'avgHolo', 'avg1Holo', 'avg7Holo', 'avg30Holo'] as const);
  const visible = keys.some((k) => cm[k] != null);
  if (!visible) return null;

  return (
    <div className="space-y-2">
      <h5 className="font-sans text-micro11 font-semibold text-tx-secondary">{title}</h5>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {keys.map((k) => (
          <DetailMetric
            key={k}
            label={t(`tcg.prices.${k}`)}
            shortLabel={t(`tcg.prices.short.${k}`)}
            tip={t(`tcg.prices.tip.${k}`)}
            value={cm[k]}
            unit={unit}
          />
        ))}
      </div>
    </div>
  );
}

function tpRowHasData(row: TcgTcgplayerPriceRow): boolean {
  return row.marketPrice != null || row.lowPrice != null || row.midPrice != null || row.highPrice != null;
}

function collectTpRows(tcgplayer?: TcgTcgplayerPrices): Array<{ key: (typeof TP_KEYS)[number]; row: TcgTcgplayerPriceRow }> {
  if (!tcgplayer) return [];
  const out: Array<{ key: (typeof TP_KEYS)[number]; row: TcgTcgplayerPriceRow }> = [];
  for (const key of TP_KEYS) {
    const row = tcgplayer[key];
    if (row && tpRowHasData(row)) out.push({ key, row });
  }
  return out;
}

export default function TcgPriceBlock({
  cardmarket,
  tcgplayer,
  lang,
  className,
  loading = false,
  onRefresh,
}: {
  cardmarket?: TcgCardmarketPrices;
  tcgplayer?: TcgTcgplayerPrices;
  lang: 'de' | 'en';
  className?: string;
  loading?: boolean;
  onRefresh?: () => void;
}) {
  const { t } = useTranslation();
  const unit = cardmarket?.unit ?? (lang === 'en' ? 'USD' : 'EUR');
  const tpRows = collectTpRows(tcgplayer);
  const hasCm = cardmarket && (cardmarket.low != null || cardmarket.trend != null || cardmarket.avg30 != null || cardmarket.lowHolo != null);
  const hasTp = lang === 'en' && tpRows.length > 0;
  const updated = cardmarket?.updated ?? tcgplayer?.updated;
  const cmUrl = tcgCardmarketUrl(cardmarket?.idProduct, lang);
  const tpUrl = tpRows[0]?.row.productId ? tcgTcgplayerUrl(tpRows[0].row.productId) : undefined;
  const hasIdProduct = cardmarket?.idProduct != null;

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="pixel-label text-[8px] text-gold">{t('tcg.prices.eyebrow')}</p>
          <p className="mt-1 font-sans text-micro12 leading-relaxed text-tx-secondary">{t('tcg.prices.intro')}</p>
        </div>
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-pill border border-hairline bg-surface2 px-2.5 py-1 font-sans text-micro11 font-semibold text-tx-secondary hover:border-gold/50 hover:text-gold disabled:opacity-50"
          >
            <RefreshCw size={12} className={cn(loading && 'animate-spin')} aria-hidden />
            {loading ? t('tcg.prices.refreshing') : t('tcg.refreshPrices')}
          </button>
        )}
      </div>

      <div className="rounded-md border border-hairline/80 bg-surface2/30 px-3 py-2">
        {hasIdProduct && cmUrl ? (
          <p className="font-sans text-micro11 text-tx-secondary">
            {t('tcg.prices.marketStatus.listed')}{' '}
            <a href={cmUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-gold hover:underline">
              {t('tcg.prices.marketStatus.productPage')}
              <ExternalLink size={10} className="ml-0.5 inline" aria-hidden />
            </a>
          </p>
        ) : (
          <p className="font-sans text-micro11 text-tx-muted">{t('tcg.prices.marketStatus.noData')}</p>
        )}
      </div>

      {loading && !hasCm && !hasTp ? (
        <p className="font-sans text-micro12 text-tx-muted">{t('tcg.prices.refreshing')}</p>
      ) : !hasCm && !hasTp ? (
        <p className="font-sans text-micro12 text-tx-muted">{t('tcg.prices.none')}</p>
      ) : (
        <>
          {hasCm && cardmarket && (
            <>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <Metric
                  highlight
                  label={t('tcg.prices.low')}
                  tip={t('tcg.prices.tip.low')}
                  value={cardmarket.low}
                  unit={unit}
                />
                <Metric
                  label={t('tcg.prices.trend')}
                  tip={t('tcg.prices.tip.trend')}
                  value={cardmarket.trend}
                  unit={unit}
                />
                <Metric
                  label={t('tcg.prices.avg30')}
                  tip={t('tcg.prices.tip.avg30')}
                  value={cardmarket.avg30}
                  unit={unit}
                />
              </div>

              <details className="group rounded-md border border-hairline bg-surface2/30 open:bg-surface2/50">
                <summary className="cursor-pointer list-none px-3 py-2 font-sans text-micro12 font-semibold text-tx-secondary marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="text-gold group-open:text-tx-secondary">{t('tcg.prices.showAllCm')}</span>
                </summary>
                <div className="space-y-3 border-t border-hairline px-3 py-3">
                  <CmSection title={t('tcg.prices.sectionNormal')} prefix="normal" cm={cardmarket} unit={unit} t={t} />
                  <CmSection title={t('tcg.prices.sectionHolo')} prefix="holo" cm={cardmarket} unit={unit} t={t} />
                </div>
              </details>
            </>
          )}

          {hasTp && (
            <div className="space-y-3">
              <h4 className="pixel-label text-[8px] text-gold">{t('tcg.prices.tcgplayer')}</h4>
              {tpRows.map(({ key, row }) => (
                <div key={key} className="rounded-md border border-hairline bg-surface2/50 p-3">
                  <p className="mb-2 font-sans text-micro11 font-semibold text-tx-secondary">
                    {t(`tcg.prices.tpRow.${key}`)}
                  </p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    <DetailMetric label={t('tcg.prices.market')} shortLabel={t('tcg.prices.short.market')} tip={t('tcg.prices.tip.market')} value={row.marketPrice} unit="USD" />
                    <DetailMetric label={t('tcg.prices.low')} shortLabel={t('tcg.prices.short.low')} tip={t('tcg.prices.tip.tpLow')} value={row.lowPrice} unit="USD" />
                    <DetailMetric label={t('tcg.prices.mid')} shortLabel={t('tcg.prices.short.mid')} tip={t('tcg.prices.tip.mid')} value={row.midPrice} unit="USD" />
                    <DetailMetric label={t('tcg.prices.high')} shortLabel={t('tcg.prices.short.high')} tip={t('tcg.prices.tip.high')} value={row.highPrice} unit="USD" />
                    <DetailMetric label={t('tcg.prices.directLow')} shortLabel={t('tcg.prices.short.directLow')} tip={t('tcg.prices.tip.directLow')} value={row.directLowPrice} unit="USD" />
                  </div>
                  {row.productId && (
                    <a
                      href={tcgTcgplayerUrl(row.productId)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 font-sans text-micro11 font-semibold text-gold hover:underline"
                    >
                      {t('tcg.openTcgplayer')}
                      <ExternalLink size={10} aria-hidden />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {(cmUrl || tpUrl) && (
        <div className="flex flex-wrap gap-2">
          {cmUrl && (
            <a
              href={cmUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-pill border border-gold/40 bg-gold/10 px-3 py-1.5 font-sans text-micro12 font-semibold text-gold hover:border-gold/70"
            >
              {t('tcg.openCardmarket')}
              <ExternalLink size={12} aria-hidden />
            </a>
          )}
          {tpUrl && tpRows.length <= 1 && (
            <a
              href={tpUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-pill border border-hairline bg-surface2 px-3 py-1.5 font-sans text-micro12 font-semibold text-tx-primary hover:border-gold/50 hover:text-gold"
            >
              {t('tcg.openTcgplayer')}
              <ExternalLink size={12} aria-hidden />
            </a>
          )}
        </div>
      )}

      {updated && (
        <p className="font-sans text-micro10 text-tx-muted">
          {t('tcg.priceUpdated', {
            date: new Date(updated).toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-US'),
            sources: lang === 'en' && hasTp ? t('tcg.priceSourcesCmTp') : t('tcg.priceSourcesCm'),
          })}
        </p>
      )}

      {onRefresh && (
        <p className="font-sans text-micro10 text-tx-muted">{t('tcg.refreshPricesHint')}</p>
      )}
    </div>
  );
}
