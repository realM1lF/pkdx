/* CommandBar — compact sticky command row (density addendum §2).
 * Row 1 (56px): growing search · 18 × 28px type-glyph toggles · filter popover
 * (Gen/Region/Special/Sort) · density toggle · shiny toggle.
 * Row 2 (32px, conditional): removable active-filter chips + reset.
 * 0 results → gold shake + hint bubble (never red, design.md §6.2-9). */
import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useAnimationControls } from 'framer-motion';
import { ChevronDown, Crown, LayoutGrid, Grid2X2, Rows3, RotateCcw, SlidersHorizontal, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import TypeGlyph from '@/components/TypeGlyph';
import { fmtNum, useLanguage, nameOfType } from '@/lib/i18n-data';
import CommandSearch from './CommandSearch';
import { GENERATIONS, POKEMON_TYPES, TYPE_COLORS } from '@/lib/types';
import type { PokemonType } from '@/lib/types';
import { useShiny } from '@/lib/shiny';
import { SORT_OPTIONS } from './dex-data';
import type { Density, SortKey, Special } from './dex-data';
import { cn } from '@/lib/utils';
import type { CSSProperties } from 'react';

const EASE_OUT = [0.16, 1, 0.3, 1] as [number, number, number, number];

/* ---------- type toggle rail ---------- */

function TypeRail({ types, onToggleType }: { types: PokemonType[]; onToggleType: (t: PokemonType) => void }) {
  const { t: t8n } = useTranslation();
  const lang = useLanguage();
  return (
    <div
      role="group"
      aria-label={t8n('pokedex.filterByType')}
      className="pdx-rail flex min-w-0 flex-1 items-center gap-1 overflow-x-auto px-0.5 py-1"
    >
      {POKEMON_TYPES.map((t) => {
        const active = types.includes(t);
        const c = TYPE_COLORS[t];
        return (
          <motion.button
            key={t}
            type="button"
            aria-pressed={active}
            aria-label={t8n('pokedex.typeFilterAria', { type: nameOfType(t, lang) })}
            title={nameOfType(t, lang)}
            whileTap={{ scale: 0.94 }}
            onClick={() => onToggleType(t)}
            className={cn(
              'pdx-type-toggle grid h-7 w-7 shrink-0 place-items-center rounded-sm border transition-all duration-150',
              active
                ? '-translate-y-0.5'
                : 'border-transparent text-tx-muted/60 hover:-translate-y-0.5',
            )}
            style={
              {
                '--tg': c.rgb,
                ...(active
                  ? {
                      color: c.base,
                      borderColor: `rgba(${c.rgb},0.6)`,
                      background: `rgba(${c.rgb},0.18)`,
                      boxShadow: `0 0 10px rgba(${c.rgb},0.45)`,
                    }
                  : undefined),
              } as CSSProperties
            }
          >
            <TypeGlyph type={t} size={15} />
          </motion.button>
        );
      })}
    </div>
  );
}

/* ---------- density segmented toggle ---------- */

const DENSITIES: Array<{ key: Density; labelKey: string; icon: typeof LayoutGrid }> = [
  { key: 'comfort', labelKey: 'pokedex.densityComfort', icon: LayoutGrid },
  { key: 'compact', labelKey: 'pokedex.densityCompact', icon: Grid2X2 },
  { key: 'list', labelKey: 'pokedex.densityList', icon: Rows3 },
];

function DensityToggle({ density, onDensity }: { density: Density; onDensity: (d: Density) => void }) {
  const { t: t8n } = useTranslation();
  return (
    <div
      role="group"
      aria-label={t8n('pokedex.density')}
      className="hidden shrink-0 items-center gap-0.5 rounded-pill border border-hairline bg-surface1 p-0.5 md:flex"
    >
      {DENSITIES.map(({ key, labelKey, icon: Icon }) => {
        const active = density === key;
        const label = t8n(labelKey);
        return (
          <button
            key={key}
            type="button"
            aria-pressed={active}
            aria-label={label}
            title={label}
            onClick={() => onDensity(key)}
            className={cn(
              'relative grid h-8 w-8 place-items-center rounded-pill transition-colors duration-150',
              active ? 'text-gold' : 'text-tx-muted hover:text-tx-primary',
            )}
          >
            {active && (
              <motion.span
                layoutId="pdx-density-thumb"
                className="absolute inset-0 rounded-pill border border-gold/50 bg-surface3"
                transition={{ type: 'spring', stiffness: 420, damping: 30 }}
              />
            )}
            <Icon size={14} strokeWidth={1.75} className="relative" />
          </button>
        );
      })}
    </div>
  );
}

/* ---------- shiny switch ---------- */

function ShinySwitch() {
  const { shiny, toggleShiny } = useShiny();
  const { t: t8n } = useTranslation();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={shiny}
      aria-label={t8n('pokedex.shinyMode')}
      title={t8n('pokedex.shinyMode')}
      onClick={toggleShiny}
      className={cn(
        'relative h-7 w-12 shrink-0 rounded-pill border transition-colors duration-200',
        shiny ? 'border-gold/60 bg-gold/25' : 'border-hairline bg-surface2',
      )}
    >
      <motion.span
        initial={false}
        animate={{ x: shiny ? 22 : 0, y: '-50%' }}
        transition={{ type: 'spring', stiffness: 420, damping: 30 }}
        className={cn(
          'absolute left-0.5 top-1/2 grid h-5 w-5 place-items-center rounded-full border',
          shiny ? 'border-gold/70 bg-surface3 shadow-glow-gold' : 'border-hairline2 bg-surface3',
        )}
      >
        <img src="/sparkle.svg" alt="" className={cn('h-3 w-3 transition-opacity', shiny ? 'opacity-100' : 'opacity-40')} />
      </motion.span>
    </button>
  );
}

