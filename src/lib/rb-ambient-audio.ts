/* Ambient Pokémon Red/Blue Route 1 music — off by default, volume in localStorage. */

export const AMBIENT_ENABLED_KEY = 'pdx2.ambient.enabled';
export const AMBIENT_VOLUME_KEY = 'pdx2.ambient.volume';
export const AMBIENT_CHANGE_EVENT = 'pdx2:ambientchange';

/** Self-hosted loop rendered from pret/pokered MUSIC_ROUTES1 (see scripts/render-rb-routes1.sh). */
export const RB_ROUTES1_SRC = '/audio/rb-routes1.ogg';

export const AMBIENT_VOLUME_DEFAULT = 0.35;
export const AMBIENT_VOLUME_MIN = 0;
export const AMBIENT_VOLUME_MAX = 1;

export function readAmbientEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(AMBIENT_ENABLED_KEY) === '1';
  } catch {
    return false;
  }
}

export function readAmbientVolume(): number {
  if (typeof window === 'undefined') return AMBIENT_VOLUME_DEFAULT;
  try {
    const raw = localStorage.getItem(AMBIENT_VOLUME_KEY);
    if (raw == null) return AMBIENT_VOLUME_DEFAULT;
    const n = Number(raw);
    if (!Number.isFinite(n)) return AMBIENT_VOLUME_DEFAULT;
    return Math.min(AMBIENT_VOLUME_MAX, Math.max(AMBIENT_VOLUME_MIN, n));
  } catch {
    return AMBIENT_VOLUME_DEFAULT;
  }
}

export function persistAmbientEnabled(on: boolean): void {
  try {
    localStorage.setItem(AMBIENT_ENABLED_KEY, on ? '1' : '0');
  } catch {
    /* private mode */
  }
}

export function persistAmbientVolume(volume: number): void {
  try {
    const v = Math.min(AMBIENT_VOLUME_MAX, Math.max(AMBIENT_VOLUME_MIN, volume));
    localStorage.setItem(AMBIENT_VOLUME_KEY, String(v));
  } catch {
    /* private mode */
  }
}

export function dispatchAmbientChange(): void {
  window.dispatchEvent(new CustomEvent(AMBIENT_CHANGE_EVENT));
}

export function setAmbientEnabled(on: boolean): void {
  persistAmbientEnabled(on);
  dispatchAmbientChange();
}

export function setAmbientVolume(volume: number): void {
  persistAmbientVolume(volume);
  dispatchAmbientChange();
}
