/* Footer — design.md §9.2. */
import { Link, useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { MAX_DEX_ID } from '@/lib/types';

const HAIRLINE =
  'linear-gradient(90deg, rgba(255,122,69,0.4), rgba(255,214,10,0.4), rgba(99,217,107,0.4), rgba(69,200,255,0.4), rgba(255,92,168,0.4), rgba(255,154,213,0.4))';

export default function Footer() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const random = () => navigate(`/pokemon/${1 + Math.floor(Math.random() * MAX_DEX_ID)}`);

  const linkCls =
    'inline-block font-sans text-sm text-tx-secondary transition-all duration-200 hover:translate-x-1 hover:text-gold';

  return (
    <footer className="relative mt-0">
      <div className="h-px w-full" style={{ background: HAIRLINE }} />
      <div className="mx-auto grid max-w-content gap-10 px-4 py-16 md:grid-cols-3 md:px-8">
        {/* Brand */}
        <div className="flex flex-col items-start gap-4">
          <div className="flex items-center gap-2.5">
            <img src="/logo.svg" alt="" className="h-8 w-8" />
            <span className="font-display text-lg font-extrabold tracking-wide">POKÉDEX</span>
            <span className="pixel-label text-[10px] text-gold">2.0</span>
          </div>
          <p className="font-sans text-sm text-tx-secondary">{t('footer.tagline')}</p>
          <span className="pixel-label text-[9px] text-tx-muted">{t('footer.phase')}</span>
        </div>

        {/* Explore */}
        <div className="flex flex-col gap-3">
          <h4 className="pixel-label mb-1 text-[10px] text-tx-muted">{t('footer.explore')}</h4>
          <Link to="/" className={linkCls}>
            {t('footer.home')}
          </Link>
          <Link to="/pokedex" className={linkCls}>
            {t('footer.pokedex')}
          </Link>
          <button type="button" onClick={random} className={`${linkCls} text-left`}>
            {t('footer.random')}
          </button>
        </div>

        {/* Data */}
        <div className="flex flex-col gap-3">
          <h4 className="pixel-label mb-1 text-[10px] text-tx-muted">{t('footer.data')}</h4>
          <p className="font-sans text-sm text-tx-secondary">
            {t('footer.dataCredits')}{' '}
            <a
              href="https://pokeapi.co"
              target="_blank"
              rel="noreferrer"
              className="underline decoration-hairline2 underline-offset-4 transition-colors hover:text-gold"
            >
              PokéAPI
            </a>{' '}
            ·{' '}
            <a
              href="https://github.com/PokeAPI/sprites"
              target="_blank"
              rel="noreferrer"
              className="underline decoration-hairline2 underline-offset-4 transition-colors hover:text-gold"
            >
              PokeAPI Sprites Repo
            </a>
          </p>
          <p className="font-sans text-xs text-tx-muted">
            {t('footer.fanProject')}
          </p>
        </div>
      </div>

      <div className="border-t border-hairline">
        <div className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-3 px-4 py-6 md:px-8">
          <span className="pixel-label text-[9px] text-tx-muted">{t('footer.madeWith')}</span>
          <span className="pixel-label rounded-pill border border-hairline bg-surface2 px-3 py-1.5 text-[9px] text-gold">
            v1.0-phase-01
          </span>
        </div>
      </div>
    </footer>
  );
}
