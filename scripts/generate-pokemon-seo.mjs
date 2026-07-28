#!/usr/bin/env node
/* generate-pokemon-seo — build-time PokéAPI snapshot for the SEO rollout.
 *
 * Produces three committed JSON artifacts (no runtime fetches on the SEO
 * pages — the prerendered HTML must carry every table without JS):
 *
 *   src/data/routes-kanto.json   encounter tables per Kanto node + version
 *                                (slot chances summed per species × exact
 *                                method, then MAX across methods inside a
 *                                bucket — mutually exclusive rods must not
 *                                be summed, see bucketsFromDetails)
 *   src/data/pokemon-seo.json    FRLG locations, evolution steps, types, BST
 *                                and catch rate for the 25 curated Pokémon
 *   src/data/seo-meta-gen.json   tiny summary consumed by src/lib/seo.ts
 *                                (sync meta registry — names + top encounter)
 *
 * Hoenn (SEO rollout 3, additive):  node scripts/generate-pokemon-seo.mjs hoenn
 * writes src/data/routes-hoenn.json (RSE encounter tables, default version
 * emerald) and merges a routesHoenn block into src/data/seo-meta-gen.json —
 * the Kanto artifacts stay untouched (the default call above is unchanged).
 *
 * Re-run to refresh:  node scripts/generate-pokemon-seo.mjs [kanto|hoenn]
 */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const API = 'https://pokeapi.co/api/v2';

const REGION = process.argv[2] ?? 'kanto';
if (!['kanto', 'hoenn'].includes(REGION)) {
  console.error(`usage: node scripts/generate-pokemon-seo.mjs [kanto|hoenn]`);
  process.exit(1);
}
/* Encounter tables are generated for every edition that is playable in the
 * region (cross-gen rollout): Kanto = FRLG + HGSS + GSC (Kanto is the full
 * HGSS/GSC post-game), Hoenn = RSE + ORAS. PokéAPI ships all of them on the
 * same location-area payload (verified live). The curated Pokémon block
 * (buildPokemon) stays FRLG-framed by design — see POKEMON_VERSIONS. */
const VERSIONS =
  REGION === 'hoenn'
    ? ['ruby', 'sapphire', 'emerald', 'omega-ruby', 'alpha-sapphire']
    : ['firered', 'leafgreen', 'heartgold', 'soulsilver', 'gold', 'silver', 'crystal'];
/* The curated 25-Pokémon location block (pokemon-seo.json) is FRLG-only —
 * the Pokémon detail SEO sections are framed "Datenstand Feuerrot". */
const POKEMON_VERSIONS = ['firered', 'leafgreen'];

const kanto = JSON.parse(readFileSync(path.join(root, `src/data/regions/${REGION}.json`), 'utf8'));
const NAMES_DE = JSON.parse(readFileSync(path.join(root, 'src/data/i18n/de/pokemon.json'), 'utf8'));

/** 25 curated Pokémon for the detail-page SEO sections (see task briefing). */
const POKEMON_IDS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 25, 26, 133, 143, 150, 151, 149, 130, 94, 18, 20,
  24, 97, 105, 65, 112,
];

