/** Local-only GPT-Live voice demo gate.
 *
 * Production builds never expose the route: Vite replaces `import.meta.env.DEV`
 * with `false`, so the page and session client stay out of the Netlify bundle.
 * A paywall can wrap `canUseGptLive()` later without changing the route table. */
export function isGptLiveDemoEnabled(): boolean {
  return import.meta.env.DEV && import.meta.env.VITE_GPT_LIVE_DEMO === 'true';
}

/** Access check the page and nav share. Billing can AND this later. */
export function canUseGptLive(): boolean {
  return isGptLiveDemoEnabled();
}

export const GPT_LIVE_PATH = '/voice-demo';
