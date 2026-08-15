import { describe, expect, it } from 'vitest';
import de from '@/i18n/locales/de/translation.json';
import en from '@/i18n/locales/en/translation.json';
import type { DexIndexEntry } from './types';
import type { MapNode, RegionMap } from './regions';
import {
  docsFromItems,
  docsFromMaps,
  docsFromPokemon,
  parseRecentEntry,
  pathForDoc,
  pushRecent,
  recentKey,
  searchDocs,
  type RecentEntry,
  type SearchDoc,
} from './global-search';

const PIKACHU: DexIndexEntry = {
  id: 25,
  name: 'pikachu',
  label: 'Pikachu',
  num: '#025',
  gen: 1,
};

const BULBASAUR: DexIndexEntry = {
  id: 1,
  name: 'bulbasaur',
  label: 'Bulbasaur',
  num: '#001',
  gen: 1,
};

function node(partial: Partial<MapNode> & Pick<MapNode, 'id' | 'label'>): MapNode {
  return {
    kind: 'route',
    x: 0,
    y: 0,
    order: 1,
    locationSlug: partial.id,
    ...partial,
  };
}

function region(partial: Partial<RegionMap> & Pick<RegionMap, 'region' | 'name' | 'nodes'>): RegionMap {
  return {
    nameDe: partial.name,
    gen: '1',
    accent: '#000',
    viewBox: '0 0 1 1',
    versions: ['firered'],
    defaultVersion: 'firered',
    coverage: 1,
    speciesCount: 1,
    edges: [],
    ...partial,
  };
}

const KANTO = region({
  region: 'kanto',
  name: 'Kanto',
  nameDe: 'Kanto',
  nodes: [
    node({ id: 'viridian-forest', label: 'Viridian Forest', nameDe: 'Vertania-Wald', kind: 'dungeon' }),
    node({ id: 'kanto-route-1', label: 'Route 1', nameDe: 'Route 1', kind: 'route' }),
  ],
});

const UNOVA = region({
  region: 'unova',
  name: 'Unova',
  nameDe: 'Einall',
  nodes: [node({ id: 'unova-route-1', label: 'Route 1', nameDe: 'Route 1' })],
});

function catalog(): SearchDoc[] {
  return [
    ...docsFromPokemon([PIKACHU, BULBASAUR], (id) => (id === 1 ? 'Bisasam' : id === 25 ? 'Pikachu' : null)),
    ...docsFromItems([
      { slug: 'exp-share', nameEn: 'Exp. Share', nameDe: 'EP-Teiler' },
      { slug: 'potion', nameEn: 'Potion', nameDe: 'Trank' },
      { slug: 'leftovers', nameEn: 'Leftovers', nameDe: 'Überreste' },
    ]),
    ...docsFromMaps([KANTO, UNOVA]),
  ];
}

describe('docsFromPokemon', () => {
  it('indexes English slug, display name, dex number and German alias', () => {
    const [doc] = docsFromPokemon([PIKACHU], () => 'Pikachu');
    expect(doc).toMatchObject({
      kind: 'pokemon',
      pokemonId: 25,
      slug: 'pikachu',
      idStr: '25',
      labelEn: 'Pikachu',
      labelDe: 'Pikachu',
    });
  });
});

describe('docsFromItems', () => {
  it('drops placeholder and sprite-less rows', () => {
    const docs = docsFromItems([
      { slug: 'potion', nameEn: 'Potion', nameDe: 'Trank' },
      { slug: 'dynax-stub', nameEn: '★ Dynamax Crystal', nameDe: '★ Dynamax-Kristall' },
      { slug: 'no-art', nameEn: 'No Art', skip: true },
    ]);
    expect(docs.map((d) => d.itemSlug)).toEqual(['potion']);
  });
});

describe('docsFromMaps', () => {
  it('indexes each region and each node, never orre', () => {
    const docs = docsFromMaps([
      KANTO,
      region({
        region: 'orre' as RegionMap['region'],
        name: 'Orre',
        nameDe: 'Orre',
        nodes: [node({ id: 'orre-outskirt-stand', label: 'Outskirt Stand' })],
      }),
    ]);
    expect(docs.some((d) => d.regionId === 'orre' || d.slug.includes('orre'))).toBe(false);
    expect(docs.some((d) => d.kind === 'map' && d.regionId === 'kanto' && !d.nodeId)).toBe(true);
    expect(docs.some((d) => d.nodeId === 'viridian-forest')).toBe(true);
  });
});

