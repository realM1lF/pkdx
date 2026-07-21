/* RegionCard — the atlas card artifact (maps.md §1.2). Accent-coded mini
 * schematic background, coverage chip, stat strip, glow CTAs. */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LocaleLink } from '@/lib/locale-link';
import { motion } from 'framer-motion';
import { ArrowRight, Compass, ExternalLink, Lock } from 'lucide-react';
import MiniSchematic from './MiniSchematic';
import { resolveInteractiveMapLink } from '@/lib/interactive-maps';
import type { RegionMap } from '@/lib/regions';
import { accentRgb, coverageTier, regionName } from '@/lib/regions';
import { useLanguage } from '@/lib/i18n-data';
import { itemCountForRegion } from '@/lib/mapdata';
import { cn } from '@/lib/utils';

const ERA_LINE: Record<string, string> = {
  kanto: 'RGBY · FRLG',
  johto: 'GSC · HGSS',
  hoenn: 'RSE',
  sinnoh: 'DPPt',
  unova: 'BW · B2W2',
};

function CoverageChip({ region }: { region: RegionMap }) {
  const { t } = useTranslation();
  const tier = coverageTier(region);
  const rgb = accentRgb(region.accent);
  if (tier === 'FULL') {
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded-pill border px-2 py-0.5 pixel-label text-[8px]"
        style={{ borderColor: `rgba(${rgb},0.5)`, color: region.accent }}
      >
        <span className="h-2 w-2 rounded-full" style={{ background: region.accent, boxShadow: `0 0 6px rgba(${rgb},0.9)` }} />
        {t('maps.full')}
      </span>
    );
  }
  if (tier === 'PARTIAL') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-pill border border-gold/50 px-2 py-0.5 pixel-label text-[8px] text-gold">
        <span className="h-2 w-2 rounded-full bg-gold/70" />
        {t('maps.partial')}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-pill border border-dashed border-hairline2 px-2 py-0.5 pixel-label text-[8px] text-tx-muted">
      <Lock size={10} />
      {t('maps.soon')}
    </span>
  );
}

