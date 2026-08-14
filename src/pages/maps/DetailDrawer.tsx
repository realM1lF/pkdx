/* DetailDrawer — 400px node readout (maps.md §2.6): dense encounter table
 * (sprite / name / method chip / level range / rate micro-bar, multi-area
 * sub-headers, statics pinned to SPECIAL) + curated items tab + Nuzlocke link. */
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LocaleLink } from '@/lib/locale-link';
import { pokemonHref } from '@/lib/edition-nav';
import { motion } from 'framer-motion';
import { Bug, ChevronRight, ExternalLink, Fish, Footprints, Radio, Sparkles, Swords, Trees, Waves, X } from 'lucide-react';
import type { MapNode, RegionMap } from '@/lib/regions';
import { accentRgb, nodeIndex, nodeName, regionName, versionLabel } from '@/lib/regions';
import slugsJson from '@/data/pokemon-slugs.json';
import { nameOfItem, nameOfPokemon, nameOfPocket, useLanguage } from '@/lib/i18n-data';
import type { CuratedItem, EncounterEntry, MethodBucket, MethodChip, NodeMapData } from '@/lib/mapdata';
import { ITEM_SPRITE_BASE, METHOD_BUCKETS, displayNameOfItem, itemsForNode, noteOfItem } from '@/lib/mapdata';
import { padNum } from '@/lib/pokeapi';
import Sprite from '@/components/Sprite';
import PokeballLoader from '@/components/PokeballLoader';
import EntityDescModal, { useEntityModal } from '@/components/EntityDescModal';
import { cn } from '@/lib/utils';
import HonestyHint from '@/components/HonestyHint';
import { aceSpeciesForNode, hasTrainersAtNode, trainerArtifactVersionGroup, trainerCoverage, trainerSourceMismatchesGame, trainersAtNode } from '@/lib/trainer-data';
import { versionGroupById, versionGroupForGame } from '@/lib/version-groups';
import { ROUTE_PAGES, routePagePath } from '@/lib/seo-routes-kanto';
import { HOENN_ROUTE_PAGES, hoennRoutePagePath } from '@/lib/seo-routes-hoenn';
import { JOHTO_ROUTE_PAGES, johtoRoutePagePath } from '@/lib/seo-routes-johto';
import { SINNOH_ROUTE_PAGES, sinnohRoutePagePath } from '@/lib/seo-routes-sinnoh';

const METHOD_ICON: Record<MethodBucket, typeof Footprints> = {
  WALK: Footprints,
  SURF: Waves,
  FISH: Fish,
  OTHER: Sparkles,
};

const CHIP_ICON: Record<MethodChip, typeof Footprints> = {
  swarm: Bug,
  radio: Radio,
  headbutt: Trees,
  feebas: Fish,
};

type SortKey = 'rate' | 'name' | 'level';
type DrawerTab = 'encounters' | 'items' | 'trainers';

const DEX_ID_BY_SLUG = new Map((slugsJson as string[]).map((slug, i) => [slug, i + 1] as const));

function dexIdOf(slug: string): number {
  return DEX_ID_BY_SLUG.get(slug) ?? 0;
}

function aceSpeciesOf(party: Array<{ species: string; level: number }>): string {
  if (!party.length) return 'pikachu';
  return party.reduce((best, m) => (m.level > best.level ? m : best), party[0]).species;
}

function PartySprite({ id, name }: { id: number; name: string }) {
  if (!id) return <span className="inline-block h-5 w-5 rounded-full bg-surface3" aria-hidden />;
  return (
    <Sprite
      id={id}
      name={name}
      era={id <= 649 ? 'gen5' : 'default'}
      className="h-5 w-5 shrink-0 rounded-full bg-surface2 ring-1 ring-hairline"
      skeleton={false}
    />
  );
}

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

