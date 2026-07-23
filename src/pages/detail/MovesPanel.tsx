/* Moves panel — density-addendum §3 Row 2 (span 7).
 * Dense table NAME|TYPE|CAT|PWR|ACC|PP (36px rows, sticky header, own scrollbar 480px),
 * one compact toolbar row: learn-method tabs + version select + type filter.
 * Move details lazy-load via getMove in batches (SWR-cached by src/lib/pokeapi). */
import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import GameSelect from '@/components/GameSelect';
import TypeGlyph from '@/components/TypeGlyph';
import EntityDescModal, { useEntityModal } from '@/components/EntityDescModal';
import { getMove } from '@/lib/pokeapi';
import { nameOfMove, nameOfType, useLanguage } from '@/lib/i18n-data';
import { VERSION_GROUPS as ALL_VERSION_GROUPS } from '@/lib/version-groups';
import type { Move, Pokemon } from '@/lib/types';
import { cn } from '@/lib/utils';
import { VERSION_GROUPS, typeRgb } from './data';
import { SegmentedControl } from './ui';

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

type Method = 'level-up' | 'machine' | 'egg' | 'tutor';
/* labels are i18n keys under detail.moves */
const METHODS: Array<{ key: Method; labelKey: string }> = [
  { key: 'level-up', labelKey: 'detail.moves.levelUp' },
  { key: 'machine', labelKey: 'detail.moves.machine' },
  { key: 'egg', labelKey: 'detail.moves.egg' },
  { key: 'tutor', labelKey: 'detail.moves.tutor' },
];

interface MoveRow {
  name: string;
  level: number;
}

type SortKey = 'name' | 'power' | 'accuracy' | 'pp';

