/**
 * Domain contract — GPT-Live item_locations wrapper.
 *
 * Page call chain (Maps item drawer — binding):
 *   Reverse index over items-{region}.json + enrichment union via mapdata.itemsForNode
 *   (canonicalItemSlug dedupe). No guessing without the built index.
 *
 * Uses resolveGame for edition context on notes; item lookup is index-only.
 *
 * Must-not: PokéAPI item guesses, Team/Nuzlocke/TCG/Orre inventories.
 *
 * Test map: item-locations.test.ts, mapdata item tests, spoken-eval.test.ts.
 */
import itemsDeJson from '@/data/i18n/de/items.json';
import { canonicalItemSlug, displayNameOfItem, itemsForNode, type CuratedItem } from '@/lib/mapdata';
import { nameOfItem } from '@/lib/i18n-data';
import { REGIONS, nodeName, type MapNode, type RegionId } from '@/lib/regions';
import type { GptLiveSessionContext } from './session-context';
import { resolveGame, type GameHit } from './species-stats';

export const ITEM_LOCATIONS = 'item_locations';

export const ITEM_LOCATIONS_TOOL = {
  type: 'function' as const,
  name: ITEM_LOCATIONS,
  description:
    'Find map locations where an item can be picked up (curated items index). Use for where-is-this-item questions.',
  strict: true as const,
  parameters: {
    type: 'object' as const,
    properties: {
      item_query: {
        type: 'string',
        description: 'Item as spoken, e.g. Trank, Potion, TM29, Hyperball.',
      },
      game: {
        type: ['string', 'null'],
        description:
          'Optional edition for localized notes, e.g. firered. Null when the session already has a game.',
      },
    },
    required: ['item_query', 'game'],
    additionalProperties: false as const,
  },
};

export interface ItemLocationRow {
  regionId: RegionId;
  nodeId: string;
  label: string;
  itemSlug: string;
  displayName: string;
  note: string;
  pocket: string;
  hidden: boolean;
}

interface IndexedItem {
  canonical: string;
  item: CuratedItem;
  regionId: RegionId;
  node: MapNode;
}

function fold(raw: string): string {
  return raw
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/ß/g, 'ss')
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function slugify(raw: string): string {
  return fold(raw).replace(/\s+/g, '-');
}

function buildItemIndex(): Map<string, IndexedItem[]> {
  const index = new Map<string, IndexedItem[]>();
  const addKey = (key: string, row: IndexedItem) => {
    const k = fold(key);
    if (!k) return;
    const list = index.get(k) ?? [];
    if (!list.some((r) => r.regionId === row.regionId && r.node.id === row.node.id && r.canonical === row.canonical)) {
      list.push(row);
      index.set(k, list);
    }
  };

  for (const region of REGIONS) {
    for (const node of region.nodes) {
      for (const item of itemsForNode(region.region, node.id)) {
        const canonical = canonicalItemSlug(item.itemSlug, item.name);
        const row: IndexedItem = { canonical, item, regionId: region.region, node };
        addKey(canonical, row);
        addKey(item.itemSlug, row);
        addKey(item.name, row);
        addKey(nameOfItem(item.itemSlug, 'en'), row);
        addKey(ITEMS_DE[item.itemSlug] ?? nameOfItem(item.itemSlug, 'de'), row);
        addKey(displayNameOfItem(item, 'en'), row);
        addKey(displayNameOfItem(item, 'de'), row);
      }
    }
  }
  return index;
}

const ITEMS_DE = itemsDeJson as Record<string, string>;

const ITEM_INDEX = buildItemIndex();

export type ItemLocationsOk = {
  ok: true;
  itemSlug: string;
  displayName: string;
  game: GameHit | null;
  locations: ItemLocationRow[];
  spoken_hint: string;
};

export type ItemLocationsErr = {
  ok: false;
  error: 'unknown_item' | 'unknown_game' | 'invalid_arguments';
  message: string;
  game?: GameHit;
};

export type ItemLocationsResult = ItemLocationsOk | ItemLocationsErr;

function stringArg(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function resolveItemQuery(query: string): IndexedItem[] | null {
  const raw = query.trim();
  if (!raw) return null;
  const folded = fold(raw);
  const slugged = slugify(raw);
  return (
    ITEM_INDEX.get(folded) ??
    ITEM_INDEX.get(slugged) ??
    ITEM_INDEX.get(fold(slugged)) ??
    null
  );
}

function noteText(item: CuratedItem, lang: 'de' | 'en'): string {
  if (typeof item.note === 'string') return item.note;
  return (lang === 'de' && item.note.de) || item.note.en || '';
}

function spokenHint(input: { displayName: string; locations: ItemLocationRow[] }): string {
  if (input.locations.length === 0) return `${input.displayName}: no curated map locations.`;
  const top = input.locations.slice(0, 3).map((l) => l.label).join(', ');
  const more = input.locations.length > 3 ? ` (+${input.locations.length - 3} more)` : '';
  return `${input.displayName}: ${input.locations.length} location(s) — ${top}${more}.`;
}

export function itemLocationsPair(itemQuery: string, gameQuery: string): ItemLocationsResult {
  const hits = resolveItemQuery(itemQuery);
  if (!hits?.length) {
    return {
      ok: false,
      error: 'unknown_item',
      message: `No curated item matched "${itemQuery.trim()}". The index covers map pickup items only.`,
    };
  }

  let game: GameHit | null = null;
  if (gameQuery.trim()) {
    game = resolveGame(gameQuery);
    if (!game) {
      return {
        ok: false,
        error: 'unknown_game',
        message: `No game matched "${gameQuery.trim()}". Try firered, red, or another edition.`,
      };
    }
  }

  const lang: 'de' | 'en' = /[äöüß]/i.test(itemQuery) ? 'de' : 'en';
  const canonical = hits[0]!.canonical;
  const displayName = displayNameOfItem(hits[0]!.item, lang);
  const seen = new Set<string>();
  const locations: ItemLocationRow[] = [];
  for (const hit of hits) {
    if (hit.canonical !== canonical) continue;
    const key = `${hit.regionId}:${hit.node.id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    locations.push({
      regionId: hit.regionId,
      nodeId: hit.node.id,
      label: nodeName(hit.node, lang),
      itemSlug: hit.item.itemSlug,
      displayName: displayNameOfItem(hit.item, lang),
      note: noteText(hit.item, lang),
      pocket: hit.item.pocket,
      hidden: Boolean(hit.item.hidden),
    });
  }

  locations.sort((a, b) => a.label.localeCompare(b.label));

  return {
    ok: true,
    itemSlug: canonical,
    displayName,
    game,
    locations,
    spoken_hint: spokenHint({ displayName, locations }),
  };
}

export function itemLocationsFromArgs(
  args: unknown,
  ctx: Pick<GptLiveSessionContext, 'gameQuery'> = {},
): ItemLocationsResult {
  if (!args || typeof args !== 'object') {
    return { ok: false, error: 'invalid_arguments', message: 'Expected an object with item_query and game.' };
  }
  const rec = args as Record<string, unknown>;
  const itemQuery = stringArg(rec.item_query);
  const gameQuery = stringArg(rec.game) || ctx.gameQuery || '';
  if (!itemQuery.trim()) {
    return { ok: false, error: 'invalid_arguments', message: 'item_query is required.' };
  }
  return itemLocationsPair(itemQuery, gameQuery);
}

/** Test hook — index size guard. */
export function itemIndexEntryCount(): number {
  let n = 0;
  for (const rows of ITEM_INDEX.values()) n += rows.length;
  return n;
}
