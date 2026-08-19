/* Layout — shared page furniture (design.md §7, §8, §9.14).
 * Routing pattern A: Layout renders {children}; App wraps <Routes> in <Layout>.
 * Owns the fixed-navbar offset (pt-16) so pages never compensate.
 * Heavy chrome (Lenis, cloud-sync, framer spotlight) boots after first paint. */
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useLocation, useNavigationType } from 'react-router';
import Navbar from './Navbar';
import Footer from './Footer';
import { isDeferredChromeAllowed, scheduleIdle } from '@/lib/idle-boot';

const SearchCommand = lazy(() => import('./SearchCommand'));
const ShellChrome = lazy(() => import('./ShellChrome'));

export default function Layout({ children }: { children: ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [chromeReady, setChromeReady] = useState(false);
  const { pathname } = useLocation();
  const navigationType = useNavigationType();
  const lenisReady = useRef(false);

  useEffect(() => {
    if (!isDeferredChromeAllowed()) return;
    let dead = false;
    const stop = scheduleIdle(() => {
      if (dead) return;
      void import('@/lib/smooth').then((m) => {
        if (dead) return;
        m.initLenis();
        lenisReady.current = true;
      });
      void import('@/lib/cloud-sync').then((m) => m.bootCloudSync());
      setChromeReady(true);
    });
    return () => {
      dead = true;
      stop();
      if (lenisReady.current) {
        void import('@/lib/smooth').then((m) => m.destroyLenis());
        lenisReady.current = false;
      }
    };
  }, []);

  /* Scroll restoration: history back/forward keeps position; Pokédex re-applies
   * its saved offset after mount. Forward navigations still jump to top. */
  useEffect(() => {
    if (navigationType === 'POP') return;

    window.scrollTo(0, 0);
    if (lenisReady.current) {
      void import('@/lib/smooth').then((m) => {
        m.getLenis()?.scrollTo(0, { immediate: true });
      });
    }
  }, [pathname, navigationType]);

  /* Plausible: SPA route changes (initial pageview is sent by plausible.init in index.html). */
  const plausibleBoot = useRef(true);
  useEffect(() => {
    if (plausibleBoot.current) {
      plausibleBoot.current = false;
      return;
    }
    window.plausible?.('pageview');
  }, [pathname]);

  /* "/" hotkey opens global search */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing =
        target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
      if (e.key === '/' && !typing) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="relative min-h-[100dvh] overflow-x-clip bg-void text-tx-primary">
      <Navbar onSearchOpen={() => setSearchOpen(true)} />
      <main className="relative pt-16 md:pt-[6.5rem]">
        {children}
      </main>
      <Footer />
      {searchOpen && (
        <Suspense fallback={null}>
          <SearchCommand variant="modal" open onClose={() => setSearchOpen(false)} />
        </Suspense>
      )}
      {chromeReady && (
        <Suspense fallback={null}>
          <ShellChrome />
        </Suspense>
      )}
      <div className="grain-overlay fixed inset-0 z-[70]" aria-hidden />
    </div>
  );
}
