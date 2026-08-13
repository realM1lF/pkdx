import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const INVITE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
const INVITE_FORMAT = `^SOUL-[${INVITE_ALPHABET}]{8}$`

function read(rel: string): string {
  return readFileSync(rel, 'utf8')
}

describe('migration 12 — nuz_run_members invite-only', () => {
  const sql = read('supabase/migrations/12_nuz_members_invite_only.sql')

  it('never adds a permissive using (true) policy', () => {
    expect(sql).not.toMatch(/using\s*\(\s*true\s*\)/i)
    expect(sql).not.toMatch(/with check\s*\(\s*true\s*\)/i)
  })

  it('revokes INSERT from anon, authenticated, and PUBLIC', () => {
    expect(sql).toMatch(/revoke\s+insert\s+on\s+public\.nuz_run_members\s+from\s+anon/i)
    expect(sql).toMatch(/revoke\s+insert\s+on\s+public\.nuz_run_members\s+from\s+authenticated/i)
    expect(sql).toMatch(/revoke\s+insert\s+on\s+public\.nuz_run_members\s+from\s+public/i)
  })

  it('drops the client INSERT policy', () => {
    expect(sql).toMatch(/drop policy if exists "members: insert own member rows"/i)
  })

  it('does not grant INSERT back to clients', () => {
    expect(sql).not.toMatch(/grant\s+insert\s+on\s+public\.nuz_run_members/i)
  })

  it('keeps membership writes on the existing definer paths', () => {
    expect(sql).toMatch(/nuz_join_by_code/)
    expect(sql).toMatch(/nuz_claim_access/)
    expect(sql).toMatch(/nuz_runs_grant_owner/)
  })
})

describe('migration 13 — nuz_runs identity freeze', () => {
  const sql = read('supabase/migrations/13_nuz_runs_identity_freeze.sql')

  it('never adds a permissive using (true) policy', () => {
    expect(sql).not.toMatch(/using\s*\(\s*true\s*\)/i)
    expect(sql).not.toMatch(/with check\s*\(\s*true\s*\)/i)
  })

  it('stamps owner_id from auth.uid() on every INSERT', () => {
    expect(sql).toMatch(/new\.owner_id\s*:=\s*auth\.uid\(\)/i)
    expect(sql).not.toMatch(/if new\.owner_id is null then/i)
  })

  it('revokes table UPDATE and re-grants non-owner columns plus first-mint invite_code', () => {
    expect(sql).toMatch(/revoke\s+update\s+on\s+public\.nuz_runs\s+from/i)
    expect(sql).toMatch(/grant\s+update\s*\(\s*name\s*,\s*game\s*,\s*region\s*,\s*rules\s*,\s*status\s*,\s*invite_code\s*\)/i)
    expect(sql).not.toMatch(/grant\s+update\s*\([^)]*owner_id/i)
  })

  it('pins owner_id always and invite_code after the first mint', () => {
    expect(sql).toMatch(/new\.owner_id\s*:=\s*old\.owner_id/i)
    expect(sql).toMatch(/if old\.invite_code is not null then/i)
    expect(sql).toMatch(/new\.invite_code\s*:=\s*old\.invite_code/i)
  })

  it('validates new invite codes against the client mint alphabet', () => {
    expect(sql).toContain(INVITE_FORMAT)
    expect(sql).not.toMatch(/add constraint\s+\w*invite/i)
  })

  it('leaves unchanged legacy invite_code values alone', () => {
    expect(sql).toMatch(/tg_op\s*=\s*'UPDATE'/i)
    expect(sql).toMatch(/new\.invite_code is not distinct from old\.invite_code/i)
  })
})

describe('migration 99 — break-glass marker', () => {
  const sql = read('supabase/migrations/99_rollback_nuzlocke_rls.sql')

  it('is marked as break-glass and not part of normal migrate order', () => {
    const head = sql.slice(0, 1200)
    expect(head).toMatch(/BREAK-GLASS/i)
    expect(head).toMatch(/must never be applied in normal migrate order/i)
  })
})

describe('check-rls signup posture', () => {
  const src = read('scripts/check-rls.mjs')

  it('treats public signup as high or critical', () => {
    expect(src).toMatch(/disable_signup\s*===\s*false/)
    expect(src).toMatch(/disable_signup[\s\S]{0,280}note\(\s*'(?:high|crit)'/)
    expect(src).toMatch(/register-account/)
  })

  it('does not print service-role material', () => {
    expect(src).not.toMatch(/service_role/)
    expect(src).not.toMatch(/SUPABASE_SERVICE/)
  })
})

describe('fix-lockfile-registry mirrors', () => {
  const src = read('scripts/fix-lockfile-registry.mjs')

  it('rewrites both msh.team and npmmirror to registry.npmjs.org', () => {
    expect(src).toMatch(/npm\.mirrors\.msh\.team/)
    expect(src).toMatch(/registry\.npmmirror\.com/)
    expect(src).toMatch(/registry\.npmjs\.org/)
  })
})
