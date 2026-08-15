/* Feedback — bug reports & feature requests via GitHub Issue Forms.
 * Two accent cards (like the toolkit cards) linking to pre-templated issues. */
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import MotionRoot from '@/components/MotionRoot';
import { Bug, Lightbulb, ArrowUpRight, Github } from 'lucide-react';
import { accentRgb } from '@/lib/regions';

const REPO = 'https://github.com/realM1lF/pkdx';
const BUG_URL = `${REPO}/issues/new?template=bug_report.yml`;
const FEATURE_URL = `${REPO}/issues/new?template=feature_request.yml`;
const ISSUES_URL = `${REPO}/issues`;

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

interface CardDef {
  Icon: typeof Bug;
  accent: string;
  titleKey: string;
  textKey: string;
  ctaKey: string;
  url: string;
}

const CARDS: CardDef[] = [
  {
    Icon: Bug,
    accent: '#E14D6B',
    titleKey: 'feedback.bug.title',
    textKey: 'feedback.bug.text',
    ctaKey: 'feedback.bug.cta',
    url: BUG_URL,
  },
  {
    Icon: Lightbulb,
    accent: '#F5C945',
    titleKey: 'feedback.feature.title',
    textKey: 'feedback.feature.text',
    ctaKey: 'feedback.feature.cta',
    url: FEATURE_URL,
  },
];

export default function Feedback() {
  const { t } = useTranslation();

  return (
    <MotionRoot>
    <div className="mx-auto max-w-content px-4 pb-20 pt-6 md:px-8">
      <header className="mb-8">
        <p className="pixel-label text-[9px] text-gold">{t('feedback.eyebrow')}</p>
        <h1 className="font-display text-2xl font-extrabold tracking-wide text-tx-primary md:text-3xl">
          {t('feedback.title')}
        </h1>
        <p className="mt-2 max-w-2xl font-sans text-[14px] leading-relaxed text-tx-secondary">
          {t('feedback.intro')}
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-2">
        {CARDS.map(({ Icon, accent, titleKey, textKey, ctaKey, url }, i) => {
          const rgb = accentRgb(accent);
          return (
            <motion.a
              key={titleKey}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE, delay: i * 0.08 }}
              className="group relative overflow-hidden rounded-lg border border-hairline bg-surface1 p-6 transition-all duration-200 hover:-translate-y-1"
              style={{ ['--card-rgb' as string]: rgb }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `rgba(${rgb},0.55)`;
                e.currentTarget.style.boxShadow = `0 8px 40px rgba(${rgb},0.22)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '';
                e.currentTarget.style.boxShadow = '';
              }}
            >
              <Icon
                size={150}
                strokeWidth={0.75}
                className="pointer-events-none absolute -bottom-5 -right-5 opacity-[0.08] transition-opacity duration-300 group-hover:opacity-[0.16]"
                style={{ color: accent }}
                aria-hidden
              />
              <div className="relative">
                <span
                  className="grid h-11 w-11 place-items-center rounded-md border"
                  style={{ borderColor: `rgba(${rgb},0.4)`, color: accent, background: `rgba(${rgb},0.10)` }}
                >
                  <Icon size={20} strokeWidth={1.75} />
                </span>
                <h2 className="mt-4 font-display text-xl font-extrabold tracking-wide text-tx-primary">
                  {t(titleKey)}
                </h2>
                <p className="mt-2 max-w-[52ch] font-sans text-[13px] leading-relaxed text-tx-secondary">
                  {t(textKey)}
                </p>
                <span
                  className="mt-5 inline-flex h-9 items-center gap-1.5 rounded-md border px-4 font-display text-[12px] font-bold tracking-wider text-tx-primary transition-transform duration-200 group-hover:-translate-y-0.5"
                  style={{
                    borderColor: `rgba(${rgb},0.6)`,
                    background: `linear-gradient(135deg, rgba(${rgb},0.25), rgba(${rgb},0.10))`,
                  }}
                >
                  {t(ctaKey)}
                  <ArrowUpRight size={14} />
                </span>
              </div>
            </motion.a>
          );
        })}
      </div>

      <p className="mt-8 flex flex-wrap items-center gap-2 font-sans text-[13px] text-tx-muted">
        <Github size={14} className="shrink-0" />
        {t('feedback.githubNote')}
        <a
          href={ISSUES_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-gold underline-offset-2 transition-colors hover:underline"
        >
          {t('feedback.browseIssues')}
        </a>
      </p>
    </div>
    </MotionRoot>
  );
}
