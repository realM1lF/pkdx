/**
 * Domain contract — GPT-Live check_slot_legality wrapper.
 *
 * Page call chain (Team Builder — binding):
 *   getPokemon → slotLegality(slot, versionGroup, pokemon)
 *
 * Uses resolveSpecies + resolveGame. Optional moves/item/ability/nature as spoken.
 * Must-not: parallel legality math, saveTeam, or invented learnsets.
 *
 * Test map: check-slot-legality.test.ts, teambuilder-species.test.ts, spoken-eval.test.ts.
 */
import { genSpecies } from '@/lib/gen-dex';
import { getPokemon } from '@/lib/pokeapi';
import {
  emptySlot,
  legalityReasonText,
  slotLegality,
  type LegalityReason,
  type SlotLegality,
} from '@/lib/teambuilder';
import type { GptLiveSessionContext } from './session-context';
import {
  resolveAbilityQuery,
  resolveItemQuery,
  resolveMoveQuery,
  resolveNatureQuery,
} from './team-tool-utils';
import {
  resolveGame,
  resolveSpecies,
  type GameHit,
  type SpeciesHit,
} from './species-stats';

export const CHECK_SLOT_LEGALITY = 'check_slot_legality';

export const CHECK_SLOT_LEGALITY_TOOL = {
  type: 'function' as const,
  name: CHECK_SLOT_LEGALITY,
  description:
    'Check whether a species slot is legal in a named game: species, up to four moves, and optional item, ability, or nature. Read-only legality flags only.',
  strict: true as const,
  parameters: {
    type: 'object' as const,
    properties: {
      species_query: {
        type: 'string',
        description: 'Species as spoken, e.g. Glurak, Charizard, 6.',
      },
      game: {
        type: ['string', 'null'],
        description:
          'Game or edition, e.g. firered, rote edition. Null when the session already has a game.',
      },
      moves: {
        type: ['array', 'null'],
        items: { type: 'string' },
        description: 'Up to four move names as spoken, e.g. Flammenwurf, Flamethrower. Null for species-only check.',
      },
      item: {
        type: ['string', 'null'],
        description: 'Held item as spoken, or null.',
      },
      ability: {
        type: ['string', 'null'],
        description: 'Ability as spoken, or null.',
      },
      nature: {
        type: ['string', 'null'],
        description: 'Nature as spoken, or null.',
      },
    },
    required: ['species_query', 'game', 'moves', 'item', 'ability', 'nature'],
    additionalProperties: false as const,
  },
};

export type SlotLegalityOk = {
  ok: true;
  species: SpeciesHit;
  game: GameHit;
  legal: boolean;
  reasons: LegalityReason[];
  moves_checked: string[];
  spoken_hint: string;
};

export type SlotLegalityErr = {
  ok: false;
  error:
    | 'unknown_species'
    | 'unknown_game'
    | 'not_in_game'
    | 'unknown_move'
    | 'unknown_item'
    | 'unknown_ability'
    | 'unknown_nature'
    | 'invalid_arguments';
  message: string;
  species?: SpeciesHit;
  game?: GameHit;
};

export type CheckSlotLegalityResult = SlotLegalityOk | SlotLegalityErr;

