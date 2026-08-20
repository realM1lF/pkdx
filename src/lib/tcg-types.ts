/* TCG catalog types — TCGdex index summaries (build-time artifact). */

export interface TcgCardVariants {
  normal: boolean;
  holo: boolean;
  reverse: boolean;
  firstEdition: boolean;
}

export interface TcgCardmarketPrices {
  idProduct?: number;
  updated?: string;
  unit?: string;
  avg?: number | null;
  low?: number | null;
  trend?: number | null;
  avg1?: number | null;
  avg7?: number | null;
  avg30?: number | null;
  avgHolo?: number | null;
  lowHolo?: number | null;
  trendHolo?: number | null;
  avg1Holo?: number | null;
  avg7Holo?: number | null;
  avg30Holo?: number | null;
}

export interface TcgTcgplayerPriceRow {
  productId?: number;
  lowPrice?: number | null;
  midPrice?: number | null;
  highPrice?: number | null;
  marketPrice?: number | null;
  directLowPrice?: number | null;
}

export interface TcgTcgplayerPrices {
  updated?: string;
  unit?: string;
  normal?: TcgTcgplayerPriceRow;
  holofoil?: TcgTcgplayerPriceRow;
  reverseHolofoil?: TcgTcgplayerPriceRow;
  '1stEdition'?: TcgTcgplayerPriceRow;
  '1stEditionHolofoil'?: TcgTcgplayerPriceRow;
}

export interface TcgCardLegal {
  standard?: boolean;
  expanded?: boolean;
}

export interface TcgCardSummary {
  id: string;
  name: string;
  localId: string;
  setId: string;
  setName: string;
  seriesId?: string;
  seriesName?: string;
  releaseDate?: string;
  rarity?: string;
  category?: string;
  dexIds?: number[];
  hp?: number;
  types?: string[];
  stage?: string;
  illustrator?: string;
  variants: TcgCardVariants;
  regulationMark?: string;
  legal?: TcgCardLegal;
  imageBase?: string;
  pricing: {
    cardmarket?: TcgCardmarketPrices;
    tcgplayer?: TcgTcgplayerPrices;
  };
  updatedAt?: string;
}

export interface TcgCatalogMeta {
  builtAt: string;
  lang: 'de' | 'en';
  count: number;
}

export interface TcgCatalogArtifact {
  meta: TcgCatalogMeta;
  cards: TcgCardSummary[];
}

export type TcgDensity = 'compact' | 'list';

export type TcgSortKey =
  | 'price-asc'
  | 'price-desc'
  | 'set'
  | 'number'
  | 'name'
  | 'release'
  | 'rarity';

export interface TcgPriceRange {
  min?: number | null;
  max?: number | null;
}

export interface TcgFilterState {
  q: string;
  setId: string | null;
  seriesId: string | null;
  rarities: string[];
  category: string | null;
  stages: string[];
  types: string[];
  hpMin: number | null;
  hpMax: number | null;
  variantNormal: boolean;
  variantHolo: boolean;
  variantReverse: boolean;
  variantFirstEdition: boolean;
  regulationMark: string | null;
  legalStandard: boolean;
  legalExpanded: boolean;
  illustrator: string | null;
  dexId: number | null;
  cmLow: TcgPriceRange;
  cmTrend: TcgPriceRange;
  cmAvg: TcgPriceRange;
  cmAvg1: TcgPriceRange;
  cmAvg7: TcgPriceRange;
  cmAvg30: TcgPriceRange;
  cmLowHolo: TcgPriceRange;
  cmTrendHolo: TcgPriceRange;
  cmAvgHolo: TcgPriceRange;
  cmAvg1Holo: TcgPriceRange;
  cmAvg7Holo: TcgPriceRange;
  cmAvg30Holo: TcgPriceRange;
  tpMarket: TcgPriceRange;
  tpLow: TcgPriceRange;
  tpMid: TcgPriceRange;
  tpHigh: TcgPriceRange;
  sort: TcgSortKey;
  density: TcgDensity;
}

export const DEFAULT_TCG_FILTERS: TcgFilterState = {
  q: '',
  setId: null,
  seriesId: null,
  rarities: [],
  category: null,
  stages: [],
  types: [],
  hpMin: null,
  hpMax: null,
  variantNormal: false,
  variantHolo: false,
  variantReverse: false,
  variantFirstEdition: false,
  regulationMark: null,
  legalStandard: false,
  legalExpanded: false,
  illustrator: null,
  dexId: null,
  cmLow: {},
  cmTrend: {},
  cmAvg: {},
  cmAvg1: {},
  cmAvg7: {},
  cmAvg30: {},
  cmLowHolo: {},
  cmTrendHolo: {},
  cmAvgHolo: {},
  cmAvg1Holo: {},
  cmAvg7Holo: {},
  cmAvg30Holo: {},
  tpMarket: {},
  tpLow: {},
  tpMid: {},
  tpHigh: {},
  sort: 'release',
  density: 'compact',
};

