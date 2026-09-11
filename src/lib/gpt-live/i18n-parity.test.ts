import { describe, expect, it } from 'vitest';
import de from '@/i18n/locales/de/translation.json';
import en from '@/i18n/locales/en/translation.json';

function keys(value: unknown, prefix = ''): string[] {
  if (!value || typeof value !== 'object') return [prefix];
  return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) =>
    keys(child, prefix ? `${prefix}.${key}` : key),
  );
}

describe('voiceDemo locale parity', () => {
  it('keeps the same keys in EN and DE', () => {
    expect(keys(de.voiceDemo).sort()).toEqual(keys(en.voiceDemo).sort());
    expect(de.nav.voiceDemo).toBeTruthy();
    expect(en.nav.voiceDemo).toBeTruthy();
  });

  it('avoids du-form in German copy', () => {
    const blob = JSON.stringify(de.voiceDemo);
    expect(blob).not.toMatch(/\b[Dd]u\b/);
    expect(blob).not.toMatch(/\b[Dd]ein/);
  });
});
