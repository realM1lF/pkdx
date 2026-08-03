/* About — why MyPokePanion exists. Calm, personal, not overloaded. */
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowRight, Gamepad2, Hammer, Heart, Layers } from 'lucide-react';
import { LocaleLink } from '@/lib/locale-link';

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function About() {
  const { t } = useTranslation();

  const blocks = [
    { Icon: Layers, titleKey: 'about.story.title', textKey: 'about.story.text' },
    { Icon: Gamepad2, titleKey: 'about.gamers.title', textKey: 'about.gamers.text' },
    { Icon: Hammer, titleKey: 'about.hobby.title', textKey: 'about.hobby.text' },
  ];

  return (
    <div className="mx-auto max-w-content px-4 pb-20 pt-6 md:px-8">
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="mb-10 max-w-2xl"
      >
        <p className="pixel-label text-[9px] text-gold">{t('about.eyebrow')}</p>
        <h1 className="font-display text-2xl font-extrabold tracking-wide text-tx-primary md:text-3xl">
          {t('about.title')}
        </h1>
        <p className="mt-3 font-sans text-[15px] leading-relaxed text-tx-secondary">
          {t('about.lede')}
        </p>
      </motion.header>

      <div className="grid max-w-4xl gap-4">
        {blocks.map(({ Icon, titleKey, textKey }, i) => (
          <motion.section
            key={titleKey}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.4, ease: EASE, delay: i * 0.06 }}
            className="flex gap-4 rounded-lg border border-hairline bg-surface1 p-5 md:p-6"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-gold/30 bg-gold-soft text-gold">
              <Icon size={18} strokeWidth={1.75} />
            </span>
            <div>
              <h2 className="font-display text-base font-bold tracking-wide text-tx-primary">
                {t(titleKey)}
              </h2>
              <p className="mt-1.5 font-sans text-[13.5px] leading-relaxed text-tx-secondary">
                {t(textKey)}
              </p>
            </div>
          </motion.section>
        ))}
      </div>

      {/* feedback cross-reference */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.4, ease: EASE, delay: 0.2 }}
        className="mt-8 flex max-w-4xl flex-wrap items-center gap-4 rounded-lg border border-gold/40 bg-[linear-gradient(135deg,rgba(246,201,69,0.12),rgba(246,201,69,0.04))] p-5 md:p-6"
      >
        <Heart size={22} className="shrink-0 text-gold" />
        <p className="min-w-0 flex-1 font-sans text-[13.5px] leading-relaxed text-tx-primary">
          {t('about.feedback.text')}
        </p>
        <LocaleLink
          to="/feedback"
          className="inline-flex h-9 items-center gap-1.5 rounded-md border border-gold/60 bg-[linear-gradient(135deg,rgba(246,201,69,0.25),rgba(246,201,69,0.10))] px-4 font-display text-[12px] font-bold tracking-wider text-tx-primary transition-all duration-200 hover:-translate-y-0.5 hover:shadow-glow-gold"
        >
          {t('about.feedback.cta')}
          <ArrowRight size={14} />
        </LocaleLink>
      </motion.div>
    </div>
  );
}
