/* HeroBackdrop — nebula + floating type glyphs with GSAP scroll parallax
 * (home.md §1 layers 1 & 3). Dedicated GSAP component — no Framer Motion inside. */
import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import TypeGlyph from '@/components/TypeGlyph';
import { getLenis } from '@/lib/smooth';
import { TYPE_COLORS } from '@/lib/types';
import type { PokemonType } from '@/lib/types';

gsap.registerPlugin(ScrollTrigger);

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

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (window.matchMedia('(pointer: coarse)').matches) return; // parallax off on mobile
      const hero = scope.current?.closest('section');
      if (!hero) return;

      /* keep ScrollTrigger in sync with Lenis smooth scroll */
      const lenis = getLenis();
      const sync = () => ScrollTrigger.update();
      lenis?.on('scroll', sync);

      gsap.to('[data-layer="nebula"]', {
        yPercent: 18, // parallax factor ~0.3 — scrolls slower
        ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1 },
      });
      gsap.utils.toArray<HTMLElement>('[data-glyph]').forEach((el) => {
        const rate = Number(el.dataset.rate ?? 0.5);
        gsap.to(el, {
          y: -rate * 180,
          ease: 'none',
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 1 },
        });
      });

      return () => lenis?.off('scroll', sync);
    },
    { scope },
  );

  return (
    <div ref={scope} className="absolute inset-0" aria-hidden>
      {/* layer 1 — nebula */}
      <div data-layer="nebula" className="absolute -inset-y-24 inset-x-0">
        <img src="/hero-nebula.png" alt="" className="h-full w-full object-cover" />
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
