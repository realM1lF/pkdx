import { describe, expect, it } from 'vitest';
import de from '@/i18n/locales/de/translation.json';

describe('DE leftovers — official place and item labels', () => {
  it('uses Fuchsania City and zum Indigo-Plateau', () => {
    const expShare = de.seo.itemData['exp-share'].qa2Body;
    const lum = de.seo.itemData['lum-berry'].qa2Body;
    expect(expShare).toContain('Fuchsania City');
    expect(expShare).not.toContain('Fuchsia City');
    expect(lum).toContain('zum Indigo-Plateau');
    expect(lum).not.toContain('zur Indigo Plateau');
  });

  it('does not leave the English word Boosts on item group labels', () => {
    expect(de.items.groups.boost).not.toMatch(/Boosts/i);
    expect(de.desc.cats['stat-boosts']).not.toMatch(/Boosts/i);
  });
});
