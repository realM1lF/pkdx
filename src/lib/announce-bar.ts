/* Dismissible site notice — localStorage + html[data-announce] (no cookie).
 * public/announce-init.js mirrors the key so dismissed visitors get no CLS. */

export const ANNOUNCE_EMAIL_LOGIN_KEY = 'pdx2.announce.email-login';
export const ANNOUNCE_DISMISSED = 'off';
export const ANNOUNCE_ITEM_KEYS = ['emailLogin', 'kalos', 'discord', 'ux'] as const;

export function isAnnounceDismissed(key = ANNOUNCE_EMAIL_LOGIN_KEY): boolean {
  try {
    return localStorage.getItem(key) === ANNOUNCE_DISMISSED;
  } catch {
    return false;
  }
}

export function persistAnnounceDismissed(key = ANNOUNCE_EMAIL_LOGIN_KEY): boolean {
  try {
    localStorage.setItem(key, ANNOUNCE_DISMISSED);
    return true;
  } catch {
    return false;
  }
}

export function applyAnnounceDismissed(): void {
  persistAnnounceDismissed();
  try {
    document.documentElement.dataset.announce = ANNOUNCE_DISMISSED;
  } catch {
    /* prerender / no document */
  }
}
