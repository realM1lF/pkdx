/* Maps — `/maps` ATLAS region select (maps.md §1).
 * 5 region cards with accent mini-schematics + coverage chips,
 * "how it reads" legend strip, compact header stats. */
import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import MotionRoot from '@/components/MotionRoot';
import { useTranslation } from 'react-i18next';
import RegionCard, { SoonCard } from './maps/RegionCard';
import { LinkKindGlyphs, NodeKindGlyphs } from './maps/LegendGlyphs';
import { REGIONS, TOTAL_LOCATIONS } from '@/lib/regions';
import './maps/maps.css';

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

function useCountUp(target: number, duration = 1200, delay = 250): number {
  const reduced = useReducedMotion();
  const [value, setValue] = useState(reduced ? target : 0);
  useEffect(() => {
    if (reduced) {
      setValue(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now() + delay;
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - t0) / duration));
      const e = t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setValue(Math.round(target * e));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, delay, reduced]);
  return value;
}

const reveal = (i: number) => ({
  initial: { opacity: 0, y: 40, filter: 'blur(8px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  transition: { duration: 0.6, ease: EASE, delay: i * 0.06 },
});

export default function Maps() {
  const { t } = useTranslation();
  const regions = useCountUp(REGIONS.length);
  const locations = useCountUp(TOTAL_LOCATIONS, 1200, 350);

  return (
    <MotionRoot>
    <div className="relative">
      {/* §1.1 header */}
      <header className="mx-auto flex max-w-content flex-wrap items-end justify-between gap-6 px-4 pb-10 pt-12 sm:px-8">
        <div className="max-w-[37.5rem]">
          <motion.p {...reveal(0)} className="pixel-label text-[14px] text-gold">
            {t('maps.atlasEyebrow')}
          </motion.p>
          <motion.h1
            {...reveal(1)}
            className="mt-3 font-display text-[clamp(2rem,4.5vw,52px)] font-extrabold leading-[1.1] text-tx-primary"
          >
            {t('maps.atlasTitle')}
          </motion.h1>
          <motion.p {...reveal(2)} className="mt-3 max-w-[35rem] text-[0.875rem] font-medium leading-relaxed text-tx-secondary">
            {t('maps.atlasBlurb')}
          </motion.p>
        </div>
        <motion.div {...reveal(3)} className="hidden items-center gap-2 text-micro12 font-medium text-tx-muted md:flex">
          <span className="font-display text-[0.875rem] font-bold tabular-nums text-tx-primary">{regions}</span> {t('maps.regions')}
          <span aria-hidden>·</span>
          <span className="font-display text-[0.875rem] font-bold tabular-nums text-tx-primary">{locations}</span> {t('maps.locations')}
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1.5">
            <span className="maps-scan-dot inline-block h-1.5 w-1.5 rounded-full bg-type-grass" />
            {t('maps.live')}
          </span>
        </motion.div>
      </header>

      {/* §1.2 region grid */}
      <section className="mx-auto grid max-w-content grid-cols-1 gap-4 px-4 sm:px-8 lg:grid-cols-2" aria-label={t('maps.regionsAria')}>
        {REGIONS.map((r, i) => (
          <RegionCard key={r.region} region={r} index={i} />
        ))}
        <SoonCard index={REGIONS.length} />
      </section>

      {/* §1.3 how it reads */}
      <section className="mx-auto mt-4 grid max-w-content grid-cols-1 gap-4 px-4 sm:px-8 md:grid-cols-3" aria-label={t('maps.howAria')}>
        {[
          { title: t('maps.howNodeKinds'), body: <NodeKindGlyphs /> },
          { title: t('maps.howLinkKinds'), body: <LinkKindGlyphs /> },
          {
            title: t('maps.howData'),
            body: (
              <p className="text-micro12 font-medium leading-relaxed text-tx-secondary">
                {t('maps.howDataBody')}
              </p>
            ),
          },
        ].map((cell, i) => (
          <motion.div
            key={cell.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-15%' }}
            transition={{ duration: 0.4, ease: EASE, delay: i * 0.06 }}
            className="rounded-md border border-hairline bg-surface1 p-4"
          >
            <div className="pixel-label mb-3 text-[9px] text-tx-muted">{cell.title}</div>
            {cell.body}
          </motion.div>
        ))}
      </section>

      {/* §1.4 footer note */}
      <p className="mx-auto max-w-content px-4 py-8 text-center text-micro12 font-medium text-tx-muted sm:px-8">
        {t('maps.footerNote')}
      </p>
    </div>
    </MotionRoot>
  );
}
