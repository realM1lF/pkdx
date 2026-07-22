#!/usr/bin/env node
/* build-freeform-regions — EP5.3: generate MAP-LESS region data (Gen 6–9)
 * for Nuzlocke text-mode runs. Fetches PokéAPI /region/{id} location lists,
 * classifies node kinds by name keywords, localizes labels (de via PokéAPI
 * names), and writes src/data/regions/{id}.json in the RegionMap shape
 * (edges: [], x/y: 0 — there is intentionally no map geometry).
 *
 * Usage: node scripts/build-freeform-regions.mjs
 */
import { writeFileSync } from 'node:fs';

const API = 'https://pokeapi.co/api/v2';

const REGIONS = [
  { id: 'kalos', name: 'Kalos', nameDe: 'Kalos', gen: 'VI', accent: '#6E7FD7', versions: ['x-y'], defaultVersion: 'x-y' },
  { id: 'alola', name: 'Alola', nameDe: 'Alola', gen: 'VII', accent: '#F59E4C', versions: ['sun-moon', 'ultra-sun-ultra-moon'], defaultVersion: 'sun-moon' },
  { id: 'galar', name: 'Galar', nameDe: 'Galar', gen: 'VIII', accent: '#9D50BB', versions: ['sword-shield'], defaultVersion: 'sword-shield' },
  { id: 'hisui', name: 'Hisui', nameDe: 'Hisui', gen: 'VIII', accent: '#4CA6A8', versions: ['legends-arceus'], defaultVersion: 'legends-arceus' },
  { id: 'paldea', name: 'Paldea', nameDe: 'Paldea', gen: 'IX', accent: '#E14D6B', versions: ['scarlet-violet'], defaultVersion: 'scarlet-violet' },
];

const DUNGEON_RE = /(cave|cavern|tunnel|forest|mountain|mt-|victory-road|ruins|tower|depths|mine|well|volcano|crater|chasm|abyss|den|lair|temple|shrine|tomb|graveyard|seafloor|sewer|catacombs|grotto|hollow|thicket|jungle|desert|swamp|marsh|glacier|icefall|snowpoint|waterfall|rapids|spring|lake|river|sea|ocean|bay|cove|reef|island|isle|islet|beach|shore|coast|cliff|peak|summit|plateau|mesa|canyon|gorge|valley|pass|wilds|badlands|wasteland|tundra|glade|grove|meadow|field|plains|prairie|savanna|steppe|highlands|lowlands|hill|slope|trail|path|woods|glen|dunes|oasis|geyser|caldera|lava|magma|core|chamber|vault|crypt|mausoleum|castle|palace|fort|keep|citadel|factory|plant|facility|lab|observatory|station|ship|wreck|underground|underwater|space|distortion|ultra-(space|wormhole|megalopolis|plant|forest|desert|crater|ruin|sea|jungle))/i;

const POSTGAME_RE = /(battle-(frontier|tower|tree|royal|agency|maison|chateau)|victory-road|elite|champion|cerulean|unknown-dungeon|resolution|terminus-cave|friend-safari|ultra-megalopolis|max-lair|slumbering-weald|area-zero|kitakami|blueberry|terarium)/i;

function classify(slug) {
  if (/-route-\d+$/.test(slug) || /-route$/.test(slug)) return 'route';
  if (DUNGEON_RE.test(slug)) return 'dungeon';
  if (/(city|town|village|hamlet)$/.test(slug)) return 'city';
  return 'special';
}

function titleCase(slug) {
  return slug
    .split('-')
    .map((s) => (s.length <= 2 && /^\d+$/.test(s) ? s : s.charAt(0).toUpperCase() + s.slice(1)))
    .join(' ')
    .replace(/\bMt\b/, 'Mt.')
    .trim();
}

/** order key: routes numerically first, then everything alphabetical */
function orderKey(slug) {
  const m = slug.match(/route-(\d+)/);
  return m ? Number(m[1]) : 1000;
}

async function j(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  return r.json();
}

for (const reg of REGIONS) {
  const region = await j(`${API}/region/${reg.id}`);
  const locs = region.locations;
  /* fetch location details for localized names — batched */
  const nodes = [];
  const CONC = 8;
  for (let i = 0; i < locs.length; i += CONC) {
    const batch = await Promise.all(locs.slice(i, i + CONC).map((l) => j(l.url).catch(() => null)));
    for (const loc of batch) {
      if (!loc) continue;
      const slug = loc.name;
      const en = loc.names?.find((n) => n.language.name === 'en')?.name;
      const de = loc.names?.find((n) => n.language.name === 'de')?.name;
      nodes.push({
        id: `${reg.id}-${slug}`,
        label: en ?? titleCase(slug),
        ...(de && de !== en ? { nameDe: de } : {}),
        kind: classify(slug),
        x: 0,
        y: 0,
        order: 0,
        locationSlug: slug,
        ...(POSTGAME_RE.test(slug) ? { postGame: true } : {}),
      });
    }
    process.stdout.write(`\r${reg.id}: ${Math.min(i + CONC, locs.length)}/${locs.length}`);
  }
  nodes.sort((a, b) => {
    const ka = orderKey(a.locationSlug);
    const kb = orderKey(b.locationSlug);
    if (ka !== kb) return ka - kb;
    if ((a.postGame ? 1 : 0) !== (b.postGame ? 1 : 0)) return (a.postGame ? 1 : 0) - (b.postGame ? 1 : 0);
    return a.label.localeCompare(b.label);
  });
  nodes.forEach((n, i) => (n.order = i + 1));

  const out = {
    region: reg.id,
    name: reg.name,
    nameDe: reg.nameDe,
    gen: reg.gen,
    accent: reg.accent,
    viewBox: '0 0 1200 840',
    versions: reg.versions,
    defaultVersion: reg.defaultVersion,
    coverage: 0,
    speciesCount: 0,
    nodes,
    edges: [],
  };
  writeFileSync(`src/data/regions/${reg.id}.json`, JSON.stringify(out, null, 2) + '\n');
  console.log(`\n${reg.id}: ${nodes.length} nodes written`);
}
console.log('done');
