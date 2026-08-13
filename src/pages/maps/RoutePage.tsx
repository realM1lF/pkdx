/* RoutePage — generic SEO content page for every Kanto location with FRLG
 * encounter data: /de/maps/kanto/:slug · /en/maps/kanto/:slug (SEO rollout 2),
 * region-parametrized for Hoenn (RSE, "Datenstand Smaragd"), Johto (HGSS,
 * "Datenstand HeartGold") and Sinnoh (DPPt, "Datenstand Platin").
 *
 * Successor of the Route 1 pilot (Route1Page.tsx): all data now comes from
 * the build-time PokéAPI snapshot src/data/routes-kanto.json (slot-summed
 * per species × method, scripts/generate-pokemon-seo.mjs) so the prerendered
 * HTML carries every table without a runtime fetch. Items/trainers come from
 * the curated pret/pokefirered enrichment (src/data/enriched/kanto.json).
 *
 * Route 1 keeps its curated pilot texts as overrides (intro, Q&A, best-catch,
 * Nuzlocke box, extra links) — ROUTE_OVERRIDES below; everything else is
 * generated from data. */
import { useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Crosshair, Gift, Map as MapIcon, Users } from 'lucide-react';
import { LocaleLink } from '@/lib/locale-link';
import QaSection from '@/components/QaSection';
import Sprite from '@/components/Sprite';
import { nameOfItem, nameOfPokemon, useLanguage } from '@/lib/i18n-data';
import { displayNameOfItem, seoItemsForNode } from '@/lib/mapdata';
import type { Lang } from '@/lib/i18n-data';
import { padNum } from '@/lib/pokeapi';
import { cn } from '@/lib/utils';
import { resolveRouteParam, routeNodeName, routePagePath } from '@/lib/seo-routes-kanto';
import { resolveHoennRouteParam, hoennRouteNodeName } from '@/lib/seo-routes-hoenn';
import { resolveJohtoRouteParam, johtoRouteNodeName } from '@/lib/seo-routes-johto';
import { resolveSinnohRouteParam, sinnohRouteNodeName } from '@/lib/seo-routes-sinnoh';
import { bestCatchByBst, wildSpeciesCount } from './route-stats';
import routesJson from '@/data/routes-kanto.json';
import routesHoennJson from '@/data/routes-hoenn.json';
import routesJohtoJson from '@/data/routes-johto.json';
import routesSinnohJson from '@/data/routes-sinnoh.json';
import kantoJson from '@/data/regions/kanto.json';
import hoennJson from '@/data/regions/hoenn.json';
import johtoJson from '@/data/regions/johto.json';
import sinnohJson from '@/data/regions/sinnoh.json';
import enrichedJson from '@/data/enriched/kanto.json';
import enrichedHoennJson from '@/data/enriched/hoenn.json';
import enrichedJohtoJson from '@/data/enriched/johto.json';
import enrichedSinnohJson from '@/data/enriched/sinnoh.json';

/* ---------- data shapes (mirror of the generator output) ---------- */

type Frlg = 'firered' | 'leafgreen';
/* cross-gen: Kanto pages also offer HGSS + GSC tables (Kanto is the HGSS/GSC
 * post-game), Hoenn pages also offer ORAS — all from the build-time snapshot */
type RouteVersion =
  | Frlg
  | 'gold'
  | 'silver'
  | 'crystal'
  | 'heartgold'
  | 'soulsilver'
  | 'ruby'
  | 'sapphire'
  | 'emerald'
  | 'omega-ruby'
  | 'alpha-sapphire'
  | 'diamond'
  | 'pearl'
  | 'platinum';
type SeoRouteRegion = 'kanto' | 'hoenn' | 'johto' | 'sinnoh';
type Method = 'WALK' | 'SURF' | 'FISH' | 'STATIC' | 'OTHER';

interface EncounterRow {
  id: number;
  slug: string;
  method: Method;
  isStatic: boolean;
  chance: number;
  minLevel: number;
  maxLevel: number;
}

interface AreaGroup {
  areaSlug: string;
  label: string;
  rows: EncounterRow[];
}

interface RouteNodeData {
  nameDe: string;
  nameEn: string;
  kind: string;
  versions: Partial<Record<RouteVersion, AreaGroup[]>>;
}

type DexTable = Record<string, { slug: string; types: string[]; bst: number }>;
type NameTable = Record<string, { de: string; en: string }>;
type EnrichedTable = Record<
  string,
  {
    items?: Array<{ slug: string; kind: string }>;
    trainers?: Array<{ name: string; class: string; party: Array<{ species: string; level: number }>; important?: boolean }>;
  }
>;

/* ---------- region config (Kanto default; Hoenn additive, RSE data) ---------- */

