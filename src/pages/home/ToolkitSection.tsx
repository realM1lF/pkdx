/* Toolkit teasers — "JENSEITS DES DEX" (home.md §6). Live features beyond the dex. */
import { useTranslation } from 'react-i18next';
import { LocaleLink } from '@/lib/locale-link';
import { motion } from 'framer-motion';
import { ArrowRight, GitCompareArrows, Map as MapIcon, Swords, Users } from 'lucide-react';

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

const TOOLKIT = [
  { to: '/maps', Icon: MapIcon, tag: 'MAPS', titleKey: 'home.features.toolkit.maps.title', captionKey: 'home.features.toolkit.maps.caption' },
  { to: '/nuzlocke', Icon: Users, tag: 'NUZLOCKE', titleKey: 'home.features.toolkit.nuzlocke.title', captionKey: 'home.features.toolkit.nuzlocke.caption' },
  { to: '/team', Icon: Swords, tag: 'TEAM', titleKey: 'home.features.toolkit.team.title', captionKey: 'home.features.toolkit.team.caption' },
  { to: '/versus', Icon: GitCompareArrows, tag: 'VERSUS', titleKey: 'home.features.toolkit.versus.title', captionKey: 'home.features.toolkit.versus.caption' },
];

export default function ToolkitSection() {
  const { t } = useTranslation();

  return (
    <section className="relative bg-abyss pb-24">
      <div className="mx-auto max-w-content border-t border-hairline px-4 pt-16 md:px-8 md:pt-20">
        <div className="mb-8 flex items-center gap-3">
          <span className="pixel-label text-[10px] text-gold">{t('home.features.toolkitEyebrow')}</span>
          <span className="h-px flex-1 bg-hairline" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {TOOLKIT.map(({ to, Icon, tag, titleKey, captionKey }, i) => (
          <motion.div
            key={tag}
            initial={{ y: 24, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
          >
            <LocaleLink
              to={to}
              className="group flex h-full flex-col gap-3 rounded-xl border border-hairline bg-surface1 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-gold/50 hover:shadow-glow-gold"
            >
              <div className="flex items-center justify-between">
                <span className="grid h-9 w-9 place-items-center rounded-md border border-hairline bg-surface2 text-gold transition-colors group-hover:border-gold/40">
                  <Icon size={16} strokeWidth={1.75} />
                </span>
                <span className="pixel-label text-[8px] text-tx-muted">{tag}</span>
              </div>
              <h3 className="font-display text-base font-bold leading-tight">{t(titleKey)}</h3>
              <p className="font-sans text-xs leading-relaxed text-tx-secondary">{t(captionKey)}</p>
              <span className="mt-auto inline-flex items-center gap-1.5 pt-1 font-sans text-[11px] font-semibold uppercase tracking-wider text-gold">
                {t('home.features.open')}
                <ArrowRight size={12} strokeWidth={2} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </span>
            </LocaleLink>
          </motion.div>
        ))}
        </div>
      </div>
    </section>
  );
}