describe('searchDocs', () => {
  it('returns nothing for a blank query', () => {
    expect(searchDocs('   ', catalog())).toEqual([]);
  });

  it('finds a Pokémon by English name, German name and dex number', () => {
    const docs = catalog();
    expect(searchDocs('pikachu', docs)[0]?.pokemonId).toBe(25);
    expect(searchDocs('bisasam', docs)[0]?.pokemonId).toBe(1);
    expect(searchDocs('#025', docs)[0]?.pokemonId).toBe(25);
    expect(searchDocs('25', docs).some((d) => d.pokemonId === 25)).toBe(true);
  });

  it('finds items by English name, German name and slug', () => {
    const docs = catalog();
    expect(searchDocs('exp share', docs)[0]?.itemSlug).toBe('exp-share');
    expect(searchDocs('EP-Teiler', docs)[0]?.itemSlug).toBe('exp-share');
    expect(searchDocs('trank', docs)[0]?.itemSlug).toBe('potion');
    expect(searchDocs('überreste', docs)[0]?.itemSlug).toBe('leftovers');
  });

  it('finds maps by region and by node name in both languages', () => {
    const docs = catalog();
    expect(searchDocs('kanto', docs).some((d) => d.regionId === 'kanto' && !d.nodeId)).toBe(true);
    expect(searchDocs('einall', docs).some((d) => d.regionId === 'unova' && !d.nodeId)).toBe(true);
    expect(searchDocs('vertania', docs)[0]?.nodeId).toBe('viridian-forest');
    expect(searchDocs('viridian forest', docs)[0]?.nodeId).toBe('viridian-forest');
  });

  it('does not invent nuzlocke, team or orre hits', () => {
    const docs = catalog();
    for (const q of ['nuzlocke', 'team builder', 'orre']) {
      const hits = searchDocs(q, docs);
      expect(hits.every((d) => d.kind === 'pokemon' || d.kind === 'item' || d.kind === 'map')).toBe(true);
      expect(hits.some((d) => d.regionId === 'orre' || d.slug === 'nuzlocke' || d.slug === 'team')).toBe(false);
    }
  });

  it('caps the result list', () => {
    expect(searchDocs('route', catalog(), 1)).toHaveLength(1);
  });
});

describe('pathForDoc', () => {
  it('routes Pokémon by national id', () => {
    const [doc] = docsFromPokemon([PIKACHU], () => 'Pikachu');
    expect(pathForDoc(doc, 'de')).toBe('/pokemon/25');
    expect(pathForDoc(doc, 'en')).toBe('/pokemon/25');
  });

  it('routes SEO items to the locale slug and other items to the lexicon', () => {
    const [share, potion] = docsFromItems([
      { slug: 'exp-share', nameEn: 'Exp. Share', nameDe: 'EP-Teiler' },
      { slug: 'potion', nameEn: 'Potion', nameDe: 'Trank' },
    ]);
    expect(pathForDoc(share, 'de')).toBe('/items/ep-teiler');
    expect(pathForDoc(share, 'en')).toBe('/items/exp-share');
    expect(pathForDoc(potion, 'de')).toBe('/items?item=potion');
    expect(pathForDoc(potion, 'en')).toBe('/items?item=potion');
  });

  it('routes map regions to the atlas and nodes to a page or deep link', () => {
    const docs = docsFromMaps([KANTO, UNOVA]);
    const kanto = docs.find((d) => d.regionId === 'kanto' && !d.nodeId)!;
    const forest = docs.find((d) => d.nodeId === 'viridian-forest')!;
    const unovaRoute = docs.find((d) => d.nodeId === 'unova-route-1')!;
    expect(pathForDoc(kanto, 'en')).toBe('/maps/kanto');
    expect(pathForDoc(forest, 'en')).toBe('/maps/kanto/viridian-forest');
    expect(pathForDoc(forest, 'de')).toBe('/maps/kanto/vertania-wald');
    expect(pathForDoc(unovaRoute, 'en')).toBe('/maps/unova?node=unova-route-1');
  });
});

describe('recent entries', () => {
  it('treats legacy {id,label} rows as Pokémon', () => {
    expect(parseRecentEntry({ id: 25, label: 'Pikachu' })).toEqual({
      kind: 'pokemon',
      id: 25,
      label: 'Pikachu',
    });
  });

  it('dedupes by kind key and keeps five entries', () => {
    const first: RecentEntry = { kind: 'item', slug: 'potion', label: 'Potion' };
    const next = pushRecent({ kind: 'pokemon', id: 1, label: 'Bulbasaur' }, [first]);
    const again = pushRecent(first, next);
    expect(again[0]).toEqual(first);
    expect(again).toHaveLength(2);
    expect(recentKey(first)).toBe('item:potion');
  });
});

describe('header copy stays honest', () => {
  it('names only Pokémon, items and maps', () => {
    expect(en.nav.searchHint).toBe('Search Pokémon, Items, Maps');
    expect(de.nav.searchHint).toBe('Suche nach Pokémon, Items, Maps');
    for (const hint of [en.nav.searchHint, de.nav.searchHint]) {
      expect(hint).not.toMatch(/Nuz|Team|Orre|Versus/i);
    }
    expect(en.search.dialogAria).toMatch(/item/i);
    expect(en.search.dialogAria).toMatch(/map/i);
    expect(de.search.dialogAria).toMatch(/Item/i);
    expect(de.search.dialogAria).toMatch(/Map/i);
    expect(en.search.noMatch).not.toMatch(/No Pokémon matches/);
    expect(de.search.noMatch).not.toMatch(/Kein Pokémon passt/);
  });
});
