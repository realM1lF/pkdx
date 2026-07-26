/* check-csp.mjs — serve dist/ with the exact production headers from
 * netlify.toml and drive a real browser over the app, collecting every
 * Content-Security-Policy violation.
 *
 * The CSP is parsed out of netlify.toml rather than duplicated here, so this
 * check can never drift from what Netlify actually sends.
 *
 *   node scripts/check-csp.mjs            # representative route sample
 *   node scripts/check-csp.mjs --offline  # skip routes needing third parties
 *
 * Exit code 1 = at least one violation or page error. Run it after any change
 * to index.html, netlify.toml, or a new external data source.
 */
import http from 'node:http';
import path from 'node:path';
import { createReadStream, existsSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');

if (!existsSync(path.join(dist, 'index.html'))) {
  console.error('[csp] dist/ missing — run `npm run build` first.');
  process.exit(1);
}

/* ---------- pull the real headers out of netlify.toml ---------- */
const toml = readFileSync(path.join(root, 'netlify.toml'), 'utf8');
/* The catch-all block only: start after `for = "/*"` and stop at the next
 * [[headers]] section. Cutting at the boundary matters — the Cache-Control
 * overrides for /assets, /sprites and /fonts are declared after it. */
const catchAll = (toml.split('for = "/*"')[1] ?? '').split('[[headers]]')[0];
const headers = {};
for (const line of catchAll.split('\n')) {
  const m = line.match(/^\s*([A-Za-z-]+)\s*=\s*"([\s\S]*)"\s*$/);
  if (m && m[1] !== 'for') headers[m[1]] = m[2];
}
const csp = headers['Content-Security-Policy'];
if (!csp) {
  console.error('[csp] no Content-Security-Policy found in netlify.toml');
  process.exit(1);
}
console.log('[csp] header parsed from netlify.toml:');
for (const d of csp.split(';')) console.log('   ', d.trim());
console.log();

/* ---------- playwright ---------- */
function loadPlaywright() {
  const candidates = [
    path.join(root, 'node_modules'),
    process.env.NODE_PATH,
    '/usr/local/lib/node_modules',
    '/usr/lib/node_modules',
  ].filter(Boolean);
  for (const base of candidates) {
    try {
      return createRequire(path.join(base, 'noop.js'))('playwright');
    } catch {
      /* next */
    }
  }
  return null;
}
const playwright = loadPlaywright();
if (!playwright) {
  console.error('[csp] playwright not installed');
  process.exit(1);
}

/* ---------- static server, same MIME + SPA fallback as prerender.mjs ---------- */
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ogg': 'audio/ogg',
};

function resolveFile(urlPath) {
  const rel = decodeURIComponent(urlPath).replace(/^\/+/, '');
  const abs = path.join(dist, rel);
  if (!abs.startsWith(dist)) return null;
  if (existsSync(abs) && statSync(abs).isFile()) return abs;
  const idx = path.join(abs, 'index.html');
  if (existsSync(idx) && statSync(idx).isFile()) return idx;
  return null;
}

const server = http.createServer((req, res) => {
  const urlPath = (req.url ?? '/').split('?')[0];
  const file = resolveFile(urlPath) ?? path.join(dist, 'index.html');
  if (!existsSync(file)) return void res.writeHead(404).end('not found');
  res.writeHead(200, {
    ...headers,
    'Content-Type': MIME[path.extname(file)] ?? 'application/octet-stream',
  });
  createReadStream(file).pipe(res);
});

await new Promise((r) => server.listen(0, '127.0.0.1', r));
const origin = `http://127.0.0.1:${server.address().port}`;
console.log(`[csp] serving dist with production headers on ${origin}\n`);

/* ---------- routes: one per distinct external dependency ---------- */
const OFFLINE = process.argv.includes('--offline');
const ROUTES = [
  { path: '/de', why: 'Home — three.js hero, GSAP, Lenis' },
  { path: '/en', why: 'Home EN' },
  { path: '/de/pokedex', why: 'listing — local sprites, PokeAPI name index' },
  { path: '/de/pokemon/25', why: 'detail — remote sprites + cries (media-src)' },
  { path: '/de/pokemon/6', why: 'detail — evolution chain, PokeAPI fetches' },
  { path: '/de/maps', why: 'maps overview' },
  { path: '/de/maps/kanto', why: 'region map — item sprites from GitHub' },
  { path: '/de/maps/kanto/route-1', why: 'route SEO page' },
  { path: '/de/nuzlocke', why: 'Supabase REST + realtime websocket' },
  { path: '/de/team', why: 'team builder — data.pkmn.cc Smogon sets' },
  { path: '/de/versus', why: 'versus — @smogon/calc' },
  { path: '/de/kampf-simulator', why: 'battle sim — lazy @pkmn/sim vendor bundle' },
  { path: '/de/items', why: 'items' },
  { path: '/de/typen', why: 'type chart' },
  { path: '/de/account', why: 'Supabase auth session' },
  { path: '/de/support', why: 'PayPal QR' },
  { path: '/en/versus/charizard-vs-blastoise', why: 'prerendered matchup page' },
];

