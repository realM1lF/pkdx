/* Home bottom SEO — toolkit overview under the existing demos. H2/H3 only. */
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/lib/i18n-data';
import { battleLandingPath } from '@/lib/seo';
import { SeoCallout, SeoDeck, SeoFlow, SeoHeader, SeoLead, SeoLinks, SeoSection, SeoTiles } from '@/components/SeoDeck';

const TOOL_KEYS = ['dex', 'maps', 'nuzlocke', 'team'] as const;
const FLOW_KEYS = ['look', 'plan', 'build', 'fight'] as const;
const LINK_KEYS = ['dex', 'nuzlocke', 'team', 'battle'] as const;

export default function HomeSeoSections() {
  const { t } = useTranslation();
  const lang = useLanguage();
  const to = {
    dex: '/pokedex',
    nuzlocke: '/nuzlocke',
    team: '/team',
    battle: battleLandingPath(lang),
  } as const;

  return (
    <section className="relative mx-auto max-w-content px-4 pb-20 pt-6 md:px-8">
      <div className="mb-10 h-px w-full bg-gradient-to-r from-transparent via-gold/40 to-transparent" aria-hidden />
      <SeoDeck>
        <SeoSection>
          <SeoHeader eyebrow={t('home.seo.eyebrow')} title={t('home.seo.title')} />
          <SeoLead>
            <p>{t('home.seo.body')}</p>
            <p>{t('home.seo.body2')}</p>
          </SeoLead>
        </SeoSection>

        <SeoSection>
          <SeoHeader eyebrow={t('home.seo.tools.eyebrow')} title={t('home.seo.tools.title')} />
          <SeoLead>
            <p>{t('home.seo.tools.body')}</p>
          </SeoLead>
          <SeoTiles
            items={TOOL_KEYS.map((key) => ({
              title: t(`home.seo.tools.${key}.title`),
              body: t(`home.seo.tools.${key}.body`),
            }))}
          />
        </SeoSection>

        <SeoSection>
          <SeoHeader eyebrow={t('home.seo.connect.eyebrow')} title={t('home.seo.connect.title')} />
          <SeoLead>
            <p>{t('home.seo.connect.body')}</p>
          </SeoLead>
          <SeoFlow
            items={FLOW_KEYS.map((key) => ({
              title: t(`home.seo.connect.${key}.title`),
              body: t(`home.seo.connect.${key}.body`),
              to: {
                look: '/pokedex',
                plan: '/maps',
                build: '/team',
                fight: battleLandingPath(lang),
              }[key],
            }))}
          />
        </SeoSection>

        <SeoSection>
          <SeoHeader eyebrow={t('home.seo.limit.eyebrow')} title={t('home.seo.limit.title')} />
          <SeoCallout title={t('home.seo.limit.callout')} body={t('home.seo.limit.body')} />
        </SeoSection>

        <SeoSection>
          <SeoHeader eyebrow={t('home.seo.linksEyebrow')} title={t('home.seo.linksTitle')} />
          <SeoLinks
            items={LINK_KEYS.map((key) => ({
              to: to[key],
              label: t(`home.seo.links.${key}.label`),
              body: t(`home.seo.links.${key}.body`),
            }))}
          />
        </SeoSection>
      </SeoDeck>
    </section>
  );
}
