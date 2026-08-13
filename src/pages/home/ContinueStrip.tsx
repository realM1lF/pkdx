/* Compact continue strip — last Nuzlocke run + last team, 44px Holo-Dex row.
 * Renders nothing when localStorage has neither. Mount-gated so prerender
 * HTML stays empty (no hydration mismatch). */
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Swords, Users } from 'lucide-react';
import Sprite from '@/components/Sprite';
import { nameOfPokemon, useLanguage } from '@/lib/i18n-data';
import { LocaleLink } from '@/lib/locale-link';
import { getLatestRunId, loadLocalRun, myPlayerId, partyOf } from '@/lib/nuzlocke-store';
import type { RunState } from '@/lib/nuzlocke-store';
import { loadDraft, loadTeams, onTeamsChange } from '@/lib/teambuilder';
import type { Team } from '@/lib/teambuilder';
import { continueTargets } from './continue-targets';
import type { ContinueTarget } from './continue-targets';

function partyIdsFromRun(state: RunState): number[] {
  const mine = myPlayerId(state.run.id);
  const playerId = mine ?? [...state.players].sort((a, b) => a.slot - b.slot)[0]?.id;
  if (!playerId) return [];
  return partyOf(state, playerId).map((e) => e.pokemon_id);
}

function partyIdsFromTeam(team: Team): number[] {
  return team.slots.map((s) => s.pokemonId).filter((id): id is number => id != null);
}

function readContinueTargets(): ContinueTarget[] {
  const runId = getLatestRunId();
  const run = runId ? loadLocalRun(runId) : null;
  const draft = loadDraft();
  const teams = loadTeams();
  return continueTargets({
    run: run ? { id: run.run.id, name: run.run.name, partyIds: partyIdsFromRun(run) } : null,
    draft: draft ? { name: draft.name, updatedAt: draft.updatedAt, partyIds: partyIdsFromTeam(draft) } : null,
    teams: teams.map((t) => ({ name: t.name, updatedAt: t.updatedAt, partyIds: partyIdsFromTeam(t) })),
  });
}

export default function ContinueStrip() {
  const { t } = useTranslation();
  const lang = useLanguage();
  const [targets, setTargets] = useState<ContinueTarget[]>([]);

  useEffect(() => {
    const refresh = () => setTargets(readContinueTargets());
    refresh();
    return onTeamsChange(refresh);
  }, []);

  if (targets.length === 0) return null;

  return (
    <section className="relative bg-abyss">
      <nav
        aria-label={t('home.continue.eyebrow')}
        className="mx-auto flex h-11 max-w-content min-w-0 items-center gap-2.5 px-4 md:px-8"
      >
        <span className="pixel-label shrink-0 text-[8px] text-gold">{t('home.continue.eyebrow')}</span>
        <span className="h-4 w-px shrink-0 bg-hairline" aria-hidden />
        {targets.map((target) => {
          const Icon = target.kind === 'run' ? Users : Swords;
          return (
            <LocaleLink
              key={target.kind}
              to={target.to}
              className="flex h-9 min-w-0 items-center gap-2 rounded-md border border-hairline bg-surface1 px-2.5 transition-colors duration-150 hover:border-gold/50 hover:bg-gold/10"
            >
              <Icon size={12} strokeWidth={1.75} className="shrink-0 text-gold" aria-hidden />
              <span className="pixel-label hidden shrink-0 text-[8px] text-tx-muted sm:inline">
                {t(`home.continue.${target.kind}`)}
              </span>
              <span className="min-w-0 truncate text-[12px] font-semibold text-tx-primary">{target.name}</span>
              {target.partyIds.length > 0 && (
                <span className="hidden shrink-0 items-center sm:flex">
                  {target.partyIds.slice(0, 6).map((id, i) => (
                    <Sprite
                      key={`${target.kind}-${id}-${i}`}
                      id={id}
                      name={nameOfPokemon(id, lang)}
                      className="h-7 w-7"
                      skeleton={false}
                    />
                  ))}
                </span>
              )}
            </LocaleLink>
          );
        })}
      </nav>
    </section>
  );
}
