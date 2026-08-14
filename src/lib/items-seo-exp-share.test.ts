import { describe, expect, it } from 'vitest';
import itemsSeo from '@/data/items-seo.json';

describe('items-seo exp-share flavor', () => {
  const entry = itemsSeo['exp-share'];

  it('uses FRLG held-item flavor, not the Gen 6+ key-item text', () => {
    expect(entry.flavorEn.toLowerCase()).not.toMatch(/turning on/);
    expect(entry.flavorDe.toLowerCase()).not.toMatch(/angeschaltet/);
  });
});
