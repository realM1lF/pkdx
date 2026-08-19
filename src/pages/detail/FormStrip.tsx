/* Forme switcher on the species detail hero — catalog only (Mega/Alola/…). */
import { useTranslation } from 'react-i18next';
import { LocaleLink } from '@/lib/locale-link';
import { useSearchParams } from 'react-router';
import { pokemonHref } from '@/lib/edition-nav';
import HonestyHint from '@/components/HonestyHint';
import Sprite from '@/components/Sprite';
import { nameOfPokemon, useLanguage } from '@/lib/i18n-data';
import { formsForSpecies } from '@/lib/dex-forms-catalog';
import { FORM_I18N_KEY } from '@/components/pokedex/dex-data';
import { genSpecies } from '@/lib/gen-dex';
import { formNotInGame } from '@/lib/honesty';
import { cn } from '@/lib/utils';

interface FormStripProps {
  speciesId: number;
  currentSlug: string;
  edition?: string;
}

export default function FormStrip({ speciesId, currentSlug, edition }: FormStripProps) {
  const { t } = useTranslation();
  const lang = useLanguage();
  const [searchParams] = useSearchParams();
  const game = searchParams.get('game');
  const forms = formsForSpecies(speciesId);
  if (forms.length === 0) return null;
  const onBase = !forms.some((f) => f.slug === currentSlug);
  const showMissingForm = edition ? formNotInGame(Boolean(genSpecies(edition, currentSlug)?.exists)) : false;

  return (
    <div className="mt-1 min-w-0">
      <span className="pixel-label mb-1 block text-[8px] text-tx-muted">{t('detail.hero.forms')}</span>
      <div className="flex flex-wrap gap-1" data-lenis-prevent>
        <LocaleLink
          to={pokemonHref(speciesId, { game })}
          className={cn(
            'flex h-8 items-center gap-1 rounded-pill border px-1.5 pr-2 transition-colors',
            onBase
              ? 'border-gold/60 bg-gold-soft text-gold'
              : 'border-hairline bg-surface2 text-tx-secondary hover:border-gold/40 hover:text-gold',
          )}
          aria-current={onBase ? 'page' : undefined}
        >
          <Sprite id={speciesId} name={nameOfPokemon(speciesId, lang)} era="gen5" skeleton={false} className="h-6 w-6" />
          <span className="max-w-[7rem] truncate font-sans text-micro10 font-semibold">{nameOfPokemon(speciesId, lang)}</span>
        </LocaleLink>
        {forms.map((f) => {
          const active = f.slug === currentSlug;
          return (
            <LocaleLink
              key={f.slug}
              to={pokemonHref(f.slug, { game })}
              className={cn(
                'flex h-8 min-w-0 items-center gap-1 rounded-pill border px-1.5 pr-2 transition-colors',
                active
                  ? 'border-gold/60 bg-gold-soft text-gold'
                  : 'border-hairline bg-surface2 text-tx-secondary hover:border-gold/40 hover:text-gold',
              )}
              aria-current={active ? 'page' : undefined}
            >
              <Sprite id={f.spriteId} name={nameOfPokemon(f.slug, lang)} era="default" skeleton={false} className="h-6 w-6" />
              <span className="max-w-[9rem] truncate font-sans text-micro10 font-semibold">{nameOfPokemon(f.slug, lang)}</span>
              <span className="pixel-label hidden text-[8px] sm:inline">{t(FORM_I18N_KEY[f.kind])}</span>
            </LocaleLink>
          );
        })}
      </div>
      <HonestyHint show={showMissingForm} tone="gold" className="mt-1" truncate>
        {t('honesty.formNotInGame')}
      </HonestyHint>
    </div>
  );
}
