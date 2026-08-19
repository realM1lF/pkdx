/* Legal prose pages — Impressum & Datenschutz (Holo-Dex prose shell). */
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

function linkify(text: string) {
  const parts = text.split(/(https:\/\/[^\s]+)/g);
  return parts.map((part, index) =>
    /^https:\/\//.test(part) ? (
      <a
        key={`${part}-${index}`}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="underline decoration-hairline2 underline-offset-4 transition-colors hover:text-gold"
      >
        {part}
      </a>
    ) : (
      part
    ),
  );
}

export type LegalPageId = 'impressum' | 'privacy' | 'licenses';

interface LegalSection {
  heading?: string;
  paragraphs?: string[];
  list?: string[];
  subsections?: LegalSection[];
}

export default function LegalDocument({ page }: { page: LegalPageId }) {
  const { t } = useTranslation();
  const sections = t(`legal.${page}.sections`, { returnObjects: true }) as LegalSection[];

  return (
    <article className="mx-auto max-w-content px-4 py-12 md:px-8 md:py-16">
      <header className="mb-10 border-b border-hairline pb-8">
        <p className="pixel-label mb-3 text-[14px] text-gold">{t(`legal.${page}.eyebrow`)}</p>
        <h1 className="font-display text-3xl font-extrabold tracking-wide text-tx-primary md:text-4xl">
          {t(`legal.${page}.title`)}
        </h1>
        {t(`legal.${page}.intro`, { defaultValue: '' }) ? (
          <p className="mt-4 max-w-2xl font-sans text-sm leading-relaxed text-tx-secondary">
            {t(`legal.${page}.intro`)}
          </p>
        ) : null}
      </header>

      <div className="flex flex-col gap-10">
        {sections.map((section, index) => (
          <LegalSectionBlock key={`${section.heading ?? 'section'}-${index}`} section={section} depth={0} />
        ))}
      </div>
    </article>
  );
}

function LegalSectionBlock({ section, depth }: { section: LegalSection; depth: number }) {
  const headingTag = depth === 0 ? 'h2' : depth === 1 ? 'h3' : 'h4';
  const Heading = headingTag as 'h2' | 'h3' | 'h4';

  return (
    <section className={cn(depth > 0 && 'ml-0 border-l border-hairline pl-4 md:pl-6')}>
      {section.heading ? (
        <Heading
          className={cn(
            'font-display font-bold tracking-wide text-tx-primary',
            depth === 0 && 'text-xl md:text-2xl',
            depth === 1 && 'text-lg',
            depth >= 2 && 'text-base',
          )}
        >
          {section.heading}
        </Heading>
      ) : null}

      {section.paragraphs?.map((paragraph, index) => (
        <p
          key={`${section.heading ?? 'p'}-${index}`}
          className={cn(
            'font-sans text-sm leading-relaxed text-tx-secondary',
            (section.heading || index > 0) && 'mt-3',
          )}
        >
          {linkify(paragraph)}
        </p>
      ))}

      {section.list?.length ? (
        <ul className="mt-3 list-disc space-y-1.5 pl-5 font-sans text-sm leading-relaxed text-tx-secondary">
          {section.list.map((item, index) => (
            <li key={`${section.heading ?? 'li'}-${index}`}>{item}</li>
          ))}
        </ul>
      ) : null}

      {section.subsections?.map((subsection, index) => (
        <div key={`${subsection.heading ?? 'sub'}-${index}`} className="mt-5">
          <LegalSectionBlock section={subsection} depth={depth + 1} />
        </div>
      ))}
    </section>
  );
}