/* ---------- slug mapping (mirror of src/lib/seo-routes-kanto.ts — keep in sync!) ---------- */
const ROUTE_SLUGS = {
  'pallet-town': ['alabastia', 'pallet-town'],
  'kanto-route-1': ['route-1', 'route-1'],
  'viridian-city': ['vertania-city', 'viridian-city'],
  'kanto-route-22': ['route-22', 'route-22'],
  'kanto-route-2': ['route-2', 'route-2'],
  'viridian-forest': ['vertania-wald', 'viridian-forest'],
  'digletts-cave': ['digda-hoehle', 'digletts-cave'],
  'pewter-city': ['marmoria-city', 'pewter-city'],
  'kanto-route-3': ['route-3', 'route-3'],
  'mt-moon': ['mondberg', 'mt-moon'],
  'kanto-route-4': ['route-4', 'route-4'],
  'cerulean-city': ['azuria-city', 'cerulean-city'],
  'kanto-route-24': ['route-24', 'route-24'],
  'kanto-route-25': ['route-25', 'route-25'],
  'cerulean-cave': ['azuria-hoehle', 'cerulean-cave'],
  'kanto-route-5': ['route-5', 'route-5'],
  'kanto-route-6': ['route-6', 'route-6'],
  'vermilion-city': ['orania-city', 'vermilion-city'],
  'kanto-route-11': ['route-11', 'route-11'],
  'kanto-route-9': ['route-9', 'route-9'],
  'kanto-route-10': ['route-10', 'route-10'],
  'rock-tunnel': ['felstunnel', 'rock-tunnel'],
  'power-plant': ['kraftwerk', 'power-plant'],
  'lavender-town': ['lavandia', 'lavender-town'],
  'pokemon-tower': ['pokemon-turm', 'pokemon-tower'],
  'kanto-route-8': ['route-8', 'route-8'],
  'kanto-route-7': ['route-7', 'route-7'],
  'celadon-city': ['prismania-city', 'celadon-city'],
  'kanto-route-16': ['route-16', 'route-16'],
  'kanto-route-17': ['route-17', 'route-17'],
  'kanto-route-18': ['route-18', 'route-18'],
  'fuchsia-city': ['fuchsania-city', 'fuchsia-city'],
  'safari-zone': ['safari-zone', 'safari-zone'],
  'kanto-route-12': ['route-12', 'route-12'],
  'kanto-route-13': ['route-13', 'route-13'],
  'kanto-route-14': ['route-14', 'route-14'],
  'kanto-route-15': ['route-15', 'route-15'],
  'kanto-route-19': ['route-19', 'route-19'],
  'kanto-route-20': ['route-20', 'route-20'],
  'seafoam-islands': ['seeschauminseln', 'seafoam-islands'],
  'cinnabar-island': ['zinnoberinsel', 'cinnabar-island'],
  'kanto-route-21': ['route-21', 'route-21'],
  'kanto-route-23': ['route-23', 'route-23'],
  'victory-road': ['siegesstrasse', 'victory-road'],
  'indigo-plateau': ['indigo-plateau', 'indigo-plateau'],
  'saffron-city': ['saffronia-city', 'saffron-city'],
};

/* ---------- helpers ---------- */

const idFromUrl = (url) => Number(url.replace(/\/$/, '').split('/').pop());

const title = (slug) =>
  slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

const nameDe = (id) => NAMES_DE[String(id)]?.name ?? null;
const nameEn = (id, slug) => title(slug);

const SURF = new Set(['surf', 'surf-spots']);
const FISH = new Set(['old-rod', 'good-rod', 'super-rod', 'fish', 'fishing', 'super-rod-spots', 'feebas-tile-fishing']);
/* gift / one-off static / trade — never wild (Poké Flute Snorlax, in-game
 * trades, Sudowoodo, Devon-Scope Kecleon). Keep in sync with
 * STATIC_METHODS in src/lib/mapdata.ts. */
const STATIC = new Set([
  'gift', 'gift-egg', 'only-one', 'static', 'pokeflute', 'npc-trade',
  'squirt-bottle', 'devon-scope',
]);
/* PokéAPI junk entries (e.g. 'colosseum-bonus-disc-jpn' on kanto-pokecenter-area)
 * are not real FRLG encounters — excluded everywhere. */
const isJunkMethod = (m) => m.includes('colosseum') || m.includes('bonus-disc');
function bucket(method) {
  if (SURF.has(method)) return 'SURF';
  if (FISH.has(method)) return 'FISH';
  if (STATIC.has(method)) return 'STATIC';
  if (method === 'walk' || method.endsWith('-grass') || method.endsWith('-spots')) return 'WALK';
  return 'OTHER';
}
const BUCKET_ORDER = ['STATIC', 'WALK', 'SURF', 'FISH', 'OTHER'];

/**
 * Slot-summation done right: sum slot chances per EXACT method (the real
 * probability for one rod / one method), then take the MAX across methods
 * inside a bucket. Rods are mutually exclusive — summing them produced
 * impossible values like 120% (Magikarp old+good rod) or 299%.
 */
