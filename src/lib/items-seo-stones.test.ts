import { describe, expect, it } from 'vitest';
import itemsSeo from '@/data/items-seo.json';
import de from '@/i18n/locales/de/translation.json';
import en from '@/i18n/locales/en/translation.json';

describe('items-seo evolution stones', () => {
  const leaf = itemsSeo['leaf-stone'];
  const water = itemsSeo['water-stone'];
  const sun = itemsSeo['sun-stone'];

  it('leaf-stone targets Gloom / Weepinbell / Exeggcute, not Bellsprout', () => {
    expect(leaf.evolutionTargets).not.toContain(69);
    expect(leaf.evolutionTargets).toEqual(expect.arrayContaining([44, 70, 102]));
  });

  it('water-stone targets Lombre, not Lotad', () => {
    expect(water.evolutionTargets).not.toContain(270);
    expect(water.evolutionTargets).toContain(271);
  });

  it('water-stone FRLG locations include both Seafoam finds', () => {
    const seafoam = water.locationsFrlg.filter((l) => l.node === 'seafoam-islands');
    expect(seafoam.map((l) => l.kind).sort()).toEqual(['ball', 'hidden']);
  });

  it('sun-stone targets Gloom, not Oddish', () => {
    expect(sun.evolutionTargets).toContain(44);
    expect(sun.evolutionTargets).not.toContain(43);
  });

  it('DE Q&A names the official FRLG stone pre-evos', () => {
    const leafQa = de.seo.itemData['leaf-stone'].qa1Body;
    const sunQa = de.seo.itemData['sun-stone'].qa1Body;
    expect(leafQa).toMatch(/Duflor/);
    expect(leafQa).toMatch(/Ultrigaria/);
    expect(leafQa).toMatch(/Owei/);
    expect(leafQa).not.toMatch(/Myrapla/);
    expect(leafQa).not.toMatch(/Knofensa/);
    expect(sunQa).toMatch(/Duflor/);
    expect(sunQa).toMatch(/Blubella/);
    expect(sunQa).not.toMatch(/Myrapla wird/);
  });

  it('EN Q&A already names Gloom / Weepinbell, not Oddish / Bellsprout as stone targets', () => {
    const leafQa = en.seo.itemData['leaf-stone'].qa1Body;
    const sunQa = en.seo.itemData['sun-stone'].qa1Body;
    expect(leafQa).toMatch(/Gloom/);
    expect(leafQa).toMatch(/Weepinbell/);
    expect(leafQa).not.toMatch(/Oddish/);
    expect(leafQa).not.toMatch(/Bellsprout/);
    expect(sunQa).toMatch(/Gloom becomes Bellossom/);
    expect(sunQa).not.toMatch(/Oddish becomes/);
  });
});
