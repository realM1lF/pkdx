import { useLocation } from 'react-router';
import { ArrowRight } from 'lucide-react';
import QaSection from '@/components/QaSection';
import { useLanguage } from '@/lib/i18n-data';
import { LocaleLink } from '@/lib/locale-link';
import { nuzlockeGuideContent } from '@/lib/nuzlocke-guide-content';
import { isNuzlockeSeoSlug, NUZLOCKE_SEO_PAGES, nuzlockeSeoPath } from '@/lib/nuzlocke-seo';

/** Resolve slug from the pathname — static App routes have no `:slug` param. */
function slugFromPath(pathname: string): string {
  const parts = pathname.replace(/\/+$/, '').split('/');
  return parts[parts.length - 1] ?? '';
}

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <header className="mb-4">
      <p className="pixel-label text-[9px] text-gold">{eyebrow}</p>
      <h2 className="mt-1 font-display text-lg font-bold tracking-wide text-tx-primary md:text-xl">{title}</h2>
    </header>
  );
}

export default function NuzlockeGuidePage() {
  const { pathname } = useLocation();
  const slug = slugFromPath(pathname);
  const lang = useLanguage();
  const page = isNuzlockeSeoSlug(slug)
    ? NUZLOCKE_SEO_PAGES.find((entry) => entry.slug === slug)
    : undefined;
  if (!page) return null;

  const content = nuzlockeGuideContent(lang, page.slug);
  const siblings = NUZLOCKE_SEO_PAGES.filter((entry) => entry.slug !== page.slug).slice(0, 3);

  return (
    <div className="mx-auto max-w-content px-4 pb-20 pt-6 md:px-8">
      <header className="mx-auto max-w-3xl">
        <p className="pixel-label text-[9px] text-gold">{content.eyebrow}</p>
        <h1 className="mt-1 font-display text-2xl font-extrabold tracking-wide text-tx-primary md:text-3xl">
          {content.h1}
        </h1>
        <p className="mt-2 font-sans text-[13.5px] leading-relaxed text-tx-secondary">{content.intro}</p>
      </header>

      <div className="mx-auto mt-12 max-w-3xl space-y-12">
        {content.sections.map((section) => (
          <section key={section.title}>
            <SectionHeader eyebrow={content.eyebrow} title={section.title} />
            <p className="font-sans text-[13.5px] leading-relaxed text-tx-secondary">{section.body}</p>
          </section>
        ))}

        <section className="rounded-lg border border-hairline bg-surface1 px-4 py-5 sm:px-6">
          <SectionHeader eyebrow={content.eyebrow} title={content.example.title} />
          <p className="font-sans text-[13.5px] leading-relaxed text-tx-secondary">{content.example.body}</p>
        </section>

        <QaSection
          defaultOpen={1}
          items={content.faq.map((item) => ({ q: item.q, a: <p>{item.a}</p> }))}
        />

        <section>
          <div className="flex flex-col items-center gap-3 rounded-lg border border-gold/30 bg-gold/5 px-4 py-8 text-center">
            <p className="max-w-xl font-display text-base font-bold tracking-wide text-tx-primary md:text-lg">
              {content.cta.title}
            </p>
            <LocaleLink
              to={`/nuzlocke?${page.wizardQuery}`}
              className="inline-flex h-8 items-center gap-1.5 rounded-pill border border-gold bg-gold px-4 font-display text-[11px] font-extrabold tracking-wider text-abyss transition-all hover:shadow-[0_0_18px_rgba(246,201,69,0.45)]"
            >
              {content.cta.button}
              <ArrowRight size={11} />
            </LocaleLink>
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px flex-1 bg-hairline" aria-hidden />
            <span className="pixel-label text-[9px] text-gold">{content.links.related}</span>
            <span className="h-px flex-1 bg-hairline" aria-hidden />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {page.mapPath && (
              <LocaleLink
                to={page.mapPath}
                className="rounded-lg border border-hairline bg-surface1 px-4 py-3.5 font-display text-[13px] font-bold tracking-wide text-gold transition-colors hover:text-tx-primary"
              >
                {content.links.map}
              </LocaleLink>
            )}
            <LocaleLink
              to="/nuzlocke"
              className="rounded-lg border border-hairline bg-surface1 px-4 py-3.5 font-display text-[13px] font-bold tracking-wide text-gold transition-colors hover:text-tx-primary"
            >
              {content.links.backToHub}
            </LocaleLink>
            {siblings.map((sibling) => (
              <LocaleLink
                key={sibling.slug}
                to={nuzlockeSeoPath(sibling.slug)}
                className="rounded-lg border border-hairline bg-surface1 px-4 py-3.5 font-display text-[13px] font-bold tracking-wide text-gold transition-colors hover:text-tx-primary"
              >
                {lang === 'de' ? sibling.primaryKeywordDe : sibling.primaryKeywordEn}
              </LocaleLink>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
