/* auth — account client (plan-accounts.md WP2). Username+password via
 * Supabase Auth pseudo-emails (no mailer): the user only ever sees a
 * username; internally we auth as {username}@users.mypokepanion. Recovery
 * uses a 6-digit PIN via the reset-with-pin edge function (rate-limited). */
import { useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from './supabase';

const PSEUDO_DOMAIN = 'users.mypokepanion.com';
export const USERNAME_RE = /^[a-z0-9_-]{3,20}$/i;
const pseudoEmail = (username: string) => `${username.toLowerCase()}@${PSEUDO_DOMAIN}`;

export interface Profile {
  id: string;
  username: string;
}

export type AuthErrorCode =
  | 'username_taken'
  | 'invalid_credentials'
  | 'rate_limited'
  | 'invalid_input'
  | 'unknown';

function mapError(err: { message?: string } | null): AuthErrorCode {
  const m = err?.message?.toLowerCase() ?? '';
  if (m.includes('already registered') || m.includes('duplicate')) return 'username_taken';
  if (m.includes('invalid login')) return 'invalid_credentials';
  return 'unknown';
}

export async function usernameAvailable(username: string): Promise<boolean> {
  const { data, error } = await supabase.rpc('username_available', { name: username });
  if (error) return true; /* don't block signup on a flaky check — server enforces uniqueness anyway */
  return Boolean(data);
}

export async function registerAccount(
  username: string,
  password: string,
  recoveryCode: string,
): Promise<{ error: AuthErrorCode | null }> {
  if (!USERNAME_RE.test(username) || password.length < 8 || !/^\d{6}$/.test(recoveryCode)) {
    return { error: 'invalid_input' };
  }
  /* registration goes through the register-account edge function: the
   * admin API creates the user auto-confirmed (no confirmation mail — the
   * pseudo-addresses are not real) and enforces username uniqueness. */
  const code = await invokeFunction('register-account', {
    username: username.toLowerCase(),
    password,
    recoveryCode,
  });
  if (code) return { error: code };
  /* user exists now → sign in directly */
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: pseudoEmail(username),
      password,
    });
    return { error: error ? mapError(error) : null };
  } catch {
    /* e.g. storage failures must never surface as an unhandled rejection —
       the account itself was created successfully at this point */
    return { error: 'unknown' };
  }
}

export async function loginAccount(
  username: string,
  password: string,
): Promise<{ error: AuthErrorCode | null }> {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: pseudoEmail(username),
      password,
    });
    return { error: error ? mapError(error) : null };
  } catch {
    return { error: 'unknown' };
  }
}

/** invoke an edge function and map its { error } body — works for non-2xx
 * too (supabase-js surfaces those as FunctionsHttpError with the Response
 * attached; data is null in that case) */
async function invokeFunction(name: string, body: Record<string, unknown>): Promise<AuthErrorCode | null> {
  try {
    const { data, error } = await supabase.functions.invoke(name, { body });
    let payload = data as { error?: string } | null;
    if (!payload && error && typeof (error as { context?: unknown }).context === 'object') {
      try {
        const ctx = (error as { context: Response }).context;
        payload = (await ctx.json()) as { error?: string };
      } catch {
        /* body unreadable → generic below */
      }
    }
    const code = payload?.error;
    if (code === 'rate_limited') return 'rate_limited';
    if (code === 'invalid_credentials') return 'invalid_credentials';
    if (code === 'username_taken') return 'username_taken';
    if (code === 'invalid_input') return 'invalid_input';
    if (code) return 'unknown';
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

export async function logoutAccount(): Promise<void> {
  await supabase.auth.signOut();
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
function isRealUser(user: User | null): User | null {
  if (!user) return null;
  return (user as User & { is_anonymous?: boolean }).is_anonymous ? null : user;
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
}

let listeners: Array<(s: AuthState) => void> = [];
let state: AuthState = { ready: false, user: null, profile: null };
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
  supabase.auth.onAuthStateChange((_event, session: Session | null) => {
    void refreshProfile(session?.user ?? null);
  });
}

/** Non-react subscription for sync engines. */
export function onAuthChange(cb: (user: User | null) => void): () => void {
  boot();
  const fn = (s: AuthState) => cb(s.user);
  listeners.push(fn);
  return () => {
    listeners = listeners.filter((l) => l !== fn);
  };
}

export function getAuthUser(): User | null {
  return state.user;
}

/** Reactive auth state: { ready, user, profile }. */
export function useAuth(): AuthState {
  const [s, setS] = useState(state);
  useEffect(() => {
    boot();
    const fn = (next: AuthState) => setS(next);
    listeners.push(fn);
    return () => {
      listeners = listeners.filter((l) => l !== fn);
    };
  }, []);
  return s;
}
