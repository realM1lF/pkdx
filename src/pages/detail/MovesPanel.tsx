/* Moves panel — density-addendum §3 Row 2 (span 7).
 * Dense table NAME|TYPE|CAT|PWR|ACC|PP (2.25rem rows, sticky header, own scrollbar 30rem),
 * one compact toolbar row: learn-method tabs + type filter (edition lives in page chrome).
 * Power/type/PP come from @pkmn for the selected edition; missing moves stay blank. */
import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import HonestyHint from '@/components/HonestyHint';
import TypeGlyph from '@/components/TypeGlyph';
import EntityDescModal, { useEntityModal } from '@/components/EntityDescModal';
import { moveMetaForDisplay, type GenMoveMeta } from '@/lib/gen-dex';
import { nameOfMove, nameOfType, useLanguage } from '@/lib/i18n-data';
import { machineLabel, machineOf } from '@/lib/machines';
import { eggLearnsetFor, learnMethodTabsForGen, learnsetFor, type LearnMethodTab } from '@/lib/move-pool';
import { versionGroupById } from '@/lib/version-groups';
import type { Pokemon } from '@/lib/types';
import { cn } from '@/lib/utils';
import { typeRgb } from './data';
import { SegmentedControl } from './ui';

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

type Method = LearnMethodTab;
/* labels are i18n keys under detail.moves */
const METHODS: Array<{ key: Method; labelKey: string }> = [
  { key: 'level-up', labelKey: 'detail.moves.levelUp' },
  { key: 'tm', labelKey: 'detail.moves.tm' },
  { key: 'hm', labelKey: 'detail.moves.hm' },
  { key: 'egg', labelKey: 'detail.moves.egg' },
  { key: 'tutor', labelKey: 'detail.moves.tutor' },
];

interface MoveRow {
  name: string;
  level: number;
}

type SortKey = 'name' | 'power' | 'accuracy' | 'pp';

const EMPTY_ROWS: MoveRow[] = [];
const EMPTY_ANCESTORS: Pokemon[] = [];

const CAT_COLORS: Record<string, string> = {
  physical: '#FB923C',
  special: '#38BDF8',
  status: '#A8B3C7',
};

function rowMeta(name: string, vg: string): GenMoveMeta & { ready: boolean } {
  return moveMetaForDisplay(vg, name);
}

