/* /pokedex — the core living grid (pokedex.md + density addendum §2).
 * Sticky compact command bar · URL-synced filters · Comfort/Compact/List densities
 * (Compact default, persisted) · infinite scroll (batch 96) · Framer layout re-flow. */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Ref } from 'react';
import { useSearchParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, animate, motion, useMotionValue } from 'framer-motion';
import { RotateCcw, WifiOff } from 'lucide-react';
import PokeballLoader from '@/components/PokeballLoader';
import PokemonCard from '@/components/PokemonCard';
import CommandBar from '@/components/pokedex/CommandBar';
import ListView from '@/components/pokedex/ListView';
import {
  STAT_SORTS,
  filterEntries,
  isValidType,
  sortEntries,
  useDexData,
  useOnline,
  useTypeMembers,
} from '@/components/pokedex/dex-data';
import type { Density, SortKey, Special } from '@/components/pokedex/dex-data';
import { padNum } from '@/lib/pokeapi';
import { useShiny } from '@/lib/shiny';
import { fmtNum, useGermanDataReady, useLanguage, nameOfType } from '@/lib/i18n-data';
import { useIsMobile } from '@/hooks/use-mobile';
import { MAX_DEX_ID } from '@/lib/types';
import type { PokemonType } from '@/lib/types';
import { cn } from '@/lib/utils';
import './pokedex.css';

const BATCH = 96;
const DENSITY_KEY = 'pdx:density';
const EASE_OUT = [0.16, 1, 0.3, 1] as [number, number, number, number];
const SORT_KEYS: SortKey[] = ['id', 'id-desc', 'name', 'height', 'weight', 'bst'];

/* ---------- URL state ---------- */

interface UrlFilters {
  q: string;
  types: PokemonType[];
  gen: number | null;
  special: Special[];
  sort: SortKey;
}

function parseParams(sp: URLSearchParams): UrlFilters {
  const genN = Number(sp.get('gen'));
  const sortRaw = sp.get('sort') ?? 'id';
  return {
    q: sp.get('q') ?? '',
    types: (sp.get('type') ?? '').split(',').filter(isValidType),
    gen: Number.isInteger(genN) && genN >= 1 && genN <= 9 ? genN : null,
    special: (sp.get('special') ?? '')
      .split(',')
      .filter((s): s is Special => s === 'legendary' || s === 'mythical'),
    sort: (SORT_KEYS as string[]).includes(sortRaw) ? (sortRaw as SortKey) : 'id',
  };
}

function buildParams(f: UrlFilters, shiny: boolean): string {
  const sp = new URLSearchParams();
  if (f.q.trim()) sp.set('q', f.q.trim());
  if (f.types.length > 0) sp.set('type', f.types.join(','));
  if (f.gen !== null) sp.set('gen', String(f.gen));
  if (f.special.length > 0) sp.set('special', f.special.join(','));
  if (f.sort !== 'id') sp.set('sort', f.sort);
  if (shiny) sp.set('shiny', '1');
  return sp.toString();
}

function loadDensity(): Density {
  try {
    const v = localStorage.getItem(DENSITY_KEY);
    if (v === 'comfort' || v === 'compact' || v === 'list') return v;
  } catch {
    /* ignore */
  }
  return 'compact'; // density addendum §2: Compact is the default
}

/* ---------- animated count ---------- */

