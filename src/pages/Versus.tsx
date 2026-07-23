/* Standalone Versus lab — /versus. Deep-linkable: ?you=<id> pre-fills your
 * side (team-builder VS button lands here), ?vs=<id> the opponent, ?game=
 * the version group — all params stay in the URL for sharing. */
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import VersusPanel from './detail/VersusPanel';
import { versusContextFromGame } from '@/lib/versus';

export default function Versus() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

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
        context={gameParam ? versusContextFromGame(gameParam, null) : undefined}
        onYouChange={(id) => patchParams({ you: id != null ? String(id) : null })}
        onOpponentChange={(id) => patchParams({ vs: id != null ? String(id) : null })}
      />
    </div>
  );
}
