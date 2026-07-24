#!/usr/bin/env node
/* prerender — static HTML for the content routes (npm postbuild).
 *
 * Serves dist/ locally (static files first, SPA fallback to /index.html —
 * same semantics as the Netlify _redirects rule), drives every localized
 * static route with headless Chromium (Playwright), waits until the SPA has
 * fully rendered (root content + correct <html lang> + settle window) and
 * saves the serialized document to dist/<lang>/<route>/index.html.
 *
 * The runtime is untouched: pages hydrate over the prerendered markup
 * (see src/main.tsx). Meta/OG/JSON-LD come from the app's own SeoHead, so
 * the static head matches the live SPA exactly.
 *
 * Playwright resolution: local node_modules first, then common global
 * install locations (PLAYWRIGHT_PATH overrides). If no Playwright or no
 * Chromium is available (e.g. a minimal CI image), the step SKIPS with a
 * warning instead of failing the build — set PRERENDER=required to make
 * any failure fatal. */
import http from 'node:http';
import { createReadStream, existsSync, mkdirSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { allLocalizedRoutes } from './seo-routes.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const REQUIRED = process.env.PRERENDER === 'required';

const fail = (msg) => {
  console.error(`[prerender] ${msg}`);
  process.exit(REQUIRED ? 1 : 0);
};

/* ---------- resolve playwright ---------- */
function loadPlaywright() {
  const candidates = [
    path.join(root, 'node_modules'),
    process.env.PLAYWRIGHT_PATH,
    '/home/kimi/.npm-global/lib/node_modules',
    '/usr/local/lib/node_modules',
    '/usr/lib/node_modules',
  ].filter(Boolean);
  for (const base of candidates) {
    try {
      const req = createRequire(path.join(base, 'noop.js'));
      return req('playwright');
    } catch {
      /* try next */
    }
  }
  return null;
}

const playwright = loadPlaywright();
if (!playwright) {
  fail('playwright not found — skipping prerender (install playwright + chromium to enable)');
}

/* ---------- static server with SPA fallback ---------- */
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
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.map': 'application/json',
};

function resolveFile(urlPath) {
  const rel = decodeURIComponent(urlPath).replace(/^\/+/, '');
  const abs = path.join(dist, rel);
  if (!abs.startsWith(dist)) return null; // path traversal guard
  if (existsSync(abs) && statSync(abs).isFile()) return abs;
  const asDirIndex = path.join(abs, 'index.html');
  if (existsSync(asDirIndex) && statSync(asDirIndex).isFile()) return asDirIndex;
  return null;
}

const server = http.createServer((req, res) => {
  const urlPath = (req.url ?? '/').split('?')[0];
  const file = resolveFile(urlPath) ?? path.join(dist, 'index.html'); // SPA fallback
  if (!existsSync(file)) {
    res.writeHead(404).end('not found');
    return;
  }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] ?? 'application/octet-stream' });
  createReadStream(file).pipe(res);
});

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const port = server.address().port;
const origin = `http://127.0.0.1:${port}`;
console.log(`[prerender] serving dist on ${origin}`);

/* ---------- render routes ---------- */
const routes = allLocalizedRoutes();
const SETTLE_MS = 2500;

let browser;
try {
  browser = await playwright.chromium.launch({
    headless: true,
    args: ['--enable-unsafe-swiftshader', '--no-sandbox'],
  });
} catch (err) {
  fail(`chromium launch failed (${err.message}) — skipping prerender`);
}

const failures = [];

async function renderRoute(browserContext, { lang, rest, path: routePath }) {
  const page = await browserContext.newPage();
  try {
    await page.goto(`${origin}${routePath}`, { waitUntil: 'load', timeout: 30_000 });
    /* SPA rendered? */
    await page.waitForFunction(
      () => document.getElementById('root')?.childElementCount > 0,
      null,
      { timeout: 20_000 },
    );
    /* locale applied? */
    await page.waitForFunction((l) => document.documentElement.lang === l, lang, {
      timeout: 10_000,
    });
    /* settle window: lazy de bundle, data chunks, fonts, entrance animations */
    await page.waitForTimeout(SETTLE_MS);
    /* home: wait until the first-visit preloader overlay has unmounted so the
     * captured HTML carries the real page, not "LOADING NATIONAL DEX" */
    if (rest === '/') {
      await page
        .waitForFunction(() => !document.body.textContent?.includes('LOADING NATIONAL DEX'), null, {
          timeout: 10_000,
        })
        .catch(() => {});
      await page.waitForTimeout(600);
    }

    /* sanity: real text content, not just the loader shell */
    const textLen = await page.evaluate(
      () => document.getElementById('root')?.innerText?.trim().length ?? 0,
    );
    if (textLen < 100) throw new Error(`only ${textLen} chars of visible text (loader stuck?)`);

    let html = await page.content();
    if (!html.includes('https://mypokepanion.com/')) {
      throw new Error('canonical/meta URLs missing in captured head');
    }
    html = html.replace('</head>', `  <!-- prerendered ${routePath} ${new Date().toISOString()} -->\n</head>`);

    const outFile =
      rest === '/'
        ? path.join(dist, lang, 'index.html')
        : path.join(dist, lang, ...rest.split('/').filter(Boolean), 'index.html');
    mkdirSync(path.dirname(outFile), { recursive: true });
    writeFileSync(outFile, html);
    console.log(`[prerender] ${routePath} → ${path.relative(root, outFile)} (${textLen} chars)`);
  } catch (err) {
    failures.push(`${routePath}: ${err.message}`);
    console.error(`[prerender] FAIL ${routePath}: ${err.message}`);
  } finally {
    await page.close();
  }
}

try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  /* small sequential pool — 3 at a time keeps memory sane and is fast enough */
  const POOL = 3;
  for (let i = 0; i < routes.length; i += POOL) {
    await Promise.all(routes.slice(i, i + POOL).map((r) => renderRoute(context, r)));
  }
} finally {
  await browser.close();
  server.close();
}

if (failures.length > 0) {
  console.error(`[prerender] ${failures.length}/${routes.length} routes failed`);
  process.exit(1);
}
console.log(`[prerender] done — ${routes.length} pages prerendered`);
