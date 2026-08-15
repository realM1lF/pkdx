/** SEO pages only know WALK|SURF|FISH|STATIC|OTHER — swarm/radio/headbutt
 * land in OTHER (not grass); feebas tiles land in STATIC (not FISH). */

const SURF = new Set(['surf', 'surf-spots']);
const FISH = new Set(['old-rod', 'good-rod', 'super-rod', 'fish', 'fishing', 'super-rod-spots']);
/* gift / one-off static / trade / tile-only — never wild (Poké Flute Snorlax,
 * in-game trades, Sudowoodo, Devon-Scope Kecleon, Feebas tiles). Keep in sync
 * with STATIC_METHODS in src/lib/mapdata.ts. */
const STATIC = new Set([
  'gift', 'gift-egg', 'only-one', 'static', 'pokeflute', 'npc-trade',
  'squirt-bottle', 'devon-scope', 'feebas-tile-fishing',
]);

export function exclusiveAxes(names) {
  const axes = { time: '', swarm: '', radio: '', headbutt: '' };
  for (const raw of names) {
    const n = String(raw).toLowerCase();
    if (n === 'time-morning' || n === 'morning') axes.time = 'morning';
    else if (n === 'time-day' || n === 'day') axes.time = 'day';
    else if (n === 'time-night' || n === 'night') axes.time = 'night';
    else if (n === 'swarm-yes' || n === 'swarm') axes.swarm = 'yes';
    else if (n === 'swarm-no') axes.swarm = 'no';
    else if (n.startsWith('radio-')) axes.radio = n.replace(/^radio-/, '') || n;
    else if (n === 'headbutt-tree-common') axes.headbutt = 'common';
    else if (n === 'headbutt-tree-rare') axes.headbutt = 'rare';
  }
  return axes;
}

/** STATIC first; swarm/radio before SURF/FISH so fishing swarms stay OTHER. */
export function bucket(method, names = []) {
  const a = exclusiveAxes(names);
  if (STATIC.has(method)) return 'STATIC';
  if (a.swarm === 'yes' || a.radio) return 'OTHER';
  if (SURF.has(method)) return 'SURF';
  if (FISH.has(method)) return 'FISH';
  if (method.startsWith('headbutt') || a.headbutt) return 'OTHER';
  if (method === 'walk' || method.endsWith('-grass') || method.endsWith('-spots')) return 'WALK';
  return 'OTHER';
}

/** Same chip class as mapdata `methodChip` — swarm/radio/headbutt stay OTHER. */
export function methodChip(method, names = []) {
  const a = exclusiveAxes(names);
  if (STATIC.has(method)) return undefined;
  if (a.swarm === 'yes' || method === 'swarm') return 'swarm';
  if (a.radio) return 'radio';
  if (method.startsWith('headbutt') || a.headbutt) return 'headbutt';
  return undefined;
}

export function isSwarmRow(row) {
  return row?.chip === 'swarm' || row?.methodChip === 'swarm';
}

/** Häufigster Fang: wild only, same swarm skip as spawnLeaders. */
export function pickTopWild(rows) {
  return [...(rows ?? [])]
    .filter((r) => !r.isStatic && !isSwarmRow(r))
    .sort((a, b) => b.chance - a.chance)[0];
}
