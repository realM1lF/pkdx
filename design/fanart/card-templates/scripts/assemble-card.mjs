#!/usr/bin/env node
/**
 * Assemble a fan-art Pokémon card from template layers + JSON config.
 *
 * Usage (from design/fanart):
 *   node card-templates/scripts/assemble-card.mjs card-templates/examples/baby-bisasam.de.json
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const LAYERS = path.join(ROOT, 'layers');
const LAYOUT = JSON.parse(fs.readFileSync(path.join(ROOT, 'layout.json'), 'utf8'));
const W = LAYOUT.canvas.width;
const H = LAYOUT.canvas.height;

function runMagick(args) {
  execFileSync('magick', args, { stdio: 'pipe' });
}

function compositeAt(base, layer, x, y, out = base) {
  runMagick([base, layer, '-geometry', `+${x}+${y}`, '-compose', 'Over', '-composite', out]);
}

function drawText(canvas, { x, y, text, size = 28, weight = 700, anchor = 'left', fill = '#1a1a1a' }) {
  const font = weight >= 700 ? 'Adwaita-Sans-Bold' : 'Adwaita-Sans';
  const gravity = anchor === 'right' ? 'NorthEast' : anchor === 'center' ? 'North' : 'NorthWest';
  runMagick([
    canvas,
    '-gravity',
    gravity,
    '-font',
    font,
    '-pointsize',
    String(size),
    '-fill',
    fill,
    '-stroke',
    'rgba(255,255,255,0.8)',
    '-strokewidth',
    '1.1',
    '-annotate',
    `+${x}+${y}`,
    text,
    canvas,
  ]);
}

function assemble(configPath) {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const lang = config.lang ?? 'de';
  const labels = LAYOUT.labels[lang] ?? LAYOUT.labels.de;
  const outDir = path.resolve(ROOT, config.outputDir ?? '../output');
  const outFile = path.join(outDir, config.output ?? `${config.slug}-${lang}.png`);
  fs.mkdirSync(outDir, { recursive: true });

  const artwork = path.resolve(ROOT, config.artwork ?? 'layers/artwork/baby-bisasam.png');
  const tmp = path.join(outDir, `.tmp-${config.slug}-${lang}.png`);

  fs.copyFileSync(artwork, tmp);

  if (config.textPanel !== false) {
    compositeAt(tmp, path.join(LAYERS, 'text-panel-frosted.png'), 0, 0);
  }

  compositeAt(tmp, path.join(LAYERS, 'frame-gold-holo.png'), 0, 0);

  const badge = path.join(LAYERS, lang === 'en' ? 'badges/basic-en.png' : 'badges/basic-de.png');
  if (fs.existsSync(badge)) {
    const b = LAYOUT.regions.badgeBasic;
    compositeAt(tmp, badge, b.x, b.y);
  }

  const name = LAYOUT.regions.name;
  drawText(tmp, { x: name.x, y: name.y, text: config.name, size: LAYOUT.fonts.name.size });

  const hp = LAYOUT.regions.hp;
  drawText(tmp, {
    x: hp.marginRight ?? 68,
    y: hp.y,
    text: `${labels.hp} ${config.hp}`,
    size: LAYOUT.fonts.hp.size,
    anchor: 'right',
  });

  if (config.type === 'grass') {
    const t = LAYOUT.regions.typeIcon;
    compositeAt(tmp, path.join(LAYERS, 'icons/grass-energy.png'), t.x, t.y);
  }

  const attack = config.attacks?.[0];
  if (attack) {
    const row = LAYOUT.regions.attackRow;
    if (attack.cost?.includes('grass')) {
      compositeAt(tmp, path.join(LAYERS, 'icons/grass-energy.png'), row.x - 8, row.y + 8);
    }
    drawText(tmp, { x: row.x + 64, y: row.y + 10, text: attack.name, size: LAYOUT.fonts.attack.size });
    drawText(tmp, {
      x: row.marginRight ?? 56,
      y: row.y + 10,
      text: String(attack.damage ?? ''),
      size: LAYOUT.fonts.attack.size,
      anchor: 'right',
    });
    if (attack.effect) {
      const fx = LAYOUT.regions.attackEffect;
      drawText(tmp, { x: fx.x, y: fx.y, text: attack.effect, size: LAYOUT.fonts.body.size, weight: 400 });
    }
  }

  const stats = LAYOUT.regions.statsBar;
  const statsY = stats.y + 6;
  drawText(tmp, { x: stats.x, y: statsY, text: labels.weakness, size: LAYOUT.fonts.micro.size, weight: 400 });
  drawText(tmp, { x: 300, y: statsY, text: labels.resistance, size: LAYOUT.fonts.micro.size, weight: 400 });
  drawText(tmp, { x: 560, y: statsY, text: labels.retreat, size: LAYOUT.fonts.micro.size, weight: 400 });

  if (config.weakness === 'fire') {
    compositeAt(tmp, path.join(LAYERS, 'icons/fire-weakness.png'), 168, 1118);
    drawText(tmp, { x: 202, y: statsY, text: '×2', size: LAYOUT.fonts.micro.size, weight: 700 });
  }
  if (config.retreat != null) {
    compositeAt(tmp, path.join(LAYERS, 'icons/colorless-retreat.png'), 720, 1118);
  }

  if (config.illustrator) {
    const f = LAYOUT.regions.footerLeft;
    drawText(tmp, { x: f.x, y: f.y, text: `Illus. ${config.illustrator}`, size: LAYOUT.fonts.micro.size, weight: 400 });
  }
  if (config.setNumber) {
    const f = LAYOUT.regions.footerLeft;
    drawText(tmp, { x: f.x + 180, y: f.y + 28, text: config.setNumber, size: LAYOUT.fonts.micro.size, weight: 400 });
  }
  if (config.flavor) {
    const f = LAYOUT.regions.flavor;
    drawText(tmp, {
      x: f.marginRight ?? 56,
      y: f.y,
      text: config.flavor,
      size: LAYOUT.fonts.micro.size,
      weight: 400,
      anchor: 'right',
    });
  }

  fs.copyFileSync(tmp, outFile);
  fs.rmSync(tmp, { force: true });
  console.log('Assembled →', outFile);
}

const configPath = process.argv[2];
if (!configPath) {
  console.error('Usage: node assemble-card.mjs <config.json>');
  process.exit(1);
}

assemble(path.resolve(configPath));
