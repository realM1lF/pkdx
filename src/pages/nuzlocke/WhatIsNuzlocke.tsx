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

function ExtLink({
  href,
  label,
  className,
}: {
  href: string;
  label: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border border-hairline bg-surface2/80 px-3 py-1.5 font-sans text-[11px] font-semibold text-tx-secondary transition-colors hover:border-gold/50 hover:text-gold',
        className,
      )}
    >
      {label}
      <ExternalLink size={11} className="shrink-0 opacity-60" aria-hidden />
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
    <section className="mt-10" aria-labelledby="nuz-what-is-heading">
      <div className="mb-3 flex items-baseline gap-3">
        <h2 id="nuz-what-is-heading" className="font-display text-[18px] font-bold uppercase text-tx-primary">
          {t('nuz.whatIsSection.title')}
        </h2>
        <PixelLabel>{t('nuz.whatIsSection.eyebrow')}</PixelLabel>
      </div>

      <div className="rounded-lg border border-hairline bg-surface1/60 p-4 md:grid md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] md:gap-8 md:p-5">
        <div className="min-w-0">
          <p className="text-[13px] leading-relaxed text-tx-secondary">{t('nuz.whatIsSection.intro')}</p>
          <p className="mt-3 text-[12px] leading-relaxed text-tx-muted">{t('nuz.whatIsSection.variants')}</p>
        </div>

        <div className="mt-5 min-w-0 md:mt-0">
          <PixelLabel className="text-gold/80">{t('nuz.whatIsSection.rulesHeading')}</PixelLabel>
          <ul className="mt-2 space-y-2">
            {Array.isArray(rules) &&
              rules.map((rule) => (
                <li key={rule} className="flex gap-2 text-[12px] leading-snug text-tx-secondary">
                  <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-gold/80" aria-hidden />
                  <span>{rule}</span>
                </li>
              ))}
          </ul>

          <div className="mt-5 border-t border-hairline pt-4">
            <PixelLabel>{t('nuz.whatIsSection.linksHeading')}</PixelLabel>
            <div className="mt-2 flex flex-wrap gap-2">
              <ExtLink href={LINKS.official} label={t('nuz.whatIsSection.linkOfficial')} />
              <ExtLink href={wikiPrimary.href} label={wikiPrimary.label} />
              <ExtLink
                href={wikiSecondary.href}
                label={wikiSecondary.label}
                className="border-transparent bg-transparent px-2 text-tx-muted hover:bg-surface2/80"
              />
            </div>
            <p className="mt-2 font-pixel text-[7px] tracking-[0.06em] text-tx-muted/70">
              {t('nuz.whatIsSection.externalHint')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
