/* PayPal QR → clean SVG for dark UI (white modules, blue accents preserved).
 * Input: cropped square PNG (public/paypal-qr-source.png or argv[2]).
 * Output: public/paypal-qr.svg */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const input = process.argv[2] ?? path.join(root, 'public', 'paypal-qr-source.png');
const output = process.argv[3] ?? path.join(root, 'public', 'paypal-qr.svg');

const OUT = 512;
const QUIET = 4; /* standard QR quiet zone (modules) */

function lum(r, g, b) {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function classify(r, g, b) {
  if (lum(r, g, b) > 235) return 'transparent';
  if (b > r + 18 && b > g + 5) return b > 170 ? 'blue-light' : 'blue-dark';
  return 'white';
}

function sampleMajority(data, width, height, x0, y0, x1, y1) {
  const counts = { transparent: 0, white: 0, 'blue-dark': 0, 'blue-light': 0 };
  for (let y = y0; y < y1; y++) {
    for (let x = x0; x < x1; x++) {
      const i = (y * width + x) << 2;
      counts[classify(data[i], data[i + 1], data[i + 2])]++;
    }
  }
  let best = 'transparent';
  let max = 0;
  for (const [k, v] of Object.entries(counts)) {
    if (v > max) {
      max = v;
      best = k;
    }
  }
  return best;
}

const png = PNG.sync.read(fs.readFileSync(input));
const { width, height, data } = png;

/* bbox of QR content (non-white pixels) */
let minX = width;
let minY = height;
let maxX = 0;
let maxY = 0;
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const i = (y * width + x) << 2;
    if (classify(data[i], data[i + 1], data[i + 2]) !== 'transparent') {
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }
}

/* estimate module size from finder (7 modules wide) — scan top-left blue run */
let modulePx = 0;
outer: for (let y = minY; y < minY + 80; y++) {
  let run = 0;
  for (let x = minX; x < minX + 120; x++) {
    const i = (y * width + x) << 2;
    const k = classify(data[i], data[i + 1], data[i + 2]);
    if (k === 'blue-dark' || k === 'blue-light' || k === 'white') {
      run++;
    } else if (run > 0) {
      if (run >= 40) {
        modulePx = run / 7;
        break outer;
      }
      run = 0;
    }
  }
}
if (!modulePx) modulePx = (maxX - minX + 1) / 45;

const dataModules = Math.round((maxX - minX + 1) / modulePx);
const gridModules = dataModules + QUIET * 2;
const module = OUT / gridModules;

/* snap origin so modules align to grid */
const originX = minX - QUIET * modulePx;
const originY = minY - QUIET * modulePx;

const colors = {
  white: '#F4F6FC',
  'blue-dark': '#003087',
  'blue-light': '#009CDE',
};

const rects = [];
for (let gy = 0; gy < gridModules; gy++) {
  for (let gx = 0; gx < gridModules; gx++) {
    const x0 = Math.max(0, Math.floor(originX + gx * modulePx));
    const y0 = Math.max(0, Math.floor(originY + gy * modulePx));
    const x1 = Math.min(width, Math.ceil(originX + (gx + 1) * modulePx));
    const y1 = Math.min(height, Math.ceil(originY + (gy + 1) * modulePx));
    if (x1 <= x0 || y1 <= y0) continue;
    const kind = sampleMajority(data, width, height, x0, y0, x1, y1);
    if (kind === 'transparent') continue;
    rects.push(
      `<rect x="${(gx * module).toFixed(3)}" y="${(gy * module).toFixed(3)}" width="${module.toFixed(3)}" height="${module.toFixed(3)}" fill="${colors[kind]}"/>`,
    );
  }
}

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${OUT} ${OUT}" width="${OUT}" height="${OUT}" role="img" aria-label="PayPal QR-Code">
  <title>PayPal QR-Code</title>
  <g shape-rendering="crispEdges">
    ${rects.join('\n    ')}
  </g>
</svg>
`;

fs.writeFileSync(output, svg);
console.log(
  `[paypal-qr-svg] ${rects.length} modules · grid=${gridModules} · modulePx≈${modulePx.toFixed(2)} → ${path.relative(root, output)}`,
);