function TweenNumber({ value, lang }: { value: number; lang: 'en' | 'de' }) {
  const mv = useMotionValue(value);
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    const controls = animate(mv, value, {
      duration: 0.3,
      ease: EASE_OUT,
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [mv, value]);
  return <span className="font-bold tabular-nums text-tx-primary">{fmtNum(display, lang)}</span>;
}

/* ---------- grid skeleton card (Pokéball silhouette pulse, §9.5) ---------- */

function CardSkeleton({ id, ref }: { id: number; ref?: Ref<HTMLDivElement> }) {
  return (
    <motion.div
      ref={ref}
      layout="position"
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      className="flex flex-col items-center gap-1 rounded-lg border border-hairline bg-surface1 p-3"
      aria-hidden
    >
      <div className="flex w-full items-start justify-between">
        <span className="pixel-label text-[9px] text-tx-muted/50">{padNum(id)}</span>
      </div>
      <div className="grid h-20 w-20 place-items-center">
        <img src="/pokeball.svg" alt="" className="h-8 w-8 animate-pulse opacity-30" />
      </div>
      <div className="h-3 w-16 animate-pulse rounded-sm bg-surface3/70" />
      <div className="h-4 w-24 animate-pulse rounded-pill bg-surface3/50" />
    </motion.div>
  );
}

/* ---------- page ---------- */

export default function Pokedex() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t: t8n } = useTranslation();
  const lang = useLanguage();
  const deReady = useGermanDataReady();
  const { shiny, toggleShiny } = useShiny();
  const isMobile = useIsMobile();

  /* filter state — initialized from the URL (shareable) */
  const [filters, setFilters] = useState<UrlFilters>(() => parseParams(searchParams));
  const [qText, setQText] = useState(() => searchParams.get('q') ?? '');
  const [debouncedQ, setDebouncedQ] = useState(() => searchParams.get('q') ?? '');
  const [density, setDensityState] = useState<Density>(loadDensity);

  const setDensity = useCallback((d: Density) => {
    setDensityState(d);
    try {
      localStorage.setItem(DENSITY_KEY, d);
    } catch {
      /* ignore */
    }
  }, []);

  /* debounce the grid filter 120ms (search input stays immediate) */
  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedQ(qText), 120);
    return () => window.clearTimeout(t);
  }, [qText]);

  /* shiny=1 in the URL applies once on load */
  const shinyBooted = useRef(false);
  useEffect(() => {
    if (shinyBooted.current) return;
    shinyBooted.current = true;
    if ((searchParams.get('shiny') === '1') !== shiny) toggleShiny();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* two-way URL sync (replace — no history spam) */
  const lastSerialized = useRef(searchParams.toString());
  useEffect(() => {
    const next = buildParams({ ...filters, q: debouncedQ }, shiny);
    if (next !== lastSerialized.current) {
      lastSerialized.current = next;
      setSearchParams(new URLSearchParams(next), { replace: true });
    }
  }, [filters, debouncedQ, shiny, setSearchParams]);

  useEffect(() => {
    const cur = searchParams.toString();
    if (cur !== lastSerialized.current) {
      lastSerialized.current = cur;
      const parsed = parseParams(searchParams);
      setFilters(parsed);
      setQText(parsed.q);
      setDebouncedQ(parsed.q);
      if ((searchParams.get('shiny') === '1') !== shiny) toggleShiny();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  /* data */
  const { index, bootFailed, retryBoot, summaries, ensure } = useDexData();
  const typeSets = useTypeMembers(filters.types);
  const online = useOnline();
  const [bannerDismissed, setBannerDismissed] = useState(false);

  /* filter → sort (null while type/stat data loads) */
  const filtered = useMemo(
    () => (index ? filterEntries(index, { ...filters, q: debouncedQ }, typeSets) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deReady re-runs de-alias matching after the lazy de load
    [index, filters, debouncedQ, typeSets, deReady],
  );

  const statSort = STAT_SORTS.has(filters.sort);
  const statSortReady =
    !statSort || (filtered !== null && filtered.every((e) => summaries.has(e.id)));

  useEffect(() => {
    if (statSort && filtered && filtered.length > 0) ensure(filtered.map((e) => e.id));
  }, [statSort, filtered, ensure]);

  const sorted = useMemo(() => {
    if (!filtered) return null;
    if (statSort && !statSortReady) return null; // gate stat sorts on full summary data
    return sortEntries(filtered, summaries, filters.sort, lang);
  }, [filtered, statSort, statSortReady, summaries, filters.sort, lang]);

  const total = sorted?.length ?? 0;
  const isFiltered =
    debouncedQ.trim() !== '' ||
    filters.types.length > 0 ||
    filters.gen !== null ||
    filters.special.length > 0;

  /* density — mobile forces cozy cards (pokedex.md §7) */
  const effectiveDensity: Density = isMobile ? 'comfort' : density;
  const mode: 'comfort' | 'compact' | 'list' = effectiveDensity;

  /* infinite scroll — batch 96; small result sets render all at once */
  const [visibleCount, setVisibleCount] = useState(BATCH);
  const resetSig = `${debouncedQ}|${filters.types.join(',')}|${filters.gen}|${filters.special.join(',')}|${filters.sort}|${mode}`;
  const prevSig = useRef(resetSig);
  useEffect(() => {
    if (prevSig.current !== resetSig) {
      prevSig.current = resetSig;
      setVisibleCount(BATCH);
      if (window.scrollY > 240) window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, [resetSig]);

  const visibleLimit = total <= 120 ? total : Math.min(visibleCount, total);
  const visible = useMemo(() => sorted?.slice(0, visibleLimit) ?? [], [sorted, visibleLimit]);

  useEffect(() => {
    if (visible.length > 0) ensure(visible.map((e) => e.id));
  }, [visible, ensure]);

  const hasMore = total > visibleLimit;
  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasMore) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) setVisibleCount((c) => c + BATCH);
      },
      { rootMargin: '600px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, total, visibleCount]);

  /* 0 results → command-bar shake + hint (gold, never red) */
  const isEmpty = sorted !== null && total === 0;
  const [shakeKey, setShakeKey] = useState(0);
  const wasEmpty = useRef(false);
  useEffect(() => {
    if (isEmpty && !wasEmpty.current && index) setShakeKey((k) => k + 1);
    wasEmpty.current = isEmpty;
  }, [isEmpty, index]);

  /* live region announcements */
  const [announce, setAnnounce] = useState('');
  useEffect(() => {
    if (sorted === null) return;
    const t = window.setTimeout(() => setAnnounce(t8n('pokedex.announceShown', { count: total })), 400);
    return () => window.clearTimeout(t);
  }, [total, sorted, t8n]);
  useEffect(() => {
    setAnnounce(shiny ? t8n('pokedex.shinyOn') : t8n('pokedex.shinyOff'));
  }, [shiny, t8n]);

  /* filter mutators */
  const onToggleType = useCallback(
    (t: PokemonType) =>
      setFilters((f) => ({
        ...f,
        types: f.types.includes(t) ? f.types.filter((x) => x !== t) : [...f.types, t],
      })),
    [],
  );
  const onToggleSpecial = useCallback(
    (s: Special) =>
      setFilters((f) => ({
        ...f,
        special: f.special.includes(s) ? f.special.filter((x) => x !== s) : [...f.special, s],
      })),
    [],
  );
  const onGen = useCallback((gen: number | null) => setFilters((f) => ({ ...f, gen })), []);
  const onSort = useCallback((sort: SortKey) => setFilters((f) => ({ ...f, sort })), []);
  const onResetAll = useCallback(() => {
    setQText('');
    setDebouncedQ('');
    setFilters({ q: '', types: [], gen: null, special: [], sort: 'id' });
  }, []);

  const emptyHint =
    filters.types.length > 0
      ? t8n('pokedex.hintType', { type: nameOfType(filters.types[0], lang) })
      : filters.gen !== null
        ? t8n('pokedex.hintGen')
        : debouncedQ.trim()
          ? t8n('pokedex.hintSearch')
          : t8n('pokedex.hintFilter');

  return (
    <div className="relative">
      {/* page header — compact per density addendum §1 */}
      <header className="mx-auto max-w-content px-4 pb-3 pt-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE_OUT }}
        >
          <p className="pixel-label text-[10px] text-gold">{t8n('pokedex.eyebrow')}</p>
          <div className="mt-1.5 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
            <h1 className="font-display text-[clamp(26px,3.5vw,40px)] font-extrabold leading-none tracking-wide">
              {t8n('pokedex.title')}
            </h1>
            <p className="font-sans text-[13px] text-tx-secondary" aria-hidden>
              {t8n('pokedex.showing')} <TweenNumber value={total} lang={lang} /> {t8n('pokedex.of')}{' '}
              <span className="font-bold tabular-nums text-tx-primary">{fmtNum(MAX_DEX_ID, lang)}</span>{' '}
              {t8n('pokedex.species')}
            </p>
          </div>
        </motion.div>
      </header>

      {/* sticky command bar */}
      <CommandBar
        q={qText}
        onQuery={setQText}
        types={filters.types}
        onToggleType={onToggleType}
        gen={filters.gen}
        onGen={onGen}
        special={filters.special}
        onToggleSpecial={onToggleSpecial}
        sort={filters.sort}
        onSort={onSort}
        density={density}
        onDensity={setDensity}
        onResetAll={onResetAll}
        resultCount={total}
        shakeKey={shakeKey}
        showEmptyHint={isEmpty}
      />

      {/* offline fallback notice (gold, dismissible, never red) */}
      <AnimatePresence>
        {!online && index && !bannerDismissed && (
          <motion.div
            key="offline"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-b border-gold/30 bg-gold-soft/40">
              <div className="mx-auto flex h-8 max-w-content items-center gap-2 px-4 md:px-8">
                <WifiOff size={12} strokeWidth={1.75} className="text-gold" />
                <p className="pixel-label text-[9px] text-gold">{t8n('pokedex.offline')}</p>
                <button
                  type="button"
                  onClick={() => setBannerDismissed(true)}
                  className="pixel-label ml-auto text-[9px] text-gold/70 transition-colors hover:text-gold"
                >
                  {t8n('pokedex.dismiss')}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* main content */}
      <main className="mx-auto min-h-[60dvh] max-w-content px-4 pb-24 pt-3 md:px-8">
        {/* boot states */}
        {!index && !bootFailed && (
          <div className="grid min-h-[40dvh] place-items-center">
            <div className="flex flex-col items-center gap-4">
              <PokeballLoader variant="inline" />
              <p className="pixel-label text-[9px] text-tx-muted">{t8n('pokedex.booting')}</p>
            </div>
          </div>
        )}

        {bootFailed && (
          <div className="grid min-h-[40dvh] place-items-center">
            <div className="flex flex-col items-center gap-3 text-center">
              <img src="/pokeball-open.svg" alt="" className="pdx-empty-glow h-14 w-12 opacity-60" />
              <p className="font-sans text-base font-bold text-tx-primary">{t8n('pokedex.bootFailTitle')}</p>
              <p className="font-sans text-xs text-gold">
                {online ? t8n('pokedex.bootFailOnline') : t8n('pokedex.bootFailOffline')}
              </p>
              <button
                type="button"
                onClick={retryBoot}
                className="mt-1 flex h-8 items-center gap-1.5 rounded-md border border-gold/60 bg-gold-soft px-3 font-sans text-[11px] font-bold text-gold transition-all duration-200 hover:shadow-glow-gold"
              >
                <RotateCcw size={11} strokeWidth={1.75} />
                {t8n('pokedex.retry')}
              </button>
            </div>
          </div>
        )}

        {/* type/stat data loading gate */}
        {index && sorted === null && !bootFailed && (
          <div className="grid min-h-[30dvh] place-items-center">
            <div className="flex flex-col items-center gap-4">
              <PokeballLoader variant="inline" />
              <p className="pixel-label text-[9px] text-tx-muted">
                {statSort && !statSortReady ? t8n('pokedex.fetchingStats') : t8n('pokedex.loadingTypes')}
              </p>
            </div>
          </div>
        )}

        {/* compact empty state (200px, gold hint + bar shake, never red) */}
        {isEmpty && (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 180, damping: 22 }}
            className="flex h-[200px] flex-col items-center justify-center gap-2 text-center"
          >
            <img src="/empty-dex.svg" alt="" className="pdx-empty-glow h-16 w-auto opacity-60" />
            <h2 className="font-sans text-base font-bold text-tx-primary">{t8n('pokedex.emptyTitle')}</h2>
            <p className="font-sans text-xs text-gold">{t8n('pokedex.emptyHint', { hint: emptyHint })}</p>
            <button
              type="button"
              onClick={onResetAll}
              className="mt-1 h-8 rounded-md border border-hairline2 px-3 font-sans text-[11px] font-semibold text-tx-secondary transition-all duration-200 hover:border-gold/60 hover:text-gold"
            >
              {t8n('pokedex.resetAll')}
            </button>
          </motion.div>
        )}

        {/* grid / list */}
        {sorted !== null && total > 0 && (
          <>
            {mode === 'list' ? (
              <ListView items={visible} summaries={summaries} />
            ) : (
              <motion.div
                layout
                className={cn(
                  'grid',
                  mode === 'comfort'
                    ? 'grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'
                    : 'pdx-grid-compact gap-3',
                )}
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  {visible.map((e, i) => {
                    const s = summaries.get(e.id);
                    return s ? (
                      <PokemonCard key={e.id} summary={s} density={mode} index={i} />
                    ) : (
                      <CardSkeleton key={e.id} id={e.id} />
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            )}

            {/* infinite-scroll sentinel + inline loader */}
            {hasMore && (
              <div ref={sentinelRef} className="grid h-[120px] place-items-center">
                <PokeballLoader variant="inline" />
              </div>
            )}

            {/* end cap */}
            {!hasMore && (
              <div className="mt-6 flex flex-col items-center gap-2 py-8 text-center">
                <img
                  src="/pokeball.svg"
                  alt=""
                  className="h-10 w-10 opacity-80"
                  style={{ filter: 'drop-shadow(0 0 12px rgba(246,201,69,0.45))' }}
                />
                <p className="pixel-label text-[9px] text-gold">
                  {isFiltered
                    ? t8n('pokedex.allMatches', { count: fmtNum(total, lang) })
                    : t8n('pokedex.dexComplete', { shown: fmtNum(total, lang), total: fmtNum(MAX_DEX_ID, lang) })}
                </p>
                <p className="font-sans text-xs text-tx-muted">
                  {t8n('pokedex.edge')}
                </p>
              </div>
            )}
          </>
        )}
      </main>

      {/* live region — announces result counts + shiny mode */}
      <span role="status" aria-live="polite" className="sr-only">
        {announce}
      </span>
    </div>
  );
}
