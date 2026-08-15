/* SearchCommand — global search + autocomplete (design.md §9.6).
 * variant="modal": top-anchored glass panel (navbar trigger / "/" hotkey).
 * variant="inline": embedded large search (Home + /pokedex).
 * Catalog: Pokémon, items, maps. */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import MotionRoot from '@/components/MotionRoot';
import { Map, Search, X } from 'lucide-react';
import Sprite from './Sprite';
import TypeBadge from './TypeBadge';
import { ItemIcon } from './EntityDescModal';
import { bootNameIndex, getPokemon, padNum } from '@/lib/pokeapi';
import { loadItemDescs } from '@/lib/desc-data';
import { germanAliasOfPokemon, nameOfItem, nameOfPokemon, useGermanDataReady, useLanguage } from '@/lib/i18n-data';
import { useLocalePath } from '@/lib/locale-link';
import { REGIONS } from '@/lib/regions';
import {
  docsFromItems,
  docsFromMaps,
  docsFromPokemon,
  parseRecentEntry,
  pathForDoc,
  pathForRecent,
  pushRecent,
  recentFromDoc,
  RECENT_KEY,
  searchDocs,
  type RecentEntry,
  type SearchDoc,
} from '@/lib/global-search';
import type { DexIndexEntry, PokemonType } from '@/lib/types';
import { cn } from '@/lib/utils';

function loadRecents(): RecentEntry[] {
  try {
    const raw = JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]') as unknown;
    if (!Array.isArray(raw)) return [];
    return raw.map(parseRecentEntry).filter((e): e is RecentEntry => e !== null);
  } catch {
    return [];
  }
}

function storeRecent(entry: RecentEntry): RecentEntry[] {
  const next = pushRecent(entry, loadRecents());
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  return next;
}

interface SearchCommandProps {
  variant?: 'modal' | 'inline';
  open?: boolean;
  onClose?: () => void;
  className?: string;
}