function bucketsFromDetails(details) {
  const byMethod = new Map();
  for (const det of details) {
    const m = det.method.name;
    if (isJunkMethod(m)) continue;
    if (!byMethod.has(m)) byMethod.set(m, { chance: 0, min: Infinity, max: -Infinity });
    const g = byMethod.get(m);
    g.chance += det.chance;
    g.min = Math.min(g.min, det.min_level);
    g.max = Math.max(g.max, det.max_level);
  }
  const byBucket = new Map();
  for (const [m, g] of byMethod) {
    const b = bucket(m);
    const prev = byBucket.get(b);
    if (prev) {
      prev.chance = Math.max(prev.chance, g.chance);
      prev.min = Math.min(prev.min, g.min);
      prev.max = Math.max(prev.max, g.max);
    } else {
      byBucket.set(b, { chance: g.chance, min: g.min, max: g.max });
    }
  }
  return byBucket;
}

function areaShortLabel(areaName, locationSlug) {
  let rest = areaName.startsWith(locationSlug) ? areaName.slice(locationSlug.length) : areaName;
  rest = rest.replace(/^-+|-+$/g, '').replace(/-area$/, '');
  if (!rest || rest === 'area') return 'MAIN';
  return rest.replace(/-/g, ' ').toUpperCase();
}

/* simple concurrency pool */
async function pool(items, fn, concurrency = 8) {
  const out = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, async () => {
      while (next < items.length) {
        const i = next++;
        out[i] = await fn(items[i], i);
      }
    }),
  );
  return out;
}

const cache = new Map();
async function get(url) {
  if (!cache.has(url)) {
    cache.set(
      url,
      fetch(url).then((r) => {
        if (!r.ok) throw new Error(`${url} → HTTP ${r.status}`);
        return r.json();
      }),
    );
  }
  return cache.get(url);
}

/* ---------- routes: aggregate encounters per node × version ---------- */

/**
 * Per species × method bucket the chance is the best single-method slot sum
 * (== PokéAPI max_chance per method group; buckets take the MAX across
 * methods). Levels span all contributing slots.
 */
function aggregateArea(area, locationSlug, version) {
  /* key: pokemonId|bucket */
  const rows = new Map();
  for (const enc of area.pokemon_encounters) {
    const vd = enc.version_details.find((v) => v.version.name === version);
    if (!vd || vd.encounter_details.length === 0) continue;
    const id = idFromUrl(enc.pokemon.url);
    if (!Number.isFinite(id) || id < 1 || id > 1025) continue;
    /* slot chances summed per exact method, then MAX per bucket */
    const byBucket = bucketsFromDetails(vd.encounter_details);
    if (byBucket.size === 0) continue;
    for (const [b, g] of byBucket) {
      const key = `${id}|${b}`;
      const prev = rows.get(key);
      if (prev) {
        prev.chance += g.chance;
        prev.minLevel = Math.min(prev.minLevel, g.min);
        prev.maxLevel = Math.max(prev.maxLevel, g.max);
      } else {
        rows.set(key, {
          id,
          slug: enc.pokemon.name,
          method: b,
          isStatic: STATIC.has(b) || vd.encounter_details.some((d) => STATIC.has(d.method.name)),
          chance: g.chance,
          minLevel: g.min,
          maxLevel: g.max,
        });
      }
    }
  }
  return [...rows.values()].sort((a, b) => {
    if (a.isStatic !== b.isStatic) return a.isStatic ? -1 : 1;
    if (b.chance !== a.chance) return b.chance - a.chance;
    return a.id - b.id || BUCKET_ORDER.indexOf(a.method) - BUCKET_ORDER.indexOf(b.method);
  });
}

