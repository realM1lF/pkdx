/* Navbar — design.md §9.1. Fixed 64px, transparent → glass after 24px scroll.
 * Layout owns the matching top offset (navbar positioning contract). */
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import { LocaleLink, useLocalePath, withTrailingSlash } from '@/lib/locale-link';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { Heart, Info, Menu, MessageSquarePlus, Search, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import LanguageToggle from './LanguageToggle';
import ZoomControl from './ZoomControl';
import AccountButton from './AccountButton';

const UTILITY_LINKS = [
  { to: '/about', key: 'nav.about', Icon: Info },
  { to: '/feedback', key: 'nav.feedback', Icon: MessageSquarePlus },
  { to: '/support', key: 'nav.support', Icon: Heart },
];

const LINKS = [
  { to: '/pokedex', key: 'nav.pokedex' },
  { to: '/items', key: 'nav.items' },
  { to: '/maps', key: 'nav.maps' },
  { to: '/nuzlocke', key: 'nav.nuzlocke' },
  { to: '/orre', key: 'nav.orre' },
  { to: '/team', key: 'nav.team' },
  { to: '/versus', key: 'nav.versus' },
];

interface NavbarProps {
  onSearchOpen: () => void;
}

export default function Navbar({ onSearchOpen }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const { scrollYProgress } = useScroll();
  const { t } = useTranslation();
  const localePath = useLocalePath();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 h-16 transition-all duration-200 md:h-[6.25rem]',
          scrolled ? 'glass border-b border-hairline' : 'border-b border-transparent bg-transparent',
        )}
      >
        <nav className="mx-auto flex h-16 max-w-content items-center justify-between gap-4 px-4 md:px-8">
          {/* brand */}
          <LocaleLink to="/" className="group flex shrink-0 items-center gap-2.5" aria-label={t('nav.home')}>
            <img
              src="/logo.svg"
              alt=""
              className="h-8 w-8 transition-transform duration-400 ease-out-expo group-hover:rotate-180"
            />
            <span className="font-display text-lg font-extrabold tracking-wide text-tx-primary">
              MYPOKE<span className="text-gold">PANION</span>
            </span>
          </LocaleLink>

          {/* center links (desktop) */}
          <div className="hidden items-center gap-8 md:flex">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'group relative py-2 font-sans text-sm font-semibold transition-colors duration-200',
                    isActive ? 'text-gold' : 'text-tx-secondary hover:text-tx-primary',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {t(l.key)}
                    <span
                      className={cn(
                        'absolute inset-x-0 -bottom-0.5 mx-auto h-0.5 bg-gold transition-all duration-300 ease-out-expo',
                        isActive ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full group-hover:opacity-60',
                      )}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* right cluster */}
          <div className="flex items-center gap-2">
            <ZoomControl className="hidden md:flex" />
            <AccountButton />
            <LanguageToggle className="hidden sm:flex" />
            <button
              type="button"
              onClick={onSearchOpen}
              className="flex h-10 items-center gap-2 rounded-md border border-hairline bg-surface2 px-3 text-tx-muted transition-all duration-200 hover:border-hairline2 hover:text-tx-primary"
              aria-label={t('nav.openSearch')}
            >
              <Search size={16} strokeWidth={1.75} />
              <span className="hidden font-sans text-sm lg:inline">{t('nav.search')}</span>
              <kbd className="pixel-label hidden rounded-sm border border-hairline2 px-1.5 py-0.5 text-[9px] lg:inline">
                /
              </kbd>
            </button>
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

        {/* utility bar — second row: about / feedback / support (+ future).
            desktop only; mobile gets these links in the drawer */}
        <div className="hidden border-t border-hairline/60 md:block">
          <div className="mx-auto flex h-9 max-w-content items-center justify-end gap-6 px-8">
            {UTILITY_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={withTrailingSlash(localePath(l.to))}
                className={({ isActive }) =>
                  cn(
                    'pixel-label inline-flex items-center gap-1.5 text-[8px] tracking-[0.14em] transition-colors duration-200',
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

        {/* scroll progress hairline */}
        <motion.div
          className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-gradient-to-r from-gold via-type-fire to-gold"
          style={{ scaleX: progress }}
        />
      </header>

      {/* mobile drawer */}
      <AnimatePresence>
        {drawer && (
          <motion.div
            className="fixed inset-0 z-[80] flex flex-col bg-void/95 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="grain-overlay absolute inset-0" />
            <div className="relative flex h-16 items-center justify-between px-4">
              <span className="pixel-label text-[10px] text-gold">{t('nav.menu')}</span>
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
              {LINKS.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ y: 24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.08 + i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <NavLink
                    to={withTrailingSlash(localePath(l.to))}
                    end={l.to === '/'}
                    onClick={() => setDrawer(false)}
                    className={({ isActive }) =>
                      cn(
                        'font-display text-4xl font-extrabold tracking-wide transition-colors',
                        isActive ? 'text-gold' : 'text-tx-primary hover:text-gold',
                      )
                    }
                  >
                    {t(l.key)}
                  </NavLink>
                </motion.div>
              ))}
              <motion.button
                type="button"
                initial={{ y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.08 + LINKS.length * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => {
                  setDrawer(false);
                  onSearchOpen();
                }}
                className="mt-4 flex items-center gap-3 rounded-md border border-hairline bg-surface2 px-5 py-3 font-sans text-base font-semibold text-tx-secondary"
              >
                <Search size={18} strokeWidth={1.75} /> {t('nav.searchDrawer')}
              </motion.button>
              {/* utility group (desktop utility bar lives in the drawer on mobile) */}
              <motion.div
                initial={{ y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.10 + LINKS.length * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="mt-6 flex flex-col items-start gap-2 border-t border-hairline pt-4"
              >
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
              </motion.div>
              <motion.div
                initial={{ y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.14 + LINKS.length * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="mt-4"
              >
                <LanguageToggle />
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
