/* SPRITE MUSEUM — density-addendum §3 Row 3 (span 8) + pokemon-detail.md §5.
 * Era tabs (SegmentedControl) + 24px timeline scrubber + dense tile grid (72–88px,
 * 6–10/row) + integrated display case. Pre-Gen-VI pixelated via shared <Sprite>
 * where its era model fits, else a local MuseumSprite with the same fallback rules. */
import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Sprite from '@/components/Sprite';
import { nameOfPokemon, useLanguage } from '@/lib/i18n-data';
import { sprites } from '@/lib/sprites';
import { cn } from '@/lib/utils';
import { SegmentedControl } from './ui';

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

/* ---------- tile model ---------- */

interface Tile {
  key: string;
  game: string; // caption, e.g. "RED / BLUE"
  variant: string; // FRONT · SHINY · BACK
  urls: string[]; // fallback chain, first = primary
  pixelated: boolean;
  animated?: boolean; // GIF — paused offscreen via static poster (urls[1])
  shiny?: boolean;
}

interface Era {
  key: string;
  tab: string;
  years: string;
  hue: string; // rgb triplet for plinth/hover
  maxId: number;
  tiles: (id: number) => Tile[];
}

const HOME_FB = (id: number) => [sprites.home(id), sprites.front(id)];

const ERAS: Era[] = [
  {
    key: 'gen12',
    tab: 'GEN I–II',
    years: '1996 · 99',
    hue: '169,176,181',
    maxId: 251,
    tiles: (id) => {
      const t: Tile[] = [];
      if (id <= 151) {
        t.push(
          { key: 'rb', game: 'RED / BLUE', variant: 'FRONT', urls: [sprites.gen1RedBlue(id), ...HOME_FB(id)], pixelated: true },
          { key: 'y', game: 'YELLOW', variant: 'FRONT', urls: [sprites.gen1Yellow(id), ...HOME_FB(id)], pixelated: true },
        );
      }
      t.push(
        { key: 'g', game: 'GOLD', variant: 'FRONT', urls: [sprites.gen2Gold(id), ...HOME_FB(id)], pixelated: true },
        { key: 's', game: 'SILVER', variant: 'FRONT', urls: [sprites.gen2Silver(id), ...HOME_FB(id)], pixelated: true },
        { key: 'c', game: 'CRYSTAL', variant: 'FRONT', urls: [sprites.gen2Crystal(id), ...HOME_FB(id)], pixelated: true },
        { key: 'cs', game: 'CRYSTAL', variant: 'SHINY', urls: [sprites.gen2CrystalShiny(id), sprites.homeShiny(id), sprites.shinyFront(id)], pixelated: true, shiny: true },
      );
      return t;
    },
  },
  {
    key: 'gen34',
    tab: 'GEN III–IV',
    years: '2002 · 06',
    hue: '99,217,107',
    maxId: 493,
    tiles: (id) => {
      const t: Tile[] = [];
      if (id <= 386) {
        t.push(
          { key: 'e', game: 'EMERALD', variant: 'FRONT', urls: [sprites.gen3Emerald(id), ...HOME_FB(id)], pixelated: true },
          { key: 'frlg', game: 'FRLG', variant: 'FRONT', urls: [sprites.gen3FRLG(id), ...HOME_FB(id)], pixelated: true },
          { key: 'rs', game: 'RUBY / SAPPH.', variant: 'FRONT', urls: [sprites.gen3RubySapphire(id), ...HOME_FB(id)], pixelated: true },
        );
      }
      t.push(
        { key: 'dp', game: 'DIAMOND / PEARL', variant: 'FRONT', urls: [sprites.gen4DP(id), ...HOME_FB(id)], pixelated: true },
        { key: 'pt', game: 'PLATINUM', variant: 'FRONT', urls: [sprites.gen4Platinum(id), ...HOME_FB(id)], pixelated: true },
        { key: 'hgss', game: 'HG / SS', variant: 'FRONT', urls: [sprites.gen4HGSS(id), ...HOME_FB(id)], pixelated: true },
        { key: 'pts', game: 'PLATINUM', variant: 'SHINY', urls: [sprites.gen4PlatinumShiny(id), sprites.homeShiny(id), sprites.shinyFront(id)], pixelated: true, shiny: true },
      );
      return t;
    },
  },
  {
    key: 'gen5',
    tab: 'GEN V — ANIMATED',
    years: '2010',
    hue: '255,122,69',
    maxId: 649,
    tiles: (id) => [
      { key: 'bw', game: 'BLACK / WHITE', variant: 'FRONT · ANIM', urls: [sprites.gen5Animated(id), sprites.gen5Static(id), ...HOME_FB(id)], pixelated: true, animated: true },
      { key: 'bwb', game: 'BLACK / WHITE', variant: 'BACK · ANIM', urls: [sprites.gen5AnimatedBack(id), sprites.gen5Static(id), ...HOME_FB(id)], pixelated: true, animated: true },
      { key: 'bws', game: 'BLACK / WHITE', variant: 'SHINY · ANIM', urls: [sprites.gen5AnimatedShiny(id), sprites.homeShiny(id), sprites.shinyFront(id)], pixelated: true, animated: true, shiny: true },
    ],
  },
  {
    key: 'gen67',
    tab: 'GEN VI–VII',
    years: '2013 · 16',
    hue: '69,200,255',
    maxId: 809,
    tiles: (id) => [
      { key: 'xy', game: 'X / Y', variant: 'FRONT', urls: [sprites.gen6XY(id), ...HOME_FB(id)], pixelated: false },
      { key: 'usum', game: 'US / UM', variant: 'FRONT', urls: [sprites.gen7USUM(id), ...HOME_FB(id)], pixelated: false },
      { key: 'sd', game: 'SHOWDOWN', variant: '3D-ERA GIF', urls: [sprites.showdown(id), sprites.front(id)], pixelated: false, animated: true },
    ],
  },
  {
    key: 'gen89',
    tab: 'GEN VIII–IX + HOME',
    years: '2019 · 22',
    hue: '140,111,255',
    maxId: 1025,
    tiles: (id) => [
      { key: 'front', game: 'MENU SPRITE', variant: 'FRONT', urls: [sprites.front(id)], pixelated: true },
      { key: 'back', game: 'MENU SPRITE', variant: 'BACK', urls: [sprites.back(id), sprites.front(id)], pixelated: true },
      { key: 'home', game: 'Pokémon HOME', variant: 'RENDER', urls: [sprites.home(id), sprites.front(id)], pixelated: false },
      { key: 'sd', game: 'SHOWDOWN', variant: '3D-ERA GIF', urls: [sprites.showdown(id), sprites.front(id)], pixelated: false, animated: true },
      { key: 'sdb', game: 'SHOWDOWN', variant: 'BACK GIF', urls: [sprites.showdownBack(id), sprites.showdown(id), sprites.front(id)], pixelated: false, animated: true },
    ],
  },
  {
    key: 'shiny',
    tab: 'SHINY VAULT',
    years: '✦ VAULT',
    hue: '246,201,69',
    maxId: 1025,
    tiles: (id) => {
      const t: Tile[] = [
        { key: 'sf', game: 'MENU SPRITE', variant: 'SHINY', urls: [sprites.shinyFront(id), sprites.front(id)], pixelated: true, shiny: true },
        { key: 'art', game: 'OFFICIAL ART', variant: 'SHINY', urls: [sprites.artworkShiny(id), sprites.shinyFront(id)], pixelated: false, shiny: true },
        { key: 'home', game: 'Pokémon HOME', variant: 'SHINY', urls: [sprites.homeShiny(id), sprites.shinyFront(id)], pixelated: false, shiny: true },
        { key: 'sd', game: 'SHOWDOWN', variant: 'SHINY GIF', urls: [sprites.showdownShiny(id), sprites.shinyFront(id)], pixelated: false, animated: true, shiny: true },
      ];
      if (id <= 649) {
        t.splice(1, 0, { key: 'g5', game: 'BLACK / WHITE', variant: 'SHINY · ANIM', urls: [sprites.gen5AnimatedShiny(id), sprites.homeShiny(id), sprites.shinyFront(id)], pixelated: true, animated: true, shiny: true });
      }
      return t;
    },
  },
];

