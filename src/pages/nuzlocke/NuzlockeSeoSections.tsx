import { ArrowRight } from 'lucide-react';
import QaSection from '@/components/QaSection';
import { LocaleLink } from '@/lib/locale-link';
import { nuzlockeSeoContent } from '@/lib/nuzlocke-seo-content';
import { NUZLOCKE_SEO_PAGES, nuzlockeSeoPath } from '@/lib/nuzlocke-seo';
import { useLanguage } from '@/lib/i18n-data';

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <header className="mb-4">
      <p className="pixel-label text-[9px] text-gold">{eyebrow}</p>
      <h2 className="mt-1 font-display text-lg font-bold tracking-wide text-tx-primary md:text-xl">{title}</h2>
    </header>
  );
}

function LinkCard({ to, label, body }: { to: string; label: string; body: string }) {
  return (
    <div className="rounded-lg border border-hairline bg-surface1 px-4 py-3.5">
      <LocaleLink
        to={to}
        className="inline-flex items-center gap-1.5 font-display text-micro13 font-bold tracking-wide text-gold transition-colors hover:text-tx-primary"
      >
        {label}
        <ArrowRight size={11} />
      </LocaleLink>
      <p className="mt-1.5 text-[0.7813rem] leading-relaxed text-tx-secondary">{body}</p>
    </div>
  );
}

export default function NuzlockeSeoSections() {
  const lang = useLanguage();
  const content = nuzlockeSeoContent(lang);

  return (
    <div className="mx-auto mt-12 max-w-3xl">
      <section>
        <SectionHeader eyebrow={content.features.eyebrow} title={content.features.title} />
        <div className="grid gap-3 sm:grid-cols-3">
          {content.features.items.map((item) => (
            <div key={item.title} className="rounded-lg border border-hairline bg-surface1 px-4 py-3.5">
              <h3 className="font-display text-micro13 font-bold tracking-wide text-tx-primary">{item.title}</h3>
              <p className="mt-1.5 text-[0.7813rem] leading-relaxed text-tx-secondary">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <div className="rounded-lg border border-hairline bg-surface1 px-4 py-5 sm:px-6">
          <SectionHeader eyebrow={content.games.eyebrow} title={content.games.title} />
          <p className="text-[0.8438rem] leading-relaxed text-tx-secondary">{content.games.body}</p>
          <p className="mt-3 border-l-2 border-gold/60 pl-3 text-[0.7813rem] leading-relaxed text-tx-muted">{content.games.freeformNote}</p>
        </div>
      </section>

      <section className="mt-12">
        <div className="rounded-lg border border-hairline bg-surface1 px-4 py-5 sm:px-6">
          <SectionHeader eyebrow={content.multi.eyebrow} title={content.multi.title} />
          <p className="text-[0.8438rem] leading-relaxed text-tx-secondary">{content.multi.body}</p>
        </div>
      </section>

      <section className="mt-12">
        <SectionHeader eyebrow={content.faq.eyebrow} title={content.faq.title} />
        <QaSection
          defaultOpen={1}
          label={content.faq.eyebrow}
          items={content.faq.items.map((item) => ({ q: item.q, a: <p>{item.a}</p> }))}
        />
      </section>

      <section className="mt-12">
        <SectionHeader eyebrow={content.links.eyebrow} title={content.links.title} />
        <div className="grid gap-3 sm:grid-cols-2">
          {NUZLOCKE_SEO_PAGES.map((page) => {
            const item = content.links.satellites[page.slug];
            return <LinkCard key={page.slug} to={nuzlockeSeoPath(page.slug)} label={item.label} body={item.body} />;
          })}
          <LinkCard to="/maps" {...content.links.maps} />
          <LinkCard to="/team" {...content.links.team} />
          <LinkCard to="/versus" {...content.links.versus} />
        </div>
      </section>
    </div>
  );
}