interface SeoRouteRegionConfig {
  region: SeoRouteRegion;
  /** i18n namespace of the region-specific strings */
  ns: 'seo.route' | 'seo.routeHoenn' | 'seo.routeJohto' | 'seo.routeSinnoh';
  versions: RouteVersion[];
  defaultVersion: RouteVersion;
  /** framing version: encounter stats, top/rarest, default table */
  primaryVersion: RouteVersion;
  /** versions compared in the Q&A diff block (Kanto: FR/LG; Hoenn: RS-Abweichungen) */
  diffVersions: [RouteVersion, RouteVersion];
  /** key suffix inside ns for the version toggle labels */
  versionLabelKey: Record<RouteVersion, string>;
  routes: Record<string, RouteNodeData>;
  dex: DexTable;
  names: NameTable;
  enriched: EnrichedTable;
  regionNodes: Array<{ id: string; label: string; nameDe?: string }>;
  regionEdges: Array<{ from: string; to: string }>;
  resolveParam: (param: string | undefined) => string | null;
  nodeName: (nodeId: string, lang: Lang) => string;
}

const REGION_CONFIG: Record<SeoRouteRegion, SeoRouteRegionConfig> = {
  kanto: {
    region: 'kanto',
    ns: 'seo.route',
    versions: ['firered', 'leafgreen', 'heartgold', 'soulsilver', 'gold', 'silver', 'crystal'],
    defaultVersion: 'firered',
    primaryVersion: 'firered',
    diffVersions: ['firered', 'leafgreen'],
    versionLabelKey: {
      firered: 'versionFR',
      leafgreen: 'versionLG',
      heartgold: 'versionHG',
      soulsilver: 'versionSS',
      gold: 'versionGold',
      silver: 'versionSilver',
      crystal: 'versionCrystal',
      ruby: 'versionFR',
      sapphire: 'versionLG',
      emerald: 'versionFR',
      'omega-ruby': 'versionHG',
      'alpha-sapphire': 'versionSS',
      diamond: 'versionFR',
      pearl: 'versionLG',
      platinum: 'versionFR',
    },
    routes: routesJson.nodes as unknown as Record<string, RouteNodeData>,
    dex: routesJson.dex as unknown as DexTable,
    names: routesJson.names as unknown as NameTable,
    enriched: enrichedJson.nodes as unknown as EnrichedTable,
    regionNodes: kantoJson.nodes as Array<{ id: string; label: string; nameDe?: string }>,
    regionEdges: kantoJson.edges as Array<{ from: string; to: string }>,
    resolveParam: resolveRouteParam,
    nodeName: routeNodeName,
  },
  hoenn: {
    region: 'hoenn',
    ns: 'seo.routeHoenn',
    versions: ['ruby', 'sapphire', 'emerald', 'omega-ruby', 'alpha-sapphire'],
    defaultVersion: 'emerald',
    primaryVersion: 'emerald',
    diffVersions: ['ruby', 'sapphire'],
    versionLabelKey: {
      firered: 'versionRuby',
      leafgreen: 'versionSapphire',
      gold: 'versionRuby',
      silver: 'versionSapphire',
      crystal: 'versionEmerald',
      heartgold: 'versionOmegaRuby',
      soulsilver: 'versionAlphaSapphire',
      ruby: 'versionRuby',
      sapphire: 'versionSapphire',
      emerald: 'versionEmerald',
      'omega-ruby': 'versionOmegaRuby',
      'alpha-sapphire': 'versionAlphaSapphire',
      diamond: 'versionRuby',
      pearl: 'versionSapphire',
      platinum: 'versionEmerald',
    },
    routes: routesHoennJson.nodes as unknown as Record<string, RouteNodeData>,
    dex: routesHoennJson.dex as unknown as DexTable,
    names: routesHoennJson.names as unknown as NameTable,
    enriched: enrichedHoennJson.nodes as unknown as EnrichedTable,
    regionNodes: hoennJson.nodes as Array<{ id: string; label: string; nameDe?: string }>,
    regionEdges: hoennJson.edges as Array<{ from: string; to: string }>,
    resolveParam: resolveHoennRouteParam,
    nodeName: hoennRouteNodeName,
  },
  johto: {
    region: 'johto',
    ns: 'seo.routeJohto',
    versions: ['heartgold', 'soulsilver', 'gold', 'silver', 'crystal'],
    defaultVersion: 'heartgold',
    primaryVersion: 'heartgold',
    diffVersions: ['heartgold', 'soulsilver'],
    versionLabelKey: {
      firered: 'versionHG',
      leafgreen: 'versionSS',
      gold: 'versionGold',
      silver: 'versionSilver',
      crystal: 'versionCrystal',
      heartgold: 'versionHG',
      soulsilver: 'versionSS',
      ruby: 'versionHG',
      sapphire: 'versionSS',
      emerald: 'versionCrystal',
      'omega-ruby': 'versionHG',
      'alpha-sapphire': 'versionSS',
      diamond: 'versionHG',
      pearl: 'versionSS',
      platinum: 'versionCrystal',
    },
    routes: routesJohtoJson.nodes as unknown as Record<string, RouteNodeData>,
    dex: routesJohtoJson.dex as unknown as DexTable,
    names: routesJohtoJson.names as unknown as NameTable,
    enriched: enrichedJohtoJson.nodes as unknown as EnrichedTable,
    regionNodes: johtoJson.nodes as Array<{ id: string; label: string; nameDe?: string }>,
    regionEdges: johtoJson.edges as Array<{ from: string; to: string }>,
    resolveParam: resolveJohtoRouteParam,
    nodeName: johtoRouteNodeName,
  },
  sinnoh: {
    region: 'sinnoh',
    ns: 'seo.routeSinnoh',
    versions: ['platinum', 'diamond', 'pearl'],
    defaultVersion: 'platinum',
    primaryVersion: 'platinum',
    diffVersions: ['diamond', 'pearl'],
    versionLabelKey: {
      firered: 'versionDiamond',
      leafgreen: 'versionPearl',
      gold: 'versionDiamond',
      silver: 'versionPearl',
      crystal: 'versionPlatinum',
      heartgold: 'versionDiamond',
      soulsilver: 'versionPearl',
      ruby: 'versionDiamond',
      sapphire: 'versionPearl',
      emerald: 'versionPlatinum',
      'omega-ruby': 'versionDiamond',
      'alpha-sapphire': 'versionPearl',
      diamond: 'versionDiamond',
      pearl: 'versionPearl',
      platinum: 'versionPlatinum',
    },
    routes: routesSinnohJson.nodes as unknown as Record<string, RouteNodeData>,
    dex: routesSinnohJson.dex as unknown as DexTable,
    names: routesSinnohJson.names as unknown as NameTable,
    enriched: enrichedSinnohJson.nodes as unknown as EnrichedTable,
    regionNodes: sinnohJson.nodes as Array<{ id: string; label: string; nameDe?: string }>,
    regionEdges: sinnohJson.edges as Array<{ from: string; to: string }>,
    resolveParam: resolveSinnohRouteParam,
    nodeName: sinnohRouteNodeName,
  },
};

