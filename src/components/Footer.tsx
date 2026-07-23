/* Footer — design.md §9.2. */
import { useNavigate } from 'react-router';
import { LocaleLink, useLocalePath } from '@/lib/locale-link';
import { useTranslation } from 'react-i18next';
import { currentLang } from '@/lib/i18n-data';
import { MAX_DEX_ID } from '@/lib/types';

/* Lightweight region link metadata — the full region geometry (src/lib/regions.ts,
 * ~80 KB of JSON) must stay OUT of the entry chunk (EP1.2); it loads with the
 * maps/nuzlocke routes. Only id + display names are needed for footer links. */
const REGION_LINKS = [
  { id: 'kanto', name: 'Kanto', nameDe: 'Kanto' },
  { id: 'johto', name: 'Johto', nameDe: 'Johto' },
  { id: 'hoenn', name: 'Hoenn', nameDe: 'Hoenn' },
  { id: 'sinnoh', name: 'Sinnoh', nameDe: 'Sinnoh' },
  { id: 'unova', name: 'Unova', nameDe: 'Einall' },
] as const;

const HAIRLINE =
  'linear-gradient(90deg, rgba(255,122,69,0.4), rgba(255,214,10,0.4), rgba(99,217,107,0.4), rgba(69,200,255,0.4), rgba(255,92,168,0.4), rgba(255,154,213,0.4))';

export default function Footer() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const localePath = useLocalePath();
  const lang = currentLang(i18n.language);
  const random = () => navigate(localePath(`/pokemon/${1 + Math.floor(Math.random() * MAX_DEX_ID)}`));

  const linkCls =
    'inline-block font-sans text-sm text-tx-secondary transition-all duration-200 hover:translate-x-1 hover:text-gold';

  const featureLinks = [
    { to: '/', key: 'footer.home' },
    { to: '/pokedex', key: 'footer.pokedex' },
    { to: '/maps', key: 'footer.maps' },
    { to: '/nuzlocke', key: 'footer.nuzlocke' },
    { to: '/team', key: 'footer.team' },
    { to: '/versus', key: 'footer.versus' },
    { to: '/items', key: 'footer.items' },
  ] as const;

  const legalLinks = [
    { to: '/impressum', key: 'footer.impressum' },
    { to: '/datenschutz', key: 'footer.privacy' },
  ] as const;

  const siteLinks = [
    { to: '/about', key: 'footer.about' },
    { to: '/feedback', key: 'footer.feedback' },
    { to: '/support', key: 'footer.support' },
  ] as const;

  /* external community wikis — grouped DE/EN (user-curated) */
  const wikiLinksDe = [
    { href: 'https://www.bisafans.de', label: 'Bisafans' },
    { href: 'https://pokewiki.de', label: 'PokéWiki' },
    { href: 'https://www.prokedex.com', label: 'Prokedex' },
    { href: 'https://www.pokemon.com/de', label: 'pokemon.com (DE)' },
  ] as const;
  const wikiLinksEn = [
    { href: 'https://bulbapedia.bulbagarden.net', label: 'Bulbapedia' },
    { href: 'https://pokemon.fandom.com', label: 'Pokémon Wiki' },
    { href: 'https://www.pokemon.com/us', label: 'pokemon.com (EN)' },
  ] as const;

  return (
    <footer className="relative mt-0">
      <div className="h-px w-full" style={{ background: HAIRLINE }} />
      <div className="mx-auto grid max-w-content gap-10 px-4 py-16 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 md:px-8">
        {/* Brand */}
        <div className="flex flex-col items-start gap-4 sm:col-span-2 lg:col-span-1 xl:col-span-1">
          <div className="flex items-center gap-2.5">
            <img src="/logo.svg" alt="" className="h-8 w-8" />
            <span className="font-display text-lg font-extrabold tracking-wide">
              MYPOKE<span className="text-gold">PANION</span>
            </span>
          </div>
          <p className="font-sans text-sm text-tx-secondary">{t('footer.tagline')}</p>
          <span className="pixel-label text-[9px] text-tx-muted">{t('footer.phase')}</span>
        </div>

        {/* Features */}
        <div className="flex flex-col gap-3">
          <h4 className="pixel-label mb-1 text-[10px] text-tx-muted">{t('footer.explore')}</h4>
          {featureLinks.map(({ to, key }) => (
            <LocaleLink key={to} to={to} className={linkCls}>
              {t(key)}
            </LocaleLink>
          ))}
          <button type="button" onClick={random} className={`${linkCls} text-left`}>
            {t('footer.random')}
          </button>
        </div>

        {/* Regions */}
        <div className="flex flex-col gap-3">
          <h4 className="pixel-label mb-1 text-[10px] text-tx-muted">{t('footer.regions')}</h4>
          <LocaleLink to="/maps" className={linkCls}>
            {t('footer.mapsAtlas')}
          </LocaleLink>
          {REGION_LINKS.map((region) => (
            <LocaleLink key={region.id} to={`/maps/${region.id}`} className={linkCls}>
              {lang === 'de' ? region.nameDe : region.name}
            </LocaleLink>
          ))}
        </div>

        {/* Site: about / feedback / support */}
        <div className="flex flex-col gap-3">
          <h4 className="pixel-label mb-1 text-[10px] text-tx-muted">{t('footer.site')}</h4>
          {siteLinks.map(({ to, key }) => (
            <LocaleLink key={to} to={to} className={linkCls}>
              {t(key)}
            </LocaleLink>
          ))}
        </div>

        {/* Community wikis (external, DE + EN) */}
        <div className="flex flex-col gap-3">
          <h4 className="pixel-label mb-1 text-[10px] text-tx-muted">{t('footer.community')}</h4>
          <span className="pixel-label text-[8px] text-tx-muted/70">DE</span>
          {wikiLinksDe.map(({ href, label }) => (
            <a key={href} href={href} target="_blank" rel="noopener noreferrer" className={linkCls}>
              {label} ↗
            </a>
          ))}
          <span className="pixel-label mt-2 text-[8px] text-tx-muted/70">EN</span>
          {wikiLinksEn.map(({ href, label }) => (
            <a key={href} href={href} target="_blank" rel="noopener noreferrer" className={linkCls}>
              {label} ↗
            </a>
          ))}
        </div>

        {/* Legal */}
        <div className="flex flex-col gap-3">
          <h4 className="pixel-label mb-1 text-[10px] text-tx-muted">{t('footer.legal')}</h4>
          {legalLinks.map(({ to, key }) => (
            <LocaleLink key={to} to={to} className={linkCls}>
              {t(key)}
            </LocaleLink>
          ))}
        </div>

        {/* Data */}
        <div className="flex flex-col gap-3 sm:col-span-2 lg:col-span-1 xl:col-span-1">
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
          <p className="font-sans text-xs text-tx-muted">{t('footer.fanProject')}</p>
        </div>
      </div>

      <div className="border-t border-hairline">
        <div className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-3 px-4 py-6 md:px-8">
          <span className="pixel-label text-[9px] text-tx-muted">{t('footer.madeWith')}</span>
          <div className="flex flex-wrap items-center gap-3">
            <LocaleLink to="/impressum" className="pixel-label text-[9px] text-tx-muted transition-colors hover:text-gold">
              {t('footer.impressum')}
            </LocaleLink>
            <LocaleLink to="/datenschutz" className="pixel-label text-[9px] text-tx-muted transition-colors hover:text-gold">
              {t('footer.privacy')}
            </LocaleLink>
            <span className="pixel-label rounded-pill border border-hairline bg-surface2 px-3 py-1.5 text-[9px] text-gold">
              v1.0-phase-01
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
