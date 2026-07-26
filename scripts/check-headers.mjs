/* check-headers.mjs — verify the HTTP headers a deployed environment really
 * sends. Netlify merges header rules and, on conflict, the LAST matching rule
 * wins; that precedence cannot be reproduced locally, so it has to be checked
 * against a live URL.
 *
 *   node scripts/check-headers.mjs                       # production
 *   node scripts/check-headers.mjs https://deploy-preview-x--site.netlify.app
 *
 * Exit code 1 if a required security header is missing or a caching rule is
 * not in effect.
 */

const SITE = (process.argv[2] || 'https://mypokepanion.com').replace(/\/$/, '');

const green = (s) => `\x1b[32m${s}\x1b[0m`;
const red = (s) => `\x1b[31m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;

let fails = 0;
let warns = 0;
const ok = (m) => console.log(`  ${green('OK')}    ${m}`);
const bad = (m) => { fails++; console.log(`  ${red('FAIL')}  ${m}`); };
const warn = (m) => { warns++; console.log(`  ${yellow('WARN')}  ${m}`); };

async function head(path) {
  const res = await fetch(`${SITE}${path}`, { method: 'GET', redirect: 'follow' });
  const h = {};
  res.headers.forEach((v, k) => (h[k.toLowerCase()] = v));
  return { status: res.status, h, body: res };
}

/* required on every HTML response */
const REQUIRED = {
  'content-security-policy': (v) =>
    v.includes("default-src 'self'") &&
    !/script-src[^;]*unsafe-inline/.test(v) &&
    v.includes("frame-ancestors 'none'") &&
    v.includes("object-src 'none'"),
  'strict-transport-security': (v) => /max-age=\d{7,}/.test(v) && v.includes('includeSubDomains'),
  'x-content-type-options': (v) => v === 'nosniff',
  'x-frame-options': (v) => /deny|sameorigin/i.test(v),
  'referrer-policy': (v) => v.length > 0,
  'permissions-policy': (v) => v.length > 0,
};

console.log(`\nHeader check — ${SITE}\n`);

console.log('1. Security headers on the document:');
const root = await head('/');
if (root.status !== 200) bad(`GET / returned HTTP ${root.status}`);
for (const [name, valid] of Object.entries(REQUIRED)) {
  const v = root.h[name];
  if (!v) bad(`${name}: missing`);
  else if (!valid(v)) bad(`${name}: present but unexpected — ${v.slice(0, 110)}`);
  else ok(`${name}`);
}

console.log('\n2. CSP allows every origin the app needs:');
const csp = root.h['content-security-policy'] ?? '';
for (const origin of [
  'https://plausible.io',
  'https://pokeapi.co',
  'https://raw.githubusercontent.com',
  'https://data.pkmn.cc',
  'https://pkmn.github.io',
  'wss://iqsdojzyqznmcirypdnk.supabase.co',
]) {
  csp.includes(origin) ? ok(`allows ${origin}`) : bad(`CSP is missing ${origin}`);
}

console.log('\n3. Caching (Netlify: last matching rule wins):');
const idx = await head('/');
if (/max-age=0|no-cache|must-revalidate/.test(idx.h['cache-control'] ?? '')) {
  ok(`index.html revalidates — ${idx.h['cache-control']}`);
} else {
  bad(`index.html should revalidate, got: ${idx.h['cache-control']}`);
}

/* find a hashed asset from the served HTML */
const html = await (await fetch(SITE)).text();
const asset = html.match(/\/assets\/[A-Za-z0-9._-]+\.js/)?.[0];
const immutableTargets = [
  ['hashed asset', asset],
  ['sprite', '/sprites/pokemon/25.png'],
  ['font', '/fonts/orbitron/orbitron-700.ttf'],
];
for (const [label, p] of immutableTargets) {
  if (!p) { warn(`${label}: could not determine a URL to test`); continue; }
  const r = await head(p);
  const cc = r.h['cache-control'] ?? '';
  if (r.status !== 200) { warn(`${label} ${p}: HTTP ${r.status}`); continue; }
  if (cc.includes('immutable')) ok(`${label} is immutable — ${cc}`);
  else bad(`${label} ${p} is not immutable — ${cc} (is the "/*" block still declared first?)`);
  /* security headers must survive the override */
  if (!r.h['x-content-type-options']) warn(`${label}: lost x-content-type-options in the override`);
}

console.log(`\n${'─'.repeat(60)}`);
console.log(`${fails} failed · ${warns} warnings`);
console.log(fails === 0 ? green('Headers are as intended.') : red('Header configuration needs attention.'));
console.log();
process.exit(fails > 0 ? 1 : 0);