const pokeName = (id: number, lang: Lang, names: NameTable) => names[String(id)]?.[lang] ?? `#${id}`;

/* ---------- curated per-slug overrides (Route 1 pilot content) ---------- */

interface RouteOverride {
  introKey?: string;
  qaKey?: string;
  bestCatch?: { pokemonId: number; bodyKey: string };
  nuzlockeBodyKey?: string;
  extraLinks?: 'route1';
}

const ROUTE_OVERRIDES: Record<string, RouteOverride> = {
  'kanto-route-1': {
    introKey: 'seo.route1.intro',
    qaKey: 'seo.route1.qa',
    bestCatch: { pokemonId: 16, bodyKey: 'seo.route1.bestCatchBody' },
    nuzlockeBodyKey: 'seo.route1.nuzlockeBody',
    extraLinks: 'route1',
  },
};

/* ---------- shared bits ---------- */

interface QaRaw {
  q: string;
  aLead: string;
  aBody: string;
}

/* key suffix inside the region i18n namespace (seo.route / seo.routeHoenn) */
const METHOD_KEY: Record<Method, string> = {
  WALK: 'methodWalk',
  SURF: 'methodSurf',
  FISH: 'methodFish',
  STATIC: 'methodStatic',
  OTHER: 'methodOther',
};

function VersionToggle({
  cfg,
  available,
  value,
  onChange,
}: {
  cfg: SeoRouteRegionConfig;
  /** versions that actually carry encounter data for this node */
  available: RouteVersion[];
  value: RouteVersion;
  onChange: (v: RouteVersion) => void;
}) {
  const { t } = useTranslation();
  return (
    <div className="flex gap-1" role="group" aria-label={t(`${cfg.ns}.encountersTitle`)}>
      {available.map((v) => (
        <button
          key={v}
          type="button"
          aria-pressed={value === v}
          onClick={() => onChange(v)}
          className={cn(
            'pixel-label rounded-pill border px-2.5 py-1 text-[8px] transition-colors',
            value === v ? 'border-gold/60 bg-gold/10 text-gold' : 'border-hairline text-tx-muted hover:text-tx-secondary',
          )}
        >
          {t(`${cfg.ns}.${cfg.versionLabelKey[v]}`)}
        </button>
      ))}
    </div>
  );
}

function SectionCard({
  eyebrow,
  title,
  right,
  children,
}: {
  eyebrow: string;
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-hairline bg-surface1">
      <header className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-hairline px-4 py-2.5 sm:px-5">
        <span className="pixel-label shrink-0 text-[9px] text-gold">{eyebrow}</span>
        <h2 className="font-display text-base font-bold tracking-wide text-tx-primary">{title}</h2>
        {right && <div className="ml-auto flex items-center gap-2">{right}</div>}
      </header>
      <div>{children}</div>
    </section>
  );
}

