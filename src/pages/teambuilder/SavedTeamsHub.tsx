/* SavedTeamsHub — saved-teams list, hub state when no team is being edited
 * (team-builder.md "Speichern/Teilen": Teams in localStorage pdx2.teams). */
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, FolderOpen, Plus, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';
import Sprite from '@/components/Sprite';
import { nameOfPokemon, useLanguage } from '@/lib/i18n-data';
import { LocaleLink } from '@/lib/locale-link';
import { filledSlots, isLinkedTeam, versionGroupById } from '@/lib/teambuilder';
import type { Team } from '@/lib/teambuilder';
import { cn } from '@/lib/utils';

interface SavedTeamsHubProps {
  teams: Team[];
  onNew: () => void;
  onLoad: (team: Team) => void;
  onDelete: (id: string) => void;
}

function formatWhen(ts: number, lang: 'en' | 'de'): string {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return i18n.t('tb.hub.justNow', { lng: lang });
  if (min < 60) return i18n.t('nuz.time.minShort', { lng: lang, m: min });
  const h = Math.floor(min / 60);
  if (h < 24) return i18n.t('nuz.time.hourShort', { lng: lang, h });
  const d = Math.floor(h / 24);
  if (d < 30) return i18n.t('nuz.time.dayShort', { lng: lang, d });
  return new Date(ts)
    .toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-US', { month: 'short', day: 'numeric' })
    .toUpperCase();
}

export default function SavedTeamsHub({ teams, onNew, onLoad, onDelete }: SavedTeamsHubProps) {
  const { t: t8n } = useTranslation();
  const lang = useLanguage();
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  return (
    <div className="mx-auto max-w-[960px]">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-[26px] font-extrabold tracking-wide text-tx-primary">
            {t8n('tb.page.title')}
          </h1>
          <p className="tb-micro mt-1.5">
            {teams.length ? t8n('tb.hub.vaultCount', { count: teams.length }) : t8n('tb.hub.tagline')}
          </p>
        </div>
        <button type="button" onClick={onNew} className="tb-btn tb-btn-primary">
          <Plus size={13} />
          {t8n('tb.hub.newTeam')}
        </button>
      </div>

      {teams.length === 0 ? (
        <motion.button
          type="button"
          onClick={onNew}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="tb-panel group flex w-full flex-col items-center gap-3 border-dashed px-6 py-14 transition-colors hover:border-gold/40"
        >
          <img src="/empty-dex.svg" alt="" className="h-[110px] w-auto opacity-70 transition-opacity group-hover:opacity-100" />
          <span className="text-[14px] font-semibold text-tx-secondary">{t8n('tb.hub.emptyTitle')}</span>
          <span className="tb-micro-gold">{t8n('tb.hub.emptyCta')}</span>
        </motion.button>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {teams.map((t, i) => {
            const vg = versionGroupById(t.versionGroup);
            const filled = filledSlots(t);
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="tb-panel group p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-glow-gold"
              >
                <div className="mb-2.5 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex min-w-0 items-center gap-1.5">
                      <div className="truncate font-display text-[14px] font-bold tracking-wide text-tx-primary">
                        {t.name}
                      </div>
                      {isLinkedTeam(t) && (
                        <span
                          className="tb-chip shrink-0 !border-gold/50 !bg-gold/10 !px-1.5 !py-0 !text-[7px] !text-gold"
                          title={t8n('tb.linked.fromRun')}
                        >
                          {t8n('tb.linked.badge')}
                        </span>
                      )}
                    </div>
                    <div className="tb-micro mt-1 !text-[7px]">
                      {vg.short} · {filled.length}/6 · {formatWhen(t.updatedAt, lang)}
                    </div>
                  </div>
                  <span className="tb-chip shrink-0 !text-[8px] text-gold">{vg.label}</span>
                </div>
                <div className="mb-3 flex items-center gap-1">
                  {t.slots.map((s) => (
                    <span
                      key={s.id}
                      className="flex h-10 w-10 items-center justify-center rounded-[8px] border border-hairline bg-surface2"
                    >
                      {s.pokemonId != null && s.pokemon ? (
                        <Sprite id={s.pokemonId} name={nameOfPokemon(s.pokemon, lang)} era="default" className="h-9 w-9" skeleton={false} />
                      ) : (
                        <span className="tb-micro !text-[8px] text-tx-muted">—</span>
                      )}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPendingDeleteId(null);
                      onLoad(t);
                    }}
                    className="tb-btn tb-btn-primary flex-1 justify-center !py-2"
                  >
                    <FolderOpen size={12} />
                    {t8n('tb.hub.open')}
                  </button>
                  {isLinkedTeam(t) && t.linkedRunId && (
                    <LocaleLink
                      to={`/nuzlocke/${t.linkedRunId}`}
                      className="tb-btn tb-btn-icon"
                      aria-label={t8n('tb.linked.openRun')}
                      title={t8n('tb.linked.openRun')}
                    >
                      <ExternalLink size={13} />
                    </LocaleLink>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      if (pendingDeleteId !== t.id) {
                        setPendingDeleteId(t.id);
                        return;
                      }
                      onDelete(t.id);
                      setPendingDeleteId(null);
                    }}
                    className={cn(
                      'tb-btn shrink-0',
                      pendingDeleteId === t.id ? 'border-gold/50 text-gold' : 'tb-btn-icon',
                    )}
                    aria-label={
                      pendingDeleteId === t.id
                        ? t8n('tb.hub.confirmDeleteAria', { name: t.name })
                        : t8n('tb.hub.deleteAria', { name: t.name })
                    }
                    title={pendingDeleteId === t.id ? t8n('tb.hub.confirmDelete') : t8n('tb.hub.deleteTip')}
                  >
                    <Trash2 size={13} />
                    {pendingDeleteId === t.id && (
                      <span className="max-w-[9rem] truncate text-[9px] font-semibold tracking-wide">
                        {t8n('tb.hub.confirmDelete')}
                      </span>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