export default function SearchCommand({ variant = 'modal', open = false, onClose, className }: SearchCommandProps) {
  const navigate = useNavigate();
  const localePath = useLocalePath();
  const { t } = useTranslation();
  const lang = useLanguage();
  const deReady = useGermanDataReady();
  const [index, setIndex] = useState<DexIndexEntry[]>([]);
  const [itemInputs, setItemInputs] = useState<Array<{ slug: string; nameEn: string; nameDe?: string; skip?: boolean }>>(
    [],
  );
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const [active, setActive] = useState(0);
  const [recents, setRecents] = useState<RecentEntry[]>([]);
  const [typesMap, setTypesMap] = useState<Record<number, PokemonType[]>>({});
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const isModal = variant === 'modal';
  const visible = isModal ? open : true;

  useEffect(() => {
    let alive = true;
    bootNameIndex()
      .then((entries) => alive && setIndex(entries))
      .catch(() => undefined);
    loadItemDescs()
      .then((descs) => {
        if (!alive) return;
        setItemInputs(
          Object.entries(descs).map(([slug, d]) => ({
            slug,
            nameEn: d.n,
            nameDe: d.de,
            skip: d.nospr === 1,
          })),
        );
      })
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (visible) {
      setRecents(loadRecents());
      setQuery('');
      setActive(0);
      window.setTimeout(() => inputRef.current?.focus(), 60);
    }
  }, [visible]);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(query.trim()), 120);
    return () => window.clearTimeout(timer);
  }, [query]);

  const docs = useMemo(
    () => [
      ...docsFromPokemon(index, (id) => germanAliasOfPokemon(id)),
      ...docsFromItems(itemInputs),
      ...docsFromMaps(REGIONS),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deReady rebuilds aliases after the lazy de load
    [index, itemInputs, deReady],
  );

  const results = useMemo(() => searchDocs(debounced, docs), [docs, debounced]);

  useEffect(() => setActive(0), [results]);

  useEffect(() => {
    let alive = true;
    const missing = results
      .filter((r) => r.kind === 'pokemon' && r.pokemonId != null && !typesMap[r.pokemonId])
      .map((r) => r.pokemonId as number);
    if (missing.length === 0) return;
    Promise.all(
      missing.map((id) =>
        getPokemon(id)
          .then(
            (p): [number, PokemonType[]] => [
              id,
              p.types.sort((a, b) => a.slot - b.slot).map((tp) => tp.type.name) as PokemonType[],
            ],
          )
          .catch((): [number, PokemonType[]] => [id, []]),
      ),
    ).then((pairs) => {
      if (!alive) return;
      setTypesMap((prev) => {
        const next = { ...prev };
        for (const [id, types] of pairs) next[id] = types;
        return next;
      });
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results]);

  const labelOf = useCallback(
    (doc: SearchDoc) => {
      if (doc.kind === 'pokemon' && doc.pokemonId != null) return nameOfPokemon(doc.pokemonId, lang);
      if (doc.kind === 'item' && doc.itemSlug) return nameOfItem(doc.itemSlug, lang);
      return lang === 'de' ? doc.labelDe : doc.labelEn;
    },
    [lang],
  );

  const go = useCallback(
    (path: string) => {
      setQuery('');
      onClose?.();
      navigate(localePath(path));
    },
    [navigate, localePath, onClose],
  );

  const pick = useCallback(
    (doc: SearchDoc) => {
      setRecents(storeRecent(recentFromDoc(doc, labelOf(doc))));
      go(pathForDoc(doc, lang));
    },
    [go, labelOf, lang],
  );

  const pickRecent = useCallback(
    (entry: RecentEntry) => {
      setRecents(storeRecent(entry));
      go(pathForRecent(entry, lang));
    },
    [go, lang],
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const len = results.length;
      if (len === 0) return;
      setActive((a) => (e.key === 'ArrowDown' ? (a + 1) % len : (a - 1 + len) % len));
      listRef.current?.children[active]?.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = results[active] ?? results[0];
      if (target) pick(target);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose?.();
    }
  };

  const noResults = debounced.length > 0 && results.length === 0;
  const activeKey = results[active]?.key;

  const inputRow = (
    <div
      className={cn(
        'glass flex items-center gap-3 border border-hairline px-5 transition-all duration-300',
        isModal
          ? 'h-14 rounded-t-xl border-b-0'
          : 'h-16 rounded-xl focus-within:border-gold/70 focus-within:shadow-glow-gold focus-within:-translate-y-0.5',
      )}
    >
      <Search size={20} className="shrink-0 text-tx-muted" strokeWidth={1.75} />
      <input
        ref={inputRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={onKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => window.setTimeout(() => setFocused(false), 120)}
        placeholder={t('search.placeholder')}
        role="combobox"
        aria-expanded={results.length > 0}
        aria-controls="pdx-search-listbox"
        aria-activedescendant={activeKey ? `pdx-search-opt-${activeKey}` : undefined}
        className="h-full min-w-0 flex-1 bg-transparent font-sans text-lg font-medium text-tx-primary outline-none placeholder:font-pixel placeholder:text-[10px] placeholder:tracking-[0.08em] placeholder:text-tx-muted"
      />
      {query ? (
        <button
          type="button"
          aria-label={t('pokedex.clearSearch')}
          onClick={() => setQuery('')}
          className="shrink-0 text-tx-muted transition-colors hover:text-gold"
        >
          <X size={18} strokeWidth={1.75} />
        </button>
      ) : (
        <kbd className="pixel-label hidden shrink-0 rounded-sm border border-hairline2 px-2 py-1 text-[9px] text-tx-muted sm:block">
          /
        </kbd>
      )}
    </div>
  );

  const resultList = (
    <div
      className={cn(
        'overflow-hidden border border-hairline',
        isModal ? 'glass rounded-b-xl border-t-0' : 'mt-2 rounded-xl bg-surface1',
      )}
    >
      {noResults && (
        <motion.div
          key={`empty-${debounced}`}
          animate={{ x: [0, -6, 6, -4, 4, 0] }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center gap-3 px-6 py-8 text-center"
        >
          <img src="/pokeball-open.svg" alt="" className="h-12 w-10 opacity-50" />
          <p className="font-sans text-sm font-semibold text-gold">{t('search.noMatch', { q: debounced })}</p>
        </motion.div>
      )}

      {!debounced && recents.length > 0 && (
        <div className="px-3 py-2">
          <div className="flex items-center justify-between px-2 py-1">
            <span className="pixel-label text-[9px] text-tx-muted">{t('search.recent')}</span>
            <button
              type="button"
              onClick={() => {
                localStorage.removeItem(RECENT_KEY);
                setRecents([]);
              }}
              className="pixel-label text-[9px] text-tx-muted transition-colors hover:text-gold"
            >
              {t('search.clear')}
            </button>
          </div>
          <ul>
            {recents.map((r) => (
              <li key={recentRowKey(r)}>
                <button
                  type="button"
                  onClick={() => pickRecent(r)}
                  className="flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-surface3"
                >
                  <RecentGlyph entry={r} lang={lang} />
                  <span className="min-w-0 flex-1 truncate font-sans text-sm font-medium text-tx-secondary">
                    {recentLabel(r, lang)}
                  </span>
                  <span className="pixel-label shrink-0 text-[9px] text-tx-muted">{t(`search.kind.${r.kind}`)}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {results.length > 0 && (
        <ul
          ref={listRef}
          role="listbox"
          id="pdx-search-listbox"
          data-lenis-prevent
          className="max-h-[340px] overflow-y-auto py-1"
        >
          {results.map((r, i) => {
            const types = r.pokemonId != null ? (typesMap[r.pokemonId] ?? []) : [];
            const tColor = types[0] ? `var(--type-${types[0]})` : 'transparent';
            return (
              <li key={r.key} role="option" id={`pdx-search-opt-${r.key}`} aria-selected={i === active}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => pick(r)}
                  className={cn(
                    'flex w-full items-center gap-3 border-l-2 px-4 py-2 text-left transition-colors duration-150',
                    i === active ? 'bg-surface3' : 'border-transparent',
                  )}
                  style={i === active && types[0] ? { borderColor: tColor } : i === active ? { borderColor: 'var(--gold)' } : undefined}
                >
                  <ResultGlyph doc={r} lang={lang} />
                  <span className="min-w-0 flex-1 truncate font-sans text-base font-semibold text-tx-primary">
                    {labelOf(r)}
                  </span>
                  {r.kind === 'pokemon' && r.pokemonId != null ? (
                    <span className="pixel-label shrink-0 text-[9px] text-tx-muted">{padNum(r.pokemonId)}</span>
                  ) : (
                    <span className="pixel-label shrink-0 text-[9px] text-tx-muted">{t(`search.kind.${r.kind}`)}</span>
                  )}
                  {types.length > 0 && (
                    <span className="hidden shrink-0 items-center gap-1 sm:flex">
                      {types.map((tp) => (
                        <TypeBadge key={tp} type={tp} />
                      ))}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );

  if (!isModal) {
    const showPanel = focused && (results.length > 0 || noResults || (!debounced && recents.length > 0));
    return (
      <MotionRoot>
        <div className={cn('relative w-full', className)}>
          {inputRow}
          {showPanel && <div className="absolute inset-x-0 top-full z-40">{resultList}</div>}
        </div>
      </MotionRoot>
    );
  }

  return (
    <MotionRoot>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[90] flex items-start justify-center px-4 pt-24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.button
              aria-label={t('search.closeSearch')}
              className="absolute inset-0 cursor-default bg-void/60 backdrop-blur-sm"
              onClick={onClose}
              tabIndex={-1}
            />
            <motion.div
              role="dialog"
              aria-label={t('search.dialogAria')}
              className="relative w-full max-w-[640px]"
              initial={{ y: -16, scale: 0.98, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: -16, scale: 0.98, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 180, damping: 22 }}
            >
              <motion.div
                animate={noResults ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
                transition={{ duration: 0.4 }}
                className="rounded-xl shadow-elevate"
              >
                {inputRow}
                {resultList}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionRoot>
  );
}

function recentRowKey(entry: RecentEntry): string {
  if (entry.kind === 'pokemon') return `pokemon:${entry.id}`;
  if (entry.kind === 'item') return `item:${entry.slug}`;
  return `map:${entry.region}:${entry.nodeId ?? ''}`;
}

function recentLabel(entry: RecentEntry, lang: 'de' | 'en'): string {
  if (entry.kind === 'pokemon') return nameOfPokemon(entry.id, lang);
  if (entry.kind === 'item') return nameOfItem(entry.slug, lang);
  return entry.label;
}

function RecentGlyph({ entry, lang }: { entry: RecentEntry; lang: 'de' | 'en' }) {
  if (entry.kind === 'pokemon') {
    return <Sprite id={entry.id} name={nameOfPokemon(entry.id, lang)} era="default" skeleton={false} className="h-8 w-8" />;
  }
  if (entry.kind === 'item') {
    return <ItemIcon slug={entry.slug} name={nameOfItem(entry.slug, lang)} size={32} />;
  }
  return (
    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-hairline bg-surface2 text-tx-muted">
      <Map size={14} strokeWidth={1.75} />
    </span>
  );
}

function ResultGlyph({ doc, lang }: { doc: SearchDoc; lang: 'de' | 'en' }) {
  if (doc.kind === 'pokemon' && doc.pokemonId != null) {
    return (
      <Sprite
        id={doc.pokemonId}
        name={nameOfPokemon(doc.pokemonId, lang)}
        era="default"
        skeleton={false}
        className="h-10 w-10 shrink-0"
      />
    );
  }
  if (doc.kind === 'item' && doc.itemSlug) {
    return <ItemIcon slug={doc.itemSlug} name={nameOfItem(doc.itemSlug, lang)} size={40} />;
  }
  return (
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-hairline bg-surface2 text-tx-muted">
      <Map size={16} strokeWidth={1.75} />
    </span>
  );
}