function EncounterTable({ rows, lang, cfg }: { rows: EncounterRow[]; lang: Lang; cfg: SeoRouteRegionConfig }) {
  const { t } = useTranslation();
  const ns = cfg.ns;
  return (
    <>
      <div className="flex items-center gap-2 border-b border-hairline px-4 py-2 sm:px-5">
        <span className="pixel-label flex-1 text-[7px] text-tx-muted">{t(`${ns}.colPokemon`)}</span>
        <span className="pixel-label hidden w-[72px] text-[7px] text-tx-muted sm:block">{t(`${ns}.colMethod`)}</span>
        <span className="pixel-label w-[58px] text-right text-[7px] text-tx-muted">{t(`${ns}.colLevel`)}</span>
        <span className="pixel-label w-[84px] text-right text-[7px] text-tx-muted">{t(`${ns}.colChance`)}</span>
      </div>
      {rows.map((e) => (
        <LocaleLink
          key={`${e.id}-${e.method}`}
          to={`/pokemon/${e.id}`}
          className="group flex h-12 items-center gap-2 border-b border-hairline/60 px-4 transition-colors last:border-b-0 hover:bg-surface2 sm:px-5"
        >
          <span className="flex min-w-0 flex-1 items-center gap-2.5">
            <Sprite id={e.id} name={pokeName(e.id, lang, cfg.names)} era="gen5" className="h-[34px] w-[34px] shrink-0" />
            <span className="min-w-0">
              <span className="block truncate text-[13px] font-semibold text-tx-primary transition-colors group-hover:text-gold">
                {pokeName(e.id, lang, cfg.names)}
              </span>
              <span className="pixel-label block text-[7px] text-tx-muted">{padNum(e.id)}</span>
            </span>
          </span>
          <span className="hidden w-[72px] shrink-0 text-[11px] font-medium text-tx-secondary sm:block">
            {t(`${cfg.ns}.${METHOD_KEY[e.method]}`)}
          </span>
          <span className="w-[58px] shrink-0 text-right font-sans text-[11px] tabular-nums text-tx-muted">
            {e.minLevel === e.maxLevel ? `Lv ${e.minLevel}` : `Lv ${e.minLevel}–${e.maxLevel}`}
          </span>
          <span className="flex w-[84px] shrink-0 items-center justify-end gap-1.5">
            <span className="font-display text-[13px] font-bold tabular-nums text-tx-primary">{e.chance}%</span>
            <span className="h-[3px] w-10 overflow-hidden rounded-pill bg-surface3">
              <span className="block h-full rounded-pill bg-gold" style={{ width: `${Math.min(100, e.chance)}%` }} />
            </span>
          </span>
        </LocaleLink>
      ))}
    </>
  );
}

/* ---------- computed content ---------- */

