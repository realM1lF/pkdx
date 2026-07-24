/* RoutePage — generic SEO content page for every Kanto location with FRLG
 * encounter data: /de/maps/kanto/:slug · /en/maps/kanto/:slug (SEO rollout 2).
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
import type { Lang } from '@/lib/i18n-data';
import { padNum } from '@/lib/pokeapi';
import { cn } from '@/lib/utils';
import { resolveRouteParam, routeNodeName } from '@/lib/seo-routes-kanto';
import routesJson from '@/data/routes-kanto.json';
import kantoJson from '@/data/regions/kanto.json';
import enrichedJson from '@/data/enriched/kanto.json';

/* ---------- data shapes (mirror of the generator output) ---------- */

type Frlg = 'firered' | 'leafgreen';
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
  versions: Partial<Record<Frlg, AreaGroup[]>>;
}

const ROUTES = routesJson.nodes as unknown as Record<string, RouteNodeData>;
const DEX = routesJson.dex as unknown as Record<string, { slug: string; types: string[]; bst: number }>;
const NAMES = routesJson.names as unknown as Record<string, { de: string; en: string }>;
const ENRICHED = enrichedJson.nodes as unknown as Record<
  string,
  {
    items: Array<{ slug: string; kind: string }>;
    trainers: Array<{ name: string; class: string; party: Array<{ species: string; level: number }>; important?: boolean }>;
  }
>;

const KANTO_NODES = kantoJson.nodes as Array<{ id: string; label: string; nameDe?: string }>;
const KANTO_EDGES = kantoJson.edges as Array<{ from: string; to: string }>;

const pokeName = (id: number, lang: Lang) => NAMES[String(id)]?.[lang] ?? `#${id}`;

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

const METHOD_KEY: Record<Method, string> = {
  WALK: 'seo.route.methodWalk',
  SURF: 'seo.route.methodSurf',
  FISH: 'seo.route.methodFish',
  STATIC: 'seo.route.methodStatic',
  OTHER: 'seo.route.methodOther',
};

