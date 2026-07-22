#!/usr/bin/env node
/* build-desc-data.mjs — description artifacts for the entity modals (Batch E, EP2).
 *
 * Fetches every move / item / ability from PokéAPI and distills each into ONE
 * compact record per slug: localized display names (en + de), ONE flavor text
 * per language (newest version group that has the language, shortest text
 * within it) plus the stats needed for the modal grids.
 *
 * Output (committed to the repo, lazy-loaded at runtime via dynamic import):
 *   src/data/desc/{moves,items,abilities}.json
 *
 * Size budget: < 1.2 MB raw total (~350 KB gzip). Kept small by storing only
 * one short flavor per language and short_effect only for abilities.
 * DE fields are omitted when no German text exists — the UI falls back to EN.
 *
 * Usage: npm run desc:data
 */
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const API = 'https://pokeapi.co/api/v2';
const CONCURRENCY = 10;
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, 'src/data/desc');

/* version groups oldest → newest (flavor "recency" score = index) */
const VERSION_GROUPS = [
  'red-blue', 'yellow', 'gold-silver', 'crystal', 'ruby-sapphire', 'emerald',
  'firered-leafgreen', 'diamond-pearl', 'platinum', 'heartgold-soulsilver',
  'black-white', 'black-2-white-2', 'x-y', 'omega-ruby-alpha-sapphire',
  'sun-moon', 'ultra-sun-ultra-moon', 'lets-go-pikachu-eevee', 'sword-shield',
  'brilliant-diamond-and-shining-pearl', 'legends-arceus', 'scarlet-violet',
];
const VG_SCORE = new Map(VERSION_GROUPS.map((v, i) => [v, i]));

/** hard cap per text field — guards the size budget against outlier texts */
const MAX_TEXT = 360;

/* ---------- fetch helpers (same policy as build-i18n-data.mjs) ---------- */

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchJson(url, attempt = 0) {
  let res;
  try {
    res = await fetch(url);
  } catch (err) {
    if (attempt < 5) {
      await sleep(500 * 2 ** attempt);
      return fetchJson(url, attempt + 1);
    }
    throw err;
  }
  if (res.status === 429 || res.status >= 500) {
    if (attempt < 6) {
      const retryAfter = Number(res.headers.get('retry-after')) || 0;
      await sleep(Math.max(retryAfter * 1000, 800 * 2 ** attempt));
      return fetchJson(url, attempt + 1);
    }
    throw new Error(`PokéAPI ${res.status} for ${url} (retries exhausted)`);
  }
  if (!res.ok) throw new Error(`PokéAPI ${res.status} for ${url}`);
  return res.json();
}

async function pool(items, worker, label) {
  const results = new Array(items.length);
  let i = 0;
  let done = 0;
  async function lane() {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await worker(items[idx], idx);
      done++;
      if (done % 100 === 0 || done === items.length) {
        process.stderr.write(`\r  ${label}: ${done}/${items.length}`);
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, lane));
  process.stderr.write('\n');
  return results;
}

/* ---------- text helpers ---------- */

