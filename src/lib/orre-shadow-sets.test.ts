import { describe, expect, it } from 'vitest';
import { shadowsFor } from './orre';
import { shadowMovesOf, shadowSetById } from './orre-shadow-sets';
import { damageBetween } from './versus';
import { versusContextFromGame } from './versus-context';

describe('shadow-sets artifact', () => {
  it('gives every Colosseum shadow Shadow Rush and no invented extras except Suicune', () => {
    const shadows = shadowsFor('colosseum');
    expect(shadows.length).toBeGreaterThan(0);
    for (const s of shadows) {
      const set = shadowSetById('colosseum', s.id);
      expect(set, s.id).toBeDefined();
      expect(set!.shadowMove).toBe('shadow-rush');
      if (s.id === 'colo-shadow-suicune') {
        expect(set!.moves).toEqual(['surf']);
      } else {
        expect(set!.moves).toEqual([]);
      }
    }
  });

  it('shadowMovesOf puts Shadow Rush first', () => {
    expect(shadowMovesOf('colosseum', 'colo-shadow-makuhita')).toEqual(['shadow-rush']);
  });

  it('Suicune uses Surf by default and Hydro Pump at Deep Colosseum', () => {
    expect(shadowMovesOf('colosseum', 'colo-shadow-suicune')).toEqual(['shadow-rush', 'surf']);
    expect(shadowMovesOf('colosseum', 'colo-shadow-suicune', 'orre-the-under-venus')).toEqual([
      'shadow-rush',
      'surf',
    ]);
    expect(shadowMovesOf('colosseum', 'colo-shadow-suicune', 'orre-deep-colosseum')).toEqual([
      'shadow-rush',
      'hydro-pump',
    ]);
  });

  it('returns undefined for unknown ids', () => {
    expect(shadowSetById('colosseum', 'nope')).toBeUndefined();
  });

  it('loads sourced XD Teddiursa set from the Bulbapedia walkthrough list', () => {
    expect(shadowMovesOf('xd', 'xd-shadow-teddiursa')).toEqual([
      'shadow-blitz',
      'shadow-mist',
      'lick',
      'metal-claw',
    ]);
  });

  it('covers every XD shadow id', () => {
    for (const s of shadowsFor('xd')) {
      expect(shadowSetById('xd', s.id), s.id).toBeDefined();
      expect(shadowMovesOf('xd', s.id).length).toBeGreaterThan(0);
    }
  });
});

describe('Shadow Rush calc approximation (Colosseum)', () => {
  const ctx = versusContextFromGame('colosseum');

  it('resolves a damage range instead of dropping the move', () => {
    const cell = damageBetween(
      { slug: 'makuhita', level: 30, moves: ['shadow-rush'] },
      { slug: 'bayleef', level: 30, moves: [] },
      'shadow-rush',
      undefined,
      ctx,
    );
    expect(cell).not.toBeNull();
    expect(cell!.range[1]).toBeGreaterThan(0);
  });

  it('Hyper Mode uses the crit approximation and deals more than the base hit', () => {
    const atk = { slug: 'makuhita', level: 30, moves: ['shadow-rush'] as string[] };
    const def = { slug: 'bayleef', level: 30, moves: [] as string[] };
    const base = damageBetween(atk, def, 'shadow-rush', undefined, ctx);
    const hyper = damageBetween({ ...atk, hyperMode: true }, def, 'shadow-rush', undefined, ctx);
    expect(base).not.toBeNull();
    expect(hyper).not.toBeNull();
    expect(hyper!.range[0]).toBeGreaterThan(base!.range[0]);
  });
});

describe('XD Shadow Blitz calc approximation', () => {
  it('resolves damage instead of dropping the move', () => {
    const cell = damageBetween(
      { slug: 'teddiursa', level: 11, moves: ['shadow-blitz'] },
      { slug: 'eevee', level: 10, moves: [] },
      'shadow-blitz',
      undefined,
      versusContextFromGame('xd'),
    );
    expect(cell).not.toBeNull();
    expect(cell!.range[1]).toBeGreaterThan(0);
  });
});
