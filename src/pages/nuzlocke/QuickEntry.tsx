/* Nuzlocke run — Quick Entry console (nuzlocke.md §2.5).
 * Sticky 64px bar on md+, floating gold FAB → bottom sheet on mobile.
 * Route-filtered Pokémon autocomplete from maps.md §0 encounter data. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, Minus, Plus, Search, Star, X } from 'lucide-react';
import Sprite from '@/components/Sprite';
import { routeOrder } from '@/lib/regions';
import { nodeName } from '@/lib/regions';
import type { RegionMap } from '@/lib/regions';
import type { RegionDataState } from '@/lib/mapdata';
import { encounterAt, logEncounter } from '@/lib/nuzlocke-store';
import type { LogResult, NuzEncounterStatus, RunState } from '@/lib/nuzlocke-store';
import { effectiveLevelCap, isGiftNode } from '@/lib/nuzlocke-rules';
import type { LogValidationError } from '@/lib/nuzlocke-rules';
import { germanAliasOfPokemon, nameOfPokemon, useGermanDataReady, useLanguage } from '@/lib/i18n-data';
import { padNum } from '@/lib/pokeapi';
import type { DexIndexEntry } from '@/lib/types';
import { sprites } from '@/lib/sprites';
import { cn } from '@/lib/utils';
import { GoldHint, PixelLabel, Popover, useShake } from './ui';

export interface Prefill {
  routeKey: string;
  playerId: string;
  key: number;
}

interface SpeciesOption {
  id: number;
  label: string;
  rate?: number;
  custom?: boolean;
}

const STATUS_META: Record<NuzEncounterStatus, { labelKey: string; cls: string }> = {
  caught: { labelKey: 'nuz.statusCaught', cls: 'border-[rgba(99,217,107,0.5)] text-[#63D96B]' },
  dead: { labelKey: 'nuz.statusDead', cls: 'border-hairline2 text-tx-muted' },
  missed: { labelKey: 'nuz.statusMissed', cls: 'border-gold/60 text-gold' },
  duped: { labelKey: 'nuz.statusDuped', cls: 'border-gold/40 text-gold/80 border-dashed' },
};

interface FormProps {
  state: RunState;
  region: RegionMap;
  mapData: RegionDataState;
  nameIdx: Map<number, DexIndexEntry>;
  prefill: Prefill | null;
  onLogged: (res: LogResult & { fromRect: DOMRect | null }) => void;
  stacked?: boolean;
  onDone?: () => void;
}

function EntryForm({ state, region, mapData, nameIdx, prefill, onLogged, stacked, onDone }: FormProps) {
  const { t } = useTranslation();
  const lang = useLanguage();
  const deReady = useGermanDataReady();
  const players = useMemo(() => [...state.players].sort((a, b) => a.slot - b.slot), [state.players]);
  const nodes = useMemo(() => routeOrder(region), [region]);

  const lastKey = `pdx2.nuz.lastPlayer.${state.run.id}`;
  const [playerId, setPlayerId] = useState(() => {
    try {
      return localStorage.getItem(lastKey) ?? players[0]?.id ?? '';
    } catch {
      return players[0]?.id ?? '';
    }
  });
  const [routeKey, setRouteKey] = useState('');
  const [query, setQuery] = useState('');
  const [species, setSpecies] = useState<SpeciesOption | null>(null);
  const [level, setLevel] = useState(5);
  const [status, setStatus] = useState<NuzEncounterStatus>('caught');
  const [nick, setNick] = useState('');
  const [playerOpen, setPlayerOpen] = useState(false);
  const [routeOpen, setRouteOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);
  const [routeFilter, setRouteFilter] = useState('');
  const [listOpen, setListOpen] = useState(false);
  const [fullDex, setFullDex] = useState(false);
  const [isShiny, setIsShiny] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const [shakeKey, shake] = useShake();
  const [hint, setHint] = useState('');
  /* level-cap is a warning, not a hard block — first submit warns (shake+gold),
   * the acknowledged second submit logs anyway (player responsibility) */
  const [capAck, setCapAck] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLSpanElement>(null);
  const pokePickerRef = useRef<HTMLDivElement>(null);

  const player = players.find((p) => p.id === playerId) ?? players[0];

  useEffect(() => {
    if (!listOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!pokePickerRef.current?.contains(e.target as Node)) setListOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      e.preventDefault();
      setListOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [listOpen]);

  /* prefill from timeline empty slot (§2.3) */
  const [prevPrefill, setPrevPrefill] = useState<Prefill | null>(null);
  if (prefill && prefill !== prevPrefill) {
    setPrevPrefill(prefill);
    setRouteKey(prefill.routeKey);
    setPlayerId(prefill.playerId);
    setSpecies(null);
    setQuery('');
    window.setTimeout(() => searchRef.current?.focus(), 50);
  }

  /* route encounter data (maps.md §0 aggregation, run's game version) */
  const routeOptions = useMemo<SpeciesOption[]>(() => {
    if (!routeKey) return [];
    const nd = mapData.data.get(routeKey);
    if (!nd || nd.status !== 'loaded') return [];
    const best = new Map<number, SpeciesOption>();
    for (const g of nd.areas) {
      for (const e of g.entries) {
        const prev = best.get(e.pokemonId);
        const label = nameIdx.has(e.pokemonId) ? nameOfPokemon(e.pokemonId, lang) : e.slug;
        if (!prev || e.maxChance > (prev.rate ?? 0)) best.set(e.pokemonId, { id: e.pokemonId, label, rate: e.maxChance });
      }
    }
    return [...best.values()].sort((a, b) => (b.rate ?? 0) - (a.rate ?? 0));
  }, [routeKey, mapData.data, nameIdx, lang]);

  const options = useMemo<SpeciesOption[]>(() => {
    const q = query.trim().toLowerCase();
    if (fullDex) {
      const all = [...nameIdx.values()];
      const filtered = q
        ? all.filter(
            (e) =>
              e.label.toLowerCase().includes(q) ||
              e.name.includes(q) ||
              String(e.id) === q ||
              (germanAliasOfPokemon(e.id)?.includes(q) ?? false),
          )
        : all;
      return filtered.slice(0, 8).map((e) => ({ id: e.id, label: nameOfPokemon(e.id, lang), custom: true }));
    }
    const base = routeOptions;
    return (q ? base.filter((o) => o.label.toLowerCase().includes(q) || (germanAliasOfPokemon(o.id)?.includes(q) ?? false)) : base).slice(0, 8);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deReady rebuilds aliases after the lazy de load
  }, [query, fullDex, nameIdx, routeOptions, lang, deReady]);

  /* N focuses the bar (route field) */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== 'n') return;
      const t = e.target as HTMLElement;
      if (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable) return;
      e.preventDefault();
      setRouteOpen(true);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const nodeState = (routeK: string): NuzEncounterStatus | 'pending' => {
    const enc = player ? encounterAt(state, player.id, routeK) : undefined;
    return enc ? enc.status : 'pending';
  };

  const fail = (msg: string) => {
    setHint(msg);
    shake();
    window.setTimeout(() => setHint(''), 2600);
  };

  const failCode = (code: LogValidationError) => {
    const map: Record<LogValidationError, string> = {
      duplicate: t('nuz.err.routeAlready', { player: player?.name ?? '?' }),
      speciesDupe: t('nuz.err.speciesDupe'),
      nicknameRequired: t('nuz.err.nicknameRequired'),
      giftRoute: t('nuz.err.giftRoute'),
    };
    fail(map[code]);
  };

  const pickRoute = (key: string) => {
    if (player && encounterAt(state, player.id, key)) {
      /* shiny clause: a resolved route stays pickable for shiny catches only */
      if (!state.run.rules.shiny) {
        setRouteOpen(false);
        fail(t('nuz.routeAlready', { player: player.name, dupes: t(state.run.rules.dupes ? 'nuz.on' : 'nuz.off') }));
        return;
      }
      setHint(t('nuz.shinyRouteHint'));
      window.setTimeout(() => setHint(''), 2600);
    }
    setRouteKey(key);
    setRouteOpen(false);
    setSpecies(null);
    setQuery('');
    setFullDex(false);
    window.setTimeout(() => searchRef.current?.focus(), 50);
  };

  /* level-cap warning state (auto cap follows run progress) */
  const cap = effectiveLevelCap(state);
  const overCap = status === 'caught' && cap !== null && level > cap;

  useEffect(() => {
    setCapAck(false);
  }, [level, routeKey, species, status]);

  const submit = () => {
    if (!player || !routeKey || !species) return;
    if (overCap && !capAck) {
      setCapAck(true);
      fail(t('nuz.err.levelCap', { level, cap }));
      return;
    }
    const fromRect = previewRef.current?.getBoundingClientRect() ?? null;
    const res = logEncounter(state.run.id, {
      playerId: player.id,
      routeKey,
      pokemonId: species.id,
      nickname: status === 'caught' ? nick || null : null,
      level,
      status,
      isShiny: state.run.rules.shiny ? isShiny : false,
      offRoute: !!species.custom || fullDex,
    });
    if (!res.ok) {
      if (res.error) failCode(res.error);
      else fail(t('nuz.routeAlready', { player: player.name, dupes: t(state.run.rules.dupes ? 'nuz.on' : 'nuz.off') }));
      return;
    }
    onLogged({ ...res, fromRect });
    setSpecies(null);
    setQuery('');
    setNick('');
    setFullDex(false);
    setIsShiny(false);
    onDone?.();
  };

  const needsNick = state.run.rules.nicknames && status === 'caught';
  const canLog = !!player && !!routeKey && !!species && (!needsNick || !!nick.trim());
  const disabledReason = !routeKey ? t('nuz.pickRouteFirst') : !species ? t('nuz.pickPokemon') : '';

  const routeNodeResolved = routeKey ? nodes.find((n) => n.id === routeKey) : undefined;
  const routeLabel = routeKey ? (routeNodeResolved ? nodeName(routeNodeResolved, lang) : routeKey) : t('nuz.routePlaceholder');
  const routeNeedle = routeFilter.trim().toLowerCase();
  const filteredNodes = nodes.filter(
    (n) => n.label.toLowerCase().includes(routeNeedle) || (n.nameDe?.toLowerCase().includes(routeNeedle) ?? false),
  );

  return (
    <div className={cn('relative flex gap-2', stacked ? 'flex-col' : 'flex-wrap items-center')}>
      {/* PLAYER */}
      <Popover
        open={playerOpen}
        onClose={() => setPlayerOpen(false)}
        anchor={
          <button
            type="button"
            onClick={() => setPlayerOpen((o) => !o)}
            aria-label={t('nuz.player')}
            className={cn('flex h-10 items-center gap-1.5 rounded-md border border-hairline2 bg-surface2 px-2.5 text-[12px] font-semibold text-tx-primary hover:border-gold/50', stacked ? 'w-full justify-between' : 'w-[140px] justify-between')}
          >
            <span className="flex min-w-0 items-center gap-1.5">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: player?.color }} />
              <span className="truncate">{player?.name}</span>
            </span>
            <ChevronDown size={12} className="shrink-0 text-tx-muted" />
          </button>
        }
        className="w-[180px] py-1"
      >
        {players.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => {
              setPlayerId(p.id);
              try {
                localStorage.setItem(lastKey, p.id);
              } catch {
                /* noop */
              }
              setPlayerOpen(false);
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] text-tx-secondary transition-colors hover:bg-surface3 hover:text-gold"
          >
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: p.color }} />
            {p.name}
            {p.id === playerId && <Check size={12} className="ml-auto text-gold" />}
          </button>
        ))}
      </Popover>

      {/* ROUTE */}
      <Popover
        open={routeOpen}
        onClose={() => setRouteOpen(false)}
        anchor={
          <button
            type="button"
            onClick={() => setRouteOpen((o) => !o)}
            aria-label={t('nuz.route')}
            className={cn('flex h-10 items-center justify-between gap-1.5 rounded-md border bg-surface2 px-2.5 text-[12px] font-semibold hover:border-gold/50', routeKey ? 'border-hairline2 text-tx-primary' : 'border-dashed border-hairline2 text-tx-muted', stacked ? 'w-full' : 'w-[200px]')}
          >
            <span className="truncate">{routeLabel}</span>
            <ChevronDown size={12} className="shrink-0 text-tx-muted" />
          </button>
        }
        className="w-[260px]"
      >
        <div className="border-b border-hairline p-2">
          <input
            autoFocus
            value={routeFilter}
            onChange={(e) => setRouteFilter(e.target.value)}
            placeholder={t('nuz.filterRoutes')}
            className="h-8 w-full rounded-sm border border-hairline bg-surface1 px-2 text-[12px] text-tx-primary outline-none placeholder:text-tx-muted focus:border-gold"
          />
        </div>
        <div className="nz-slim-scroll max-h-[300px] overflow-y-auto py-1" data-lenis-prevent role="listbox" aria-label={t('nuz.routesAria')}>
          {filteredNodes.map((n) => {
            const st = nodeState(n.id);
            const used = st !== 'pending';
            return (
              <button
                key={n.id}
                type="button"
                role="option"
                aria-selected={n.id === routeKey}
                onClick={() => pickRoute(n.id)}
                className={cn('flex w-full items-center gap-2 px-3 py-1.5 text-left text-[12px] transition-colors hover:bg-surface3', used ? 'text-tx-muted' : 'text-tx-secondary hover:text-gold')}
              >
                <span className="w-6 font-display text-[9px] font-bold tabular-nums text-tx-muted">{String(nodes.indexOf(n) + 1).padStart(2, '0')}</span>
                <span className="min-w-0 flex-1 truncate">{n.label}</span>
                {isGiftNode(n) && (
                  <span className="rounded-full border border-gold/50 px-1 font-pixel text-[6px] text-gold">{t('nuz.giftRouteChip')}</span>
                )}
                {used && <span className="rounded-full border border-hairline2 px-1 font-pixel text-[6px] text-tx-muted">{t('nuz.chip.used')}</span>}
                <span className="font-pixel text-[7px] text-tx-muted">
                  {st === 'caught' ? '✓' : st === 'dead' ? '✕' : st === 'pending' ? '○' : '—'}
                </span>
              </button>
            );
          })}
        </div>
      </Popover>

      {/* POKÉMON autocomplete */}
      <div ref={pokePickerRef} className={cn('relative', stacked ? 'w-full' : 'w-[240px]')}>
        <Search size={12} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-tx-muted" />
        <input
          ref={searchRef}
          value={species ? species.label : query}
          onChange={(e) => {
            setSpecies(null);
            setQuery(e.target.value);
            setListOpen(true);
            setActiveIdx(0);
          }}
          onFocus={() => setListOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setActiveIdx((i) => Math.min(options.length - 1, i + 1));
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setActiveIdx((i) => Math.max(0, i - 1));
            } else if (e.key === 'Enter') {
              e.preventDefault();
              if (!species && options[activeIdx]) {
                setSpecies(options[activeIdx]);
                setListOpen(false);
              } else {
                submit();
              }
            } else if (e.key === 'Escape') {
              setListOpen(false);
            }
          }}
          placeholder={routeKey ? t('nuz.pokemonPlaceholder') : t('nuz.pickRouteFirst')}
          disabled={!routeKey}
          aria-label={t('nuz.pokemonAria')}
          aria-expanded={listOpen}
          role="combobox"
          className={cn(
            'h-10 w-full rounded-md border bg-surface2 pl-7 pr-8 text-[12px] font-semibold text-tx-primary outline-none placeholder:text-tx-muted disabled:opacity-50',
            species?.custom ? 'border-gold/60' : 'border-hairline2 focus:border-gold/60',
          )}
        />
        {species && (
          <span ref={previewRef} className="absolute right-1.5 top-1/2 -translate-y-1/2">
            <Sprite id={species.id} name={species.label} className="h-[28px] w-[28px]" skeleton={false} />
          </span>
        )}
        {listOpen && routeKey && !species && (
          <div
            className="nz-slim-scroll absolute left-0 top-full z-[70] mt-1.5 max-h-[320px] w-full overflow-y-auto rounded-md border border-hairline2 bg-surface2 shadow-[0_8px_32px_rgba(0,0,0,0.45)]"
            role="listbox"
            data-lenis-prevent
          >
            {options.length === 0 && (
              <div className="px-3 py-2.5 text-[11px] text-tx-muted">
                {mapData.data.get(routeKey)?.status === 'loaded' || fullDex ? t('nuz.noMatchTryDex') : t('nuz.scanningEncounters')}
              </div>
            )}
            {options.map((o, i) => (
              <button
                key={`${o.id}-${o.custom ? 'c' : 'r'}`}
                type="button"
                role="option"
                aria-selected={i === activeIdx}
                onMouseEnter={() => setActiveIdx(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setSpecies(o);
                  setListOpen(false);
                }}
                className={cn('flex w-full items-center gap-2 px-2.5 py-1.5 text-left text-[12px]', i === activeIdx ? 'bg-surface3 text-tx-primary' : 'text-tx-secondary')}
              >
                <img src={sprites.front(o.id)} alt="" loading="lazy" className="h-[32px] w-[32px] [image-rendering:pixelated]" />
                <span className="min-w-0 flex-1 truncate font-semibold">{o.label}</span>
                {o.custom ? (
                  <span className="rounded-full border border-gold/60 px-1 font-pixel text-[6px] text-gold" title={t('nuz.customTip')}>
                    {t('nuz.customChip')}
                  </span>
                ) : (
                  o.rate !== undefined && <span className="text-[9px] tabular-nums text-tx-muted">{o.rate}%</span>
                )}
                <span className="font-pixel text-[7px] text-tx-muted">{padNum(o.id)}</span>
              </button>
            ))}
            {!fullDex && (
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setFullDex(true);
                  setActiveIdx(0);
                }}
                className="flex w-full items-center gap-2 border-t border-hairline px-3 py-2 text-left text-[11px] text-tx-muted transition-colors hover:bg-surface3 hover:text-gold"
              >
                <Search size={11} /> {t('nuz.searchFullDex')}
              </button>
            )}
          </div>
        )}
      </div>

      {/* LEVEL */}
      <div className="relative">
        <div
          className={cn('flex h-10 items-center rounded-md border bg-surface2', overCap ? 'border-gold/70' : 'border-hairline2')}
          title={overCap && cap !== null ? t('nuz.rules.capTitle', { cap }) : t('nuz.levelTip')}
        >
          <span className="pl-2 font-pixel text-[7px] tracking-[0.08em] text-tx-muted" aria-hidden>
            {t('nuz.levelShort')}
          </span>
          <button type="button" aria-label={t('nuz.levelDown')} onClick={() => setLevel((l) => Math.max(1, l - 1))} className="grid h-full w-7 place-items-center text-tx-muted hover:text-gold">
            <Minus size={11} />
          </button>
          <input
            value={level}
            onChange={(e) => {
              const v = Number(e.target.value.replace(/\D/g, ''));
              if (Number.isFinite(v)) setLevel(Math.max(1, Math.min(100, v)));
            }}
            aria-label={t('nuz.level')}
            className="w-[36px] bg-transparent text-center font-display text-[14px] font-bold tabular-nums text-tx-primary outline-none"
          />
          <button type="button" aria-label={t('nuz.levelUp')} onClick={() => setLevel((l) => Math.min(100, l + 1))} className="grid h-full w-7 place-items-center text-tx-muted hover:text-gold">
            <Plus size={11} />
          </button>
        </div>
        {overCap && cap !== null && (
          <span className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-gold bg-surface2 px-1.5 font-pixel text-[6px] tracking-[0.06em] text-gold">
            {t('nuz.overCap', { cap })}
          </span>
        )}
      </div>

      {state.run.rules.shiny && status === 'caught' && (
        <button
          type="button"
          aria-pressed={isShiny}
          title={t('nuz.rules.shinyTip')}
          onClick={() => setIsShiny((v) => !v)}
          className={cn(
            'flex h-10 items-center gap-1.5 rounded-md border px-2.5 font-pixel text-[8px] tracking-[0.08em] transition-colors',
            isShiny ? 'border-gold bg-gold/15 text-gold' : 'border-hairline2 text-tx-muted hover:border-gold/50',
            stacked ? 'w-full justify-center' : '',
          )}
        >
          <Star size={12} className={isShiny ? 'fill-gold text-gold' : undefined} />
          {t('nuz.shinyCatch')}
        </button>
      )}

      {/* STATUS */}
      <Popover
        open={statusOpen}
        onClose={() => setStatusOpen(false)}
        anchor={
          <button
            type="button"
            onClick={() => setStatusOpen((o) => !o)}
            aria-label={t('nuz.status')}
            title={t('nuz.statusTip')}
            className={cn('flex h-10 items-center justify-between gap-1 rounded-md border bg-surface2 px-2.5 font-pixel text-[8px] tracking-[0.08em]', STATUS_META[status].cls, stacked ? 'w-full' : 'w-[110px]')}
          >
            {t(STATUS_META[status].labelKey)}
            <ChevronDown size={12} />
          </button>
        }
        className="w-[140px] py-1"
      >
        {(Object.keys(STATUS_META) as NuzEncounterStatus[]).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => {
              setStatus(s);
              setStatusOpen(false);
            }}
            className={cn('flex w-full items-center gap-2 px-3 py-2 text-left font-pixel text-[8px] tracking-[0.08em] transition-colors hover:bg-surface3', STATUS_META[s].cls)}
          >
            {t(STATUS_META[s].labelKey)}
            {s === status && <Check size={12} className="ml-auto" />}
          </button>
        ))}
      </Popover>

      {/* NICKNAME (caught only) */}
      {status === 'caught' && (
        <input
          value={nick}
          onChange={(e) => setNick(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder={t('nuz.nicknamePlaceholder')}
          maxLength={18}
          aria-label={t('nuz.nickname')}
          required={needsNick}
          className={cn(
            'h-10 rounded-md border bg-surface2 px-3 text-[12px] font-semibold text-tx-primary outline-none placeholder:text-tx-muted focus:border-gold/60',
            needsNick && !nick.trim() ? 'border-gold/60' : 'border-hairline2',
            stacked ? 'w-full' : 'w-[160px]',
          )}
        />
      )}

      {/* LOG */}
      <div className={cn('relative', stacked && 'w-full')}>
        <div key={shakeKey} className={shakeKey ? 'nz-shake' : undefined}>
          <button
            type="button"
            disabled={!canLog}
            title={canLog ? t('nuz.logEncounterEnter') : disabledReason}
            onClick={submit}
            className={cn(
              'nz-sheen flex h-10 items-center justify-center gap-1.5 rounded-md border border-gold/60 bg-[linear-gradient(135deg,rgba(246,201,69,0.25),rgba(246,201,69,0.10))] px-5 font-display text-[12px] font-bold uppercase tracking-[0.06em] text-tx-primary transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0',
              stacked && 'w-full',
            )}
          >
            {t('nuz.logEncounterEnter')}
          </button>
        </div>
        <GoldHint text={hint} show={!!hint} />
      </div>
    </div>
  );
}

