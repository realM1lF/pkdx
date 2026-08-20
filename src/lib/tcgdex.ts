/* TCGdex runtime client — detail refresh for modal (index is build-time). */
import type { TcgCardSummary } from './tcg-types';

const API = 'https://api.tcgdex.net/v2';

function pickCm(raw: Record<string, unknown> | undefined) {
  if (!raw) return undefined;
  return {
    idProduct: raw.idProduct as number | undefined,
    updated: raw.updated as string | undefined,
    unit: raw.unit as string | undefined,
    avg: (raw.avg as number | null) ?? null,
    low: (raw.low as number | null) ?? null,
    trend: (raw.trend as number | null) ?? null,
    avg1: (raw.avg1 as number | null) ?? null,
    avg7: (raw.avg7 as number | null) ?? null,
    avg30: (raw.avg30 as number | null) ?? null,
    avgHolo: (raw['avg-holo'] as number | null) ?? null,
    lowHolo: (raw['low-holo'] as number | null) ?? null,
    trendHolo: (raw['trend-holo'] as number | null) ?? null,
    avg1Holo: (raw['avg1-holo'] as number | null) ?? null,
    avg7Holo: (raw['avg7-holo'] as number | null) ?? null,
    avg30Holo: (raw['avg30-holo'] as number | null) ?? null,
  };
}

function pickTpRow(row: Record<string, unknown> | undefined) {
  if (!row) return undefined;
  return {
    productId: row.productId as number | undefined,
    lowPrice: (row.lowPrice as number | null) ?? null,
    midPrice: (row.midPrice as number | null) ?? null,
    highPrice: (row.highPrice as number | null) ?? null,
    marketPrice: (row.marketPrice as number | null) ?? null,
    directLowPrice: (row.directLowPrice as number | null) ?? null,
  };
}

function pickTp(raw: Record<string, unknown> | undefined) {
  if (!raw) return undefined;
  const out: NonNullable<TcgCardSummary['pricing']['tcgplayer']> = {
    updated: raw.updated as string | undefined,
    unit: raw.unit as string | undefined,
  };
  for (const key of ['normal', 'holofoil', 'reverseHolofoil', '1stEdition', '1stEditionHolofoil'] as const) {
    const row = pickTpRow(raw[key] as Record<string, unknown> | undefined);
    if (row) out[key] = row;
  }
  return out;
}

export async function fetchTcgCardDetail(lang: 'de' | 'en', id: string): Promise<TcgCardSummary | null> {
  try {
    const res = await fetch(`${API}/${lang}/cards/${id}`);
    if (!res.ok) return null;
    const card = await res.json();
    const v = card.variants ?? {};
    let cm = pickCm(card.pricing?.cardmarket);
    let tp = pickTp(card.pricing?.tcgplayer);
    for (const vd of card.variants_detailed ?? []) {
      cm = cm ?? pickCm(vd.pricing?.cardmarket);
      tp = tp ?? pickTp(vd.pricing?.tcgplayer);
    }
    const dexIds = Array.isArray(card.dexId) ? card.dexId : card.dexId != null ? [card.dexId] : undefined;
    return {
      id: card.id,
      name: card.name,
      localId: String(card.localId ?? ''),
      setId: card.set?.id ?? '',
      setName: card.set?.name ?? '',
      seriesId: card.set?.serie?.id,
      seriesName: card.set?.serie?.name,
      rarity: card.rarity,
      category: card.category,
      dexIds: dexIds?.length ? dexIds : undefined,
      hp: card.hp,
      types: card.types,
      stage: card.stage,
      illustrator: card.illustrator,
      variants: {
        normal: !!v.normal,
        holo: !!v.holo,
        reverse: !!v.reverse,
        firstEdition: !!v.firstEdition,
      },
      regulationMark: card.regulationMark,
      legal: card.legal,
      imageBase: card.image,
      pricing: { cardmarket: cm, tcgplayer: tp },
      updatedAt: cm?.updated ?? tp?.updated ?? card.updated,
    };
  } catch {
    return null;
  }
}

let catalogPromise: Partial<Record<'de' | 'en', Promise<import('./tcg-types').TcgCatalogArtifact>>> = {};

export function loadTcgCatalog(lang: 'de' | 'en') {
  if (!catalogPromise[lang]) {
    catalogPromise[lang] = import(`@/data/tcg/index.${lang}.json`).then((m) => m.default as import('./tcg-types').TcgCatalogArtifact);
  }
  return catalogPromise[lang]!;
}

export function clearTcgCatalogCache() {
  catalogPromise = {};
}
