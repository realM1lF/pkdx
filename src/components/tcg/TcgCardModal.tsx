/* TcgCardModal — card detail dialog (EntityDescModal shell). */
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ExternalLink, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import HonestyHint from '@/components/HonestyHint';
import TcgCardImage from '@/components/tcg/TcgCardImage';
import TcgPriceBlock from '@/components/tcg/TcgPriceBlock';
import { LocaleLink } from '@/lib/locale-link';
import { useLanguage } from '@/lib/i18n-data';
import { fetchTcgCardDetail } from '@/lib/tcgdex';
import type { TcgCardSummary } from '@/lib/tcg-types';
import { pokemonHref } from '@/lib/edition-nav';
import { MicroChip } from '@/pages/detail/ui';

function MetaCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-md border border-hairline bg-surface2/50 px-2 py-1.5">
      <div className="truncate font-sans text-micro12 font-semibold text-tx-primary">{value}</div>
      <div className="pixel-label mt-0.5 text-[7px] text-tx-muted">{label}</div>
    </div>
  );
}

export function useTcgModal() {
  const [card, setCard] = useState<TcgCardSummary | null>(null);
  return {
    open: (c: TcgCardSummary) => setCard(c),
    close: () => setCard(null),
    props: { card, onClose: () => setCard(null) },
  };
}

export default function TcgCardModal({ card, onClose }: { card: TcgCardSummary | null; onClose: () => void }) {
  const { t } = useTranslation();
  const lang = useLanguage();
  const [detail, setDetail] = useState<TcgCardSummary | null>(null);
  const [pricesLoading, setPricesLoading] = useState(false);

  const refreshPrices = () => {
    if (!card) return;
    setPricesLoading(true);
    void fetchTcgCardDetail(lang, card.id).then((d) => {
      if (d) setDetail(d);
      setPricesLoading(false);
    });
  };

  useEffect(() => {
    if (!card) {
      setDetail(null);
      setPricesLoading(false);
      return undefined;
    }
    setDetail(card);
    let on = true;
    void fetchTcgCardDetail(lang, card.id).then((d) => {
      if (on && d) setDetail(d);
    });
    return () => {
      on = false;
    };
  }, [card, lang]);

  useEffect(() => {
    if (!card) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopImmediatePropagation();
        onClose();
      }
    };
    document.addEventListener('keydown', onKey, true);
    return () => document.removeEventListener('keydown', onKey, true);
  }, [card, onClose]);

  const c = detail ?? card;
  const dexId = c?.dexIds?.[0];

  const variantChips = useMemo(() => {
    if (!c) return [];
    const v = c.variants;
    return [
      v.normal && t('tcg.filter.vn'),
      v.holo && t('tcg.filter.vh'),
      v.reverse && t('tcg.filter.vr'),
      v.firstEdition && t('tcg.filter.vfe'),
    ].filter(Boolean) as string[];
  }, [c, t]);

  const releaseLabel = useMemo(() => {
    if (!c?.releaseDate) return null;
    return new Date(c.releaseDate).toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }, [c?.releaseDate, lang]);

  return createPortal(
    <AnimatePresence>
      {c && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[95] flex items-start justify-center overflow-y-auto bg-void/70 p-4 pt-[8vh] backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={c.name}
        >
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 180, damping: 22 }}
            className="mb-8 w-full max-w-3xl overflow-hidden rounded-[1rem] border border-hairline bg-surface1 shadow-elevate"
            onClick={(e) => e.stopPropagation()}
            data-lenis-prevent
          >
            <div className="flex items-center gap-3 border-b border-hairline px-4 py-3">
              <div className="min-w-0 flex-1">
                <div className="truncate font-display text-lg font-bold text-tx-primary">{c.name}</div>
                <div className="pixel-label mt-0.5 text-[8px] text-tx-muted">
                  {c.setName}
                  {c.seriesName ? ` · ${c.seriesName}` : ''}
                  {' · '}
                  #{c.localId}
                </div>
              </div>
              <button type="button" onClick={onClose} aria-label={t('desc.close')} className="rounded-sm p-1 text-tx-muted hover:text-gold">
                <X size={16} />
              </button>
            </div>

            <div className="grid gap-4 p-4 md:grid-cols-[minmax(0,14rem)_1fr]">
              <div className="mx-auto w-full max-w-[14rem]">
                {c ? <TcgCardImage card={c} lang={lang} className="w-full" /> : null}
              </div>

              <div className="min-w-0 space-y-4">
                <section className="space-y-2">
                  <p className="pixel-label text-[8px] text-gold">{t('tcg.meta.eyebrow')}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {c.rarity && <MicroChip active>{c.rarity}</MicroChip>}
                    {c.category && <MicroChip>{c.category}</MicroChip>}
                    {c.stage && <MicroChip>{c.stage}</MicroChip>}
                    {c.hp != null && <MicroChip>{t('tcg.hp', { hp: c.hp })}</MicroChip>}
                    {c.types?.map((ty) => (
                      <MicroChip key={ty}>{ty}</MicroChip>
                    ))}
                    {c.legal?.standard && <MicroChip active>{t('tcg.filter.std')}</MicroChip>}
                    {c.legal?.expanded && <MicroChip active>{t('tcg.filter.exp')}</MicroChip>}
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {releaseLabel && <MetaCell label={t('tcg.meta.release')} value={releaseLabel} />}
                    {c.regulationMark && <MetaCell label={t('tcg.meta.regulation')} value={c.regulationMark} />}
                    {c.illustrator && <MetaCell label={t('tcg.illustrator')} value={c.illustrator} />}
                  </div>
                  {variantChips.length > 0 && (
                    <div>
                      <p className="mb-1 font-sans text-micro11 font-semibold text-tx-secondary">{t('tcg.meta.variants')}</p>
                      <div className="flex flex-wrap gap-1">
                        {variantChips.map((label) => (
                          <MicroChip key={label} active>
                            {label}
                          </MicroChip>
                        ))}
                      </div>
                    </div>
                  )}
                </section>

                <TcgPriceBlock
                  cardmarket={c.pricing.cardmarket}
                  tcgplayer={c.pricing.tcgplayer}
                  lang={lang}
                  loading={pricesLoading}
                  onRefresh={refreshPrices}
                />

                {dexId != null && (
                  <LocaleLink
                    to={pokemonHref(String(dexId))}
                    className="inline-flex items-center gap-1 font-sans text-micro12 font-semibold text-gold hover:underline"
                  >
                    {t('tcg.viewPokemon')}
                    <ExternalLink size={11} aria-hidden />
                  </LocaleLink>
                )}

                <HonestyHint show className="text-micro10">
                  {t('tcg.disclaimerShort')}
                </HonestyHint>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
