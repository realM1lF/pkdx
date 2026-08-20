/* TCG catalog search, filter, sort — pure functions over build index. */
import Fuse from 'fuse.js';
import type { Lang } from './i18n-data';
import type { TcgCardSummary, TcgFilterState, TcgPriceRange } from './tcg-types';
import { tcgBestMarketPrice } from './tcg-types';

function inRange(v: number | null | undefined, r: TcgPriceRange): boolean {
  if (v == null) return r.min == null && r.max == null;
  if (r.min != null && v < r.min) return false;
  if (r.max != null && v > r.max) return false;
  return true;
}

function cmField(card: TcgCardSummary, key: keyof NonNullable<TcgCardSummary['pricing']['cardmarket']>): number | null {
  const v = card.pricing.cardmarket?.[key];
  return typeof v === 'number' ? v : null;
}

function tpMarket(card: TcgCardSummary): number | null {
  const tp = card.pricing.tcgplayer;
  const row = tp?.holofoil ?? tp?.reverseHolofoil ?? tp?.normal ?? tp?.['1stEditionHolofoil'] ?? tp?.['1stEdition'];
  return row?.marketPrice ?? row?.midPrice ?? null;
}

function tpField(card: TcgCardSummary, pick: (row: NonNullable<NonNullable<TcgCardSummary['pricing']['tcgplayer']>['normal']>) => number | null | undefined): number | null {
  const tp = card.pricing.tcgplayer;
  const row = tp?.holofoil ?? tp?.reverseHolofoil ?? tp?.normal;
  if (!row) return null;
  const v = pick(row);
  return v ?? null;
}

export function filterTcgCards(cards: TcgCardSummary[], f: TcgFilterState, lang: Lang, dexScope?: number): TcgCardSummary[] {
  return cards.filter((c) => {
    if (dexScope != null && !(c.dexIds?.includes(dexScope))) return false;
    if (f.dexId != null && !(c.dexIds?.includes(f.dexId))) return false;
    if (f.setId && c.setId !== f.setId) return false;
    if (f.seriesId && c.seriesId !== f.seriesId) return false;
    if (f.rarities.length && (!c.rarity || !f.rarities.includes(c.rarity))) return false;
    if (f.category && c.category !== f.category) return false;
    if (f.stages.length && (!c.stage || !f.stages.includes(c.stage))) return false;
    if (f.types.length && !f.types.some((t) => c.types?.includes(t))) return false;
    if (f.hpMin != null && (c.hp == null || c.hp < f.hpMin)) return false;
    if (f.hpMax != null && (c.hp == null || c.hp > f.hpMax)) return false;
    if (f.variantNormal && !c.variants.normal) return false;
    if (f.variantHolo && !c.variants.holo) return false;
    if (f.variantReverse && !c.variants.reverse) return false;
    if (f.variantFirstEdition && !c.variants.firstEdition) return false;
    if (f.regulationMark && c.regulationMark !== f.regulationMark) return false;
    if (f.legalStandard && !c.legal?.standard) return false;
    if (f.legalExpanded && !c.legal?.expanded) return false;
    if (f.illustrator && c.illustrator !== f.illustrator) return false;

    const cm = c.pricing.cardmarket;
    if (!inRange(cm?.low ?? null, f.cmLow)) return false;
    if (!inRange(cm?.trend ?? null, f.cmTrend)) return false;
    if (!inRange(cm?.avg ?? null, f.cmAvg)) return false;
    if (!inRange(cm?.avg1 ?? null, f.cmAvg1)) return false;
    if (!inRange(cm?.avg7 ?? null, f.cmAvg7)) return false;
    if (!inRange(cm?.avg30 ?? null, f.cmAvg30)) return false;
    if (!inRange(cm?.lowHolo ?? null, f.cmLowHolo)) return false;
    if (!inRange(cm?.trendHolo ?? null, f.cmTrendHolo)) return false;
    if (!inRange(cm?.avgHolo ?? null, f.cmAvgHolo)) return false;
    if (!inRange(cm?.avg1Holo ?? null, f.cmAvg1Holo)) return false;
    if (!inRange(cm?.avg7Holo ?? null, f.cmAvg7Holo)) return false;
    if (!inRange(cm?.avg30Holo ?? null, f.cmAvg30Holo)) return false;

    if (lang === 'en') {
      if (!inRange(tpMarket(c), f.tpMarket)) return false;
      if (!inRange(tpField(c, (r) => r.lowPrice), f.tpLow)) return false;
      if (!inRange(tpField(c, (r) => r.midPrice), f.tpMid)) return false;
      if (!inRange(tpField(c, (r) => r.highPrice), f.tpHigh)) return false;
    }

    return true;
  });
}

