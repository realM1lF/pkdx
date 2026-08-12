import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('orre_shadow_progress migration', () => {
  const sql = readFileSync('supabase/migrations/11_orre_shadow_progress.sql', 'utf8')

  it('enables RLS and never uses permissive using (true)', () => {
    expect(sql).toMatch(/enable row level security/i)
    expect(sql).not.toMatch(/using\s*\(\s*true\s*\)/i)
    expect(sql).not.toMatch(/with check\s*\(\s*true\s*\)/i)
  })

  it('scopes all policies to auth.uid() = user_id', () => {
    expect(sql).toMatch(/orre_shadow_progress_select_own/)
    expect(sql).toMatch(/orre_shadow_progress_insert_own/)
    expect(sql).toMatch(/orre_shadow_progress_update_own/)
    expect(sql).toMatch(/orre_shadow_progress_delete_own/)
    const uidChecks = sql.match(/auth\.uid\(\)\s*=\s*user_id/g) ?? []
    expect(uidChecks.length).toBeGreaterThanOrEqual(4)
  })

  it('constrains game and status enums', () => {
    expect(sql).toMatch(/check \(game in \('colosseum', 'xd'\)\)/)
    expect(sql).toMatch(/check \(status in \('snagged', 'missed'\)\)/)
  })
})
