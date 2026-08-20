/* TCG filter URL sync — parse/build search params. */
import type { TcgDensity, TcgFilterState, TcgPriceRange, TcgSortKey } from './tcg-types';
import { DEFAULT_TCG_FILTERS } from './tcg-types';

const SORTS = new Set<TcgSortKey>(['price-asc', 'price-desc', 'set', 'number', 'name', 'release', 'rarity']);
const DENSITIES = new Set<TcgDensity>(['compact', 'list']);

function num(v: string | null): number | null {
  if (v == null || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function range(prefix: string, params: URLSearchParams): TcgPriceRange {
  return { min: num(params.get(`${prefix}Min`)), max: num(params.get(`${prefix}Max`)) };
}

function setRange(params: URLSearchParams, prefix: string, r: TcgPriceRange) {
  if (r.min != null) params.set(`${prefix}Min`, String(r.min));
  if (r.max != null) params.set(`${prefix}Max`, String(r.max));
}

export function parseTcgParams(params: URLSearchParams): TcgFilterState {
  const sort = params.get('sort') as TcgSortKey | null;
  const density = params.get('density') as TcgDensity | null;
  return {
    ...DEFAULT_TCG_FILTERS,
    q: params.get('q') ?? '',
    setId: params.get('set') || null,
    seriesId: params.get('series') || null,
    rarities: params.getAll('rarity'),
    category: params.get('cat') || null,
    stages: params.getAll('stage'),
    types: params.getAll('type'),
    hpMin: num(params.get('hpMin')),
    hpMax: num(params.get('hpMax')),
    variantNormal: params.get('vn') === '1',
    variantHolo: params.get('vh') === '1',
    variantReverse: params.get('vr') === '1',
    variantFirstEdition: params.get('vfe') === '1',
    regulationMark: params.get('reg') || null,
    legalStandard: params.get('std') === '1',
    legalExpanded: params.get('exp') === '1',
    illustrator: params.get('art') || null,
    dexId: num(params.get('dex')),
    cmLow: range('cmL', params),
    cmTrend: range('cmT', params),
    cmAvg: range('cmA', params),
    cmAvg1: range('cm1', params),
    cmAvg7: range('cm7', params),
    cmAvg30: range('cm30', params),
    cmLowHolo: range('cmLh', params),
    cmTrendHolo: range('cmTh', params),
    cmAvgHolo: range('cmAh', params),
    cmAvg1Holo: range('cm1h', params),
    cmAvg7Holo: range('cm7h', params),
    cmAvg30Holo: range('cm30h', params),
    tpMarket: range('tpM', params),
    tpLow: range('tpL', params),
    tpMid: range('tpMd', params),
    tpHigh: range('tpH', params),
    sort: sort && SORTS.has(sort) ? sort : DEFAULT_TCG_FILTERS.sort,
    density: density && DENSITIES.has(density) ? density : DEFAULT_TCG_FILTERS.density,
  };
}

export function buildTcgParams(f: TcgFilterState): URLSearchParams {
  const p = new URLSearchParams();
  if (f.q.trim()) p.set('q', f.q.trim());
  if (f.setId) p.set('set', f.setId);
  if (f.seriesId) p.set('series', f.seriesId);
  f.rarities.forEach((r) => p.append('rarity', r));
  if (f.category) p.set('cat', f.category);
  f.stages.forEach((s) => p.append('stage', s));
  f.types.forEach((t) => p.append('type', t));
  if (f.hpMin != null) p.set('hpMin', String(f.hpMin));
  if (f.hpMax != null) p.set('hpMax', String(f.hpMax));
  if (f.variantNormal) p.set('vn', '1');
  if (f.variantHolo) p.set('vh', '1');
  if (f.variantReverse) p.set('vr', '1');
  if (f.variantFirstEdition) p.set('vfe', '1');
  if (f.regulationMark) p.set('reg', f.regulationMark);
  if (f.legalStandard) p.set('std', '1');
  if (f.legalExpanded) p.set('exp', '1');
  if (f.illustrator) p.set('art', f.illustrator);
  if (f.dexId != null) p.set('dex', String(f.dexId));
  setRange(p, 'cmL', f.cmLow);
  setRange(p, 'cmT', f.cmTrend);
  setRange(p, 'cmA', f.cmAvg);
  setRange(p, 'cm1', f.cmAvg1);
  setRange(p, 'cm7', f.cmAvg7);
  setRange(p, 'cm30', f.cmAvg30);
  setRange(p, 'cmLh', f.cmLowHolo);
  setRange(p, 'cmTh', f.cmTrendHolo);
  setRange(p, 'cmAh', f.cmAvgHolo);
  setRange(p, 'cm1h', f.cmAvg1Holo);
  setRange(p, 'cm7h', f.cmAvg7Holo);
  setRange(p, 'cm30h', f.cmAvg30Holo);
  setRange(p, 'tpM', f.tpMarket);
  setRange(p, 'tpL', f.tpLow);
  setRange(p, 'tpMd', f.tpMid);
  setRange(p, 'tpH', f.tpHigh);
  if (f.sort !== DEFAULT_TCG_FILTERS.sort) p.set('sort', f.sort);
  if (f.density !== DEFAULT_TCG_FILTERS.density) p.set('density', f.density);
  return p;
}

export function tcgFilterActiveCount(f: TcgFilterState): number {
  let n = 0;
  if (f.setId) n++;
  if (f.seriesId) n++;
  if (f.rarities.length) n++;
  if (f.category) n++;
  if (f.stages.length) n++;
  if (f.types.length) n++;
  if (f.hpMin != null || f.hpMax != null) n++;
  if (f.variantNormal || f.variantHolo || f.variantReverse || f.variantFirstEdition) n++;
  if (f.regulationMark) n++;
  if (f.legalStandard || f.legalExpanded) n++;
  if (f.illustrator) n++;
  if (f.dexId != null) n++;
  const ranges = [
    f.cmLow, f.cmTrend, f.cmAvg, f.cmAvg1, f.cmAvg7, f.cmAvg30,
    f.cmLowHolo, f.cmTrendHolo, f.cmAvgHolo, f.cmAvg1Holo, f.cmAvg7Holo, f.cmAvg30Holo,
    f.tpMarket, f.tpLow, f.tpMid, f.tpHigh,
  ];
  for (const r of ranges) {
    if (r.min != null || r.max != null) n++;
  }
  return n;
}

export interface TcgFilterChip {
  key: string;
  label: string;
  clear: (f: TcgFilterState) => TcgFilterState;
}

function fmtRange(r: TcgPriceRange, unit: string): string {
  if (r.min != null && r.max != null) return `${r.min}–${r.max}${unit}`;
  if (r.min != null) return `≥${r.min}${unit}`;
  if (r.max != null) return `≤${r.max}${unit}`;
  return '';
}


export function buildTcgFilterChips(
  f: TcgFilterState,
  facets: {
    sets: [string, string][];
    series: [string, string][];
  },
  t: (k: string, o?: Record<string, unknown>) => string,
  lang: 'de' | 'en',
  showDexFilter: boolean,
): TcgFilterChip[] {
  const chips: TcgFilterChip[] = [];
  const eur = lang === 'de' ? '€' : '€';
  const usd = '$';

  if (f.setId) {
    const name = facets.sets.find(([id]) => id === f.setId)?.[1] ?? f.setId;
    chips.push({ key: 'set', label: name, clear: (s) => ({ ...s, setId: null }) });
  }
  if (f.seriesId) {
    const name = facets.series.find(([id]) => id === f.seriesId)?.[1] ?? f.seriesId;
    chips.push({ key: 'series', label: name, clear: (s) => ({ ...s, seriesId: null }) });
  }
  f.rarities.forEach((r) =>
    chips.push({
      key: `r-${r}`,
      label: r,
      clear: (s) => ({ ...s, rarities: s.rarities.filter((x) => x !== r) }),
    }),
  );
  if (f.category) chips.push({ key: 'cat', label: f.category, clear: (s) => ({ ...s, category: null }) });
  f.stages.forEach((st) =>
    chips.push({ key: `st-${st}`, label: st, clear: (s) => ({ ...s, stages: s.stages.filter((x) => x !== st) }) }),
  );
  f.types.forEach((ty) =>
    chips.push({ key: `ty-${ty}`, label: ty, clear: (s) => ({ ...s, types: s.types.filter((x) => x !== ty) }) }),
  );
  if (f.hpMin != null || f.hpMax != null) {
    const hp = f.hpMin != null && f.hpMax != null ? `${f.hpMin}–${f.hpMax}` : f.hpMin ?? f.hpMax;
    chips.push({ key: 'hp', label: `${t('tcg.filter.hp')} ${hp}`, clear: (s) => ({ ...s, hpMin: null, hpMax: null }) });
  }
  if (f.variantNormal) chips.push({ key: 'vn', label: t('tcg.filter.vn'), clear: (s) => ({ ...s, variantNormal: false }) });
  if (f.variantHolo) chips.push({ key: 'vh', label: t('tcg.filter.vh'), clear: (s) => ({ ...s, variantHolo: false }) });
  if (f.variantReverse) chips.push({ key: 'vr', label: t('tcg.filter.vr'), clear: (s) => ({ ...s, variantReverse: false }) });
  if (f.variantFirstEdition) chips.push({ key: 'vfe', label: t('tcg.filter.vfe'), clear: (s) => ({ ...s, variantFirstEdition: false }) });
  if (f.regulationMark) chips.push({ key: 'reg', label: f.regulationMark, clear: (s) => ({ ...s, regulationMark: null }) });
  if (f.legalStandard) chips.push({ key: 'std', label: t('tcg.filter.std'), clear: (s) => ({ ...s, legalStandard: false }) });
  if (f.legalExpanded) chips.push({ key: 'exp', label: t('tcg.filter.exp'), clear: (s) => ({ ...s, legalExpanded: false }) });
  if (f.illustrator) chips.push({ key: 'art', label: f.illustrator, clear: (s) => ({ ...s, illustrator: null }) });
  if (f.dexId != null && showDexFilter) {
    chips.push({ key: 'dex', label: `#${f.dexId}`, clear: (s) => ({ ...s, dexId: null }) });
  }

  const cmRanges: Array<[keyof TcgFilterState, string, string]> = [
    ['cmLow', t('tcg.prices.low'), eur],
    ['cmTrend', t('tcg.prices.trend'), eur],
    ['cmAvg', t('tcg.prices.avg'), eur],
    ['cmAvg1', t('tcg.prices.avg1'), eur],
    ['cmAvg7', t('tcg.prices.avg7'), eur],
    ['cmAvg30', t('tcg.prices.avg30'), eur],
    ['cmLowHolo', t('tcg.prices.lowHolo'), eur],
    ['cmTrendHolo', t('tcg.prices.trendHolo'), eur],
    ['cmAvgHolo', t('tcg.prices.avgHolo'), eur],
    ['cmAvg1Holo', t('tcg.prices.avg1Holo'), eur],
    ['cmAvg7Holo', t('tcg.prices.avg7Holo'), eur],
    ['cmAvg30Holo', t('tcg.prices.avg30Holo'), eur],
  ];
  for (const [key, label, unit] of cmRanges) {
    const r = f[key] as TcgPriceRange;
    if (r.min != null || r.max != null) {
      chips.push({
        key: String(key),
        label: `${label} ${fmtRange(r, unit)}`,
        clear: (s) => ({ ...s, [key]: {} }),
      });
    }
  }

  if (lang === 'en') {
    const tpRanges: Array<[keyof TcgFilterState, string]> = [
      ['tpMarket', t('tcg.prices.market')],
      ['tpLow', t('tcg.prices.low')],
      ['tpMid', t('tcg.prices.mid')],
      ['tpHigh', t('tcg.prices.high')],
    ];
    for (const [key, label] of tpRanges) {
      const r = f[key] as TcgPriceRange;
      if (r.min != null || r.max != null) {
        chips.push({
          key: String(key),
          label: `${label} ${fmtRange(r, usd)}`,
          clear: (s) => ({ ...s, [key]: {} }),
        });
      }
    }
  }

  return chips;
}