/** batch-fetch move details with limited concurrency, filling `cache` incrementally */
function useMoveDetails(rows: MoveRow[], pokemonId: number) {
  const cacheRef = useRef(new Map<string, Move>());
  const [cache, setCache] = useState<Map<string, Move>>(new Map());

  useEffect(() => {
    const missing = rows.map((r) => r.name).filter((n) => !cacheRef.current.has(n));
    if (!missing.length) return;
    let cancelled = false;
    (async () => {
      const BATCH = 12;
      for (let i = 0; i < missing.length; i += BATCH) {
        const slice = missing.slice(i, i + BATCH);
        const results = await Promise.allSettled(slice.map((n) => getMove(n)));
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
  }, [rows, pokemonId]);

  return cache;
}

const EMPTY_ROWS: MoveRow[] = [];

const CAT_COLORS: Record<string, string> = {
  physical: '#FB923C',
  special: '#38BDF8',
  status: '#A8B3C7',
};

export default function MovesPanel({ pokemon }: { pokemon: Pokemon }) {
  const { t: t8n } = useTranslation();
  const lang = useLanguage();
  /* version groups that actually teach this Pokémon anything, newest → oldest */
  const availableVersions = useMemo(() => {
    const present = new Set<string>();
    for (const m of pokemon.moves) for (const d of m.version_group_details) present.add(d.version_group.name);
    return VERSION_GROUPS.filter((g) => present.has(g.key));
  }, [pokemon]);

  const [version, setVersion] = useState<string>('');
  const activeVersion = availableVersions.some((v) => v.key === version)
    ? version
    : (availableVersions[0]?.key ?? '');

  /* GameSelect options: full version-group info for the groups that teach moves */
  const versionOptions = useMemo(() => {
    const present = new Set(availableVersions.map((v) => v.key));
    return ALL_VERSION_GROUPS.filter((vg) => present.has(vg.id));
  }, [availableVersions]);

  /* rows per method for the active version */
  const byMethod = useMemo(() => {
    const map = new Map<Method, MoveRow[]>();
    for (const { key } of METHODS) map.set(key, []);
    for (const m of pokemon.moves) {
      const perMethod = new Map<Method, number>();
      for (const d of m.version_group_details) {
        if (d.version_group.name !== activeVersion) continue;
        const method = d.move_learn_method.name as Method;
        if (!map.has(method)) continue;
        const prev = perMethod.get(method);
        if (prev == null || (d.level_learned_at > 0 && d.level_learned_at < prev)) {
          perMethod.set(method, d.level_learned_at);
        }
      }
      for (const [method, level] of perMethod) map.get(method)!.push({ name: m.move.name, level });
    }
    for (const rows of map.values())
      rows.sort((a, b) => a.level - b.level || nameOfMove(a.name, lang).localeCompare(nameOfMove(b.name, lang), lang));
    return map;
  }, [pokemon, activeVersion, lang]);

  const [activeMethod, setMethod] = useState<Method>('level-up');
  const rows = byMethod.get(activeMethod) ?? EMPTY_ROWS;

  const cache = useMoveDetails(rows, pokemon.id);
  const pending = useMemo(() => rows.filter((r) => !cache.has(r.name)).length, [rows, cache]);

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
      const mv = cache.get(r.name);
      if (mv) set.add(mv.type.name);
    }
    return [...set].sort();
  }, [rows, cache]);

  const view = useMemo(() => {
    let out = rows.filter((r) => {
      if (!typeFilter) return true;
      return cache.get(r.name)?.type.name === typeFilter;
    });
    if (sort) {
      const dir = sort.dir;
      out = [...out].sort((a, b) => {
        const ma = cache.get(a.name);
        const mb = cache.get(b.name);
        const va = sort.key === 'name' ? nameOfMove(a.name, lang) : (ma?.[sort.key] ?? -1);
        const vb = sort.key === 'name' ? nameOfMove(b.name, lang) : (mb?.[sort.key] ?? -1);
        if (typeof va === 'string' && typeof vb === 'string') return va.localeCompare(vb) * dir;
        return ((va as number) - (vb as number)) * dir;
      });
    } else if (activeMethod === 'level-up') {
      out = [...out].sort((a, b) => a.level - b.level || nameOfMove(a.name, lang).localeCompare(nameOfMove(b.name, lang), lang));
    }
    return out;
  }, [rows, cache, typeFilter, sort, activeMethod, lang]);

  const toggleSort = (key: SortKey) =>
    setSort((s) => (s?.key === key ? (s.dir === 1 ? { key, dir: -1 } : null) : { key, dir: 1 }));

  const entityModal = useEntityModal();

  return (
    <div className="flex h-full flex-col">
      {/* compact toolbar row */}
      <div className="flex flex-wrap items-center gap-2 px-3 py-2">
        <SegmentedControl
          id="move-method"
          size="xs"
          ariaLabel={t8n('detail.moves.learnMethod')}
          value={activeMethod}
          onChange={(v) => setMethod(v as Method)}
          options={METHODS.map((m) => ({
            value: m.key,
            label: (
              <>
                {t8n(m.labelKey)}
                <span className="text-[9px] text-tx-muted">{byMethod.get(m.key)?.length ?? 0}</span>
              </>
            ),
          }))}
        />
        <GameSelect
          value={activeVersion}
          onChange={setVersion}
          options={versionOptions}
          ariaLabel={t8n('detail.moves.versionGroup')}
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
          {pending > 0 && <span className="pixel-label pl-1 text-[8px] text-tx-muted">+{pending}</span>}
        </div>
      </div>

      {/* dense table, own scrollbar */}
      <div className="dx-scroll min-h-0 flex-1 overflow-auto border-t border-hairline" style={{ maxHeight: 480 }}>
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
                const mv = cache.get(r.name);
                const t = mv?.type.name ?? 'normal';
                const cat = mv?.damage_class.name ?? 'status';
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
                        <span className="truncate font-sans text-[13px] font-semibold text-tx-primary">
                          {nameOfMove(r.name, lang)}
                        </span>
                      </span>
                    </td>
                    <td>
                      {mv ? (
                        <span className="flex items-center gap-1" style={{ color: `rgb(${typeRgb(t)})` }}>
                          <TypeGlyph type={t} size={14} className={cn('dx-glyph', `dx-glyph-${t}`)} />
                          <span className="hidden font-sans text-[10px] font-semibold uppercase xl:inline">{nameOfType(t, lang)}</span>
                        </span>
                      ) : (
                        <span className="dx-skel inline-block h-3.5 w-8" />
                      )}
                    </td>
                    <td className="text-center">
                      {mv ? (
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
                        <span className="dx-skel mx-auto inline-block h-3.5 w-3.5 rounded-full" />
                      )}
                    </td>
                    <NumCell mv={mv} field="power" />
                    <NumCell mv={mv} field="accuracy" />
                    <NumCell mv={mv} field="pp" className="pr-3" />
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

function NumCell({ mv, field, className }: { mv: Move | undefined; field: 'power' | 'accuracy' | 'pp'; className?: string }) {
  return (
    <td className={cn('text-right font-display text-[12px] font-bold tabular-nums text-tx-secondary', className)}>
      {mv ? (mv[field] ?? '—') : <span className="dx-skel ml-auto inline-block h-3 w-6" />}
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
