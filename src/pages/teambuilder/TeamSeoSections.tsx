/* Team hub SEO copy — prerendered explanation under the existing H1.
 * H2/H3 only. No FAQPage schema (topics.md / improve.md §3). */
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LocaleLink } from '@/lib/locale-link';
import { useLanguage } from '@/lib/i18n-data';
import { battleLandingPath } from '@/lib/seo';

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
        className="inline-flex min-w-0 items-center gap-1.5 font-display text-micro13 font-bold tracking-wide text-gold transition-colors hover:text-tx-primary"
      >
        <span className="min-w-0 truncate">{label}</span>
        <ArrowRight size={11} className="shrink-0" />
      </LocaleLink>
      <p className="mt-1.5 text-[0.7813rem] leading-relaxed text-tx-secondary">{body}</p>
    </div>
  );
}

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
    <div className="mx-auto mt-12 max-w-3xl">
      <section>
        <SectionHeader eyebrow={t('tb.seo.what.eyebrow')} title={t('tb.seo.what.title')} />
        <p className="text-[0.8438rem] leading-relaxed text-tx-secondary">{t('tb.seo.what.body')}</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {FEATURE_KEYS.map((key) => (
            <div key={key} className="min-w-0 rounded-lg border border-hairline bg-surface1 px-4 py-3.5">
              <h3 className="font-display text-micro13 font-bold tracking-wide text-tx-primary">
                {t(`tb.seo.what.${key}.title`)}
              </h3>
              <p className="mt-1.5 text-[0.7813rem] leading-relaxed text-tx-secondary">
                {t(`tb.seo.what.${key}.body`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <SectionHeader eyebrow={t('tb.seo.links.eyebrow')} title={t('tb.seo.links.title')} />
        <div className="grid gap-3 sm:grid-cols-2">
          {LINK_KEYS.map((key) => (
            <LinkCard
              key={key}
              to={linkTo[key]}
              label={t(`tb.seo.links.${key}.label`)}
              body={t(`tb.seo.links.${key}.body`)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
