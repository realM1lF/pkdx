import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import de from '@/i18n/locales/de/translation.json';
import en from '@/i18n/locales/en/translation.json';

const teamBuilderSource = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), '..', 'TeamBuilder.tsx'),
  'utf8',
);

function flattenKeys(value: unknown, prefix = ''): string[] {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) =>
      flattenKeys(child, prefix ? `${prefix}.${key}` : key),
    );
  }
  return [prefix];
}

function collectStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (value && typeof value === 'object') {
    return Object.values(value as Record<string, unknown>).flatMap(collectStrings);
  }
  return [];
}

describe('team hub SEO copy keys', () => {
  it('exists in EN and DE with the same key tree', () => {
    expect(en.tb.seo).toBeDefined();
    expect(de.tb.seo).toBeDefined();
    expect(flattenKeys(de.tb.seo).sort()).toEqual(flattenKeys(en.tb.seo).sort());
  });

  it('keeps every hub copy string non-empty', () => {
    for (const text of [...collectStrings(en.tb.seo), ...collectStrings(de.tb.seo)]) {
      expect(text.trim().length).toBeGreaterThan(8);
    }
  });

  it('covers slots, legality, coverage, export and hub links', () => {
    for (const pack of [en.tb.seo, de.tb.seo]) {
      expect(pack.what.slots.title.length).toBeGreaterThan(0);
      expect(pack.what.legality.title.length).toBeGreaterThan(0);
      expect(pack.what.coverage.title.length).toBeGreaterThan(0);
      expect(pack.what.export.title.length).toBeGreaterThan(0);
      expect(pack.links.battle.label.length).toBeGreaterThan(0);
      expect(pack.links.dex.label.length).toBeGreaterThan(0);
      expect(pack.links.versus.label.length).toBeGreaterThan(0);
      expect(pack.links.nuzlocke.label.length).toBeGreaterThan(0);
    }
  });

  it('uses official German terms and no du-form', () => {
    const deText = collectStrings(de.tb.seo).join(' ');
    expect(deText).toMatch(/Attacken/);
    expect(deText).toMatch(/Fähigkeit/);
    expect(deText).toMatch(/Wesen/);
    expect(deText).not.toMatch(/\b[Dd]u\b/);
    expect(deText).not.toMatch(/\b[Dd]ein/);
    expect(deText).not.toMatch(/ — /);
  });

  it('mounts TeamSeoSections on the hub path only', () => {
    expect(teamBuilderSource).toMatch(/import TeamSeoSections from '\.\/teambuilder\/TeamSeoSections'/);
    expect(teamBuilderSource).toMatch(/<TeamSeoSections \/>/);
  });

  it('keeps the dex lead in both locales', () => {
    expect(en.pokedex.lead.length).toBeGreaterThan(20);
    expect(de.pokedex.lead.length).toBeGreaterThan(20);
    expect(de.pokedex.lead).toMatch(/Nationaldex/);
    expect(de.pokedex.lead).not.toMatch(/\b[Dd]u\b/);
  });
});