/* ---------- filter popover ---------- */

interface FilterPopoverProps {
  gen: number | null;
  onGen: (g: number | null) => void;
  special: Special[];
  onToggleSpecial: (s: Special) => void;
  sort: SortKey;
  onSort: (s: SortKey) => void;
  resultCount: number;
  activeCount: number;
  onClear: () => void;
}

function FilterPopover(p: FilterPopoverProps) {
  const { t: t8n } = useTranslation();
  const lang = useLanguage();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const sectionLabel = 'pixel-label mb-1.5 block text-[8px] text-tx-muted';

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        aria-expanded={open}
        aria-label={t8n('pokedex.filters')}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'flex h-9 items-center gap-1.5 rounded-md border px-2.5 transition-all duration-200',
          open || p.activeCount > 0
            ? 'border-gold/60 bg-gold-soft text-gold'
            : 'border-hairline bg-surface2 text-tx-secondary hover:border-hairline2 hover:text-tx-primary',
        )}
      >
        <SlidersHorizontal size={14} strokeWidth={1.75} />
        <span className="hidden font-sans text-[12px] font-semibold lg:inline">{t8n('pokedex.filters')}</span>
        {p.activeCount > 0 && (
          <span className="grid h-4 min-w-4 place-items-center rounded-pill bg-gold px-1 font-sans text-[10px] font-bold text-abyss">
            {p.activeCount}
          </span>
        )}
        <ChevronDown
          size={12}
          strokeWidth={1.75}
          className={cn('transition-transform duration-200', open && 'rotate-180')}
        />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <button
              type="button"
              aria-label={t8n('pokedex.closeFilters')}
              tabIndex={-1}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-30 cursor-default"
            />
            <motion.div
              role="dialog"
              aria-label={t8n('pokedex.filters')}
              initial={{ opacity: 0, y: -4, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.96 }}
              transition={{ duration: 0.2, ease: EASE_OUT }}
              className="glass absolute right-0 top-full z-40 mt-2 max-h-[70dvh] w-[320px] overflow-y-auto rounded-md border border-hairline p-3 shadow-elevate max-sm:fixed max-sm:inset-x-3 max-sm:left-3 max-sm:top-[124px] max-sm:w-auto" data-lenis-prevent
            >
              {/* sort */}
              <div className="mb-3">
                <span className={sectionLabel}>{t8n('pokedex.sort')}</span>
                <div className="grid grid-cols-2 gap-0.5">
                  {SORT_OPTIONS.map((o) => {
                    const active = p.sort === o.key;
                    return (
                      <button
                        key={o.key}
                        type="button"
                        aria-pressed={active}
                        onClick={() => p.onSort(o.key)}
                        className={cn(
                          'flex h-8 items-center justify-between rounded-sm px-2 font-sans text-[12px] font-semibold transition-colors duration-150',
                          active ? 'bg-gold-soft text-gold' : 'text-tx-secondary hover:bg-surface3 hover:text-tx-primary',
                        )}
                      >
                        {t8n(o.labelKey)}
                        <span className={cn('h-1.5 w-1.5 rounded-full', active ? 'bg-gold' : 'bg-transparent')} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* generation */}
              <div className="mb-3">
                <span className={sectionLabel}>{t8n('pokedex.generation')}</span>
                <div className="grid grid-cols-5 gap-1">
                  <button
                    type="button"
                    aria-pressed={p.gen === null}
                    onClick={() => p.onGen(null)}
                    className={cn(
                      'pixel-label h-7 rounded-sm border text-[8px] transition-all duration-150',
                      p.gen === null
                        ? 'border-gold/60 bg-gold-soft text-gold'
                        : 'border-hairline bg-surface2 text-tx-muted hover:text-tx-primary',
                    )}
                  >
                    {t8n('pokedex.all')}
                  </button>
                  {GENERATIONS.map((g) => {
                    const active = p.gen === g.gen;
                    return (
                      <button
                        key={g.gen}
                        type="button"
                        aria-pressed={active}
                        onClick={() => p.onGen(active ? null : g.gen)}
                        className={cn(
                          'pixel-label h-7 rounded-sm border text-[8px] transition-all duration-150',
                          active
                            ? 'border-gold/60 bg-gold-soft text-gold'
                            : 'border-hairline bg-surface2 text-tx-muted hover:text-tx-primary',
                        )}
                      >
                        {g.roman}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* region (synced with generation) */}
              <div className="mb-3">
                <span className={sectionLabel}>{t8n('pokedex.region')}</span>
                <div className="grid grid-cols-3 gap-1">
                  {GENERATIONS.map((g) => {
                    const active = p.gen === g.gen;
                    return (
                      <button
                        key={g.gen}
                        type="button"
                        aria-pressed={active}
                        onClick={() => p.onGen(active ? null : g.gen)}
                        className={cn(
                          'h-7 truncate rounded-sm border px-1 font-sans text-[11px] font-semibold transition-all duration-150',
                          active
                            ? 'border-gold/60 bg-gold-soft text-gold'
                            : 'border-hairline bg-surface2 text-tx-secondary hover:text-tx-primary',
                        )}
                      >
                        {t8n(`regions.${REGION_KEY[g.region] ?? 'kanto'}`)}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* special */}
              <div className="mb-3">
                <span className={sectionLabel}>{t8n('pokedex.special')}</span>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    aria-pressed={p.special.includes('legendary')}
                    onClick={() => p.onToggleSpecial('legendary')}
                    className={cn(
                      'flex h-7 items-center gap-1.5 rounded-pill border px-2.5 font-sans text-[11px] font-bold transition-all duration-150',
                      p.special.includes('legendary')
                        ? 'border-gold/70 bg-gold-soft text-gold shadow-glow-gold'
                        : 'border-hairline bg-surface2 text-tx-secondary hover:border-gold/40 hover:text-gold',
                    )}
                  >
                    <Crown size={12} strokeWidth={1.75} />
                    {t8n('pokedex.legendary')}
                  </button>
                  <button
                    type="button"
                    aria-pressed={p.special.includes('mythical')}
                    onClick={() => p.onToggleSpecial('mythical')}
                    className={cn(
                      'flex h-7 items-center gap-1.5 rounded-pill border px-2.5 font-sans text-[11px] font-bold transition-all duration-150',
                      p.special.includes('mythical')
                        ? 'border-type-psychic/70 bg-[rgba(255,92,168,0.14)] text-type-psychic shadow-[0_0_12px_rgba(255,92,168,0.35)]'
                        : 'border-hairline bg-surface2 text-tx-secondary hover:border-type-psychic/40 hover:text-type-psychic',
                    )}
                  >
                    <img src="/sparkle.svg" alt="" className="h-3 w-3" />
                    {t8n('pokedex.mythical')}
                  </button>
                </div>
              </div>

              {/* footer */}
              <div className="flex items-center border-t border-hairline pt-2.5">
                <button
                  type="button"
                  onClick={() => {
                    p.onClear();
                  }}
                  className="flex items-center gap-1.5 font-sans text-[11px] font-semibold text-tx-muted transition-colors hover:text-gold"
                >
                  <RotateCcw size={11} strokeWidth={1.75} />
                  {t8n('pokedex.clearAll')}
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="ml-auto h-8 rounded-md border border-gold/60 bg-gold-soft px-3 font-sans text-[11px] font-bold text-gold transition-all duration-200 hover:shadow-glow-gold"
                >
                  {t8n('pokedex.showResults', { count: fmtNum(p.resultCount, lang) })}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- active-filter chips (row 2) ---------- */

interface ChipSpec {
  key: string;
  label: string;
  type?: PokemonType;
  onRemove: () => void;
}

function ChipsRow({ chips, onResetAll }: { chips: ChipSpec[]; onResetAll: () => void }) {
  const { t: t8n } = useTranslation();
  return (
    <div className="pdx-rail flex h-8 items-center gap-1.5 overflow-x-auto border-t border-hairline/60">
      <AnimatePresence mode="popLayout" initial={false}>
        {chips.map((chip) => (
          <motion.span
            key={chip.key}
            layout
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 420, damping: 30 }}
            className={cn(
              'flex h-6 shrink-0 items-center gap-1 rounded-pill border px-2 font-sans text-[11px] font-semibold',
              chip.type ? '' : 'border-hairline bg-surface2 text-tx-secondary',
            )}
            style={
              chip.type
                ? ({
                    borderColor: `rgba(${TYPE_COLORS[chip.type].rgb},0.5)`,
                    background: `rgba(${TYPE_COLORS[chip.type].rgb},0.14)`,
                    color: TYPE_COLORS[chip.type].base,
                  } as CSSProperties)
                : undefined
            }
          >
            {chip.type && <TypeGlyph type={chip.type} size={10} />}
            {chip.label}
            <button
              type="button"
              aria-label={t8n('pokedex.removeFilter', { label: chip.label })}
              onClick={chip.onRemove}
              className="grid h-4 w-4 place-items-center rounded-full text-current opacity-70 transition-all duration-150 hover:rotate-90 hover:opacity-100"
            >
              <X size={10} strokeWidth={2} />
            </button>
          </motion.span>
        ))}
      </AnimatePresence>
      <button
        type="button"
        onClick={onResetAll}
        className="pixel-label ml-auto shrink-0 px-1 text-[8px] text-gold/80 transition-colors hover:text-gold"
      >
        {t8n('pokedex.reset')}
      </button>
    </div>
  );
}

/* ---------- the bar ---------- */

export interface CommandBarProps {
  q: string;
  onQuery: (q: string) => void;
  types: PokemonType[];
  onToggleType: (t: PokemonType) => void;
  gen: number | null;
  onGen: (g: number | null) => void;
  special: Special[];
  onToggleSpecial: (s: Special) => void;
  sort: SortKey;
  onSort: (s: SortKey) => void;
  density: Density;
  onDensity: (d: Density) => void;
  onResetAll: () => void;
  resultCount: number;
  shakeKey: number;
  showEmptyHint: boolean;
}

/* GENERATIONS region display name -> locale key (regions.*) */
const REGION_KEY: Record<string, string> = {
  Kanto: 'kanto',
  Johto: 'johto',
  Hoenn: 'hoenn',
  Sinnoh: 'sinnoh',
  Unova: 'unova',
  Kalos: 'kalos',
  Alola: 'alola',
  'Galar / Hisui': 'galarHisui',
  Paldea: 'paldea',
};

export default function CommandBar(p: CommandBarProps) {
  const { t: t8n } = useTranslation();
  const lang = useLanguage();
  const controls = useAnimationControls();
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (p.shakeKey > 0) {
      void controls.start({ x: [0, -6, 6, -4, 4, 0], transition: { duration: 0.4 } });
    }
  }, [p.shakeKey, controls]);

  const chips: ChipSpec[] = [];
  if (p.q.trim()) chips.push({ key: 'q', label: `“${p.q.trim()}”`, onRemove: () => p.onQuery('') });
  for (const t of p.types)
    chips.push({ key: `t-${t}`, label: nameOfType(t, lang), type: t, onRemove: () => p.onToggleType(t) });
  if (p.gen !== null) {
    const g = GENERATIONS[p.gen - 1];
    chips.push({
      key: 'gen',
      label: `GEN ${g.roman} · ${t8n(`regions.${REGION_KEY[g.region] ?? 'kanto'}`)}`,
      onRemove: () => p.onGen(null),
    });
  }
  for (const s of p.special)
    chips.push({ key: `s-${s}`, label: t8n(`pokedex.${s}`), onRemove: () => p.onToggleSpecial(s) });
  if (p.sort !== 'id')
    chips.push({
      key: 'sort',
      label: t8n('pokedex.sortChip', {
        label: t8n(SORT_OPTIONS.find((o) => o.key === p.sort)?.labelKey ?? 'pokedex.sortOptions.id'),
      }),
      onRemove: () => p.onSort('id'),
    });

  // types live directly in the rail — the badge counts popover-held filters only
  const popoverCount = (p.gen !== null ? 1 : 0) + p.special.length + (p.sort !== 'id' ? 1 : 0);
  const hasChips = chips.length > 0;

  return (
    <motion.div animate={controls} className="sticky top-16 md:top-[6.25rem] z-40">
      <div
        className={cn(
          'glass border-b transition-all duration-200',
          stuck ? 'border-hairline2 shadow-elevate' : 'border-hairline',
        )}
      >
        <div className="mx-auto max-w-content px-4 md:px-8">
          {/* row 1 */}
          <div className="flex h-14 items-center gap-2 md:gap-3">
            <CommandSearch
              value={p.q}
              onChange={p.onQuery}
              className="w-[150px] focus-within:w-[min(420px,60vw)] sm:w-[220px] sm:focus-within:w-[min(420px,46vw)]"
            />
            <TypeRail types={p.types} onToggleType={p.onToggleType} />
            <span className="hidden h-6 w-px shrink-0 bg-hairline sm:block" aria-hidden />
            <FilterPopover
              gen={p.gen}
              onGen={p.onGen}
              special={p.special}
              onToggleSpecial={p.onToggleSpecial}
              sort={p.sort}
              onSort={p.onSort}
              resultCount={p.resultCount}
              activeCount={popoverCount}
              onClear={p.onResetAll}
            />
            <DensityToggle density={p.density} onDensity={p.onDensity} />
            <ShinySwitch />
          </div>

          {/* row 2 — active filter chips */}
          <AnimatePresence initial={false}>
            {hasChips && (
              <motion.div
                key="chips"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: EASE_OUT }}
                className="overflow-hidden"
              >
                <ChipsRow chips={chips} onResetAll={p.onResetAll} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* 0-results hint bubble (gold, never red) */}
          <AnimatePresence>
            {p.showEmptyHint && (
              <motion.div
                key="empty-hint"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="flex h-8 items-center border-t border-gold/30 bg-gold-soft/40 px-1">
                  <p className="font-sans text-[11px] font-semibold text-gold">
                    {t8n('pokedex.emptyBarHint')}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
