/* ImportRunDialog — IMPORT FROM RUN (team-builder.md "Integration"):
 * lists local + online nuzlocke runs, loads the alive team via getRunTeam
 * (multi-player runs offer a player pick), maps run.game → version group. */
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Cloud, HardDrive, Swords, X } from 'lucide-react';
import PokeballLoader from '@/components/PokeballLoader';
import Sprite from '@/components/Sprite';
import { versionChipLabel } from '@/lib/regions';
import { importRunTeams, listImportableRuns } from '@/lib/teambuilder';
import type { ImportableRun, ImportedRunTeam } from '@/lib/teambuilder';
import { cn } from '@/lib/utils';

interface ImportRunDialogProps {
  open: boolean;
  onClose: () => void;
  /** picked player team → parent builds slots + inherits version group */
  onImport: (team: ImportedRunTeam) => void;
}

type Phase =
  | { kind: 'runs' }
  | { kind: 'loading'; run: ImportableRun }
  | { kind: 'players'; run: ImportableRun; teams: ImportedRunTeam[] }
  | { kind: 'error'; message: string };

export default function ImportRunDialog({ open, onClose, onImport }: ImportRunDialogProps) {
  const [runs, setRuns] = useState<ImportableRun[]>([]);
  const [phase, setPhase] = useState<Phase>({ kind: 'runs' });

  /* reset when the dialog opens — derived-state-during-render pattern */
  const [prevOpen, setPrevOpen] = useState(open);
  if (prevOpen !== open) {
    setPrevOpen(open);
    if (open) {
      setRuns(listImportableRuns());
      setPhase({ kind: 'runs' });
    }
  }

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const pickRun = async (run: ImportableRun) => {
    setPhase({ kind: 'loading', run });
    try {
      const teams = await importRunTeams(run.id);
      const alive = teams.filter((t) => t.members.length > 0);
      if (!alive.length) {
        setPhase({ kind: 'error', message: 'NO ALIVE TEAM MEMBERS IN THIS RUN' });
      } else if (alive.length === 1) {
        onImport(alive[0]);
        onClose();
      } else {
        setPhase({ kind: 'players', run, teams: alive });
      }
    } catch {
      setPhase({ kind: 'error', message: 'COULD NOT LOAD RUN (OFFLINE?)' });
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[90] flex items-start justify-center bg-void/70 p-4 pt-[12vh] backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Import team from nuzlocke run"
        >
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 180, damping: 22 }}
            className="tb-panel w-full max-w-[520px] overflow-hidden !rounded-[16px] shadow-elevate"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="tb-panel-head">
              <span className="tb-micro-gold flex items-center gap-1.5">
                <Swords size={11} />
                IMPORT FROM RUN
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="rounded-sm p-1 text-tx-muted transition-all hover:rotate-90 hover:text-gold"
              >
                <X size={14} />
              </button>
            </div>

            <div className="tb-scroll max-h-[46vh] overflow-y-auto p-3" data-lenis-prevent>
              {phase.kind === 'loading' && (
                <div className="flex flex-col items-center gap-2 py-6">
                  <PokeballLoader variant="inline" />
                  <span className="tb-micro">LOADING {phase.run.name.toUpperCase()}…</span>
                </div>
              )}

              {phase.kind === 'error' && (
                <div className="rounded-[8px] border border-gold/50 bg-gold/10 p-3 text-center">
                  <span className="tb-micro-gold !text-[9px]">{phase.message}</span>
                </div>
              )}

              {phase.kind === 'runs' && (
                <>
                  {runs.length === 0 && (
                    <div className="py-6 text-center">
                      <p className="text-[13px] font-semibold text-tx-secondary">No nuzlocke runs found.</p>
                      <p className="tb-micro mt-1.5">START A RUN ON /NUZLOCKE FIRST</p>
                    </div>
                  )}
                  <ul className="space-y-1.5">
                    {runs.map((r) => (
                      <li key={r.id}>
                        <button
                          type="button"
                          onClick={() => void pickRun(r)}
                          className="tb-option !rounded-[10px] border border-hairline !py-2.5 hover:border-gold/40"
                        >
                          {r.mode === 'online' ? (
                            <Cloud size={14} className="shrink-0 text-type-electric" />
                          ) : (
                            <HardDrive size={14} className="shrink-0 text-tx-muted" />
                          )}
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[13px] font-semibold text-tx-primary">{r.name}</span>
                            <span className="tb-micro !text-[7px]">
                              {versionChipLabel(r.game)} · {r.mode.toUpperCase()} · {r.status.toUpperCase()}
                            </span>
                          </span>
                          <span
                            className={cn(
                              'tb-chip shrink-0 !text-[8px]',
                              r.versionGroup ? 'text-gold' : 'text-tx-muted',
                            )}
                          >
                            {r.versionGroup ? 'READY' : 'NO MAP'}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {phase.kind === 'players' && (
                <>
                  <p className="tb-micro mb-2 px-1">WHOSE TEAM? · {phase.run.name.toUpperCase()}</p>
                  <ul className="space-y-1.5">
                    {phase.teams.map((t) => (
                      <li key={t.player}>
                        <button
                          type="button"
                          onClick={() => {
                            onImport(t);
                            onClose();
                          }}
                          className="tb-option !rounded-[10px] border border-hairline !py-2.5 hover:border-gold/40"
                        >
                          <span
                            className="h-3 w-3 shrink-0 rounded-full"
                            style={{ background: t.color, boxShadow: `0 0 8px ${t.color}` }}
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[13px] font-semibold text-tx-primary">{t.player}</span>
                            <span className="tb-micro !text-[7px]">{t.members.length} ALIVE</span>
                          </span>
                          <span className="flex shrink-0">
                            {t.members.slice(0, 6).map((m, mi) => (
                              <span key={`${m.pokemonId}-${mi}`} className="-ml-1 h-7 w-7 first:ml-0">
                                <Sprite id={m.pokemonId} name={m.pokemon} era="default" skeleton={false} />
                              </span>
                            ))}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
