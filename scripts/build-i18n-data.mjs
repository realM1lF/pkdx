#!/usr/bin/env node
/* build-i18n-data.mjs — generate German name artifacts from PokéAPI.
 *
 * Fetches localized (de) names for pokemon-species (1–1025), ALL moves,
 * ALL abilities, ALL types, ALL items and all location slugs referenced by
 * src/data/regions/*.json, plus region names.
 *
 * Output (committed to the repo):
 *   src/data/i18n/de/{pokemon,moves,abilities,items,types,locations,regions}.json
 *   src/data/i18n/de/search-index.json  (lowercased de name -> id/slug)
 *
 * Usage: npm run i18n:data
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const API = 'https://pokeapi.co/api/v2';
const CONCURRENCY = 8;
const MAX_DEX = 1025;
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, 'src/data/i18n/de');

/* ---------- fetch helpers ---------- */

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

const deName = (names) => names?.find((n) => n.language.name === 'de')?.name ?? null;
const enName = (names) => names?.find((n) => n.language.name === 'en')?.name ?? null;

/* ---------- collectors ---------- */

async function collectPokemon() {
  console.log('[1/7] pokemon-species ...');
  const ids = Array.from({ length: MAX_DEX }, (_, i) => i + 1);
  const out = {};
  await pool(
    ids,
    async (id) => {
      const s = await fetchJson(`${API}/pokemon-species/${id}`);
      const name = deName(s.names) ?? enName(s.names);
      const genus =
        s.genera?.find((g) => g.language.name === 'de')?.genus ??
        s.genera?.find((g) => g.language.name === 'en')?.genus ??
        '';
      out[id] = { slug: s.name, name, genus };
    },
    'species',
  );
  return out;
}

async function collectEndpoint(kind) {
  const list = await fetchJson(`${API}/${kind}?limit=1`);
  const count = list.count;
  const ids = Array.from({ length: count }, (_, i) => i + 1);
  const out = {};
  await pool(
    ids,
    async (id) => {
      try {
        const d = await fetchJson(`${API}/${kind}/${id}`);
        const name = deName(d.names) ?? enName(d.names);
        if (name) out[d.name] = name;
      } catch (err) {
        console.warn(`  ! ${kind}/${id}: ${err.message} -- skipped`);
      }
    },
    kind,
  );
  return out;
}

async function collectLocations() {
  const dir = path.join(ROOT, 'src/data/regions');
  const slugs = new Set();
  for (const file of readdirSync(dir)) {
    if (!file.endsWith('.json') || file.endsWith('-geo.json')) continue;
    const json = JSON.parse(await readFile(path.join(dir, file), 'utf8'));
    for (const node of json.nodes ?? []) {
      if (node.locationSlug) slugs.add(node.locationSlug);
    }
  }
  const list = [...slugs].sort();
  const out = {};
  await pool(
    list,
    async (slug) => {
      try {
        const d = await fetchJson(`${API}/location/${slug}`);
        // many location endpoints lack de translations; fall back to en so the
        // artifact is complete (runtime still falls back to displayName())
        const name = deName(d.names) ?? enName(d.names) ?? null;
        if (name) out[slug] = name;
      } catch (err) {
        console.warn(`  ! location/${slug}: ${err.message} -- skipped`);
      }
    },
    'locations',
  );
  return out;
}

async function collectRegions() {
  const out = {};
  const regions = ['kanto', 'johto', 'hoenn', 'sinnoh', 'unova'];
  for (const r of regions) {
    const d = await fetchJson(`${API}/region/${r}`);
    out[r] = deName(d.names) ?? enName(d.names) ?? r;
  }
  return out;
}

/* ---------- search index ---------- */

function buildSearchIndex({ pokemon, moves, abilities, items, types, locations }) {
  const idx = { pokemon: {}, moves: {}, abilities: {}, items: {}, types: {}, locations: {} };
  for (const [id, p] of Object.entries(pokemon)) {
    idx.pokemon[p.name.toLowerCase()] = Number(id);
  }
  for (const [slug, name] of Object.entries(moves)) idx.moves[name.toLowerCase()] = slug;
  for (const [slug, name] of Object.entries(abilities)) idx.abilities[name.toLowerCase()] = slug;
  for (const [slug, name] of Object.entries(items)) idx.items[name.toLowerCase()] = slug;
  for (const [slug, name] of Object.entries(types)) idx.types[name.toLowerCase()] = slug;
  for (const [slug, name] of Object.entries(locations)) idx.locations[name.toLowerCase()] = slug;
  return idx;
}

/* ---------- main ---------- */

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const pokemon = await collectPokemon();
  console.log('[2/7] moves ...');
  const moves = await collectEndpoint('move');
  console.log('[3/7] abilities ...');
  const abilities = await collectEndpoint('ability');
  console.log('[4/7] types ...');
  const types = await collectEndpoint('type');
  console.log('[5/7] items ...');
  const items = await collectEndpoint('item');
  console.log('[6/7] locations ...');
  const locations = await collectLocations();
  console.log('[7/7] regions ...');
  const regions = await collectRegions();
  const searchIndex = buildSearchIndex({ pokemon, moves, abilities, items, types, locations });

  const files = { pokemon, moves, abilities, types, items, locations, regions };
  for (const [name, data] of Object.entries(files)) {
    const file = path.join(OUT_DIR, `${name}.json`);
    await writeFile(file, JSON.stringify(data, null, 0));
    console.log(`  wrote ${path.relative(ROOT, file)} (${Object.keys(data).length} entries)`);
  }
  const idxFile = path.join(OUT_DIR, 'search-index.json');
  await writeFile(idxFile, JSON.stringify(searchIndex, null, 0));
  console.log(`  wrote ${path.relative(ROOT, idxFile)}`);
  console.log('done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