const browser = await playwright.chromium.launch({
  headless: true,
  args: ['--enable-unsafe-swiftshader', '--no-sandbox'],
});
const context = await browser.newContext({ ignoreHTTPSErrors: true });

/* register the violation listener before any page script runs */
await context.addInitScript(() => {
  window.__cspViolations = [];
  document.addEventListener('securitypolicyviolation', (e) => {
    window.__cspViolations.push({
      directive: e.effectiveDirective || e.violatedDirective,
      blocked: e.blockedURI,
      line: e.lineNumber,
      source: e.sourceFile,
    });
  });
});

const results = [];
let totalViolations = 0;
let totalErrors = 0;

for (const route of ROUTES) {
  if (OFFLINE && /pokemon|team|pokedex|maps/.test(route.path)) continue;
  const page = await context.newPage();
  const pageErrors = [];
  const consoleErrors = [];
  const externalHosts = new Set();

  page.on('pageerror', (e) => pageErrors.push(e.message));
  page.on('console', (m) => {
    if (m.type() !== 'error') return;
    const t = m.text();
    /* network 404s from the sprite fallback chain are expected by design */
    if (/Failed to load resource/i.test(t)) return;
    consoleErrors.push(t);
  });
  page.on('request', (r) => {
    try {
      const u = new URL(r.url());
      if (u.origin !== origin && u.protocol !== 'data:' && u.protocol !== 'blob:') {
        externalHosts.add(`${u.protocol}//${u.host}`);
      }
    } catch {
      /* ignore */
    }
  });

  let status = 'ok';
  try {
    await page.goto(`${origin}${route.path}`, { waitUntil: 'load', timeout: 90_000 });
    await page.waitForFunction(() => document.getElementById('root')?.childElementCount > 0, null, {
      timeout: 30_000,
    });
    await page.waitForTimeout(4000);
  } catch (err) {
    status = `NAV FAIL: ${err.message.split('\n')[0]}`;
  }

  const violations = await page.evaluate(() => window.__cspViolations ?? []);
  const rendered = await page.evaluate(() => document.getElementById('root')?.childElementCount ?? 0);
  const plausibleOk = await page.evaluate(() => typeof window.plausible === 'function');

  totalViolations += violations.length;
  totalErrors += pageErrors.length + consoleErrors.length;
  results.push({ route, violations, pageErrors, consoleErrors, status, rendered, plausibleOk, externalHosts });

  const badge = violations.length === 0 && pageErrors.length === 0 && status === 'ok' ? 'PASS' : 'FAIL';
  console.log(
    `[${badge}] ${route.path.padEnd(34)} nodes=${String(rendered).padStart(3)} ` +
      `csp=${violations.length} err=${pageErrors.length + consoleErrors.length} plausible=${plausibleOk ? 'y' : 'n'}  (${route.why})`,
  );
  for (const v of violations) console.log(`         ✗ ${v.directive} blocked ${v.blocked} @ ${v.source}:${v.line}`);
  for (const e of pageErrors) console.log(`         ✗ pageerror: ${e.split('\n')[0]}`);
  for (const e of consoleErrors) console.log(`         ! console: ${e.slice(0, 160)}`);

  await page.close();
}

/* ---------- external hosts actually contacted ---------- */
const allHosts = new Set();
for (const r of results) for (const h of r.externalHosts) allHosts.add(h);
console.log('\n[csp] external origins contacted during the run:');
for (const h of [...allHosts].sort()) console.log('   ', h);

/* ---------- forced connectivity probes -------------------------------------
 * Page visits alone never touch Supabase, data.pkmn.cc, the cries audio or the
 * lazy sim bundle — those only load on user interaction. A CSP that blocks
 * them would therefore pass the crawl above and still break multiplayer in
 * production. So we fire each one explicitly, inside a page governed by the
 * real CSP, and check it is not refused. */
