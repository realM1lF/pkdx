/* DetailDrawer — 400px node readout (maps.md §2.6): dense encounter table
 * (sprite / name / method chip / level range / rate micro-bar, multi-area
 * sub-headers, statics pinned to SPECIAL) + curated items tab + Nuzlocke link. */
import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { ChevronRight, Fish, Footprints, Sparkles, Waves, X } from 'lucide-react';
import type { MapNode, RegionMap } from '@/lib/regions';
import { accentRgb, nodeIndex, versionLabel } from '@/lib/regions';
import type { CuratedItem, EncounterEntry, MethodBucket, NodeMapData } from '@/lib/mapdata';
import { ITEM_SPRITE_BASE, METHOD_BUCKETS, itemsForNode } from '@/lib/mapdata';
import { displayName, padNum } from '@/lib/pokeapi';
import Sprite from '@/components/Sprite';
import PokeballLoader from '@/components/PokeballLoader';
import { cn } from '@/lib/utils';

const METHOD_ICON: Record<MethodBucket, typeof Footprints> = {
  WALK: Footprints,
  SURF: Waves,
  FISH: Fish,
  OTHER: Sparkles,
};

type SortKey = 'rate' | 'name' | 'level';

function ItemSprite({ slug }: { slug: string }) {
  const [err, setErr] = useState(false);
  if (err) return <span className="h-6 w-6 rounded-sm bg-surface3" aria-hidden />;
  return (
    <img
      src={`${ITEM_SPRITE_BASE}/${slug}.png`}
      width={24}
      height={24}
      alt=""
      loading="lazy"
      onError={() => setErr(true)}
      style={{ imageRendering: 'pixelated' }}
    />
  );
}

function EncounterRow({ e, region, node }: { e: EncounterEntry; region: RegionMap; node: MapNode }) {
  const rgb = accentRgb(region.accent);
  const rare = e.maxChance <= 10;
  return (
    <Link
      to={`/pokemon/${e.pokemonId}?from=${region.region}:${node.id}`}
      className="maps-row group flex h-10 items-center gap-2 border-b border-hairline/60 px-3 transition-colors hover:bg-surface3"
    >
      <span className="maps-row-sprite h-[30px] w-[30px] shrink-0">
        <Sprite id={e.pokemonId} name={e.slug} era={e.pokemonId <= 649 ? 'gen5' : 'default'} className="h-[30px] w-[30px]" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-medium leading-tight text-tx-primary">
          {displayName(e.slug)}
        </span>
        <span className="pixel-label block text-[7px] text-tx-muted">{padNum(e.pokemonId)}</span>
      </span>
      <span className="flex shrink-0 items-center gap-1">
        {e.methods.map((m) => {
          const Icon = METHOD_ICON[m];
          const gold = m === 'OTHER' && e.isStatic;
          return (
            <span
              key={m}
              title={m}
              className="inline-flex h-[18px] w-[18px] items-center justify-center rounded-sm border"
              style={{
                color: gold ? '#F6C945' : region.accent,
                borderColor: gold ? 'rgba(246,201,69,0.4)' : `rgba(${rgb},0.35)`,
                background: gold ? 'rgba(246,201,69,0.10)' : `rgba(${rgb},0.10)`,
              }}
            >
              <Icon size={11} />
            </span>
          );
        })}
      </span>
      <span className="w-[52px] shrink-0 text-right font-sans text-[10px] tabular-nums text-tx-muted">
        {e.minLevel === e.maxLevel ? `Lv ${e.minLevel}` : `${e.minLevel}–${e.maxLevel}`}
      </span>
      <span className="flex w-[64px] shrink-0 items-center justify-end gap-1.5">
        <span className={cn('font-display text-[12px] font-bold tabular-nums', rare ? 'text-gold' : 'text-tx-primary')}>
          {e.maxChance}%
        </span>
        <span className="h-[3px] w-10 overflow-hidden rounded-pill bg-surface3">
          <span
            className="block h-full rounded-pill"
            style={{ width: `${e.maxChance}%`, background: rare ? '#F6C945' : region.accent }}
          />
        </span>
      </span>
      <ChevronRight size={14} className="shrink-0 text-tx-muted opacity-0 transition-opacity group-hover:opacity-100" />
    </Link>
  );
}

