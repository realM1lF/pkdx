/* MiniAutocomplete — local, SearchCommand-style autocomplete (team-builder.md §E).
 * Compact command-deck variant used by the Pokémon/move/item/ability/nature pickers.
 * Keyboard: ↑↓ navigate · Enter select · Esc close.
 * The dropdown is PORTALED to <body> (fixed position, like the versus combo) so it
 * escapes overflow-hidden ancestors (SlotCard, SlotEditor expander) and never clips;
 * Portaled list; data-lenis-prevent keeps wheel inside the dropdown. */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const MAX_MENU_H = 280;
const MIN_MENU_H = 120;
const VIEWPORT_GAP = 8;

interface MiniAutocompleteProps<T> {
  items: T[];
  /** return true when item matches the query */
  filter: (item: T, query: string) => boolean;
  onSelect: (item: T) => void;
  renderItem: (item: T, active: boolean) => ReactNode;
  keyOf: (item: T) => string;
  placeholder: string;
  /** current committed value shown in the input (controlled display) */
  displayValue?: string;
  onClear?: () => void;
  autoFocus?: boolean;
  emptyLabel?: string;
  maxResults?: number;
  className?: string;
  /** when false, the dropdown is forced closed (parent-controlled) */
  disabled?: boolean;
}

interface MenuPos {
  left: number;
  width: number;
  top?: number;
  bottom?: number;
  maxHeight: number;
}

export default function MiniAutocomplete<T>({
  items,
  filter,
  onSelect,
  renderItem,
  keyOf,
  placeholder,
  displayValue,
  onClear,
  autoFocus = false,
  emptyLabel,
  maxResults = 40,
  className,
  disabled = false,
}: MiniAutocompleteProps<T>) {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [pos, setPos] = useState<MenuPos | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matched = q ? items.filter((it) => filter(it, q)) : items;
    return matched.slice(0, maxResults);
  }, [items, filter, query, maxResults]);

  /* fixed-position the portaled menu under the input; flip up near the viewport edge */
  const syncPos = useCallback(() => {
    const rect = inputRef.current?.getBoundingClientRect();
    if (!rect) return;
    const below = window.innerHeight - rect.bottom - VIEWPORT_GAP;
    const above = rect.top - VIEWPORT_GAP;
    const flip = below < MIN_MENU_H && above > below;
    setPos({
      left: rect.left,
      width: rect.width,
      ...(flip
        ? { bottom: window.innerHeight - rect.top + 6, maxHeight: Math.max(80, Math.min(MAX_MENU_H, above - 6)) }
        : { top: rect.bottom + 6, maxHeight: Math.max(80, Math.min(MAX_MENU_H, below - 6)) }),
    });
  }, []);

  /* close on outside click (list lives in a portal — check both refs) */
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (rootRef.current?.contains(t) || listRef.current?.contains(t)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  /* keep the menu glued to the input while open (page scroll, resize) */
  useEffect(() => {
    if (!open) return undefined;
    syncPos();
    window.addEventListener('resize', syncPos);
    window.addEventListener('scroll', syncPos, true);
    return () => {
      window.removeEventListener('resize', syncPos);
      window.removeEventListener('scroll', syncPos, true);
    };
  }, [open, syncPos]);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  /* scroll the keyboard-active option into view */
  useEffect(() => {
    if (!open) return;
    listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [active, open]);

  /* reset keyboard cursor on new query — derived-state-during-render pattern */
  const [prevQuery, setPrevQuery] = useState(query);
  if (prevQuery !== query) {
    setPrevQuery(query);
    setActive(0);
  }

  const commit = (item: T) => {
    onSelect(item);
    setQuery('');
    setOpen(false);
  };

  const showing = displayValue !== undefined && !open && !query;

  const menuStyle: CSSProperties | undefined = pos
    ? {
        left: pos.left,
        width: pos.width,
        ...(pos.top !== undefined ? { top: pos.top } : {}),
        ...(pos.bottom !== undefined ? { bottom: pos.bottom } : {}),
        maxHeight: pos.maxHeight,
      }
    : undefined;

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <div className="relative">
        <Search
          size={12}
          className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-tx-muted"
          aria-hidden
        />
        <input
          ref={inputRef}
          value={showing ? displayValue : query}
          disabled={disabled}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              setOpen(true);
              setActive((a) => Math.min(a + 1, results.length - 1));
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              setActive((a) => Math.max(a - 1, 0));
            } else if (e.key === 'Enter') {
              e.preventDefault();
              const item = results[Math.max(0, Math.min(active, results.length - 1))];
              if (item !== undefined && open) commit(item);
            } else if (e.key === 'Escape') {
              setOpen(false);
              setQuery('');
              inputRef.current?.blur();
            }
          }}
          placeholder={placeholder}
          className="tb-input !pl-7 !pr-7 !py-1.5 !text-[12px]"
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
        />
        {(displayValue !== undefined && (showing || query)) && onClear && (
          <button
            type="button"
            aria-label={t('tb.autocomplete.clear')}
            onClick={(e) => {
              e.stopPropagation();
              onClear();
              setQuery('');
            }}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-sm p-0.5 text-tx-muted transition-colors hover:text-gold"
          >
            <X size={12} />
          </button>
        )}
      </div>
      {createPortal(
        <AnimatePresence>
          {open && !disabled && pos && (
            <motion.ul
              ref={listRef}
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="tb-dropdown tb-dropdown-portal tb-scroll overflow-y-auto py-1"
              style={menuStyle}
              data-lenis-prevent
              role="listbox"
            >
              {results.length === 0 && (
                <li className="tb-micro-gold px-3 py-2.5">{emptyLabel ?? t('tb.autocomplete.noMatch')}</li>
              )}
              {results.map((item, i) => (
                <li key={keyOf(item)} role="option" aria-selected={i === active}>
                  <button
                    type="button"
                    data-active={i === active}
                    className="tb-option"
                    onMouseEnter={() => setActive(i)}
                    onClick={() => commit(item)}
                  >
                    {renderItem(item, i === active)}
                  </button>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  );
}