/* ---------- local museum img with fallback chain + GIF pause ---------- */

function MuseumSprite({
  tile,
  name,
  className,
  eager = false,
}: {
  tile: Tile;
  name: string;
  className?: string;
  eager?: boolean;
}) {
  const [step, setStep] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(true);
  const ref = useRef<HTMLSpanElement>(null);

  const [prevKey, setPrevKey] = useState(tile.key);
  if (prevKey !== tile.key) {
    setPrevKey(tile.key);
    setStep(0);
    setLoaded(false);
  }

  /* pause animated GIFs offscreen (swap to static poster = next chain entry) */
  useEffect(() => {
    if (!tile.animated || !ref.current) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: '80px' });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [tile.animated]);

  const { t } = useTranslation();
  const srcIdx = Math.min(step, tile.urls.length - 1);
  const paused = tile.animated && !inView && tile.urls.length > 1;
  const src = paused ? tile.urls[Math.min(1, tile.urls.length - 1)] : tile.urls[srcIdx];

  return (
    <span ref={ref} className={cn('relative inline-block', className)}>
      {!loaded && (
        <img src="/pokeball.svg" alt="" aria-hidden className="absolute inset-0 m-auto h-1/2 w-1/2 animate-pulse opacity-20" />
      )}
      <img
        src={src}
        alt={t('detail.museum.spriteAlt', { name, game: tile.game, variant: tile.variant })}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        draggable={false}
        onLoad={() => setLoaded(true)}
        onError={() => setStep((s) => (s < tile.urls.length - 1 ? s + 1 : s))}
        className={cn(
          'relative h-full w-full object-contain transition-opacity duration-300',
          tile.pixelated && 'pixelated',
          loaded ? 'opacity-100' : 'opacity-0',
        )}
      />
    </span>
  );
}

