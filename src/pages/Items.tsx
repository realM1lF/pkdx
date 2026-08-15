/* Items — `/items` item lexicon (Batch E, EP2-P4).
 * Searchable directory of ALL items from the desc artifact (lazy chunk, one
 * JSON load on first visit): icon grid, grouped category filter chips, DE+EN
 * search, tile click → EntityDescModal. List size stays bounded via the group
 * filter + a hard render cap, so no virtualization is needed; images lazy. */
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import MotionRoot from '@/components/MotionRoot';
import { Package, Search, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import EntityDescModal, { ItemIcon, useEntityModal } from '@/components/EntityDescModal';
import PokeballLoader from '@/components/PokeballLoader';
import { entitySlug, useDescMap } from '@/lib/desc-data';
import type { ItemDesc } from '@/lib/desc-data';
import { useLanguage } from '@/lib/i18n-data';
import { LocaleLink } from '@/lib/locale-link';
import { hasItemPage, itemDetailPath } from '@/lib/seo-items';
import { cn } from '@/lib/utils';

/* the 53 PokéAPI item categories folded into 12 filter groups
 * (i18n keys under items.groups.*) */
const CATEGORY_GROUP: Record<string, string> = {
  'standard-balls': 'balls',
  'special-balls': 'balls',
  'apricorn-balls': 'balls',
  'catching-bonus': 'balls',
  healing: 'healing',
  'status-cures': 'healing',
  revival: 'healing',
  'pp-recovery': 'healing',
  medicine: 'healing',
  'picky-healing': 'healing',
  'baking-only': 'berries',
  'effort-drop': 'berries',
  'type-protection': 'berries',
  'in-a-pinch': 'berries',
  mulch: 'berries',
  'held-items': 'held',
  choice: 'held',
  'type-enhancement': 'held',
  'species-specific': 'held',
  'stat-boosts': 'held',
  scarves: 'held',
  'bad-held-items': 'held',
  'effort-training': 'held',
  training: 'held',
  plates: 'battle',
  jewels: 'battle',
  memories: 'battle',
  'mega-stones': 'battle',
  'z-crystals': 'battle',
  'tera-shard': 'battle',
  'all-machines': 'machines',
  'tm-materials': 'machines',
  evolution: 'evolution',
  vitamins: 'boost',
  'nature-mints': 'boost',
  'species-candies': 'boost',
  collectibles: 'valuables',
  loot: 'valuables',
  'dex-completion': 'valuables',
  flutes: 'valuables',
  'plot-advancement': 'key',
  'event-items': 'key',
  gameplay: 'key',
  'data-cards': 'key',
  'apricorn-box': 'key',
  'miracle-shooter': 'key',
  spelunking: 'key',
  'curry-ingredients': 'picnic',
  'sandwich-ingredients': 'picnic',
  picnic: 'picnic',
  'all-mail': 'other',
  other: 'other',
  unused: 'other',
  'dynamax-crystals': 'other',
};

const GROUPS = ['balls', 'healing', 'berries', 'held', 'battle', 'machines', 'evolution', 'boost', 'valuables', 'key', 'picnic', 'other'] as const;

/** hard render cap — keeps the 'all' view responsive without virtualization */
const MAX_TILES = 240;

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];
const reveal = (i: number) => ({
  initial: { opacity: 0, y: 40, filter: 'blur(8px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  transition: { duration: 0.6, ease: EASE, delay: i * 0.06 },
});

interface ItemEntry {
  slug: string;
  desc: ItemDesc;
  group: string;
}

export default function Items() {
  const { t } = useTranslation();
  const lang = useLanguage();
  const descs = useDescMap('item');
  const entityModal = useEntityModal();
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState<string | null>(null);

  const all = useMemo<ItemEntry[]>(() => {
    if (!descs) return [];
    return Object.entries(descs)
      /* hide placeholder rows: ★ dynamax-crystal stubs (no real name/sprite)
       * and items without any official sprite — they would only render the
       * fallback glyph and looked broken (user feedback) */
      .filter(([, desc]) => !desc.n.startsWith('★') && !desc.nospr)
      .map(([slug, desc]) => ({ slug, desc, group: CATEGORY_GROUP[desc.category] ?? 'other' }))
      .sort((a, b) => a.desc.n.localeCompare(b.desc.n, 'en'));
  }, [descs]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return all.filter((e) => {
      if (group && e.group !== group) return false;
      if (!q) return true;
      return (
        e.slug.includes(q) ||
        e.desc.n.toLowerCase().includes(q) ||
        (e.desc.de?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [all, query, group]);

  const shown = filtered.slice(0, MAX_TILES);
  const nameOf = (e: ItemEntry) => (lang === 'de' && e.desc.de ? e.desc.de : e.desc.n);

  return (
    <MotionRoot>
    <div className="relative">
      {/* header */}
      <header className="mx-auto flex max-w-content flex-wrap items-end justify-between gap-6 px-4 pb-8 pt-12 sm:px-8">
        <div className="max-w-[600px]">
          <motion.p {...reveal(0)} className="pixel-label text-[10px] text-gold">
            {t('items.eyebrow')}
          </motion.p>
          <motion.h1
            {...reveal(1)}
            className="mt-3 font-display text-[clamp(32px,4.5vw,52px)] font-extrabold leading-[1.1] text-tx-primary"
          >
            {t('items.title')}
          </motion.h1>
          <motion.p {...reveal(2)} className="mt-3 max-w-[560px] text-[14px] font-medium leading-relaxed text-tx-secondary">
            {t('items.blurb')}
          </motion.p>
        </div>
        <motion.div {...reveal(3)} className="hidden items-center gap-2 text-[12px] font-medium text-tx-muted md:flex">
          <Package size={13} className="text-gold" />
          <span className="font-display text-[14px] font-bold tabular-nums text-tx-primary">{all.length}</span>
          {t('items.total')}
        </motion.div>
      </header>

      {/* controls: search + group chips */}
      <div className="mx-auto max-w-content px-4 sm:px-8">
        <div className="relative max-w-[420px]">
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-tx-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('items.searchPlaceholder')}
            aria-label={t('items.searchPlaceholder')}
            className="w-full rounded-md border border-hairline bg-surface2 py-2 pl-9 pr-8 font-sans text-[13px] text-tx-primary outline-none transition-all placeholder:text-tx-muted focus:border-gold/60 focus:shadow-glow-gold"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label={t('items.clearSearch')}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-0.5 text-tx-muted transition-colors hover:text-gold"
            >
              <X size={13} />
            </button>
          )}
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label={t('items.filterAria')}>
          <button
            type="button"
            onClick={() => setGroup(null)}
            aria-pressed={group === null}
            className={cn(
              'rounded-pill border px-2.5 py-1 font-sans text-[11px] font-semibold transition-colors',
              group === null
                ? 'border-gold/60 bg-gold/10 text-gold'
                : 'border-hairline bg-surface2 text-tx-secondary hover:border-hairline2 hover:text-tx-primary',
            )}
          >
            {t('items.all')}
          </button>
          {GROUPS.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGroup((cur) => (cur === g ? null : g))}
              aria-pressed={group === g}
              className={cn(
                'rounded-pill border px-2.5 py-1 font-sans text-[11px] font-semibold transition-colors',
                group === g
                  ? 'border-gold/60 bg-gold/10 text-gold'
                  : 'border-hairline bg-surface2 text-tx-secondary hover:border-hairline2 hover:text-tx-primary',
              )}
            >
              {t(`items.groups.${g}`)}
            </button>
          ))}
        </div>
        <p className="mt-2 font-sans text-[11px] text-tx-muted" aria-live="polite">
          {t('items.count', { shown: shown.length, total: filtered.length })}
        </p>
      </div>

      {/* grid */}
      <section className="mx-auto max-w-content px-4 pb-20 pt-4 sm:px-8" aria-label={t('items.gridAria')}>
        {!descs ? (
          <div className="grid min-h-[40dvh] place-items-center">
            <PokeballLoader variant="inline" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex min-h-[30dvh] flex-col items-center justify-center gap-2">
            <img src="/pokeball.svg" alt="" className="h-10 w-10 opacity-50" />
            <p className="font-sans text-sm text-gold">{t('items.empty')}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
              {shown.map((e) =>
                /* items with an SEO detail page link there; the rest keep the desc modal */
                hasItemPage(e.slug) ? (
                  <LocaleLink
                    key={e.slug}
                    to={itemDetailPath(lang, e.slug)}
                    title={nameOf(e)}
                    aria-label={nameOf(e)}
                    className="group flex flex-col items-center gap-1.5 rounded-md border border-hairline bg-surface1 px-1.5 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-glow-gold"
                  >
                    <ItemIcon slug={e.slug} name={nameOf(e)} size={32} />
                    <span className="line-clamp-2 min-h-[2.2em] text-center font-sans text-[10.5px] font-semibold leading-tight text-tx-secondary transition-colors group-hover:text-gold">
                      {nameOf(e)}
                    </span>
                  </LocaleLink>
                ) : (
                  <button
                    key={e.slug}
                    type="button"
                    onClick={() => entityModal.open('item', entitySlug(e.slug))}
                    title={nameOf(e)}
                    aria-label={t('desc.openDesc', { name: nameOf(e) })}
                    className="group flex flex-col items-center gap-1.5 rounded-md border border-hairline bg-surface1 px-1.5 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-glow-gold"
                  >
                    <ItemIcon slug={e.slug} name={nameOf(e)} size={32} />
                    <span className="line-clamp-2 min-h-[2.2em] text-center font-sans text-[10.5px] font-semibold leading-tight text-tx-secondary transition-colors group-hover:text-gold">
                      {nameOf(e)}
                    </span>
                  </button>
                ),
              )}
            </div>
            {filtered.length > shown.length && (
              <p className="mt-4 text-center font-sans text-[12px] text-gold">
                {t('items.more', { n: filtered.length - shown.length })}
              </p>
            )}
          </>
        )}
      </section>

      <EntityDescModal {...entityModal.props} />
    </div>
    </MotionRoot>
  );
}
