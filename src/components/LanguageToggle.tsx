/* DE | EN segment control — pixel-label style, active = gold, inactive = muted.
 * Used in the navbar (desktop) and the mobile drawer. Switching is live. */
import { useLocation, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { localePath, stripLocalePrefix, useLocale } from '@/lib/locale-link';
import { cn } from '@/lib/utils';

const LANGS = ['de', 'en'] as const;

interface LanguageToggleProps {
  className?: string;
}

export default function LanguageToggle({ className }: LanguageToggleProps) {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const active = useLocale();

  /* toggle = navigate to the same route under the other language prefix
   * (query + hash preserved); LangSync does the i18n/localStorage side */
  const switchTo = (lng: 'de' | 'en') => {
    if (lng === active) return;
    const rest = stripLocalePrefix(location.pathname);
    void i18n.changeLanguage(lng);
    navigate(`${localePath(lng, rest)}${location.search}${location.hash}`);
  };

  return (
    <div
      role="group"
      aria-label={t('nav.language')}
      className={cn(
        'flex h-10 items-center gap-0 rounded-md border border-hairline bg-surface2 px-1',
        className,
      )}
    >
      {LANGS.map((lng, i) => {
        const button = (
          <button
            type="button"
            onClick={() => switchTo(lng)}
            aria-pressed={active === lng}
            className={cn(
              'pixel-label inline-flex h-7 items-center justify-center px-1.5 text-[8px] leading-none transition-colors duration-200',
              active === lng ? 'text-gold' : 'text-tx-muted hover:text-tx-primary',
            )}
          >
            {lng.toUpperCase()}
          </button>
        );

        return (
          <span key={lng} className="inline-flex items-center">
            {i > 0 && (
              <span className="mx-1 inline-flex h-7 items-center text-[8px] leading-none text-tx-muted/50" aria-hidden>
                |
              </span>
            )}
            {lng === 'de' ? (
              <span className="group relative inline-flex items-center">
                {button}
                <span
                  role="tooltip"
                  className="pointer-events-none invisible absolute right-0 top-full z-50 mt-2 w-[13.75rem] rounded-md border border-hairline2 border-l-2 border-l-gold bg-surface2 px-2.5 py-2 text-micro10 leading-snug text-tx-secondary opacity-0 shadow-[0_8px_32px_rgba(0,0,0,0.45)] transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
                >
                  <p>{t('nav.deCoverageNoteEn')}</p>
                  <p className="mt-1 text-tx-muted">{t('nav.deCoverageNoteDe')}</p>
                </span>
              </span>
            ) : (
              button
            )}
          </span>
        );
      })}
    </div>
  );
}
