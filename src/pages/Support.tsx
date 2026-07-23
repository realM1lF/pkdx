/* Support — donation page. Warm, honest, zero pressure. */
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Coffee, ExternalLink, Heart, Sparkles } from 'lucide-react';
import { PAYPAL_ME_URL } from '@/lib/support';

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function Support() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-content px-4 pb-20 pt-6 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE }}
        className="mx-auto max-w-xl text-center"
      >
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-gold/40 bg-gold-soft text-gold shadow-glow-gold">
          <Heart size={28} strokeWidth={1.75} />
        </span>
        <p className="pixel-label mt-5 text-[9px] text-gold">{t('support.eyebrow')}</p>
        <h1 className="mt-2 font-display text-2xl font-extrabold uppercase tracking-wide text-tx-primary md:text-3xl">
          {t('support.title')}
        </h1>
        <p className="mt-4 font-sans text-[14.5px] leading-relaxed text-tx-secondary">
          {t('support.p1')}
        </p>
        <p className="mt-3 font-sans text-[14.5px] leading-relaxed text-tx-secondary">
          {t('support.p2')}
        </p>

        <motion.a
          href={PAYPAL_ME_URL}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.97 }}
          className="group relative mt-8 inline-flex items-center gap-2.5 overflow-hidden rounded-md border border-gold/60 bg-[linear-gradient(135deg,rgba(246,201,69,0.28),rgba(246,201,69,0.12))] px-8 py-4 font-display text-sm font-bold uppercase tracking-wider text-tx-primary transition-shadow duration-200 hover:shadow-glow-gold"
        >
          <span className="absolute inset-0 -translate-x-full bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.30)_50%,transparent_70%)] transition-transform duration-sheen group-hover:translate-x-full" />
          <Coffee size={17} />
          {t('support.cta')}
          <ExternalLink size={13} className="opacity-70" />
        </motion.a>

        <p className="mt-6 flex items-center justify-center gap-1.5 font-sans text-[12.5px] text-tx-muted">
          <Sparkles size={13} className="text-gold/70" />
          {t('support.note')}
        </p>
      </motion.div>
    </div>
  );
}
