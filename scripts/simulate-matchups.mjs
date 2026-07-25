#!/usr/bin/env node
/* simulate-matchups — real engine results for the 35 curated matchup pages
 * (/de/versus/<a>-gegen-<b> · /en/versus/<a>-vs-<b>).
 *
 * What it does:
 *   1. bundles src/lib/battle/sim-batch.ts (engine wrapper, esbuild → scripts/.cache)
 *   2. fetches the PokéAPI payloads for all matchup species (cached on disk)
 *   3. resolves the standard sets with the Versus default resolution
 *      (wild last-4 level-up moves @50, assumed-stage padding — see sim-batch.ts)
 *   4. simulates 100 greedy-vs-greedy battles per matchup on the REAL battle
 *      engine (@pkmn/sim via MicroBattle.autoBattle, gen9customgame, seeded)
 *   5. computes the calc overview (top-move damage ranges, speed, types)
 *   6. writes src/data/matchups.json (no timestamps → byte-identical reruns)
 *
 * Seed schema (determinism): per battle j of matchup S the 4-word sim PRNG
 * seed is splitmix32(fnv1a(S) ^ (j+1)·0x9E3779B9) — see matchupSeed() in
 * src/lib/battle/sim-batch.ts. Battles 1,3,5… swap the sim sides so any
 * first-side artifact cancels out. Two runs must produce identical JSON.
 *
 * Usage: node scripts/simulate-matchups.mjs [--battles N] [--only slug]
 */
import { build } from 'esbuild';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const cacheDir = path.join(root, 'scripts', '.cache', 'pokeapi');
mkdirSync(cacheDir, { recursive: true });

/* ---------- the 35 curated matchups (dex A, dex B) ----------
 * Criteria: search-volume evidence in research/battle-seo/01-keywords.md
 * (cluster EN-C/DE-C — marked „belegt"), iconic status in the community,
 * mechanical interest (type interplay, speed tiers, bulk vs offense). */
const MATCHUPS = [
  [6, 9], // charizard/blastoise — belegt (splicedonline, vsbattles, pvpoke pairing)
  [6, 3], // charizard/venusaur — belegt (serebii thread), starter triangle
  [25, 6], // pikachu/charizard — belegt (ncesc „can charizard defeat pikachu")
  [150, 151], // mewtwo/mew — iconic gen-1 pair
  [384, 150], // rayquaza/mewtwo — belegt (ncesc „mega rayquaza vs mewtwo")
  [493, 150], // arceus/mewtwo — belegt-adjacent (orbispatches „can rayquaza beat arceus")
  [130, 149], // gyarados/dragonite — iconic gen-1 power pair
  [94, 65], // gengar/alakazam — iconic gen-1 special duel
  [257, 254], // blaziken/sceptile — belegt (BisaBoard „Lohgock vs. Gewaldro")
  [445, 464], // garchomp/rhyperior — belegt (forumla „Ragoran oder Knakrack?")
  [483, 484], // dialga/palkia — iconic box legends
  [448, 445], // lucario/garchomp — popular gen-4 offensive pair
  [149, 6], // dragonite/charizard — iconic
  [248, 376], // tyranitar/metagross — pseudo-legendary duel
  [151, 493], // mew/arceus — belegt („who wins arceus or mew")
  [94, 487], // gengar/giratina — belegt („can gengar beat giratina")
  [800, 890], // necrozma/eternatus — belegt („can necrozma beat eternatus")
  [25, 150], // pikachu/mewtwo — belegt („can pikachu defeat mewtwo")
  [143, 68], // snorlax/machamp — classic bulk vs fighting
  [3, 9], // venusaur/blastoise — completes the starter triangle
  [392, 395], // infernape/empoleon — sinnoh starter duel
  [282, 475], // gardevoir/gallade — iconic pair (belegt-adjacent BisaBoard Guardevoir)
  [212, 127], // scizor/pinsir — bug rivals
  [59, 38], // arcanine/ninetales — fire rivals
  [373, 149], // salamence/dragonite — pseudo dragons
  [445, 373], // garchomp/salamence — gen-3/4 pseudo dragons
  [635, 149], // hydreigon/dragonite — dark dragon vs classic
  [249, 250], // lugia/ho-oh — iconic gen-2 tower duo
  [382, 383], // kyogre/groudon — iconic weather war
  [643, 644], // reshiram/zekrom — iconic gen-5 duo
  [658, 448], // greninja/lucario — modern popularity pair
  [25, 26], // pikachu/raichu — anime classic
  [131, 143], // lapras/snorlax — bulk battle
  [350, 130], // milotic/gyarados — thematic (magikarp/feebas lines)
  [248, 149], // tyranitar/dragonite — gen-2 pseudo classic
];

const args = process.argv.slice(2);
const optValue = (flag, dflt) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : dflt;
};
const BATTLES = Number(optValue('--battles', '100'));
const ONLY = optValue('--only', null);

/* ---------- PokéAPI fetch with disk cache ---------- */
const API = 'https://pokeapi.co/api/v2';

