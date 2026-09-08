/* Stats-band counters — prerender-safe finals (home.md §7).
 * First HTML must already show 1025 / 18 / 9 / 10000+, never a 0 start. */

export const STATS_BAND = [
  { target: 1025, labelKey: 'home.statsband.pokemon' },
  { target: 18, labelKey: 'home.statsband.types' },
  { target: 9, labelKey: 'home.statsband.generations' },
  { target: 10000, labelKey: 'home.statsband.sprites', suffix: '+' },
] as const;

export type StatsBandLang = 'en' | 'de';

export function formatStatsBandValue(value: number, lang: StatsBandLang, suffix = ''): string {
  return `${value.toLocaleString(lang === 'de' ? 'de-DE' : 'en-US')}${suffix}`;
}

/** Values written into the first HTML (SSR / prerender). Never starts at 0. */
export function statsBandInitialText(lang: StatsBandLang): string[] {
  return STATS_BAND.map((s) => formatStatsBandValue(s.target, lang, 'suffix' in s ? s.suffix : ''));
}
