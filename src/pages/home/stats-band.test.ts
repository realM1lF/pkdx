import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { STATS_BAND, formatStatsBandValue, statsBandInitialText } from './stats-band';

const statsBandSource = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), 'StatsBand.tsx'),
  'utf8',
);

describe('statsBandInitialText', () => {
  it('ships the final counters, never a 0 start', () => {
    expect(STATS_BAND.map((s) => s.target)).toEqual([1025, 18, 9, 10000]);
    expect(statsBandInitialText('en')).toEqual(['1,025', '18', '9', '10,000+']);
    expect(statsBandInitialText('de')).toEqual(['1.025', '18', '9', '10.000+']);
    for (const text of [...statsBandInitialText('en'), ...statsBandInitialText('de')]) {
      expect(text).not.toMatch(/^0\+?$/);
    }
  });

  it('formats a single value with locale separators', () => {
    expect(formatStatsBandValue(0, 'en')).toBe('0');
    expect(formatStatsBandValue(1025, 'en')).toBe('1,025');
    expect(formatStatsBandValue(1025, 'de')).toBe('1.025');
    expect(formatStatsBandValue(10000, 'en', '+')).toBe('10,000+');
  });

  it('does not initialize counters from 0 in StatsBand.tsx', () => {
    expect(statsBandSource).toContain('formatStatsBandValue(s.target');
    expect(statsBandSource).not.toMatch(/format\(0\)/);
    expect(statsBandSource).not.toMatch(/useState\(\s*format/);
  });
});
