/* Browser WebRTC client for GPT-Live.
 * Mic + speakers on media tracks; JSON events on the `oai-events` data channel.
 * Custom tools run on our local server; results go back through the channel. */
import type { RunState } from '@/lib/nuzlocke-store';
import type { GptLiveVoice } from './voices';

export type VoiceStatus = 'idle' | 'connecting' | 'live' | 'finishing' | 'ended' | 'error';

export interface TranscriptLine {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

export interface ToolTrace {
  name: string;
  arguments: unknown;
  result: unknown;
}

export interface LiveSessionHooks {
  onStatus: (status: VoiceStatus, detail?: string) => void;
  onTranscript: (line: TranscriptLine) => void;
  onTool: (trace: ToolTrace) => void;
}

interface FunctionCallItem {
  type?: string;
  call_id?: string;
  name?: string;
  arguments?: string;
}

function logLive(message: string, detail?: unknown): void {
  if (detail === undefined) {
    console.log(`[gpt-live] ${message}`);
    return;
  }
  console.log(`[gpt-live] ${message}`, detail);
}

function eventId(): string {
  return crypto.randomUUID();
}

function sendEvent(channel: RTCDataChannel, event: Record<string, unknown>): void {
  channel.send(JSON.stringify(event));
}

function spokenHintFromToolResult(result: unknown): string | null {
  if (!result || typeof result !== 'object') return null;
  const row = result as { spoken_hint?: unknown; message?: unknown; ok?: boolean };
  if (typeof row.spoken_hint === 'string' && row.spoken_hint.trim()) return row.spoken_hint.trim();
  if (row.ok === false && typeof row.message === 'string' && row.message.trim()) return row.message.trim();
  return null;
}

async function waitForIce(connection: RTCPeerConnection): Promise<void> {
  if (connection.iceGatheringState === 'complete') return;
  await new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => {
      connection.removeEventListener('icegatheringstatechange', onState);
      reject(new Error('Timed out while gathering ICE candidates'));
    }, 10_000);
    function onState() {
      if (connection.iceGatheringState !== 'complete') return;
      clearTimeout(timeout);
      connection.removeEventListener('icegatheringstatechange', onState);
      resolve();
    }
    connection.addEventListener('icegatheringstatechange', onState);
    onState();
  });
}

const TOOL_TIMEOUT_MS = 25_000;

async function runToolOnServer(
  name: string,
  rawArgs: string,
  contextId: string,
  snapshots?: { teamSnapshot?: unknown; run?: RunState | null },
): Promise<unknown> {
  let parsed: unknown = {};
  try {
    parsed = rawArgs ? JSON.parse(rawArgs) : {};
  } catch {
    parsed = { _unparsed: rawArgs };
  }
  const payload: Record<string, unknown> = { name, arguments: parsed, contextId };
  if (snapshots?.teamSnapshot != null) payload.teamSnapshot = snapshots.teamSnapshot;
  if (snapshots?.run != null) payload.run = snapshots.run;

  const started = Date.now();
  logLive(`client tool ${name} fetch start`);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TOOL_TIMEOUT_MS);
  try {
    const response = await fetch('/api/gpt-live/tools', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    const body = (await response.json().catch(() => ({ error: 'Tool request failed.' }))) as unknown;
    const ms = Date.now() - started;
    if (!response.ok) {
      logLive(`client tool ${name} http ${response.status} ${ms}ms`);
      return {
        ok: false,
        error: 'tool_http',
        message: 'Local tool server rejected the call.',
        spoken_hint: 'Sorry, my lookup failed on the local server. Try again in a moment.',
        body,
      };
    }
    logLive(`client tool ${name} ok ${ms}ms`);
    return body;
  } catch (err) {
    const timedOut = err instanceof Error && err.name === 'AbortError';
    const ms = Date.now() - started;
    logLive(`client tool ${name} ${timedOut ? 'timeout' : 'network'} ${ms}ms`, err);
    return {
      ok: false,
      error: timedOut ? 'tool_timeout' : 'tool_network',
      message: timedOut
        ? `Tool "${name}" timed out after ${TOOL_TIMEOUT_MS}ms.`
        : `Tool "${name}" could not reach the local server.`,
      spoken_hint: timedOut
        ? 'Sorry, that lookup took too long. I could not finish it.'
        : 'Sorry, I could not reach the local lookup server.',
    };
  } finally {
    clearTimeout(timer);
  }
}

