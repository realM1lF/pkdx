/** GPT-Live built-in voices. Shared by the demo page and the session server.
 * Regional notes are style hints, not language locks. */

export const GPT_LIVE_VOICES = [
  'marin',
  'quartz',
  'ripple',
  'vesper',
  'willow',
  'stone',
  'gleam',
  'meridian',
  'bossa',
  'tempo',
  'beacon',
  'delta',
  'cinder',
] as const;

export type GptLiveVoice = (typeof GPT_LIVE_VOICES)[number];

export const DEFAULT_GPT_LIVE_VOICE: GptLiveVoice = 'marin';

const VOICE_SET = new Set<string>(GPT_LIVE_VOICES);

export const GPT_LIVE_VOICE_LS = 'pdx2.gptLive.voice';

export function parseGptLiveVoice(raw: unknown): GptLiveVoice | null {
  if (typeof raw !== 'string') return null;
  const id = raw.trim().toLowerCase();
  return VOICE_SET.has(id) ? (id as GptLiveVoice) : null;
}

/** Missing/empty → default marin. Unknown string → null (caller must reject). */
export function resolveSessionVoice(raw: unknown): GptLiveVoice | null {
  if (raw === undefined || raw === null || raw === '') return DEFAULT_GPT_LIVE_VOICE;
  return parseGptLiveVoice(raw);
}

export function loadStoredVoice(): GptLiveVoice {
  try {
    return parseGptLiveVoice(localStorage.getItem(GPT_LIVE_VOICE_LS)) ?? DEFAULT_GPT_LIVE_VOICE;
  } catch {
    return DEFAULT_GPT_LIVE_VOICE;
  }
}

export function storeVoice(voice: GptLiveVoice): void {
  try {
    localStorage.setItem(GPT_LIVE_VOICE_LS, voice);
  } catch {
    /* quota */
  }
}
