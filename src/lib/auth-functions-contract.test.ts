import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

function read(rel: string): string {
  return readFileSync(rel, 'utf8');
}

describe('auth edge functions contract', () => {
  const register = read('supabase/functions/register-account/index.ts');
  const login = read('supabase/functions/login-with-username/index.ts');
  const del = read('supabase/functions/delete-account/index.ts');
  const shared = read('supabase/functions/_shared/http.ts');

  it('rate-limits register, username login and delete', () => {
    expect(register).toMatch(/rateLimited/);
    expect(login).toMatch(/rateLimited/);
    expect(del).toMatch(/rateLimited/);
    expect(shared).toMatch(/rateLimited/);
  });

  it('never writes a recovery PIN and rejects the reserved domain', () => {
    expect(register).not.toMatch(/recoveryCode|recovery_pin|pinHash/);
    expect(register).toMatch(/isReservedAuthEmail/);
    expect(register).toMatch(/email_confirm:\s*false/);
    expect(register).toMatch(/auth\/v1\/resend/);
    expect(register).not.toMatch(/api\.resend\.com/);
  });

  it('username login does not return the resolved email', () => {
    expect(login).toMatch(/grant_type=password/);
    expect(login).not.toMatch(/return json\(\s*\{[^}]*email/);
  });

  it('delete refuses anonymous sessions', () => {
    expect(del).toMatch(/is_anonymous/);
    expect(del).toMatch(/deleteUser/);
  });
});
