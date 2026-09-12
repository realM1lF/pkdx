import { useTranslation } from 'react-i18next';
import Sprite from '@/components/Sprite';
import TypeGlyph from '@/components/TypeGlyph';
import { LocaleLink } from '@/lib/locale-link';
import { nameOfType, useLanguage } from '@/lib/i18n-data';
import CombatStatViz from '@/pages/detail/CombatStatViz';
import { speciesStatsViewFromTool, type SpeciesStatsView } from './species-stats-view';

export default function SpeciesStatsCard({ view }: { view: SpeciesStatsView }) {
  const { t } = useTranslation();
  const lang = useLanguage();
  const name = lang === 'de' ? view.nameDe : view.nameEn;

  return (
    <div className="mt-3">
      <div className="flex items-center gap-3">
        <Sprite id={view.id} name={name} era="gen5" className="h-16 w-16" />
        <div className="min-w-0">
          <LocaleLink
            to={`/pokemon/${view.slug}`}
            className="block truncate font-display text-sm font-bold tracking-wide text-tx-primary no-underline hover:text-gold"
          >
            {name}
          </LocaleLink>
          <p className="mt-0.5 font-sans text-[0.75rem] text-tx-muted">
            {t('voiceDemo.statsGame', { label: view.gameLabel, gen: view.gen })}
          </p>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {view.types.map((type) => (
              <span key={type} className="inline-flex items-center gap-1 font-sans text-[0.6875rem] text-tx-secondary">
                <TypeGlyph type={type} size={12} />
                {nameOfType(type, lang)}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-3">
        <CombatStatViz
          id={view.id}
          block={view.block}
          types={view.types}
          gen={view.gen}
          defaultMode="radar"
          controlId="voice-combat-mode"
        />
      </div>
    </div>
  );
}

export function speciesStatsCardFromTrace(result: unknown): SpeciesStatsView | null {
  return speciesStatsViewFromTool(result);
}
