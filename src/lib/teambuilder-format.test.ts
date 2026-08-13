import { describe, expect, it } from 'vitest';
import {
  smogonExtraFormats,
  smogonFormatChain,
  smogonFormatForVersionGroup,
  smogonFormatLabel,
  smogonSetsUrl,
} from './smogon-format';

describe('smogonFormatForVersionGroup', () => {
  it('maps red-blue to gen1ou', () => {
    expect(smogonFormatForVersionGroup('red-blue')).toBe('gen1ou');
  });

  it('maps heartgold-soulsilver to gen4ou', () => {
    expect(smogonFormatForVersionGroup('heartgold-soulsilver')).toBe('gen4ou');
  });

  it('maps scarlet-violet to gen9ou', () => {
    expect(smogonFormatForVersionGroup('scarlet-violet')).toBe('gen9ou');
  });

  it('maps gold-silver to gen2ou', () => {
    expect(smogonFormatForVersionGroup('gold-silver')).toBe('gen2ou');
  });
});

describe('smogonFormatChain', () => {
  it('falls back to that gen ou, then gen9ou', () => {
    expect(smogonFormatChain('red-blue')).toEqual(['gen1ou', 'gen9ou']);
    expect(smogonFormatChain('heartgold-soulsilver')).toEqual(['gen4ou', 'gen9ou']);
    expect(smogonFormatChain('scarlet-violet')).toEqual(['gen9ou']);
    expect(smogonFormatChain('lets-go-pikachu-eevee')).toEqual(['gen7letsgoou', 'gen7ou', 'gen9ou']);
    expect(smogonFormatChain('brilliant-diamond-shining-pearl')).toEqual(['gen8bdspou', 'gen8ou', 'gen9ou']);
  });
});

describe('smogonSetsUrl', () => {
  it('builds data.pkmn.cc /sets/{format}.json URLs', () => {
    expect(smogonSetsUrl('gen1ou')).toBe('https://data.pkmn.cc/sets/gen1ou.json');
    expect(smogonSetsUrl('gen4ou')).toBe('https://data.pkmn.cc/sets/gen4ou.json');
    expect(smogonSetsUrl('gen9ou')).toBe('https://data.pkmn.cc/sets/gen9ou.json');
  });
});

describe('smogonExtraFormats', () => {
  it('exposes gen9 VGC as extra without replacing OU', () => {
    expect(smogonFormatForVersionGroup('scarlet-violet')).toBe('gen9ou');
    expect(smogonExtraFormats('scarlet-violet')).toEqual(['gen9vgc2025']);
    expect(smogonExtraFormats('red-blue')).toEqual([]);
  });
});

describe('smogonFormatLabel', () => {
  it('renders Showdown format ids as display labels', () => {
    expect(smogonFormatLabel('gen1ou')).toBe('Gen 1 OU');
    expect(smogonFormatLabel('gen4ou')).toBe('Gen 4 OU');
    expect(smogonFormatLabel('gen9ou')).toBe('Gen 9 OU');
    expect(smogonFormatLabel('gen7letsgoou')).toBe("Gen 7 Let's Go OU");
    expect(smogonFormatLabel('gen8bdspou')).toBe('Gen 8 BDSP OU');
  });
});
