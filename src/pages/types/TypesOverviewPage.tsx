/* TypesOverviewPage — /de/typen · /en/types (SEO rollout).
 *
 * Card grid of all 18 types, each with computed "strong against / weak to"
 * short info from the gen-9 chart (src/lib/seo-type-chart.ts) — no
 * hand-written matchup content. Links into the 18 detail pages. */
import type { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronRight } from 'lucide-react';
import TypeGlyph from '@/components/TypeGlyph';
import { LocaleLink, useLocale } from '@/lib/locale-link';
import { offenseProfile, defenseProfile } from '@/lib/seo-type-chart';
import { typeDetailPath, typeName } from '@/lib/seo-types';
import { POKEMON_TYPES, TYPE_COLORS } from '@/lib/types';
import type { PokemonType } from '@/lib/types';

export default function TypesOverviewPage() {
  const { t } = useTranslation();
  const lang = useLocale();

  return (
    <div className="mx-auto max-w-content px-4 pb-20 pt-6 md:px-8">
      <header className="mb-8 max-w-3xl">
        <p className="pixel-label text-[9px] text-gold">{t('seo.types.eyebrow')}</p>
        <h1 className="font-display text-2xl font-extrabold tracking-wide text-tx-primary md:text-3xl">
          {t('seo.types.title')}
        </h1>
        <p className="mt-3 font-sans text-[14px] leading-relaxed text-tx-secondary">
          {t('seo.types.intro')}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {POKEMON_TYPES.map((type) => {
          const color = TYPE_COLORS[type as PokemonType];
          const offense = offenseProfile(type);
          const defense = defenseProfile(type);
          return (
            <LocaleLink
              key={type}
              to={typeDetailPath(lang, type)}
              data-type={type}
              className="group rounded-lg border border-hairline bg-surface1 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[rgba(var(--t),0.6)] hover:shadow-[0_0_20px_rgba(var(--t),0.25)]"
              style={{ '--t': color.rgb } as CSSProperties}
            >
              <span className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-[rgba(var(--t),0.4)] bg-[rgba(var(--t),0.16)] text-[rgb(var(--t))]">
                  <TypeGlyph type={type} size={18} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-[15px] font-bold tracking-wide text-tx-primary transition-colors group-hover:text-[rgb(var(--t))]">
                    {typeName(type, lang)}
                  </span>
                  <span className="pixel-label block text-[7px] text-tx-muted">
                    {t('seo.types.cardOpen')}
                  </span>
                </span>
                <ChevronRight
                  size={15}
                  className="shrink-0 text-tx-muted transition-transform group-hover:translate-x-0.5 group-hover:text-[rgb(var(--t))]"
                />
              </span>
              <span className="mt-3 block border-t border-hairline/60 pt-2.5 text-[11.5px] leading-relaxed text-tx-secondary">
                <span className="font-semibold text-tx-primary">{t('seo.types.cardStrong')}</span>{' '}
                {offense.superEffective.length > 0
                  ? offense.superEffective.map((x) => typeName(x, lang)).join(', ')
                  : t('seo.types.cardNone')}
                <br />
                <span className="font-semibold text-tx-primary">{t('seo.types.cardWeak')}</span>{' '}
                {defense.weak.length > 0
                  ? defense.weak.map((x) => typeName(x, lang)).join(', ')
                  : t('seo.types.cardNone')}
              </span>
            </LocaleLink>
          );
        })}
      </div>

      <p className="mt-6 font-sans text-[12px] leading-relaxed text-tx-muted">
        {t('seo.types.footnote')}
      </p>
    </div>
  );
}