async function buildRoutes() {
  const nodes = kanto.nodes.filter((n) => n.locationSlug);
  const result = {};
  let done = 0;
  await pool(
    nodes,
    async (node) => {
      let loc;
      try {
        loc = await get(`${API}/location/${node.locationSlug}`);
      } catch (e) {
        console.warn(`  [skip] ${node.id}: ${e.message}`);
        return;
      }
      if (!loc.areas?.length) return;
      const areas = await pool(loc.areas, (a) => get(`${API}/location-area/${a.name}`), 6);
      const perVersion = {};
      for (const v of VERSIONS) {
        const groups = areas
          .map((a) => ({
            areaSlug: a.name,
            label: areaShortLabel(a.name, node.locationSlug),
            rows: aggregateArea(a, node.locationSlug, v),
          }))
          .filter((g) => g.rows.length > 0);
        if (groups.length > 0) perVersion[v] = groups;
      }
      if (Object.keys(perVersion).length > 0) {
        result[node.id] = {
          nameDe: node.nameDe ?? node.label,
          nameEn: node.label,
          kind: node.kind,
          versions: perVersion,
        };
      }
      done += 1;
      if (done % 10 === 0) console.log(`  … ${done}/${nodes.length} nodes`);
    },
    6,
  );
  return result;
}

/* ---------- dex: types + BST for every species we reference ---------- */

async function buildDex(ids) {
  const dex = {};
  let done = 0;
  await pool(
    ids,
    async (id) => {
      const p = await get(`${API}/pokemon/${id}`);
      dex[id] = {
        slug: p.name,
        /* gen-3 typing: use the slot list as-is — every Kanto FRLG species
         * keeps its gen-3 types in the past_types field when they changed */
        types: p.types.sort((a, b) => a.slot - b.slot).map((t) => t.type.name),
        pastTypes: (p.past_types ?? []).filter((pt) => pt.generation.name === 'generation-iii').length
          ? p.past_types
              .find((pt) => pt.generation.name === 'generation-iii')
              .types.sort((a, b) => a.slot - b.slot)
              .map((t) => t.type.name)
          : null,
        bst: p.stats.reduce((s, st) => s + st.base_stat, 0),
      };
      done += 1;
      if (done % 25 === 0) console.log(`  … dex ${done}/${ids.length}`);
    },
    8,
  );
  return dex;
}

/* ---------- curated Pokémon: locations, evolution, catch rate ---------- */

async function buildPokemon(locationSlugs) {
  const out = {};
  const chainUrls = new Set();
  for (const id of POKEMON_IDS) {
    const [p, species, encounters] = await Promise.all([
      get(`${API}/pokemon/${id}`),
      get(`${API}/pokemon-species/${id}`),
      get(`${API}/pokemon/${id}/encounters`),
    ]);
    chainUrls.add(species.evolution_chain.url);

    /* FRLG locations, slot-summed per area × method bucket × version */
    const loc = { firered: [], leafgreen: [] };
    for (const e of encounters) {
      const areaName = e.location_area.name;
      for (const v of POKEMON_VERSIONS) {
        const vd = e.version_details.find((x) => x.version.name === v);
        if (!vd || vd.encounter_details.length === 0) continue;
        const byBucket = bucketsFromDetails(vd.encounter_details);
        /* map the area back to our Kanto node (longest locationSlug prefix) */
        const nodeSlug = locationSlugs
          .filter((s) => areaName === s || areaName.startsWith(`${s}-`))
          .sort((a, b) => b.length - a.length)[0];
        const node = nodeSlug ? kanto.nodes.find((n) => n.locationSlug === nodeSlug) : null;
        if (!node) continue; /* only locations that exist on our Kanto map */
        for (const [b, g] of byBucket) {
          loc[v].push({
            area: areaName,
            nodeId: node?.id ?? null,
            nodeDe: node?.nameDe ?? null,
            nodeEn: node?.label ?? null,
            method: b,
            chance: g.chance,
            minLevel: g.min,
            maxLevel: g.max,
          });
        }
      }
    }
    for (const v of POKEMON_VERSIONS) {
      loc[v].sort((a, b) => b.chance - a.chance || a.area.localeCompare(b.area));
    }

    out[id] = {
      slug: p.name,
      catchRate: species.capture_rate,
      evoChainUrl: species.evolution_chain.url,
      locations: loc,
    };
    console.log(`  … pokemon ${id} (${p.name})`);
  }

  /* evolution chains (restricted to gen ≤ 3 species — FRLG context) */
  const chains = {};
  for (const url of chainUrls) {
    const chain = await get(url);
    const steps = [];
    const walk = (link) => {
      const fromId = idFromUrl(link.species.url);
      for (const evo of link.evolves_to ?? []) {
        const toId = idFromUrl(evo.species.url);
        if (fromId <= 386 && toId <= 386) {
          const d = evo.evolution_details[0] ?? {};
          steps.push({
            from: fromId,
            to: toId,
            trigger: d.trigger?.name ?? null,
            minLevel: d.min_level ?? null,
            item: d.item?.name ?? null,
            heldItem: d.held_item?.name ?? null,
            minHappiness: d.min_happiness ?? null,
            timeOfDay: d.time_of_day || null,
            knownMove: d.known_move?.name ?? null,
            location: d.location?.name ?? null,
          });
        }
        walk(evo);
      }
    };
    walk(chain.chain);
    chains[url] = steps;
  }
  for (const id of POKEMON_IDS) {
    out[id].evo = chains[out[id].evoChainUrl];
    delete out[id].evoChainUrl;
  }
  return out;
}