function useComputed(nodeId: string, data: RouteNodeData, lang: Lang, cfg: SeoRouteRegionConfig) {
  const { t } = useTranslation();
  const ns = cfg.ns;
  return useMemo(() => {
    /* stats from the framing version (Kanto: Feuerrot; Hoenn: Smaragd);
       the Q&A diff compares the two classic paired versions (Kanto: FR vs.
       LG; Hoenn: Rubin vs. Saphir — the RS-Abweichungen) */
    const frRows = (data.versions[cfg.primaryVersion] ?? []).flatMap((g) => g.rows);
    const lgRows = (data.versions[cfg.diffVersions[0]] ?? []).flatMap((g) => g.rows);
    const diffBRows = cfg.diffVersions[1] === cfg.diffVersions[0]
      ? lgRows
      : (data.versions[cfg.diffVersions[1]] ?? []).flatMap((g) => g.rows);
    /* static gift/bought encounters (e.g. the Magikarp salesman on Route 3)
     * are excluded from the "most common / rarest catch" math — only wild
     * grass/surf/fish encounters count there */
    const frWildRows = frRows.filter((r) => !r.isStatic);
    const aWildRows = lgRows.filter((r) => !r.isStatic);
    const bWildRows = diffBRows.filter((r) => !r.isStatic);
    const speciesCount = wildSpeciesCount(frRows);
    const wildSpecies = new Map<number, number>();
    for (const r of frWildRows) wildSpecies.set(r.id, Math.max(wildSpecies.get(r.id) ?? 0, r.chance));

    /* top 3 + rarest (FireRed rates) for the "what can you catch" answer */
    const sorted = [...wildSpecies.entries()].sort((a, b) => b[1] - a[1] || a[0] - b[0]);
    const fmt = ([id, chance]: [number, number]) => `${pokeName(id, lang, cfg.names)} (${chance} %)`;
    const top3 = sorted.slice(0, 3).map(fmt).join(', ');
    /* rarest: name ALL species tied at the minimum chance (cap at 3) */
    const minChance = sorted.length ? sorted[sorted.length - 1][1] : null;
    const rarestTied = minChance === null ? [] : sorted.filter(([, c]) => c === minChance);
    const rarest = rarestTied.slice(0, 3).map(fmt).join(', ');
    const rarestIsTie = rarestTied.length > 1;

    /* version diff: per species, best chance per version */
    const versionA = t(`${ns}.versionA`);
    const versionB = t(`${ns}.versionB`);
    const versionAShort = t(`${ns}.versionAShort`);
    const versionBShort = t(`${ns}.versionBShort`);
    const aSpecies = new Map<number, number>();
    for (const r of lgRows) aSpecies.set(r.id, Math.max(aSpecies.get(r.id) ?? 0, r.chance));
    const bSpecies = new Map<number, number>();
    for (const r of diffBRows) bSpecies.set(r.id, Math.max(bSpecies.get(r.id) ?? 0, r.chance));
    const diffs: string[] = [];
    const diffIds = new Set([...aSpecies.keys(), ...bSpecies.keys()]);
    for (const id of [...diffIds].sort((a, b) => a - b)) {
      const fr = aSpecies.get(id);
      const lg = bSpecies.get(id);
      if (fr !== undefined && lg === undefined)
        diffs.push(t(`${ns}.diffOnlyA`, { pokemon: pokeName(id, lang, cfg.names), chance: fr, version: versionA }));
      else if (fr === undefined && lg !== undefined)
        diffs.push(t(`${ns}.diffOnlyB`, { pokemon: pokeName(id, lang, cfg.names), chance: lg, version: versionB }));
      else if (fr !== lg)
        diffs.push(
          t(`${ns}.diffRate`, { pokemon: pokeName(id, lang, cfg.names), a: fr, b: lg, va: versionAShort, vb: versionBShort }),
        );
    }

    /* best catch: highest BST among wild species only (gifts/statics out) */
    const best = bestCatchByBst([...frWildRows, ...aWildRows, ...bWildRows], cfg.dex);

    /* items — UNION of both sources (SEO enrichment + map curation), so the
     * page never contradicts the map drawer (item-consistency fix) */
    const items = seoItemsForNode(cfg.region, nodeId);
    const itemNames = items.map((it) =>
      it.curated ? displayNameOfItem(it.curated, lang) : nameOfItem(it.slug, lang),
    );
    /* deduplicated list for the Q&A text: "Trank ×3" instead of "Trank, Trank, Trank" */
    const itemCounts = new Map<string, number>();
    for (const n of itemNames) itemCounts.set(n, (itemCounts.get(n) ?? 0) + 1);
    const itemListDedup = [...itemCounts].map(([n, c]) => (c > 1 ? `${n} ×${c}` : n)).join(', ');

    /* neighbors from the map graph */
    const neighborIds = new Set<string>();
    for (const e of cfg.regionEdges) {
      if (e.from === nodeId) neighborIds.add(e.to);
      if (e.to === nodeId) neighborIds.add(e.from);
    }
    const neighbors = [...neighborIds]
      .map((id) => cfg.regionNodes.find((n) => n.id === id))
      .filter((n): n is NonNullable<typeof n> => Boolean(n))
      .map((n) => (lang === 'de' ? n.nameDe ?? n.label : n.label))
      .slice(0, 3);

    return { speciesCount, top3, rarest, rarestIsTie, diffs, best, items, itemNames, itemListDedup, neighbors };
  }, [nodeId, data, lang, cfg, ns, t]);
}

/* ---------- page ---------- */

