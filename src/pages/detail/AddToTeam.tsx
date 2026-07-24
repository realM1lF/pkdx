/* AddToTeam — "Zu Team hinzufügen" on the Pokémon detail page:
 * pick a saved team → the Pokémon lands in the first free slot with a
 * default moveset (wild → assumed, the same resolution the team builder
 * uses on pick). Full team → friendly error. No teams yet → offer to
 * create one ("Mein Team") and add directly. */
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, FolderOpen, Plus, Users, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LocaleLink } from '@/lib/locale-link';
import PokeballLoader from '@/components/PokeballLoader';
import Sprite from '@/components/Sprite';
import { nameOfPokemon, useLanguage } from '@/lib/i18n-data';
import {
  addToFirstFreeSlot,
  defaultMoveset,
  emptyTeam,
  filledSlots,
  loadTeams,
  saveDraft,
  saveTeam,
  versionGroupById,
} from '@/lib/teambuilder';
import type { Team } from '@/lib/teambuilder';
import type { Pokemon } from '@/lib/types';

type Phase =
  | { kind: 'pick' }
  | { kind: 'busy'; teamName: string }
  | { kind: 'done'; team: Team }
  | { kind: 'full'; teamName: string };

export default function AddToTeam({ pokemon }: { pokemon: Pokemon }) {
  const { t: t8n } = useTranslation();
  const lang = useLanguage();
  const [open, setOpen] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [phase, setPhase] = useState<Phase>({ kind: 'pick' });

  /* reset when the dialog opens — derived-state-during-render pattern */
  const [prevOpen, setPrevOpen] = useState(open);
  if (prevOpen !== open) {
    setPrevOpen(open);
    if (open) {
      setTeams(loadTeams());
      setPhase({ kind: 'pick' });
    }
  }

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const addTo = async (team: Team) => {
    setPhase({ kind: 'busy', teamName: team.name });
    /* default moveset at the team's version group + slot level (50) —
     * resolution failures degrade gracefully to an empty set */
    const moves = await defaultMoveset(pokemon, 50, team.versionGroup).catch(() => []);
    const updated = addToFirstFreeSlot(team, { pokemon: pokemon.name, pokemonId: pokemon.id, moves });
    if (!updated) {
      setPhase({ kind: 'full', teamName: team.name });
      return;
    }
    saveTeam(updated);
    setTeams(loadTeams());
    setPhase({ kind: 'done', team: updated });
  };

  const createAndAdd = () => {
    const team = emptyTeam(t8n('detail.addToTeam.newTeamName'));
    void addTo(team);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        title={t8n('detail.addToTeam.button')}
        className="inline-flex h-7 items-center gap-1 rounded-pill border border-gold/60 bg-abyss/70 px-2.5 font-display text-[10px] font-bold uppercase tracking-[0.06em] text-gold backdrop-blur-sm transition-all duration-150 hover:shadow-glow-gold"
      >
        <Users size={11} />
        <span className="hidden sm:inline">{t8n('detail.addToTeam.button')}</span>
        <Plus size={11} className="sm:hidden" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[90] flex items-start justify-center bg-void/70 p-4 pt-[12vh] backdrop-blur-sm"
            onClick={() => setOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label={t8n('detail.addToTeam.title')}
          >
            <motion.div
              initial={{ opacity: 0, y: -16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 180, damping: 22 }}
              className="dx-panel w-full max-w-[440px] overflow-hidden !rounded-[16px] shadow-elevate"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-hairline px-4 py-2.5">
                <span className="pixel-label flex items-center gap-1.5 text-[9px] text-gold">
                  <Users size={11} />
                  {t8n('detail.addToTeam.title')}
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label={t8n('detail.addToTeam.close')}
                  className="rounded-sm p-1 text-tx-muted transition-all hover:rotate-90 hover:text-gold"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="max-h-[46vh] overflow-y-auto p-3" data-lenis-prevent>
                {phase.kind === 'busy' && (
                  <div className="flex flex-col items-center gap-2 py-6">
                    <PokeballLoader variant="inline" />
                    <span className="pixel-label text-[8px] text-tx-muted">
                      {t8n('detail.addToTeam.adding', { name: phase.teamName.toUpperCase() })}
                    </span>
                  </div>
                )}

                {phase.kind === 'full' && (
                  <div className="space-y-2.5">
                    <div className="rounded-[8px] border border-gold/50 bg-gold/10 p-3 text-center">
                      <span className="pixel-label text-[9px] text-gold">
                        {t8n('detail.addToTeam.full', { name: phase.teamName })}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPhase({ kind: 'pick' })}
                      className="w-full rounded-[8px] border border-hairline bg-surface2 px-3 py-2 text-[12px] font-semibold text-tx-secondary transition-colors hover:border-gold/40 hover:text-gold"
                    >
                      {t8n('detail.addToTeam.backToList')}
                    </button>
                  </div>
                )}

                {phase.kind === 'done' && (
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2.5 rounded-[8px] border border-gold/50 bg-gold/10 p-3">
                      <Check size={14} className="shrink-0 text-gold" />
                      <span className="text-[12px] font-semibold text-tx-primary">
                        {t8n('detail.addToTeam.added', {
                          pokemon: nameOfPokemon(pokemon.id, lang),
                          team: phase.team.name,
                        })}
                      </span>
                    </div>
                    <LocaleLink
                      to="/team"
                      onClick={() => saveDraft(phase.team)}
                      className="flex w-full items-center justify-center gap-1.5 rounded-[8px] border border-gold/60 bg-gold/15 px-3 py-2 font-display text-[11px] font-bold uppercase tracking-[0.06em] text-gold transition-all hover:shadow-glow-gold"
                    >
                      <FolderOpen size={12} />
                      {t8n('detail.addToTeam.openTeam')}
                    </LocaleLink>
                  </div>
                )}

                {phase.kind === 'pick' && (
                  <>
                    {teams.length === 0 ? (
                      <div className="py-4 text-center">
                        <p className="text-[13px] font-semibold text-tx-secondary">{t8n('detail.addToTeam.empty')}</p>
                        <button
                          type="button"
                          onClick={createAndAdd}
                          className="mx-auto mt-3 inline-flex items-center gap-1.5 rounded-pill border border-gold/60 bg-gold/15 px-3.5 py-2 font-display text-[11px] font-bold uppercase tracking-[0.06em] text-gold transition-all hover:shadow-glow-gold"
                        >
                          <Plus size={12} />
                          {t8n('detail.addToTeam.createNew')}
                        </button>
                      </div>
                    ) : (
                      <ul className="space-y-1.5">
                        {teams.map((team) => {
                          const filled = filledSlots(team).length;
                          const full = filled >= 6;
                          return (
                            <li key={team.id}>
                              <button
                                type="button"
                                onClick={() => void addTo(team)}
                                className="flex w-full items-center gap-2.5 rounded-[10px] border border-hairline bg-surface2 px-3 py-2.5 text-left transition-colors hover:border-gold/40"
                              >
                                <span className="flex items-center gap-1">
                                  {team.slots.map((s) =>
                                    s.pokemonId != null && s.pokemon ? (
                                      <Sprite
                                        key={s.id}
                                        id={s.pokemonId}
                                        name={nameOfPokemon(s.pokemon, lang)}
                                        era="default"
                                        className="h-7 w-7"
                                        skeleton={false}
                                      />
                                    ) : (
                                      <span
                                        key={s.id}
                                        className="flex h-7 w-7 items-center justify-center rounded-[6px] border border-hairline text-[9px] text-tx-muted"
                                      >
                                        —
                                      </span>
                                    ),
                                  )}
                                </span>
                                <span className="min-w-0 flex-1">
                                  <span className="block truncate font-display text-[12px] font-bold uppercase tracking-wide text-tx-primary">
                                    {team.name}
                                  </span>
                                  <span className="pixel-label text-[7px] text-tx-muted">
                                    {versionGroupById(team.versionGroup).short} · {filled}/6
                                  </span>
                                </span>
                                <span className={`pixel-label shrink-0 text-[8px] ${full ? 'text-tx-muted' : 'text-gold'}`}>
                                  {full ? '6/6' : <Plus size={12} />}
                                </span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
