/* TM / HM / TR numbers per version group.
 * Source: PokéAPI machines.csv keyed by official version_group id
 * (12=colosseum, 13=xd, 14=black-2-white-2, 15=x-y — not sequential with
 * the national games). HMs after Gen 6 are dropped except BDSP. */
import catalog from '@/data/machines-by-vg.json';

export type MachineKind = 'tm' | 'hm' | 'tr';

export interface MachineInfo {
  kind: MachineKind;
  num: number;
}

type Catalog = Record<string, Record<string, string>>;

const MACHINES = catalog as Catalog;

function parseToken(token: string | undefined): MachineInfo | null {
  if (!token) return null;
  const m = /^(tm|hm|tr)(\d+)$/i.exec(token);
  if (!m) return null;
  return { kind: m[1].toLowerCase() as MachineKind, num: parseInt(m[2], 10) };
}

export function machineOf(vgId: string, moveSlug: string): MachineInfo | null {
  return parseToken(MACHINES[vgId]?.[moveSlug]);
}

export function machineLabel(info: MachineInfo, lang: string, vgId?: string): string {
  const prefix = info.kind === 'hm' && lang === 'de' ? 'VM' : info.kind.toUpperCase();
  const width = vgId === 'scarlet-violet' || info.num >= 100 ? 3 : 2;
  return `${prefix}${String(info.num).padStart(width, '0')}`;
}
