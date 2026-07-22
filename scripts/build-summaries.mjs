#!/usr/bin/env node
/* build-summaries.mjs — generate the slim Pokédex summary artifact (EP1.4).
 *
 * The /pokedex list needs only id/slug/name/types/base stats/height/weight per
 * Pokémon — but previously fetched the full 270–425 KB /pokemon/{id} payload
 * for every card (and for ALL 1025 entries on stat sorts). This script moves
 * that to build time: ONE committed JSON (~160 KB) replaces 1025 requests.
 *
 * Output (committed to the repo):
 *   src/data/summaries.json
 *
 * Usage: npm run summaries
 */
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const API = 'https://pokeapi.co/api/v2';
const CONCURRENCY = 10;
const MAX_DEX = 1025;
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'src/data/summaries.json');

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

/** Run tasks with limited concurrency, streaming progress to stderr. */
async function pool(items, worker, label) {
  const results = new Array(items.length);
  let i = 0;
  let done = 0;
  async function lane() {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await worker(items[idx], idx);
      done += 1;
      if (done % 100 === 0 || done === items.length) {
        process.stderr.write(`\r${label}: ${done}/${items.length}`);
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, items.length) }, lane));
  process.stderr.write('\n');
  return results;
}

/* ---------- display name (MIRRORS SPECIAL_NAMES/displayName in src/lib/pokeapi.ts —
 * keep in sync so card labels match the runtime fallback) ---------- */

const SPECIAL_NAMES = {
  'mr-mime': 'Mr. Mime',
  'mime-jr': 'Mime Jr.',
  'ho-oh': 'Ho-Oh',
  'porygon-z': 'Porygon-Z',
  'nidoran-f': 'Nidoran ♀',
  'nidoran-m': 'Nidoran ♂',
  farfetchd: "Farfetch'd",
  sirfetchd: "Sirfetch'd",
  flabebe: 'Flabébé',
  'type-null': 'Type: Null',
  'jangmo-o': 'Jangmo-o',
  'hakamo-o': 'Hakamo-o',
  'kommo-o': 'Kommo-o',
  'tapu-koko': 'Tapu Koko',
  'tapu-lele': 'Tapu Lele',
  'tapu-bulu': 'Tapu Bulu',
  'tapu-fini': 'Tapu Fini',
  'mr-rime': 'Mr. Rime',
};

function displayName(slug) {
  if (SPECIAL_NAMES[slug]) return SPECIAL_NAMES[slug];
  return slug
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');
}

/* PokéAPI stat slug -> compact key (matches StatKey order in src/lib/types.ts) */
const STAT_KEY = {
  hp: 'hp',
  attack: 'atk',
  defense: 'def',
  'special-attack': 'spa',
  'special-defense': 'spd',
  speed: 'spe',
};

/* ---------- main ---------- */

const ids = Array.from({ length: MAX_DEX }, (_, i) => i + 1);

const pokemon = await pool(
  ids,
  async (id) => {
    const p = await fetchJson(`${API}/pokemon/${id}`);
    const stats = {};
    for (const s of p.stats) stats[STAT_KEY[s.stat.name]] = s.base_stat;
    return {
      id: p.id,
      slug: p.name,
      name: displayName(p.name),
      types: [...p.types].sort((a, b) => a.slot - b.slot).map((t) => t.type.name),
      stats,
      height: p.height, // decimetres
      weight: p.weight, // hectograms
      // sprite paths are derived from id at runtime (src/lib/sprites.ts) — not stored
    };
  },
  'pokemon',
);

const out = { pokemon };
await writeFile(OUT, JSON.stringify(out));
const { size } = await import('node:fs/promises').then((fs) => fs.stat(OUT));
console.log(`wrote ${path.relative(ROOT, OUT)} — ${pokemon.length} entries, ${(size / 1024).toFixed(1)} KB`);
