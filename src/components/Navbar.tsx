/* Navbar — design.md §9.1. Fixed 64px, transparent → glass after 24px scroll.
 * Layout owns the matching top offset (navbar positioning contract). */
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router';
import { LocaleLink, useLocalePath } from '@/lib/locale-link';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { Menu, Search, Sparkles, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useShiny } from '@/lib/shiny';
import { cn } from '@/lib/utils';
import LanguageToggle from './LanguageToggle';

const LINKS = [
  { to: '/pokedex', key: 'nav.pokedex' },
  { to: '/maps', key: 'nav.maps' },
  { to: '/nuzlocke', key: 'nav.nuzlocke' },
  { to: '/team', key: 'nav.team' },
  { to: '/versus', key: 'nav.versus' },
];

interface NavbarProps {
  onSearchOpen: () => void;
}

export default function Navbar({ onSearchOpen }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const { shiny, toggleShiny } = useShiny();
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
          'fixed inset-x-0 top-0 z-50 h-16 transition-all duration-200',
          scrolled ? 'glass border-b border-hairline' : 'border-b border-transparent bg-transparent',
        )}
      >
        <nav className="mx-auto flex h-full max-w-content items-center justify-between gap-4 px-4 md:px-8">
          {/* brand */}
          <LocaleLink to="/" className="group flex shrink-0 items-center gap-2.5" aria-label={t('nav.home')}>
            <img
              src="/logo.svg"
              alt=""
              className="h-8 w-8 transition-transform duration-400 ease-out-expo group-hover:rotate-180"
            />
            <span className="font-display text-lg font-extrabold tracking-wide text-tx-primary">POKÉDEX</span>
            <span className="pixel-label text-[10px] text-gold">2.0</span>
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
              onClick={toggleShiny}
              aria-pressed={shiny}
              aria-label={t('nav.toggleShiny')}
              className={cn(
                'grid h-10 w-10 place-items-center rounded-md border transition-all duration-200',
                shiny
                  ? 'border-gold/60 bg-gold-soft text-gold shadow-glow-gold'
                  : 'border-hairline bg-surface2 text-tx-muted hover:border-hairline2 hover:text-tx-primary',
              )}
            >
              <Sparkles size={18} strokeWidth={1.75} />
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
                    to={localePath(l.to)}
                    end={l.to === '/'}
                    onClick={() => setDrawer(false)}
                    className={({ isActive }) =>
                      cn(
                        'font-display text-4xl font-extrabold uppercase tracking-wide transition-colors',
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
