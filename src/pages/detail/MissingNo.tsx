/* MISSINGNO 404 — pokemon-detail.md §7. Glitch silhouette (3 clip-path slices),
 * gold — never red. */
import { Link } from 'react-router';
import { motion } from 'framer-motion';

export default function MissingNo({ query }: { query: string }) {
  return (
    <div className="mx-auto flex max-w-content flex-col items-center px-4 py-24 text-center">
      <span className="pixel-label text-[10px] text-gold">ERROR · ENTRY “{query}” NOT FOUND</span>

      {/* glitching silhouette */}
      <div className="relative mt-8 h-32 w-32" aria-hidden>
        {[0, 1, 2].map((i) => (
          <img
            key={i}
            src="/pokeball.svg"
            alt=""
            className="dx-glitch-slice opacity-30 invert"
            draggable={false}
          />
        ))}
      </div>

      <motion.h1
        className="mt-8 font-display text-3xl font-black uppercase tracking-wide text-tx-primary md:text-4xl"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        A wild <span className="text-gold">MISSINGNO</span> appeared
      </motion.h1>
      <p className="mt-3 max-w-md font-sans text-sm text-tx-secondary">
        This Pokédex entry does not exist in the National Dex (1–1025). Glitch readings suggest you
        return to safety.
      </p>
      <Link
        to="/pokedex"
        className="mt-8 inline-flex h-10 items-center rounded-md border border-gold/60 bg-gold-soft px-6 font-display text-[12px] font-bold uppercase tracking-wider text-tx-primary transition-all duration-200 hover:-translate-y-0.5 hover:shadow-glow-gold"
      >
        Return to the Dex
      </Link>
    </div>
  );
}
