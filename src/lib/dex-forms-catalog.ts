/* Sync lookup over src/data/dex-forms.json — identity (species id, intro gen)
 * for Mega/Alola/Galar/Hisui/Paldea/Gmax rows. Sprite ids (10034…) are not
 * national-dex numbers and must not go through genOf(). */
import catalog from '@/data/dex-forms.json';
import { genOf, MAX_DEX_ID } from './types';
import type { DexFormKind, PokemonType } from './types';

export interface FormCatalogRecord {
  slug: string;
  speciesId: number;
  spriteId: number;
  types: PokemonType[];
  kind: DexFormKind;
  gen: number;
}

const FORMS = (catalog as { forms: FormCatalogRecord[] }).forms;
const BY_SLUG = new Map(FORMS.map((f) => [f.slug, f]));

export function formBySlug(slug: string): FormCatalogRecord | undefined {
  return BY_SLUG.get(slug);
}

export function formsForSpecies(speciesId: number): FormCatalogRecord[] {
  return FORMS.filter((f) => f.speciesId === speciesId);
}

export interface FormIdentity {
  slug: string;
  speciesId: number;
  spriteId: number;
  gen: number;
  isForm: boolean;
  kind?: DexFormKind;
}

export function formIdentity(slug: string, pokemonId: number): FormIdentity {
  const rec = BY_SLUG.get(slug);
  if (rec) {
    return {
      slug: rec.slug,
      speciesId: rec.speciesId,
      spriteId: rec.spriteId,
      gen: rec.gen,
      isForm: true,
      kind: rec.kind,
    };
  }
  return {
    slug,
    speciesId: pokemonId,
    spriteId: pokemonId,
    gen: genOf(pokemonId >= 1 && pokemonId <= MAX_DEX_ID ? pokemonId : 1).gen,
    isForm: false,
  };
}

/** Species keep numeric dex URLs; formes use the English slug. */
export function dexEntryPath(e: { id: number; name?: string; form?: DexFormKind }): string {
  if (e.name && (e.form || BY_SLUG.has(e.name))) return `/pokemon/${e.name}`;
  return `/pokemon/${e.id}`;
}
