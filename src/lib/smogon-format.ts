import { versionGroupById } from './version-groups';

const SETS_ORIGIN = 'https://data.pkmn.cc/sets';

/** Last-resort OU dump when a generation-specific file is missing. */
export const SMOGON_OU_FALLBACK = 'gen9ou';

/** Version groups whose Smogon OU id is not simply `gen{N}ou`. */
const VG_FORMAT: Record<string, string> = {
  'lets-go-pikachu-eevee': 'gen7letsgoou',
  'brilliant-diamond-shining-pearl': 'gen8bdspou',
};

/** Optional extra formats (never replace OU). Latest VGC dump on data.pkmn.cc. */
const VG_EXTRA: Record<string, string[]> = {
  'scarlet-violet': ['gen9vgc2025'],
};

function genOu(gen: number): string {
  if (gen < 1 || gen > 9) return SMOGON_OU_FALLBACK;
  return `gen${gen}ou`;
}

export function smogonFormatForVersionGroup(vgId: string): string {
  const specific = VG_FORMAT[vgId];
  if (specific) return specific;
  return genOu(versionGroupById(vgId).gen);
}

export function smogonFormatChain(vgId: string): string[] {
  const preferred = smogonFormatForVersionGroup(vgId);
  const fallbackGenOu = genOu(versionGroupById(vgId).gen);
  const chain: string[] = [preferred];
  if (fallbackGenOu !== preferred) chain.push(fallbackGenOu);
  if (fallbackGenOu !== SMOGON_OU_FALLBACK && preferred !== SMOGON_OU_FALLBACK) {
    chain.push(SMOGON_OU_FALLBACK);
  }
  return chain;
}

export function smogonExtraFormats(vgId: string): string[] {
  return VG_EXTRA[vgId] ?? [];
}

export function smogonSetsUrl(format: string): string {
  return `${SETS_ORIGIN}/${format}.json`;
}

export function smogonCacheKey(format: string): string {
  return `meta-${format}`;
}

const REST_LABEL: Record<string, string> = {
  ou: 'OU',
  letsgoou: "Let's Go OU",
  bdspou: 'BDSP OU',
  vgc2023: 'VGC 2023',
  vgc2024: 'VGC 2024',
  vgc2025: 'VGC 2025',
};

/** Display label for a Showdown format id (`gen4ou` → `Gen 4 OU`). */
export function smogonFormatLabel(format: string): string {
  const m = /^gen(\d+)(.*)$/.exec(format);
  if (!m) return format;
  const rest = REST_LABEL[m[2]] ?? m[2].toUpperCase();
  return `Gen ${m[1]} ${rest}`.trim();
}
