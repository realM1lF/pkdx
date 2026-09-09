import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import de from '@/i18n/locales/de/translation.json';
import en from '@/i18n/locales/en/translation.json';

function flattenKeys(value: unknown, prefix = ''): string[] {
  if (!value || typeof value !== 'object') return [prefix];
  return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) =>
    flattenKeys(child, prefix ? `${prefix}.${key}` : key),
  );
}

function allText(value: unknown): string {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.map(allText).join('\n');
  if (value && typeof value === 'object') {
    return Object.values(value).map(allText).join('\n');
  }
  return '';
}

describe('privacy + support copy after Plausible removal', () => {
  it('keeps announce and privacy keys in locale parity', () => {
    expect(flattenKeys(de.announce).sort()).toEqual(flattenKeys(en.announce).sort());
    expect(flattenKeys(de.legal.privacy).sort()).toEqual(flattenKeys(en.legal.privacy).sort());
  });

  it('drops Plausible from legal and support strings', () => {
    const deText = `${allText(de.legal.privacy)}\n${de.support.p3}`;
    const enText = `${allText(en.legal.privacy)}\n${en.support.p3}`;
    expect(deText).not.toMatch(/plausible/i);
    expect(enText).not.toMatch(/plausible/i);
  });

  it('names Search Console and says no cookie banner is required', () => {
    const deText = allText(de.legal.privacy);
    const enText = allText(en.legal.privacy);
    expect(deText).toMatch(/Google Search Console/);
    expect(enText).toMatch(/Google Search Console/);
    expect(deText).toMatch(/Cookie-Banner ist dafür nicht nötig/);
    expect(enText).toMatch(/No cookie-banner consent is required/);
    expect(deText).toMatch(/Weder Google Analytics/);
    expect(enText).toMatch(/No Google Analytics/);
  });

  it('keeps GSC verification meta in index.html and has no Plausible scripts', () => {
    const html = readFileSync(new URL('../../../index.html', import.meta.url), 'utf8');
    expect(html).toContain('google-site-verification');
    expect(html).toContain('announce-init.js');
    expect(html).not.toMatch(/plausible/i);
  });
});
