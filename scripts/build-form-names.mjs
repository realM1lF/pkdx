#!/usr/bin/env node
/* Fetch official EN/DE forme names from PokéAPI pokemon-form and write
 * src/data/i18n/form-names.json. Paldea rows without a German API name use
 * PokéWiki terms (see src/lib/form-names.ts PALDEA_DE_FALLBACK). */
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const API = 'https://pokeapi.co/api/v2';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONCURRENCY = 8;

const PALDEA_DE = {
  'wooper-paldea': 'Paldea-Felino',
  'tauros-paldea-combat-breed': 'Paldea-Tauros (Gefechtvariante)',
  'tauros-paldea-blaze-breed': 'Paldea-Tauros (Flammenvariante)',
  'tauros-paldea-aqua-breed': 'Paldea-Tauros (Flutenvariante)',
};
const PREFIX = { alola: 'Alola', galar: 'Galar', hisui: 'Hisui', paldea: 'Paldea', mega: 'Mega', gmax: 'Gigadynamax' };
const hyphenate = (name) => name.replace(/^(Alola|Galar|Hisui|Paldea) /, '$1-');

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
    throw new Error(`PokéAPI ${res.status} for ${url}`);
  }
  if (!res.ok) throw new Error(`PokéAPI ${res.status} for ${url}`);
  return res.json();
}

async function pool(items, worker) {
  const results = new Array(items.length);
  let i = 0;
  async function lane() {
    while (i < items.length) {
      const idx = i++;
      results[idx] = await worker(items[idx]);
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, lane));
  return results;
}

const deName = (names) => names?.find((n) => n.language.name === 'de')?.name ?? null;
const enName = (names) => names?.find((n) => n.language.name === 'en')?.name ?? null;

const catalog = JSON.parse(await readFile(path.join(ROOT, 'src/data/dex-forms.json'), 'utf8'));
const pokemonDe = JSON.parse(await readFile(path.join(ROOT, 'src/data/i18n/de/pokemon.json'), 'utf8'));

const apiRows = await pool(catalog.forms, async (f) => {
  const form = await fetchJson(`${API}/pokemon-form/${f.slug}`);
  return { slug: f.slug, kind: f.kind, speciesId: f.speciesId, apiDe: deName(form.names), apiEn: enName(form.names) };
});

const out = {};
for (const row of apiRows) {
  const en = row.apiEn?.trim() || row.slug;
  const baseDe = pokemonDe[String(row.speciesId)]?.name || row.slug;
  let de;
  if (row.apiDe?.trim()) de = hyphenate(row.apiDe.trim());
  else if (PALDEA_DE[row.slug]) de = PALDEA_DE[row.slug];
  else de = `${PREFIX[row.kind]}-${baseDe}`;
  out[row.slug] = { de, en };
}

const dest = path.join(ROOT, 'src/data/i18n/form-names.json');
await writeFile(dest, `${JSON.stringify(out)}\n`);
const missing = apiRows.filter((r) => !r.apiDe).map((r) => r.slug);
console.log(`wrote ${path.relative(ROOT, dest)} (${Object.keys(out).length} names, ${missing.length} Paldea fallbacks)`);
