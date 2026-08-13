/* Official EN/DE display names for catalogued formes (Mega/Alola/Galar/Hisui/Paldea/Gmax).
 * Slugs stay English. Names come from PokéAPI pokemon-form + hyphenated DE regional
 * style (Alola-Rattfratz). Paldea gaps that PokéAPI still lacks are PokéWiki terms. */
import type { DexFormKind } from './types';
import namesJson from '@/data/i18n/form-names.json';

export interface FormNameRecord {
  de: string;
  en: string;
}

const NAMES = namesJson as Record<string, FormNameRecord>;

/** PokéWiki / in-game Paldea names — PokéAPI has no `language=de` row for these. */
export const PALDEA_DE_FALLBACK: Readonly<Record<string, string>> = {
  'wooper-paldea': 'Paldea-Felino',
  'tauros-paldea-combat-breed': 'Paldea-Tauros (Gefechtvariante)',
  'tauros-paldea-blaze-breed': 'Paldea-Tauros (Flammenvariante)',
  'tauros-paldea-aqua-breed': 'Paldea-Tauros (Flutenvariante)',
};

export function hyphenateRegionalDe(name: string): string {
  return name.replace(/^(Alola|Galar|Hisui|Paldea) /, '$1-');
}

export function officialFormNames(input: {
  slug: string;
  kind: DexFormKind;
  apiDe: string | null;
  apiEn: string | null;
  baseDe: string;
}): FormNameRecord {
  const en = input.apiEn?.trim() || input.slug;
  if (input.apiDe?.trim()) {
    return { de: hyphenateRegionalDe(input.apiDe.trim()), en };
  }
  const paldea = PALDEA_DE_FALLBACK[input.slug];
  if (paldea) return { de: paldea, en };
  const prefix: Record<DexFormKind, string> = {
    alola: 'Alola',
    galar: 'Galar',
    hisui: 'Hisui',
    paldea: 'Paldea',
    mega: 'Mega',
    gmax: 'Gigadynamax',
  };
  return { de: `${prefix[input.kind]}-${input.baseDe}`, en };
}

export function formNameOf(slug: string, lang: 'en' | 'de'): string | null {
  const row = NAMES[slug];
  if (!row) return null;
  return lang === 'de' ? row.de : row.en;
}

export function formNamesArtifact(): Record<string, FormNameRecord> {
  return NAMES;
}
