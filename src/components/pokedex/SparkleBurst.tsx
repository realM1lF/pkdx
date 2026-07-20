/* SparkleBurst — 8 sparkle.svg particles erupting from center (design.md §6.2-6).
 * Mount to play; parent keys by burst id so each toggle re-plays. */
import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  x: number;
  y: number;
  scale: number;
  delay: number;
}

/* deterministic pseudo-random (render-pure; react-hooks/purity forbids Math.random) */
function rand(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export default function SparkleBurst({ spread = 1 }: { spread?: number }) {
  const particles = useMemo<Particle[]>(
    () =>
      Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2 + rand(i * 3 + 1) * 0.5;
        const dist = (34 + rand(i * 3 + 2) * 40) * spread;
        return {
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist,
          scale: 0.6 + rand(i * 3 + 3) * 0.7,
          delay: i * 0.03,
        };
      }),
    [spread],
  );

  return (
    <span className="pointer-events-none absolute inset-0 z-[3] grid place-items-center" aria-hidden>
      {particles.map((p, i) => (
        <motion.img
          key={i}
          src="/sparkle.svg"
          alt=""
          draggable={false}
          className="absolute h-3 w-3"
          initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
          animate={{ x: p.x, y: p.y, scale: [0, p.scale, 0], opacity: [1, 1, 0] }}
          transition={{ duration: 0.7, delay: p.delay, ease: 'easeOut' }}
        />
      ))}
    </span>
  );
}
