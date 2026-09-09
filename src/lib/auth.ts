/* auth — username or email + password via Supabase Auth.
 * Legacy accounts still live at {username}@users.mypokepanion.com and
 * recover with the 6-digit PIN. New accounts use a real email, confirm
 * it, and recover by mail. Anonymous sessions stay out of the account UI. */
import { useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from './supabase';

export const PSEUDO_DOMAIN = 'users.mypokepanion.com';
export const USERNAME_RE = /^[a-z0-9_-]{3,20}$/i;
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN = 8;
const PASSWORD_MAX = 128;

export const pseudoEmail = (username: string) => `${username.toLowerCase()}@${PSEUDO_DOMAIN}`;

export function isReservedAuthEmail(email: string): boolean {
  return email.toLowerCase().endsWith(`@${PSEUDO_DOMAIN}`);
}

export function isLegacyAuthEmail(email: string | null | undefined): boolean {
  return Boolean(email && isReservedAuthEmail(email));
}

export type LoginKind = 'email' | 'username';
export type LoginIdentifier = { ok: true; kind: LoginKind; value: string } | { ok: false };

export function parseLoginIdentifier(raw: string): LoginIdentifier {
  const v = raw.trim();
  if (!v) return { ok: false };
  if (v.includes('@')) {
    const email = v.toLowerCase();
    if (!EMAIL_RE.test(email) || isReservedAuthEmail(email)) return { ok: false };
    return { ok: true, kind: 'email', value: email };
  }
  if (!USERNAME_RE.test(v)) return { ok: false };
  return { ok: true, kind: 'username', value: v };
}

export function validateRegisterInput(
  username: string,
  email: string,
  password: string,
): AuthErrorCode | null {
  if (!USERNAME_RE.test(username)) return 'invalid_input';
  if (!EMAIL_RE.test(email) || isReservedAuthEmail(email)) return 'invalid_input';
  if (password.length < PASSWORD_MIN || password.length > PASSWORD_MAX) return 'invalid_input';
  return null;
}

export interface Profile {
  id: string;
  username: string;
  email?: string | null;
}

export type AuthErrorCode =
  | 'username_taken'
  | 'email_taken'
  | 'invalid_credentials'
  | 'rate_limited'
  | 'invalid_input'
  | 'email_unconfirmed'
  | 'unknown';

function mapError(err: { message?: string } | null): AuthErrorCode {
  const m = err?.message?.toLowerCase() ?? '';
  if (m.includes('already registered') || m.includes('duplicate')) return 'username_taken';
  if (m.includes('invalid login')) return 'invalid_credentials';
  if (m.includes('not confirmed') || m.includes('email not confirmed')) return 'email_unconfirmed';
  return 'unknown';
}

function mapFunctionCode(code: string | undefined): AuthErrorCode | null {
  if (code === 'rate_limited') return 'rate_limited';
  if (code === 'invalid_credentials') return 'invalid_credentials';
  if (code === 'username_taken') return 'username_taken';
  if (code === 'email_taken') return 'email_taken';
  if (code === 'invalid_input') return 'invalid_input';
  if (code === 'email_unconfirmed') return 'email_unconfirmed';
  if (code) return 'unknown';
  return null;
}

export async function usernameAvailable(username: string): Promise<boolean> {
  const { data, error } = await supabase.rpc('username_available', { name: username });
  if (error) return true;
  return Boolean(data);
}

export async function registerAccount(
  username: string,
  email: string,
  password: string,
  redirectTo?: string,
): Promise<{ error: AuthErrorCode | null; pendingConfirm?: boolean }> {
  const invalid = validateRegisterInput(username, email.trim().toLowerCase(), password);
  if (invalid) return { error: invalid };
  const payload: Record<string, unknown> = {
    username: username.toLowerCase(),
    email: email.trim().toLowerCase(),
    password,
  };
  if (redirectTo) payload.redirectTo = redirectTo;
  const code = await invokeFunction('register-account', payload);
  if (code) return { error: code };
  /* confirm mail first — never sign in on an unconfirmed user */
  return { error: null, pendingConfirm: true };
}

export async function loginAccount(
  identifier: string,
  password: string,
): Promise<{ error: AuthErrorCode | null }> {
  const parsed = parseLoginIdentifier(identifier);
  if (!parsed.ok || password.length < PASSWORD_MIN || password.length > PASSWORD_MAX) {
    return { error: 'invalid_input' };
  }
  try {
    if (parsed.kind === 'email') {
      const { error } = await supabase.auth.signInWithPassword({
        email: parsed.value,
        password,
      });
      return { error: error ? mapError(error) : null };
    }
    const { error } = await supabase.auth.signInWithPassword({
      email: pseudoEmail(parsed.value),
      password,
    });
    if (!error) return { error: null };
    if (mapError(error) !== 'invalid_credentials') return { error: mapError(error) };
    return loginWithUsername(parsed.value, password);
  } catch {
    return { error: 'unknown' };
  }
}

async function loginWithUsername(
  username: string,
  password: string,
): Promise<{ error: AuthErrorCode | null }> {
  try {
    const { data, error } = await supabase.functions.invoke('login-with-username', {
      body: { username, password },
    });
    const payload = await readFunctionPayload(data, error);
    const mapped = mapFunctionCode(payload?.error);
    if (mapped) return { error: mapped };
    const access = payload?.access_token;
    const refresh = payload?.refresh_token;
    if (access && refresh) {
      const { error: setErr } = await supabase.auth.setSession({
        access_token: access,
        refresh_token: refresh,
      });
      return { error: setErr ? 'unknown' : null };
    }
    return { error: error ? 'unknown' : 'invalid_credentials' };
  } catch {
    return { error: 'unknown' };
  }
}

interface FunctionPayload {
  error?: string;
  access_token?: string;
  refresh_token?: string;
  ok?: boolean;
}

async function readFunctionPayload(
  data: unknown,
  error: { context?: unknown } | null,
): Promise<FunctionPayload | null> {
  let payload = data as FunctionPayload | null;
  if (!payload && error && typeof error.context === 'object') {
    try {
      payload = (await (error.context as Response).json()) as FunctionPayload;
    } catch {
      payload = null;
    }
  }
  return payload;
}

/** invoke an edge function and map its { error } body — works for non-2xx
 * too (supabase-js surfaces those as FunctionsHttpError with the Response
 * attached; data is null in that case) */
async function invokeFunction(name: string, body: Record<string, unknown>): Promise<AuthErrorCode | null> {
  try {
    const { data, error } = await supabase.functions.invoke(name, { body });
    const payload = await readFunctionPayload(data, error);
    const mapped = mapFunctionCode(payload?.error);
    if (mapped) return mapped;
    return error && !payload ? 'unknown' : null;
  } catch {
    return 'unknown';
  }
}

export async function resetPasswordWithPin(
  username: string,
  pin: string,
  newPassword: string,
): Promise<{ error: AuthErrorCode | null }> {
  const code = await invokeFunction('reset-with-pin', { username, pin, newPassword });
  return { error: code };
}

export async function resetPasswordWithEmail(
  email: string,
  redirectTo?: string,
): Promise<{ error: AuthErrorCode | null }> {
  const parsed = parseLoginIdentifier(email);
  if (!parsed.ok || parsed.kind !== 'email') return { error: 'invalid_input' };
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(parsed.value, {
      redirectTo,
    });
    /* always ok to the client — do not leak whether the address exists */
    if (error && /rate/i.test(error.message)) return { error: 'rate_limited' };
    return { error: null };
  } catch {
    return { error: 'unknown' };
  }
}

