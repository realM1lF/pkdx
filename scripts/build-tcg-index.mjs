#!/usr/bin/env node
/* build-tcg-index.mjs — TCGdex catalog summaries for /tcg (DE + EN).
 *
 * Output: src/data/tcg/index.de.json, src/data/tcg/index.en.json
 *
 * Usage:
 *   node scripts/build-tcg-index.mjs              # full catalog both langs
 *   node scripts/build-tcg-index.mjs --spike      # dex 25, 6, 151 only
 *   node scripts/build-tcg-index.mjs --lang de
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const API = 'https://api.tcgdex.net/v2';
const CONCURRENCY = 12;
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, 'src/data/tcg');

const args = process.argv.slice(2);
const spike = args.includes('--spike');
const langArg = args.find((a) => a.startsWith('--lang='))?.split('=')[1]
  ?? (args.includes('--lang') ? args[args.indexOf('--lang') + 1] : null);
const dexArg = args.find((a) => a.startsWith('--dex='))?.split('=')[1];
const SPIKE_DEX = dexArg ? dexArg.split(',').map(Number) : [25, 6, 151];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchJson(url, attempt = 0) {
  let res;
  try {
    res = await fetch(url);
  } catch (err) {
    if (attempt < 5) {
      await sleep(400 * 2 ** attempt);
      return fetchJson(url, attempt + 1);
    }
    throw err;
  }
  if (res.status === 429 || res.status >= 500) {
    if (attempt < 6) {
      await sleep(800 * 2 ** attempt);
      return fetchJson(url, attempt + 1);
    }
    throw new Error(`TCGdex ${res.status} for ${url}`);
  }
  if (!res.ok) throw new Error(`TCGdex ${res.status} for ${url}`);
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
      done += 1;
      if (done % 250 === 0 || done === items.length) {
        process.stderr.write(`\r${label}: ${done}/${items.length}`);
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, items.length || 1) }, lane));
  process.stderr.write('\n');
  return results;
}

function pickCm(raw) {
  if (!raw || typeof raw !== 'object') return undefined;
  return {
    idProduct: raw.idProduct ?? undefined,
    updated: raw.updated ?? undefined,
    unit: raw.unit ?? undefined,
    avg: raw.avg ?? null,
    low: raw.low ?? null,
    trend: raw.trend ?? null,
    avg1: raw.avg1 ?? null,
    avg7: raw.avg7 ?? null,
    avg30: raw.avg30 ?? null,
    avgHolo: raw['avg-holo'] ?? null,
    lowHolo: raw['low-holo'] ?? null,
    trendHolo: raw['trend-holo'] ?? null,
    avg1Holo: raw['avg1-holo'] ?? null,
    avg7Holo: raw['avg7-holo'] ?? null,
    avg30Holo: raw['avg30-holo'] ?? null,
  };
}

function pickTpRow(row) {
  if (!row || typeof row !== 'object') return undefined;
  return {
    productId: row.productId ?? undefined,
    lowPrice: row.lowPrice ?? null,
    midPrice: row.midPrice ?? null,
    highPrice: row.highPrice ?? null,
    marketPrice: row.marketPrice ?? null,
    directLowPrice: row.directLowPrice ?? null,
  };
}

function pickTp(raw) {
  if (!raw || typeof raw !== 'object') return undefined;
  const out = {
    updated: raw.updated ?? undefined,
    unit: raw.unit ?? undefined,
  };
  for (const key of ['normal', 'holofoil', 'reverseHolofoil', '1stEdition', '1stEditionHolofoil']) {
    const row = pickTpRow(raw[key]);
    if (row) out[key] = row;
  }
  return Object.keys(out).length > 2 ? out : out.updated ? out : undefined;
}

function mergePricing(card) {
  let cm = pickCm(card.pricing?.cardmarket);
  let tp = pickTp(card.pricing?.tcgplayer);
  for (const v of card.variants_detailed ?? []) {
    if (!v?.pricing) continue;
    cm = cm ?? pickCm(v.pricing.cardmarket);
    tp = tp ?? pickTp(v.pricing.tcgplayer);
  }
  return { cardmarket: cm, tcgplayer: tp };
}

function normalizeCard(card, setCache) {
  const setId = card.set?.id ?? card.id?.split('-')?.[0] ?? '';
  const cached = setCache.get(setId);
  const dexIds = Array.isArray(card.dexId) ? card.dexId : card.dexId != null ? [card.dexId] : undefined;
  const v = card.variants ?? {};
  const pricing = mergePricing(card);
  return {
    id: card.id,
    name: card.name,
    localId: String(card.localId ?? ''),
    setId,
    setName: card.set?.name ?? cached?.name ?? setId,
    seriesId: cached?.serie?.id ?? card.set?.serie?.id,
    seriesName: cached?.serie?.name ?? card.set?.serie?.name,
    releaseDate: cached?.releaseDate,
    rarity: card.rarity,
    category: card.category,
    dexIds: dexIds?.length ? dexIds : undefined,
    hp: card.hp,
    types: card.types,
    stage: card.stage,
    illustrator: card.illustrator,
    variants: {
      normal: !!v.normal,
      holo: !!v.holo,
      reverse: !!v.reverse,
      firstEdition: !!v.firstEdition,
    },
    regulationMark: card.regulationMark,
    legal: card.legal,
    imageBase: card.image,
    pricing,
    updatedAt: pricing.cardmarket?.updated ?? pricing.tcgplayer?.updated ?? card.updated,
  };
}

async function loadSetCache(lang) {
  const list = await fetchJson(`${API}/${lang}/sets`);
  const cache = new Map();
  await pool(
    list,
    async (s) => {
      try {
        const full = await fetchJson(`${API}/${lang}/sets/${s.id}`);
        cache.set(s.id, full);
      } catch {
        cache.set(s.id, s);
      }
    },
    `sets ${lang}`,
  );
  return cache;
}

async function cardsForDexFilter(lang, dexIds) {
  const idSet = new Set();
  for (const dex of dexIds) {
    const batch = await fetchJson(`${API}/${lang}/cards?dexId=eq:${dex}`);
    for (const c of batch) idSet.add(c.id);
  }
  return [...idSet];
}

async function buildLang(lang) {
  process.stderr.write(`\n=== TCG index ${lang} ===\n`);
  let ids;
  if (spike) {
    ids = await cardsForDexFilter(lang, SPIKE_DEX);
    process.stderr.write(`spike: ${ids.length} cards for dex ${SPIKE_DEX.join(',')}\n`);
  } else {
    const list = await fetchJson(`${API}/${lang}/cards`);
    ids = list.map((c) => c.id);
  }

  const setCache = await loadSetCache(lang);

  const cards = (
    await pool(
      ids,
      async (id) => {
        try {
          const card = await fetchJson(`${API}/${lang}/cards/${id}`);
          return normalizeCard(card, setCache);
        } catch (err) {
          process.stderr.write(`\nwarn: ${id} ${err.message}\n`);
          return null;
        }
      },
      `cards ${lang}`,
    )
  ).filter(Boolean);

  cards.sort((a, b) => {
    const rd = (b.releaseDate ?? '').localeCompare(a.releaseDate ?? '');
    if (rd !== 0) return rd;
    return a.name.localeCompare(b.name, lang);
  });

  return {
    meta: { builtAt: new Date().toISOString(), lang, count: cards.length },
    cards,
  };
}

async function main() {
  const langs = langArg ? [langArg] : ['de', 'en'];
  await mkdir(OUT_DIR, { recursive: true });
  for (const lang of langs) {
    const artifact = await buildLang(lang);
    const out = path.join(OUT_DIR, `index.${lang}.json`);
    await writeFile(out, JSON.stringify(artifact));
    process.stderr.write(`wrote ${out} (${artifact.meta.count} cards)\n`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