interface DetailDrawerProps {
  region: RegionMap;
  node: MapNode;
  nd: NodeMapData | undefined;
  version: string;
  methods: ReadonlySet<MethodBucket>;
  onToggleMethod: (m: MethodBucket) => void;
  onResetMethods: () => void;
  onClose: () => void;
  isMobile: boolean;
}

export default function DetailDrawer({
  region,
  node,
  nd,
  version,
  methods,
  onToggleMethod,
  onResetMethods,
  onClose,
  isMobile,
}: DetailDrawerProps) {
  const [tab, setTab] = useState<'encounters' | 'items'>('encounters');
  const [sort, setSort] = useState<SortKey>('rate');
  const items = useMemo(() => itemsForNode(region.region, node.id), [region, node]);
  const byId = useMemo(() => nodeIndex(region), [region]);
  const rgb = accentRgb(region.accent);

  const caption = useMemo(() => {
    const neighbors = region.edges
      .filter((e) => e.from === node.id || e.to === node.id)
      .map((e) => (e.from === node.id ? e.to : e.from))
      .map((id) => byId.get(id)?.label)
      .filter(Boolean) as string[];
    return neighbors.length > 0 ? `Between ${neighbors.slice(0, 2).join(' & ')}` : region.name;
  }, [region, node, byId]);

  const methodCount = nd ? Object.keys(nd.methodTop).length : 0;

  const { staticEntries, areas, totalShown, totalAll } = useMemo(() => {
    if (!nd || nd.status !== 'loaded') return { staticEntries: [], areas: [], totalShown: 0, totalAll: 0 };
    const sorter = (a: EncounterEntry, b: EncounterEntry) =>
      sort === 'rate'
        ? b.maxChance - a.maxChance || a.pokemonId - b.pokemonId
        : sort === 'name'
          ? displayName(a.slug).localeCompare(displayName(b.slug))
          : a.minLevel - b.minLevel || a.pokemonId - b.pokemonId;
    const statics: EncounterEntry[] = [];
    let all = 0;
    let shown = 0;
    const groups = nd.areas
      .map((g) => {
        all += g.entries.length;
        const kept = g.entries.filter((e) => e.methods.some((m) => methods.has(m)));
        const normal = kept.filter((e) => !e.isStatic);
        statics.push(...kept.filter((e) => e.isStatic));
        shown += kept.length;
        return { ...g, entries: normal.sort(sorter) };
      })
      .filter((g) => g.entries.length > 0);
    statics.sort(sorter);
    return { staticEntries: statics, areas: groups, totalShown: shown, totalAll: all };
  }, [nd, methods, sort]);

  return (
    <motion.aside
      initial={isMobile ? { y: '100%' } : { x: '100%' }}
      animate={{ x: 0, y: 0 }}
      exit={isMobile ? { y: '100%' } : { x: '100%' }}
      transition={{ type: 'spring', stiffness: 180, damping: 22 }}
      className={cn(
        'z-40 flex flex-col border-hairline bg-surface1 shadow-elevate',
        isMobile
          ? 'fixed inset-x-0 bottom-0 h-[85dvh] rounded-t-2xl border-t'
          : 'absolute bottom-0 right-0 top-0 w-[400px] border-l',
      )}
      role="dialog"
      aria-label={`${node.label} details`}
    >
      {/* header */}
      <div className="border-b border-hairline p-4 pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className="pixel-label rounded-sm border px-1.5 py-0.5 text-[7px]"
              style={{ color: region.accent, borderColor: `rgba(${rgb},0.4)` }}
            >
              {node.kind.toUpperCase()}
            </span>
            <span className="pixel-label rounded-sm border border-hairline px-1.5 py-0.5 text-[7px] text-tx-muted">
              ORDER {node.order}
            </span>
            <span className="pixel-label rounded-sm border border-gold/40 px-1.5 py-0.5 text-[7px] text-gold">
              {versionLabel(version)}
            </span>
            {node.postGame && (
              <span className="pixel-label rounded-sm border border-dashed border-gold/50 px-1.5 py-0.5 text-[7px] text-gold">
                POST-GAME
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-hairline bg-surface2 text-tx-secondary transition-all hover:rotate-90 hover:border-hairline2 hover:text-gold"
          >
            <X size={14} />
          </button>
        </div>
        <h2 className="mt-2.5 font-display text-[22px] font-extrabold uppercase leading-none text-tx-primary">
          {node.label}
        </h2>
        <p className="mt-1 text-[11px] font-medium text-tx-muted">
          {region.name} — {caption}
        </p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-4 divide-x divide-hairline border-b border-hairline">
        {(
          [
            ['POKÉMON', nd ? nd.pokemonCount : '…'],
            ['METHODS', nd ? methodCount : '…'],
            ['ITEMS', items.length],
            ['BEST', nd ? `${nd.bestRate}%` : '…'],
          ] as Array<[string, string | number]>
        ).map(([label, value]) => (
          <div key={label} className="px-3 py-2">
            <div className="pixel-label text-[7px] text-tx-muted">{label}</div>
            <div
              className={cn(
                'mt-0.5 font-display text-[15px] font-bold tabular-nums text-tx-primary',
                label === 'ITEMS' && items.length === 0 && 'text-tx-muted/50',
              )}
            >
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* tabs */}
      <div className="flex border-b border-hairline" role="tablist">
        {(
          [
            ['encounters', `ENCOUNTERS ${nd?.status === 'loaded' ? totalAll : '…'}`],
            ['items', `ITEMS ${items.length}`],
          ] as Array<['encounters' | 'items', string]>
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={cn(
              'pixel-label relative flex-1 py-2.5 text-[8px] transition-colors',
              tab === key ? 'text-gold' : 'text-tx-muted hover:text-tx-secondary',
            )}
          >
            {label}
            {tab === key && <motion.span layoutId="maps-drawer-tab" className="absolute inset-x-0 bottom-0 h-[2px] bg-gold" />}
          </button>
        ))}
      </div>

      {/* body */}
      <div className="maps-drawer-scroll flex-1 overflow-y-auto">
        {tab === 'encounters' ? (
          <>
            {/* toolbar */}
            <div className="flex items-center justify-between gap-2 border-b border-hairline px-3 py-2">
              <div className="flex items-center gap-1">
                {METHOD_BUCKETS.map((m) => {
                  const active = methods.has(m);
                  const Icon = METHOD_ICON[m];
                  return (
                    <button
                      key={m}
                      type="button"
                      aria-pressed={active}
                      onClick={() => onToggleMethod(m)}
                      title={m}
                      className={cn(
                        'inline-flex h-6 items-center gap-1 rounded-pill border px-1.5 text-[9px] font-semibold transition-all',
                        active ? 'border-current' : 'border-hairline text-tx-muted',
                      )}
                      style={active ? { color: region.accent, background: `rgba(${rgb},0.16)` } : undefined}
                    >
                      <Icon size={11} />
                      {m}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-0.5" role="group" aria-label="Sort">
                {(
                  [
                    ['rate', 'RATE'],
                    ['name', 'NAME'],
                    ['level', 'LV'],
                  ] as Array<[SortKey, string]>
                ).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSort(key)}
                    className={cn(
                      'pixel-label rounded-sm px-1.5 py-1 text-[7px] transition-colors',
                      sort === key ? 'bg-surface3 text-gold' : 'text-tx-muted hover:text-tx-secondary',
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* table states */}
            {nd === undefined ? (
              <div className="flex flex-col items-center gap-3 py-14">
                <PokeballLoader variant="inline" />
                <span className="pixel-label text-[8px] text-tx-muted">SCANNING…</span>
              </div>
            ) : nd.status !== 'loaded' ? (
              <div className="flex flex-col items-center gap-2 px-6 py-14 text-center">
                <span className="pixel-label text-[9px] text-tx-muted">NO WILD DATA — {versionLabel(version)}</span>
                <p className="text-[11px] font-medium text-tx-muted">
                  Nothing spawns here in this version. Try another game chip above.
                </p>
              </div>
            ) : totalShown === 0 ? (
              <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
                <span className="pixel-label text-[9px] text-gold">
                  NO {[...methods].join(' / ')} ENCOUNTERS IN {versionLabel(version)}
                </span>
                <button
                  type="button"
                  onClick={onResetMethods}
                  className="rounded-md border border-hairline2 px-3 py-1.5 text-[11px] font-semibold text-tx-secondary transition-colors hover:bg-surface3 hover:text-gold"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div>
                {staticEntries.length > 0 && (
                  <section>
                    <div className="flex items-center justify-between border-b border-hairline bg-surface2/60 px-3 py-1.5">
                      <span className="pixel-label text-[8px] text-gold">SPECIAL</span>
                      <span className="font-sans text-[9px] tabular-nums text-tx-muted">{staticEntries.length}</span>
                    </div>
                    {staticEntries.map((e) => (
                      <EncounterRow key={`s-${e.pokemonId}`} e={e} region={region} node={node} />
                    ))}
                  </section>
                )}
                {areas.map((g) => (
                  <section key={g.areaSlug}>
                    <div className="flex items-center justify-between border-b border-hairline bg-surface2/60 px-3 py-1.5">
                      <span className="pixel-label text-[8px]" style={{ color: region.accent }}>
                        {g.areaLabel}
                      </span>
                      <span className="font-sans text-[9px] tabular-nums text-tx-muted">{g.entries.length}</span>
                    </div>
                    {g.entries.map((e) => (
                      <EncounterRow key={`${g.areaSlug}-${e.pokemonId}`} e={e} region={region} node={node} />
                    ))}
                  </section>
                ))}
              </div>
            )}
          </>
        ) : (
          /* items tab */
          <div>
            {items.length === 0 ? (
              <div className="flex flex-col items-center gap-2.5 px-6 py-14 text-center">
                <img src="/pokeball.svg" alt="" width={40} height={40} className="opacity-50" />
                <p className="text-[12px] font-medium text-tx-muted">No item data curated for this spot yet.</p>
              </div>
            ) : (
              items.map((it: CuratedItem) => (
                <div key={`${it.itemSlug}-${it.name}`} className="flex items-center gap-2.5 border-b border-hairline/60 px-3 py-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center">
                    <ItemSprite slug={it.itemSlug} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-medium text-tx-primary">{it.name}</span>
                    <span className="block truncate text-[10px] text-tx-muted">{it.note}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-1">
                    {it.hidden && (
                      <span className="pixel-label rounded-sm border border-dashed border-gold/50 px-1 py-0.5 text-[6px] text-gold">
                        HIDDEN
                      </span>
                    )}
                    <span className="pixel-label rounded-sm border border-hairline px-1 py-0.5 text-[6px] text-tx-muted">
                      {it.pocket}
                    </span>
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* footer */}
      <div className="flex items-center justify-between gap-2 border-t border-hairline px-3 py-2.5">
        <Link
          to={`/nuzlocke/new?region=${region.region}&at=${node.id}`}
          className="inline-flex h-8 items-center gap-1 rounded-md border border-hairline2 px-3 text-[11px] font-semibold text-tx-secondary transition-colors hover:bg-surface3 hover:text-gold"
        >
          Add to Nuzlocke
          <ChevronRight size={13} />
        </Link>
        <span className="text-[9px] font-medium text-tx-muted">Data: PokéAPI · {versionLabel(version)}</span>
      </div>
    </motion.aside>
  );
}