export async function updateAccountPassword(newPassword: string): Promise<{ error: AuthErrorCode | null }> {
  if (newPassword.length < PASSWORD_MIN || newPassword.length > PASSWORD_MAX) {
    return { error: 'invalid_input' };
  }
  try {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    return { error: error ? mapError(error) : null };
  } catch {
    return { error: 'unknown' };
  }
}

export async function bindAccountEmail(
  email: string,
  redirectTo?: string,
): Promise<{ error: AuthErrorCode | null }> {
  const parsed = parseLoginIdentifier(email);
  if (!parsed.ok || parsed.kind !== 'email') return { error: 'invalid_input' };
  try {
    const { error } = await supabase.auth.updateUser(
      { email: parsed.value },
      { emailRedirectTo: redirectTo },
    );
    if (error) return { error: mapError(error) };
    const user = getAuthUser();
    if (user) {
      await supabase.from('profiles').update({ email: parsed.value }).eq('id', user.id);
    }
    return { error: null };
  } catch {
    return { error: 'unknown' };
  }
}

export async function updateAccountUsername(username: string): Promise<{ error: AuthErrorCode | null }> {
  if (!USERNAME_RE.test(username)) return { error: 'invalid_input' };
  const user = getAuthUser();
  if (!user) return { error: 'invalid_credentials' };
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ username: username.toLowerCase() })
      .eq('id', user.id);
    if (error) {
      const m = error.message.toLowerCase();
      if (m.includes('duplicate') || m.includes('unique')) return { error: 'username_taken' };
      return { error: 'unknown' };
    }
    await refreshProfile(user);
    return { error: null };
  } catch {
    return { error: 'unknown' };
  }
}

export interface AccountExport {
  exportedAt: string;
  username: string | null;
  teams: unknown[];
  runs: unknown[];
}

export async function exportAccountData(): Promise<{ data: AccountExport | null; error: AuthErrorCode | null }> {
  const user = getAuthUser();
  if (!user) return { data: null, error: 'invalid_credentials' };
  try {
    const [teams, members] = await Promise.all([
      supabase.from('teams').select('id, name, payload, updated_at').eq('user_id', user.id),
      supabase.from('nuz_run_members').select('run_id, role, archived').eq('user_id', user.id),
    ]);
    const runIds = (members.data ?? []).map((r) => r.run_id as string).filter(Boolean);
    let runs: unknown[] = [];
    if (runIds.length) {
      const { data } = await supabase.from('nuz_runs').select('id, name, game, region, status, created_at').in('id', runIds);
      runs = data ?? [];
    }
    return {
      data: {
        exportedAt: new Date().toISOString(),
        username: state.profile?.username ?? null,
        teams: teams.data ?? [],
        runs,
      },
      error: null,
    };
  } catch {
    return { data: null, error: 'unknown' };
  }
}

