/* SPRITE MUSEUM — density-addendum §3 Row 3 (span 8) + pokemon-detail.md §5.
 * Era tabs (SegmentedControl) + 24px timeline scrubber + dense tile grid (72–88px,
 * 6–10/row) + integrated display case. Pre-Gen-VI pixelated via shared <Sprite>
 * where its era model fits, else a local MuseumSprite with the same fallback rules. */
import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Sprite from '@/components/Sprite';
import { displayName } from '@/lib/pokeapi';
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
        alt={`${name} — ${tile.game} ${tile.variant.toLowerCase()} sprite`}
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

  return (
    <div
      ref={trackRef}
      role="slider"
      tabIndex={0}
      aria-label="Sprite era timeline"
      aria-valuemin={0}
      aria-valuemax={eras.length - 1}
      aria-valuenow={active}
      aria-valuetext={era?.tab}
      className="relative h-6 cursor-pointer touch-none select-none"
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
      {/* track */}
      <span className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-pill bg-surface3" />
      {/* ticks */}
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
            className="group absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${p}%` }}
          >
            <span
              className={cn(
                'block h-1.5 w-1.5 rounded-full transition-all duration-150',
                i === active ? 'scale-150 bg-gold' : 'bg-tx-muted group-hover:bg-tx-secondary',
              )}
            />
            <span className="pixel-label absolute left-1/2 top-2.5 -translate-x-1/2 whitespace-nowrap text-[7px] text-tx-muted">
              {e2.years}
            </span>
          </button>
        );
      })}
      {/* thumb */}
      <motion.span
        className="pointer-events-none absolute top-1/2 z-10 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold bg-void shadow-glow-gold"
        animate={{ left: `${pct}%`, scale: [1, 1.15, 1] }}
        transition={{ left: { type: 'spring', stiffness: 300, damping: 26 }, scale: { duration: 0.15 } }}
        key={active}
      />
    </div>
  );
}

/* ---------- museum ---------- */

export default function SpriteMuseum({ id, name }: { id: number; name: string }) {
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
  const dispName = displayName(name);

  return (
    <div className="dx-museum relative flex h-full flex-col">
      <span className="dx-museum-lights" aria-hidden />

      {/* display case — integrated, compact */}
      <div className="flex items-center gap-4 border-b border-hairline px-4 py-3">
        <div
          className="relative grid h-[132px] w-[132px] shrink-0 place-items-center rounded-xl border border-hairline"
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
                className="h-[112px] w-[112px]"
              >
                <MuseumSprite tile={selected} name={dispName} className="h-full w-full" eager />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
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
              <div className="mt-1 truncate font-display text-[15px] font-bold text-tx-primary">
                {selected?.game ?? '—'}
              </div>
              <div className="mt-0.5 flex items-center gap-1.5">
                <span className="rounded-pill border border-hairline bg-surface2 px-1.5 py-px font-sans text-[9px] font-bold uppercase text-tx-secondary">
                  {selected?.variant ?? '—'}
                </span>
                {selected?.shiny && <img src="/sparkle.svg" alt="shiny" className="h-3 w-3" />}
                <span className="pixel-label text-[7px] text-tx-muted">{era.years}</span>
              </div>
            </motion.div>
          </AnimatePresence>
          <p className="mt-1.5 hidden font-sans text-[11px] leading-snug text-tx-muted sm:block">
            Every era of {dispName}, from 1996 pixels to 3D-era GIFs. Pick a tile or scrub the timeline.
          </p>
        </div>
        {/* era tabs */}
        <div className="ml-auto hidden md:block">
          <SegmentedControl
            id="museum-era"
            size="xs"
            ariaLabel="Sprite era"
            value={era.key}
            onChange={(k) => setEraIdx(available.findIndex((e) => e.key === k))}
            options={available.map((e) => ({ value: e.key, label: e.tab }))}
          />
        </div>
      </div>

      {/* mobile era tabs */}
      <div className="px-4 pt-2 md:hidden">
        <SegmentedControl
          id="museum-era-m"
          size="xs"
          ariaLabel="Sprite era"
          value={era.key}
          onChange={(k) => setEraIdx(available.findIndex((e) => e.key === k))}
          options={available.map((e) => ({ value: e.key, label: e.tab }))}
          className="max-w-full overflow-x-auto"
        />
      </div>

      {/* timeline scrubber above tiles */}
      <div className="px-5 pb-1 pt-1.5">
        <Scrubber eras={available} active={available.indexOf(era)} onChange={setEraIdx} />
      </div>

      {/* dense tile grid */}
      <div className="dx-scroll grid max-h-[300px] flex-1 grid-cols-4 gap-1.5 overflow-y-auto px-4 pb-3 sm:grid-cols-6 xl:grid-cols-8">
        <AnimatePresence mode="popLayout" initial={false}>
          {tiles.map((t, i) => (
            <motion.button
              key={`${era.key}-${t.key}`}
              type="button"
              onClick={() => setSelKey(t.key)}
              className="dx-tile"
              data-active={selected?.key === t.key}
              style={{ '--eh': era.hue } as CSSProperties}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: Math.min(i, 10) * 0.03, ease: EASE }}
              aria-label={`${t.game} ${t.variant} — show in display case`}
            >
              {t.shiny && <img src="/sparkle.svg" alt="" aria-hidden className="absolute right-1 top-1 h-2.5 w-2.5 opacity-80" />}
              {t.shiny && <span aria-hidden className="absolute inset-x-2 top-0 h-px bg-gold/50" />}
              <span className="relative block h-[64px] w-[64px] sm:h-[72px] sm:w-[72px]">
                {era.key === 'gen89' && t.key === 'front' ? (
                  /* shared <Sprite> wrapper path for the modern default slot */
                  <Sprite id={id} name={dispName} era="default" className="h-full w-full" />
                ) : (
                  <MuseumSprite tile={t} name={dispName} className="h-full w-full" />
                )}
              </span>
              <span className="max-w-full truncate text-center font-sans text-[9px] font-semibold text-tx-secondary">
                {t.game}
              </span>
              <span className="pixel-label text-[6px] text-tx-muted">{t.variant}</span>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
