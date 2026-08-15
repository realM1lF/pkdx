import { isAboveFoldDexItem } from './img-priority';

export type DexItemKind = 'card' | 'row';

export type DexItemMotion = {
  layout: false;
  initial: false | { opacity: number; y: number; filter?: string };
};

export function dexItemUsesMotion(index: number): boolean {
  return !isAboveFoldDexItem(index);
}

/** Above-the-fold dex items must not replay motion on hydration (CLS). */
export function dexItemMotion(index: number, kind: DexItemKind = 'card'): DexItemMotion {
  if (isAboveFoldDexItem(index)) {
    return { layout: false, initial: false };
  }
  if (kind === 'row') {
    return { layout: false, initial: { opacity: 0, y: 8 } };
  }
  return { layout: false, initial: { opacity: 0, y: 16, filter: 'blur(6px)' } };
}

export function dexChromeInitial(): false {
  return false;
}

export function dexPresenceMode(): 'sync' {
  return 'sync';
}
