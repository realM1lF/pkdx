/**
 * Vite-only GPT-Live session server.
 * Holds OPENAI_API_KEY in the Node process and never ships it to the client.
 * Inactive unless VITE_GPT_LIVE_DEMO=true (dev server only).
 */
import { loadEnv } from 'vite';

const PREFIX = '/api/gpt-live';
const TOOL_TIMEOUT_MS = 25_000;

function withTimeout(promise, ms, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`${label}_timeout`)), ms);
    }),
  ]);
}

function isLocalOrigin(origin) {
  if (!origin) return false;
  try {
    const url = new URL(origin);
    return url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  } catch {
    return false;
  }
}

function readJsonBody(req, limit = 64 * 1024) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > limit) {
        reject(new Error('payload_too_large'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      if (chunks.length === 0) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')));
      } catch {
        reject(new Error('invalid_json'));
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, status, body) {
  const payload = JSON.stringify(body);
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(payload);
}

export function gptLiveDevPlugin() {
  return {
    name: 'gpt-live-dev',
    apply: 'serve',
    configureServer(server) {
      const env = loadEnv(server.config.mode, server.config.envDir || process.cwd(), '');
      if (env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY) {
        process.env.OPENAI_API_KEY = env.OPENAI_API_KEY;
      }
      const enabled =
        env.VITE_GPT_LIVE_DEMO === 'true' || process.env.VITE_GPT_LIVE_DEMO === 'true';
      if (!enabled) return;

      let apiPromise;
      const loadApi = () => {
        if (!apiPromise) {
          apiPromise = server.ssrLoadModule('/src/lib/gpt-live/server-api.ts');
        }
        return apiPromise;
      };
      void loadApi().catch((err) => {
        console.error('[gpt-live] failed to preload server module', err);
        apiPromise = undefined;
      });

      const loadApiFresh = () => {
        apiPromise = server.ssrLoadModule('/src/lib/gpt-live/server-api.ts');
        return apiPromise;
      };

      console.log('[gpt-live] local demo routes on /api/gpt-live/*');

      server.middlewares.use((req, res, next) => {
        const url = (req.url ?? '').split('?')[0];
        if (!url.startsWith(PREFIX)) return next();

        Promise.resolve()
          .then(async () => {
            if (req.method === 'OPTIONS') {
              res.statusCode = 204;
              res.end();
              return;
            }

            const origin = req.headers.origin;
            if (origin && !isLocalOrigin(origin)) {
              sendJson(res, 403, { error: 'Unexpected request origin.' });
              return;
            }

            let api;
            try {
              api = await loadApi();
            } catch (err) {
              console.error('[gpt-live] server module load failed, retrying once', err);
              apiPromise = undefined;
              api = await loadApiFresh();
            }

            if (req.method === 'GET' && url === `${PREFIX}/health`) {
              sendJson(res, 200, api.gptLiveHealth());
              return;
            }

            if (req.method === 'POST' && url === `${PREFIX}/session`) {
              const body = await readJsonBody(req);
              if (typeof body?.sdp !== 'string') {
                sendJson(res, 400, { error: 'An SDP offer is required.' });
                return;
              }
              const result = await api.createGptLiveSession(body.sdp, body.voice);
              sendJson(res, result.status, result.body);
              return;
            }

            if (req.method === 'POST' && url === `${PREFIX}/tools`) {
              const body = await readJsonBody(req, 512 * 1024);
              if (typeof body?.name !== 'string' || !body.name.trim()) {
                sendJson(res, 400, { error: 'Tool name is required.' });
                return;
              }
              const toolName = body.name.trim();
              const started = Date.now();
              console.log(`[gpt-live] tool ${toolName} start`);
              try {
                const result = await withTimeout(
                  api.executeGptLiveTool(
                    toolName,
                    body.arguments,
                    typeof body.contextId === 'string' ? body.contextId : undefined,
                    {
                      teamSnapshot: body.teamSnapshot,
                      run: body.run,
                    },
                  ),
                  TOOL_TIMEOUT_MS,
                  toolName,
                );
                console.log(`[gpt-live] tool ${toolName} ok ${Date.now() - started}ms`);
                sendJson(res, 200, result);
              } catch (err) {
                const timedOut = err instanceof Error && err.message === `${toolName}_timeout`;
                console.error(`[gpt-live] tool ${toolName} fail ${Date.now() - started}ms`, err);
                sendJson(res, 200, {
                  ok: false,
                  error: timedOut ? 'tool_timeout' : 'tool_server_error',
                  message: timedOut
                    ? `Tool "${toolName}" timed out after ${TOOL_TIMEOUT_MS}ms.`
                    : `Tool "${toolName}" failed on the local server.`,
                  spoken_hint: timedOut
                    ? 'Sorry, that lookup took too long. I could not finish it.'
                    : 'Sorry, the local lookup failed. Try again in a moment.',
                });
              }
              return;
            }

            sendJson(res, 404, { error: 'Not found.' });
          })
          .catch((err) => {
            if (res.headersSent) return;
            if (err instanceof Error && err.message === 'invalid_json') {
              sendJson(res, 400, { error: 'Invalid JSON body.' });
              return;
            }
            if (err instanceof Error && err.message === 'payload_too_large') {
              sendJson(res, 413, { error: 'Payload too large.' });
              return;
            }
            console.error('[gpt-live]', err);
            sendJson(res, 500, { error: 'Internal GPT-Live server error.' });
          });
      });
    },
  };
}
