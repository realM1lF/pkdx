#!/usr/bin/env node
/* fetch-sprites — download the 1025 default front sprites (+ shiny) from the
 * PokeAPI/sprites repo into public/sprites/pokemon/, so the pokédex listing
 * is served from our own host with immutable cache headers instead of
 * GitHub raw (which forces revalidation every 5 minutes).
 *
 * Idempotent: existing files are skipped. Usage: node scripts/fetch-sprites.mjs
 */
import { existsSync, mkdirSync, writeFileSync, statSync } from 'node:fs';

const MAX_ID = 1025;
const REMOTE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';
const OUT = 'public/sprites/pokemon';
const CONC = 24;

mkdirSync(`${OUT}/shiny`, { recursive: true });

const jobs = [];
for (let id = 1; id <= MAX_ID; id++) {
  jobs.push([`${REMOTE}/${id}.png`, `${OUT}/${id}.png`]);
  jobs.push([`${REMOTE}/shiny/${id}.png`, `${OUT}/shiny/${id}.png`]);
}

let done = 0;
let fetched = 0;
let skipped = 0;
let failed = 0;

async function work([url, dest]) {
  if (existsSync(dest) && statSync(dest).size > 0) {
    skipped++;
    done++;
    return;
  }
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(String(res.status));
    const buf = Buffer.from(await res.arrayBuffer());
    writeFileSync(dest, buf);
    fetched++;
  } catch (e) {
    failed++;
    console.error(`FAIL ${url}: ${e.message}`);
  }
  done++;
  if (done % 200 === 0) process.stdout.write(`\r${done}/${jobs.length}`);
}

for (let i = 0; i < jobs.length; i += CONC) {
  await Promise.all(jobs.slice(i, i + CONC).map(work));
}
console.log(`\ndone: ${fetched} fetched, ${skipped} skipped, ${failed} failed (of ${jobs.length})`);
process.exit(failed > 0 ? 1 : 0);