/* ---------- hoenn main (additive; Kanto artifacts untouched) ---------- */

/* slug mapping (mirror of src/lib/seo-routes-hoenn.ts — keep in sync!) */
const HOENN_ROUTE_SLUGS = {
  'littleroot-town': ['wurzelheim', 'littleroot-town'],
  'hoenn-route-101': ['route-101', 'route-101'],
  'oldale-town': ['rosaltstadt', 'oldale-town'],
  'hoenn-route-102': ['route-102', 'route-102'],
  'petalburg-city': ['bluetenburg-city', 'petalburg-city'],
  'hoenn-route-104': ['route-104', 'route-104'],
  'petalburg-woods': ['bluetenburgwald', 'petalburg-woods'],
  'rustboro-city': ['metarost-city', 'rustboro-city'],
  'hoenn-route-116': ['route-116', 'route-116'],
  'rusturf-tunnel': ['metaflurtunnel', 'rusturf-tunnel'],
  'hoenn-route-105': ['route-105', 'route-105'],
  'dewford-town': ['faustauhaven', 'dewford-town'],
  'granite-cave': ['granithoehle', 'granite-cave'],
  'hoenn-route-108': ['route-108', 'route-108'],
  'hoenn-route-109': ['route-109', 'route-109'],
  'slateport-city': ['graphitport-city', 'slateport-city'],
  'hoenn-route-110': ['route-110', 'route-110'],
  'mauville-city': ['malvenfroh-city', 'mauville-city'],
  'verdanturf-town': ['wiesenflur', 'verdanturf-town'],
  'hoenn-route-117': ['route-117', 'route-117'],
  'hoenn-route-111': ['route-111', 'route-111'],
  'hoenn-route-112': ['route-112', 'route-112'],
  'fiery-path': ['feuriger-pfad', 'fiery-path'],
  'hoenn-route-113': ['route-113', 'route-113'],
  'fallarbor-town': ['laubwechselfeld', 'fallarbor-town'],
  'meteor-falls': ['meteorfaelle', 'meteor-falls'],
  'hoenn-route-114': ['route-114', 'route-114'],
  'mt-chimney': ['schlotberg', 'mt-chimney'],
  'lavaridge-town': ['bad-lavastadt', 'lavaridge-town'],
  'hoenn-route-103': ['route-103', 'route-103'],
  'hoenn-route-118': ['route-118', 'route-118'],
  'hoenn-route-119': ['route-119', 'route-119'],
  'fortree-city': ['baumhausen-city', 'fortree-city'],
  'hoenn-route-120': ['route-120', 'route-120'],
  'hoenn-route-121': ['route-121', 'route-121'],
  'hoenn-safari-zone': ['safari-zone', 'safari-zone'],
  'lilycove-city': ['seegrasulb-city', 'lilycove-city'],
  'mt-pyre': ['pyroberg', 'mt-pyre'],
  'hoenn-route-124': ['route-124', 'route-124'],
  'mossdeep-city': ['moosbach-city', 'mossdeep-city'],
  'shoal-cave': ['kuestenhoehle', 'shoal-cave'],
  'sootopolis-city': ['xeneroville', 'sootopolis-city'],
  'hoenn-route-128': ['route-128', 'route-128'],
  'sky-pillar': ['himmelturm', 'sky-pillar'],
  'hoenn-route-129': ['route-129', 'route-129'],
  'pacifidlog-town': ['flossbrunn', 'pacifidlog-town'],
  'hoenn-victory-road': ['siegesstrasse', 'victory-road'],
  'ever-grande-city': ['prachtpolis-city', 'ever-grande-city'],
};

