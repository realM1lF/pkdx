/* VersusPanel — standalone /versus + detail tab /pokemon/:id?tab=versus
 * Shared matchup components reused by Nuzlocke VersusTab.
 * Head-to-head · STAT DELTA · SPEED CHECK · damage matrix · defensive profiles.
 * Gen-aware math from @/lib/versus. */
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { RotateCcw, Search, SlidersHorizontal, Swords, UserPlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLocalePath } from '@/lib/locale-link';
import Sprite from '@/components/Sprite';
import TypeBadge from '@/components/TypeBadge';
import TypeGlyph from '@/components/TypeGlyph';
import PokeballLoader from '@/components/PokeballLoader';
import { bootNameIndex, getMove, getPokemon, padNum, pokemonTypes } from '@/lib/pokeapi';
import {
  germanAliasOfPokemon,
  nameOfMove,
  nameOfNature,
  nameOfPokemon,
  nameOfType,
  useLanguage,
} from '@/lib/i18n-data';
import type { DexIndexEntry, Move, Pokemon, StatKey } from '@/lib/types';
import { MAX_DEX_ID, STAT_LABELS, STAT_ORDER } from '@/lib/types';
import { cn } from '@/lib/utils';
import type { RegionId } from '@/lib/regions';
import { REGIONS } from '@/lib/regions';
import { loadTrainersForRegion, trainersForRegion } from '@/lib/trainer-data';
import {
  genAbilitiesOf,
  genHasMechanics,
  genItems,
  prefillTeamFromVersus,
} from '@/lib/teambuilder';
import {
  NATURES,
  damageBetween,
  koLabel,
  legalMoveSlugs,
  levelUpPool,
  pickTopMoves,
  pokemonBaseTypes,
  preferredCategory,
  speedCheck,
  statsOf,
  wildMoveset,
} from '@/lib/versus';
import type { DamageCell, EnrichedTrainer, MovesetSource, SpeedCheck, VersusSide } from '@/lib/versus';
import {
  defaultVersusContext,
  versusContextFromGame,
  VERSUS_GAME_OPTIONS,
  type VersusContext,
  type VersusField,
  type VersusWeather,
} from '@/lib/versus-context';
import { computeMatchups, typeRgb } from './data';
import TrainerPicker from './TrainerPicker';
import { Panel, SegmentedControl } from './ui';
import './versus.css';

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];
const CAT_COLORS: Record<string, string> = { physical: '#FB923C', special: '#38BDF8', status: '#A8B3C7' };

function ctxLabel(ctx: VersusContext, t: (key: string, opts?: Record<string, unknown>) => string): string {
  if (ctx.game) return t(`versus.games.${ctx.game}`, { defaultValue: ctx.game });
  return t('versus.gameDefault');
}

function isDefaultVersusCtx(ctx: VersusContext): boolean {
  return ctx.gen === 9 && !ctx.game;
}

/* ================================================================== */
/* shared hooks                                                        */
/* ================================================================== */

export function useDexIndex(): DexIndexEntry[] {
  const [idx, setIdx] = useState<DexIndexEntry[]>([]);
  useEffect(() => {
    let on = true;
    bootNameIndex()
      .then((d) => on && setIdx(d))
      .catch(() => undefined);
    return () => {
      on = false;
    };
  }, []);
  return idx;
}