function FrlgToggle({ value, onChange }: { value: Frlg; onChange: (v: Frlg) => void }) {
  const { t } = useTranslation();
  return (
    <div className="flex gap-1" role="group" aria-label={t('seo.route.encountersTitle')}>
      {(['firered', 'leafgreen'] as const).map((v) => (
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
          {v === 'firered' ? t('seo.route.versionFR') : t('seo.route.versionLG')}
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
        <h2 className="font-display text-base font-bold uppercase tracking-wide text-tx-primary">{title}</h2>
        {right && <div className="ml-auto flex items-center gap-2">{right}</div>}
      </header>
      <div>{children}</div>
    </section>
  );
}

function EncounterTable({ rows, lang }: { rows: EncounterRow[]; lang: Lang }) {
  const { t } = useTranslation();
  return (
    <>
      <div className="flex items-center gap-2 border-b border-hairline px-4 py-2 sm:px-5">
        <span className="pixel-label flex-1 text-[7px] text-tx-muted">{t('seo.route.colPokemon')}</span>
        <span className="pixel-label hidden w-[72px] text-[7px] text-tx-muted sm:block">{t('seo.route.colMethod')}</span>
        <span className="pixel-label w-[58px] text-right text-[7px] text-tx-muted">{t('seo.route.colLevel')}</span>
        <span className="pixel-label w-[84px] text-right text-[7px] text-tx-muted">{t('seo.route.colChance')}</span>
      </div>
      {rows.map((e) => (
        <LocaleLink
          key={`${e.id}-${e.method}`}
          to={`/pokemon/${e.id}`}
          className="group flex h-12 items-center gap-2 border-b border-hairline/60 px-4 transition-colors last:border-b-0 hover:bg-surface2 sm:px-5"
        >
          <span className="flex min-w-0 flex-1 items-center gap-2.5">
            <Sprite id={e.id} name={pokeName(e.id, lang)} era="gen5" className="h-[34px] w-[34px] shrink-0" />
            <span className="min-w-0">
              <span className="block truncate text-[13px] font-semibold text-tx-primary transition-colors group-hover:text-gold">
                {pokeName(e.id, lang)}
              </span>
              <span className="pixel-label block text-[7px] text-tx-muted">{padNum(e.id)}</span>
            </span>
          </span>
          <span className="hidden w-[72px] shrink-0 text-[11px] font-medium text-tx-secondary sm:block">
            {t(METHOD_KEY[e.method])}
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

function useComputed(nodeId: string, data: RouteNodeData, lang: Lang) {
  const { t } = useTranslation();
  return useMemo(() => {
    const frRows = (data.versions.firered ?? []).flatMap((g) => g.rows);
    const lgRows = (data.versions.leafgreen ?? []).flatMap((g) => g.rows);
    const species = new Map<number, number>();
    for (const r of frRows) species.set(r.id, Math.max(species.get(r.id) ?? 0, r.chance));

    /* top 3 + rarest (FireRed rates) for the "what can you catch" answer */
    const sorted = [...species.entries()].sort((a, b) => b[1] - a[1] || a[0] - b[0]);
    const fmt = ([id, chance]: [number, number]) => `${pokeName(id, lang)} (${chance} %)`;
    const top3 = sorted.slice(0, 3).map(fmt).join(', ');
    const rarest = sorted.length ? fmt(sorted[sorted.length - 1]) : '';

    /* version diff: per species, best chance per version */
    const lgSpecies = new Map<number, number>();
    for (const r of lgRows) lgSpecies.set(r.id, Math.max(lgSpecies.get(r.id) ?? 0, r.chance));
    const diffs: string[] = [];
    const ids = new Set([...species.keys(), ...lgSpecies.keys()]);
    for (const id of [...ids].sort((a, b) => a - b)) {
      const fr = species.get(id);
      const lg = lgSpecies.get(id);
      if (fr !== undefined && lg === undefined) diffs.push(t('seo.route.diffOnlyFR', { pokemon: pokeName(id, lang), chance: fr }));
      else if (fr === undefined && lg !== undefined) diffs.push(t('seo.route.diffOnlyLG', { pokemon: pokeName(id, lang), chance: lg }));
      else if (fr !== lg) diffs.push(t('seo.route.diffRate', { pokemon: pokeName(id, lang), fr, lg }));
    }

    /* best catch: highest base stat total among catchable species */
    let best: { id: number; bst: number } | null = null;
    for (const id of ids) {
      const bst = DEX[String(id)]?.bst;
      if (bst && (!best || bst > best.bst)) best = { id, bst };
    }

    /* items (curated enrichment) */
    const items = ENRICHED[nodeId]?.items ?? [];
    const itemNames = items.map((it) => nameOfItem(it.slug, lang));

    /* neighbors from the map graph */
    const neighborIds = new Set<string>();
    for (const e of KANTO_EDGES) {
      if (e.from === nodeId) neighborIds.add(e.to);
      if (e.to === nodeId) neighborIds.add(e.from);
    }
    const neighbors = [...neighborIds]
      .map((id) => KANTO_NODES.find((n) => n.id === id))
      .filter((n): n is NonNullable<typeof n> => Boolean(n))
      .map((n) => (lang === 'de' ? n.nameDe ?? n.label : n.label))
      .slice(0, 3);

    return { speciesCount: sorted.length, top3, rarest, diffs, best, items, itemNames, neighbors };
  }, [nodeId, data, lang, t]);
}

/* ---------- page ---------- */

export default function RoutePage() {
  const { slug } = useParams();
  const { t } = useTranslation();
  const lang = useLanguage();
  const [version, setVersion] = useState<Frlg>('firered');

  const nodeId = resolveRouteParam(slug);
  const data = nodeId ? ROUTES[nodeId] : undefined;

  const computed = useComputed(nodeId ?? '', data ?? { nameDe: '', nameEn: '', kind: '', versions: {} }, lang);

  if (!nodeId || !data) {
    /* unknown location → back to the Kanto map */
    return (
      <div className="mx-auto max-w-content px-4 pb-20 pt-6 md:px-8">
        <LocaleLink to="/maps/kanto" className="text-gold underline-offset-2 hover:underline">
          {t('seo.route.crumbKanto')}
        </LocaleLink>
      </div>
    );
  }

  const name = routeNodeName(nodeId, lang);
  const override = ROUTE_OVERRIDES[nodeId];
  const groups = data.versions[version] ?? data.versions.firered ?? [];
  const multiArea = groups.length > 1;

  const neighborText =
    computed.neighbors.length >= 2
      ? t('seo.route.neighbors', { name, a: computed.neighbors[0], b: computed.neighbors[1] })
      : '';
  const intro = override?.introKey ? t(override.introKey) : t('seo.route.intro', { name, neighbors: neighborText });

  const bestCatchId = override?.bestCatch?.pokemonId ?? computed.best?.id;
  const bestCatchBody = override?.bestCatch
    ? t(override.bestCatch.bodyKey)
    : computed.best
      ? t('seo.route.bestCatchBody', { pokemon: pokeName(computed.best.id, lang), bst: computed.best.bst, name })
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
      q: t('seo.route.qaCatchQ', { name }),
      a: (
        <p>
          <strong className="font-semibold text-tx-primary">
            {t('seo.route.qaCatchLead', { count: computed.speciesCount })}
          </strong>{' '}
          {t('seo.route.qaCatchBody', { top: computed.top3, rare: computed.rarest })}
        </p>
      ),
    });
    items.push({
      q: t('seo.route.qaDiffQ', { name }),
      a: (
        <p>
          <strong className="font-semibold text-tx-primary">
            {computed.diffs.length ? t('seo.route.qaDiffLeadYes') : t('seo.route.qaDiffLeadNo')}
          </strong>{' '}
          {computed.diffs.length
            ? t('seo.route.qaDiffBodyYes', { name, details: computed.diffs.join('; ') })
            : t('seo.route.qaDiffBodyNo', { name })}
        </p>
      ),
    });
    items.push({
      q: t('seo.route.qaItemsQ', { name }),
      a: (
        <p>
          <strong className="font-semibold text-tx-primary">
            {computed.items.length ? t('seo.route.qaItemsLeadYes') : t('seo.route.qaItemsLeadNo')}
          </strong>{' '}
          {computed.items.length
            ? t('seo.route.qaItemsBodyYes', { name, count: computed.items.length, list: computed.itemNames.join(', ') })
            : t('seo.route.qaItemsBodyNo', { name })}
        </p>
      ),
    });
    if (computed.best) {
      items.push({
        q: t('seo.route.qaBestQ', { name }),
        a: (
          <p>
            <strong className="font-semibold text-tx-primary">
              {t('seo.route.qaBestLead', { pokemon: pokeName(computed.best.id, lang) })}
            </strong>{' '}
            {t('seo.route.qaBestBody', { pokemon: pokeName(computed.best.id, lang), bst: computed.best.bst, name })}
          </p>
        ),
      });
    }
    return items;
  })();

  const trainers = (ENRICHED[nodeId]?.trainers ?? []).slice(0, 12);

  return (
    <div className="mx-auto max-w-content px-4 pb-20 pt-6 md:px-8">
      <div className="max-w-3xl">
        {/* breadcrumb (Maps › Kanto › name) — mirrored by the JSON-LD
            BreadcrumbList emitted from src/lib/structured-data.ts */}
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex flex-wrap items-center gap-1 font-sans text-[12px] font-semibold text-tx-muted">
            <li>
              <LocaleLink to="/maps" className="transition-colors hover:text-gold">
                {t('seo.route.crumbMaps')}
              </LocaleLink>
            </li>
            <li aria-hidden className="flex items-center">
              <ChevronRight size={12} />
            </li>
            <li>
              <LocaleLink to="/maps/kanto" className="transition-colors hover:text-gold">
                {t('seo.route.crumbKanto')}
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
          <p className="pixel-label text-[9px] text-gold">{t('seo.route.eyebrow', { name })}</p>
          <h1 className="font-display text-2xl font-extrabold uppercase tracking-wide text-tx-primary md:text-3xl">
            {t('seo.route.title', { name })}
          </h1>
          <p className="mt-3 font-sans text-[14px] leading-relaxed text-tx-secondary">{intro}</p>
        </header>

        <div className="flex flex-col gap-4">
          {/* encounter tables (per area), FR/LG toggle */}
          <SectionCard
            eyebrow={t('seo.route.encountersEyebrow')}
            title={t('seo.route.encountersTitle')}
            right={<FrlgToggle value={version} onChange={setVersion} />}
          >
            {groups.map((g) => (
              <div key={g.areaSlug}>
                {multiArea && (
                  <p className="pixel-label border-b border-hairline/60 bg-surface2/50 px-4 py-1.5 text-[7px] text-tx-muted sm:px-5">
                    {g.label}
                  </p>
                )}
                <EncounterTable rows={g.rows} lang={lang} />
              </div>
            ))}
            <p className="px-4 py-2.5 text-[10px] font-medium text-tx-muted sm:px-5">{t('seo.route.encounterSource')}</p>
          </SectionCard>

          {/* items (curated enrichment) */}
          {computed.items.length > 0 && (
            <SectionCard eyebrow={t('seo.route.itemsEyebrow')} title={t('seo.route.itemsTitle', { name })}>
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
                      ? t('seo.route.itemKindHidden')
                      : it.kind === 'given'
                        ? t('seo.route.itemKindGiven')
                        : t('seo.route.itemKindBall')}
                  </span>
                </div>
              ))}
            </SectionCard>
          )}

          {/* trainers (curated enrichment) */}
          {trainers.length > 0 && (
            <SectionCard eyebrow={t('seo.route.trainersEyebrow')} title={t('seo.route.trainersTitle', { name })}>
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
                      {tr.party.map((p) => `${pokeNameBySlug(p.species, lang)} Lv ${p.level}`).join(', ')}
                    </p>
                  </div>
                </div>
              ))}
            </SectionCard>
          )}

          {/* best catch */}
          {bestCatchId && bestCatchBody && (
            <SectionCard eyebrow={t('seo.route.bestCatchEyebrow')} title={t('seo.route.bestCatchTitle', { name })}>
              <div className="flex items-start gap-3 px-4 py-4 sm:px-5">
                <LocaleLink to={`/pokemon/${bestCatchId}`} className="group shrink-0" aria-label={pokeName(bestCatchId, lang)}>
                  <Sprite
                    id={bestCatchId}
                    name={pokeName(bestCatchId, lang)}
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
                <p className="pixel-label text-[8px] text-gold">{t('seo.route.nuzlockeEyebrow')}</p>
                <h2 className="font-display text-base font-bold uppercase tracking-wide text-tx-primary">
                  {t('seo.route.nuzlockeTitle', { name })}
                </h2>
              </div>
              <LocaleLink
                to={`/nuzlocke/new?region=kanto&at=${nodeId}`}
                className="inline-flex h-9 items-center gap-1.5 rounded-md border border-gold/60 bg-gradient-to-br from-gold/25 to-gold/10 px-4 font-display text-[12px] font-bold uppercase tracking-wider text-tx-primary transition-all hover:-translate-y-0.5 hover:shadow-glow-gold"
              >
                {t('seo.route.nuzlockeCta')}
                <ChevronRight size={14} />
              </LocaleLink>
            </div>
            <p className="mt-3 font-sans text-[13px] leading-relaxed text-tx-secondary">
              {override?.nuzlockeBodyKey ? t(override.nuzlockeBodyKey) : t('seo.route.nuzlockeBody', { name })}
            </p>
          </section>

          {/* Q&A */}
          <QaSection className="mt-4" defaultOpen={2} items={qaItems} />

          {/* internal links */}
          <section className="mt-4">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px flex-1 bg-hairline" aria-hidden />
              <span className="pixel-label text-[9px] text-gold">{t('seo.route.linksEyebrow')}</span>
              <span className="h-px flex-1 bg-hairline" aria-hidden />
            </div>
            <div className="flex flex-col gap-2">
              <LocaleLink
                to={`/maps/kanto?node=${nodeId}`}
                className="group flex items-center justify-between rounded-md border border-hairline bg-surface1 px-4 py-3 transition-colors hover:border-hairline2 hover:bg-surface2"
              >
                <span className="flex items-center gap-2.5 text-[13px] font-semibold text-tx-primary transition-colors group-hover:text-gold">
                  <MapIcon size={15} className="text-gold" />
                  {t('seo.route.openMapCta', { name })}
                </span>
                <ChevronRight size={15} className="text-tx-muted transition-transform group-hover:translate-x-0.5 group-hover:text-gold" />
              </LocaleLink>
              {override?.extraLinks === 'route1' && (
                <>
                  <LocaleLink
                    to="/maps/kanto?node=kanto-route-22"
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
                      <Sprite id={25} name={pokeName(25, lang)} era="gen5" className="h-[26px] w-[26px]" />
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

/* trainer party species come as slugs — resolve via the dex table */
const SLUG_TO_ID: Record<string, number> = Object.fromEntries(
  Object.entries(DEX).map(([id, d]) => [d.slug, Number(id)]),
);
function pokeNameBySlug(slug: string, lang: Lang): string {
  const id = SLUG_TO_ID[slug];
  return id ? pokeName(id, lang) : nameOfPokemon(slug, lang);
}