/** Primary display price — CM low (DE) or TCGPlayer market (EN). */
export function tcgPrimaryPrice(card: TcgCardSummary, lang: 'de' | 'en'): number | null {
  if (lang === 'en') {
    const tp = card.pricing.tcgplayer;
    const row = tp?.holofoil ?? tp?.reverseHolofoil ?? tp?.normal ?? tp?.['1stEditionHolofoil'] ?? tp?.['1stEdition'];
    return row?.marketPrice ?? row?.midPrice ?? row?.lowPrice ?? null;
  }
  const cm = card.pricing.cardmarket;
  if (!cm) return null;
  return cm.low ?? cm.trend ?? cm.avg ?? cm.avg30 ?? cm.lowHolo ?? cm.trendHolo ?? null;
}

/** Secondary prices for tile subtitle. */
export function tcgSecondaryPrices(card: TcgCardSummary, lang: 'de' | 'en'): { a: number | null; b: number | null } {
  if (lang === 'en') {
    const tp = card.pricing.tcgplayer;
    const row = tp?.holofoil ?? tp?.reverseHolofoil ?? tp?.normal;
    return { a: row?.lowPrice ?? null, b: row?.directLowPrice ?? row?.midPrice ?? null };
  }
  const cm = card.pricing.cardmarket;
  return { a: cm?.trend ?? null, b: cm?.avg30 ?? null };
}

export function tcgImageUrl(imageBase: string | undefined, quality: 'high' | 'low' = 'high'): string | undefined {
  if (!imageBase) return undefined;
  return `${imageBase}/${quality === 'high' ? 'high.webp' : 'low.png'}`;
}

/** Fallback chain when TCGdex omits image (common for older DE entries). */
export function tcgImageCandidates(card: TcgCardSummary, lang: 'de' | 'en', preferLow = false): string[] {
  const out: string[] = [];
  const addBase = (base?: string) => {
    if (!base) return;
    if (preferLow) {
      out.push(`${base}/low.png`, `${base}/high.webp`);
    } else {
      out.push(`${base}/high.webp`, `${base}/low.png`);
    }
  };
  addBase(card.imageBase);
  if (card.seriesId && card.setId && card.localId) {
    if (lang === 'de') addBase(`https://assets.tcgdex.net/en/${card.seriesId}/${card.setId}/${card.localId}`);
    addBase(`https://assets.tcgdex.net/${lang}/${card.seriesId}/${card.setId}/${card.localId}`);
  }
  const ids = [card.localId, card.localId.replace(/^0+/, '') || card.localId];
  for (const lid of [...new Set(ids)]) {
    if (preferLow) {
      out.push(
        `https://images.pokemontcg.io/${card.setId}/${lid}.png`,
        `https://images.pokemontcg.io/${card.setId}/${lid}_hires.png`,
      );
    } else {
      out.push(
        `https://images.pokemontcg.io/${card.setId}/${lid}_hires.png`,
        `https://images.pokemontcg.io/${card.setId}/${lid}.png`,
      );
    }
  }
  return [...new Set(out)];
}

/** Highest current market listing across normal + holo (Cardmarket or TCGPlayer). */
export function tcgBestMarketPrice(card: TcgCardSummary, lang: 'de' | 'en'): number | null {
  if (lang === 'en') {
    const tp = card.pricing.tcgplayer;
    if (!tp) return null;
    const rows = [tp.normal, tp.holofoil, tp.reverseHolofoil, tp['1stEdition'], tp['1stEditionHolofoil']].filter(Boolean);
    let best: number | null = null;
    for (const row of rows) {
      for (const v of [row!.marketPrice, row!.midPrice, row!.highPrice, row!.lowPrice]) {
        if (v != null && (best == null || v > best)) best = v;
      }
    }
    return best;
  }
  const cm = card.pricing.cardmarket;
  if (!cm) return null;
  const vals = [cm.low, cm.lowHolo, cm.trend, cm.trendHolo, cm.avg, cm.avg30, cm.avgHolo, cm.avg30Holo].filter(
    (v): v is number => v != null,
  );
  return vals.length ? Math.max(...vals) : null;
}

export function tcgCardmarketUrl(idProduct?: number, lang: 'de' | 'en' = 'de'): string | undefined {
  if (!idProduct) return undefined;
  const loc = lang === 'de' ? 'de' : 'en';
  return `https://www.cardmarket.com/${loc}/Pokemon/Products/Singles?idProduct=${idProduct}`;
}

export function tcgTcgplayerUrl(productId?: number): string | undefined {
  if (!productId) return undefined;
  return `https://www.tcgplayer.com/product/${productId}`;
}
