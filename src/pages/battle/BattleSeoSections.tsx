/* Battle landing SEO under the arena. H2/H3 only. Arena stays first. */
import { useTranslation } from 'react-i18next';
import QaSection from '@/components/QaSection';
import {
  SeoCallout,
  SeoDeck,
  SeoHeader,
  SeoLead,
  SeoLinks,
  SeoLogLine,
  SeoSection,
  SeoSteps,
  SeoTiles,
} from '@/components/SeoDeck';

interface TextPair {
  title: string;
  body: string;
}

interface QaRaw {
  q: string;
  a: string;
}

interface LogRaw {
  turn: string;
  move: string;
  dmg: string;
}

const ENGINE_KEYS = ['formula', 'gen', 'log'] as const;
const LINK_KEYS = ['versus', 'team', 'nuzlocke', 'dex'] as const;

export default function BattleSeoSections() {
  const { t } = useTranslation();
  const steps = t('battleLanding.howSteps', { returnObjects: true }) as TextPair[];
  const usecases = t('battleLanding.usecases', { returnObjects: true }) as TextPair[];
  const qa = t('battleLanding.qa', { returnObjects: true }) as QaRaw[];
  const log = t('battleLanding.logLines', { returnObjects: true }) as LogRaw[];

  return (
    <SeoDeck className="mt-14">
      <SeoSection>
        <SeoHeader eyebrow={t('battleLanding.howEyebrow')} title={t('battleLanding.howTitle')} />
        <SeoLead>
          <p>{t('battleLanding.howLead')}</p>
        </SeoLead>
        <SeoLogLine label={t('battleLanding.logLabel')} items={log} />
        <SeoSteps items={steps} />
      </SeoSection>

      <SeoSection>
        <SeoHeader eyebrow={t('battleLanding.mechanicsEyebrow')} title={t('battleLanding.mechanicsTitle')} />
        <SeoLead>
          <p>{t('battleLanding.mechanicsBody')}</p>
        </SeoLead>
        <SeoTiles
          items={ENGINE_KEYS.map((key) => ({
            title: t(`battleLanding.engine.${key}.title`),
            body: t(`battleLanding.engine.${key}.body`),
          }))}
        />
      </SeoSection>

      <SeoSection>
        <SeoHeader eyebrow={t('battleLanding.usecasesEyebrow')} title={t('battleLanding.usecasesTitle')} />
        <SeoTiles items={usecases} />
      </SeoSection>

      <SeoSection>
        <SeoHeader eyebrow={t('battleLanding.limitsEyebrow')} title={t('battleLanding.limitsTitle')} />
        <SeoCallout title={t('battleLanding.limitsCallout')} body={t('battleLanding.limitsBody')} />
      </SeoSection>

      <SeoSection>
        <SeoHeader eyebrow={t('battleLanding.qaEyebrow')} title={t('battleLanding.qaTitle')} />
        <QaSection defaultOpen={1} items={qa.map((item) => ({ q: item.q, a: <p>{item.a}</p> }))} />
      </SeoSection>

      <SeoSection>
        <SeoHeader eyebrow={t('battleLanding.linksEyebrow')} title={t('battleLanding.linksTitle')} />
        <SeoLinks
          items={LINK_KEYS.map((key) => ({
            to: {
              versus: '/versus',
              team: '/team',
              nuzlocke: '/nuzlocke',
              dex: '/pokedex',
            }[key],
            label: t(`battleLanding.links.${key}.label`),
            body: t(`battleLanding.links.${key}.body`),
          }))}
        />
      </SeoSection>
    </SeoDeck>
  );
}
