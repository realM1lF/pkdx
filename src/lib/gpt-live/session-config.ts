/** Session + Responses-delegation config for the local GPT-Live demo.
 * Used by the trusted Vite middleware. Do not import from the browser page. */
import { DEFAULT_GPT_LIVE_VOICE, type GptLiveVoice } from './voices';

export const GPT_LIVE_MODEL = 'gpt-live-1';
export const GPT_LIVE_BACKEND_MODEL = 'gpt-5.6-terra';
export const GET_SPECIES_STATS = 'get_species_stats';

export const LIVE_INSTRUCTIONS = [
  'You are MyPokePanion\'s local Pokédex voice demo.',
  'Speak the user\'s language (German or English). Keep answers short.',
  'For any factual species stat, BST, or type question, delegate to the backend.',
  'Never invent, recall, or estimate base stats from memory.',
  'Colloquial "Attack Speed" / "Angriffsgeschwindigkeit" means Speed (initiative), not a separate stat.',
  'Generation I (Red, Blue, Yellow) has HP, Attack, Defense, Special, Speed — one Special, no Sp. Atk / Sp. Def split.',
  'If the backend returns an error, say so and ask a short clarifying question.',
  'You cannot read the website. You only know what tools return.',
].join(' ');

export const BACKEND_INSTRUCTIONS = [
  'Look up Pokémon stats only via get_species_stats. Always call the tool before answering a stats question.',
  'Pass species_query as spoken (German or English names both resolve). Pass game as the named edition (red, rote edition, yellow, firered, …).',
  'Map "Attack Speed" / "Angriffsgeschwindigkeit" to Speed when reading the result.',
  'For Gen I games, use stats.special (one Special) and stats.speed. Do not quote modern Sp. Atk as Gen I Special.',
  'Do not invent numbers. If the tool errors, report that error.',
  'Return a concise spoken-ready summary the live voice can read aloud.',
].join(' ');

export const GET_SPECIES_STATS_TOOL = {
  type: 'function' as const,
  name: GET_SPECIES_STATS,
  description:
    'Resolve a German or English Pokémon name and return generation-correct base stats for a named game. Use this for every factual Dex stats question.',
  parameters: {
    type: 'object',
    properties: {
      species_query: {
        type: 'string',
        description: 'Species name or dex number as spoken, e.g. Glurak, Charizard, 6.',
      },
      game: {
        type: 'string',
        description:
          'Game or edition, e.g. red, rote edition, blue, yellow, firered, scarlet. Gen I uses Red/Blue/Yellow semantics.',
      },
    },
    required: ['species_query', 'game'],
    additionalProperties: false,
  },
};

export function liveSessionBody(voice: GptLiveVoice = DEFAULT_GPT_LIVE_VOICE) {
  return {
    model: GPT_LIVE_MODEL,
    instructions: LIVE_INSTRUCTIONS,
    audio: { output: { voice } },
    delegation: {
      type: 'responses' as const,
      responses: {
        model: GPT_LIVE_BACKEND_MODEL,
        instructions: BACKEND_INSTRUCTIONS,
        tools: [GET_SPECIES_STATS_TOOL],
        tool_choice: 'auto' as const,
        parallel_tool_calls: false,
      },
    },
  };
}
