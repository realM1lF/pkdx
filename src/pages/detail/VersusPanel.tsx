/* VERSUS tab on /pokemon/:id (versus.md UI 1) + shared matchup components
 * reused by the Nuzlocke run deck's VersusTab (versus.md UI 2 — same matrix).
 * Head-to-head row · STAT DELTA · SPEED CHECK · damage matrix both directions
 * (36px rows, micro-bars, OHKO chips, effectiveness icons) · defensive profiles ·
 * opponent autocomplete (?vs=<id> shareable) · editable move slots with
 * level-up defaults. Gen-9 math from @/lib/versus. */
import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { RotateCcw, Search, SlidersHorizontal, Swords } from 'lucide-react';
import Sprite from '@/components/Sprite';
import TypeBadge from '@/components/TypeBadge';
import TypeGlyph from '@/components/TypeGlyph';
import PokeballLoader from '@/components/PokeballLoader';
import { bootNameIndex, displayName, getMove, getPokemon, padNum, pokemonTypes } from '@/lib/pokeapi';
import type { DexIndexEntry, Move, Pokemon, StatKey } from '@/lib/types';
import { MAX_DEX_ID, STAT_LABELS, STAT_ORDER } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  MOVESET_LABEL,
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
import type { DamageCell, MovesetSource, SpeedCheck, VersusSide } from '@/lib/versus';
import { computeMatchups, typeRgb } from './data';
import { Panel } from './ui';
import './versus.css';

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];
const CAT_COLORS: Record<string, string> = { physical: '#FB923C', special: '#38BDF8', status: '#A8B3C7' };

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
}

export const blankSide = (level = 50): SideState => ({ level, nature: null, evs: {}, slots: [] });

export function sideToVersus(side: SideState, slug: string): VersusSide {
  return { slug, level: side.level, nature: side.nature ?? undefined, evs: side.evs, moves: side.slots.filter(Boolean) };
}

/**
 * Default 4 moves for a wild/own Pokémon at `level`:
 * last-4 level-up moves; padded by the STAB+coverage heuristic when thin;
 * ASSUMED SET when nothing is learnable at that level at all.
 */