export default function RoutePage({ region = 'kanto' }: { region?: SeoRouteRegion }) {
  const cfg = REGION_CONFIG[region];
  const ns = cfg.ns;
  const { slug } = useParams();
  const { t } = useTranslation();
  const lang = useLanguage();
  const [version, setVersion] = useState<RouteVersion>(cfg.defaultVersion);

  const nodeId = cfg.resolveParam(slug);
  const data = nodeId ? cfg.routes[nodeId] : undefined;

  const computed = useComputed(nodeId ?? '', data ?? { nameDe: '', nameEn: '', kind: '', versions: {} }, lang, cfg);

  if (!nodeId || !data) {
    /* unknown location → back to the region map */
    return (
      <div className="mx-auto max-w-content px-4 pb-20 pt-6 md:px-8">
        <LocaleLink to={`/maps/${cfg.region}`} className="text-gold underline-offset-2 hover:underline">
          {t(`${ns}.crumbRegion`)}
        </LocaleLink>
      </div>
    );
  }

  const name = cfg.nodeName(nodeId, lang);
  /* curated overrides exist only for the Kanto Route 1 pilot */
  const override = region === 'kanto' ? ROUTE_OVERRIDES[nodeId] : undefined;
  /* only editions with actual encounter data on this node are offered —
   * e.g. Cerulean Cave does not exist in GSC, so the chip is hidden there
   * instead of silently showing a FRLG table under an HGSS label */
  const availableVersions = cfg.versions.filter((v) => (data.versions[v]?.length ?? 0) > 0);
  const activeVersion = availableVersions.includes(version) ? version : cfg.defaultVersion;
  const groups = data.versions[activeVersion] ?? [];
  const multiArea = groups.length > 1;

  const neighborText =
    computed.neighbors.length >= 2
      ? t(`${ns}.neighbors`, { name, a: computed.neighbors[0], b: computed.neighbors[1] })
      : '';
  const intro = override?.introKey ? t(override.introKey) : t(`${ns}.intro`, { name, neighbors: neighborText });

  const bestCatchId = override?.bestCatch?.pokemonId ?? computed.best?.id;
  const bestCatchBody = override?.bestCatch
    ? t(override.bestCatch.bodyKey)
    : computed.best
      ? t(`${ns}.bestCatchBody`, { pokemon: pokeName(computed.best.id, lang, cfg.names), bst: computed.best.bst, name })
      : null;

  /* Q&A — curated for Route 1 (pilot texts), generated elsewhere */
  const qaItems = (() => {
    if (override?.qaKey) {
      const qa = t(override.qaKey, { returnObjects: true }) as QaRaw[];
      return qa.map((item) => ({
        q: item.q,
        a: (
          <p>
            <strong className="font-semibold text-tx-primary">{item.aLead}</strong> {item.aBody}
          </p>
        ),
      }));
    }
    const items: Array<{ q: string; a: React.ReactNode }> = [];
    items.push({
      q: t(`${ns}.qaCatchQ`, { name }),
      a: (
        <p>
          <strong className="font-semibold text-tx-primary">
            {t(`${ns}.qaCatchLead`, { count: computed.speciesCount })}
          </strong>{' '}
          {t(computed.rarestIsTie ? `${ns}.qaCatchBodyTie` : `${ns}.qaCatchBody`, {
            top: computed.top3,
            rare: computed.rarest,
          })}
        </p>
      ),
    });
    items.push({
      q: t(`${ns}.qaDiffQ`, { name }),
      a: (
        <p>
          <strong className="font-semibold text-tx-primary">
            {computed.diffs.length ? t(`${ns}.qaDiffLeadYes`) : t(`${ns}.qaDiffLeadNo`)}
          </strong>{' '}
          {computed.diffs.length
            ? t(`${ns}.qaDiffBodyYes`, { name, details: computed.diffs.join('; ') })
            : t(`${ns}.qaDiffBodyNo`, { name })}
        </p>
      ),
    });
    items.push({
      q: t(`${ns}.qaItemsQ`, { name }),
      a: (
        <p>
          <strong className="font-semibold text-tx-primary">
            {computed.items.length ? t(`${ns}.qaItemsLeadYes`) : t(`${ns}.qaItemsLeadNo`)}
          </strong>{' '}
          {computed.items.length
            ? t(`${ns}.qaItemsBodyYes`, { name, count: computed.items.length, list: computed.itemListDedup })
            : t(`${ns}.qaItemsBodyNo`, { name })}
        </p>
      ),
    });
    if (computed.best) {
      items.push({
        q: t(`${ns}.qaBestQ`, { name }),
        a: (
          <p>
            <strong className="font-semibold text-tx-primary">
              {t(`${ns}.qaBestLead`, { pokemon: pokeName(computed.best.id, lang, cfg.names) })}
            </strong>{' '}
            {t(`${ns}.qaBestBody`, { pokemon: pokeName(computed.best.id, lang, cfg.names), bst: computed.best.bst, name })}
          </p>
        ),
      });
    }
    return items;
  })();

  const trainers = (cfg.enriched[nodeId]?.trainers ?? []).slice(0, 12);

  return (
    <div className="mx-auto max-w-content px-4 pb-20 pt-6 md:px-8">
      <div className="max-w-3xl">
        {/* breadcrumb (Maps › Kanto › name) — mirrored by the JSON-LD
            BreadcrumbList emitted from src/lib/structured-data.ts */}
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex flex-wrap items-center gap-1 font-sans text-[12px] font-semibold text-tx-muted">
            <li>
              <LocaleLink to="/maps" className="transition-colors hover:text-gold">
                {t(`${ns}.crumbMaps`)}
              </LocaleLink>
            </li>
            <li aria-hidden className="flex items-center">
              <ChevronRight size={12} />
            </li>
            <li>
              <LocaleLink to={`/maps/${cfg.region}`} className="transition-colors hover:text-gold">
                {t(`${ns}.crumbRegion`)}
              </LocaleLink>
            </li>
            <li aria-hidden className="flex items-center">
              <ChevronRight size={12} />
            </li>
            <li aria-current="page" className="text-tx-secondary">
              {name}
            </li>
          </ol>
        </nav>

        <header className="mb-8">
          <p className="pixel-label text-[9px] text-gold">{t(`${ns}.eyebrow`, { name })}</p>
          <h1 className="font-display text-2xl font-extrabold tracking-wide text-tx-primary md:text-3xl">
            {t(`${ns}.title`, { name })}
          </h1>
          <p className="mt-3 font-sans text-[14px] leading-relaxed text-tx-secondary">{intro}</p>
        </header>

        <div className="flex flex-col gap-4">
          {/* encounter tables (per area), FR/LG toggle */}
          <SectionCard
            eyebrow={t(`${ns}.encountersEyebrow`)}
            title={t(`${ns}.encountersTitle`)}
            right={<VersionToggle cfg={cfg} available={availableVersions} value={activeVersion} onChange={setVersion} />}
          >
            {groups.map((g) => (
              <div key={g.areaSlug}>
                {multiArea && (
                  <p className="pixel-label border-b border-hairline/60 bg-surface2/50 px-4 py-1.5 text-[7px] text-tx-muted sm:px-5">
                    {g.label}
                  </p>
                )}
                <EncounterTable rows={g.rows} lang={lang} cfg={cfg} />
              </div>
            ))}
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 px-4 py-2.5 text-[10px] font-medium text-tx-muted sm:px-5">
              {t(`${ns}.encounterSource`)}
              <LocaleLink
                to={`/maps/${cfg.region}?node=${nodeId}&v=${activeVersion}`}
                className="text-gold/80 underline-offset-2 transition-colors hover:text-gold hover:underline"
              >
                {t('maps.viewOnMapHint')}
              </LocaleLink>
            </p>
          </SectionCard>

          {/* items (curated enrichment) */}
          {computed.items.length > 0 && (
            <SectionCard eyebrow={t(`${ns}.itemsEyebrow`)} title={t(`${ns}.itemsTitle`, { name })}>
              {computed.items.map((it, i) => (
                <div key={`${it.slug}-${i}`} className="flex items-center gap-3 border-b border-hairline/60 px-4 py-2.5 last:border-b-0 sm:px-5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-gold/30 bg-gold-soft text-gold">
                    <Gift size={16} strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold text-tx-primary">{computed.itemNames[i]}</p>
                  </div>
                  <span className="pixel-label rounded-sm border border-hairline px-1 py-0.5 text-[6px] text-tx-muted">
                    {it.kind === 'hidden'
                      ? t(`${ns}.itemKindHidden`)
                      : it.kind === 'given'
                        ? t(`${ns}.itemKindGiven`)
                        : t(`${ns}.itemKindBall`)}
                  </span>
                </div>
              ))}
            </SectionCard>
          )}

          {/* trainers (curated enrichment) */}
          {trainers.length > 0 && (
            <SectionCard eyebrow={t(`${ns}.trainersEyebrow`)} title={t(`${ns}.trainersTitle`, { name })}>
              {trainers.map((tr, i) => (
                <div key={`${tr.class}-${tr.name}-${i}`} className="flex items-center gap-3 border-b border-hairline/60 px-4 py-2.5 last:border-b-0 sm:px-5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-hairline bg-surface2 text-tx-muted">
                    <Users size={15} strokeWidth={1.75} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-semibold text-tx-primary">
                      {tr.class} {tr.name}
                    </p>
                    <p className="text-[11px] text-tx-muted">
                      {tr.party.map((p) => `${pokeNameBySlug(p.species, lang, cfg)} Lv ${p.level}`).join(', ')}
                    </p>
                  </div>
                </div>
              ))}
            </SectionCard>
          )}

          {/* best catch */}
          {bestCatchId && bestCatchBody && (
            <SectionCard eyebrow={t(`${ns}.bestCatchEyebrow`)} title={t(`${ns}.bestCatchTitle`, { name })}>
              <div className="flex items-start gap-3 px-4 py-4 sm:px-5">
                <LocaleLink to={`/pokemon/${bestCatchId}`} className="group shrink-0" aria-label={pokeName(bestCatchId, lang, cfg.names)}>
                  <Sprite
                    id={bestCatchId}
                    name={pokeName(bestCatchId, lang, cfg.names)}
                    era="gen5"
                    className="h-[56px] w-[56px] transition-transform duration-150 group-hover:scale-110"
                  />
                </LocaleLink>
                <p className="font-sans text-[13px] leading-relaxed text-tx-secondary">{bestCatchBody}</p>
              </div>
            </SectionCard>
          )}

          {/* nuzlocke box */}
          <section className="rounded-lg border border-gold/40 bg-gradient-to-br from-gold/15 to-gold/5 p-4 sm:p-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-gold/40 bg-abyss/60 text-gold">
                <Crosshair size={16} strokeWidth={1.75} />
              </span>
              <div className="min-w-0 flex-1 basis-56">
                <p className="pixel-label text-[8px] text-gold">{t(`${ns}.nuzlockeEyebrow`)}</p>
                <h2 className="font-display text-base font-bold tracking-wide text-tx-primary">
                  {t(`${ns}.nuzlockeTitle`, { name })}
                </h2>
              </div>
              <LocaleLink
                to={`/nuzlocke/new?region=${cfg.region}&at=${nodeId}`}
                className="inline-flex h-9 items-center gap-1.5 rounded-md border border-gold/60 bg-gradient-to-br from-gold/25 to-gold/10 px-4 font-display text-[12px] font-bold tracking-wider text-tx-primary transition-all hover:-translate-y-0.5 hover:shadow-glow-gold"
              >
                {t(`${ns}.nuzlockeCta`)}
                <ChevronRight size={14} />
              </LocaleLink>
            </div>
            <p className="mt-3 font-sans text-[13px] leading-relaxed text-tx-secondary">
              {override?.nuzlockeBodyKey ? t(override.nuzlockeBodyKey) : t(`${ns}.nuzlockeBody`, { name })}
            </p>
          </section>

          {/* Q&A */}
          <QaSection className="mt-4" defaultOpen={2} items={qaItems} />

          {/* internal links */}
          <section className="mt-4">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px flex-1 bg-hairline" aria-hidden />
              <span className="pixel-label text-[9px] text-gold">{t(`${ns}.linksEyebrow`)}</span>
              <span className="h-px flex-1 bg-hairline" aria-hidden />
            </div>
            <div className="flex flex-col gap-2">
              <LocaleLink
                to={`/maps/${cfg.region}?node=${nodeId}`}
                className="group flex items-center justify-between rounded-md border border-hairline bg-surface1 px-4 py-3 transition-colors hover:border-hairline2 hover:bg-surface2"
              >
                <span className="flex items-center gap-2.5 text-[13px] font-semibold text-tx-primary transition-colors group-hover:text-gold">
                  <MapIcon size={15} className="text-gold" />
                  {t(`${ns}.openMapCta`, { name })}
                </span>
                <ChevronRight size={15} className="text-tx-muted transition-transform group-hover:translate-x-0.5 group-hover:text-gold" />
              </LocaleLink>
              {override?.extraLinks === 'route1' && (
                <>
                  <LocaleLink
                    to={routePagePath(lang, 'kanto-route-22')}
                    className="group flex items-center justify-between rounded-md border border-hairline bg-surface1 px-4 py-3 transition-colors hover:border-hairline2 hover:bg-surface2"
                  >
                    <span className="min-w-0">
                      <span className="block text-[13px] font-semibold text-tx-primary transition-colors group-hover:text-gold">
                        {t('seo.route1.route22Link')}
                      </span>
                      <span className="block text-[11px] text-tx-muted">{t('seo.route1.route22Note')}</span>
                    </span>
                    <ChevronRight size={15} className="shrink-0 text-tx-muted transition-transform group-hover:translate-x-0.5 group-hover:text-gold" />
                  </LocaleLink>
                  <LocaleLink
                    to="/pokemon/25"
                    className="group flex items-center justify-between rounded-md border border-hairline bg-surface1 px-4 py-3 transition-colors hover:border-hairline2 hover:bg-surface2"
                  >
                    <span className="flex items-center gap-2.5">
                      <Sprite id={25} name={pokeName(25, lang, cfg.names)} era="gen5" className="h-[26px] w-[26px]" />
                      <span className="text-[13px] font-semibold text-tx-primary transition-colors group-hover:text-gold">
                        {t('seo.route1.linkPikachu')}
                      </span>
                    </span>
                    <ChevronRight size={15} className="text-tx-muted transition-transform group-hover:translate-x-0.5 group-hover:text-gold" />
                  </LocaleLink>
                </>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

/* trainer party species come as slugs — resolve via the region dex table */
const SLUG_TO_ID_CACHE = new Map<SeoRouteRegionConfig, Record<string, number>>();
function pokeNameBySlug(slug: string, lang: Lang, cfg: SeoRouteRegionConfig): string {
  let map = SLUG_TO_ID_CACHE.get(cfg);
  if (!map) {
    map = Object.fromEntries(Object.entries(cfg.dex).map(([id, d]) => [d.slug, Number(id)]));
    SLUG_TO_ID_CACHE.set(cfg, map);
  }
  const id = map[slug];
  return id ? pokeName(id, lang, cfg.names) : nameOfPokemon(slug, lang);
}