const clean = (s) =>
  String(s ?? '')
    .replace(/[\n\f\r]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const clip = (s) => (s.length > MAX_TEXT ? `${s.slice(0, MAX_TEXT - 1).trimEnd()}…` : s);

const langName = (names, lang) => names?.find((n) => n.language.name === lang)?.name ?? null;

/**
 * One flavor text per language: highest version-group score wins, shortest
 * text inside that group (the "newest game with this language, shortest
 * flavor" rule). Returns '' when the language is missing entirely.
 */
function pickFlavor(entries, lang) {
  let bestScore = -1;
  let best = null;
  for (const e of entries ?? []) {
    if (e.language?.name !== lang) continue;
    const score = VG_SCORE.get(e.version_group?.name) ?? -1;
    const text = clean(e.flavor_text ?? e.text ?? '');
    if (!text) continue;
    if (score > bestScore || (score === bestScore && (best == null || text.length < best.length))) {
      bestScore = score;
      best = text;
    }
  }
  return best ?? '';
}

/** effect_entries (abilities): short_effect per language — not versioned, so
 * take the first entry per language. */
function pickShortEffect(entries, lang) {
  for (const e of entries ?? []) {
    if (e.language?.name === lang && e.short_effect) return clean(e.short_effect);
  }
  return '';
}

/* ---------- collectors ---------- */

async function listIds(kind) {
  const list = await fetchJson(`${API}/${kind}?limit=1`);
  return Array.from({ length: list.count }, (_, i) => i + 1);
}

async function collectMoves() {
  const ids = await listIds('move');
  const out = {};
  await pool(
    ids,
    async (id) => {
      try {
        const d = await fetchJson(`${API}/move/${id}`);
        const en = langName(d.names, 'en') ?? d.name;
        const de = langName(d.names, 'de');
        const rec = {
          n: en,
          t: d.type?.name ?? 'normal',
          dc: d.damage_class?.name ?? 'status',
          target: d.target?.name ?? 'selected-pokemon',
        };
        if (de && de !== en) rec.de = de;
        if (d.power != null) rec.power = d.power;
        if (d.accuracy != null) rec.acc = d.accuracy;
        if (d.pp != null) rec.pp = d.pp;
        if (d.priority) rec.priority = d.priority;
        if (d.meta?.crit_rate) rec.crit = d.meta.crit_rate;
        if (d.effect_chance != null && d.effect_chance > 0) rec.effectChance = d.effect_chance;
        const fen = pickFlavor(d.flavor_text_entries, 'en');
        const fde = pickFlavor(d.flavor_text_entries, 'de');
        if (fen) rec.fen = clip(fen);
        if (fde) rec.fde = clip(fde);
        out[d.name] = rec;
      } catch (err) {
        console.warn(`  ! move/${id}: ${err.message} -- skipped`);
      }
    },
    'moves',
  );
  return out;
}

async function collectItems() {
  const ids = await listIds('item');
  const out = {};
  await pool(
    ids,
    async (id) => {
      try {
        const d = await fetchJson(`${API}/item/${id}`);
        const en = langName(d.names, 'en') ?? d.name;
        const de = langName(d.names, 'de');
        const rec = {
          n: en,
          category: d.category?.name ?? 'items',
        };
        if (de && de !== en) rec.de = de;
        if (d.cost) rec.cost = d.cost;
        const fen = pickFlavor(d.flavor_text_entries, 'en');
        const fde = pickFlavor(d.flavor_text_entries, 'de');
        if (fen) rec.fen = clip(fen);
        if (fde) rec.fde = clip(fde);
        out[d.name] = rec;
      } catch (err) {
        console.warn(`  ! item/${id}: ${err.message} -- skipped`);
      }
    },
    'items',
  );
  return out;
}

async function collectAbilities() {
  const ids = await listIds('ability');
  const out = {};
  await pool(
    ids,
    async (id) => {
      try {
        const d = await fetchJson(`${API}/ability/${id}`);
        const en = langName(d.names, 'en') ?? d.name;
        const de = langName(d.names, 'de');
        const rec = { n: en };
        if (de && de !== en) rec.de = de;
        const fx = pickShortEffect(d.effect_entries, 'en');
        const fxde = pickShortEffect(d.effect_entries, 'de');
        if (fx) rec.effectShort = clip(fx);
        if (fxde) rec.effectShortDe = clip(fxde);
        const fen = pickFlavor(d.flavor_text_entries, 'en');
        const fde = pickFlavor(d.flavor_text_entries, 'de');
        if (fen) rec.fen = clip(fen);
        if (fde) rec.fde = clip(fde);
        out[d.name] = rec;
      } catch (err) {
        console.warn(`  ! ability/${id}: ${err.message} -- skipped`);
      }
    },
    'abilities',
  );
  return out;
}

/* ---------- main ---------- */

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  console.log('[1/3] moves ...');
  const moves = await collectMoves();
  console.log('[2/3] items ...');
  const items = await collectItems();
  console.log('[3/3] abilities ...');
  const abilities = await collectAbilities();

  let total = 0;
  for (const [name, data] of Object.entries({ moves, items, abilities })) {
    const file = path.join(OUT_DIR, `${name}.json`);
    const json = JSON.stringify(data);
    total += Buffer.byteLength(json);
    await writeFile(file, json);
    console.log(
      `  wrote ${path.relative(ROOT, file)} — ${Object.keys(data).length} entries, ${(Buffer.byteLength(json) / 1024).toFixed(0)} KB`,
    );
  }
  console.log(`  total raw: ${(total / 1024).toFixed(0)} KB (budget: 1200 KB)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
