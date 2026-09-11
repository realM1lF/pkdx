/**
 * Trusted local session + tool API for GPT-Live.
 * Server-only — never import this module from pages or components.
 * The Vite middleware loads it via ssrLoadModule so OPENAI_API_KEY stays in Node.
 */
import { GET_SPECIES_STATS, liveSessionBody } from './session-config';
import { getSpeciesStatsFromArgs } from './species-stats';
import { resolveSessionVoice } from './voices';

const OPENAI_LIVE_SESSIONS = 'https://api.openai.com/v1/live/sessions';

function envRecord(): Record<string, string | undefined> {
  const proc = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process;
  return proc?.env ?? {};
}

export function openaiApiKey(): string {
  return envRecord().OPENAI_API_KEY?.trim() ?? '';
}

export function gptLiveHealth(): { ok: true; demo: true; hasKey: boolean } {
  return { ok: true, demo: true, hasKey: Boolean(openaiApiKey()) };
}

export async function createGptLiveSession(
  sdp: string,
  voiceRaw?: unknown,
): Promise<{ status: number; body: unknown }> {
  if (!sdp.trim()) {
    return { status: 400, body: { error: 'An SDP offer is required.' } };
  }
  const voice = resolveSessionVoice(voiceRaw);
  if (!voice) {
    return { status: 400, body: { error: 'Unknown voice.' } };
  }
  const key = openaiApiKey();
  if (!key) {
    return { status: 503, body: { error: 'Set OPENAI_API_KEY on the local server.' } };
  }

  const response = await fetch(OPENAI_LIVE_SESSIONS, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      session: liveSessionBody(voice),
      transport: { type: 'webrtc', sdp },
    }),
  });

  const text = await response.text();
  let parsed: unknown = text;
  try {
    parsed = JSON.parse(text) as unknown;
  } catch {
    parsed = { error: 'Live session creation failed.' };
  }

  if (!response.ok) {
    const status = response.status >= 400 && response.status < 600 ? response.status : 502;
    return { status, body: { error: 'Live session creation failed.' } };
  }

  return { status: 201, body: parsed };
}

export function executeGptLiveTool(name: string, args: unknown): unknown {
  if (name !== GET_SPECIES_STATS) {
    return { ok: false, error: 'unknown_tool', message: `Unsupported tool "${name}".` };
  }
  return getSpeciesStatsFromArgs(args);
}
