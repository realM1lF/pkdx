export const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export const PSEUDO_DOMAIN = 'users.mypokepanion.com';
export const USERNAME_RE = /^[a-z0-9_-]{3,20}$/i;
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isReservedAuthEmail(email: string): boolean {
  return email.toLowerCase().endsWith(`@${PSEUDO_DOMAIN}`);
}

export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

const hits = new Map<string, number[]>();

/** Best-effort per-isolate window. Not a substitute for WAF, but blocks bursts. */
export function rateLimited(key: string, max = 8, windowMs = 60 * 60 * 1000): boolean {
  const now = Date.now();
  const prev = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (prev.length >= max) {
    hits.set(key, prev);
    return true;
  }
  prev.push(now);
  hits.set(key, prev);
  return false;
}

export function clientIp(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
}
