#!/usr/bin/env node
/**
 * Extract reusable card layers from the reference card + full-art artwork.
 *
 * Usage (from design/fanart):
 *   node card-templates/scripts/extract-templates.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const FANART = path.resolve(ROOT, '..');
const OUT = path.join(ROOT, 'layers');

const CARD = path.join(FANART, 'baby-bisasam-pokemon-card.png');
const ART = path.join(FANART, 'baby-bisasam-fullart-card.png');

function loadPng(file) {
  return PNG.sync.read(fs.readFileSync(file));
}

function savePng(file, png) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, PNG.sync.write(png));
}

function clone(png) {
  const out = new PNG({ width: png.width, height: png.height });
  png.data.copy(out.data);
  return out;
}

function crop(src, x, y, w, h) {
  const out = new PNG({ width: w, height: h });
  for (let row = 0; row < h; row++) {
    for (let col = 0; col < w; col++) {
      const sx = x + col;
      const sy = y + row;
      const si = (src.width * sy + sx) << 2;
      const di = (w * row + col) << 2;
      out.data[di] = src.data[si];
      out.data[di + 1] = src.data[si + 1];
      out.data[di + 2] = src.data[si + 2];
      out.data[di + 3] = src.data[si + 3];
    }
  }
  return out;
}

function lum(r, g, b) {
  return (r + g + b) / 3;
}

function sat(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return max === 0 ? 0 : (max - min) / max;
}

function isGoldBorder(r, g, b, x, y, w, h) {
  const edge = 42;
  const onEdge = x < edge || y < edge || x >= w - edge || y >= h - edge;
  if (!onEdge) return false;
  const s = sat(r, g, b);
  const l = lum(r, g, b);
  return l > 90 && s > 0.12 && r > g * 0.72;
}

function extractFrame(card) {
  const out = new PNG({ width: card.width, height: card.height });
  for (let y = 0; y < card.height; y++) {
    for (let x = 0; x < card.width; x++) {
      const i = (card.width * y + x) << 2;
      const r = card.data[i];
      const g = card.data[i + 1];
      const b = card.data[i + 2];
      const a = card.data[i + 3];
      if (isGoldBorder(r, g, b, x, y, card.width, card.height)) {
        out.data[i] = r;
        out.data[i + 1] = g;
        out.data[i + 2] = b;
        out.data[i + 3] = a;
      } else {
        out.data[i + 3] = 0;
      }
    }
  }
  return out;
}

function extractUiOverlay(card, art) {
  const out = new PNG({ width: card.width, height: card.height });
  const y0 = Math.floor(card.height * 0.56);
  for (let y = 0; y < card.height; y++) {
    for (let x = 0; x < card.width; x++) {
      const i = (card.width * y + x) << 2;
      const cr = card.data[i];
      const cg = card.data[i + 1];
      const cb = card.data[i + 2];
      const ca = card.data[i + 3];
      const ar = art.data[i];
      const ag = art.data[i + 1];
      const ab = art.data[i + 2];

      const diff = Math.abs(cr - ar) + Math.abs(cg - ag) + Math.abs(cb - ab);
      const cBright = lum(cr, cg, cb);
      const isBorder = isGoldBorder(cr, cg, cb, x, y, card.width, card.height);
      const isTopUi = y < 92 && diff > 40;
      const isBottomUi = y >= y0 && diff > 36 && !(cBright > 165 && sat(cr, cg, cb) < 0.22);
      const isFooter = y >= 1170 && diff > 28;

      if (!isBorder && (isTopUi || isBottomUi || isFooter)) {
        out.data[i] = cr;
        out.data[i + 1] = cg;
        out.data[i + 2] = cb;
        out.data[i + 3] = ca;
      } else {
        out.data[i + 3] = 0;
      }
    }
  }
  return out;
}

function extractTextPanel(card, art) {
  const out = new PNG({ width: card.width, height: card.height });
  const y0 = Math.floor(card.height * 0.56);
  for (let y = 0; y < card.height; y++) {
    for (let x = 0; x < card.width; x++) {
      const i = (card.width * y + x) << 2;
      const cr = card.data[i];
      const cg = card.data[i + 1];
      const cb = card.data[i + 2];
      const ar = art.data[i];
      const ag = art.data[i + 1];
      const ab = art.data[i + 2];
      const cBright = lum(cr, cg, cb);
      const aBright = lum(ar, ag, ab);
      const isPanel =
        y >= y0 &&
        cBright > 165 &&
        sat(cr, cg, cb) < 0.22 &&
        cBright > aBright + 12;

      if (isPanel) {
        out.data[i] = 255;
        out.data[i + 1] = 255;
        out.data[i + 2] = 255;
        out.data[i + 3] = Math.min(200, Math.round((cBright - aBright) * 2.2));
      } else {
        out.data[i + 3] = 0;
      }
    }
  }
  return out;
}

function main() {
  const card = loadPng(CARD);
  const art = loadPng(ART);

  savePng(path.join(OUT, 'artwork/baby-bisasam.png'), clone(art));
  savePng(path.join(OUT, 'frame-gold-holo.png'), extractFrame(card));
  savePng(path.join(OUT, 'text-panel-frosted.png'), extractTextPanel(card, art));
  savePng(path.join(OUT, 'ui-overlay-reference-de.png'), extractUiOverlay(card, art));

  savePng(path.join(OUT, 'badges/basic-de.png'), crop(card, 24, 28, 96, 34));
  savePng(path.join(OUT, 'icons/grass-energy.png'), crop(card, 948, 36, 36, 36));
  savePng(path.join(OUT, 'icons/fire-weakness.png'), crop(card, 168, 1118, 28, 28));
  savePng(path.join(OUT, 'icons/colorless-retreat.png'), crop(card, 720, 1118, 28, 28));
  savePng(path.join(OUT, 'icons/set-star.png'), crop(card, 318, 1228, 18, 18));

  console.log('Extracted templates →', OUT);
}

main();
