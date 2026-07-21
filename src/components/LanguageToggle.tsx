/* DE | EN segment control — pixel-label style, active = gold, inactive = muted.
 * Used in the navbar (desktop) and the mobile drawer. Switching is live. */
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

const LANGS = ['de', 'en'] as const;

interface LanguageToggleProps {
  className?: string;
}

export default function LanguageToggle({ className }: LanguageToggleProps) {
  const { i18n, t } = useTranslation();
  const active = i18n.language.startsWith('de') ? 'de' : 'en';

  return (
    <div
      role="group"
      aria-label={t('nav.language')}
      className={cn(
        'flex h-10 items-center rounded-md border border-hairline bg-surface2 px-1',
        className,
      )}
    >
      {LANGS.map((lng, i) => (
        <span key={lng} className="flex items-center">
          {i > 0 && <span className="mx-1 text-[10px] text-tx-muted/50">|</span>}
          <button
            type="button"
            onClick={() => void i18n.changeLanguage(lng)}
            aria-pressed={active === lng}
            className={cn(
              'pixel-label px-1.5 py-1 text-[10px] transition-colors duration-200',
              active === lng ? 'text-gold' : 'text-tx-muted hover:text-tx-primary',
            )}
          >
            {lng.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
}