export async function deleteAccount(): Promise<{ error: AuthErrorCode | null }> {
  const code = await invokeFunction('delete-account', {});
  if (code) return { error: code };
  await supabase.auth.signOut();
  return { error: null };
}

export async function logoutAccount(everywhere = false): Promise<void> {
  await supabase.auth.signOut(everywhere ? { scope: 'global' } : undefined);
}

/* ---------- anonymous identity for multiplayer ----------
 * The hardened Nuzlocke policies scope every row to run membership, which
 * needs an auth.uid(). Guests have no account, so they get an anonymous
 * Supabase identity — created lazily, only when a multiplayer action really
 * happens, so ordinary visitors never produce an auth.users row.
 *
 * An anonymous session is deliberately NOT treated as "logged in" anywhere
 * else (see isRealUser below): the account UI, cloud-sync and the profile
 * lookup must keep behaving exactly as before.
 *
 * If anonymous sign-ins are disabled in the project, this resolves without
 * a session and callers fall back to their previous behaviour. */
let identityInFlight: Promise<void> | null = null;
/* Remembered per page load: once the provider has refused, stop asking.
 * Otherwise every multiplayer action would fire another failing request and
 * log a console error. */
let anonSignInUnavailable = false;

export function ensureRunIdentity(): Promise<void> {
  if (identityInFlight) return identityInFlight;
  identityInFlight = (async () => {
    try {
      const { data } = await supabase.auth.getSession();
      if (data.session || anonSignInUnavailable) return;
      const { error } = await supabase.auth.signInAnonymously();
      if (error) anonSignInUnavailable = true;
    } catch {
      /* offline or storage blocked — not fatal, callers degrade gracefully */
      anonSignInUnavailable = true;
    } finally {
      identityInFlight = null;
    }
  })();
  return identityInFlight;
}

/** Anonymous sessions exist only to satisfy RLS; they are not accounts. */
export function isRealUser(user: User | null): User | null {
  if (!user) return null;
  return (user as User & { is_anonymous?: boolean }).is_anonymous ? null : user;
}

export function isLegacyUser(user: User | null): boolean {
  return isLegacyAuthEmail(user?.email);
}

export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data } = await supabase.from('profiles').select('id, username').eq('id', userId).maybeSingle();
  return (data as Profile | null) ?? null;
}

/* ---------- session hook ---------- */
export interface AuthState {
  ready: boolean;
  user: User | null;
  profile: Profile | null;
  recovery: boolean;
}

let listeners: Array<(s: AuthState) => void> = [];
let state: AuthState = { ready: false, user: null, profile: null, recovery: false };
let booted = false;

function emit() {
  for (const fn of listeners) fn(state);
}

async function refreshProfile(rawUser: User | null) {
  /* anonymous multiplayer identities must never surface as an account */
  const user = isRealUser(rawUser);
  const profile = user ? await fetchProfile(user.id) : null;
  state = { ...state, user, profile, ready: true };
  emit();
}

function boot() {
  if (booted) return;
  booted = true;
  void supabase.auth.getSession().then(({ data }) => refreshProfile(data.session?.user ?? null));
  supabase.auth.onAuthStateChange((event, session: Session | null) => {
    if (event === 'PASSWORD_RECOVERY') {
      state = { ...state, recovery: true };
    }
    if (event === 'SIGNED_OUT') {
      state = { ...state, recovery: false };
    }
    void refreshProfile(session?.user ?? null);
  });
}

export function clearRecoveryFlag(): void {
  state = { ...state, recovery: false };
  emit();
}

/** Non-react subscription for sync engines. */
export function onAuthChange(cb: (user: User | null) => void): () => void {
  boot();
  const fn = (s: AuthState) => cb(s.user);
  listeners.push(fn);
  /* If session already resolved (late subscriber / HMR), don't wait for the
   * next auth event — otherwise bootCloudSync never adopts on a warm load. */
  if (state.ready) cb(state.user);
  return () => {
    listeners = listeners.filter((l) => l !== fn);
  };
}

export function getAuthUser(): User | null {
  return state.user;
}

/** False until the first getSession()/auth event has resolved. */
export function isAuthReady(): boolean {
  return state.ready;
}

/** Reactive auth state: { ready, user, profile, recovery }. */
export function useAuth(): AuthState {
  const [s, setS] = useState(state);
  useEffect(() => {
    boot();
    setS(state);
    const fn = (next: AuthState) => setS(next);
    listeners.push(fn);
    return () => {
      listeners = listeners.filter((l) => l !== fn);
    };
  }, []);
  return s;
}