export default function MovesPanel({
  pokemon,
  version,
  ancestors = EMPTY_ANCESTORS,
}: {
  pokemon: Pokemon;
  version: string;
  ancestors?: Pokemon[];
}) {
  const { t: t8n } = useTranslation();
  const lang = useLanguage();
  const activeVersion = version;
  const gen = versionGroupById(activeVersion).gen;
  const methodTabs = useMemo(() => {
    const allowed = new Set(learnMethodTabsForGen(gen));
    return METHODS.filter((m) => allowed.has(m.key));
  }, [gen]);

  /* rows per method for the active version — never mixes editions */
  const eggs = useMemo(
    () => eggLearnsetFor(pokemon, ancestors, activeVersion),
    [pokemon, ancestors, activeVersion],
  );
  const byMethod = useMemo(() => {
    const map = new Map<Method, MoveRow[]>();
    for (const { key } of methodTabs) {
      const pool =
        key === 'tm' || key === 'hm'
          ? learnsetFor(pokemon, activeVersion, 'machine').filter((e) => {
              const info = machineOf(activeVersion, e.slug);
              return key === 'hm' ? info?.kind === 'hm' : info?.kind !== 'hm';
            })
          : key === 'egg'
            ? eggs.entries
            : learnsetFor(pokemon, activeVersion, key);
      const rows = pool.map((e) => ({ name: e.slug, level: e.level }));
      rows.sort((a, b) => a.level - b.level || nameOfMove(a.name, lang).localeCompare(nameOfMove(b.name, lang), lang));
      map.set(key, rows);
    }
    return map;
  }, [pokemon, activeVersion, lang, methodTabs, eggs]);

  const [activeMethod, setMethod] = useState<Method>('level-up');
  if (!methodTabs.some((m) => m.key === activeMethod)) {
    setMethod('level-up');
  }
  const rows = byMethod.get(activeMethod) ?? EMPTY_ROWS;

  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 } | null>(null);

  /* reset filter/sort when the dataset changes (derived-state-during-render) */
  const listKey = `${pokemon.id}:${activeVersion}:${activeMethod}`;
  const [prevListKey, setPrevListKey] = useState(listKey);
  if (prevListKey !== listKey) {
    setPrevListKey(listKey);
    setTypeFilter(null);
    setSort(null);
  }

  const presentTypes = useMemo(() => {
    const set = new Set<string>();
    for (const r of rows) {
      const meta = rowMeta(r.name, activeVersion);
      if (meta.ready && meta.type) set.add(meta.type);
    }
    return [...set].sort();
  }, [rows, activeVersion]);

  const view = useMemo(() => {
    let out = rows.filter((r) => {
      if (!typeFilter) return true;
      return rowMeta(r.name, activeVersion).type === typeFilter;
    });
    if (sort) {
      const dir = sort.dir;
      out = [...out].sort((a, b) => {
        const ma = rowMeta(a.name, activeVersion);
        const mb = rowMeta(b.name, activeVersion);
        const va = sort.key === 'name' ? nameOfMove(a.name, lang) : (ma[sort.key] ?? -1);
        const vb = sort.key === 'name' ? nameOfMove(b.name, lang) : (mb[sort.key] ?? -1);
        if (typeof va === 'string' && typeof vb === 'string') return va.localeCompare(vb) * dir;
        return ((va as number) - (vb as number)) * dir;
      });
    } else if (activeMethod === 'level-up') {
      out = [...out].sort((a, b) => a.level - b.level || nameOfMove(a.name, lang).localeCompare(nameOfMove(b.name, lang), lang));
    }
    return out;
  }, [rows, typeFilter, sort, activeMethod, lang, activeVersion]);

  const toggleSort = (key: SortKey) =>
    setSort((s) => (s?.key === key ? (s.dir === 1 ? { key, dir: -1 } : null) : { key, dir: 1 }));

  const entityModal = useEntityModal();

  return (
    <div className="flex h-full flex-col">
      <HonestyHint show={activeMethod === 'egg' && eggs.inheritedFromPrevo} className="border-b border-hairline px-3 py-1.5">
        {t8n('honesty.eggFromPrevo')}
      </HonestyHint>
      {/* compact toolbar row */}
      <div className="flex flex-wrap items-center gap-2 px-3 py-2">
        <SegmentedControl
          id="move-method"
          size="xs"
          ariaLabel={t8n('detail.moves.learnMethod')}
          value={activeMethod}
          onChange={(v) => setMethod(v as Method)}
          options={methodTabs.map((m) => ({
            value: m.key,
            label: (
              <>
                {t8n(m.labelKey)}
                <span className="text-[14px] leading-none text-tx-muted">{byMethod.get(m.key)?.length ?? 0}</span>
              </>
            ),
          }))}
        />
        {/* type filter */}
        <div className="ml-auto flex items-center gap-1">
          {presentTypes.map((t) => (
            <button
              key={t}
              type="button"
              title={t8n('detail.moves.filterType', { type: nameOfType(t, lang) })}
              aria-pressed={typeFilter === t}
              onClick={() => setTypeFilter((f) => (f === t ? null : t))}
              className={cn(
                'grid h-6 w-6 place-items-center rounded-sm border transition-all duration-150',
                typeFilter === t
                  ? 'border-current bg-surface3'
                  : 'border-transparent opacity-45 hover:opacity-100',
              )}
              style={{ color: `rgb(${typeRgb(t)})` }}
            >
              <TypeGlyph type={t} size={13} />
            </button>
          ))}
        </div>
      </div>

      {/* dense table, own scrollbar */}
      <div className="dx-scroll min-h-0 max-h-[30rem] flex-1 overflow-auto border-t border-hairline">
        {view.length === 0 ? (
          <div className="flex h-40 flex-col items-center justify-center gap-2">
            <img src="/pokeball.svg" alt="" className="h-10 w-10 opacity-50" />
            <p className="font-sans text-xs text-gold">{t8n('detail.moves.empty')}</p>
          </div>
        ) : (
          <table className="dx-moves-table">
            <thead>
              <tr>
                <SortTh label={t8n('detail.moves.colName')} sortKey="name" sort={sort} onSort={toggleSort} className="pl-3" />
                <th className="w-14">{t8n('detail.moves.colType')}</th>
                <th className="w-10 text-center">{t8n('detail.moves.colCat')}</th>
                <SortTh label={t8n('detail.moves.colPwr')} sortKey="power" sort={sort} onSort={toggleSort} numeric />
                <SortTh label={t8n('detail.moves.colAcc')} sortKey="accuracy" sort={sort} onSort={toggleSort} numeric />
                <SortTh label={t8n('detail.moves.colPp')} sortKey="pp" sort={sort} onSort={toggleSort} numeric className="pr-3" />
              </tr>
            </thead>
            <tbody key={listKey}>
              {view.map((r, i) => {
                const meta = rowMeta(r.name, activeVersion);
                const t = meta.type;
                const cat = meta.category;
                const machine = activeMethod === 'tm' || activeMethod === 'hm' ? machineOf(activeVersion, r.name) : null;
                return (
                  <motion.tr
                    key={r.name}
                    className="dx-move-row cursor-pointer"
                    style={{ '--mt': typeRgb(t) } as CSSProperties}
                    data-type={t}
                    onClick={() => entityModal.open('move', r.name)}
                    title={t8n('desc.openDesc', { name: nameOfMove(r.name, lang) })}
                    initial={i < 12 ? { opacity: 0, y: 10 } : false}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: i < 12 ? i * 0.02 : 0, ease: EASE }}
                  >
                    <td className="pl-3">
                      <span className="flex items-center gap-1.5">
                        {activeMethod === 'level-up' && r.level > 0 && (
                          <span className="pixel-label w-6 shrink-0 text-[8px] text-gold">{r.level}</span>
                        )}
                        {machine && (
                          <span className="pixel-label w-10 shrink-0 text-[8px] text-gold">{machineLabel(machine, lang, activeVersion)}</span>
                        )}
                        <span className="truncate font-sans text-micro13 font-semibold text-tx-primary">
                          {nameOfMove(r.name, lang)}
                        </span>
                      </span>
                    </td>
                    <td>
                      {meta.ready && t ? (
                        <span className="flex items-center gap-1" style={{ color: `rgb(${typeRgb(t)})` }}>
                          <TypeGlyph type={t} size={14} className={cn('dx-glyph', `dx-glyph-${t}`)} />
                          <span className="hidden font-sans text-micro10 font-semibold uppercase xl:inline">{nameOfType(t, lang)}</span>
                        </span>
                      ) : (
                        <span className="font-sans text-micro11 text-tx-muted">—</span>
                      )}
                    </td>
                    <td className="text-center">
                      {meta.ready && t ? (
                        <span
                          role="img"
                          aria-label={t8n(`detail.moves.cat${cat.charAt(0).toUpperCase() + cat.slice(1)}`)}
                          title={t8n(`detail.moves.cat${cat.charAt(0).toUpperCase() + cat.slice(1)}`)}
                          className="mx-auto block h-3.5 w-3.5 opacity-90"
                          style={{
                            backgroundColor: CAT_COLORS[cat] ?? CAT_COLORS.status,
                            WebkitMask: `url(/move-${cat}.svg) center / contain no-repeat`,
                            mask: `url(/move-${cat}.svg) center / contain no-repeat`,
                          }}
                        />
                      ) : (
                        <span className="font-sans text-micro11 text-tx-muted">—</span>
                      )}
                    </td>
                    <NumCell value={meta.power} ready={meta.ready} />
                    <NumCell value={meta.accuracy} ready={meta.ready} />
                    <NumCell value={meta.pp} ready={meta.ready} className="pr-3" />
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      <EntityDescModal {...entityModal.props} />
    </div>
  );
}

function NumCell({ value, ready, className }: { value: number | null; ready: boolean; className?: string }) {
  return (
    <td className={cn('text-right font-display text-micro12 font-bold tabular-nums text-tx-secondary', className)}>
      {ready ? (value ?? '—') : <span className="dx-skel ml-auto inline-block h-3 w-6" />}
    </td>
  );
}

function SortTh({
  label,
  sortKey,
  sort,
  onSort,
  numeric,
  className,
}: {
  label: string;
  sortKey: SortKey;
  sort: { key: SortKey; dir: 1 | -1 } | null;
  onSort: (k: SortKey) => void;
  numeric?: boolean;
  className?: string;
}) {
  const active = sort?.key === sortKey;
  return (
    <th className={cn(numeric && 'text-right', className)}>
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={cn(
          'inline-flex items-center gap-0.5 uppercase transition-colors duration-150',
          active ? 'text-gold' : 'hover:text-tx-secondary',
        )}
      >
        {label}
        <ChevronDown
          size={10}
          className={cn('transition-transform duration-150', active ? 'opacity-100' : 'opacity-0', active && sort?.dir === 1 && 'rotate-180')}
        />
      </button>
    </th>
  );
}
