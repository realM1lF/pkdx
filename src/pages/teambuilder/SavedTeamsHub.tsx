/* SavedTeamsHub — saved-teams list, hub state when no team is being edited
 * (team-builder.md "Speichern/Teilen": Teams in localStorage pdx2.teams). */
import { motion } from 'framer-motion';
import { FolderOpen, Plus, Trash2 } from 'lucide-react';
import Sprite from '@/components/Sprite';
import { displayName } from '@/lib/pokeapi';
import { filledSlots, versionGroupById } from '@/lib/teambuilder';
import type { Team } from '@/lib/teambuilder';

interface SavedTeamsHubProps {
  teams: Team[];
  onNew: () => void;
  onLoad: (team: Team) => void;
  onDelete: (id: string) => void;
}

function formatWhen(ts: number): string {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'JUST NOW';
  if (min < 60) return `${min}M AGO`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}H AGO`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}D AGO`;
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
}

export default function SavedTeamsHub({ teams, onNew, onLoad, onDelete }: SavedTeamsHubProps) {
  return (
    <div className="mx-auto max-w-[960px]">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-[26px] font-extrabold uppercase tracking-wide text-tx-primary">
            Team Builder
          </h1>
          <p className="tb-micro mt-1.5">
            {teams.length ? `${teams.length} SAVED TEAM${teams.length > 1 ? 'S' : ''} · LOCAL VAULT` : 'BUILD · ANALYZE · SHARE'}
          </p>
        </div>
        <button type="button" onClick={onNew} className="tb-btn tb-btn-primary">
          <Plus size={13} />
          NEW TEAM
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
          <span className="text-[14px] font-semibold text-tx-secondary">No saved teams yet.</span>
          <span className="tb-micro-gold">START YOUR FIRST SQUAD →</span>
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
                    <div className="truncate font-display text-[14px] font-bold uppercase tracking-wide text-tx-primary">
                      {t.name}
                    </div>
                    <div className="tb-micro mt-1 !text-[7px]">
                      {vg.short} · {filled.length}/6 · {formatWhen(t.updatedAt)}
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
                        <Sprite id={s.pokemonId} name={displayName(s.pokemon)} era="default" className="h-9 w-9" skeleton={false} />
                      ) : (
                        <span className="tb-micro !text-[8px] text-tx-muted">—</span>
                      )}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => onLoad(t)} className="tb-btn tb-btn-primary flex-1 justify-center !py-2">
                    <FolderOpen size={12} />
                    OPEN
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(t.id)}
                    className="tb-btn tb-btn-icon"
                    aria-label={`Delete ${t.name}`}
                  >
                    <Trash2 size={13} />
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
