/* CommandSearch — compact command-bar search (density addendum §2).
 * Growing input + lightweight autocomplete (sprite + name + #), ↑↓/Enter/Esc.
 * Typing live-filters the grid via onChange; picking a result opens the detail page. */
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useLocalePath } from '@/lib/locale-link';
import Fuse from 'fuse.js';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Sprite from '@/components/Sprite';
import { bootNameIndex } from '@/lib/pokeapi';
import { germanAliasOfPokemon, nameOfPokemon, useGermanDataReady, useLanguage } from '@/lib/i18n-data';
import type { DexIndexEntry } from '@/lib/types';
import { cn } from '@/lib/utils';

const MAX_RESULTS = 6;

interface CommandSearchProps {
  value: string;
  onChange: (q: string) => void;
  className?: string;
}

export default function CommandSearch({ value, onChange, className }: CommandSearchProps) {
  const navigate = useNavigate();
  const localePath = useLocalePath();
  const { t: t8n } = useTranslation();
  const lang = useLanguage();
  const deReady = useGermanDataReady();
  const [index, setIndex] = useState<DexIndexEntry[]>([]);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let alive = true;
    bootNameIndex()
      .then((entries) => alive && setIndex(entries))
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, []);

  const fuse = useMemo(
    () =>
      new Fuse(
        index.map((e) => ({ ...e, idStr: String(e.id), de: germanAliasOfPokemon(e.id) ?? '' })),
        {
        keys: [
          { name: 'label', weight: 2 },
          { name: 'name', weight: 1.5 },
          { name: 'de', weight: 2 },
          { name: 'idStr', weight: 1 },
          { name: 'num', weight: 1 },
        ],
        threshold: 0.3,
        ignoreLocation: true,
        },
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deReady rebuilds aliases after the lazy de load
    [index, deReady],
  );

  const results = useMemo(() => {
    const q = value.trim().replace(/^#/, '');
    if (!q) return [];
    return fuse.search(q).slice(0, MAX_RESULTS).map((r) => r.item);
  }, [fuse, value]);

  /* reset the active row when results change (derived state during render) */
  const [prevResults, setPrevResults] = useState(results);
  if (prevResults !== results) {
    setPrevResults(results);
    setActive(0);
  }

  const pick = (entry: DexIndexEntry) => {
    setOpen(false);
    inputRef.current?.blur();
    navigate(localePath(`/pokemon/${entry.id}`));
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const len = results.length;
      if (len === 0) return;
      setActive((a) => (e.key === 'ArrowDown' ? (a + 1) % len : (a - 1 + len) % len));
    } else if (e.key === 'Enter') {
      const target = results[active] ?? results[0];
      if (target) {
        e.preventDefault();
        pick(target);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      if (value) onChange('');
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  const showPanel = open && value.trim().length > 0;

  return (
    <div className={cn('relative shrink-0 transition-[width] duration-300 ease-out-expo', className)}>
      <div
        className={cn(
          'flex h-9 items-center gap-2 rounded-md border border-hairline bg-surface2 px-2.5',
          'transition-all duration-200 focus-within:border-gold/70 focus-within:shadow-glow-gold',
        )}
      >
        <Search size={14} strokeWidth={1.75} className="shrink-0 text-tx-muted" />
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          onKeyDown={onKeyDown}
          onFocus={() => setOpen(true)}
          onBlur={() => window.setTimeout(() => setOpen(false), 140)}
          placeholder={t8n('pokedex.searchPlaceholder')}
          role="combobox"
          aria-expanded={showPanel && results.length > 0}
          aria-controls="pdx-bar-listbox"
          aria-activedescendant={results[active] ? `pdx-bar-opt-${results[active].id}` : undefined}
          aria-label={t8n('pokedex.searchAria')}
          className="h-full min-w-0 flex-1 bg-transparent font-sans text-[13px] font-medium text-tx-primary outline-none placeholder:font-pixel placeholder:text-[8px] placeholder:tracking-[0.08em] placeholder:text-tx-muted"
        />
        {value && (
          <button
            type="button"
            aria-label={t8n('pokedex.clearSearch')}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              onChange('');
              inputRef.current?.focus();
            }}
            className="shrink-0 text-tx-muted transition-colors hover:text-gold"
          >
            <X size={13} strokeWidth={1.75} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-0 top-full z-[60] mt-1.5 overflow-hidden rounded-md border border-hairline2 bg-surface2 shadow-elevate"
          >
            {results.length === 0 ? (
              <motion.div
                key={`empty-${value}`}
                animate={{ x: [0, -6, 6, -4, 4, 0] }}
                transition={{ duration: 0.4 }}
                className="flex items-center gap-2.5 px-3 py-3"
              >
                <img src="/pokeball-open.svg" alt="" className="h-7 w-6 opacity-50" />
                <p className="font-sans text-xs font-semibold text-gold">
                  {t8n('pokedex.noMatch', { q: value.trim() })}
                </p>
              </motion.div>
            ) : (
              <ul role="listbox" id="pdx-bar-listbox" className="py-1">
                {results.map((r, i) => (
                  <li key={r.id} role="option" id={`pdx-bar-opt-${r.id}`} aria-selected={i === active}>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onMouseEnter={() => setActive(i)}
                      onClick={() => pick(r)}
                      className={cn(
                        'flex w-full items-center gap-2.5 border-l-2 px-3 py-1.5 text-left transition-colors duration-150',
                        i === active ? 'border-gold bg-surface3' : 'border-transparent',
                      )}
                    >
                      <Sprite id={r.id} name={nameOfPokemon(r.id, lang)} era="gen5" skeleton={false} className="h-7 w-7 shrink-0" />
                      <span className="min-w-0 flex-1 truncate font-sans text-[13px] font-semibold text-tx-primary">
                        {nameOfPokemon(r.id, lang)}
                      </span>
                      <span className="pixel-label shrink-0 text-[8px] text-tx-muted">{r.num}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
