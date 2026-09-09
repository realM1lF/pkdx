import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { User } from '@supabase/supabase-js';
import de from '@/i18n/locales/de/translation.json';
import en from '@/i18n/locales/en/translation.json';

const signInWithPassword = vi.fn();
const setSession = vi.fn();
const invoke = vi.fn();
const resetPasswordForEmail = vi.fn();

vi.mock('./supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: (...args: unknown[]) => signInWithPassword(...args),
      setSession: (...args: unknown[]) => setSession(...args),
      resetPasswordForEmail: (...args: unknown[]) => resetPasswordForEmail(...args),
      signOut: vi.fn(),
      updateUser: vi.fn(),
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: () => undefined } } })),
    },
    functions: { invoke: (...args: unknown[]) => invoke(...args) },
    from: vi.fn(),
    rpc: vi.fn(),
  },
}));

import {
  EMAIL_RE,
  USERNAME_RE,
  isLegacyAuthEmail,
  isRealUser,
  isReservedAuthEmail,
  loginAccount,
  parseLoginIdentifier,
  registerAccount,
  resetPasswordWithEmail,
  validateRegisterInput,
} from './auth';

function walkKeys(obj: unknown, prefix = ''): string[] {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return [prefix];
  const entries = Object.entries(obj as Record<string, unknown>);
  if (entries.length === 0) return [prefix];
  return entries.flatMap(([k, v]) => walkKeys(v, prefix ? `${prefix}.${k}` : k));
}

describe('parseLoginIdentifier', () => {
  it('accepts a real email', () => {
    expect(parseLoginIdentifier('Ash@Example.com')).toEqual({
      ok: true,
      kind: 'email',
      value: 'ash@example.com',
    });
  });

  it('rejects the reserved pseudo domain as a login email', () => {
    expect(parseLoginIdentifier('ash@users.mypokepanion.com')).toEqual({ ok: false });
  });

  it('accepts a username', () => {
    expect(parseLoginIdentifier('ash_ketchum')).toEqual({
      ok: true,
      kind: 'username',
      value: 'ash_ketchum',
    });
  });

  it('rejects empty, short, or illegal usernames', () => {
    expect(parseLoginIdentifier('')).toEqual({ ok: false });
    expect(parseLoginIdentifier('ab')).toEqual({ ok: false });
    expect(parseLoginIdentifier('ash ketchum')).toEqual({ ok: false });
  });
});

describe('reserved + legacy emails', () => {
  it('flags the pseudo domain', () => {
    expect(isReservedAuthEmail('ash@users.mypokepanion.com')).toBe(true);
    expect(isReservedAuthEmail('ASH@Users.MyPokePanion.com')).toBe(true);
    expect(isReservedAuthEmail('ash@gmail.com')).toBe(false);
    expect(isLegacyAuthEmail('ash@users.mypokepanion.com')).toBe(true);
    expect(isLegacyAuthEmail('ash@gmail.com')).toBe(false);
  });

  it('EMAIL_RE requires a dot-host', () => {
    expect(EMAIL_RE.test('a@b.c')).toBe(true);
    expect(EMAIL_RE.test('not-an-email')).toBe(false);
    expect(EMAIL_RE.test('a@b')).toBe(false);
  });
});

describe('validateRegisterInput', () => {
  it('accepts a modern signup payload', () => {
    expect(validateRegisterInput('ash_ketchum', 'ash@example.com', 'secretsecret')).toBeNull();
  });

  it('rejects reserved domain, short password, bad name', () => {
    expect(validateRegisterInput('ash', 'ash@users.mypokepanion.com', 'secretsecret')).toBe('invalid_input');
    expect(validateRegisterInput('ash', 'ash@example.com', 'short')).toBe('invalid_input');
    expect(validateRegisterInput('ab', 'ash@example.com', 'secretsecret')).toBe('invalid_input');
    expect(USERNAME_RE.test('ash_ketchum')).toBe(true);
  });
});

describe('isRealUser', () => {
  it('drops anonymous sessions and keeps real ones', () => {
    expect(isRealUser(null)).toBeNull();
    expect(isRealUser({ id: 'a', is_anonymous: true } as User)).toBeNull();
    const real = { id: 'a', is_anonymous: false } as User;
    expect(isRealUser(real)).toBe(real);
  });
});

