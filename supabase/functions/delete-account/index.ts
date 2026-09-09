import { createClient } from 'npm:@supabase/supabase-js@2';
import { clientIp, corsHeaders, json, rateLimited } from '../_shared/http.ts';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'invalid_input' }, 400);

  const ip = clientIp(req);
  if (rateLimited(`del:${ip}`)) return json({ error: 'rate_limited' }, 429);

  const authHeader = req.headers.get('Authorization') ?? '';
  if (!authHeader.startsWith('Bearer ')) return json({ error: 'invalid_credentials' }, 401);

  const url = Deno.env.get('SUPABASE_URL') ?? '';
  const service = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  const anon = Deno.env.get('SUPABASE_ANON_KEY') ?? '';

  const asUser = createClient(url, anon, {
    global: { headers: { Authorization: authHeader } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: got, error: userErr } = await asUser.auth.getUser();
  const user = got.user;
  if (userErr || !user || user.is_anonymous) return json({ error: 'invalid_credentials' }, 401);

  const admin = createClient(url, service, { auth: { persistSession: false, autoRefreshToken: false } });

  await admin.from('teams').delete().eq('user_id', user.id);
  await admin.from('nuz_solo_runs').delete().eq('user_id', user.id);
  await admin.from('orre_shadow_progress').delete().eq('user_id', user.id);
  await admin.from('profiles').delete().eq('id', user.id);

  const { error: delErr } = await admin.auth.admin.deleteUser(user.id);
  if (delErr) return json({ error: 'unknown' }, 500);
  return json({ ok: true });
});