/** batch-fetch move details with limited concurrency (SWR-cached by pokeapi.ts) */
export function useMoveDetails(slugs: string[]): Map<string, Move> {
  const cacheRef = useRef(new Map<string, Move>());
  const [cache, setCache] = useState<Map<string, Move>>(new Map());
  const key = slugs.join('|');
  useEffect(() => {
    const missing = slugs.filter((s) => s && !cacheRef.current.has(s));
    if (!missing.length) return;
    let cancelled = false;
    (async () => {
      const BATCH = 12;
      for (let i = 0; i < missing.length; i += BATCH) {
        const slice = missing.slice(i, i + BATCH);
        const results = await Promise.allSettled(slice.map((s) => getMove(s)));
        if (cancelled) return;
        results.forEach((r, j) => {
          if (r.status === 'fulfilled') cacheRef.current.set(slice[j], r.value);
        });
        setCache(new Map(cacheRef.current));
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return cache;
}

/** fetch a Pokémon payload by id or slug */
export function usePokemonById(idOrSlug: number | string | null): { pokemon: Pokemon | null; status: 'idle' | 'loading' | 'ready' | 'error' } {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  useEffect(() => {
    if (idOrSlug == null || idOrSlug === '') {
      setPokemon(null);
      setStatus('idle');
      return;
    }
    let on = true;
    setStatus('loading');
    getPokemon(idOrSlug)
      .then((p) => {
        if (!on) return;
        setPokemon(p);
        setStatus('ready');
      })
      .catch(() => on && setStatus('error'));
    return () => {
      on = false;
    };
  }, [idOrSlug]);
  return { pokemon, status };
}

/* ================================================================== */
/* side state + moveset resolution (trainer → wild → assumed)          */
/* ================================================================== */

export interface SideState {
  level: number;
  nature: string | null;
  evs: Partial<Record<StatKey, number>>;
  slots: string[]; // ≤4 move slugs ('' = empty)
  ability?: string | null;
  item?: string | null;
  status?: 'none' | 'burn' | 'par' | 'psn' | 'slp' | 'frz' | null;
}

export const blankSide = (level = 50): SideState => ({
  level,
  nature: null,
  evs: {},
  slots: [],
  ability: null,
  item: null,
  status: 'none',
});

export function sideToVersus(side: SideState, slug: string): VersusSide {
  return {
    slug,
    level: side.level,
    nature: side.nature ?? undefined,
    evs: side.evs,
    moves: side.slots.filter(Boolean),
    ability: side.ability ?? undefined,
    item: side.item ?? undefined,
    status: side.status && side.status !== 'none' ? side.status : undefined,
  };
}

const FIELD_PRESETS: Array<{ weather: VersusWeather; labelKey: string }> = [
  { weather: 'none', labelKey: 'versus.field.clear' },
  { weather: 'sun', labelKey: 'versus.weather.sun' },
  { weather: 'rain', labelKey: 'versus.weather.rain' },
  { weather: 'sand', labelKey: 'versus.weather.sand' },
];

const STATUS_OPTIONS: Array<NonNullable<SideState['status']>> = ['none', 'burn', 'par', 'psn'];

/**
 * Default 4 moves for a wild/own Pokémon at `level`:
 * last-4 level-up moves; padded by the STAB+coverage heuristic when thin;
 * ASSUMED SET when nothing is learnable at that level at all.
 */
export function resolveDefaultSet(
  p: Pokemon,
  level: number,
  details: Map<string, Move>,
  ctx: VersusContext = defaultVersusContext(),
): { moves: string[]; source: MovesetSource } {
  const vg = ctx.versionGroup;
  const wild = wildMoveset(p, level, vg);
  if (wild.length >= 4) return { moves: wild, source: 'wild' };
  const types = pokemonBaseTypes(p);
  const cands = levelUpPool(p, vg)
    .map((e) => ({ slug: e.slug, detail: details.get(e.slug) }))
    .filter((c): c is { slug: string; detail: Move } => Boolean(c.detail));
  const top = pickTopMoves(cands, types, { preferCategory: preferredCategory(p) });
  const merged = [...wild];
  for (const t of top) {
    if (merged.length >= 4) break;
    if (!merged.includes(t)) merged.push(t);
  }
  if (wild.length > 0) return { moves: merged, source: 'wild' };
  return { moves: merged, source: 'assumed' };
}

/** slugs whose details are worth prefetching for a side (slots + level-up pool for heuristics) */
export function prefetchSlugs(p: Pokemon | null, slots: string[], ctx: VersusContext = defaultVersusContext()): string[] {
  if (!p) return [];
  const set = new Set(slots.filter(Boolean));
  for (const e of levelUpPool(p, ctx.versionGroup)) set.add(e.slug);
  return [...set];
}

/* ================================================================== */
/* VsCombobox — compact autocomplete (opponent picker + move slots)    */
/* ================================================================== */

export interface ComboItem {
  key: string;
  label: string;
  sub?: string;
  spriteId?: number;
  type?: string; // move type glyph
  disabled?: boolean;
  /** extra lowercase match string (e.g. German alias) — display stays `label` */
  alias?: string;
}

export function VsCombobox({
  items,
  value,
  onInput,
  onSelect,
  placeholder,
  ariaLabel,
  compact = false,
  icon,
  autoFocus = false,
  menuMinWidth = 220,
}: {
  items: ComboItem[];
  value: string;
  onInput: (q: string) => void;
  onSelect: (key: string) => void;
  placeholder: string;
  ariaLabel: string;
  compact?: boolean;
  icon?: ReactNode;
  autoFocus?: boolean;
  menuMinWidth?: number;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [menuRect, setMenuRect] = useState<{ top: number; left: number; width: number } | null>(null);
  const { t } = useTranslation();

  const view = useMemo(() => {
    const q = value.trim().toLowerCase();
    const base = q
      ? items.filter(
          (i) =>
            i.label.toLowerCase().includes(q) || i.key.includes(q) || (i.alias?.includes(q) ?? false),
        )
      : items;
    return base.slice(0, 8);
  }, [items, value]);

  const syncMenuRect = useCallback(() => {
    const el = inputRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const width = Math.max(menuMinWidth, r.width);
    let top = r.bottom + 4;
    const maxH = 224;
    if (top + maxH > window.innerHeight - 8) top = Math.max(8, r.top - 4 - maxH);
    setMenuRect({ top, left: r.left, width });
  }, [menuMinWidth]);

  useLayoutEffect(() => {
    if (!open) {
      setMenuRect(null);
      return;
    }
    syncMenuRect();
  }, [open, syncMenuRect, value]);

  useEffect(() => {
    if (!open) return undefined;
    const onScroll = () => syncMenuRect();
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onScroll);
    };
  }, [open, syncMenuRect]);

  useEffect(() => {
    if (!autoFocus) return;
    inputRef.current?.focus();
    setOpen(true);
  }, [autoFocus]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (rootRef.current?.contains(t) || menuRef.current?.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  useEffect(() => {
    const el = menuRef.current;
    if (!open || !el) return undefined;

    const onWheel = (e: WheelEvent) => {
      if (!el.contains(e.target as Node)) return;
      const max = el.scrollHeight - el.clientHeight;
      if (max <= 0) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      const next = el.scrollTop + e.deltaY;
      const atTop = el.scrollTop <= 0;
      const atBottom = el.scrollTop >= max - 1;
      if ((e.deltaY < 0 && !atTop) || (e.deltaY > 0 && !atBottom)) {
        e.preventDefault();
        e.stopPropagation();
        el.scrollTop = Math.max(0, Math.min(max, next));
      } else {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [open, menuRect]);

  const pick = (item: ComboItem | undefined) => {
    if (!item || item.disabled) return;
    onSelect(item.key);
    setOpen(false);
  };

  const menu =
    open && menuRect ? (
      <motion.div
        key="vs-combo-menu"
        ref={menuRef}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.12 }}
        className="vs-combo vs-combo-portal"
        style={{ top: menuRect.top, left: menuRect.left, width: menuRect.width }}
        role="listbox"
        data-lenis-prevent
        data-lenis-prevent-wheel
      >
        {view.length === 0 ? (
          <div className="px-3 py-2 font-sans text-[11px] font-semibold text-gold">{t('versus.noMatches')}</div>
        ) : (
          view.map((item, i) => (
            <button
              key={item.key}
              type="button"
              role="option"
              aria-selected={i === active}
              data-active={i === active}
              disabled={item.disabled}
              className={cn('vs-combo-item', item.disabled && 'cursor-not-allowed opacity-35')}
              onMouseDown={(e) => {
                e.preventDefault();
                pick(item);
              }}
            >
              {item.spriteId != null && (
                <Sprite id={item.spriteId} name={item.label} className="h-6 w-6 shrink-0" skeleton={false} />
              )}
              {item.type && (
                <span style={{ color: `rgb(${typeRgb(item.type)})` }}>
                  <TypeGlyph type={item.type} size={13} />
                </span>
              )}
              <span className="truncate">{item.label}</span>
              {item.sub && <span className="pixel-label ml-auto shrink-0 text-[7px] text-tx-muted">{item.sub}</span>}
            </button>
          ))
        )}
      </motion.div>
    ) : null;

  return (
    <div ref={rootRef} className="relative min-w-0 flex-1">
      <div className="relative">
        {icon && <span className="pointer-events-none absolute left-1.5 top-1/2 -translate-y-1/2 text-tx-muted">{icon}</span>}
        <input
          ref={inputRef}
          className={cn('vs-input w-full', icon && 'pl-6', compact ? 'h-[22px] text-[11px]' : 'h-7')}
          value={value}
          placeholder={placeholder}
          aria-label={ariaLabel}
          role="combobox"
          aria-expanded={open}
          onFocus={() => {
            setOpen(true);
            syncMenuRect();
          }}
          onChange={(e) => {
            onInput(e.target.value);
            setOpen(true);
            setActive(0);
            syncMenuRect();
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setActive((a) => Math.min(view.length - 1, a + 1));
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setActive((a) => Math.max(0, a - 1));
            } else if (e.key === 'Enter') {
              e.preventDefault();
              pick(view[active] ?? view[0]);
            } else if (e.key === 'Escape') {
              setOpen(false);
            }
          }}
        />
      </div>
      {typeof document !== 'undefined' &&
        open &&
        createPortal(<AnimatePresence mode="wait">{menu}</AnimatePresence>, document.body)}
    </div>
  );
}

/** opponent autocomplete on the dex index (bootNameIndex + sprite, SELF disabled) */
export function OpponentAutocomplete({
  index,
  excludeId,
  onPick,
  placeholder,
}: {
  index: DexIndexEntry[];
  excludeId?: number;
  onPick: (id: number) => void;
  placeholder?: string;
}) {
  const { t } = useTranslation();
  const lang = useLanguage();
  const [q, setQ] = useState('');
  const items = useMemo<ComboItem[]>(
    () =>
      index.map((e) => ({
        key: String(e.id),
        label: nameOfPokemon(e.id, lang),
        sub: e.num,
        spriteId: e.id,
        disabled: e.id === excludeId,
        // de artifact name → matches "glumanda" against charmander either way
        alias: `${e.name} ${germanAliasOfPokemon(e.id) ?? ''}`,
      })),
    [index, excludeId, lang],
  );
  return (
    <VsCombobox
      items={items}
      value={q}
      onInput={setQ}
      onSelect={(key) => {
        onPick(Number(key));
        setQ('');
      }}
      placeholder={placeholder ?? t('versus.pickOpponentPlaceholder')}
      ariaLabel={t('versus.opponentSearch')}
      icon={<Search size={12} />}
    />
  );
}

/* ================================================================== */
/* move slots (4 editable, autocomplete from the legal pool)           */
/* ================================================================== */

export function MoveSlots({
  slots,
  pool,
  details,
  onChange,
  onReset,
  source,
}: {
  slots: string[];
  pool: string[];
  details: Map<string, Move>;
  onChange: (slots: string[]) => void;
  onReset?: () => void;
  source: MovesetSource;
}) {
  const { t } = useTranslation();
  const lang = useLanguage();
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [q, setQ] = useState('');
  const items = useMemo<ComboItem[]>(
    () =>
      pool.map((slug) => {
        const mv = details.get(slug);
        return {
          key: slug,
          label: nameOfMove(slug, lang),
          type: mv?.type.name,
          sub: mv?.power ? String(mv.power) : '—',
          alias: slug,
        };
      }),
    [pool, details, lang],
  );
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="pixel-label text-[7px] text-tx-muted">
          {t('versus.movesSource', { source: t(`versus.source${source.charAt(0).toUpperCase() + source.slice(1)}`) })}
        </span>
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            title={t('versus.resetDefault')}
            className="grid h-4 w-4 place-items-center rounded-sm text-tx-muted transition-colors hover:text-gold"
          >
            <RotateCcw size={10} />
          </button>
        )}
      </div>
      <div className="relative z-20 grid grid-cols-2 gap-1 overflow-visible">
        {[0, 1, 2, 3].map((i) => {
          const slug = slots[i] ?? '';
          const mv = slug ? details.get(slug) : undefined;
          if (editIdx === i) {
            return (
              <VsCombobox
                key={i}
                compact
                autoFocus
                menuMinWidth={240}
                items={items}
                value={q}
                onInput={setQ}
                onSelect={(key) => {
                  const next = [...slots];
                  while (next.length < 4) next.push('');
                  next[i] = key;
                  onChange(next.slice(0, 4));
                  setEditIdx(null);
                  setQ('');
                }}
                placeholder={t('versus.movePlaceholder')}
                ariaLabel={t('versus.moveSlotAria', { n: i + 1 })}
              />
            );
          }
          return (
            <button
              key={i}
              type="button"
              onClick={() => {
                setEditIdx(i);
                setQ('');
              }}
              className={cn(
                'flex h-[22px] items-center gap-1 truncate rounded-md border border-hairline bg-abyss/60 px-1.5 text-left',
                'font-sans text-[11px] font-semibold transition-colors duration-150 hover:border-hairline2',
                slug ? 'text-tx-primary' : 'text-tx-muted',
              )}
              title={slug ? nameOfMove(slug, lang) : t('versus.emptySlot')}
            >
              {mv && (
                <span style={{ color: `rgb(${typeRgb(mv.type.name)})` }}>
                  <TypeGlyph type={mv.type.name} size={11} />
                </span>
              )}
              <span className="truncate">{slug ? nameOfMove(slug, lang) : '—'}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ================================================================== */
/* side card (artwork, badges, level, TUNE, move slots)                */
/* ================================================================== */

export function SideCard({
  pokemon,
  side,
  onSide,
  slotsSource,
  details,
  onSlotsChange,
  onSlotsReset,
  aura = true,
  versionGroup,
  showAbilityItem = true,
  showStatus = false,
}: {
  pokemon: Pokemon;
  side: SideState;
  onSide: (patch: Partial<SideState>) => void;
  slotsSource: MovesetSource;
  details: Map<string, Move>;
  onSlotsChange: (slots: string[]) => void;
  onSlotsReset?: () => void;
  aura?: boolean;
  versionGroup: string;
  showAbilityItem?: boolean;
  showStatus?: boolean;
}) {
  const { t } = useTranslation();
  const lang = useLanguage();
  const types = pokemonTypes(pokemon);
  const [tune, setTune] = useState(false);
  const [shake, setShake] = useState(false);
  const mech = genHasMechanics(versionGroup);
  const pool = useMemo(() => legalMoveSlugs(pokemon, versionGroup), [pokemon, versionGroup]);
  const abilityOptions = useMemo(
    () => (showAbilityItem && mech.abilities ? genAbilitiesOf(versionGroup, pokemon.name) : []),
    [showAbilityItem, mech.abilities, versionGroup, pokemon.name],
  );
  const itemOptions = useMemo(
    () => (showAbilityItem && mech.items ? genItems(versionGroup) : []),
    [showAbilityItem, mech.items, versionGroup],
  );

  const setLevel = (raw: string) => {
    const lv = Number(raw);
    if (!raw || (lv >= 1 && lv <= 100)) {
      onSide({ level: Math.min(100, Math.max(1, lv || 1)) });
    } else {
      setShake(true);
      window.setTimeout(() => setShake(false), 450);
    }
  };

  return (
    <div className="flex flex-col gap-2 overflow-visible p-3">
      <div className="flex items-center gap-3">
        <div className="relative grid h-[76px] w-[76px] shrink-0 place-items-center">
          {aura && (
            <div
              aria-hidden
              className="vs-aura"
              style={{
                background: `radial-gradient(circle at 50% 55%, rgba(${typeRgb(types[0] ?? 'normal')},0.38) 0%, rgba(${typeRgb(types[0] ?? 'normal')},0.12) 42%, transparent 70%)`,
              }}
            />
          )}
          <Sprite id={pokemon.id} name={nameOfPokemon(pokemon.id, lang)} era="artwork" className="relative z-10 h-[72px] w-[72px]" eager />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-1.5">
            <span className="truncate font-display text-[15px] font-bold uppercase text-tx-primary">
              {nameOfPokemon(pokemon.id, lang)}
            </span>
            <span className="pixel-label shrink-0 text-[7px] text-gold">{padNum(pokemon.id)}</span>
          </div>
          <div className="mt-1 flex flex-wrap gap-1">
            {types.map((t) => (
              <TypeBadge key={t} type={t} className="px-2 py-0.5 text-[9px]" />
            ))}
          </div>
          <div className="mt-1.5 flex items-center gap-1.5">
            <span className="pixel-label text-[7px] text-tx-muted">LV</span>
            <input
              type="number"
              min={1}
              max={100}
              value={side.level}
              onChange={(e) => setLevel(e.target.value)}
              className={cn('vs-input w-12 text-center tabular-nums', shake && 'vs-shake')}
              aria-label={t('versus.level')}
            />
            <button
              type="button"
              onClick={() => setTune((t) => !t)}
              aria-pressed={tune}
              className={cn(
                'ml-auto inline-flex h-5 items-center gap-1 rounded-pill border px-2 font-sans text-[9px] font-bold uppercase transition-colors duration-150',
                tune ? 'border-gold/60 bg-gold/10 text-gold' : 'border-hairline text-tx-muted hover:text-tx-secondary',
              )}
            >
              <SlidersHorizontal size={9} />
              {t('versus.tune')}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {tune && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-1.5 rounded-md border border-hairline bg-abyss/40 p-2">
              <label className="flex items-center gap-2">
                <span className="pixel-label w-12 text-[7px] text-tx-muted">{t('versus.nature')}</span>
                <select
                  className="dx-select h-6 flex-1 text-[11px]"
                  value={side.nature ?? ''}
                  onChange={(e) => onSide({ nature: e.target.value || null })}
                  aria-label={t('versus.natureAria')}
                >
                  <option value="">{t('versus.neutral')}</option>
                  {NATURES.filter((n) => n.plus).map((n) => (
                    <option key={n.name} value={n.name}>
                      {nameOfNature(n.name, lang)} (+{n.plus ? STAT_LABELS[n.plus] : ''} −{n.minus ? STAT_LABELS[n.minus] : ''})
                    </option>
                  ))}
                </select>
              </label>
              <div className="grid grid-cols-6 gap-1">
                {STAT_ORDER.map((key) => (
                  <label key={key} className="flex flex-col items-center gap-0.5">
                    <span className="pixel-label text-[6px] text-tx-muted">{STAT_LABELS[key]}</span>
                    <input
                      type="number"
                      min={0}
                      max={252}
                      step={4}
                      value={side.evs[key] ?? 0}
                      onChange={(e) => {
                        const v = Math.min(252, Math.max(0, Number(e.target.value) || 0));
                        onSide({ evs: { ...side.evs, [key]: v } });
                      }}
                      className="vs-input w-full px-1 text-center text-[10px] tabular-nums"
                      aria-label={t('versus.evsAria', { stat: STAT_LABELS[key] })}
                    />
                  </label>
                ))}
              </div>
              {showAbilityItem && mech.abilities && (
                <label className="flex items-center gap-2">
                  <span className="pixel-label w-12 text-[7px] text-tx-muted">{t('tb.ability')}</span>
                  <select
                    className="dx-select h-6 flex-1 text-[11px]"
                    value={side.ability ?? ''}
                    onChange={(e) => onSide({ ability: e.target.value || null })}
                    aria-label={t('tb.ability')}
                  >
                    <option value="">{t('versus.neutral')}</option>
                    {abilityOptions.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              {showAbilityItem && mech.items && (
                <label className="flex items-center gap-2">
                  <span className="pixel-label w-12 text-[7px] text-tx-muted">{t('tb.item')}</span>
                  <select
                    className="dx-select h-6 flex-1 text-[11px]"
                    value={side.item ?? ''}
                    onChange={(e) => onSide({ item: e.target.value || null })}
                    aria-label={t('tb.item')}
                  >
                    <option value="">{t('versus.neutral')}</option>
                    {itemOptions.map((it) => (
                      <option key={it} value={it}>
                        {it}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              {showStatus && (
                <div className="flex flex-wrap items-center gap-1">
                  <span className="pixel-label w-12 text-[7px] text-tx-muted">{t('versus.statusLabel')}</span>
                  {STATUS_OPTIONS.map((st) => (
                    <button
                      key={st ?? 'none'}
                      type="button"
                      aria-pressed={(side.status ?? 'none') === st}
                      onClick={() => onSide({ status: st })}
                      className={cn(
                        'rounded-pill border px-2 py-0.5 font-sans text-[9px] font-bold uppercase transition-colors',
                        (side.status ?? 'none') === st
                          ? 'border-gold/60 bg-gold/10 text-gold'
                          : 'border-hairline text-tx-muted hover:text-tx-secondary',
                      )}
                    >
                      {t(`versus.status.${st ?? 'none'}`)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <MoveSlots
        slots={side.slots}
        pool={pool}
        details={details}
        onChange={onSlotsChange}
        onReset={onSlotsReset}
        source={slotsSource}
      />
    </div>
  );
}

/* ================================================================== */
/* damage matrix (36px rows, micro-bars, KO chips, eff icons)          */
/* ================================================================== */

export interface MatrixRow {
  slug: string;
  cell: DamageCell | null;
  detail: Move | undefined;
}

export function DamageMatrix({ rows, heading }: { rows: MatrixRow[]; heading: string }) {
  const { t } = useTranslation();
  const lang = useLanguage();
  return (
    <div>
      <div className="grid grid-cols-[20px_minmax(0,1fr)_18px_76px_34px_46px] items-center gap-1.5 border-b border-hairline px-2 pb-1">
        <span className="pixel-label text-[7px] text-tx-muted"> </span>
        <span className="pixel-label text-[7px] text-tx-muted">{heading}</span>
        <span className="pixel-label text-center text-[6px] text-tx-muted">{t('versus.catCol')}</span>
        <span className="pixel-label text-[7px] text-tx-muted">{t('versus.rangeCol')}</span>
        <span className="pixel-label text-center text-[7px] text-tx-muted">{t('versus.effCol')}</span>
        <span className="pixel-label text-right text-[7px] text-tx-muted">{t('versus.koCol')}</span>
      </div>
      {rows.length === 0 && (
        <div className="flex h-24 items-center justify-center font-sans text-[11px] text-tx-muted">{t('versus.noSet')}</div>
      )}
      {rows.map((row, ri) => {
        const mv = row.detail;
        const type = mv?.type.name ?? 'normal';
        const cat = mv?.damage_class.name ?? 'status';
        const cell = row.cell;
        const [lo, hi] = cell?.pct ?? [0, 0];
        const damaging = cell ? cell.range[1] > 0 : false;
        const koN = damaging && cell ? Math.min(4, cell.koHits) : 0;
        const eff = cell?.eff ?? 1;
        return (
          <div key={row.slug || `row-${ri}`} className="vs-row" style={{ '--mt': typeRgb(type) } as CSSProperties}>
            <span style={{ color: `rgb(${typeRgb(type)})` }}>
              <TypeGlyph type={type} size={14} />
            </span>
            <span className="truncate font-sans text-[12px] font-semibold text-tx-primary" title={nameOfMove(row.slug, lang)}>
              {nameOfMove(row.slug, lang)}
            </span>
            <span
              role="img"
              aria-label={t(`detail.moves.cat${cat.charAt(0).toUpperCase() + cat.slice(1)}`)}
              title={t(`detail.moves.cat${cat.charAt(0).toUpperCase() + cat.slice(1)}`)}
              className="vs-cat"
              style={{
                backgroundColor: CAT_COLORS[cat] ?? CAT_COLORS.status,
                WebkitMask: `url(/move-${cat}.svg) center / contain no-repeat`,
                mask: `url(/move-${cat}.svg) center / contain no-repeat`,
              }}
            />
            {damaging ? (
              <span className="flex flex-col gap-0.5">
                <span className="vs-hpbar">
                  <i style={{ width: `${Math.min(100, hi)}%` }} />
                  <b style={{ left: `${Math.min(100, lo)}%` }} />
                </span>
                <span className="font-sans text-[8px] font-semibold tabular-nums text-tx-muted">
                  {Math.round(lo)}–{Math.round(hi)}%
                </span>
              </span>
            ) : (
              <span className="font-sans text-[9px] text-tx-muted">{mv ? (cell ? t('versus.statusMove') : '…') : <span className="vs-skel inline-block h-2.5 w-12" />}</span>
            )}
            <span className="vs-eff" data-e={damaging ? String(eff) : '1'}>
              {damaging
                ? eff === 1
                  ? '×1'
                  : eff === 0
                    ? '×0'
                    : eff === 0.5
                      ? '×½'
                      : eff === 0.25
                        ? '×¼'
                        : eff === 2
                          ? '×2'
                          : '×4'
                : '—'}
            </span>
            <span className="text-right">
              <span className="vs-ko" data-n={koN} title={cell && cell.koChance > 0 && cell.koChance < 1 ? t('versus.koChance', { pct: Math.round(cell.koChance * 100) }) : undefined}>
                {koLabel(cell)}
              </span>
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ================================================================== */
/* STAT DELTA + SPEED CHECK + DEFENSIVE PROFILES                       */
/* ================================================================== */

export function StatDelta({
  you,
  foe,
}: {
  you: Record<StatKey, number> | null;
  foe: Record<StatKey, number> | null;
}) {
  const max = Math.max(1, ...STAT_ORDER.map((k) => Math.max(you?.[k] ?? 0, foe?.[k] ?? 0)));
  return (
    <div className="flex flex-col gap-1 p-3">
      {STAT_ORDER.map((key) => {
        const a = you?.[key] ?? 0;
        const b = foe?.[key] ?? 0;
        const d = a - b;
        return (
          <div key={key} className="vs-statpair">
            <span className="pixel-label text-[7px] text-tx-muted">{STAT_LABELS[key]}</span>
            <span className="text-right font-display text-[10px] font-bold tabular-nums text-gold">{a || '—'}</span>
            <span className="vs-statbar you">
              <i style={{ width: `${(a / max) * 100}%` }} />
            </span>
            <span className="vs-statbar foe">
              <i style={{ width: `${(b / max) * 100}%` }} />
            </span>
            <span className="font-display text-[10px] font-bold tabular-nums text-[#45C8FF]">{b || '—'}</span>
            <span
              className={cn(
                'text-right font-sans text-[10px] font-bold tabular-nums',
                d > 0 ? 'text-gold' : d < 0 ? 'text-tx-muted' : 'text-tx-muted/50',
              )}
            >
              {d > 0 ? `+${d}` : d === 0 ? '±0' : d}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function SpeedCheckBanner({ check, youName, foeName }: { check: SpeedCheck | null; youName: string; foeName: string }) {
  const { t } = useTranslation();
  if (!check) {
    return (
      <div className="flex h-10 items-center justify-center gap-2 rounded-lg border border-hairline bg-surface1/60">
        <span className="pixel-label text-[8px] text-tx-muted">{t('versus.speedCheck')} —</span>
      </div>
    );
  }
  const youWin = check.delta > 0;
  const tie = check.delta === 0;
  return (
    <div
      className={cn(
        'flex h-10 items-center justify-center gap-3 rounded-lg border px-3',
        youWin || tie ? 'border-gold/50 bg-gold/10' : 'border-hairline bg-surface1/60',
      )}
    >
      <span className={cn('pixel-label text-[8px]', youWin || tie ? 'text-gold' : 'text-tx-muted')}>{t('versus.speedCheck')}</span>
      <span className={cn('font-display text-[12px] font-bold uppercase tracking-wide', youWin ? 'text-gold' : tie ? 'text-tx-primary' : 'text-tx-muted')}>
        {tie
          ? t('versus.speedTie', { speed: check.you })
          : youWin
            ? t('versus.speedWin', { name: youName, delta: check.delta })
            : t('versus.speedLose', { name: foeName, delta: -check.delta })}
      </span>
      <span className="hidden font-sans text-[10px] font-semibold tabular-nums text-tx-muted sm:inline">
        {check.you} vs {check.foe}
      </span>
    </div>
  );
}

export function DefensiveProfiles({ youTypes, foeTypes, youName, foeName }: { youTypes: string[]; foeTypes: string[]; youName: string; foeName: string }) {
  const { t } = useTranslation();
  const titleFor = (n: string) =>
    n === 'YOU' ? t('versus.youTake') : t('versus.nameTakes', { name: n });
  return (
    <div className="grid grid-cols-1 gap-2 p-3 sm:grid-cols-2">
      <DefenseColumn title={titleFor(youName)} types={youTypes} />
      <DefenseColumn title={titleFor(foeName)} types={foeTypes} />
    </div>
  );
}

function DefenseColumn({ title, types }: { title: string; types: string[] }) {
  const { t } = useTranslation();
  const m = computeMatchups(types);
  return (
    <div className="flex flex-col gap-1">
      <span className="pixel-label text-[7px] text-tx-muted">{title}</span>
      <MatchupRow label={t('versus.weak')} types={m.weak} mult="×2" color="#F6C945" />
      <MatchupRow label={t('versus.resist')} types={m.resist} mult="×½" color="#63D96B" />
      <MatchupRow label={t('versus.immune')} types={m.immune} mult="×0" color="#5E6680" />
    </div>
  );
}

function MatchupRow({ label, types, mult, color }: { label: string; types: string[]; mult: string; color: string }) {
  const lang = useLanguage();
  return (
    <div className="flex min-h-[20px] items-center gap-1.5">
      <span className="w-10 shrink-0 font-sans text-[8px] font-bold uppercase" style={{ color }}>
        {label} {mult}
      </span>
      <div className="flex flex-wrap gap-1">
        {types.length === 0 && <span className="font-sans text-[9px] text-tx-muted/50">—</span>}
        {types.map((t) => (
          <span
            key={t}
            className="inline-flex h-[18px] items-center gap-1 rounded-pill border px-1.5 font-sans text-[9px] font-bold uppercase"
            style={{
              color: `rgb(${typeRgb(t)})`,
              borderColor: `rgba(${typeRgb(t)},0.4)`,
              background: `rgba(${typeRgb(t)},0.12)`,
            }}
          >
            <TypeGlyph type={t} size={10} />
            {nameOfType(t, lang)}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ================================================================== */
/* matrix computation helper (shared with the Nuzlocke tab)            */
/* ================================================================== */

export function computeMatrix(
  attacker: VersusSide,
  defender: VersusSide,
  slots: string[],
  details: Map<string, Move>,
  ctx: VersusContext = defaultVersusContext(),
  field?: VersusField,
): MatrixRow[] {
  return slots
    .filter(Boolean)
    .slice(0, 4)
    .map((slug) => ({
      slug,
      cell: damageBetween(attacker, defender, slug, details.get(slug), ctx, field),
      detail: details.get(slug),
    }));
}

/* ================================================================== */
/* VersusPanel — the /versus page + /pokemon/:id VERSUS tab                           */
/* ================================================================== */

function SideEmpty({ message }: { message: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 p-6">
      <img src="/pokeball.svg" alt="" className="h-10 w-10 opacity-50" />
      <p className="text-center font-sans text-[12px] text-gold">{message}</p>
    </div>
  );
}

export default function VersusPanel({
  initialYou,
  initialVs,
  onYouChange,
  onOpponentChange,
  context: contextProp,
  initialTrainerNode,
  initialTrainerRegion,
}: {
  /** Pre-fill your side (e.g. current dex entry). User can still change via picker. */
  initialYou?: number | null;
  initialVs?: string | null;
  onYouChange?: (id: number | null) => void;
  onOpponentChange?: (id: number | null) => void;
  context?: VersusContext;
  initialTrainerNode?: string | null;
  initialTrainerRegion?: RegionId | null;
}) {
  const { t } = useTranslation();
  const lang = useLanguage();
  const navigate = useNavigate();
  const localePath = useLocalePath();
  const index = useDexIndex();

  const [ctx, setCtx] = useState<VersusContext>(() => contextProp ?? defaultVersusContext());
  useEffect(() => {
    if (contextProp) setCtx(contextProp);
  }, [contextProp]);

  const [field, setField] = useState<VersusField>({ weather: 'none', terrain: 'none' });
  const [foeMode, setFoeMode] = useState<'dex' | 'trainer'>('dex');
  const [trainerRegion, setTrainerRegion] = useState<RegionId>(() => ctx.region ?? 'kanto');
  const [trainerCtx, setTrainerCtx] = useState('');
  const [trainersReady, setTrainersReady] = useState(false);

  useEffect(() => {
    let on = true;
    setTrainersReady(false);
    loadTrainersForRegion(trainerRegion)
      .then(() => on && setTrainersReady(true))
      .catch(() => on && setTrainersReady(true));
    return () => {
      on = false;
    };
  }, [trainerRegion]);

  const idOf = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of index) map.set(e.name, e.id);
    return (slug: string) => map.get(slug) ?? 0;
  }, [index]);

  /* ----- your side selection ----- */
  const [youId, setYouId] = useState<number | null>(() => {
    const n = initialYou ?? null;
    return n != null && Number.isInteger(n) && n >= 1 && n <= MAX_DEX_ID ? n : null;
  });
  const { pokemon: youPokemon, status: youStatus } = usePokemonById(youId);

  useEffect(() => {
    onYouChange?.(youId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [youId]);

  const [prevInitialYou, setPrevInitialYou] = useState(initialYou);
  if (initialYou != null && initialYou !== prevInitialYou) {
    setPrevInitialYou(initialYou);
    setYouId(initialYou);
  }

  /* ----- foe selection (deep-link ?vs= resolves once the dex index is in) ----- */
  const [foeId, setFoeId] = useState<number | null>(() => {
    const n = Number(initialVs);
    return Number.isInteger(n) && n >= 1 && n <= MAX_DEX_ID ? n : null;
  });
  const { pokemon: foePokemon, status: foeStatus } = usePokemonById(foeId);

  /* report opponent upstream → ?vs= write */
  useEffect(() => {
    onOpponentChange?.(foeId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [foeId]);

  /* ----- side states ----- */
  const [you, setYou] = useState<SideState>(() => blankSide(50));
  const [foe, setFoe] = useState<SideState>(() => blankSide(50));
  const [youCustom, setYouCustom] = useState(false);
  const [foeCustom, setFoeCustom] = useState(false);
  const [youSource, setYouSource] = useState<MovesetSource>('wild');
  const [foeSource, setFoeSource] = useState<MovesetSource>('wild');

  /* move details for both pools (slots + level-up candidates) */
  const wanted = useMemo(
    () => [...prefetchSlugs(youPokemon, you.slots, ctx), ...prefetchSlugs(foePokemon, foe.slots, ctx)],
    [youPokemon, foePokemon, you.slots, foe.slots, ctx],
  );
  const details = useMoveDetails(wanted);

  /* default sets: recompute while the user hasn't customized slots */
  useEffect(() => {
    if (youCustom || !youPokemon) return;
    const def = resolveDefaultSet(youPokemon, you.level, details, ctx);
    if (def.moves.length) {
      setYou((s) => ({ ...s, slots: def.moves }));
      setYouSource(def.source);
    }
  }, [youPokemon, you.level, details, youCustom, ctx]);

  useEffect(() => {
    if (foeCustom || !foePokemon) return;
    const def = resolveDefaultSet(foePokemon, foe.level, details, ctx);
    if (def.moves.length) {
      setFoe((s) => ({ ...s, slots: def.moves }));
      setFoeSource(def.source);
    }
  }, [foePokemon, foe.level, details, foeCustom, ctx]);

  /* reset your side when Pokémon changes */
  const [prevYouId, setPrevYouId] = useState(youId);
  if (prevYouId !== youId) {
    setPrevYouId(youId);
    if (!youCustom) {
      setYou(blankSide(50));
      setYouSource('wild');
    }
  }

  /* reset foe state when the opponent changes (derived-state-during-render) */
  const [prevFoeId, setPrevFoeId] = useState(foeId);
  if (prevFoeId !== foeId) {
    setPrevFoeId(foeId);
    if (!foeCustom) {
      setFoe(blankSide(50));
      setFoeSource('wild');
    }
  }

  /* ----- computed matchup ----- */
  const youV = useMemo(() => (youPokemon ? sideToVersus(you, youPokemon.name) : null), [you, youPokemon]);
  const foeV = useMemo(() => (foePokemon ? sideToVersus(foe, foePokemon.name) : null), [foe, foePokemon]);

  const check = useMemo(() => (youV && foeV ? speedCheck(youV, foeV, ctx) : null), [youV, foeV, ctx]);
  const youStats = useMemo(() => (youV ? statsOf(youV, ctx) : null), [youV, ctx]);
  const foeStats = useMemo(() => (foeV ? statsOf(foeV, ctx) : null), [foeV, ctx]);

  const youRows = useMemo(
    () => (youV && foeV ? computeMatrix(youV, foeV, you.slots, details, ctx, field) : []),
    [youV, foeV, you.slots, details, ctx, field],
  );
  const foeRows = useMemo(
    () => (youV && foeV ? computeMatrix(foeV, youV, foe.slots, details, ctx, field) : []),
    [youV, foeV, foe.slots, details, ctx, field],
  );

  const youName = youPokemon ? nameOfPokemon(youPokemon.id, lang) : t('versus.pickYou');
  const foeName = foePokemon ? nameOfPokemon(foePokemon.id, lang) : trainerCtx || t('versus.foe');

  const pickGame = (game: string) => {
    setCtx(game ? versusContextFromGame(game, trainerRegion) : { ...defaultVersusContext(), region: trainerRegion });
  };

  const pickTrainerMon = (tr: EnrichedTrainer, member: { species: string; level: number; moves?: string[] }) => {
    const id = idOf(member.species);
    if (id) setFoeId(id);
    setTrainerCtx(`${tr.name.toUpperCase()} · ${tr.class}`);
    setFoe({
      ...blankSide(member.level),
      slots: member.moves?.length ? member.moves : [],
    });
    setFoeCustom((member.moves?.length ?? 0) > 0);
    setFoeSource((member.moves?.length ?? 0) > 0 ? 'trainer' : 'wild');
  };

  const trainerDeepLinkHandled = useRef(false);
  useEffect(() => {
    if (!initialTrainerNode || !initialTrainerRegion || trainerDeepLinkHandled.current || !index.length) return;
    trainerDeepLinkHandled.current = true;
    setFoeMode('trainer');
    setTrainerRegion(initialTrainerRegion);
    void loadTrainersForRegion(initialTrainerRegion).then(() => {
      const atNode = trainersForRegion(initialTrainerRegion).filter((tr) => tr.node === initialTrainerNode);
      const tr = atNode.find((t) => t.important) ?? atNode[0];
      if (!tr?.party.length) return;
      const member = tr.party.reduce((best, m) => (m.level > best.level ? m : best), tr.party[0]);
      pickTrainerMon(tr, member);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTrainerNode, initialTrainerRegion, index.length]);

  const addToTeam = () => {
    if (!youPokemon) return;
    prefillTeamFromVersus(
      {
        pokemonId: youPokemon.id,
        slug: youPokemon.name,
        level: you.level,
        moves: you.slots,
        ability: you.ability,
        item: you.item,
        nature: you.nature,
        evs: you.evs as Record<StatKey, number> | undefined,
      },
      ctx.versionGroup,
    );
    navigate(localePath('/team'));
  };

  const trainers = trainersForRegion(trainerRegion);

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* ---------- toolbar: game + field + calc badge ---------- */}
      <div className="col-span-12 flex flex-wrap items-center gap-2 rounded-lg border border-hairline bg-surface1/60 px-3 py-2">
        <label className="flex items-center gap-1.5">
          <span className="pixel-label text-[7px] text-tx-muted">{t('versus.gameSelect')}</span>
          <select
            className="dx-select h-6 min-w-[160px] max-w-[220px] text-[10px]"
            value={ctx.game ?? ''}
            onChange={(e) => pickGame(e.target.value)}
            aria-label={t('versus.gameSelect')}
          >
            <option value="">{t('versus.gameDefault')}</option>
            {VERSUS_GAME_OPTIONS.map((o) => (
              <option key={o.game} value={o.game}>
                {t(`versus.games.${o.game}`, { defaultValue: o.label })}
              </option>
            ))}
          </select>
        </label>
        <div className="flex flex-wrap items-center gap-1">
          <span className="pixel-label text-[7px] text-tx-muted">{t('versus.fieldLabel')}</span>
          {FIELD_PRESETS.map((p) => (
            <button
              key={p.weather}
              type="button"
              aria-pressed={(field.weather ?? 'none') === p.weather}
              onClick={() => setField({ weather: p.weather, terrain: 'none' })}
              className={cn(
                'rounded-pill border px-2 py-0.5 font-sans text-[9px] font-bold uppercase transition-colors',
                (field.weather ?? 'none') === p.weather
                  ? 'border-gold/60 bg-gold/10 text-gold'
                  : 'border-hairline text-tx-muted hover:text-tx-secondary',
              )}
            >
              {t(p.labelKey)}
            </button>
          ))}
        </div>
        {!isDefaultVersusCtx(ctx) && (
          <span className="rounded-pill border border-gold/40 bg-gold/10 px-2 py-0.5 font-sans text-[9px] font-bold uppercase text-gold">
            {t('versus.calcBadge', { gen: ctx.gen, label: ctxLabel(ctx, t) })}
          </span>
        )}
        <button
          type="button"
          onClick={addToTeam}
          disabled={!youPokemon}
          className="inline-flex h-6 items-center gap-1 rounded-pill border border-gold/50 bg-gold/10 px-2.5 font-sans text-[9px] font-bold uppercase text-gold transition-colors hover:bg-gold/20 disabled:cursor-not-allowed disabled:opacity-40 sm:ml-auto"
        >
          <UserPlus size={10} />
          {t('versus.addToTeam')}
        </button>
      </div>

      {/* ---------- head-to-head ---------- */}
      <Panel
        eyebrow={t('versus.you')}
        title={youPokemon ? youName : t('versus.pickYou')}
        className="col-span-12 lg:col-span-5"
        bodyClassName="min-h-[150px] flex flex-col"
        right={
          <div className="w-36">
            <OpponentAutocomplete
              index={index}
              excludeId={foeId ?? undefined}
              onPick={(id) => setYouId(id)}
              placeholder={t('versus.pickYouPlaceholder')}
            />
          </div>
        }
      >
        {youStatus === 'idle' && <SideEmpty message={t('versus.pickYouHint')} />}
        {youStatus === 'loading' && (
          <div className="flex flex-1 items-center justify-center p-6">
            <PokeballLoader variant="inline" />
          </div>
        )}
        {youStatus === 'error' && <SideEmpty message={t('versus.errorUnavailable')} />}
        {youStatus === 'ready' && youPokemon && (
          <SideCard
            pokemon={youPokemon}
            side={you}
            onSide={(patch) => setYou((s) => ({ ...s, ...patch }))}
            slotsSource={youSource}
            details={details}
            versionGroup={ctx.versionGroup}
            showStatus
            onSlotsChange={(slots) => {
              setYouCustom(true);
              setYouSource('custom');
              setYou((s) => ({ ...s, slots }));
            }}
            onSlotsReset={() => setYouCustom(false)}
          />
        )}
      </Panel>

      {/* VS mark */}
      <div className="col-span-12 flex items-center justify-center lg:col-span-2">
        <div className="flex flex-col items-center gap-1">
          <span
            className="font-display text-[34px] font-black uppercase leading-none text-gold"
            style={{ textShadow: '0 0 24px rgba(246,201,69,0.45)' }}
          >
            VS
          </span>
          <Swords size={14} className="text-gold/70" />
        </div>
      </div>

      <Panel
        eyebrow={t('versus.foe')}
        title={foePokemon ? foeName : trainerCtx || t('versus.pickOpponent')}
        className="col-span-12 lg:col-span-5"
        bodyClassName="flex min-h-[150px] flex-col"
        right={
          <div className="flex flex-wrap items-center gap-2">
            <SegmentedControl
              id="detail-foe-mode"
              size="xs"
              ariaLabel={t('versus.opponentSource')}
              value={foeMode}
              onChange={(v) => setFoeMode(v as 'dex' | 'trainer')}
              options={[
                { value: 'dex', label: t('versus.dexMode') },
                { value: 'trainer', label: t('versus.trainerMode') },
              ]}
            />
            {foeMode === 'dex' && (
              <div className="w-36">
                <OpponentAutocomplete index={index} excludeId={youId ?? undefined} onPick={(id) => setFoeId(id)} />
              </div>
            )}
          </div>
        }
      >
        {foeMode === 'trainer' ? (
          <div className="flex min-h-[150px] flex-col">
            <div className="flex flex-wrap gap-1 border-b border-hairline px-3 py-2">
              {REGIONS.map((r) => (
                <button
                  key={r.region}
                  type="button"
                  aria-pressed={trainerRegion === r.region}
                  onClick={() => setTrainerRegion(r.region)}
                  className={cn(
                    'rounded-pill border px-2 py-0.5 font-sans text-[9px] font-bold uppercase transition-colors',
                    trainerRegion === r.region
                      ? 'border-gold/60 bg-gold/10 text-gold'
                      : 'border-hairline text-tx-muted hover:text-tx-secondary',
                  )}
                >
                  {r.name}
                </button>
              ))}
            </div>
            {!trainersReady ? (
              <div className="flex flex-1 items-center justify-center p-6">
                <PokeballLoader variant="inline" />
              </div>
            ) : (
              <TrainerPicker trainers={trainers} region={trainerRegion} idOf={idOf} onPick={pickTrainerMon} />
            )}
          </div>
        ) : (
          <>
            {foeStatus === 'idle' && <SideEmpty message={t('versus.pickOpponentDexHint')} />}
            {foeStatus === 'loading' && (
              <div className="flex flex-1 items-center justify-center p-6">
                <PokeballLoader variant="inline" />
              </div>
            )}
            {foeStatus === 'error' && (
              <div className="flex flex-1 items-center justify-center p-6">
                <p className="font-sans text-[12px] text-gold">{t('versus.errorUnavailable')}</p>
              </div>
            )}
            {foeStatus === 'ready' && foePokemon && (
              <SideCard
                pokemon={foePokemon}
                side={foe}
                onSide={(patch) => setFoe((s) => ({ ...s, ...patch }))}
                slotsSource={foeSource}
                details={details}
                versionGroup={ctx.versionGroup}
                showStatus
                onSlotsChange={(slots) => {
                  setFoeCustom(true);
                  setFoeSource('custom');
                  setFoe((s) => ({ ...s, slots }));
                }}
                onSlotsReset={() => setFoeCustom(false)}
              />
            )}
          </>
        )}
        {foeMode === 'trainer' && foeStatus === 'ready' && foePokemon && (
          <SideCard
            pokemon={foePokemon}
            side={foe}
            onSide={(patch) => setFoe((s) => ({ ...s, ...patch }))}
            slotsSource={foeSource}
            details={details}
            versionGroup={ctx.versionGroup}
            showStatus
            onSlotsChange={(slots) => {
              setFoeCustom(true);
              setFoeSource('custom');
              setFoe((s) => ({ ...s, slots }));
            }}
            onSlotsReset={() => setFoeCustom(false)}
          />
        )}
      </Panel>

      {/* ---------- speed check ---------- */}
      <div className="col-span-12">
        <SpeedCheckBanner check={check} youName={t('versus.you')} foeName={foeName.toUpperCase()} />
      </div>

      {youV && youPokemon && foeV && foePokemon && (
        <>
          {/* ---------- damage matrices (primary — above stat/type panels) ---------- */}
          <Panel eyebrow={t('versus.yourOffense')} title={`${youName} → ${foeName}`} className="col-span-12 lg:col-span-6" bodyClassName="p-1">
            <DamageMatrix rows={youRows} heading={t('versus.moveCol')} />
          </Panel>
          <Panel eyebrow={t('versus.foeOffense')} title={`${foeName} → ${youName}`} className="col-span-12 lg:col-span-6" bodyClassName="p-1">
            <DamageMatrix rows={foeRows} heading={t('versus.moveCol')} />
          </Panel>

          {/* ---------- stat delta + defensive profiles ---------- */}
          <Panel eyebrow={t('versus.statDeltaEyebrow')} title={t('versus.statDeltaTitle')} className="col-span-12 lg:col-span-5">
            <StatDelta you={youStats} foe={foeStats} />
          </Panel>

          <Panel eyebrow={t('versus.defenseEyebrow')} title={t('versus.defenseTitle')} className="col-span-12 lg:col-span-7">
            <DefensiveProfiles
              youTypes={pokemonTypes(youPokemon)}
              foeTypes={pokemonTypes(foePokemon)}
              youName="YOU"
              foeName="FOE"
            />
          </Panel>
        </>
      )}
    </div>
  );
}
