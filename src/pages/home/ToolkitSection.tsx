/* Toolkit teasers — "JENSEITS DES DEX" (home.md §6). Live features beyond the dex.
 * Card style mirrors the maps RegionCard (accent glow, parallax watermark,
 * stat strip, accent CTA) — 2×2 on desktop. */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LocaleLink } from '@/lib/locale-link';
import { motion } from 'framer-motion';
import { ArrowRight, Ghost, GitCompareArrows, Map as MapIcon, Package, Swords, Users } from 'lucide-react';
import { REGIONS } from '@/lib/regions';
import { FREEFORM_REGIONS } from '@/lib/regions-freeform';
import { accentRgb } from '@/lib/regions';

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

interface ToolkitCard {
  to: string;
  Icon: typeof MapIcon;
  tag: string;
  accent: string;
  titleKey: string;
  captionKey: string;
  stats: [string, string | number][];
}

const CARDS: ToolkitCard[] = [
  {
    to: '/maps',
    Icon: MapIcon,
    tag: 'MAPS',
    accent: '#59B37A',
    titleKey: 'home.features.toolkit.maps.title',
    captionKey: 'home.features.toolkit.maps.caption',
    stats: [
      ['home.features.toolkit.stats.regions', REGIONS.length],
      ['home.features.toolkit.stats.locations', REGIONS.reduce((n, r) => n + r.nodes.length, 0)],
      ['home.features.toolkit.stats.gens', 'I–V'],
    ],
  },
  {
    to: '/nuzlocke',
    Icon: Users,
    tag: 'NUZLOCKE',
    accent: '#E14D6B',
    titleKey: 'home.features.toolkit.nuzlocke.title',
    captionKey: 'home.features.toolkit.nuzlocke.caption',
    stats: [
      ['home.features.toolkit.stats.regions', REGIONS.length + FREEFORM_REGIONS.length],
      ['home.features.toolkit.stats.gens', 'I–IX'],
      ['home.features.toolkit.stats.mode', 'SOLO+CO-OP'],
    ],
  },
  {
    to: '/team',
    Icon: Swords,
    tag: 'TEAM',
    accent: '#6E7FD7',
    titleKey: 'home.features.toolkit.team.title',
    captionKey: 'home.features.toolkit.team.caption',
    stats: [
      ['home.features.toolkit.stats.species', 1025],
      ['home.features.toolkit.stats.gens', 'I–IX'],
      ['home.features.toolkit.stats.export', 'SHOWDOWN'],
    ],
  },
  {
    to: '/versus',
    Icon: GitCompareArrows,
    tag: 'VERSUS',
    accent: '#F5A623',
    titleKey: 'home.features.toolkit.versus.title',
    captionKey: 'home.features.toolkit.versus.caption',
    stats: [
      ['home.features.toolkit.stats.mode', '1v1'],
      ['home.features.toolkit.stats.gens', 'I–IX'],
      ['home.features.toolkit.stats.engine', 'SMOGON'],
    ],
  },
  {
    to: '/items',
    Icon: Package,
    tag: 'ITEMS',
    accent: '#D4A017',
    titleKey: 'home.features.toolkit.items.title',
    captionKey: 'home.features.toolkit.items.caption',
    stats: [
      ['home.features.toolkit.stats.items', '1000+'],
      ['home.features.toolkit.stats.groups', 12],
      ['home.features.toolkit.stats.lang', 'DE+EN'],
    ],
  },
  {
    to: '/orre',
    Icon: Ghost,
    tag: 'ORRE',
    accent: '#7B6CFF',
    titleKey: 'home.features.toolkit.orre.title',
    captionKey: 'home.features.toolkit.orre.caption',
    stats: [
      ['home.features.toolkit.stats.colo', 48],
      ['home.features.toolkit.stats.xd', 83],
      ['home.features.toolkit.stats.games', 'COLO+XD'],
    ],
  },
];