export class GptLiveSession {
  private peer: RTCPeerConnection | undefined;
  private events: RTCDataChannel | undefined;
  private microphone: MediaStream | undefined;
  private remoteAudio: HTMLAudioElement | undefined;
  private closeTimer: ReturnType<typeof setTimeout> | undefined;
  private ready = false;
  private finalized = false;
  private userBuf = '';
  private assistantBuf = '';
  private userId = '';
  private assistantId = '';
  private contextId = '';
  private teamSnapshotProvider: (() => unknown) | null = null;
  private runSnapshotProvider: (() => RunState | null) | null = null;
  private activeResponseId = '';
  private inflightTools = new Set<Promise<void>>();
  private pendingToolCalls = new Set<string>();
  private toolBatchResults: unknown[] = [];
  private toolBatchSpoken = false;
  private backendContinued = false;
  private toolsThisResponse = 0;
  private delegationWatchdog: ReturnType<typeof setTimeout> | undefined;
  private sawToolSinceDelegation = false;

  private readonly hooks: LiveSessionHooks;

  constructor(hooks: LiveSessionHooks) {
    this.hooks = hooks;
  }

  /** Attach the current local Team Builder roster for read-only coverage tools. */
  setTeamSnapshotProvider(provider: (() => unknown) | null): void {
    this.teamSnapshotProvider = provider;
  }

  /** Attach the current local Nuzlocke run for read-only run tools. */
  setRunSnapshotProvider(provider: (() => RunState | null) | null): void {
    this.runSnapshotProvider = provider;
  }

  async start(voice: GptLiveVoice): Promise<void> {
    this.cleanup();
    this.hooks.onStatus('connecting');
    this.finalized = false;

    const connection = new RTCPeerConnection();
    this.peer = connection;

    const audio = new Audio();
    audio.autoplay = true;
    this.remoteAudio = audio;
    connection.addEventListener('track', (event) => {
      audio.srcObject = new MediaStream([event.track]);
      void audio.play().catch(() => {
        this.hooks.onStatus('live', 'play-blocked');
      });
    });

    this.microphone = await navigator.mediaDevices.getUserMedia({ audio: true });
    for (const track of this.microphone.getAudioTracks()) {
      connection.addTrack(track, this.microphone);
    }

    const channel = connection.createDataChannel('oai-events');
    this.events = channel;
    channel.addEventListener('message', ({ data }) => {
      this.onChannelMessage(String(data));
    });
    channel.addEventListener('close', (event) => {
      if (event.target !== this.events) return;
      if (!this.finalized) {
        this.hooks.onStatus('error', 'Disconnected without a final session.closed event.');
        this.cleanup();
      }
    });

    const offer = await connection.createOffer();
    await connection.setLocalDescription(offer);
    await waitForIce(connection);

    const sdp = connection.localDescription?.sdp;
    if (!sdp) throw new Error('Missing local SDP offer');

    const response = await fetch('/api/gpt-live/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sdp, voice }),
    });
    const result = (await response.json().catch(() => ({}))) as {
      error?: string;
      contextId?: string;
      session?: { id?: string };
      transport?: { sdp?: string };
    };
    if (!response.ok) {
      throw new Error(result.error || 'Live session creation failed.');
    }
    this.contextId = typeof result.contextId === 'string' ? result.contextId : '';
    const answer = result.transport?.sdp;
    if (!answer) throw new Error('Session response missing SDP answer.');

