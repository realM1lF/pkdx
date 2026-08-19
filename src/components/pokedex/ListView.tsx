/* ListView — density addendum §2 "List": 44px table rows.
 * # | 28px sprite | name | type chips | HP/ATK/DEF/SPA/SPD/SPE (Orbitron 12px tabular)
 * | BST value + 40px mini-bar | shiny sparkle-dot. Row hover = 2px type-glow left + surface-2. */
import { memo, useState } from 'react';
import type { CSSProperties, Ref } from 'react';
import { LocaleLink } from '@/lib/locale-link';
import { AnimatePresence, motion } from 'framer-motion';
import Sprite from '@/components/Sprite';
import TypeChipMini from './TypeChipMini';
import { padNum, prefetchPokemon } from '@/lib/pokeapi';
import { useShiny } from '@/lib/shiny';
import { useLanguage, nameOfPokemon } from '@/lib/i18n-data';
import { useTranslation } from 'react-i18next';
import { STAT_ORDER, STAT_LABELS, TYPE_COLORS } from '@/lib/types';
import type { DexIndexEntry, PokemonType } from '@/lib/types';
import { dexEntryPath } from '@/lib/dex-forms-catalog';
import { pokemonHref } from '@/lib/edition-nav';
import { FORM_I18N_KEY, type DexSummary } from './dex-data';
import { isAboveFoldDexItem } from '@/lib/img-priority';
import { dexItemMotion, dexItemUsesMotion, dexPresenceMode } from '@/lib/dex-motion';
import { cn } from '@/lib/utils';

const COLS =
  'grid grid-cols-[44px_36px_minmax(110px,1.3fr)_minmax(96px,1fr)_repeat(6,42px)_80px_28px] items-center gap-2';
const EASE_OUT = [0.16, 1, 0.3, 1] as [number, number, number, number];
const BST_MAX = 780;

function ListHeader() {
  const { t } = useTranslation();
  return (
    <div className={cn(COLS, 'h-8 border-b border-hairline px-2')} aria-hidden>
      <span className="pixel-label text-[8px] text-tx-muted">#</span>
      <span />
      <span className="pixel-label text-[8px] text-tx-muted">{t('pokedex.listName')}</span>
      <span className="pixel-label text-[8px] text-tx-muted">{t('pokedex.listType')}</span>
      {STAT_ORDER.map((k) => (
        <span key={k} className="pixel-label text-right text-[8px] text-tx-muted">
          {STAT_LABELS[k]}
        </span>
      ))}
      <span className="pixel-label text-right text-[8px] text-tx-muted">BST</span>
      <span />
    </div>
  );
}

interface ListRowProps {
  summary: DexSummary;
  index: number;
  game?: string | null;
  ref?: Ref<HTMLDivElement>;
}

