import { describe, expect, it } from 'vitest';
import { moveMetaForDisplay } from '@/lib/gen-dex';
import type { MoveDesc } from '@/lib/desc-data';

/** Mirrors EntityDescModal move-stat resolution (table ↔ modal parity). */
function modalMoveStats(versionGroup: string | undefined, slug: string, move: MoveDesc) {
  const meta = moveMetaForDisplay(versionGroup, slug, {
    type: { name: move.t },
    damage_class: { name: move.dc },
    power: move.power ?? null,
    accuracy: move.acc ?? null,
    pp: move.pp ?? null,
  });
  const genCorrect = !!meta.type;
  return {
    power: genCorrect ? meta.power : move.power ?? null,
    accuracy: genCorrect ? meta.accuracy : move.acc ?? null,
    pp: genCorrect ? meta.pp : move.pp ?? null,
    type: genCorrect ? meta.type : move.t,
    category: genCorrect ? meta.category : move.dc,
  };
}

describe('EntityDescModal move stats (edition-aware)', () => {
  const leafStormDesc: MoveDesc = {
    n: 'Leaf Storm',
    de: 'Blättersturm',
    t: 'grass',
    dc: 'special',
    target: 'selected-pokemon',
    power: 130,
    acc: 90,
    pp: 5,
  };

  const modernApi = (overrides: Partial<{ t: string; dc: string; power: number; acc: number; pp: number }>) => ({
    n: 'Move',
    t: overrides.t ?? 'normal',
    dc: overrides.dc ?? 'special',
    target: 'selected-pokemon',
    power: overrides.power ?? 90,
    acc: overrides.acc ?? 100,
    pp: overrides.pp ?? 15,
  });

  function expectModalMatchesTable(vg: string, slug: string, desc: MoveDesc) {
    const table = moveMetaForDisplay(vg, slug);
    const modal = modalMoveStats(vg, slug, desc);
    expect(modal.power).toBe(table.power);
    expect(modal.accuracy).toBe(table.accuracy);
    expect(modal.pp).toBe(table.pp);
    expect(modal.type).toBe(table.type);
    expect(modal.category).toBe(table.category);
  }

  it('uses @pkmn Gen 5 power for Black/White instead of the desc artifact', () => {
    const stats = modalMoveStats('black-white', 'leaf-storm', leafStormDesc);
    expect(stats.power).toBe(140);
    expect(stats.accuracy).toBe(90);
    expect(stats.pp).toBe(5);
  });

  it('keeps desc-artifact stats when no version group is set', () => {
    const stats = modalMoveStats(undefined, 'leaf-storm', leafStormDesc);
    expect(stats.power).toBe(130);
    expect(stats.type).toBe('grass');
  });

  it('matches MovesPanel rowMeta for the same edition', () => {
    expectModalMatchesTable('black-white', 'leaf-storm', leafStormDesc);
  });

  it('matches table for Thunderbolt power across editions', () => {
    const desc = modernApi({ t: 'electric', power: 90, acc: 100, pp: 15 });
    expectModalMatchesTable('firered-leafgreen', 'thunderbolt', desc);
    expect(modalMoveStats('firered-leafgreen', 'thunderbolt', desc).power).toBe(95);
    expectModalMatchesTable('x-y', 'thunderbolt', desc);
    expect(modalMoveStats('x-y', 'thunderbolt', desc).power).toBe(90);
  });

  it('matches table for Bite type and category history', () => {
    const desc = modernApi({ t: 'dark', dc: 'physical', power: 60, acc: 100, pp: 25 });
    expect(modalMoveStats('red-blue', 'bite', desc).type).toBe('normal');
    expect(modalMoveStats('red-blue', 'bite', desc).category).toBe('physical');
    expect(modalMoveStats('gold-silver', 'bite', desc).type).toBe('dark');
    expect(modalMoveStats('gold-silver', 'bite', desc).category).toBe('special');
    expect(modalMoveStats('diamond-pearl', 'bite', desc).category).toBe('physical');
    expectModalMatchesTable('gold-silver', 'bite', desc);
  });

  it('matches table for Swift category split at Gen 4', () => {
    const desc = modernApi({ t: 'normal', dc: 'special', power: 60, acc: 100, pp: 20 });
    expect(modalMoveStats('firered-leafgreen', 'swift', desc).category).toBe('physical');
    expect(modalMoveStats('diamond-pearl', 'swift', desc).category).toBe('special');
    expectModalMatchesTable('firered-leafgreen', 'swift', desc);
    expectModalMatchesTable('diamond-pearl', 'swift', desc);
  });

  it('matches table for Disable accuracy changes', () => {
    const desc = modernApi({ t: 'normal', dc: 'status', power: 0, acc: 100, pp: 20 });
    expect(modalMoveStats('firered-leafgreen', 'disable', desc).accuracy).toBe(55);
    expect(modalMoveStats('diamond-pearl', 'disable', desc).accuracy).toBe(80);
    expect(modalMoveStats('black-white', 'disable', desc).accuracy).toBe(100);
    expectModalMatchesTable('black-white', 'disable', desc);
  });
});