/* ---------- shell: sticky bar + mobile FAB/sheet ---------- */

interface QuickEntryProps extends Omit<FormProps, 'stacked' | 'onDone'> {}

export default function QuickEntry(props: QuickEntryProps) {
  const { t } = useTranslation();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [highlight, setHighlight] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  /* prefill on mobile opens the sheet; desktop pulses the bar */
  const [prevPrefill, setPrevPrefill] = useState<Prefill | null>(null);
  if (props.prefill && props.prefill !== prevPrefill) {
    setPrevPrefill(props.prefill);
    if (window.innerWidth < 768) {
      setSheetOpen(true);
    } else {
      setHighlight(true);
      window.setTimeout(() => setHighlight(false), 1400);
      window.setTimeout(() => barRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 30);
    }
  }

  return (
    <>
      {/* desktop entry bar — above timeline */}
      <div
        ref={barRef}
        className={cn(
          'relative z-40 mt-3 hidden rounded-xl border border-hairline bg-[rgba(13,15,22,0.88)] px-4 py-3 backdrop-blur-xl md:block',
          highlight && 'nz-entry-highlight',
        )}
      >
        <div className="mb-2 flex items-center gap-2">
          <PixelLabel className="text-gold">{t('nuz.quickEntry')}</PixelLabel>
          <span className="text-[10px] text-tx-muted">{t('nuz.quickEntryHint')}</span>
        </div>
        <div className="mx-auto max-w-[1440px]">
          <EntryForm {...props} />
        </div>
      </div>

      {/* mobile FAB */}
      <button
        type="button"
        aria-label={t('nuz.logEncounter')}
        onClick={() => setSheetOpen(true)}
        className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full border border-gold/70 bg-[linear-gradient(135deg,rgba(246,201,69,0.9),rgba(246,201,69,0.7))] text-void shadow-[0_8px_32px_rgba(246,201,69,0.35)] md:hidden"
      >
        <Plus size={22} strokeWidth={2.5} />
      </button>

      {/* mobile bottom sheet */}
      <AnimatePresence>
        {sheetOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[68] bg-void/70 backdrop-blur-sm md:hidden" onClick={() => setSheetOpen(false)} />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 180, damping: 22 }}
              className="fixed inset-x-0 bottom-0 z-[69] max-h-[85dvh] overflow-y-auto rounded-t-2xl border-t border-gold/40 bg-surface1 p-4 md:hidden nz-slim-scroll" data-lenis-prevent
            >
              <div className="mb-3 flex items-center justify-between">
                <PixelLabel className="text-gold">{t('nuz.quickEntry')}</PixelLabel>
                <button type="button" onClick={() => setSheetOpen(false)} aria-label={t('nuz.dismiss')} className="grid h-8 w-8 place-items-center rounded-md border border-hairline text-tx-muted">
                  <X size={14} />
                </button>
              </div>
              <EntryForm {...props} stacked onDone={() => setSheetOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
