/* Standalone Versus lab — /versus. Deep-linkable: ?you=<id> pre-fills your
 * side (team-builder VS button lands here), ?vs=<id> the opponent, ?game=
 * the version group — all params stay in the URL for sharing. */
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import VersusPanel from './detail/VersusPanel';
import QaSection from '@/components/QaSection';
import { versusContextFromGame, DEFAULT_VERSUS_PAGE_GAME } from '@/lib/versus-context';

interface QaRaw {
  q: string;
  aLead: string;
  aBody: string;
}

export default function Versus() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const qa = t('seo.versus.qa', { returnObjects: true }) as QaRaw[];

  const youParam = Number(searchParams.get('you'));
  const initialYou = Number.isInteger(youParam) && youParam >= 1 ? youParam : null;
  const vsParam = searchParams.get('vs');
  const gameParam = searchParams.get('game');

  const patchParams = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams);
    for (const [k, v] of Object.entries(patch)) {
      if (v == null || v === '') next.delete(k);
      else next.set(k, v);
    }
    setSearchParams(next, { replace: true });
  };

  /* Persist default game in the URL so /versus links are shareable. */
  useEffect(() => {
    if (!gameParam) patchParams({ game: DEFAULT_VERSUS_PAGE_GAME });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount when ?game= is absent
  }, []);

  return (
    <div className="mx-auto max-w-content px-4 pb-20 pt-6 md:px-8">
      <header className="mb-4">
        <p className="pixel-label text-[9px] text-gold">{t('versus.pageEyebrow')}</p>
        <h1 className="font-display text-2xl font-extrabold uppercase tracking-wide text-tx-primary md:text-3xl">
          {t('versus.pageTitle')}
        </h1>
        <p className="mt-1 max-w-xl font-sans text-[13px] text-tx-secondary">{t('versus.pageHint')}</p>
      </header>
      <VersusPanel
        key={`${initialYou ?? ''}|${vsParam ?? ''}|${gameParam ?? ''}`}
        initialYou={initialYou}
        initialVs={vsParam}
        context={versusContextFromGame(gameParam ?? DEFAULT_VERSUS_PAGE_GAME, null)}
        onYouChange={(id) => patchParams({ you: id != null ? String(id) : null })}
        onOpponentChange={(id) => patchParams({ vs: id != null ? String(id) : null })}
        onGameChange={(game) => patchParams({ game: game || null })}
      />

      {/* question-driven SEO content below the tool (SEO pilot) */}
      <section className="mx-auto mt-12 max-w-3xl">
        <div className="rounded-lg border border-hairline bg-surface1 px-4 py-5 sm:px-6">
          <p className="pixel-label text-[9px] text-gold">{t('seo.versus.explainerEyebrow')}</p>
          <h2 className="mt-1 font-display text-lg font-bold uppercase tracking-wide text-tx-primary md:text-xl">
            {t('seo.versus.explainerTitle')}
          </h2>
          <p className="mt-2.5 font-sans text-[13.5px] leading-relaxed text-tx-secondary">
            {t('seo.versus.explainerBody')}
          </p>
        </div>
        <QaSection
          className="mt-6"
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
      </section>
    </div>
  );
}