    await connection.setRemoteDescription({ type: 'answer', sdp: answer });
  }

  stop(): void {
    if (!this.ready || !this.events || this.events.readyState !== 'open') {
      this.cleanup();
      this.hooks.onStatus('ended');
      return;
    }
    this.hooks.onStatus('finishing');
    sendEvent(this.events, { type: 'session.close' });
    this.closeTimer = setTimeout(() => {
      this.hooks.onStatus('ended', 'Incomplete finalization: no session.closed event.');
      this.cleanup();
    }, 15_000);
  }

  dispose(): void {
    this.cleanup();
  }

  private onChannelMessage(raw: string): void {
    let event: Record<string, unknown>;
    try {
      event = JSON.parse(raw) as Record<string, unknown>;
    } catch {
      return;
    }
    const type = typeof event.type === 'string' ? event.type : '';

    if (type === 'session.started') {
      this.ready = true;
      this.hooks.onStatus('live');
      return;
    }
    if (type === 'session.closed') {
      this.finalized = true;
      this.hooks.onStatus('ended');
      this.cleanup();
      return;
    }
    if (type === 'session.input_transcript.delta') {
      this.appendTranscript('user', typeof event.delta === 'string' ? event.delta : '');
      return;
    }
    if (type === 'session.output_transcript.delta') {
      this.appendTranscript('assistant', typeof event.delta === 'string' ? event.delta : '');
      return;
    }
    if (type === 'session.output_audio.delta') {
      logLive('live output_audio.delta');
      return;
    }
    if (type === 'session.commentary.appended') {
      logLive('live commentary.appended', event.client_event_id);
      return;
    }
    if (type === 'session.delegation.created') {
      const delegation = event.delegation as { id?: string; target?: string } | undefined;
      logLive('delegation.created', { id: delegation?.id, target: delegation?.target });
      this.resetToolBatch();
      this.sawToolSinceDelegation = false;
      clearTimeout(this.delegationWatchdog);
      this.delegationWatchdog = setTimeout(() => {
        if (this.sawToolSinceDelegation) return;
        logLive('delegation stall: no function_call within 30s after delegation.created');
      }, 30_000);
      return;
    }
    if (type === 'response.event' && event.event && typeof event.event === 'object') {
      void this.onNestedResponse(event.event as Record<string, unknown>);
    }
  }

  private async onNestedResponse(inner: Record<string, unknown>): Promise<void> {
    const innerType = typeof inner.type === 'string' ? inner.type : '';

    if (innerType === 'response.created') {
      const response = inner.response as { id?: string } | undefined;
      const id = typeof response?.id === 'string' ? response.id : '';
      if (id) {
        this.activeResponseId = id;
        logLive('backend response.created', id);
      }
      return;
    }

    if (innerType === 'response.output_text.delta') {
      const delta = typeof inner.delta === 'string' ? inner.delta : '';
      if (delta) logLive('backend output_text.delta', { chars: delta.length });
      return;
    }

    if (innerType === 'response.output_item.done') {
      const item = inner.item as FunctionCallItem | undefined;
      if (!item || item.type !== 'function_call' || !item.call_id || !item.name) {
        if (item?.type) logLive('backend output_item.done', item.type);
        return;
      }
      this.sawToolSinceDelegation = true;
      clearTimeout(this.delegationWatchdog);
      this.toolsThisResponse += 1;
      const job = this.submitFunctionCall(item);
      this.inflightTools.add(job);
      void job.finally(() => {
        this.inflightTools.delete(job);
      });
      return;
    }

    if (innerType === 'response.completed') {
      const response = inner.response as { id?: string } | undefined;
      const id = typeof response?.id === 'string' ? response.id : this.activeResponseId;
      logLive('backend response.completed', { id, tools: this.toolsThisResponse });
      if (this.inflightTools.size > 0) {
        await Promise.all([...this.inflightTools]);
      }
      await this.finishToolBatch();
      return;
    }

    if (innerType.startsWith('response.')) {
      logLive(`backend ${innerType}`);
    }
  }

  private async submitFunctionCall(item: FunctionCallItem): Promise<void> {
    if (!this.events || this.events.readyState !== 'open') return;
    if (!item.call_id || !item.name) return;

    this.pendingToolCalls.add(item.call_id);
    const teamSnapshot = this.teamSnapshotProvider?.() ?? undefined;
    const run = this.runSnapshotProvider?.() ?? undefined;
    let result: unknown;
    try {
      result = await runToolOnServer(item.name, item.arguments ?? '', this.contextId, {
        teamSnapshot,
        run,
      });
    } catch (err) {
      result = {
        ok: false,
        error: 'tool_exception',
        message: err instanceof Error ? err.message : 'Tool execution failed.',
        spoken_hint: 'Sorry, something went wrong during the lookup.',
      };
    }
    this.pendingToolCalls.delete(item.call_id);
    this.toolBatchResults.push(result);
    this.hooks.onTool({ name: item.name, arguments: item.arguments, result });
    sendEvent(this.events, {
      type: 'response.item.create',
      event_id: eventId(),
      item: {
        type: 'function_call_output',
        call_id: item.call_id,
        output: JSON.stringify(result),
      },
    });
    await this.finishToolBatch();
  }

  private resetToolBatch(): void {
    this.pendingToolCalls.clear();
    this.toolBatchResults = [];
    this.toolBatchSpoken = false;
    this.backendContinued = false;
    this.toolsThisResponse = 0;
  }

  /** After all tool outputs: continue backend once, then hand results to Live audio. */
  private async finishToolBatch(): Promise<void> {
    if (!this.events || this.events.readyState !== 'open') return;
    if (this.pendingToolCalls.size > 0) return;
    if (this.toolBatchResults.length === 0) return;

    if (!this.backendContinued) {
      this.backendContinued = true;
      logLive('backend response.create (after tools)', { tools: this.toolsThisResponse });
      sendEvent(this.events, { type: 'response.create', event_id: eventId() });
    }
    this.speakToolBatch();
  }

  /** Feed verified tool results to the Live voice model (backend text is not spoken). */
  private speakToolBatch(): void {
    if (!this.events || this.events.readyState !== 'open') return;
    if (this.toolBatchSpoken) return;
    const hints = this.toolBatchResults
      .map((result) => spokenHintFromToolResult(result))
      .filter((hint): hint is string => Boolean(hint));
    if (hints.length === 0) return;
    this.toolBatchSpoken = true;
    const content = hints.join(' ');
    logLive('live commentary.append', { chars: content.length });
    sendEvent(this.events, {
      type: 'session.commentary.append',
      event_id: eventId(),
      delegation_id: null,
      content,
    });
  }

  private appendTranscript(role: 'user' | 'assistant', delta: string): void {
    if (!delta) return;
    if (role === 'user') {
      if (!this.userId) this.userId = eventId();
      this.userBuf += delta;
      this.hooks.onTranscript({ id: this.userId, role, text: this.userBuf });
      this.assistantId = '';
      this.assistantBuf = '';
    } else {
      if (!this.assistantId) this.assistantId = eventId();
      this.assistantBuf += delta;
      this.hooks.onTranscript({ id: this.assistantId, role, text: this.assistantBuf });
      this.userId = '';
      this.userBuf = '';
    }
  }

  private cleanup(): void {
    clearTimeout(this.closeTimer);
    clearTimeout(this.delegationWatchdog);
    this.closeTimer = undefined;
    this.delegationWatchdog = undefined;
    this.inflightTools.clear();
    this.resetToolBatch();
    this.activeResponseId = '';
    this.sawToolSinceDelegation = false;
    this.microphone?.getTracks().forEach((track) => track.stop());
    this.events?.close();
    this.peer?.close();
    if (this.remoteAudio) {
      this.remoteAudio.srcObject = null;
    }
    this.microphone = undefined;
    this.events = undefined;
    this.peer = undefined;
    this.remoteAudio = undefined;
    this.ready = false;
    this.contextId = '';
  }
}