const writeJson = (file, data) => {
  writeFileSync(path.join(root, file), `${JSON.stringify(data, null, 1)}\n`);
  console.log(`[gen] wrote ${file}`);
};

async function mainHoenn() {
  console.log('[gen/hoenn] routes…');
  const routes = await buildRoutes();
  console.log(`[gen/hoenn] ${Object.keys(routes).length}/${kanto.nodes.length} nodes with encounters`);

  const speciesIds = new Set();
  for (const nd of Object.values(routes)) {
    for (const groups of Object.values(nd.versions)) {
      for (const g of groups) for (const r of g.rows) speciesIds.add(r.id);
    }
  }
  console.log(`[gen/hoenn] dex for ${speciesIds.size} species…`);
  const dex = await buildDex([...speciesIds].sort((a, b) => a - b));

  const names = {};
  for (const id of speciesIds) {
    names[id] = { de: nameDe(id) ?? nameEn(id, dex[id]?.slug ?? String(id)), en: nameEn(id, dex[id]?.slug ?? String(id)) };
  }

  /* meta summary — "most common catch" counts wild encounters only, from
   * the default version (emerald), same rule as the Kanto generator */
  const metaRoutes = {};
  for (const [nodeId, nd] of Object.entries(routes)) {
    /* framing stays Smaragd: ORAS-only nodes get no SEO page (same rule as
     * the Kanto generator — no page without framing-version encounters) */
    const fr = nd.versions.emerald;
    if (!fr || fr.length === 0) continue;
    const all = fr.flatMap((g) => g.rows);
    const top = [...all].filter((r) => !r.isStatic).sort((a, b) => b.chance - a.chance)[0];
    const speciesCount = new Set(all.map((r) => r.id)).size;
    const [de, en] = HOENN_ROUTE_SLUGS[nodeId] ?? [nodeId, nodeId];
    metaRoutes[nodeId] = {
      slugDe: de,
      slugEn: en,
      nameDe: nd.nameDe,
      nameEn: nd.nameEn,
      topId: top?.id ?? null,
      topNameDe: top ? names[top.id].de : null,
      topNameEn: top ? names[top.id].en : null,
      topChance: top?.chance ?? null,
      speciesCount,
    };
  }

  writeJson('src/data/routes-hoenn.json', { nodes: routes, dex, names });
  /* merge into the existing meta summary — Kanto blocks stay as committed */
  const metaPath = path.join(root, 'src/data/seo-meta-gen.json');
  const meta = JSON.parse(readFileSync(metaPath, 'utf8'));
  meta.routesHoenn = metaRoutes;
  writeJson('src/data/seo-meta-gen.json', meta);
  console.log('[gen/hoenn] done.');
}

/* ---------- kanto main (default — output unchanged) ---------- */

