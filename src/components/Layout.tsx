/* Layout — shared page furniture (design.md §7, §8, §9.14).
 * Routing pattern A: Layout renders {children}; App wraps <Routes> in <Layout>.
 * Owns the fixed-navbar offset (pt-16) so pages never compensate. */
import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { AnimatePresence, motion, useScroll } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useLocation } from 'react-router';
import Navbar from './Navbar';
import Footer from './Footer';
import SearchCommand from './SearchCommand';
import { destroyLenis, getLenis, initLenis, scrollToTop } from '@/lib/smooth';
import { TYPE_COLORS } from '@/lib/types';
import type { PokemonType } from '@/lib/types';

const SPOTLIGHT_BASE = '120,150,255';

function CursorSpotlight() {
  const [enabled] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const dotRef = useRef<HTMLDivElement>(null);
  const [tint, setTint] = useState(SPOTLIGHT_BASE);

  useEffect(() => {
    if (!enabled) return;
    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let x = tx;
    let y = ty;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };
    const onOver = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest?.('[data-type]') as HTMLElement | null;
      const t = el?.dataset.type as PokemonType | undefined;
      setTint(t && TYPE_COLORS[t] ? TYPE_COLORS[t].rgb : SPOTLIGHT_BASE);
    };
    const loop = () => {
      x += (tx - x) * 0.12; /* ~120ms lerp */
      y += (ty - y) * 0.12;
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${x - 280}px, ${y - 280}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('mouseover', onOver);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-[5] overflow-hidden mix-blend-screen" aria-hidden>
      <div ref={dotRef} className="absolute h-[560px] w-[560px]">
        <AnimatePresence mode="sync">
          <motion.div
            key={tint}
            className="h-full w-full rounded-full"
            style={{ background: `radial-gradient(circle, rgba(${tint},0.08) 0%, transparent 65%)` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        </AnimatePresence>
      </div>
    </div>
  );
}

function BackToTop() {
  const { scrollY } = useScroll();
  const [show, setShow] = useState(false);
  useEffect(() => scrollY.on('change', (v) => setShow(v > 1200)), [scrollY]);
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          aria-label="Back to top"
          onClick={() => scrollToTop(0.8)}
          className="glass group fixed bottom-6 right-6 z-40 grid h-12 w-12 place-items-center rounded-full border border-gold/50 text-gold shadow-glow-gold transition-colors hover:border-gold"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 420, damping: 30 }}
        >
          <ArrowUp size={20} strokeWidth={1.75} className="transition-transform duration-300 group-hover:-translate-y-1" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    initLenis();
    return () => destroyLenis();
  }, []);

  /* Scroll restoration: reset to top on every route change. Lenis keeps its own
   * virtual scroll offset, so it must be reset too — otherwise a page mounted
   * after a scrolled page (e.g. detail → maps) starts mid-scroll and fixed-height
   * decks appear "shifted up" with no way back. */
  useEffect(() => {
    getLenis()?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
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
      <main className="relative pt-16">{children}</main>
      <Footer />
      <SearchCommand variant="modal" open={searchOpen} onClose={() => setSearchOpen(false)} />
      <BackToTop />
      <CursorSpotlight />
      <div className="grain-overlay fixed inset-0 z-[70]" aria-hidden />
    </div>
  );
}
