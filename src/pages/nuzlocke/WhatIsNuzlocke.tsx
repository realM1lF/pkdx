/* Nuzlocke hub — explainer under Active Operations (rules + external refs). */
import { ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/lib/i18n-data';
import { cn } from '@/lib/utils';
import { PixelLabel } from './ui';

const LINKS = {
  official: 'https://www.nuzlocke.com/',
  wikiDe: 'https://www.pokewiki.de/index.php?title=Nuzlocke',
  wikiEn: 'https://bulbapedia.bulbagarden.net/wiki/Nuzlocke_Challenge',
} as const;

function ExtLink({ href, label, subdued }: { href: string; label: string; subdued?: boolean }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex items-center gap-1 font-sans text-[12px] font-semibold transition-colors hover:text-gold',
        subdued ? 'text-tx-muted' : 'text-tx-secondary',
      )}
    >
      {label}
      <ExternalLink size={11} className="shrink-0 opacity-50" aria-hidden />
    </a>
  );
}

export default function WhatIsNuzlocke() {
  const { t } = useTranslation();
  const lang = useLanguage();
  const rules = t('nuz.whatIsSection.rules', { returnObjects: true }) as string[];

  const wikiPrimary =
    lang === 'de'
      ? { href: LINKS.wikiDe, label: t('nuz.whatIsSection.linkWikiDe') }
      : { href: LINKS.wikiEn, label: t('nuz.whatIsSection.linkWikiEn') };
  const wikiSecondary =
    lang === 'de'
      ? { href: LINKS.wikiEn, label: t('nuz.whatIsSection.linkWikiEn') }
      : { href: LINKS.wikiDe, label: t('nuz.whatIsSection.linkWikiDe') };

  return (
    <section className="mt-10 max-w-3xl" aria-labelledby="nuz-what-is-heading">
      <div className="mb-4 flex items-baseline gap-3">
        <h2 id="nuz-what-is-heading" className="font-display text-[18px] font-bold uppercase text-tx-primary">
          {t('nuz.whatIsSection.title')}
        </h2>
        <PixelLabel>{t('nuz.whatIsSection.eyebrow')}</PixelLabel>
      </div>

      <p className="text-[13px] leading-relaxed text-tx-secondary">{t('nuz.whatIsSection.intro')}</p>
      <p className="mt-3 text-[13px] leading-relaxed text-tx-muted">{t('nuz.whatIsSection.variants')}</p>

      <div className="mt-6">
        <PixelLabel className="text-gold/80">{t('nuz.whatIsSection.rulesHeading')}</PixelLabel>
        <ul className="mt-2 space-y-2">
          {Array.isArray(rules) &&
            rules.map((rule) => (
              <li key={rule} className="flex gap-2 text-[13px] leading-snug text-tx-secondary">
                <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-gold/80" aria-hidden />
                <span>{rule}</span>
              </li>
            ))}
        </ul>
      </div>

      <div className="mt-6">
        <PixelLabel>{t('nuz.whatIsSection.linksHeading')}</PixelLabel>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
          <ExtLink href={LINKS.official} label={t('nuz.whatIsSection.linkOfficial')} />
          <ExtLink href={wikiPrimary.href} label={wikiPrimary.label} />
          <ExtLink href={wikiSecondary.href} label={wikiSecondary.label} subdued />
        </div>
        <p className="mt-2 font-pixel text-[7px] tracking-[0.06em] text-tx-muted/70">
          {t('nuz.whatIsSection.externalHint')}
        </p>
      </div>
    </section>
  );
}
