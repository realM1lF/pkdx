import { describe, expect, it } from 'vitest';
import { effectivenessVsMember, type TeamMemberDefense } from './teambuilder';
import { newestVersionGroup } from './move-pool';
import { effLabel } from '../pages/teambuilder/AnalysisDeck';
import type { Pokemon } from './types';

const member = (types: TeamMemberDefense['types'], ability: string | null): TeamMemberDefense => ({ types, ability });

describe('Lightning Rod / Storm Drain — gen-gated immunity (Bulbapedia: redirect-only in gen 3/4)', () => {
  it('gen 4 (diamond-pearl): Seaking + Lightning Rod keeps Electric ×2, no immunity', () => {
    expect(effectivenessVsMember('electric', member(['water'], 'lightning-rod'), 'diamond-pearl')).toBe(2);
    expect(effectivenessVsMember('electric', member(['water'], 'lightning-rod'), 'platinum')).toBe(2);
  });
  it('gen 3 (ruby-sapphire): no immunity either', () => {
    expect(effectivenessVsMember('electric', member(['water'], 'lightning-rod'), 'ruby-sapphire')).toBe(2);
  });
  it('gen 5+ (black-white): Lightning Rod grants Electric immunity', () => {
    expect(effectivenessVsMember('electric', member(['water'], 'lightning-rod'), 'black-white')).toBe(0);
    expect(effectivenessVsMember('electric', member(['water'], 'lightning-rod'), 'scarlet-violet')).toBe(0);
  });
  it('Storm Drain follows the same rule', () => {
    expect(effectivenessVsMember('water', member(['ground'], 'storm-drain'), 'diamond-pearl')).toBe(2);
    expect(effectivenessVsMember('water', member(['ground'], 'storm-drain'), 'black-white')).toBe(0);
  });
});

describe('Dry Skin — Fire ×1.25 weakness alongside Water immunity', () => {
  it('fire is ×1.25 on a neutral type', () => {
    expect(effectivenessVsMember('fire', member(['poison'], 'dry-skin'), 'diamond-pearl')).toBe(1.25);
  });
  it('stacks on an existing weakness (bug: ×2 → ×2.5)', () => {
    expect(effectivenessVsMember('fire', member(['bug'], 'dry-skin'), 'diamond-pearl')).toBe(2.5);
  });
  it('water immunity stays intact', () => {
    expect(effectivenessVsMember('water', member(['poison'], 'dry-skin'), 'diamond-pearl')).toBe(0);
  });
});

describe('ability gate — gens/version groups without abilities', () => {
  it('gen 1 (red-blue): abilities are ignored entirely', () => {
    expect(effectivenessVsMember('electric', member(['water'], 'lightning-rod'), 'red-blue')).toBe(2);
    expect(effectivenessVsMember('ground', member(['electric'], 'levitate'), 'yellow')).toBe(2);
  });
  it('gen 2 (gold-silver): abilities are ignored entirely', () => {
    expect(effectivenessVsMember('ground', member(['electric'], 'levitate'), 'gold-silver')).toBe(2);
  });
  it('LGPE: no abilities', () => {
    expect(effectivenessVsMember('ground', member(['electric'], 'levitate'), 'lets-go-pikachu-eevee')).toBe(2);
  });
  it('Legends: Arceus: no abilities', () => {
    expect(effectivenessVsMember('ground', member(['electric'], 'levitate'), 'legends-arceus')).toBe(2);
  });
  it('gen 3+ with abilities still applies them', () => {
    expect(effectivenessVsMember('ground', member(['electric'], 'levitate'), 'emerald')).toBe(0);
  });
});

describe('effLabel — exact glyphs for ability-modified multipliers', () => {
  it.each([
    [0, '0'],
    [0.125, '⅛'],
    [0.25, '¼'],
    [0.375, '⅜'],
    [0.5, '½'],
    [0.625, '⅝'],
    [0.75, '¾'],
    [1, ''],
    [1.25, '1¼'],
    [1.5, '1½'],
    [2, '2'],
    [2.5, '2½'],
    [3, '3'],
    [4, '4'],
    [5, '5'],
  ])('effLabel(%s) === %s', (eff, label) => {
    expect(effLabel(eff as number)).toBe(label);
  });
  it('Solid Rock on 4× weakness yields exactly 3 (label "3", not "2")', () => {
    const eff = effectivenessVsMember('water', member(['ground', 'rock'], 'solid-rock'), 'diamond-pearl');
    expect(eff).toBe(3);
    expect(effLabel(eff)).toBe('3');
  });
  it('Solid Rock on 2× weakness yields 1½', () => {
    const eff = effectivenessVsMember('ice', member(['ground'], 'solid-rock'), 'diamond-pearl');
    expect(eff).toBe(1.5);
    expect(effLabel(eff)).toBe('1½');
  });
});

describe('newestVersionGroup — fixed LGPE slug + BDSP/LA ranks', () => {
  const fakePokemon = (vgs: string[]): Pokemon =>
    ({
      moves: [
        {
          move: { name: 'tackle', url: '' },
          version_group_details: vgs.map((name) => ({
            level_learned_at: 1,
            move_learn_method: { name: 'level-up', url: '' },
            version_group: { name, url: '' },
          })),
        },
      ],
    }) as unknown as Pokemon;

  it('scarlet-violet outranks legends-arceus and BDSP', () => {
    expect(newestVersionGroup(fakePokemon(['brilliant-diamond-shining-pearl', 'scarlet-violet', 'legends-arceus']))).toBe('scarlet-violet');
    expect(newestVersionGroup(fakePokemon(['brilliant-diamond-shining-pearl', 'legends-arceus']))).toBe('legends-arceus');
  });
  it('lets-go-pikachu-eevee is recognized', () => {
    expect(newestVersionGroup(fakePokemon(['sun-moon', 'lets-go-pikachu-eevee']))).toBe('lets-go-pikachu-eevee');
  });
});
