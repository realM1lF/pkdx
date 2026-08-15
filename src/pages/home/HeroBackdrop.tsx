/* HeroBackdrop — nebula + floating type glyphs with GSAP scroll parallax
 * (home.md §1 layers 1 & 3). Dedicated GSAP component — no Framer Motion inside. */
import { useEffect, useRef, useState } from 'react';
import TypeGlyph from '@/components/TypeGlyph';
import { isDeferredChromeAllowed } from '@/lib/idle-boot';
import { TYPE_COLORS } from '@/lib/types';
import type { PokemonType } from '@/lib/types';

const GLYPHS = [
  { type: 'fire', size: 72, pos: { left: '6%', top: '22%' }, opacity: 0.12, dur: 7, rate: 0.6 },
  { type: 'water', size: 84, pos: { right: '8%', top: '18%' }, opacity: 0.1, dur: 8.4, rate: 0.8 },
  { type: 'electric', size: 56, pos: { left: '12%', bottom: '18%' }, opacity: 0.14, dur: 6.2, rate: 0.5 },
  { type: 'grass', size: 64, pos: { right: '14%', bottom: '24%' }, opacity: 0.09, dur: 9, rate: 0.7 },
  { type: 'psychic', size: 48, pos: { left: '28%', top: '12%' }, opacity: 0.1, dur: 6.8, rate: 0.55 },
  { type: 'dragon', size: 96, pos: { right: '30%', top: '9%' }, opacity: 0.08, dur: 8.8, rate: 0.9 },
  { type: 'fairy', size: 56, pos: { left: '44%', bottom: '8%' }, opacity: 0.12, dur: 7.6, rate: 0.65 },
] as const;

export default function HeroBackdrop() {
  const scope = useRef<HTMLDivElement>(null);
  const [parallaxReady, setParallaxReady] = useState(false);

  useEffect(() => {
    if (!isDeferredChromeAllowed()) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    setParallaxReady(true);
  }, []);

  useEffect(() => {
    if (!parallaxReady) return;
    const root = scope.current;
    if (!root) return;
    let dead = false;
    let cleanup = () => {};
    void Promise.all([import('gsap'), import('gsap/ScrollTrigger'), import('@/lib/smooth')]).then(
      ([gsapMod, stMod, smooth]) => {
        if (dead) return;
        const gsap = gsapMod.default;
        const { ScrollTrigger } = stMod;
        gsap.registerPlugin(ScrollTrigger);
        const hero = root.closest('section');
        if (!hero) return;
        const sync = () => ScrollTrigger.update();
        const tweens: { scrollTrigger?: { kill: () => void }; kill: () => void }[] = [];
        tweens.push(
          gsap.to(root.querySelector('[data-layer="nebula"]'), {
            yPercent: 18,
            ease: 'none',
            scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1 },
          }),
        );
        root.querySelectorAll<HTMLElement>('[data-glyph]').forEach((el) => {
          const rate = Number(el.dataset.rate ?? 0.5);
          tweens.push(
            gsap.to(el, {
              y: -rate * 180,
              ease: 'none',
              scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1 },
            }),
          );
        });
        let lenis = smooth.getLenis();
        const unsub = smooth.onLenisReady((instance) => {
          if (dead) return;
          lenis = instance;
          instance.on('scroll', sync);
        });
        cleanup = () => {
          unsub();
          lenis?.off('scroll', sync);
          tweens.forEach((tw) => {
            tw.scrollTrigger?.kill();
            tw.kill();
          });
        };
      },
    );
    return () => {
      dead = true;
      cleanup();
    };
  }, [parallaxReady]);

  return (
    <div ref={scope} className="absolute inset-0" aria-hidden>
      {/* layer 1 — nebula */}
      <div data-layer="nebula" className="absolute -inset-y-24 inset-x-0 min-h-[100svh]">
        <picture>
          <source type="image/avif" srcSet="/hero-nebula.avif" />
          <source type="image/webp" srcSet="/hero-nebula.webp" />
          <img
            src="/hero-nebula.png"
            alt=""
            width={1600}
            height={900}
            fetchPriority="high"
            decoding="async"
            className="h-[100svh] w-full min-h-[100svh] object-cover"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-b from-void/40 via-transparent to-void" />
      </div>
      {/* layer 3 — floating type glyphs */}
      {GLYPHS.map((g) => (
        <div
          key={g.type}
          data-glyph
          data-rate={g.rate}
          className="absolute"
          style={{ ...g.pos, opacity: g.opacity, color: TYPE_COLORS[g.type as PokemonType].base }}
        >
          <TypeGlyph
            type={g.type}
            size={g.size}
            style={{ animation: `floaty ${g.dur}s ease-in-out infinite` }}
          />
        </div>
      ))}
    </div>
  );
}