function stringArg(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function nullableStringArray(value: unknown): string[] | null {
  if (value == null) return null;
  if (!Array.isArray(value)) return null;
  return value.filter((row): row is string => typeof row === 'string');
}

function spokenHint(input: {
  species: SpeciesHit;
  game: GameHit;
  legal: boolean;
  reasons: LegalityReason[];
  moves: string[];
}): string {
  const label = `${input.species.nameEn} / ${input.species.nameDe}, ${input.game.label}`;
  if (input.legal) {
    const movePart = input.moves.length ? `, moves ${input.moves.join(', ')}` : '';
    return `${label}: legal${movePart}.`;
  }
  const codes = input.reasons.map((r) => (r.param ? `${r.key}:${r.param}` : r.key)).join('; ');
  return `${label}: illegal — ${codes}.`;
}

export async function checkSlotLegalityPair(
  speciesQuery: string,
  gameQuery: string,
  options: {
    moves?: string[] | null;
    item?: string | null;
    ability?: string | null;
    nature?: string | null;
  } = {},
): Promise<CheckSlotLegalityResult> {
  const species = resolveSpecies(speciesQuery);
  if (!species) {
    return {
      ok: false,
      error: 'unknown_species',
      message: `No species matched "${speciesQuery.trim()}".`,
    };
  }

  const game = resolveGame(gameQuery);
  if (!game) {
    return {
      ok: false,
      error: 'unknown_game',
      message: `No game matched "${gameQuery.trim()}".`,
      species,
    };
  }

  if (!genSpecies(game.versionGroup, species.slug)?.exists) {
    return {
      ok: false,
      error: 'not_in_game',
      message: `${species.nameEn} is not in ${game.label}.`,
      species,
      game,
    };
  }

  const slot = emptySlot();
  slot.pokemon = species.slug;
  slot.pokemonId = species.id;

  const movesChecked: string[] = [];
  const spokenMoves = options.moves ?? [];
  for (let i = 0; i < Math.min(spokenMoves.length, 4); i++) {
    const spoken = spokenMoves[i]?.trim();
    if (!spoken) continue;
    const slug = resolveMoveQuery(spoken);
    if (!slug) {
      return {
        ok: false,
        error: 'unknown_move',
        message: `No move matched "${spoken}".`,
        species,
        game,
      };
    }
    slot.moves[i] = slug;
    movesChecked.push(slug);
  }

  if (options.item) {
    const item = resolveItemQuery(options.item, game.versionGroup);
    if (!item) {
      return {
        ok: false,
        error: 'unknown_item',
        message: `No item matched "${options.item.trim()}".`,
        species,
        game,
      };
    }
    slot.item = item;
  }

  if (options.ability) {
    const ability = resolveAbilityQuery(options.ability, game.versionGroup, species.slug);
    if (!ability) {
      return {
        ok: false,
        error: 'unknown_ability',
        message: `No ability matched "${options.ability.trim()}" for ${species.nameEn}.`,
        species,
        game,
      };
    }
    slot.ability = ability;
  }

  if (options.nature) {
    const nature = resolveNatureQuery(options.nature, game.versionGroup);
    if (!nature) {
      return {
        ok: false,
        error: 'unknown_nature',
        message: `No nature matched "${options.nature.trim()}".`,
        species,
        game,
      };
    }
    slot.nature = nature;
  }

  let pokemon;
  try {
    pokemon = await getPokemon(species.slug);
  } catch {
    pokemon = undefined;
  }

  const legality: SlotLegality = slotLegality(slot, game.versionGroup, pokemon);
  return {
    ok: true,
    species,
    game,
    legal: legality.legal,
    reasons: legality.reasons,
    moves_checked: movesChecked,
    spoken_hint: spokenHint({
      species,
      game,
      legal: legality.legal,
      reasons: legality.reasons,
      moves: movesChecked,
    }),
  };
}

export function checkSlotLegalityFromArgs(
  args: unknown,
  ctx: Pick<GptLiveSessionContext, 'gameQuery'> = {},
): Promise<CheckSlotLegalityResult> {
  if (!args || typeof args !== 'object') {
    return Promise.resolve({
      ok: false,
      error: 'invalid_arguments',
      message: 'Expected an object with species_query and game.',
    });
  }
  const rec = args as Record<string, unknown>;
  const speciesQuery = stringArg(rec.species_query);
  const gameQuery = stringArg(rec.game) || ctx.gameQuery || '';
  if (!speciesQuery.trim() || !gameQuery.trim()) {
    return Promise.resolve({
      ok: false,
      error: 'invalid_arguments',
      message: 'species_query is required. game is required unless the session already has a game.',
    });
  }
  return checkSlotLegalityPair(speciesQuery, gameQuery, {
    moves: nullableStringArray(rec.moves),
    item: rec.item == null ? null : stringArg(rec.item) || null,
    ability: rec.ability == null ? null : stringArg(rec.ability) || null,
    nature: rec.nature == null ? null : stringArg(rec.nature) || null,
  });
}

/** EN reason labels for spoken_hint enrichment (structured reasons stay as keys). */
export function legalityReasonLabels(reasons: LegalityReason[]): string[] {
  return reasons.map((r) => legalityReasonText(r, 'en'));
}