function ToolkitTeaser({ card, index }: { card: ToolkitCard; index: number }) {
  const { t } = useTranslation();
  const [hover, setHover] = useState(false);
  const [par, setPar] = useState({ x: 0, y: 0 });
  const rgb = accentRgb(card.accent);
  const { Icon } = card;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-15%' }}
      transition={{ duration: 0.4, ease: EASE, delay: index * 0.06 }}
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
      className="group relative min-h-72 overflow-hidden rounded-lg border border-hairline bg-surface1 p-5 transition-[border-color,box-shadow] duration-200"
      style={{
        borderColor: hover ? `rgba(${rgb},0.55)` : undefined,
        boxShadow: hover ? `0 8px 40px rgba(${rgb},0.22)` : undefined,
      }}
    >
      {/* parallaxed watermark icon, RegionCard-style */}
      <div
        className="pointer-events-none absolute -bottom-6 -right-6 transition-opacity duration-300"
        style={{
          transform: `translate(${par.x}px, ${par.y}px)`,
          transition: 'transform 150ms ease-out',
          opacity: hover ? 0.16 : 0.08,
        }}
        aria-hidden
      >
        <Icon size={190} strokeWidth={0.75} style={{ color: card.accent }} />
      </div>

      <div className="relative flex h-full flex-col">
        {/* top row */}
        <div className="flex items-center justify-between">
          <span className="pixel-label text-[9px] text-tx-muted">{card.tag}</span>
          <span
            className="inline-flex items-center gap-1.5 rounded-pill border px-2 py-0.5 pixel-label text-[8px] leading-none"
            style={{ borderColor: `rgba(${rgb},0.5)`, color: card.accent }}
          >
            <span className="h-2 w-2 rounded-full" style={{ background: card.accent, boxShadow: `0 0 6px rgba(${rgb},0.9)` }} />
            LIVE
          </span>
        </div>

        {/* title + caption */}
        <h3 className="mt-3 font-display text-[1.875rem] font-extrabold leading-none tracking-wide text-tx-primary">
          {t(card.titleKey)}
        </h3>
        <p className="mt-2 max-w-[46ch] text-[0.7813rem] font-medium leading-relaxed text-tx-secondary">
          {t(card.captionKey)}
        </p>

        <div className="flex-1" />

        {/* stat strip */}
        <div className="grid grid-cols-3 divide-x divide-hairline border-y border-hairline py-2">
          {card.stats.map(([labelKey, value]) => (
            <div key={labelKey} className="px-3 first:pl-0">
              <div className="pixel-label text-[8px] text-tx-muted">{t(labelKey)}</div>
              <div className="font-display text-[1.125rem] font-bold tabular-nums" style={{ color: card.accent }}>
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-3.5">
          <LocaleLink
            to={card.to}
            className="inline-flex h-9 items-center gap-1.5 rounded-md border px-4 font-display text-micro12 font-bold tracking-wider text-tx-primary transition-all duration-200 hover:-translate-y-0.5"
            style={{
              borderColor: `rgba(${rgb},0.6)`,
              background: `linear-gradient(135deg, rgba(${rgb},0.25), rgba(${rgb},0.10))`,
            }}
          >
            {t('home.features.open')}
            <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </LocaleLink>
        </div>
      </div>
    </motion.article>
  );
}

export default function ToolkitSection() {
  const { t } = useTranslation();

  return (
    <section className="relative bg-abyss pb-24">
      <div className="mx-auto max-w-content border-t border-hairline px-4 pt-16 md:px-8 md:pt-20">
        <div className="mb-8 flex items-center gap-3">
          <span className="pixel-label text-[14px] text-gold">{t('home.features.toolkitEyebrow')}</span>
          <span className="h-px flex-1 bg-hairline" />
        </div>
        <div className="grid gap-5 lg:grid-cols-2">
          {CARDS.map((card, i) => (
            <ToolkitTeaser key={card.tag} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
