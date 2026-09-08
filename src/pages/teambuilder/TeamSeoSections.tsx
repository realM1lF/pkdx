/* Team hub SEO copy — prerendered explanation under the existing H1.
 * H2/H3 only. No FAQPage schema (topics.md / improve.md §3). */
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/lib/i18n-data';
import { battleLandingPath } from '@/lib/seo';
import { SeoCallout, SeoDeck, SeoHeader, SeoLead, SeoLinks, SeoSection, SeoSlotStrip, SeoSteps, SeoTiles } from '@/components/SeoDeck';

const HOW_KEYS = ['game', 'slot', 'set', 'review'] as const;
const FEATURE_KEYS = ['slots', 'legality', 'coverage', 'export'] as const;
const LINK_KEYS = ['battle', 'dex', 'versus', 'nuzlocke'] as const;

export default function TeamSeoSections() {
  const { t } = useTranslation();
  const lang = useLanguage();

  const linkTo = {
    battle: battleLandingPath(lang),
    dex: '/pokedex',
    versus: '/versus',
    nuzlocke: '/nuzlocke',
  } as const;

  return (
    <SeoDeck className="mt-14">
      <SeoSection>
        <SeoHeader eyebrow={t('tb.seo.what.eyebrow')} title={t('tb.seo.what.title')} />
        <SeoLead>
          <p>{t('tb.seo.what.body')}</p>
          <p>{t('tb.seo.what.body2')}</p>
        </SeoLead>
        <SeoSlotStrip label={t('tb.seo.what.partyLabel')} />
        <SeoTiles
          items={FEATURE_KEYS.map((key) => ({
            title: t(`tb.seo.what.${key}.title`),
            body: t(`tb.seo.what.${key}.body`),
          }))}
        />
      </SeoSection>

      <SeoSection>
        <SeoHeader eyebrow={t('tb.seo.how.eyebrow')} title={t('tb.seo.how.title')} />
        <SeoLead>
          <p>{t('tb.seo.how.body')}</p>
        </SeoLead>
        <SeoSteps
          items={HOW_KEYS.map((key) => ({
            title: t(`tb.seo.how.${key}.title`),
            body: t(`tb.seo.how.${key}.body`),
          }))}
        />
      </SeoSection>

      <SeoSection>
        <SeoHeader eyebrow={t('tb.seo.coverageRead.eyebrow')} title={t('tb.seo.coverageRead.title')} />
        <SeoLead>
          <p>{t('tb.seo.coverageRead.body')}</p>
        </SeoLead>
        <SeoTiles
          items={['offense', 'defense'].map((key) => ({
            title: t(`tb.seo.coverageRead.${key}.title`),
            body: t(`tb.seo.coverageRead.${key}.body`),
          }))}
        />
        <SeoCallout title={t('tb.seo.what.limits.title')} body={t('tb.seo.what.limits.body')} />
      </SeoSection>

      <SeoSection>
        <SeoHeader eyebrow={t('tb.seo.links.eyebrow')} title={t('tb.seo.links.title')} />
        <SeoLinks
          items={LINK_KEYS.map((key) => ({
            to: linkTo[key],
            label: t(`tb.seo.links.${key}.label`),
            body: t(`tb.seo.links.${key}.body`),
          }))}
        />
      </SeoSection>
    </SeoDeck>
  );
}
