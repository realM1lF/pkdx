/* Nuzlocke drag & drop payload channel.
 * HTML5 DnD does not allow reading dataTransfer data during dragover,
 * so the active drag payload is mirrored here (module-level, per-tab). */
export interface EncDrag {
  id: string;
  playerId: string;
  from: 'party' | 'box';
}

export const ENC_DND_MIME = 'application/x-pdx-enc';

let current: EncDrag | null = null;

export const encDnd = {
  start(d: EncDrag) {
    current = d;
  },
  end() {
    current = null;
  },
  peek(): EncDrag | null {
    return current;
  },
};