console.log('\n[csp] forced connectivity probes (run inside the CSP context):');
const probePage = await context.newPage();
await probePage.goto(`${origin}/de`, { waitUntil: 'load', timeout: 90_000 });

const SUPABASE = 'https://iqsdojzyqznmcirypdnk.supabase.co';
const SUPA_KEY = 'sb_publishable_B-cuJFNUAsfLvva9givrcA_m7QWT-fe';

const probes = await probePage.evaluate(
  async ({ supabase, key }) => {
    const out = [];
    const record = (name, ok, detail) => out.push({ name, ok, detail });

    /* connect-src: Supabase REST */
    try {
      const r = await fetch(`${supabase}/rest/v1/nuz_runs?select=id&limit=1`, {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
      });
      record('connect-src supabase REST', true, `HTTP ${r.status}`);
    } catch (e) {
      record('connect-src supabase REST', false, String(e.message || e));
    }

    /* connect-src: Supabase Realtime websocket */
    try {
      const ws = new WebSocket(`${supabase.replace('https', 'wss')}/realtime/v1/websocket?apikey=${key}&vsn=1.0.0`);
      const res = await new Promise((resolve) => {
        const done = (v) => resolve(v);
        ws.onopen = () => done('open');
        ws.onerror = () => done('error');
        setTimeout(() => done('timeout'), 8000);
      });
      try { ws.close(); } catch { /* ignore */ }
      /* a CSP refusal throws synchronously above; onerror here means network */
      record('connect-src supabase WebSocket', true, res);
    } catch (e) {
      record('connect-src supabase WebSocket', false, String(e.message || e));
    }

    /* connect-src: Smogon sets */
    try {
      const r = await fetch('https://data.pkmn.cc/sets/gen9ou.json');
      record('connect-src data.pkmn.cc', true, `HTTP ${r.status}`);
    } catch (e) {
      record('connect-src data.pkmn.cc', false, String(e.message || e));
    }

    /* media-src: PokeAPI cries */
    try {
      const a = new Audio('https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/25.ogg');
      const res = await new Promise((resolve) => {
        a.oncanplaythrough = () => resolve('canplay');
        a.onloadeddata = () => resolve('loaded');
        a.onerror = () => resolve(`media error code ${a.error?.code}`);
        setTimeout(() => resolve('timeout'), 8000);
        a.load();
      });
      record('media-src github cries', !/error/.test(res), res);
    } catch (e) {
      record('media-src github cries', false, String(e.message || e));
    }

    /* img-src: remote sprite fallback */
    try {
      const res = await new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve('loaded');
        img.onerror = () => resolve('error');
        setTimeout(() => resolve('timeout'), 8000);
        img.src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png';
      });
      record('img-src github sprites', res === 'loaded', res);
    } catch (e) {
      record('img-src github sprites', false, String(e.message || e));
    }

    /* script-src 'self': lazy @pkmn/sim vendor bundle */
    try {
      const m = await import('/vendor/pkmn-sim.mjs');
      record('script-src lazy sim bundle', Boolean(m), `exports: ${Object.keys(m).length}`);
    } catch (e) {
      record('script-src lazy sim bundle', false, String(e.message || e));
    }

    /* blob: + CompressionStream (team share links) */
    try {
      const bytes = new TextEncoder().encode('{"t":1}');
      const stream = new Blob([bytes]).stream().pipeThrough(new CompressionStream('deflate-raw'));
      const buf = await new Response(stream).arrayBuffer();
      record('blob: CompressionStream (share links)', buf.byteLength > 0, `${buf.byteLength} bytes`);
    } catch (e) {
      record('blob: CompressionStream (share links)', false, String(e.message || e));
    }

    return { out, violations: window.__cspViolations ?? [] };
  },
  { supabase: SUPABASE, key: SUPA_KEY },
);

let probeFails = 0;
for (const p of probes.out) {
  if (!p.ok) probeFails++;
  console.log(`   [${p.ok ? 'PASS' : 'FAIL'}] ${p.name.padEnd(38)} ${p.detail}`);
}
for (const v of probes.violations) {
  probeFails++;
  console.log(`   ✗ CSP blocked ${v.directive}: ${v.blocked}`);
}
await probePage.close();
totalViolations += probes.violations.length;
totalErrors += probeFails - probes.violations.length;

console.log(
  `\n[csp] ${results.length} routes · ${totalViolations} CSP violations · ${totalErrors} JS errors`,
);

await browser.close();
server.close();
process.exit(totalViolations > 0 || totalErrors > 0 ? 1 : 0);
