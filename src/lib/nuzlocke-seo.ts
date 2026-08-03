export type NuzlockeSeoSlug =
  | 'soul-link'
  | 'firered'
  | 'emerald'
  | 'platinum'
  | 'heartgold'
  | 'black-white';

export interface NuzlockeSeoPage {
  slug: NuzlockeSeoSlug;
  /** Atlas region ID, or null for the cross-region Soul Link format. */
  regionId: 'kanto' | 'johto' | 'hoenn' | 'sinnoh' | 'unova' | null;
  mapPath: string | null;
  wizardQuery: string;
  primaryKeywordEn: string;
  primaryKeywordDe: string;
}

export const NUZLOCKE_SEO_PAGES: readonly NuzlockeSeoPage[] = [
  {
    slug: 'soul-link',
    regionId: null,
    mapPath: null,
    wizardQuery: 'wizard=1',
    primaryKeywordEn: 'Soul Link Nuzlocke',
    primaryKeywordDe: 'Soul-Link-Nuzlocke',
  },
  {
    slug: 'firered',
    regionId: 'kanto',
    mapPath: '/maps/kanto',
    wizardQuery: 'wizard=1&region=kanto',
    primaryKeywordEn: 'FireRed Nuzlocke',
    primaryKeywordDe: 'Feuerrot-Nuzlocke',
  },
  {
    slug: 'emerald',
    regionId: 'hoenn',
    mapPath: '/maps/hoenn',
    wizardQuery: 'wizard=1&region=hoenn',
    primaryKeywordEn: 'Emerald Nuzlocke',
    primaryKeywordDe: 'Smaragd-Nuzlocke',
  },
  {
    slug: 'platinum',
    regionId: 'sinnoh',
    mapPath: '/maps/sinnoh',
    wizardQuery: 'wizard=1&region=sinnoh',
    primaryKeywordEn: 'Platinum Nuzlocke',
    primaryKeywordDe: 'Platin-Nuzlocke',
  },
  {
    slug: 'heartgold',
    regionId: 'johto',
    mapPath: '/maps/johto',
    wizardQuery: 'wizard=1&region=johto',
    primaryKeywordEn: 'HeartGold Nuzlocke',
    primaryKeywordDe: 'HeartGold-Nuzlocke',
  },
  {
    slug: 'black-white',
    regionId: 'unova',
    mapPath: '/maps/unova',
    wizardQuery: 'wizard=1&region=unova',
    primaryKeywordEn: 'Black & White Nuzlocke',
    primaryKeywordDe: 'Schwarz/Weiß-Nuzlocke',
  },
] as const;

export const NUZLOCKE_SEO_SLUGS: readonly NuzlockeSeoSlug[] = NUZLOCKE_SEO_PAGES.map((page) => page.slug);

export function isNuzlockeSeoSlug(slug: string): slug is NuzlockeSeoSlug {
  return NUZLOCKE_SEO_SLUGS.includes(slug as NuzlockeSeoSlug);
}

export function nuzlockeSeoPath(slug: NuzlockeSeoSlug): string {
  return `/nuzlocke/${slug}`;
}