export function resolveDefaultSet(p: Pokemon, level: number, details: Map<string, Move>): { moves: string[]; source: MovesetSource } {
  const wild = wildMoveset(p, level);
  if (wild.length >= 4) return { moves: wild, source: 'wild' };
  const types = pokemonBaseTypes(p);
  const cands = levelUpPool(p)
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
function prefetchSlugs(p: Pokemon | null, slots: string[]): string[] {
  if (!p) return [];
  const set = new Set(slots.filter(Boolean));
  for (const e of levelUpPool(p)) set.add(e.slug);
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
}: {
  items: ComboItem[];
  value: string;
  onInput: (q: string) => void;
  onSelect: (key: string) => void;
  placeholder: string;
  ariaLabel: string;
  compact?: boolean;
  icon?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  const view = useMemo(() => {
    const q = value.trim().toLowerCase();
    const base = q ? items.filter((i) => i.label.toLowerCase().includes(q) || i.key.includes(q)) : items;
    return base.slice(0, 8);
  }, [items, value]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const pick = (item: ComboItem | undefined) => {
    if (!item || item.disabled) return;
    onSelect(item.key);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className="relative min-w-0 flex-1">
      <div className="relative">
        {icon && <span className="pointer-events-none absolute left-1.5 top-1/2 -translate-y-1/2 text-tx-muted">{icon}</span>}
        <input
          className={cn('vs-input w-full', icon && 'pl-6', compact ? 'h-[22px] text-[11px]' : 'h-7')}
          value={value}
          placeholder={placeholder}
          aria-label={ariaLabel}
          role="combobox"
          aria-expanded={open}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            onInput(e.target.value);
            setOpen(true);
            setActive(0);
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
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="vs-combo"
            role="listbox"
          >
            {view.length === 0 ? (
              <div className="px-3 py-2 font-sans text-[11px] font-semibold text-gold">No matches — check spelling.</div>
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
        )}
      </AnimatePresence>
    </div>
  );
}

/** opponent autocomplete on the dex index (bootNameIndex + sprite, SELF disabled) */
export function OpponentAutocomplete({
  index,
  excludeId,
  onPick,
  placeholder = 'PICK OPPONENT…',
}: {
  index: DexIndexEntry[];
  excludeId?: number;
  onPick: (id: number) => void;
  placeholder?: string;
}) {
  const [q, setQ] = useState('');
  const items = useMemo<ComboItem[]>(
    () =>
      index.map((e) => ({
        key: String(e.id),
        label: e.label,
        sub: e.num,
        spriteId: e.id,
        disabled: e.id === excludeId,
      })),
    [index, excludeId],
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
      placeholder={placeholder}
      ariaLabel="Opponent search"
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
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [q, setQ] = useState('');
  const items = useMemo<ComboItem[]>(
    () =>
      pool.map((slug) => {
        const mv = details.get(slug);
        return { key: slug, label: displayName(slug), type: mv?.type.name, sub: mv?.power ? String(mv.power) : '—' };
      }),
    [pool, details],
  );
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="pixel-label text-[7px] text-tx-muted">MOVES · {MOVESET_LABEL[source]}</span>
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            title="Reset to level-up default"
            className="grid h-4 w-4 place-items-center rounded-sm text-tx-muted transition-colors hover:text-gold"
          >
            <RotateCcw size={10} />
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-1">
        {[0, 1, 2, 3].map((i) => {
          const slug = slots[i] ?? '';
          const mv = slug ? details.get(slug) : undefined;
          if (editIdx === i) {
            return (
              <VsCombobox
                key={i}
                compact
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
                placeholder="MOVE…"
                ariaLabel={`Move slot ${i + 1}`}
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
              title={slug ? displayName(slug) : 'Empty slot — click to pick'}
            >
              {mv && (
                <span style={{ color: `rgb(${typeRgb(mv.type.name)})` }}>
                  <TypeGlyph type={mv.type.name} size={11} />
                </span>
              )}
              <span className="truncate">{slug ? displayName(slug) : '—'}</span>
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
}: {
  pokemon: Pokemon;
  side: SideState;
  onSide: (patch: Partial<SideState>) => void;
  slotsSource: MovesetSource;
  details: Map<string, Move>;
  onSlotsChange: (slots: string[]) => void;
  onSlotsReset?: () => void;
  aura?: boolean;
}) {
  const types = pokemonTypes(pokemon);
  const [tune, setTune] = useState(false);
  const [shake, setShake] = useState(false);
  const pool = useMemo(() => legalMoveSlugs(pokemon), [pokemon]);

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
    <div className="flex flex-col gap-2 p-3">
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
          <Sprite id={pokemon.id} name={pokemon.name} era="artwork" className="relative z-10 h-[72px] w-[72px]" eager />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-1.5">
            <span className="truncate font-display text-[15px] font-bold uppercase text-tx-primary">
              {displayName(pokemon.name)}
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
              aria-label="Level"
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
              Tune
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
                <span className="pixel-label w-12 text-[7px] text-tx-muted">NATURE</span>
                <select
                  className="dx-select h-6 flex-1 text-[11px]"
                  value={side.nature ?? ''}
                  onChange={(e) => onSide({ nature: e.target.value || null })}
                  aria-label="Nature"
                >
                  <option value="">Neutral</option>
                  {NATURES.filter((n) => n.plus).map((n) => (
                    <option key={n.name} value={n.name}>
                      {n.name} (+{n.plus ? STAT_LABELS[n.plus] : ''} −{n.minus ? STAT_LABELS[n.minus] : ''})
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
                      aria-label={`${STAT_LABELS[key]} EVs`}
                    />
                  </label>
                ))}
              </div>
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
  return (
    <div>
      <div className="grid grid-cols-[20px_minmax(0,1fr)_18px_76px_34px_46px] items-center gap-1.5 border-b border-hairline px-2 pb-1">
        <span className="pixel-label text-[7px] text-tx-muted"> </span>
        <span className="pixel-label text-[7px] text-tx-muted">{heading}</span>
        <span className="pixel-label text-center text-[6px] text-tx-muted">CAT</span>
        <span className="pixel-label text-[7px] text-tx-muted">RANGE</span>
        <span className="pixel-label text-center text-[7px] text-tx-muted">EFF</span>
        <span className="pixel-label text-right text-[7px] text-tx-muted">KO</span>
      </div>
      {rows.length === 0 && (
        <div className="flex h-24 items-center justify-center font-sans text-[11px] text-tx-muted">No damaging set resolved.</div>
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
            <span className="truncate font-sans text-[12px] font-semibold text-tx-primary" title={displayName(row.slug)}>
              {displayName(row.slug)}
            </span>
            <span
              role="img"
              aria-label={cat}
              title={cat}
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
              <span className="font-sans text-[9px] text-tx-muted">{mv ? (cell ? 'status' : '…') : <span className="vs-skel inline-block h-2.5 w-12" />}</span>
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
              <span className="vs-ko" data-n={koN} title={cell && cell.koChance > 0 && cell.koChance < 1 ? `${Math.round(cell.koChance * 100)}% chance` : undefined}>
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
  if (!check) {
    return (
      <div className="flex h-10 items-center justify-center gap-2 rounded-lg border border-hairline bg-surface1/60">
        <span className="pixel-label text-[8px] text-tx-muted">SPEED CHECK —</span>
      </div>
    );
  }
  const youWin = check.delta > 0;
  const tie = check.delta === 0;
  const youVerb = youName === 'YOU' ? 'OUTSPEED' : 'OUTSPEEDS';
  const foeVerb = foeName === 'YOU' ? 'OUTSPEED' : 'OUTSPEEDS';
  return (
    <div
      className={cn(
        'flex h-10 items-center justify-center gap-3 rounded-lg border px-3',
        youWin || tie ? 'border-gold/50 bg-gold/10' : 'border-hairline bg-surface1/60',
      )}
    >
      <span className={cn('pixel-label text-[8px]', youWin || tie ? 'text-gold' : 'text-tx-muted')}>SPEED CHECK</span>
      <span className={cn('font-display text-[12px] font-bold uppercase tracking-wide', youWin ? 'text-gold' : tie ? 'text-tx-primary' : 'text-tx-muted')}>
        {tie
          ? `SPEED TIE AT ${check.you} — coin flip`
          : youWin
            ? `${youName} ${youVerb} BY ${check.delta} — you strike first`
            : `${foeName} ${foeVerb} BY ${-check.delta} — it strikes first`}
      </span>
      <span className="hidden font-sans text-[10px] font-semibold tabular-nums text-tx-muted sm:inline">
        {check.you} vs {check.foe}
      </span>
    </div>
  );
}

export function DefensiveProfiles({ youTypes, foeTypes, youName, foeName }: { youTypes: string[]; foeTypes: string[]; youName: string; foeName: string }) {
  return (
    <div className="grid grid-cols-1 gap-2 p-3 sm:grid-cols-2">
      <DefenseColumn title={youName === 'YOU' ? 'YOU TAKE' : `${youName} TAKES`} types={youTypes} />
      <DefenseColumn title={foeName === 'YOU' ? 'YOU TAKE' : `${foeName} TAKES`} types={foeTypes} />
    </div>
  );
}

function DefenseColumn({ title, types }: { title: string; types: string[] }) {
  const m = computeMatchups(types);
  return (
    <div className="flex flex-col gap-1">
      <span className="pixel-label text-[7px] text-tx-muted">{title}</span>
      <MatchupRow label="WEAK" types={m.weak} mult="×2" color="#F6C945" />
      <MatchupRow label="RESIST" types={m.resist} mult="×½" color="#63D96B" />
      <MatchupRow label="IMMUNE" types={m.immune} mult="×0" color="#5E6680" />
    </div>
  );
}

function MatchupRow({ label, types, mult, color }: { label: string; types: string[]; mult: string; color: string }) {
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
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ================================================================== */
/* matrix computation helper (shared with the Nuzlocke tab)            */
/* ================================================================== */

export function computeMatrix(attacker: VersusSide, defender: VersusSide, slots: string[], details: Map<string, Move>): MatrixRow[] {
  return slots
    .filter(Boolean)
    .slice(0, 4)
    .map((slug) => ({
      slug,
      cell: damageBetween(attacker, defender, slug, details.get(slug)),
      detail: details.get(slug),
    }));
}

/* ================================================================== */
/* VersusPanel — the /pokemon/:id VERSUS tab                           */
/* ================================================================== */

export default function VersusPanel({
  pokemon,
  initialVs,
  onOpponentChange,
}: {
  pokemon: Pokemon;
  initialVs: string | null;
  onOpponentChange: (id: number | null) => void;
}) {
  const index = useDexIndex();

  /* ----- foe selection (deep-link ?vs= resolves once the dex index is in) ----- */
  const [foeId, setFoeId] = useState<number | null>(() => {
    const n = Number(initialVs);
    return Number.isInteger(n) && n >= 1 && n <= MAX_DEX_ID ? n : null;
  });
  const { pokemon: foePokemon, status: foeStatus } = usePokemonById(foeId);

  /* report opponent upstream → ?vs= write */
  useEffect(() => {
    onOpponentChange(foeId);
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
    () => [...prefetchSlugs(pokemon, you.slots), ...prefetchSlugs(foePokemon, foe.slots)],
    [pokemon, foePokemon, you.slots, foe.slots],
  );
  const details = useMoveDetails(wanted);

  /* default sets: recompute while the user hasn't customized slots */
  useEffect(() => {
    if (youCustom) return;
    const def = resolveDefaultSet(pokemon, you.level, details);
    if (def.moves.length) {
      setYou((s) => ({ ...s, slots: def.moves }));
      setYouSource(def.source);
    }
  }, [pokemon, you.level, details, youCustom]);

  useEffect(() => {
    if (foeCustom || !foePokemon) return;
    const def = resolveDefaultSet(foePokemon, foe.level, details);
    if (def.moves.length) {
      setFoe((s) => ({ ...s, slots: def.moves }));
      setFoeSource(def.source);
    }
  }, [foePokemon, foe.level, details, foeCustom]);

  /* reset foe state when the opponent changes (derived-state-during-render) */
  const [prevFoeId, setPrevFoeId] = useState(foeId);
  if (prevFoeId !== foeId) {
    setPrevFoeId(foeId);
    setFoe(blankSide(50));
    setFoeCustom(false);
    setFoeSource('wild');
  }

  /* ----- computed matchup ----- */
  const youV = useMemo(() => sideToVersus(you, pokemon.name), [you, pokemon.name]);
  const foeV = useMemo(() => (foePokemon ? sideToVersus(foe, foePokemon.name) : null), [foe, foePokemon]);

  const check = useMemo(() => (foeV ? speedCheck(youV, foeV) : null), [youV, foeV]);
  const youStats = useMemo(() => statsOf(youV), [youV]);
  const foeStats = useMemo(() => (foeV ? statsOf(foeV) : null), [foeV]);

  const youRows = useMemo(
    () => (foeV ? computeMatrix(youV, foeV, you.slots, details) : []),
    [youV, foeV, you.slots, details],
  );
  const foeRows = useMemo(
    () => (foeV ? computeMatrix(foeV, youV, foe.slots, details) : []),
    [youV, foeV, foe.slots, details],
  );

  const youName = displayName(pokemon.name);
  const foeName = foePokemon ? displayName(foePokemon.name) : 'FOE';

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* ---------- head-to-head ---------- */}
      <Panel eyebrow="YOU" title={youName} className="col-span-12 lg:col-span-5" bodyClassName="min-h-[150px]">
        <SideCard
          pokemon={pokemon}
          side={you}
          onSide={(patch) => setYou((s) => ({ ...s, ...patch }))}
          slotsSource={youSource}
          details={details}
          onSlotsChange={(slots) => {
            setYouCustom(true);
            setYouSource('custom');
            setYou((s) => ({ ...s, slots }));
          }}
          onSlotsReset={() => setYouCustom(false)}
        />
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
        eyebrow="FOE"
        title={foePokemon ? foeName : 'PICK OPPONENT'}
        className="col-span-12 lg:col-span-5"
        bodyClassName="flex min-h-[150px] flex-col"
        right={
          <div className="w-44">
            <OpponentAutocomplete index={index} excludeId={pokemon.id} onPick={(id) => setFoeId(id)} />
          </div>
        }
      >
        {foeStatus === 'idle' && (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 p-6">
            <img src="/pokeball.svg" alt="" className="h-10 w-10 opacity-50" />
            <p className="font-sans text-[12px] text-gold">Pick any Pokémon above — or open a shared ?vs= link.</p>
            <p className="font-sans text-[11px] text-tx-muted">Your own entry can't fight itself (SELF disabled).</p>
          </div>
        )}
        {foeStatus === 'loading' && (
          <div className="flex flex-1 items-center justify-center p-6">
            <PokeballLoader variant="inline" />
          </div>
        )}
        {foeStatus === 'error' && (
          <div className="flex flex-1 items-center justify-center p-6">
            <p className="font-sans text-[12px] text-gold">Opponent data unavailable — try another pick.</p>
          </div>
        )}
        {foeStatus === 'ready' && foePokemon && (
          <SideCard
            pokemon={foePokemon}
            side={foe}
            onSide={(patch) => setFoe((s) => ({ ...s, ...patch }))}
            slotsSource={foeSource}
            details={details}
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
        <SpeedCheckBanner check={check} youName="YOU" foeName={foeName.toUpperCase()} />
      </div>

      {foeV && foePokemon && (
        <>
          {/* ---------- stat delta + defensive profiles ---------- */}
          <Panel eyebrow="STAT DELTA" title="Level-Adjusted" className="col-span-12 lg:col-span-5">
            <StatDelta you={youStats} foe={foeStats} />
          </Panel>

          <Panel eyebrow="DEFENSIVE PROFILES" title="Type Matchups" className="col-span-12 lg:col-span-7">
            <DefensiveProfiles youTypes={pokemonTypes(pokemon)} foeTypes={pokemonTypes(foePokemon)} youName="YOU" foeName="FOE" />
          </Panel>

          {/* ---------- damage matrices ---------- */}
          <Panel eyebrow="YOUR OFFENSE" title={`${youName} → ${foeName}`} className="col-span-12 lg:col-span-6" bodyClassName="p-1">
            <DamageMatrix rows={youRows} heading="MOVE" />
          </Panel>
          <Panel eyebrow="FOE OFFENSE" title={`${foeName} → ${youName}`} className="col-span-12 lg:col-span-6" bodyClassName="p-1">
            <DamageMatrix rows={foeRows} heading="MOVE" />
          </Panel>
        </>
      )}
    </div>
  );
}