describe('legacy bind → email login', () => {
  beforeEach(() => {
    signInWithPassword.mockReset();
    invoke.mockReset();
  });

  it('unbound legacy still uses the pseudo address', async () => {
    signInWithPassword.mockResolvedValue({ error: null });
    await loginAccount('ash_ketchum', 'secretsecret');
    expect(signInWithPassword).toHaveBeenCalledWith({
      email: 'ash_ketchum@users.mypokepanion.com',
      password: 'secretsecret',
    });
  });

  it('after bind, the same password signs in with the real email', async () => {
    signInWithPassword.mockResolvedValue({ error: null });
    const r = await loginAccount('ash@gmail.com', 'secretsecret');
    expect(r).toEqual({ error: null });
    expect(signInWithPassword).toHaveBeenCalledWith({
      email: 'ash@gmail.com',
      password: 'secretsecret',
    });
  });
});

describe('loginAccount order', () => {
  beforeEach(() => {
    signInWithPassword.mockReset();
    setSession.mockReset();
    invoke.mockReset();
  });

  it('signs in a modern email directly', async () => {
    signInWithPassword.mockResolvedValue({ error: null });
    const r = await loginAccount('ash@example.com', 'secretsecret');
    expect(r).toEqual({ error: null });
    expect(signInWithPassword).toHaveBeenCalledWith({
      email: 'ash@example.com',
      password: 'secretsecret',
    });
    expect(invoke).not.toHaveBeenCalled();
  });

  it('tries the pseudo address first for a username', async () => {
    signInWithPassword.mockResolvedValue({ error: null });
    const r = await loginAccount('ash_ketchum', 'secretsecret');
    expect(r).toEqual({ error: null });
    expect(signInWithPassword).toHaveBeenCalledWith({
      email: 'ash_ketchum@users.mypokepanion.com',
      password: 'secretsecret',
    });
    expect(invoke).not.toHaveBeenCalled();
  });

  it('falls back to login-with-username after a failed pseudo login', async () => {
    signInWithPassword.mockResolvedValue({ error: { message: 'Invalid login credentials' } });
    invoke.mockResolvedValue({
      data: { access_token: 'at', refresh_token: 'rt' },
      error: null,
    });
    setSession.mockResolvedValue({ error: null });
    const r = await loginAccount('ash_ketchum', 'secretsecret');
    expect(r).toEqual({ error: null });
    expect(invoke).toHaveBeenCalledWith('login-with-username', {
      body: { username: 'ash_ketchum', password: 'secretsecret' },
    });
    expect(setSession).toHaveBeenCalledWith({ access_token: 'at', refresh_token: 'rt' });
  });

  it('does not call the username function for a failed email login', async () => {
    signInWithPassword.mockResolvedValue({ error: { message: 'Invalid login credentials' } });
    const r = await loginAccount('ash@example.com', 'secretsecret');
    expect(r).toEqual({ error: 'invalid_credentials' });
    expect(invoke).not.toHaveBeenCalled();
  });
});

describe('registerAccount', () => {
  beforeEach(() => {
    invoke.mockReset();
    signInWithPassword.mockReset();
  });

  it('does not sign in after a successful register (confirm pending)', async () => {
    invoke.mockResolvedValue({ data: { ok: true }, error: null });
    const r = await registerAccount('ash_ketchum', 'ash@example.com', 'secretsecret');
    expect(r).toEqual({ error: null, pendingConfirm: true });
    expect(invoke).toHaveBeenCalledWith('register-account', {
      body: {
        username: 'ash_ketchum',
        email: 'ash@example.com',
        password: 'secretsecret',
      },
    });
    expect(signInWithPassword).not.toHaveBeenCalled();
  });

  it('rejects reserved emails client-side', async () => {
    const r = await registerAccount('ash', 'ash@users.mypokepanion.com', 'secretsecret');
    expect(r).toEqual({ error: 'invalid_input' });
    expect(invoke).not.toHaveBeenCalled();
  });
});

describe('resetPasswordWithEmail', () => {
  beforeEach(() => {
    resetPasswordForEmail.mockReset();
  });

  it('sends a recovery mail for a real address', async () => {
    resetPasswordForEmail.mockResolvedValue({ error: null });
    const r = await resetPasswordWithEmail('ash@example.com', 'https://mypokepanion.com/de/account');
    expect(r).toEqual({ error: null });
    expect(resetPasswordForEmail).toHaveBeenCalled();
  });

  it('rejects reserved domain resets', async () => {
    const r = await resetPasswordWithEmail('ash@users.mypokepanion.com');
    expect(r).toEqual({ error: 'invalid_input' });
    expect(resetPasswordForEmail).not.toHaveBeenCalled();
  });
});

describe('account i18n parity', () => {
  it('keeps DE/EN account key trees aligned', () => {
    const deKeys = walkKeys(de.account).sort();
    const enKeys = walkKeys(en.account).sort();
    expect(deKeys).toEqual(enKeys);
  });
});