/* ---------- timeline scrubber (24px) ---------- */

function Scrubber({
  eras,
  active,
  onChange,
}: {
  eras: Era[];
  active: number;
  onChange: (i: number) => void;
}) {
  const { t } = useTranslation();
  const trackRef = useRef<HTMLDivElement>(null);
  const era = eras[active];

  const indexFromX = (clientX: number) => {
    const track = trackRef.current;
    if (!track) return active;
    const r = track.getBoundingClientRect();
    const f = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    return Math.round(f * (eras.length - 1));
  };

  const pct = eras.length > 1 ? (active / (eras.length - 1)) * 100 : 0;
  const beamTop = '0.75rem'; /* track centerline — thumb + ticks share this */

  return (
    <div
      ref={trackRef}
      role="slider"
      tabIndex={0}
      aria-label={t('detail.museum.timelineAria')}
      aria-valuemin={0}
      aria-valuemax={eras.length - 1}
      aria-valuenow={active}
      aria-valuetext={era?.tab}
      className="relative h-10 cursor-pointer touch-none select-none"
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        onChange(indexFromX(e.clientX));
      }}
      onPointerMove={(e) => {
        if (e.buttons & 1) onChange(indexFromX(e.clientX));
      }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') onChange(Math.min(eras.length - 1, active + 1));
        if (e.key === 'ArrowLeft') onChange(Math.max(0, active - 1));
      }}
    >
      {/* beam */}
      <span
        className="pointer-events-none absolute inset-x-0 h-1 rounded-pill bg-surface3"
        style={{ top: beamTop, transform: 'translateY(-50%)' }}
        aria-hidden
      />
      {/* era ticks + year labels (labels sit below beam, not on the handle) */}
      {eras.map((e2, i) => {
        const p = eras.length > 1 ? (i / (eras.length - 1)) * 100 : 0;
        return (
          <button
            key={e2.key}
            type="button"
            tabIndex={-1}
            aria-label={e2.tab}
            onClick={(ev) => {
              ev.stopPropagation();
              onChange(i);
            }}
            className="group absolute"
            style={{ left: `${p}%`, top: beamTop, transform: 'translate(-50%, -50%)' }}
          >
            <span
              className={cn(
                'block h-1.5 w-1.5 rounded-full transition-colors duration-150',
                i === active ? 'bg-transparent' : 'bg-tx-muted group-hover:bg-tx-secondary',
              )}
            />
            <span
              className="pixel-label pointer-events-none absolute left-1/2 top-[0.625rem] -translate-x-1/2 whitespace-nowrap text-[8px] leading-none text-tx-muted"
            >
              {e2.years}
            </span>
          </button>
        );
      })}
      {/* thumb — sole gold handle, centered on beam */}
      <motion.span
        className="pointer-events-none absolute z-10 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gold bg-void shadow-glow-gold"
        style={{ top: beamTop }}
        animate={{ left: `${pct}%` }}
        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      />
    </div>
  );
}

/* ---------- museum ---------- */

