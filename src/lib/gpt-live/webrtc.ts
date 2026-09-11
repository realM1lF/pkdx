/* Browser WebRTC client for GPT-Live.
 * Mic + speakers on media tracks; JSON events on the `oai-events` data channel.
 * Custom tools run on our local server; results go back through the channel. */

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

function eventId(): string {
  return crypto.randomUUID();
}

function sendEvent(channel: RTCDataChannel, event: Record<string, unknown>): void {
  channel.send(JSON.stringify(event));
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

async function runToolOnServer(name: string, rawArgs: string): Promise<unknown> {
  let parsed: unknown = {};
  try {
    parsed = rawArgs ? JSON.parse(rawArgs) : {};
  } catch {
    parsed = { _unparsed: rawArgs };
  }
  const response = await fetch('/api/gpt-live/tools', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, arguments: parsed }),
  });
  const body = (await response.json().catch(() => ({ error: 'Tool request failed.' }))) as unknown;
  if (!response.ok) {
    return { ok: false, error: 'tool_http', message: 'Local tool server rejected the call.', body };
  }
  return body;
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

  private readonly hooks: LiveSessionHooks;

  constructor(hooks: LiveSessionHooks) {
    this.hooks = hooks;
  }

  async start(): Promise<void> {
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
      body: JSON.stringify({ sdp }),
    });
    const result = (await response.json().catch(() => ({}))) as {
      error?: string;
      session?: { id?: string };
      transport?: { sdp?: string };
    };
    if (!response.ok) {
      throw new Error(result.error || 'Live session creation failed.');
    }
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
    if (type === 'response.event' && event.event && typeof event.event === 'object') {
      void this.onNestedResponse(event.event as Record<string, unknown>);
    }
  }

  private async onNestedResponse(inner: Record<string, unknown>): Promise<void> {
    if (inner.type !== 'response.output_item.done') return;
    const item = inner.item as FunctionCallItem | undefined;
    if (!item || item.type !== 'function_call' || !item.call_id || !item.name) return;
    if (!this.events || this.events.readyState !== 'open') return;

    const result = await runToolOnServer(item.name, item.arguments ?? '');
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
    sendEvent(this.events, { type: 'response.create', event_id: eventId() });
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
    this.closeTimer = undefined;
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
  }
}
