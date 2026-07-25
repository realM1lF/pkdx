/* Matchup-page data integrity — the snapshot the 70 matchup URLs are built
 * from. Guards against half-regenerated data, slug collisions and meta
 * descriptions over the 160-char SEO limit. */
import { describe, expect, it } from 'vitest';
import {
  MATCHUPS,
  MATCHUPS_META,
  localizeMatchupRest,
  matchupMeta,
  matchupRest,
  resolveMatchupParam,
} from './seo-matchups';

describe('matchups.json snapshot', () => {
  it('holds 35 curated matchups with unique slugs in both locales', () => {
    expect(MATCHUPS).toHaveLength(35);
    expect(new Set(MATCHUPS.map((m) => m.slugDe)).size).toBe(35);
    expect(new Set(MATCHUPS.map((m) => m.slugEn)).size).toBe(35);
  });

  it('every matchup accounts all battles exactly once', () => {
    for (const m of MATCHUPS) {
      expect(m.winsA + m.winsB + m.ties).toBe(MATCHUPS_META.battles);
      expect(m.winsA).toBeGreaterThanOrEqual(0);
      expect(m.medianTurns).toBeGreaterThan(0);
      expect(m.speedA).toBeGreaterThan(0);
      expect(m.speedB).toBeGreaterThan(0);
      expect(m.setsA.length).toBeGreaterThan(0);
      expect(m.setsB.length).toBeGreaterThan(0);
    }
  });

  it('key-move rows carry ranges, pct and effectiveness', () => {
    for (const m of MATCHUPS) {
      for (const row of [...m.movesA, ...m.movesB]) {
        expect(row.range[1]).toBeGreaterThanOrEqual(row.range[0]);
        expect(row.pct[1]).toBeGreaterThanOrEqual(row.pct[0]);
        expect([0, 0.25, 0.5, 1, 2, 4]).toContain(row.eff);
      }
    }
  });

  it('slug schemes follow <a>-gegen-<b> (de) and <a>-vs-<b> (en)', () => {
    for (const m of MATCHUPS) {
      expect(m.slugDe).toMatch(/^[a-z0-9-]+-gegen-[a-z0-9-]+$/);
      expect(m.slugEn).toMatch(/^[a-z0-9-]+-vs-[a-z0-9-]+$/);
    }
  });
});

describe('seo-matchups registry', () => {
  const first = MATCHUPS[0];

  it('resolves both locale slugs to the same entry', () => {
    expect(resolveMatchupParam(first.slugDe)?.slugEn).toBe(first.slugEn);
    expect(resolveMatchupParam(first.slugEn)?.slugEn).toBe(first.slugEn);
    expect(resolveMatchupParam('missingno-vs-nobody')).toBeNull();
  });

  it('translates rest paths between locales', () => {
    expect(localizeMatchupRest(`/versus/${first.slugDe}`, 'en')).toBe(`/versus/${first.slugEn}`);
    expect(localizeMatchupRest(`/versus/${first.slugEn}`, 'de')).toBe(`/versus/${first.slugDe}`);
    expect(localizeMatchupRest('/versus', 'de')).toBeNull();
    expect(matchupRest(first, 'de')).toBe(`/versus/${first.slugDe}`);
  });

  it('meta descriptions stay ≤160 chars and carry the result numbers', () => {
    for (const m of MATCHUPS) {
      const meta = matchupMeta(m);
      expect(meta.description.de.length).toBeLessThanOrEqual(160);
      expect(meta.description.en.length).toBeLessThanOrEqual(160);
      expect(meta.description.de).toContain(String(m.winsA));
      expect(meta.description.en).toContain(String(m.winsB));
      expect(meta.title.de.length).toBeLessThanOrEqual(70);
    }
  });
});