export default function SpriteMuseum({ id, name: _name }: { id: number; name: string }) {
  const { t: t8n } = useTranslation();
  const lang = useLanguage();
  const available = useMemo(() => ERAS.filter((e) => id <= e.maxId), [id]);
  const [eraIdx, setEraIdx] = useState(0);
  const era = available[Math.min(eraIdx, available.length - 1)] ?? available[0];
  const tiles = useMemo(() => (era ? era.tiles(id) : []), [era, id]);
  const [selKey, setSelKey] = useState<string | null>(null);

  /* reset selection on era / pokémon change (derived-state-during-render) */
  const selScope = `${id}:${era?.key ?? ''}`;
  const [prevScope, setPrevScope] = useState(selScope);
  if (prevScope !== selScope) {
    setPrevScope(selScope);
    setSelKey(null);
  }
  const selected = tiles.find((t) => t.key === selKey) ?? tiles[0];

  if (!era) return null;
  const dispName = nameOfPokemon(id, lang);
  const variant = (v: string) => t8n(`detail.museum.variants.${v}`, { defaultValue: v });

  return (
    <div className="dx-museum relative flex min-h-[20rem] flex-1 flex-col">
      <span className="dx-museum-lights" aria-hidden />

      {/* display case — sprite | meta + era tabs */}
      <div className="grid shrink-0 grid-cols-1 gap-x-4 gap-y-3 border-b border-hairline px-4 py-3 md:grid-cols-[8.25rem_minmax(0,1fr)] md:items-start">
        <div
          className="relative mx-auto grid h-[8.25rem] w-[8.25rem] shrink-0 place-items-center rounded-xl border border-hairline md:mx-0"
          style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.05), transparent 40%)' }}
        >
          <span
            aria-hidden
            className="absolute bottom-2 h-3 w-3/4 rounded-full blur-[6px] transition-all duration-300"
            style={{ background: `rgba(${era.hue},0.35)` }}
          />
          <AnimatePresence mode="wait" initial={false}>
            {selected && (
              <motion.div
                key={`${era.key}-${selected.key}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: EASE }}
                className="h-[7rem] w-[7rem]"
              >
                <MuseumSprite tile={selected} name={dispName} className="h-full w-full" eager />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex min-w-0 flex-col gap-3">
          <div className="min-w-0">
            <div className="pixel-label text-[9px]" style={{ color: `rgb(${era.hue})` }}>
              {era.tab}
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${era.key}-${selected?.key ?? 'x'}-meta`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mt-1 font-display text-[0.9375rem] font-bold leading-snug text-tx-primary">
                  {selected?.game ?? '—'}
                </div>
                <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                  <span className="rounded-pill border border-hairline bg-surface2 px-1.5 py-px font-sans text-[14px] leading-none font-bold uppercase text-tx-secondary">
                    {selected ? variant(selected.variant) : '—'}
                  </span>
                  {selected?.shiny && <img src="/sparkle.svg" alt="shiny" className="h-3 w-3" />}
                  <span className="pixel-label text-[8px] leading-none text-tx-muted">{era.years}</span>
                </div>
              </motion.div>
            </AnimatePresence>
            <p className="mt-2 font-sans text-micro11 leading-relaxed text-tx-muted">
              {t8n('detail.museum.blurb', { name: dispName })}
            </p>
          </div>

          <SegmentedControl
            id="museum-era"
            size="xs"
            ariaLabel={t8n('detail.museum.eraAria')}
            value={era.key}
            onChange={(k) => setEraIdx(available.findIndex((e) => e.key === k))}
            options={available.map((e) => ({ value: e.key, label: e.tab }))}
            className="max-w-full self-start overflow-x-auto"
          />
        </div>
      </div>

      {/* timeline scrubber above tiles */}
      <div className="shrink-0 px-5 pb-1 pt-1.5">
        <Scrubber eras={available} active={available.indexOf(era)} onChange={setEraIdx} />
      </div>

      {/* dense tile grid — grows to fill panel, rows stretch when few tiles */}
      <div
        className="dx-scroll grid min-h-0 flex-1 auto-rows-[minmax(4.5rem,1fr)] grid-cols-4 gap-1.5 overflow-y-auto px-4 pb-3 sm:grid-cols-6 xl:grid-cols-8"
        data-lenis-prevent
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {tiles.map((t, i) => (
            <motion.button
              key={`${era.key}-${t.key}`}
              type="button"
              onClick={() => setSelKey(t.key)}
              className="dx-tile h-full min-h-[4.5rem]"
              data-active={selected?.key === t.key}
              style={{ '--eh': era.hue } as CSSProperties}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: Math.min(i, 10) * 0.03, ease: EASE }}
              aria-label={t8n('detail.museum.tileAria', { game: t.game, variant: variant(t.variant) })}
            >
              {t.shiny && <img src="/sparkle.svg" alt="" aria-hidden className="absolute right-1 top-1 h-2.5 w-2.5 opacity-80" />}
              {t.shiny && <span aria-hidden className="absolute inset-x-2 top-0 h-px bg-gold/50" />}
              <span className="relative flex min-h-[3rem] w-full max-w-[4.5rem] flex-1 items-center justify-center sm:max-w-[5rem]">
                {era.key === 'gen89' && t.key === 'front' ? (
                  /* shared <Sprite> wrapper path for the modern default slot */
                  <Sprite id={id} name={dispName} era="default" className="h-full w-full" />
                ) : (
                  <MuseumSprite tile={t} name={dispName} className="h-full w-full" />
                )}
              </span>
              <span className="max-w-full truncate text-center font-sans text-micro9 font-semibold text-tx-secondary">
                {t.game}
              </span>
              <span className="pixel-label text-[6px] text-tx-muted">{variant(t.variant)}</span>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
