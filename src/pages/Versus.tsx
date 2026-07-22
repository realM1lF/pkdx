/* Standalone Versus lab — /versus (no pre-selected matchup). */
import { useTranslation } from 'react-i18next';
import VersusPanel from './detail/VersusPanel';

export default function Versus() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-content px-4 pb-20 pt-6 md:px-8">
      <header className="mb-4">
        <p className="pixel-label text-[9px] text-gold">{t('versus.pageEyebrow')}</p>
        <h1 className="font-display text-2xl font-extrabold uppercase tracking-wide text-tx-primary md:text-3xl">
          {t('versus.pageTitle')}
        </h1>
        <p className="mt-1 max-w-xl font-sans text-[13px] text-tx-secondary">{t('versus.pageHint')}</p>
      </header>
      <VersusPanel />
    </div>
  );
}