function ListRow({ summary: s, index, game, ref }: ListRowProps) {
  const { t } = useTranslation();
  const { shiny: globalShiny } = useShiny();
  const lang = useLanguage();
  const dexId = s.speciesId ?? s.id;
  const label = nameOfPokemon(s.slug ?? dexId, lang);
  const href = pokemonHref(dexEntryPath({ id: s.id, name: s.slug, form: s.form }), { game });
  const [override, setOverride] = useState<boolean | null>(null);
  const shiny = override ?? globalShiny;
  const t1 = (s.types[0] ?? 'normal') as PokemonType;
  const c1 = TYPE_COLORS[t1] ?? TYPE_COLORS.normal;
  const priority = isAboveFoldDexItem(index);
  const itemMotion = dexItemMotion(index, 'row');

  const body = (
    <>
      <div
        className={cn(COLS, 'pdx-row pointer-events-none relative h-11 border-b border-hairline px-2')}
        style={{ '--t': c1.rgb } as CSSProperties}
      >
        <span className={cn('pixel-label text-[14px]', shiny ? 'text-gold' : 'text-tx-muted')}>
          {padNum(dexId)}
        </span>
        <span className="relative grid h-7 w-7 place-items-center">
          <Sprite
            id={s.id}
            name={label}
            shiny={shiny}
            skeleton={false}
            priority={priority}
            width={28}
            height={28}
            className="h-7 w-7"
          />
        </span>
        <span className="flex min-w-0 items-baseline gap-1.5">
          <span className="truncate font-sans text-micro13 font-semibold text-tx-primary">{label}</span>
          {s.form && (
            <span className="pixel-label min-w-0 max-w-[5.5rem] shrink truncate text-[8px] text-gold">
              {t(FORM_I18N_KEY[s.form])}
            </span>
          )}
          {s.legendary && <span className="h-1.5 w-1.5 shrink-0 rotate-45 bg-gold/90" title={t('pokedex.legendary')} />}
          {s.mythical && <span className="h-1.5 w-1.5 shrink-0 rotate-45 bg-type-psychic" title={t('pokedex.mythical')} />}
        </span>
        <span className="flex min-w-0 gap-1 overflow-hidden">
          {s.types.map((t) => (
            <TypeChipMini key={t} type={t} />
          ))}
        </span>
        {STAT_ORDER.map((k) => (
          <span
            key={k}
            className="text-right font-display text-xs font-bold tabular-nums text-tx-secondary"
          >
            {s.stats[k] ?? 0}
          </span>
        ))}
        <span className="flex items-center justify-end gap-1.5">
          <span className="h-[0.1875rem] w-10 overflow-hidden rounded-pill bg-surface3">
            <span
              className="block h-full rounded-pill"
              style={{
                width: `${Math.min(100, (s.bst / BST_MAX) * 100)}%`,
                background: `linear-gradient(90deg, ${c1.gradient[0]}, ${c1.gradient[1]})`,
              }}
            />
          </span>
          <span className="w-7 text-right font-display text-xs font-extrabold tabular-nums text-gold">
            {s.bst}
          </span>
        </span>
        {/* shiny sparkle-dot */}
        <button
          type="button"
          aria-pressed={shiny}
          aria-label={`Toggle shiny ${label}`}
          onClick={() => setOverride(!shiny)}
          className="pointer-events-auto relative z-20 grid h-7 w-7 place-items-center"
        >
          <span
            className={cn(
              'block h-2 w-2 rounded-full transition-all duration-200',
              shiny
                ? 'bg-gold shadow-[0_0_8px_rgba(246,201,69,0.9)]'
                : 'bg-surface3 group-hover:bg-tx-muted/60',
            )}
          />
        </button>
      </div>
      <LocaleLink
        to={href}
        aria-label={`${label} — ${padNum(dexId)}`}
        onMouseEnter={() => prefetchPokemon(s.id)}
        onFocus={() => prefetchPokemon(s.id)}
        className="absolute inset-0 z-10"
      />
    </>
  );

  if (!dexItemUsesMotion(index)) {
    return (
      <div ref={ref} className="pdx-row-wrap group relative" data-type={t1}>
        {body}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      layout={itemMotion.layout}
      initial={itemMotion.initial}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      transition={{
        duration: 0.3,
        ease: EASE_OUT,
        delay: Math.min(index % 24, 16) * 0.02,
      }}
      className="pdx-row-wrap group relative"
      data-type={t1}
    >
      {body}
    </motion.div>
  );
}

const MemoListRow = memo(ListRow);

function ListRowSkeleton({ id, ref }: { id: number; ref?: Ref<HTMLDivElement> }) {
  return (
    <motion.div
      ref={ref}
      layout={false}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      className={cn(COLS, 'h-11 border-b border-hairline px-2')}
      aria-hidden
    >
      <span className="pixel-label text-[9px] text-tx-muted/50">{padNum(id)}</span>
      <span className="grid h-7 w-7 place-items-center">
        <img src="/pokeball.svg" alt="" className="h-5 w-5 animate-pulse opacity-20" />
      </span>
      <span className="h-2.5 w-20 animate-pulse rounded-sm bg-surface3/70" />
      <span />
      {STAT_ORDER.map((k) => (
        <span key={k} className="ml-auto h-2 w-5 animate-pulse rounded-sm bg-surface3/50" />
      ))}
      <span />
      <span />
    </motion.div>
  );
}

interface ListViewProps {
  items: DexIndexEntry[];
  summaries: ReadonlyMap<number, DexSummary>;
  game?: string | null;
}

export default function ListView({ items, summaries, game }: ListViewProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-hairline bg-surface1/40">
      <div className="min-w-[51.25rem]">
        <ListHeader />
        <AnimatePresence mode={dexPresenceMode()} initial={false}>
          {items.map((e, i) => {
            const s = summaries.get(e.id);
            return s ? (
              <MemoListRow key={e.id} summary={s} index={i} game={game} />
            ) : (
              <ListRowSkeleton key={e.id} id={e.id} />
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