async function cachedJson(kind, id) {
  const file = path.join(cacheDir, `${kind}-${id}.json`);
  if (existsSync(file)) return JSON.parse(readFileSync(file, 'utf8'));
  const res = await fetch(`${API}/${kind}/${id}`);
  if (!res.ok) throw new Error(`PokéAPI ${res.status} for ${kind}/${id}`);
  const data = await res.json();
  writeFileSync(file, JSON.stringify(data));
  return data;
}

const displayNameOf = (species, lang) =>
  species.names.find((n) => n.language.name === lang)?.name ?? species.name;

const slugifyDe = (name) => name.toLowerCase().replace(/[.']/g, '').replace(/\s+/g, '-');

/* ---------- 1. bundle the sim core ---------- */
const bundleOut = path.join(root, 'scripts', '.cache', 'sim-batch.mjs');
await build({
  entryPoints: [path.join(root, 'src/lib/battle/sim-batch.ts')],
  bundle: true,
  format: 'esm',
  platform: 'node',
  outfile: bundleOut,
  external: ['@pkmn/sim', '@smogon/calc', '@pkmn/data', '@pkmn/dex'],
  logLevel: 'warning',
});
const batch = await import(bundleOut);
const simLoader = () => import('@pkmn/sim');

/* ---------- 2+3. species data + standard sets ---------- */
const dexIds = [...new Set(MATCHUPS.flat())];
const pokemon = new Map();
const species = new Map();
for (const id of dexIds) {
  pokemon.set(id, await cachedJson('pokemon', id));
  species.set(id, await cachedJson('pokemon-species', id));
}

async function resolveSet(id) {
  const p = pokemon.get(id);
  /* canonical species slug ('giratina', not the default-form slug
   * 'giratina-altered') — calc + slugs need the base species id */
  const speciesSlug = species.get(id).name;
  let details = new Map();
  let set = batch.resolveMatchupSet(p, batch.MATCHUP_LEVEL, details);
  if (set.moves.length < 4) {
    // assumed stage needs move details — fetch the level-up pool candidates
    await Promise.all(
      batch.detailCandidates(p).map(async (slug) => {
        try {
          details.set(slug, await cachedJson('move', slug));
        } catch {
          /* thin data — keep the wild stage result */
        }
      }),
    );
    set = batch.resolveMatchupSet(p, batch.MATCHUP_LEVEL, details);
  }
  return { ...set, species: speciesSlug };
}

/* ---------- 4+5+6. simulate, calc, emit ---------- */
const entries = [];
for (const [dexA, dexB] of MATCHUPS) {
  const nameEnA = displayNameOf(species.get(dexA), 'en');
  const nameEnB = displayNameOf(species.get(dexB), 'en');
  const nameDeA = displayNameOf(species.get(dexA), 'de');
  const nameDeB = displayNameOf(species.get(dexB), 'de');
  const slugEn = `${species.get(dexA).name}-vs-${species.get(dexB).name}`;
  const slugDe = `${slugifyDe(nameDeA)}-gegen-${slugifyDe(nameDeB)}`;
  if (ONLY && ONLY !== slugEn) continue;

  const setA = await resolveSet(dexA);
  const setB = await resolveSet(dexB);
  const stats = await batch.simulateMatchup(setA, setB, slugEn, simLoader, BATTLES);
  const overview = batch.calcOverview(setA, setB);
  if (!overview) throw new Error(`calc overview failed for ${slugEn}`);

  entries.push({
    slugDe,
    slugEn,
    dexA,
    dexB,
    nameDeA,
    nameDeB,
    nameEnA,
    nameEnB,
    ...stats,
    speedA: overview.speedA,
    speedB: overview.speedB,
    typesA: overview.typesA,
    typesB: overview.typesB,
    setsA: setA.moves,
    setsB: setB.moves,
    setSourceA: setA.source,
    setSourceB: setB.source,
    movesA: overview.movesA,
    movesB: overview.movesB,
  });
  console.log(
    `${slugEn.padEnd(30)} ${String(stats.winsA).padStart(3)}–${String(stats.winsB).padEnd(3)} ties ${stats.ties} · median ${stats.medianTurns} turns`,
  );
}

if (ONLY) {
  console.log('--only: single matchup printed above, matchups.json NOT written');
  process.exit(0);
}

const out = {
  meta: {
    engine: '@pkmn/sim via src/lib/battle/engine.ts (MicroBattle.autoBattle, greedy vs greedy)',
    format: batch.MATCHUP_FORMAT,
    level: batch.MATCHUP_LEVEL,
    battles: BATTLES,
    versionGroup: batch.MATCHUP_VERSION_GROUP,
    seedSchema:
      'seed(j) = splitmix32(fnv1a(slugEn) ^ (j+1)*0x9E3779B9), 4x16-bit words; odd j swaps sim sides; scripts/simulate-matchups.mjs',
  },
  matchups: entries,
};
const outFile = path.join(root, 'src/data/matchups.json');
writeFileSync(outFile, JSON.stringify(out, null, 2) + '\n');
console.log(`\nwrote ${path.relative(root, outFile)} — ${entries.length} matchups × ${BATTLES} battles`);
