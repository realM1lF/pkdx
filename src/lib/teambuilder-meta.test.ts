import { describe, expect, it } from 'vitest';
import { parseMetaEntry } from './teambuilder';

describe('parseMetaEntry', () => {
  it('parses live direct-map sets and normalizes singular fields', () => {
    const entry = parseMetaEntry(
      {
        Dragonite: {
          'Dragon Dance': {
            moves: ['Dragon Dance', ['Extreme Speed', 'Ice Spinner'], 'Earthquake', 'Fire Punch'],
            ability: 'Multiscale',
            item: 'Heavy-Duty Boots',
            nature: 'Adamant',
            evs: { atk: 252, def: 4, spe: 252 },
            teratypes: ['Normal', 'Ground'],
          },
        },
      },
      'dragonite',
    );

    expect(entry).toMatchObject({
      species: 'Dragonite',
      weight: null,
      sets: [
        {
          name: 'Dragon Dance',
          moves: [['Dragon Dance'], ['Extreme Speed', 'Ice Spinner'], ['Earthquake'], ['Fire Punch']],
          abilities: ['Multiscale'],
          items: ['Heavy-Duty Boots'],
          natures: ['Adamant'],
          evs: [{ attack: 252, defense: 4, speed: 252 }],
          teraTypes: ['Normal', 'Ground'],
        },
      ],
    });
  });

  it('continues to parse legacy nested set maps', () => {
    const entry = parseMetaEntry(
      {
        'Landorus-Therian': {
          weight: 0.15,
          sets: {
            Pivot: {
              moves: [['Earthquake'], ['U-turn']],
              abilities: ['Intimidate'],
              items: ['Rocky Helmet'],
              natures: ['Impish'],
              evs: [{ hp: 252, def: 252, spe: 4 }],
              teraTypes: ['Water'],
            },
          },
        },
      },
      'landorus-therian',
    );

    expect(entry).toMatchObject({
      species: 'Landorus-Therian',
      weight: 0.15,
      sets: [
        {
          name: 'Pivot',
          moves: [['Earthquake'], ['U-turn']],
          abilities: ['Intimidate'],
          items: ['Rocky Helmet'],
          natures: ['Impish'],
          evs: [{ hp: 252, defense: 252, speed: 4 }],
          teraTypes: ['Water'],
        },
      ],
    });
  });

  it('matches normalized species keys', () => {
    const entry = parseMetaEntry(
      {
        'Kommo-o': {
          'Clangorous Soul': {},
        },
      },
      'kommo-o',
    );

    expect(entry?.species).toBe('Kommo-o');
  });

  it('returns null when the species is absent', () => {
    expect(parseMetaEntry({ Dragonite: { 'Dragon Dance': {} } }, 'garchomp')).toBeNull();
  });
});
