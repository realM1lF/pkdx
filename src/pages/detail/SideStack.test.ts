import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import '@/i18n';
import type { Pokemon } from '@/lib/types';

vi.mock('@/components/EntityDescModal', () => ({
  default: () => null,
  useEntityModal: () => ({
    open: () => undefined,
    close: () => undefined,
    props: { target: null, onClose: () => undefined },
  }),
}));

import SideStack from './SideStack';

function stubPokemon(id: number, name: string): Pokemon {
  return {
    id,
    name,
    height: 1,
    weight: 1,
    base_experience: 1,
    stats: [],
    types: [{ slot: 1, type: { name: 'normal', url: '' } }],
    abilities: [],
    moves: [],
    species: { name, url: '' },
    sprites: { front_default: null, back_default: null, front_shiny: null, back_shiny: null },
  };
}

function html(props: {
  id: number;
  name: string;
  versionGroup: string;
  types: string[];
  abilities: Array<{ slug: string; hidden: boolean }>;
}): string {
  return renderToStaticMarkup(
    createElement(SideStack, {
      pokemon: stubPokemon(props.id, props.name),
      species: null,
      versionGroup: props.versionGroup,
      types: props.types,
      abilities: props.abilities,
    }),
  );
}

describe('SideStack matchup ability switcher', () => {
  const bulbasaur = [
    { slug: 'overgrow', hidden: false },
    { slug: 'chlorophyll', hidden: true },
  ];
  const snorlax = [
    { slug: 'immunity', hidden: false },
    { slug: 'thick-fat', hidden: false },
  ];
  const bronzong = [
    { slug: 'levitate', hidden: false },
    { slug: 'heatproof', hidden: false },
    { slug: 'heavy-metal', hidden: true },
  ];
  const shedinja = [{ slug: 'wonder-guard', hidden: false }];

  it('hides the switcher when every ability matches the bare chart', () => {
    const out = html({
      id: 1,
      name: 'bulbasaur',
      versionGroup: 'scarlet-violet',
      types: ['grass', 'poison'],
      abilities: bulbasaur,
    });
    expect(out).not.toContain('role="tablist"');
    expect(out).not.toContain('Chart is for Overgrow');
    expect(out).toContain('Overgrow');
    expect(out).not.toContain('role="radio"');
  });

  it('renders a compact switcher when two abilities produce different tables', () => {
    const out = html({
      id: 143,
      name: 'snorlax',
      versionGroup: 'emerald',
      types: ['normal'],
      abilities: snorlax,
    });
    expect(out).toContain('role="tablist"');
    expect(out).toContain('aria-label="Ability"');
    expect(out).toContain('Immunity');
    expect(out).toContain('Thick Fat');
    /* Default Immunity is a no-op in computeMatchups; hint only after Thick Fat. */
    expect(out).not.toContain('Chart is for Immunity');
  });

  it('shows Bronzong segments including the Heavy Metal type-chart path', () => {
    const out = html({
      id: 437,
      name: 'bronzong',
      versionGroup: 'diamond-pearl',
      types: ['steel', 'psychic'],
      abilities: bronzong,
    });
    expect(out).toContain('role="tablist"');
    expect(out).toContain('Levitate');
    expect(out).toContain('Heatproof');
    expect(out).toContain('Heavy Metal');
    expect(out).toContain('Chart is for Levitate');
  });

  it('keeps Shedinja on Wonder Guard with a hint and no extra types segment', () => {
    const out = html({
      id: 292,
      name: 'shedinja',
      versionGroup: 'emerald',
      types: ['bug', 'ghost'],
      abilities: shedinja,
    });
    expect(out).not.toContain('role="tablist"');
    expect(out).toContain('Chart is for Wonder Guard');
    expect(out).toContain('incl. Wonder Guard');
  });

  it('shows a bare type chart in editions without abilities', () => {
    const out = html({
      id: 437,
      name: 'bronzong',
      versionGroup: 'red-blue',
      types: ['steel', 'psychic'],
      abilities: bronzong,
    });
    expect(out).not.toContain('role="tablist"');
    expect(out).not.toContain('Chart is for');
  });
});