function EncounterRow({
  e,
  region,
  node,
  version,
}: {
  e: EncounterEntry;
  region: RegionMap;
  node: MapNode;
  version: string;
}) {
  const { t } = useTranslation();
  const lang = useLanguage();
  const rgb = accentRgb(region.accent);
  const rare = e.maxChance <= 10;
  return (
    <LocaleLink
      to={pokemonHref(e.pokemonId, { game: version, from: `${region.region}:${node.id}`, v: version })}
      className="maps-row group flex h-10 items-center gap-2 border-b border-hairline/60 px-3 transition-colors hover:bg-surface3"
    >
      <span className="maps-row-sprite h-[30px] w-[30px] shrink-0">
        <Sprite id={e.pokemonId} name={nameOfPokemon(e.pokemonId, lang)} era={e.pokemonId <= 649 ? 'gen5' : 'default'} className="h-[30px] w-[30px]" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-medium leading-tight text-tx-primary">
          {nameOfPokemon(e.pokemonId, lang)}
        </span>
        <span className="pixel-label block text-[7px] text-tx-muted">{padNum(e.pokemonId)}</span>
      </span>
      <span className="flex shrink-0 items-center gap-1">
        {e.methods.map((m) => {
          const chip = e.methodChip;
          const Icon = (chip && CHIP_ICON[chip]) || METHOD_ICON[m];
          const gold = (m === 'OTHER' && e.isStatic) || chip === 'feebas';
          return (
            <span
              key={chip ?? m}
              title={t(chip ? `maps.${chip}` : `maps.${m.toLowerCase()}`)}
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
          {Math.min(100, e.maxChance)}%
        </span>
        <span className="h-[3px] w-10 overflow-hidden rounded-pill bg-surface3">
          <span
            className="block h-full rounded-pill"
            style={{ width: `${Math.min(100, e.maxChance)}%`, background: rare ? '#F6C945' : region.accent }}
          />
        </span>
      </span>
      <ChevronRight size={14} className="shrink-0 text-tx-muted opacity-0 transition-opacity group-hover:opacity-100" />
    </LocaleLink>
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
  const { t } = useTranslation();
  const lang = useLanguage();
  const [tab, setTab] = useState<DrawerTab>('encounters');
  const [sort, setSort] = useState<SortKey>('rate');
  const entityModal = useEntityModal();
  const items = useMemo(() => itemsForNode(region.region, node.id), [region, node]);
  const trainers = useMemo(() => trainersAtNode(region.region, node.id), [region.region, node.id]);
  const trainerCount = trainers.length;
  const showVersusLink = hasTrainersAtNode(region.region, node.id);
  const trainerArtifactVg = trainerArtifactVersionGroup(region.region);
  const trainerSelectedVg = versionGroupForGame(version);
  const showTrainerEditionNote = Boolean(trainerArtifactVg) && trainerSourceMismatchesGame(region.region, version);
  const versusAce = useMemo(
    () => aceSpeciesForNode(region.region, node.id) ?? 'pikachu',
    [region.region, node.id],
  );
  const byId = useMemo(() => nodeIndex(region), [region]);
  const rgb = accentRgb(region.accent);

  const caption = useMemo(() => {
    const neighbors = region.edges
      .filter((e) => e.from === node.id || e.to === node.id)
      .map((e) => (e.from === node.id ? e.to : e.from))
      .map((id) => byId.get(id))
      .filter((n): n is NonNullable<typeof n> => Boolean(n))
      .map((n) => nodeName(n, lang));
    return neighbors.length > 0
      ? t('maps.between', { neighbors: neighbors.slice(0, 2).join(' & ') })
      : regionName(region, lang);
  }, [region, node, byId, lang, t]);

  const methodCount = nd ? Object.keys(nd.methodTop).length : 0;

  /* mobile: dock the sheet below the sticky CommandBar (two rows tall since
     the mobile toolbar wraps) so the header chips stay tappable */
  const [barBottom, setBarBottom] = useState(0);
  useEffect(() => {
    if (!isMobile) return;
    const measure = () => {
      const el = document.getElementById('maps-command-bar');
      if (el) setBarBottom(Math.round(el.getBoundingClientRect().bottom));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [isMobile]);

  const { staticEntries, areas, totalShown, totalAll } = useMemo(() => {
    if (!nd || nd.status !== 'loaded') return { staticEntries: [], areas: [], totalShown: 0, totalAll: 0 };
    const sorter = (a: EncounterEntry, b: EncounterEntry) =>
      sort === 'rate'
        ? b.maxChance - a.maxChance || a.pokemonId - b.pokemonId
        : sort === 'name'
          ? nameOfPokemon(a.pokemonId, lang).localeCompare(nameOfPokemon(b.pokemonId, lang), lang)
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
  }, [nd, methods, sort, lang]);

  return (
    <motion.aside
      initial={isMobile ? { y: '100%' } : { x: '100%' }}
      animate={{ x: 0, y: 0 }}
      exit={isMobile ? { y: '100%' } : { x: '100%' }}
      transition={{ type: 'spring', stiffness: 180, damping: 22 }}
      className={cn(
        'z-40 flex flex-col border-hairline bg-surface1 shadow-elevate',
        isMobile
          ? cn('fixed inset-x-0 bottom-0 rounded-t-2xl border-t', barBottom === 0 && 'h-[85dvh]')
          : 'absolute bottom-0 right-0 top-0 w-[400px] border-l',
      )}
      style={isMobile && barBottom > 0 ? { top: barBottom } : undefined}
      role="dialog"
      aria-label={t('maps.drawerAria', { label: nodeName(node, lang) })}
    >
      {/* header */}
      <div className="border-b border-hairline p-4 pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className="pixel-label rounded-sm border px-1.5 py-0.5 text-[7px]"
              style={{ color: region.accent, borderColor: `rgba(${rgb},0.4)` }}
            >
              {t(`maps.kind${node.kind.charAt(0).toUpperCase() + node.kind.slice(1)}`, { defaultValue: node.kind })}
            </span>
            <span className="pixel-label rounded-sm border border-hairline px-1.5 py-0.5 text-[7px] text-tx-muted">
              {t('maps.order', { n: node.order })}
            </span>
            <button
              type="button"
              title={t('maps.editionHint')}
              onClick={() => {
                const el = document.getElementById('maps-version-switcher');
                el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                el?.querySelector('button')?.focus();
              }}
              className="pixel-label rounded-sm border border-gold/40 px-1.5 py-0.5 text-[7px] text-gold transition-colors hover:bg-gold/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
            >
              {t('maps.edition', { version: versionLabel(version) })}
            </button>
            {node.postGame && (
              <span className="pixel-label rounded-sm border border-dashed border-gold/50 px-1.5 py-0.5 text-[7px] text-gold">
                {t('maps.postGame')}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('maps.close')}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-hairline bg-surface2 text-tx-secondary transition-all hover:rotate-90 hover:border-hairline2 hover:text-gold"
          >
            <X size={14} />
          </button>
        </div>
        <h2 className="mt-2.5 font-display text-[22px] font-extrabold leading-none text-tx-primary">
          {nodeName(node, lang)}
        </h2>
        <p className="mt-1 text-[11px] font-medium text-tx-muted">
          {regionName(region, lang)} — {caption}
        </p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-4 divide-x divide-hairline border-b border-hairline">
        {(
          [
            [t('maps.pokemonUnit'), nd ? nd.pokemonCount : '…'],
            [t('maps.methods'), nd ? methodCount : '…'],
            [t('maps.itemsUnit'), items.length],
            [t('maps.best'), nd ? `${nd.bestRate}%` : '…'],
          ] as Array<[string, string | number]>
        ).map(([label, value]) => (
          <div key={label} className="px-3 py-2">
            <div className="pixel-label text-[7px] text-tx-muted">{label}</div>
            <div
              className={cn(
                'mt-0.5 font-display text-[15px] font-bold tabular-nums text-tx-primary',
                label === t('maps.itemsUnit') && items.length === 0 && 'text-tx-muted/50',
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
            ['encounters', t('maps.encountersTab', { count: nd?.status === 'loaded' ? totalAll : '…' })],
            ['items', t('maps.itemsTab', { count: items.length })],
            ['trainers', t('maps.trainersTab', { count: trainerCount })],
          ] as Array<[DrawerTab, string]>
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
      <div className="maps-drawer-scroll flex-1 overflow-y-auto" data-lenis-prevent>
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
                      title={t(`maps.${m.toLowerCase()}`)}
                      className={cn(
                        'inline-flex h-6 items-center gap-1 rounded-pill border px-1.5 text-[9px] font-semibold transition-all',
                        active ? 'border-current' : 'border-hairline text-tx-muted',
                      )}
                      style={active ? { color: region.accent, background: `rgba(${rgb},0.16)` } : undefined}
                    >
                      <Icon size={11} />
                      {t(`maps.${m.toLowerCase()}`)}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-0.5" role="group" aria-label={t('maps.sort')}>
                {(
                  [
                    ['rate', t('maps.sortRate')],
                    ['name', t('maps.sortName')],
                    ['level', t('maps.sortLevel')],
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
                <span className="pixel-label text-[8px] text-tx-muted">{t('maps.scanningShort')}</span>
              </div>
            ) : nd.status !== 'loaded' ? (
              <div className="flex flex-col items-center gap-2 px-6 py-14 text-center">
                <span className="pixel-label text-[9px] text-tx-muted">{t('maps.noWild', { version: versionLabel(version) })}</span>
                <p className="text-[11px] font-medium text-tx-muted">
                  {t('maps.noWildBody')}
                </p>
              </div>
            ) : totalShown === 0 ? (
              <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
                <span className="pixel-label text-[9px] text-gold">
                  {t('maps.noEncounters', { methods: [...methods].map((m) => t(`maps.${m.toLowerCase()}`)).join(' / '), version: versionLabel(version) })}
                </span>
                <button
                  type="button"
                  onClick={onResetMethods}
                  className="rounded-md border border-hairline2 px-3 py-1.5 text-[11px] font-semibold text-tx-secondary transition-colors hover:bg-surface3 hover:text-gold"
                >
                  {t('maps.resetFilters')}
                </button>
              </div>
            ) : (
              <div>
                {staticEntries.length > 0 && (
                  <section>
                    <div className="flex items-center justify-between border-b border-hairline bg-surface2/60 px-3 py-1.5">
                      <span className="pixel-label text-[8px] text-gold">{t('maps.special')}</span>
                      <span className="font-sans text-[9px] tabular-nums text-tx-muted">{staticEntries.length}</span>
                    </div>
                    {staticEntries.map((e) => (
                      <EncounterRow key={`s-${e.pokemonId}-${e.methodChip ?? e.methods.join('-')}`} e={e} region={region} node={node} version={version} />
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
                      <EncounterRow key={`${g.areaSlug}-${e.pokemonId}-${e.methods.join('-')}-${e.methodChip ?? ''}`} e={e} region={region} node={node} version={version} />
                    ))}
                  </section>
                ))}
              </div>
            )}
          </>
        ) : tab === 'items' ? (
          /* items tab */
          <div>
            {items.length === 0 ? (
              <div className="flex flex-col items-center gap-2.5 px-6 py-14 text-center">
                <img src="/pokeball.svg" alt="" width={40} height={40} className="opacity-50" />
                <p className="text-[12px] font-medium text-tx-muted">{t('maps.noItems')}</p>
              </div>
            ) : (
              items.map((it: CuratedItem) => (
                <button
                  key={`${it.itemSlug}-${it.name}`}
                  type="button"
                  onClick={() => entityModal.open('item', it.itemSlug)}
                  title={t('desc.openDesc', { name: nameOfItem(it.itemSlug, lang) })}
                  aria-label={t('desc.openDesc', { name: nameOfItem(it.itemSlug, lang) })}
                  className="flex w-full items-center gap-2.5 border-b border-hairline/60 px-3 py-2 text-left transition-colors hover:bg-surface2"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center">
                    <ItemSprite slug={it.itemSlug} />
                  </span>
                  <span className="min-w-0 flex-1">
                    {/* TM/HM names derive from the i18n move data ("TM18 (Regentanz)"),
                        curation notes ship de/en with an EN fallback */}
                    <span className="block truncate text-[13px] font-medium text-tx-primary">{displayNameOfItem(it, lang)}</span>
                    <span className="block truncate text-[10px] text-tx-muted">{noteOfItem(it, lang)}</span>
                  </span>
                  <span className="flex shrink-0 items-center gap-1">
                    {it.hidden && (
                      <span className="pixel-label rounded-sm border border-dashed border-gold/50 px-1 py-0.5 text-[6px] text-gold">
                        {t('maps.hidden')}
                      </span>
                    )}
                    <span className="pixel-label rounded-sm border border-hairline px-1 py-0.5 text-[6px] text-tx-muted">
                      {nameOfPocket(it.pocket, lang)}
                    </span>
                  </span>
                </button>
              ))
            )}
          </div>
        ) : (
          /* trainers tab */
          <div>
            {trainers.length === 0 ? (
              <div className="flex flex-col items-center gap-2.5 px-6 py-14 text-center">
                <p className="text-[12px] font-medium text-tx-muted">
                  {t(trainerCoverage(region.region) === 'key-battles' ? 'maps.noTrainersKeyBattles' : 'maps.noTrainers')}
                </p>
              </div>
            ) : (
              <>
              {trainerCoverage(region.region) === 'key-battles' && (
                <p className="border-b border-hairline px-3 py-2 font-sans text-[10px] leading-snug text-gold/90">
                  {t('maps.trainersKeyBattlesOnly')}
                </p>
              )}
              {showTrainerEditionNote && trainerArtifactVg && (
                <HonestyHint show tone="gold" className="border-b border-hairline px-3 py-2">
                  {t('versus.trainerEditionNote', {
                    source: versionGroupById(trainerArtifactVg).short,
                    selected: trainerSelectedVg ? versionGroupById(trainerSelectedVg).short : version,
                  })}
                </HonestyHint>
              )}
              {trainers.map((tr, i) => {
                const ace = aceSpeciesOf(tr.party);
                const aceId = dexIdOf(ace);
                return (
                  <LocaleLink
                    key={`${tr.node}:${tr.name}:${i}`}
                    to={`/pokemon/${ace}?tab=versus&versusTrainer=${node.id}&region=${region.region}&game=${version}`}
                    className="group flex h-11 w-full items-center gap-2.5 border-b border-hairline/60 px-3 transition-colors hover:bg-surface2"
                  >
                    <span className="flex h-[30px] w-[30px] shrink-0 items-center justify-center">
                      {aceId ? (
                        <Sprite
                          id={aceId}
                          name={nameOfPokemon(ace, lang)}
                          era={aceId <= 649 ? 'gen5' : 'default'}
                          className="h-[30px] w-[30px]"
                        />
                      ) : (
                        <span className="h-[30px] w-[30px] rounded-sm bg-surface3" aria-hidden />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-medium text-tx-primary">{tr.name}</span>
                      <span className="block truncate text-[10px] text-tx-muted">{tr.class}</span>
                    </span>
                    <span className="flex shrink-0 -space-x-1.5">
                      {tr.party.slice(0, 6).map((m, j) => (
                        <PartySprite key={j} id={dexIdOf(m.species)} name={nameOfPokemon(m.species, lang)} />
                      ))}
                    </span>
                  </LocaleLink>
                );
              })}
              </>
            )}
          </div>
        )}
      </div>

      {/* footer */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-hairline px-3 py-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <LocaleLink
            to={`/nuzlocke/new?region=${region.region}&at=${node.id}`}
            className="inline-flex h-8 items-center gap-1 rounded-md border border-hairline2 px-3 text-[11px] font-semibold text-tx-secondary transition-colors hover:bg-surface3 hover:text-gold"
          >
            {t('maps.addToNuzlocke')}
            <ChevronRight size={13} />
          </LocaleLink>
          {showVersusLink && (
            <LocaleLink
              to={`/pokemon/${versusAce}?tab=versus&versusTrainer=${node.id}&region=${region.region}&game=${version}`}
              className="inline-flex h-8 items-center gap-1 rounded-md border border-gold/50 px-3 text-[11px] font-semibold text-gold transition-colors hover:bg-gold/10"
            >
              <Swords size={12} />
              {t('maps.planVersus')}
            </LocaleLink>
          )}
          {/* SEO content page exists for every mapped node with
              framing-version wild encounters (localized slug) */}
          {region.region === 'kanto' && ROUTE_PAGES.has(node.id) && (
            <LocaleLink
              to={routePagePath(lang, node.id)}
              className="inline-flex h-8 items-center gap-1 rounded-md border border-gold/50 bg-gold/10 px-3 text-[11px] font-semibold text-gold transition-colors hover:bg-gold/20"
            >
              <ExternalLink size={12} />
              {t('maps.openAsPage')}
            </LocaleLink>
          )}
          {region.region === 'hoenn' && HOENN_ROUTE_PAGES.has(node.id) && (
            <LocaleLink
              to={hoennRoutePagePath(lang, node.id)}
              className="inline-flex h-8 items-center gap-1 rounded-md border border-gold/50 bg-gold/10 px-3 text-[11px] font-semibold text-gold transition-colors hover:bg-gold/20"
            >
              <ExternalLink size={12} />
              {t('maps.openAsPage')}
            </LocaleLink>
          )}
          {region.region === 'johto' && JOHTO_ROUTE_PAGES.has(node.id) && (
            <LocaleLink
              to={johtoRoutePagePath(lang, node.id)}
              className="inline-flex h-8 items-center gap-1 rounded-md border border-gold/50 bg-gold/10 px-3 text-[11px] font-semibold text-gold transition-colors hover:bg-gold/20"
            >
              <ExternalLink size={12} />
              {t('maps.openAsPage')}
            </LocaleLink>
          )}
          {region.region === 'sinnoh' && SINNOH_ROUTE_PAGES.has(node.id) && (
            <LocaleLink
              to={sinnohRoutePagePath(lang, node.id)}
              className="inline-flex h-8 items-center gap-1 rounded-md border border-gold/50 bg-gold/10 px-3 text-[11px] font-semibold text-gold transition-colors hover:bg-gold/20"
            >
              <ExternalLink size={12} />
              {t('maps.openAsPage')}
            </LocaleLink>
          )}
        </div>
        <span className="text-[9px] font-medium text-tx-muted">{t('maps.dataSource', { version: versionLabel(version) })}</span>
      </div>
      <EntityDescModal {...entityModal.props} />
    </motion.aside>
  );
}
