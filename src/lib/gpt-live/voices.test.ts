import { describe, expect, it } from 'vitest';
import { liveSessionBody } from './session-config';
import {
  DEFAULT_GPT_LIVE_VOICE,
  GPT_LIVE_VOICES,
  parseGptLiveVoice,
  resolveSessionVoice,
} from './voices';

describe('GPT-Live voice allowlist', () => {
  it('defaults to marin and accepts every built-in id', () => {
    expect(DEFAULT_GPT_LIVE_VOICE).toBe('marin');
    expect(GPT_LIVE_VOICES[0]).toBe('marin');
    for (const id of GPT_LIVE_VOICES) {
      expect(parseGptLiveVoice(id)).toBe(id);
      expect(parseGptLiveVoice(id.toUpperCase())).toBe(id);
    }
  });

  it('rejects unknown voices and treats a missing field as marin', () => {
    expect(parseGptLiveVoice('alloy')).toBeNull();
    expect(parseGptLiveVoice({ id: 'marin' })).toBeNull();
    expect(resolveSessionVoice(undefined)).toBe('marin');
    expect(resolveSessionVoice('')).toBe('marin');
    expect(resolveSessionVoice('echo')).toBeNull();
  });

  it('puts the chosen voice on audio.output.voice', () => {
    expect(liveSessionBody().audio.output.voice).toBe('marin');
    expect(liveSessionBody('quartz').audio.output.voice).toBe('quartz');
  });
});

describe('createGptLiveSession voice gate', () => {
  it('rejects unknown voices before calling OpenAI', async () => {
    const { createGptLiveSession } = await import('./server-api');
    const result = await createGptLiveSession('v=0\r\no=- 0 0 IN IP4 127.0.0.1', 'alloy');
    expect(result.status).toBe(400);
    expect(result.body).toEqual({ error: 'Unknown voice.' });
  });

  it('accepts an allowlisted voice and only then asks for a key', async () => {
    const prev = process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY;
    try {
      const { createGptLiveSession } = await import('./server-api');
      const result = await createGptLiveSession('v=0\r\no=- 0 0 IN IP4 127.0.0.1', 'quartz');
      expect(result.status).toBe(503);
      expect(result.body).toEqual({ error: 'Set OPENAI_API_KEY on the local server.' });
    } finally {
      if (prev !== undefined) process.env.OPENAI_API_KEY = prev;
    }
  });
});