export default function RegionCard({ region, index }: { region: RegionMap; index: number }) {
  const { t } = useTranslation();
  const lang = useLanguage();
  const [hover, setHover] = useState(false);
  const [par, setPar] = useState({ x: 0, y: 0 });
  const rgb = accentRgb(region.accent);
  const items = itemCountForRegion(region.region);
  const interactive = resolveInteractiveMapLink(region.region, region.defaultVersion);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-15%' }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 }}
      whileHover={{ y: -6, scale: 1.01 }}
      onHoverStart={() => setHover(true)}
      onHoverEnd={() => {
        setHover(false);
        setPar({ x: 0, y: 0 });
      }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setPar({
          x: ((e.clientX - r.left) / r.width - 0.5) * -12,
          y: ((e.clientY - r.top) / r.height - 0.5) * -12,
        });
      }}
      className="group relative h-60 overflow-hidden rounded-lg border border-hairline bg-surface1 p-4 transition-[border-color,box-shadow] duration-200"
      style={{
        borderColor: hover ? `rgba(${rgb},0.55)` : undefined,
        boxShadow: hover ? `0 8px 40px rgba(${rgb},0.25)` : undefined,
      }}
      data-accent={region.region}
    >
      {/* mini-schematic background, parallaxed against cursor */}
      <div
        className="pointer-events-none absolute -bottom-4 -right-4 h-[130%] w-[70%]"
        style={{ transform: `translate(${par.x}px, ${par.y}px)`, transition: 'transform 150ms ease-out' }}
        aria-hidden
      >
        <MiniSchematic region={region} active={hover} className="h-full w-full" />
      </div>

      <div className="relative flex h-full flex-col">
        {/* top row */}
        <div className="flex items-center justify-between">
          <span className="pixel-label text-[9px] text-tx-muted">{region.gen}</span>
          <CoverageChip region={region} />
        </div>

        {/* title + meta */}
        <h2 className="mt-2 font-display text-[28px] font-extrabold uppercase leading-none tracking-wide text-tx-primary">
          {regionName(region, lang)}
        </h2>
        <p className="mt-1.5 text-[12px] font-medium text-tx-secondary">
          {t('maps.cardMeta', { locations: region.nodes.length, species: region.speciesCount })} · {ERA_LINE[region.region] ?? ''}
        </p>

        <div className="flex-1" />

        {/* stat strip */}
        <div className="grid grid-cols-3 divide-x divide-hairline border-y border-hairline py-2">
          {[
            [t('maps.locations'), region.nodes.length],
            [t('maps.species'), region.speciesCount],
            [t('maps.items'), items],
          ].map(([label, value]) => (
            <div key={label as string} className="px-3 first:pl-0">
              <div className="pixel-label text-[8px] text-tx-muted">{label}</div>
              <div className="font-display text-[18px] font-bold tabular-nums" style={{ color: region.accent }}>
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="mt-3 flex flex-wrap items-center gap-2.5">
          <LocaleLink
            to={`/maps/${region.region}`}
            className={cn(
              'inline-flex h-9 items-center gap-1.5 rounded-md border px-4',
              'font-display text-[12px] font-bold uppercase tracking-wider text-tx-primary',
              'transition-all duration-200 hover:-translate-y-0.5',
            )}
            style={{
              borderColor: `rgba(${rgb},0.6)`,
              background: `linear-gradient(135deg, rgba(${rgb},0.25), rgba(${rgb},0.10))`,
            }}
          >
            {t('maps.openMap')}
            <ArrowRight size={14} />
          </LocaleLink>
          {interactive && (
            <a
              href={interactive.url}
              target="_blank"
              rel="noopener noreferrer"
              title={t('maps.interactiveTitle', { site: interactive.site, game: interactive.game })}
              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-hairline2 px-3.5 text-[12px] font-semibold text-tx-secondary transition-colors duration-200 hover:bg-surface3 hover:text-gold"
            >
              {t('maps.interactiveCta')}
              <span aria-hidden className="text-[11px] leading-none">
                ↗
              </span>
              <ExternalLink size={12} className="opacity-60" aria-hidden />
            </a>
          )}
          <LocaleLink
            to={`/nuzlocke/new?region=${region.region}`}
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-hairline2 px-3.5 text-[12px] font-semibold text-tx-secondary transition-colors duration-200 hover:bg-surface3 hover:text-gold"
          >
            <Compass size={14} />
            {t('maps.nuzlockeHere')}
          </LocaleLink>
        </div>
      </div>
    </motion.article>
  );
}

/** Locked "more regions" placeholder card (maps.md §1.2 SOON card). */
export function SoonCard({ index }: { index: number }) {
  const { t } = useTranslation();
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 0.6, y: 0 }}
      viewport={{ once: true, margin: '-15%' }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 }}
      className="group relative flex h-60 flex-col items-center justify-center gap-3 overflow-hidden rounded-lg border border-dashed border-hairline2 bg-surface1/60 p-4"
      aria-label={t('maps.soonAria')}
    >
      <Lock size={20} className="text-tx-muted" />
      <div className="text-center">
        <div className="pixel-label text-[9px] text-tx-muted">KALOS · ALOLA · GALAR · PALDEA</div>
        <div className="pixel-label mt-2 text-[8px] text-tx-muted/70">PHASE XX — LOCKED</div>
      </div>
      <div
        role="tooltip"
        className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-sm border border-hairline2 bg-surface2 px-2.5 py-1.5 text-[11px] text-tx-secondary opacity-0 shadow-elevate transition-opacity duration-200 group-hover:opacity-100"
      >
        {t('maps.soonNote')}
      </div>
    </motion.article>
  );
}