async function mainKanto() {
console.log('[gen] routes…');
const routes = await buildRoutes();
const routeNodeIds = Object.keys(routes);
console.log(`[gen] ${routeNodeIds.length}/${kanto.nodes.length} nodes with encounters`);

/* every species referenced anywhere */
const speciesIds = new Set(POKEMON_IDS);
for (const nd of Object.values(routes)) {
  for (const groups of Object.values(nd.versions)) {
    for (const g of groups) for (const r of g.rows) speciesIds.add(r.id);
  }
}
console.log(`[gen] dex for ${speciesIds.size} species…`);
const dex = await buildDex([...speciesIds].sort((a, b) => a - b));

console.log('[gen] curated pokémon…');
const locationSlugs = kanto.nodes.map((n) => n.locationSlug).filter(Boolean);
const pokemon = await buildPokemon(locationSlugs);

/* names for everything referenced */
const names = {};
for (const id of speciesIds) {
  names[id] = { de: nameDe(id) ?? nameEn(id, dex[id]?.slug ?? String(id)), en: nameEn(id, dex[id]?.slug ?? String(id)) };
}
/* evolution targets may be outside the encounter set */
for (const entry of Object.values(pokemon)) {
  for (const s of entry.evo) {
    for (const id of [s.from, s.to]) {
      if (!names[id]) {
        const p = await get(`${API}/pokemon/${id}`);
        names[id] = { de: nameDe(id) ?? title(p.name), en: title(p.name) };
        if (!dex[id]) await buildDex([id]).then((d) => Object.assign(dex, d));
      }
    }
  }
}

/* meta summary for the sync registry in src/lib/seo.ts */
const metaRoutes = {};
for (const [nodeId, nd] of Object.entries(routes)) {
  /* page framing stays FRLG: nodes with only cross-gen encounters (HGSS
   * headbutt trees in Pewter City) get no SEO page — a "Feuerrot" page
   * without a single FireRed encounter would be a doorway page */
  const fr = nd.versions.firered;
  if (!fr || fr.length === 0) continue;
  const all = fr.flatMap((g) => g.rows);
  /* "most common catch" counts wild encounters only — static gift/bought
   * encounters (e.g. the Magikarp salesman) are excluded */
  const top = [...all].filter((r) => !r.isStatic).sort((a, b) => b.chance - a.chance)[0];
  const speciesCount = new Set(all.map((r) => r.id)).size;
  const [de, en] = ROUTE_SLUGS[nodeId] ?? [nodeId, nodeId];
  metaRoutes[nodeId] = {
    slugDe: de,
    slugEn: en,
    nameDe: nd.nameDe,
    nameEn: nd.nameEn,
    topId: top?.id ?? null,
    topNameDe: top ? names[top.id].de : null,
    topNameEn: top ? names[top.id].en : null,
    topChance: top?.chance ?? null,
    speciesCount,
  };
}
const metaPokemon = {};
for (const id of POKEMON_IDS) {
  const p = pokemon[id];
  const topDe = p.locations.firered[0];
  const topEn = p.locations.leafgreen[0] ?? topDe;
  metaPokemon[id] = {
    nameDe: names[id].de,
    nameEn: names[id].en,
    locDe: topDe?.nodeDe ?? (topDe ? title(topDe.area.replace(/-area$/, '')) : null),
    locEn: topEn?.nodeEn ?? (topEn ? title(topEn.area.replace(/-area$/, '')) : null),
    topChance: topDe?.chance ?? null,
  };
}

const write = (file, data) => {
  writeFileSync(path.join(root, file), `${JSON.stringify(data, null, 1)}\n`);
  console.log(`[gen] wrote ${file}`);
};

write('src/data/routes-kanto.json', { nodes: routes, dex, names });
write('src/data/pokemon-seo.json', { ids: POKEMON_IDS, pokemon, dex: Object.fromEntries(POKEMON_IDS.map((id) => [id, dex[id]])), names: Object.fromEntries(POKEMON_IDS.map((id) => [id, names[id]])) , evoNames: names });
/* preserve additive blocks from the region generators (routesHoenn) */
let prevMeta = {};
try {
  prevMeta = JSON.parse(readFileSync(path.join(root, 'src/data/seo-meta-gen.json'), 'utf8'));
} catch { /* first run */ }
write('src/data/seo-meta-gen.json', { ...prevMeta, routes: metaRoutes, pokemon: metaPokemon });
console.log('[gen] done.');
}

if (REGION === 'hoenn') {
  await mainHoenn();
} else {
  await mainKanto();
}
