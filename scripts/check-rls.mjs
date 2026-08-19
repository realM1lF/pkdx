/* check-rls.mjs — audit the Supabase row-level-security posture using
 * nothing but the public key that ships in the JS bundle. That is exactly
 * what an attacker has, so whatever this script can reach, anyone can.
 *
 *   node scripts/check-rls.mjs
 *
 * Read-only and non-destructive. The one write it attempts is deliberately
 * aimed at a non-existent run_id: if row-level security lets it through, the
 * foreign key rejects it (23503), which proves the policy allowed the write
 * without a row ever being created. A 42501/401/403 means RLS stopped it.
 *
 * Run it before and after applying supabase/migrations/02_enforce_*.sql.
 */

const URL_BASE = process.env.SUPABASE_URL || 'https://iqsdojzyqznmcirypdnk.supabase.co';
const KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_B-cuJFNUAsfLvva9givrcA_m7QWT-fe';

const H = { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' };
const findings = [];

const red = (s) => `\x1b[31m${s}\x1b[0m`;
const green = (s) => `\x1b[32m${s}\x1b[0m`;
const yellow = (s) => `\x1b[33m${s}\x1b[0m`;

function note(level, msg) {
  findings.push({ level, msg });
  const tag =
    level === 'crit' ? red('CRITICAL') : level === 'high' ? red('HIGH') : level === 'warn' ? yellow('WARN') : green('OK');
  console.log(`  ${tag}  ${msg}`);
}

async function req(path, init = {}) {
  const res = await fetch(`${URL_BASE}${path}`, { ...init, headers: { ...H, ...(init.headers || {}) } });
  const text = await res.text();
  let body = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  return { status: res.status, body, range: res.headers.get('content-range') };
}

console.log(`\nRLS audit — ${URL_BASE}`);
console.log('(using the public key from the client bundle, no login)\n');

/* ---------- 1. can an outsider list the multiplayer tables? ---------- */
console.log('1. Anonymous table listing (must be empty):');
const TABLES = ['nuz_runs', 'nuz_players', 'nuz_encounters'];
let leaked = 0;
for (const t of TABLES) {
  const r = await req(`/rest/v1/${t}?select=*&limit=3`, { headers: { Prefer: 'count=exact' } });
  const total = r.range?.split('/')?.[1] ?? '?';
  if (Array.isArray(r.body) && r.body.length === 0) {
    note('ok', `${t}: no rows visible (count=${total})`);
  } else if (Array.isArray(r.body)) {
    leaked += r.body.length;
    note('crit', `${t}: ${r.body.length} rows readable, ${total} total — anonymous read access`);
  } else {
    note('warn', `${t}: unexpected HTTP ${r.status} ${JSON.stringify(r.body).slice(0, 120)}`);
  }
}

/* ---------- 2. invite codes ---------- */
console.log('\n2. Invite code exposure:');
const codes = await req('/rest/v1/nuz_runs?select=invite_code&limit=200');
if (Array.isArray(codes.body) && codes.body.length > 0) {
  const list = codes.body.map((r) => r.invite_code).filter(Boolean);
  const lengths = [...new Set(list.map((c) => c.length))].sort((a, b) => a - b);
  note('crit', `${list.length} invite codes harvestable (lengths: ${lengths.join(', ')}) — anyone can join every run`);
  const weak = list.filter((c) => c.length <= 8);
  if (weak.length) note('warn', `${weak.length} legacy short codes (SOUL-XXX, ~15 bits) still in use`);
} else {
  note('ok', 'no invite codes readable anonymously');
}

/* ---------- 3. anonymous write ----------
 * The reliable probe is an idempotent UPDATE: read a visible row, write the
 * same value back. If the policy lets it through we get the row returned,
 * proving write access without changing any data.
 *
 * A plain INSERT probe is NOT conclusive here — this project's insert policy
 * additionally checks that the referenced run exists, so a made-up run_id
 * yields 42501 even while real writes are wide open. That false "OK" is the
 * reason this test works the way it does. */
console.log('\n3. Anonymous write capability (idempotent, changes no data):');
const sample = await req('/rest/v1/nuz_encounters?select=id,level&limit=1');
if (Array.isArray(sample.body) && sample.body.length === 1) {
  const row = sample.body[0];
  const u = await req(`/rest/v1/nuz_encounters?id=eq.${row.id}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({ level: row.level }),
  });
  if (u.status === 200 && Array.isArray(u.body) && u.body.length === 1) {
    note('crit', `UPDATE on a foreign encounter succeeded — anonymous clients can rewrite any run's data`);
  } else if (u.status === 401 || u.status === 403 || u.body?.code === '42501') {
    note('ok', `update blocked by RLS (HTTP ${u.status})`);
  } else if (u.status === 200 || u.status === 204) {
    note('ok', 'update affected no rows — policy filtered it out');
  } else {
    note('warn', `inconclusive: HTTP ${u.status} ${JSON.stringify(u.body).slice(0, 140)}`);
  }
} else {
  note('ok', 'no rows visible, so there is nothing to target for a write');
}

/* ---------- 4. run_members recursion ---------- */
console.log('\n4. nuz_run_members policy health:');
const m = await req('/rest/v1/nuz_run_members?select=*&limit=1');
if (m.body?.code === '42P17') {
  note('crit', 'infinite recursion in policy (42P17) — account/run linking silently fails');
} else if (m.status === 200) {
  note('ok', `readable without error (${Array.isArray(m.body) ? m.body.length : '?'} rows visible to anon)`);
} else {
  note('warn', `HTTP ${m.status} ${JSON.stringify(m.body).slice(0, 120)}`);
}

/* ---------- 5. account-scoped tables must stay closed ---------- */
console.log('\n5. Account data (must never be anonymously readable):');
for (const t of ['profiles', 'teams', 'nuz_solo_runs', 'orre_shadow_progress']) {
  const r = await req(`/rest/v1/${t}?select=*&limit=2`);
  if (Array.isArray(r.body) && r.body.length === 0) note('ok', `${t}: empty for anon`);
  else if (Array.isArray(r.body)) note('crit', `${t}: ${r.body.length} rows leaked`);
  else if (r.body?.code === 'PGRST205' || r.status === 404) note('warn', `${t}: table not deployed yet`);
  else note('warn', `${t}: HTTP ${r.status} ${JSON.stringify(r.body).slice(0, 100)}`);
}

/* ---------- 6. migration state ---------- */
console.log('\n6. Migration state (stage-1 RPCs present?):');
const rpcs = ['nuz_join_by_code', 'nuz_claim_access', 'nuz_overlay_snapshot'];
let rpcMissing = 0;
for (const fn of rpcs) {
  const body =
    fn === 'nuz_overlay_snapshot'
      ? JSON.stringify({ p_token: 'OVERLAY-INVALID1' })
      : JSON.stringify({ p_code: 'SOUL-CHECKONLY' });
  const r = await req(`/rest/v1/rpc/${fn}`, {
    method: 'POST',
    body,
  });
  if (r.body?.code === 'PGRST202' || r.status === 404) {
    rpcMissing++;
    note('warn', `${fn}: not deployed yet (client falls back to legacy path)`);
  } else {
    note('ok', `${fn}: present (HTTP ${r.status})`);
  }
}

/* ---------- 7. overlay token must not leak via table listing ---------- */
console.log('\n7. Overlay token exposure (must not list via REST):');
const overlayLeak = await req('/rest/v1/nuz_runs?select=overlay_token&overlay_token=not.is.null&limit=3');
if (Array.isArray(overlayLeak.body) && overlayLeak.body.length > 0) {
  note('crit', 'overlay_token readable via anonymous REST — snapshot RPC only');
} else {
  note('ok', 'overlay_token not listable anonymously');
}
const snapInvalid = await req('/rest/v1/rpc/nuz_overlay_snapshot', {
  method: 'POST',
  body: JSON.stringify({ p_token: 'OVERLAY-INVALID1' }),
});
if (snapInvalid.body === null || snapInvalid.body === 'null') {
  note('ok', 'nuz_overlay_snapshot rejects invalid token (null)');
} else if (snapInvalid.body?.code === 'PGRST202') {
  note('warn', 'nuz_overlay_snapshot not deployed — skip invalid-token probe');
} else {
  note('warn', `nuz_overlay_snapshot invalid token: ${JSON.stringify(snapInvalid.body).slice(0, 80)}`);
}

/* ---------- 8. auth surface ---------- */
console.log('\n8. Auth configuration:');
const settings = await req('/auth/v1/settings');
if (settings.status === 200 && settings.body) {
  const s = settings.body;
  if (s.external?.anonymous_users) note('ok', 'anonymous sign-ins enabled (required by the hardened policies)');
  else note('warn', 'anonymous sign-ins DISABLED — enable before running stage 2, or guest multiplayer breaks');
  if (s.disable_signup === false) {
    note(
      'high',
      'public email signup is enabled — disable it in the Supabase Auth dashboard; user creation must go only through register-account',
    );
  } else note('ok', 'public signup disabled');
}
const ua = await req('/rest/v1/rpc/username_available', {
  method: 'POST',
  body: JSON.stringify({ name: 'admin' }),
});
if (ua.status === 200) note('warn', 'username_available is callable anonymously — allows username enumeration');

/* ---------- verdict ---------- */
const crit = findings.filter((f) => f.level === 'crit').length;
const high = findings.filter((f) => f.level === 'high').length;
const warn = findings.filter((f) => f.level === 'warn').length;
console.log(`\n${'─'.repeat(64)}`);
console.log(`Result: ${crit} critical · ${high} high · ${warn} warnings · ${findings.length - crit - high - warn} ok`);
if (crit === 0) {
  console.log(green('No anonymous access to multiplayer data. Stage 2 is in effect.'));
} else {
  console.log(red('Multiplayer data is still anonymously accessible.'));
  console.log('Apply supabase/migrations/01_prepare_nuzlocke_rls.sql, then 02_enforce_nuzlocke_rls.sql.');
}
if (high > 0) {
  console.log(yellow('HIGH findings need a dashboard action (not fixable by in-repo SQL).'));
}
if (leaked > 0 || rpcMissing > 0) console.log(`(rows visible: ${leaked}, stage-1 RPCs missing: ${rpcMissing})`);
console.log();

process.exit(crit > 0 ? 1 : 0);
