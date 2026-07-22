#!/usr/bin/env node
/* enrich-trainers.mjs — validate regional gym/E4/Champion trainer JSON.
 *
 * Data source: curated manually from Bulbapedia team pages and pret disassembly
 * references (pokeheartgold, pokeemerald, pokeplatinum, pokeblack-white).
 * Output: src/data/enriched/{johto,hoenn,sinnoh,unova}.json
 *
 * Each enriched node key MUST match an id from src/data/regions/{region}.json.
 *
 * Usage: node scripts/enrich-trainers.mjs
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REGIONS = ['johto', 'hoenn', 'sinnoh', 'unova'];

let failed = false;

for (const region of REGIONS) {
  const regionPath = path.join(ROOT, 'src/data/regions', `${region}.json`);
  const enrichedPath = path.join(ROOT, 'src/data/enriched', `${region}.json`);

  const regionJson = JSON.parse(await readFile(regionPath, 'utf8'));
  const enrichedJson = JSON.parse(await readFile(enrichedPath, 'utf8'));

  const nodeIds = new Set(regionJson.nodes.map((n) => n.id));
  const enrichedNodes = Object.keys(enrichedJson.nodes ?? {});

  console.log(`\n[${region}] ${enrichedNodes.length} enriched nodes`);

  for (const nodeId of enrichedNodes) {
    if (!nodeIds.has(nodeId)) {
      console.error(`  ✗ unknown node id "${nodeId}" — not in ${region}.json`);
      failed = true;
      continue;
    }
    const trainers = enrichedJson.nodes[nodeId]?.trainers ?? [];
    if (!trainers.length) {
      console.error(`  ✗ node "${nodeId}" has no trainers`);
      failed = true;
      continue;
    }
    for (const t of trainers) {
      if (!t.name || !t.class || !Array.isArray(t.party) || !t.party.length) {
        console.error(`  ✗ invalid trainer at "${nodeId}": ${JSON.stringify(t.name)}`);
        failed = true;
      }
    }
    console.log(`  ✓ ${nodeId} (${trainers.length} trainer(s))`);
  }
}

if (failed) {
  console.error('\nValidation failed.');
  process.exit(1);
}

console.log('\nAll regional trainer files valid.');
