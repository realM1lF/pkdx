/** Browser globals required by src/i18n side effects during versus imports. */
globalThis.document = {
  documentElement: { lang: 'en' },
} as Document;

/** Node 20 has no native WebSocket — the supabase realtime client throws at
 * import time without one (nuzlocke-store ← teambuilder ← versus chain).
 * A never-used stub constructor is enough: tests never open realtime
 * connections, the client only validates the constructor exists. */
if (typeof globalThis.WebSocket === 'undefined') {
  class WebSocketStub {
    constructor() {
      throw new Error('WebSocket is not available in vitest');
    }
  }
  globalThis.WebSocket = WebSocketStub as unknown as typeof WebSocket;
}
