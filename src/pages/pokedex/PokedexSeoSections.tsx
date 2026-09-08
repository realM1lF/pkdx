/* Pokédex hub SEO under the grid. H2/H3 only. */
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/lib/i18n-data';
import { battleLandingPath } from '@/lib/seo';
import { SeoCallout, SeoDeck, SeoHeader, SeoLead, SeoLinks, SeoSection, SeoSteps, SeoTiles, SeoTypeSpectrum } from '@/components/SeoDeck';

const HOW_KEYS = ['search', 'stack', 'density', 'sort'] as const;
const SPECIES_KEYS = ['stats', 'learnset', 'sprites'] as const;
const LINK_KEYS = ['team', 'battle', 'versus', 'nuzlocke'] as const;

export default function PokedexSeoSections() {
  const { t } = useTranslation();
  const lang = useLanguage();
  const linkTo = {
    team: '/team',
    battle: battleLandingPath(lang),
    versus: '/versus',
    nuzlocke: '/nuzlocke',
  } as const;

  return (
    <div className="mx-auto max-w-content px-4 pb-20 pt-10 md:px-8">
      <SeoDeck>
        <SeoSection>
          <SeoHeader eyebrow={t('pokedex.seo.eyebrow')} title={t('pokedex.seo.title')} />
          <SeoLead>
            <p>{t('pokedex.seo.body')}</p>
            <p>{t('pokedex.seo.body2')}</p>
          </SeoLead>
          <SeoTypeSpectrum label={t('pokedex.seo.spectrumLabel')} hint={t('pokedex.seo.spectrumHint')} />
        </SeoSection>

        <SeoSection>
          <SeoHeader eyebrow={t('pokedex.seo.how.eyebrow')} title={t('pokedex.seo.how.title')} />
          <SeoLead>
            <p>{t('pokedex.seo.how.body')}</p>
          </SeoLead>
          <SeoSteps items={HOW_KEYS.map((key) => ({ title: t(`pokedex.seo.how.${key}.title`), body: t(`pokedex.seo.how.${key}.body`) }))} />
        </SeoSection>

        <SeoSection>
          <SeoHeader eyebrow={t('pokedex.seo.species.eyebrow')} title={t('pokedex.seo.species.title')} />
          <SeoLead>
            <p>{t('pokedex.seo.species.body')}</p>
          </SeoLead>
          <SeoTiles items={SPECIES_KEYS.map((key) => ({ title: t(`pokedex.seo.species.${key}.title`), body: t(`pokedex.seo.species.${key}.body`) }))} />
        </SeoSection>

        <SeoSection>
          <SeoHeader eyebrow={t('pokedex.seo.limits.eyebrow')} title={t('pokedex.seo.limits.title')} />
          <SeoCallout title={t('pokedex.seo.limits.callout')} body={t('pokedex.seo.limits.body')} />
        </SeoSection>

        <SeoSection>
          <SeoHeader eyebrow={t('pokedex.seo.linksEyebrow')} title={t('pokedex.seo.linksTitle')} />
          <SeoLinks
            items={LINK_KEYS.map((key) => ({
              to: linkTo[key],
              label: t(`pokedex.seo.links.${key}.label`),
              body: t(`pokedex.seo.links.${key}.body`),
            }))}
          />
        </SeoSection>
      </SeoDeck>
    </div>
  );
}
