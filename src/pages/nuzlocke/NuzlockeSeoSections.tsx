import QaSection from '@/components/QaSection';
import { SeoCallout, SeoDeck, SeoHeader, SeoLead, SeoLinks, SeoSection, SeoSteps, SeoTiles } from '@/components/SeoDeck';
import { nuzlockeSeoContent } from '@/lib/nuzlocke-seo-content';
import { NUZLOCKE_SEO_PAGES, nuzlockeSeoPath } from '@/lib/nuzlocke-seo';
import { useLanguage } from '@/lib/i18n-data';
import { battleLandingPath } from '@/lib/seo';

export default function NuzlockeSeoSections() {
  const lang = useLanguage();
  const content = nuzlockeSeoContent(lang);

  return (
    <SeoDeck className="mt-14">
      <SeoSection>
        <SeoHeader eyebrow={content.walkthrough.eyebrow} title={content.walkthrough.title} />
        <SeoLead>
          <p>{content.walkthrough.body}</p>
        </SeoLead>
        <SeoSteps items={content.walkthrough.items} />
      </SeoSection>

      <SeoSection>
        <SeoHeader eyebrow={content.features.eyebrow} title={content.features.title} />
        <SeoTiles items={content.features.items} />
      </SeoSection>

      <SeoSection>
        <SeoHeader eyebrow={content.games.eyebrow} title={content.games.title} />
        <SeoLead>
          <p>{content.games.body}</p>
        </SeoLead>
        <SeoCallout title={content.games.freeformTitle} body={content.games.freeformNote} />
      </SeoSection>

      <SeoSection>
        <SeoHeader eyebrow={content.multi.eyebrow} title={content.multi.title} />
        <SeoLead>
          <p>{content.multi.body}</p>
          <p>{content.multi.body2}</p>
        </SeoLead>
      </SeoSection>

      <SeoSection>
        <SeoHeader eyebrow={content.faq.eyebrow} title={content.faq.title} />
        <QaSection
          defaultOpen={1}
          label={content.faq.eyebrow}
          items={content.faq.items.map((item) => ({ q: item.q, a: <p>{item.a}</p> }))}
        />
      </SeoSection>

      <SeoSection>
        <SeoHeader eyebrow={content.links.eyebrow} title={content.links.title} />
        <SeoLinks
          columns={2}
          items={[
            ...NUZLOCKE_SEO_PAGES.map((page) => {
              const item = content.links.satellites[page.slug];
              return { to: nuzlockeSeoPath(page.slug), label: item.label, body: item.body };
            }),
            { to: '/maps', ...content.links.maps },
            { to: '/team', ...content.links.team },
            { to: '/versus', ...content.links.versus },
            { to: battleLandingPath(lang), ...content.links.battle },
          ]}
        />
      </SeoSection>
    </SeoDeck>
  );
}
