/* Navbar — design.md §9.1. Fixed 64px, transparent → glass after 24px scroll.
 * Layout owns the matching top offset (navbar positioning contract). */
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router';
import { LocaleLink, useLocalePath, withTrailingSlash } from '@/lib/locale-link';
import { BookOpen, Ghost, GitCompareArrows, Heart, Info, LayoutGrid, Map, Menu, MessageSquarePlus, Package, Search, Users, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import LanguageToggle from './LanguageToggle';
import ZoomControl from './ZoomControl';
import { isDeferredChromeAllowed, scheduleIdle } from '@/lib/idle-boot';

const AccountButton = lazy(() => import('./AccountButton'));

const UTILITY_LINKS = [
  { to: '/about', key: 'nav.about', Icon: Info },
  { to: '/feedback', key: 'nav.feedback', Icon: MessageSquarePlus },
  { to: '/support', key: 'nav.support', Icon: Heart },
];

const LINKS = [
  { to: '/pokedex', key: 'nav.pokedex', Icon: BookOpen },
  { to: '/items', key: 'nav.items', Icon: Package },
  { to: '/maps', key: 'nav.maps', Icon: Map },
  { to: '/nuzlocke', key: 'nav.nuzlocke', Icon: Users },
  { to: '/orre', key: 'nav.orre', Icon: Ghost },
  { to: '/team', key: 'nav.team', Icon: LayoutGrid },
  { to: '/versus', key: 'nav.versus', Icon: GitCompareArrows },
] as const;

interface NavbarProps {
  onSearchOpen: () => void;
}

export default function Navbar({ onSearchOpen }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [accountReady, setAccountReady] = useState(false);
  const { t } = useTranslation();
  const localePath = useLocalePath();
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = progressRef.current;
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      if (!bar) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      bar.style.transform = `scaleX(${p})`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    const stopIdle = isDeferredChromeAllowed()
      ? scheduleIdle(() => setAccountReady(true))
      : () => {};
    return () => {
      stopIdle();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 h-16 transition-all duration-200 md:h-[6.5rem]',
          scrolled ? 'glass border-b border-hairline' : 'border-b border-transparent bg-transparent',
        )}
      >
        <nav className="mx-auto flex h-16 max-w-content items-center gap-3 px-4 md:gap-4 md:px-8">
          {/* brand */}
          <LocaleLink to="/" className="group flex shrink-0 items-center gap-2.5" aria-label={t('nav.home')}>
            <img
              src="/logo.svg"
              alt=""
              className="h-8 w-8 transition-transform duration-400 ease-out-expo group-hover:rotate-180"
            />
            <span className="hidden font-display text-lg font-extrabold tracking-wide text-tx-primary sm:inline">
              MYPOKE<span className="text-gold">PANION</span>
            </span>
          </LocaleLink>

          <button
            type="button"
            onClick={onSearchOpen}
            className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-md border border-hairline bg-surface2 px-3 text-left text-tx-muted transition-all duration-200 hover:border-gold/50 hover:text-tx-primary focus-visible:border-gold/70 focus-visible:shadow-glow-gold md:h-11 md:px-4"
            aria-label={t('nav.openSearch')}
          >
            <Search size={16} strokeWidth={1.75} className="shrink-0" />
            <span className="min-w-0 flex-1 truncate font-sans text-sm text-tx-muted">
              {t('nav.searchHint')}
            </span>
            <kbd className="pixel-label hidden shrink-0 rounded-sm border border-hairline2 px-1.5 py-0.5 text-[9px] lg:inline">
              /
            </kbd>
          </button>

          {/* right cluster */}
          <div className="flex shrink-0 items-center gap-2">
            <ZoomControl className="hidden md:flex" />
            {accountReady ? (
              <Suspense fallback={<span className="inline-block h-10 w-10" aria-hidden />}>
                <AccountButton />
              </Suspense>
            ) : (
              <span className="inline-block h-10 w-10" aria-hidden />
            )}
            <LanguageToggle className="hidden sm:flex" />
            <button
              type="button"
              onClick={() => setDrawer(true)}
              aria-label={t('nav.openMenu')}
              className="grid h-10 w-10 place-items-center rounded-md border border-hairline bg-surface2 text-tx-secondary transition-colors hover:text-tx-primary md:hidden"
            >
              <Menu size={18} strokeWidth={1.75} />
            </button>
          </div>
        </nav>

        {/* second row: main nav left, about / feedback / support right.
            desktop/tablet only; mobile keeps the hamburger drawer */}
        <div className="hidden border-t border-hairline/60 md:block">
          <div className="mx-auto flex h-10 max-w-content items-center gap-4 px-8">
            <div
              className="flex min-w-0 flex-1 items-center gap-4 overflow-x-auto [scrollbar-width:none] lg:gap-6 xl:gap-8 [&::-webkit-scrollbar]:hidden"
              data-lenis-prevent
            >
              {LINKS.map((l) => (
                <NavLink
                  key={l.to}
                  to={withTrailingSlash(localePath(l.to))}
                  className={({ isActive }) =>
                    cn(
                      'group relative flex h-full shrink-0 items-center gap-2 whitespace-nowrap font-sans text-base font-semibold transition-colors duration-200 lg:text-[18px]',
                      isActive ? 'text-gold' : 'text-tx-secondary hover:text-tx-primary',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <l.Icon
                        size={17}
                        strokeWidth={2}
                        className={cn('shrink-0', isActive ? 'text-gold' : 'text-tx-muted group-hover:text-tx-primary')}
                        aria-hidden
                      />
                      {t(l.key)}
                      <span
                        className={cn(
                          'absolute inset-x-0 bottom-0 mx-auto h-0.5 bg-gold transition-all duration-300 ease-out-expo',
                          isActive ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-60',
                        )}
                      />
                    </>
                  )}
                </NavLink>
              ))}
            </div>
            <div className="flex shrink-0 items-center gap-4 lg:gap-6">
              {UTILITY_LINKS.map((l) => (
                <NavLink
                  key={l.to}
                  to={withTrailingSlash(localePath(l.to))}
                  className={({ isActive }) =>
                    cn(
                      'pixel-label inline-flex items-center gap-1.5 text-[10px] tracking-[0.14em] transition-colors duration-200',
                      l.key === 'nav.support'
                        ? 'rainbow-text'
                        : isActive
                          ? 'text-gold'
                          : 'text-tx-muted hover:text-tx-primary',
                    )
                  }
                >
                  <l.Icon
                    size={11}
                    strokeWidth={2}
                    className={l.key === 'nav.support' ? 'text-gold' : undefined}
                    aria-hidden
                  />
                  {t(l.key)}
                </NavLink>
              ))}
            </div>
          </div>
        </div>

        {/* scroll progress hairline */}
        <div
          ref={progressRef}
          className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-gradient-to-r from-gold via-type-fire to-gold"
          style={{ transform: 'scaleX(0)' }}
        />
      </header>

      {/* mobile drawer */}
      {drawer && (
          <div className="fixed inset-0 z-[80] flex flex-col bg-void/95 md:hidden">
            <div className="grain-overlay absolute inset-0" />
            <div className="relative flex h-16 items-center justify-between px-4">
              <span className="pixel-label text-[14px] text-gold">{t('nav.menu')}</span>
              <button
                type="button"
                onClick={() => setDrawer(false)}
                aria-label={t('nav.closeMenu')}
                className="grid h-10 w-10 place-items-center rounded-md border border-hairline bg-surface2 text-tx-secondary transition-all duration-200 hover:rotate-90 hover:text-gold"
              >
                <X size={18} strokeWidth={1.75} />
              </button>
            </div>
            <nav className="relative flex flex-1 flex-col items-start justify-center gap-6 px-8">
              {LINKS.map((l) => (
                <div key={l.to}>
                  <NavLink
                    to={withTrailingSlash(localePath(l.to))}
                    onClick={() => setDrawer(false)}
                    className={({ isActive }) =>
                      cn(
                        'inline-flex items-center gap-3 font-display text-4xl font-extrabold tracking-wide transition-colors',
                        isActive ? 'text-gold' : 'text-tx-primary hover:text-gold',
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <l.Icon
                          size={28}
                          strokeWidth={2}
                          className={cn('shrink-0', isActive ? 'text-gold' : 'text-tx-muted')}
                          aria-hidden
                        />
                        {t(l.key)}
                      </>
                    )}
                  </NavLink>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  setDrawer(false);
                  onSearchOpen();
                }}
                className="mt-4 flex items-center gap-3 rounded-md border border-hairline bg-surface2 px-5 py-3 font-sans text-base font-semibold text-tx-secondary"
              >
                <Search size={18} strokeWidth={1.75} /> {t('nav.searchDrawer')}
              </button>
              {/* utility group (desktop utility bar lives in the drawer on mobile) */}
              <div className="mt-6 flex flex-col items-start gap-2 border-t border-hairline pt-4">
                <span className="pixel-label text-[8px] text-tx-muted">{t('nav.more')}</span>
                {UTILITY_LINKS.map((l) => (
                  <NavLink
                    key={l.to}
                    to={withTrailingSlash(localePath(l.to))}
                    onClick={() => setDrawer(false)}
                    className={({ isActive }) =>
                      cn(
                        'inline-flex items-center gap-2.5 font-display text-xl font-bold tracking-wide transition-colors',
                        l.key === 'nav.support'
                          ? 'rainbow-text'
                          : isActive
                            ? 'text-gold'
                            : 'text-tx-secondary hover:text-gold',
                      )
                    }
                  >
                    <l.Icon
                      size={18}
                      strokeWidth={1.75}
                      className={l.key === 'nav.support' ? 'text-gold' : undefined}
                      aria-hidden
                    />
                    {t(l.key)}
                  </NavLink>
                ))}
              </div>
              <div className="mt-4">
                <LanguageToggle />
              </div>
            </nav>
          </div>
      )}
    </>
  );
}
