/* AddToTeam — "Zu Team hinzufügen" on the Pokémon detail page and Pokédex cards:
 * pick a saved team → first free slot, or the reserve box when 6/6.
 * Overlay is portaled to document.body — detail page motion wrappers use
 * transform, which traps position:fixed inside the hero panel. */
import { useEffect, useState, type MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, FolderOpen, Plus, Users, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LocaleLink } from '@/lib/locale-link';
import PokeballLoader from '@/components/PokeballLoader';
import Sprite from '@/components/Sprite';
import { getPokemon } from '@/lib/pokeapi';
import { nameOfPokemon, useLanguage } from '@/lib/i18n-data';
import {
  addToTeamOrBox,
  defaultMoveset,
  emptyTeam,
  filledBoxSlots,
  filledSlots,
  loadTeams,
  onTeamsChange,
  saveDraft,
  saveTeam,
  versionGroupById,
} from '@/lib/teambuilder';
import { addableTeams, teamEditPath } from '@/lib/team-routes';
import type { AddTeamTarget, Team } from '@/lib/teambuilder';
import type { Pokemon } from '@/lib/types';
import { cn } from '@/lib/utils';

type Phase =
  | { kind: 'pick' }
  | { kind: 'busy'; teamName: string }
  | { kind: 'done'; team: Team; target: AddTeamTarget };

type AddToTeamProps = {
  pokemonId: number;
  /** English PokéAPI slug — used when `pokemon` is not preloaded */
  pokemonSlug: string;
  pokemon?: Pokemon;
  variant?: 'pill' | 'icon';
  className?: string;
};

export default function AddToTeam({
  pokemonId,
  pokemonSlug,
  pokemon: pokemonProp,
  variant = 'pill',
  className,
}: AddToTeamProps) {
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
      setTeams(addableTeams(loadTeams()));
      setPhase({ kind: 'pick' });
    }
  }

  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    const unsub = onTeamsChange(() => setTeams(addableTeams(loadTeams())));
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener('keydown', onKey);
      unsub();
    };
  }, [open]);

  const addTo = async (team: Team) => {
    setPhase({ kind: 'busy', teamName: team.name });
    /* default moveset at the team's version group + slot level (50) —
     * resolution failures degrade gracefully to an empty set */
    const pokemon = pokemonProp ?? (await getPokemon(pokemonId));
    const moves = await defaultMoveset(pokemon, 50, team.versionGroup).catch(() => []);
    const result = addToTeamOrBox(team, { pokemon: pokemon.name, pokemonId: pokemon.id, moves });
    saveTeam(result.team);
    setTeams(addableTeams(loadTeams()));
    setPhase({ kind: 'done', team: result.team, target: result.target });
  };

  const createAndAdd = () => {
    const team = emptyTeam(t8n('detail.addToTeam.newTeamName'));
    void addTo(team);
  };

  const openPicker = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(true);
  };

  const displayName = pokemonProp
    ? nameOfPokemon(pokemonProp.name, lang)
    : nameOfPokemon(pokemonSlug, lang);

  return (
    <>
      {variant === 'icon' ? (
        <button
          type="button"
          onClick={openPicker}
          title={t8n('detail.addToTeam.button')}
          aria-label={t8n('detail.addToTeam.button')}
          className={cn(
            'grid h-8 w-8 place-items-center rounded-md border border-transparent text-tx-muted transition-all duration-200',
            'hover:border-hairline2 hover:bg-surface2 hover:text-gold',
            className,
          )}
        >
          <Users size={14} strokeWidth={1.75} />
        </button>
      ) : (
        <button
          type="button"
          onClick={openPicker}
          title={t8n('detail.addToTeam.button')}
          className={cn(
            'inline-flex h-7 items-center gap-1 rounded-pill border border-gold/60 bg-abyss/70 px-2.5 font-display text-[11px] leading-none font-bold tracking-[0.06em] text-gold backdrop-blur-sm transition-all duration-150 hover:shadow-glow-gold',
            className,
          )}
        >
          <Users size={11} />
          <span className="hidden sm:inline">{t8n('detail.addToTeam.button')}</span>
          <Plus size={11} className="sm:hidden" />
        </button>
      )}

      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[95] flex items-start justify-center bg-void/70 p-4 pt-[12vh] backdrop-blur-sm"
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
                className="dx-panel w-full max-w-[27.5rem] overflow-hidden !rounded-[1rem] shadow-elevate"
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
                        {t8n('detail.addToTeam.adding', { name: phase.teamName })}
                      </span>
                    </div>
                  )}

                  {phase.kind === 'done' && (
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2.5 rounded-[0.5rem] border border-gold/50 bg-gold/10 p-3">
                        <Check size={14} className="shrink-0 text-gold" />
                        <span className="text-micro12 font-semibold text-tx-primary">
                          {phase.target === 'box'
                            ? t8n('detail.addToTeam.addedToBox', {
                                pokemon: displayName,
                                team: phase.team.name,
                              })
                            : t8n('detail.addToTeam.added', {
                                pokemon: displayName,
                                team: phase.team.name,
                              })}
                        </span>
                      </div>
                      <LocaleLink
                        to={teamEditPath(phase.team.id)}
                        onClick={() => saveDraft(phase.team)}
                        className="flex w-full items-center justify-center gap-1.5 rounded-[0.5rem] border border-gold/60 bg-gold/15 px-3 py-2 font-display text-micro11 font-bold tracking-[0.06em] text-gold transition-all hover:shadow-glow-gold"
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
                          <p className="text-micro13 font-semibold text-tx-secondary">{t8n('detail.addToTeam.empty')}</p>
                          <button
                            type="button"
                            onClick={createAndAdd}
                            className="mx-auto mt-3 inline-flex items-center gap-1.5 rounded-pill border border-gold/60 bg-gold/15 px-3.5 py-2 font-display text-[11px] leading-none font-bold tracking-[0.06em] text-gold transition-all hover:shadow-glow-gold"
                          >
                            <Plus size={12} />
                            {t8n('detail.addToTeam.createNew')}
                          </button>
                        </div>
                      ) : (
                        <ul className="space-y-1.5">
                          {teams.map((team) => {
                            const filled = filledSlots(team).length;
                            const boxed = filledBoxSlots(team).length;
                            const full = filled >= 6;
                            return (
                              <li key={team.id}>
                                <button
                                  type="button"
                                  onClick={() => void addTo(team)}
                                  className="flex w-full items-center gap-2.5 rounded-[0.625rem] border border-hairline bg-surface2 px-3 py-2.5 text-left transition-colors hover:border-gold/40"
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
                                          className="flex h-7 w-7 items-center justify-center rounded-[0.375rem] border border-hairline text-micro9 text-tx-muted"
                                        >
                                          —
                                        </span>
                                      ),
                                    )}
                                  </span>
                                  <span className="min-w-0 flex-1">
                                    <span className="block truncate font-display text-micro12 font-bold tracking-wide text-tx-primary">
                                      {team.name}
                                    </span>
                                    <span className="pixel-label text-[8px] text-tx-muted">
                                      {versionGroupById(team.versionGroup).short} · {filled}/6
                                      {boxed > 0 ? ` · +${boxed}` : ''}
                                    </span>
                                  </span>
                                  <span className={`pixel-label shrink-0 text-[8px] ${full ? 'text-gold' : 'text-gold'}`}>
                                    {full ? (boxed > 0 ? t8n('detail.addToTeam.toBox') : '6/6') : <Plus size={12} />}
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
        </AnimatePresence>,
        document.body,
      )}
    </>
  );
}
