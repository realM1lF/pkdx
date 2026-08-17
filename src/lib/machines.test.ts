import { describe, expect, it } from 'vitest';
import catalog from '@/data/machines-by-vg.json';
import { VERSION_GROUPS } from './version-groups';
import { machineLabel, machineOf } from './machines';

describe('machineOf — Serebii/PokéWiki TM·HM numbers per version group', () => {
  it('RBY: Thunderbolt is TM24, Cut is HM01', () => {
    expect(machineOf('red-blue', 'thunderbolt')).toEqual({ kind: 'tm', num: 24 });
    expect(machineOf('yellow', 'thunderbolt')).toEqual({ kind: 'tm', num: 24 });
    expect(machineOf('red-blue', 'cut')).toEqual({ kind: 'hm', num: 1 });
    expect(machineLabel({ kind: 'tm', num: 24 }, 'en')).toBe('TM24');
    expect(machineLabel({ kind: 'hm', num: 1 }, 'de')).toBe('VM01');
  });

  it('GSC: TM24 is Dragon Breath, not Thunderbolt', () => {
    expect(machineOf('gold-silver', 'dragon-breath')).toEqual({ kind: 'tm', num: 24 });
    expect(machineOf('gold-silver', 'thunderbolt')).toBeNull();
    expect(machineOf('crystal', 'thunderbolt')).toBeNull();
  });

  it('FRLG keeps Thunderbolt as TM24; HMs exist through Gen 6 only', () => {
    expect(machineOf('firered-leafgreen', 'thunderbolt')).toEqual({ kind: 'tm', num: 24 });
    expect(machineOf('x-y', 'cut')).toEqual({ kind: 'hm', num: 1 });
    expect(machineOf('sun-moon', 'cut')).toBeNull();
  });

  it('XY is Kalos, not FRLG: Giga Impact TM68 / Energy Ball TM53 / X-Scissor TM81', () => {
    expect(machineOf('x-y', 'giga-impact')).toEqual({ kind: 'tm', num: 68 });
    expect(machineOf('x-y', 'energy-ball')).toEqual({ kind: 'tm', num: 53 });
    expect(machineOf('x-y', 'x-scissor')).toEqual({ kind: 'tm', num: 81 });
    expect(machineOf('x-y', 'focus-punch')).toBeNull();
    expect(machineOf('firered-leafgreen', 'giga-impact')).toBeNull();
  });

  it('B2W2 TM01 is Hone Claws, not Focus Punch', () => {
    expect(machineOf('black-2-white-2', 'hone-claws')).toEqual({ kind: 'tm', num: 1 });
    expect(machineOf('black-2-white-2', 'focus-punch')).toBeNull();
    expect(machineOf('black-2-white-2', 'giga-impact')).toEqual({ kind: 'tm', num: 68 });
  });

  it('Alola: Work Up TM01, Surf TM94, Fly TM76; no HMs', () => {
    expect(machineOf('sun-moon', 'work-up')).toEqual({ kind: 'tm', num: 1 });
    expect(machineOf('sun-moon', 'surf')).toEqual({ kind: 'tm', num: 94 });
    expect(machineOf('sun-moon', 'fly')).toEqual({ kind: 'tm', num: 76 });
    expect(machineOf('sun-moon', 'waterfall')).toEqual({ kind: 'tm', num: 98 });
    expect(machineOf('ultra-sun-ultra-moon', 'work-up')).toEqual({ kind: 'tm', num: 1 });
    expect(machineOf('sun-moon', 'hone-claws')).toBeNull();
  });

  it('ORAS keeps Unova-style TM01 Hone Claws and Surf as HM03', () => {
    expect(machineOf('omega-ruby-alpha-sapphire', 'hone-claws')).toEqual({ kind: 'tm', num: 1 });
    expect(machineOf('omega-ruby-alpha-sapphire', 'surf')).toEqual({ kind: 'hm', num: 3 });
    expect(machineOf('omega-ruby-alpha-sapphire', 'giga-impact')).toEqual({ kind: 'tm', num: 68 });
  });

  it('BDSP restored HMs; SwSh uses TRs; SV Tera Blast is TM171', () => {
    expect(machineOf('brilliant-diamond-shining-pearl', 'cut')).toEqual({ kind: 'hm', num: 1 });
    expect(machineOf('brilliant-diamond-shining-pearl', 'hyper-beam')).toEqual({ kind: 'tm', num: 15 });
    expect(machineOf('sword-shield', 'thunderbolt')).toEqual({ kind: 'tr', num: 8 });
    expect(machineLabel({ kind: 'tr', num: 8 }, 'en')).toBe('TR08');
    expect(machineOf('scarlet-violet', 'tera-blast')).toEqual({ kind: 'tm', num: 171 });
    expect(machineLabel({ kind: 'tm', num: 171 }, 'en')).toBe('TM171');
  });

  it('SV bag uses three-digit TM numbers (Protect is TM007, not TM07)', () => {
    expect(machineOf('scarlet-violet', 'protect')).toEqual({ kind: 'tm', num: 7 });
    expect(machineLabel({ kind: 'tm', num: 7 }, 'en', 'scarlet-violet')).toBe('TM007');
    expect(machineLabel({ kind: 'tm', num: 171 }, 'en', 'scarlet-violet')).toBe('TM171');
    expect(machineLabel({ kind: 'tm', num: 7 }, 'en', 'firered-leafgreen')).toBe('TM07');
  });

  it('has a catalog object for every app version group', () => {
    const tables = catalog as Record<string, Record<string, string>>;
    for (const vg of VERSION_GROUPS) {
      expect(tables).toHaveProperty(vg.id);
      if (vg.id === 'legends-arceus') {
        expect(Object.keys(tables[vg.id] ?? {})).toHaveLength(0);
      } else {
        expect(Object.keys(tables[vg.id] ?? {}).length).toBeGreaterThan(0);
      }
    }
  });
});
