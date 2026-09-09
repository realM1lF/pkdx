import { createClient } from 'npm:@supabase/supabase-js@2';
import { USERNAME_RE, clientIp, corsHeaders, json, rateLimited } from '../_shared/http.ts';

const PASSWORD_MIN = 8;
const PASSWORD_MAX = 128;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'invalid_input' }, 400);

  let body: { username?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return json({ error: 'invalid_input' }, 400);
  }

  const username = (body.username ?? '').trim();
  const password = body.password ?? '';
  const ip = clientIp(req);
  if (rateLimited(`login:${ip}:${username.toLowerCase()}`)) return json({ error: 'rate_limited' }, 429);
  if (!USERNAME_RE.test(username) || password.length < PASSWORD_MIN || password.length > PASSWORD_MAX) {
    return json({ error: 'invalid_credentials' }, 401);
  }

  const url = Deno.env.get('SUPABASE_URL') ?? '';
  const service = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  const anon = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
  const admin = createClient(url, service, { auth: { persistSession: false, autoRefreshToken: false } });

  const { data: profile } = await admin.from('profiles').select('id').eq('username', username.toLowerCase()).maybeSingle();
  if (!profile?.id) return json({ error: 'invalid_credentials' }, 401);

  const { data: authUser, error: getErr } = await admin.auth.admin.getUserById(profile.id);
  const email = authUser.user?.email;
  if (getErr || !email) return json({ error: 'invalid_credentials' }, 401);

  const tokenRes = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      apikey: anon,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  if (!tokenRes.ok) return json({ error: 'invalid_credentials' }, 401);
  const tokens = (await tokenRes.json()) as { access_token?: string; refresh_token?: string };
  if (!tokens.access_token || !tokens.refresh_token) return json({ error: 'invalid_credentials' }, 401);

  return json({ access_token: tokens.access_token, refresh_token: tokens.refresh_token });
});
