/** Shared name resolution for GPT-Live team-builder tools (English slugs internally). */
import movesDeJson from '@/data/i18n/de/moves.json';
import itemsDeJson from '@/data/i18n/de/items.json';
import { genAbilitiesOf, genFor } from '@/lib/gen-dex';
import { displayName } from '@/lib/pokeapi';
import { genItems, genNatures } from '@/lib/teambuilder';

const MOVES_DE = movesDeJson as Record<string, string>;
const ITEMS_DE = itemsDeJson as Record<string, string>;

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

export function resolveMoveQuery(query: string): string | null {
  const raw = query.trim();
  if (!raw) return null;

  const slugged = slugify(raw);
  if (Object.prototype.hasOwnProperty.call(MOVES_DE, slugged)) return slugged;

  const folded = fold(raw);
  for (const [slug, deName] of Object.entries(MOVES_DE)) {
    if (fold(deName) === folded) return slug;
  }
  for (const slug of Object.keys(MOVES_DE)) {
    if (fold(displayName(slug)) === folded || fold(slug) === folded) return slug;
  }
  return null;
}

export function resolveItemQuery(query: string, vgId: string): string | null {
  const raw = query.trim();
  if (!raw) return null;
  const folded = fold(raw);
  const slugged = slugify(raw);

  for (const id of genItems(vgId)) {
    if (id === slugged || fold(id) === folded || fold(displayName(id)) === folded) return id;
  }
  for (const [slug, deName] of Object.entries(ITEMS_DE)) {
    if (fold(deName) === folded || slug === slugged) {
      if (genFor(vgId).items.get(slug)?.exists) return slug;
    }
  }
  return null;
}

export function resolveAbilityQuery(query: string, vgId: string, speciesSlug: string): string | null {
  const raw = query.trim();
  if (!raw) return null;
  const folded = fold(raw);
  const slugged = slugify(raw);
  for (const ability of genAbilitiesOf(vgId, speciesSlug)) {
    const slug = slugify(ability);
    if (slug === slugged || fold(ability) === folded) return ability;
  }
  return null;
}

export function resolveNatureQuery(query: string, vgId: string): string | null {
  const raw = query.trim();
  if (!raw) return null;
  const folded = fold(raw);
  const slugged = slugify(raw);
  for (const nature of genNatures(vgId)) {
    const id = String(nature.name);
    if (id === slugged || fold(id) === folded || fold(displayName(id)) === folded) return id;
  }
  return null;
}
