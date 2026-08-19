#!/usr/bin/env node
/* restore-pill-font-sizes.mjs — compact rounded-pill labels back to fixed px.
 * Layout (padding/height) scales via rem; pill text stays density-stable. */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(new URL('..', import.meta.url)), 'src');
const PILL_CTX =
  /rounded-pill|MicroChip|SegmentedControl|TypeChipMini|text-(?:micro|damp|pixel)(?:8|9|10|11).*leading-none|leading-none.*text-(?:micro|damp|pixel)(?:8|9|10|11)/;

const SIZES = [11, 10, 9, 8];

function restorePillLine(line) {
  let out = line;
  for (const n of SIZES) {
    out = out.replace(new RegExp(`text-micro${n}(?!\\d)`, 'g'), `text-[${n === 10 ? 14 : n}px] leading-none`);
    out = out.replace(new RegExp(`text-damp-${n}(?!\\d)`, 'g'), `text-[${n === 10 ? 14 : n}px] leading-none`);
    out = out.replace(new RegExp(`text-pixel-${n}(?!\\d)`, 'g'), `text-[${n === 10 ? 14 : n}px] leading-none`);
  }
  out = out.replace(/leading-none(?:\s+leading-none)+/g, 'leading-none');
  return out;
}

function walk(dir, out = []) {
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (extname(ent.name) === '.tsx') out.push(p);
  }
  return out;
}

let changed = 0;
for (const file of walk(ROOT)) {
  const lines = readFileSync(file, 'utf8').split('\n');
  let fileChanged = false;
  const next = lines.map((line) => {
    if (!PILL_CTX.test(line)) return line;
    const out = restorePillLine(line);
    if (out !== line) fileChanged = true;
    return out;
  });
  if (fileChanged) {
    writeFileSync(file, next.join('\n'));
    changed++;
  }
}

console.log(`restore-pill-font-sizes: updated ${changed} files`);