export function sortTcgCards(cards: TcgCardSummary[], sort: TcgFilterState['sort'], lang: Lang): TcgCardSummary[] {
  const out = [...cards];
  const price = (c: TcgCardSummary) => tcgBestMarketPrice(c, lang);
  out.sort((a, b) => {
    switch (sort) {
      case 'price-asc': {
        const pa = price(a);
        const pb = price(b);
        if (pa == null && pb == null) return 0;
        if (pa == null) return 1;
        if (pb == null) return -1;
        return pa - pb;
      }
      case 'price-desc': {
        const pa = price(a);
        const pb = price(b);
        if (pa == null && pb == null) return 0;
        if (pa == null) return 1;
        if (pb == null) return -1;
        return pb - pa;
      }
      case 'set':
        return a.setName.localeCompare(b.setName, lang) || Number(a.localId) - Number(b.localId);
      case 'number':
        return Number(a.localId) - Number(b.localId) || a.setName.localeCompare(b.setName, lang);
      case 'name':
        return a.name.localeCompare(b.name, lang);
      case 'rarity':
        return (a.rarity ?? '').localeCompare(b.rarity ?? '', lang);
      case 'release':
      default:
        return (b.releaseDate ?? '').localeCompare(a.releaseDate ?? '') || a.name.localeCompare(b.name, lang);
    }
  });
  return out;
}

let fuseCache: WeakMap<TcgCardSummary[], Fuse<TcgCardSummary>> = new WeakMap();

export function searchTcgCards(cards: TcgCardSummary[], q: string): TcgCardSummary[] {
  const needle = q.trim();
  if (!needle) return cards;
  let fuse = fuseCache.get(cards);
  if (!fuse) {
    fuse = new Fuse(cards, {
      keys: ['name', 'setName', 'localId', 'rarity', 'illustrator', 'types'],
      threshold: 0.35,
      ignoreLocation: true,
    });
    fuseCache.set(cards, fuse);
  }
  return fuse.search(needle).map((r) => r.item);
}

export function queryTcgCards(cards: TcgCardSummary[], f: TcgFilterState, lang: Lang, dexScope?: number): TcgCardSummary[] {
  const searched = searchTcgCards(cards, f.q);
  const filtered = filterTcgCards(searched, f, lang, dexScope);
  return sortTcgCards(filtered, f.sort, lang);
}

export function tcgFacets(cards: TcgCardSummary[]) {
  const sets = new Map<string, string>();
  const series = new Map<string, string>();
  const rarities = new Set<string>();
  const categories = new Set<string>();
  const stages = new Set<string>();
  const types = new Set<string>();
  const illustrators = new Set<string>();
  const regulationMarks = new Set<string>();

  for (const c of cards) {
    sets.set(c.setId, c.setName);
    if (c.seriesId && c.seriesName) series.set(c.seriesId, c.seriesName);
    if (c.rarity) rarities.add(c.rarity);
    if (c.category) categories.add(c.category);
    if (c.stage) stages.add(c.stage);
    c.types?.forEach((t) => types.add(t));
    if (c.illustrator) illustrators.add(c.illustrator);
    if (c.regulationMark) regulationMarks.add(c.regulationMark);
  }

  return {
    sets: [...sets.entries()].sort((a, b) => a[1].localeCompare(b[1])),
    series: [...series.entries()].sort((a, b) => a[1].localeCompare(b[1])),
    rarities: [...rarities].sort(),
    categories: [...categories].sort(),
    stages: [...stages].sort(),
    types: [...types].sort(),
    illustrators: [...illustrators].sort(),
    regulationMarks: [...regulationMarks].sort(),
  };
}

export { cmField };
