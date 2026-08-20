/* TcgCardTile — compact/list grid tile (PokemonCard compact DNA). */
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import TcgCardImage from '@/components/tcg/TcgCardImage';
import { MicroChip } from '@/pages/detail/ui';
import type { Lang } from '@/lib/i18n-data';
import type { TcgCardSummary, TcgDensity } from '@/lib/tcg-types';
import { tcgBestMarketPrice, tcgPrimaryPrice, tcgSecondaryPrices } from '@/lib/tcg-types';
import { cn } from '@/lib/utils';

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

function fmtPrice(v: number | null, lang: Lang) {
  if (v == null) return '—';
  return lang === 'en' ? `$${v.toFixed(2)}` : `€${v.toFixed(2)}`;
}

export default function TcgCardTile({
  card,
  lang,
  density,
  index = 0,
  animate = true,
  imageQuality = 'high',
  onClick,
}: {
  card: TcgCardSummary;
  lang: Lang;
  density: TcgDensity;
  index?: number;
  animate?: boolean;
  imageQuality?: 'high' | 'low';
  onClick: () => void;
}) {
  const { t } = useTranslation();
  const primary = tcgBestMarketPrice(card, lang) ?? tcgPrimaryPrice(card, lang);
  const sec = tcgSecondaryPrices(card, lang);
  const list = density === 'list';
  const hasCm = card.pricing.cardmarket && (card.pricing.cardmarket.low != null || card.pricing.cardmarket.trend != null);
  const hasTp = lang === 'en' && card.pricing.tcgplayer != null;

  const body = (
    <>
      <TcgCardImage card={card} lang={lang} preferLow={imageQuality === 'low'} />
      <div className={cn('min-w-0', list ? 'py-0.5' : 'mt-2')}>
        <div className="truncate font-sans text-micro13 font-semibold text-tx-primary">{card.name}</div>
        <div className="pixel-label mt-0.5 truncate text-[8px] text-tx-muted">
          {card.setName} · #{card.localId}
        </div>
        {card.rarity && !list && (
          <MicroChip className="mt-1.5 max-w-full truncate !text-[11px]" title={card.rarity}>
            {card.rarity}
          </MicroChip>
        )}
        <div className={cn('mt-1.5', list && 'mt-0.5')}>
          {primary != null ? (
            <div className="space-y-0.5">
              <div className="font-display text-sm font-bold tabular-nums text-gold">{fmtPrice(primary, lang)}</div>
              <div className="font-sans text-[10px] text-tx-muted">{t('tcg.tile.pricePrimary')}</div>
              {(sec.a != null || sec.b != null) && (
                <div className="flex flex-wrap gap-x-2 font-sans text-[10px] tabular-nums text-tx-muted">
                  {sec.a != null && (
                    <span>
                      {t('tcg.tile.priceTrend')}: {fmtPrice(sec.a, lang)}
                    </span>
                  )}
                  {sec.b != null && (
                    <span>
                      {t('tcg.tile.priceAvg30')}: {fmtPrice(sec.b, lang)}
                    </span>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p className="font-sans text-[10px] leading-snug text-tx-muted">
              {hasCm || hasTp ? t('tcg.tile.noPrice') : t('tcg.tile.noMarketData')}
            </p>
          )}
        </div>
      </div>
    </>
  );

  return (
    <motion.button
      type="button"
      initial={animate ? { opacity: 0, y: 12 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={animate ? { duration: 0.35, ease: EASE, delay: Math.min(index, 11) * 0.02 } : { duration: 0 }}
      onClick={onClick}
      className={cn(
        'tcg-card-wrap w-full rounded-md border border-hairline bg-surface2/80 p-2 text-left shadow-sm hover:border-gold/40 hover:shadow-glow-gold',
        list && 'tcg-list-row !grid !p-2',
      )}
      aria-label={t('tcg.openCard', { name: card.name })}
    >
      {body}
    </motion.button>
  );
}
