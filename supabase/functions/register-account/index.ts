import { createClient } from 'npm:@supabase/supabase-js@2';
import {
  EMAIL_RE,
  USERNAME_RE,
  clientIp,
  corsHeaders,
  isReservedAuthEmail,
  json,
  rateLimited,
} from '../_shared/http.ts';

const PASSWORD_MIN = 8;
const PASSWORD_MAX = 128;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'invalid_input' }, 400);

  const ip = clientIp(req);
  if (rateLimited(`reg:${ip}`)) return json({ error: 'rate_limited' }, 429);

  let body: { username?: string; email?: string; password?: string; redirectTo?: string };
  try {
    body = await req.json();
  } catch {
    return json({ error: 'invalid_input' }, 400);
  }

  const username = (body.username ?? '').trim().toLowerCase();
  const email = (body.email ?? '').trim().toLowerCase();
  const password = body.password ?? '';
  const redirectTo = body.redirectTo;

  if (!USERNAME_RE.test(username) || !EMAIL_RE.test(email) || isReservedAuthEmail(email)) {
    return json({ error: 'invalid_input' }, 400);
  }
  if (password.length < PASSWORD_MIN || password.length > PASSWORD_MAX) {
    return json({ error: 'invalid_input' }, 400);
  }

  const url = Deno.env.get('SUPABASE_URL') ?? '';
  const service = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  const anon = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
  const admin = createClient(url, service, { auth: { persistSession: false, autoRefreshToken: false } });

  const { data: taken } = await admin.from('profiles').select('id').eq('username', username).maybeSingle();
  if (taken) return json({ error: 'username_taken' }, 409);

  const { data: created, error: createErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: false,
    user_metadata: { username },
  });
  if (createErr || !created.user) {
    const m = (createErr?.message ?? '').toLowerCase();
    if (m.includes('already') || m.includes('registered') || m.includes('exists')) {
      return json({ error: 'email_taken' }, 409);
    }
    return json({ error: 'unknown' }, 500);
  }

  const { error: profileErr } = await admin.from('profiles').insert({
    id: created.user.id,
    username,
    email,
  });
  if (profileErr) {
    await admin.auth.admin.deleteUser(created.user.id);
    const m = profileErr.message.toLowerCase();
    if (m.includes('duplicate') || m.includes('unique')) return json({ error: 'username_taken' }, 409);
    return json({ error: 'unknown' }, 500);
  }

  /* Confirm mail via GoTrue (dashboard templates + project SMTP). No extra mail vendor. */
  const mailRes = await fetch(`${url}/auth/v1/resend`, {
    method: 'POST',
    headers: {
      apikey: anon,
      Authorization: `Bearer ${anon}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'signup',
      email,
      options: redirectTo ? { emailRedirectTo: redirectTo } : undefined,
    }),
  });
  if (!mailRes.ok) return json({ error: 'unknown' }, 500);

  return json({ ok: true });
});
