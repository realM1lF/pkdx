/* Versus hub SEO under the calc. H2/H3 only. Calc stays first.
 * Damage ranges and speed, not a 1v1 fight (that lives on the battle landing). */
import { useTranslation } from 'react-i18next';
import QaSection from '@/components/QaSection';
import {
  SeoCallout,
  SeoDeck,
  SeoHeader,
  SeoLead,
  SeoLinks,
  SeoRangeBar,
  SeoSection,
  SeoSteps,
  SeoTiles,
} from '@/components/SeoDeck';
import { LocaleLink } from '@/lib/locale-link';
import { useLanguage } from '@/lib/i18n-data';
import { battleLandingPath } from '@/lib/seo';
import { MATCHUPS, matchupNames, matchupRest } from '@/lib/seo-matchups';

interface QaRaw {
  q: string;
  aLead: string;
  aBody: string;
}

const HOW_KEYS = ['game', 'sides', 'read'] as const;
const MATRIX_KEYS = ['range', 'speed', 'ko'] as const;
const LINK_KEYS = ['battle', 'team', 'dex', 'nuzlocke'] as const;

export default function VersusSeoSections() {
  const { t } = useTranslation();
  const lang = useLanguage();
  const qa = t('seo.versus.qa', { returnObjects: true }) as QaRaw[];

  return (
    <SeoDeck className="mt-14">
      <SeoSection>
        <SeoHeader eyebrow={t('seo.versus.explainerEyebrow')} title={t('seo.versus.explainerTitle')} />
        <SeoLead>
          <p>{t('seo.versus.explainerBody')}</p>
        </SeoLead>
        <SeoRangeBar
          label={t('seo.versus.rangeLabel')}
          lo={t('seo.versus.rangeLo')}
          hi={t('seo.versus.rangeHi')}
        />
      </SeoSection>

      <SeoSection>
        <SeoHeader eyebrow={t('seo.versus.how.eyebrow')} title={t('seo.versus.how.title')} />
        <SeoLead>
          <p>{t('seo.versus.how.body')}</p>
        </SeoLead>
        <SeoSteps
          items={HOW_KEYS.map((key) => ({
            title: t(`seo.versus.how.${key}.title`),
            body: t(`seo.versus.how.${key}.body`),
          }))}
        />
      </SeoSection>

      <SeoSection>
        <SeoHeader eyebrow={t('seo.versus.matrix.eyebrow')} title={t('seo.versus.matrix.title')} />
        <SeoLead>
          <p>{t('seo.versus.matrix.body')}</p>
        </SeoLead>
        <SeoTiles
          items={MATRIX_KEYS.map((key) => ({
            title: t(`seo.versus.matrix.${key}.title`),
            body: t(`seo.versus.matrix.${key}.body`),
          }))}
        />
      </SeoSection>

      <SeoSection>
        <SeoHeader eyebrow={t('seo.versus.split.eyebrow')} title={t('seo.versus.split.title')} />
        <SeoCallout title={t('seo.versus.split.callout')} body={t('seo.versus.split.body')} />
      </SeoSection>

      <SeoSection>
        <SeoHeader eyebrow={t('seo.versus.qaEyebrow')} title={t('seo.versus.qaTitle')} />
        <QaSection
          defaultOpen={1}
          items={qa.map((item) => ({
            q: item.q,
            a: (
              <p>
                <strong className="font-semibold text-tx-primary">{item.aLead}</strong> {item.aBody}
              </p>
            ),
          }))}
        />
      </SeoSection>

      <SeoSection>
        <SeoHeader eyebrow={t('seo.versus.matchupsEyebrow')} title={t('seo.versus.matchupsTitle')} />
        <SeoLead>
          <p>{t('seo.versus.matchupsBody')}</p>
        </SeoLead>
        <ul className="mt-6 divide-y divide-hairline border-y border-hairline sm:grid sm:grid-cols-2 sm:gap-x-10 sm:divide-y-0 sm:border-0">
          {MATCHUPS.map((m) => {
            const n = matchupNames(m, lang);
            return (
              <li key={m.slugEn} className="sm:border-t sm:border-hairline">
                <LocaleLink
                  to={matchupRest(m, lang)}
                  className="group block py-2.5 no-underline"
                >
                  <span className="font-display text-micro13 font-bold tracking-wide text-gold underline decoration-gold/0 underline-offset-4 group-hover:decoration-gold">
                    {n.a} vs. {n.b}
                  </span>
                </LocaleLink>
              </li>
            );
          })}
        </ul>
      </SeoSection>

      <SeoSection>
        <SeoHeader eyebrow={t('seo.versus.links.eyebrow')} title={t('seo.versus.links.title')} />
        <SeoLinks
          items={LINK_KEYS.map((key) => ({
            to: {
              battle: battleLandingPath(lang),
              team: '/team',
              dex: '/pokedex',
              nuzlocke: '/nuzlocke',
            }[key],
            label: t(`seo.versus.links.${key}.label`),
            body: t(`seo.versus.links.${key}.body`),
          }))}
        />
      </SeoSection>
    </SeoDeck>
  );
}
