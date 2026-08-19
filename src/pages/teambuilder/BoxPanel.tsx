/* BoxPanel — reserve pool below the active 6 team slots.
 * Free teams: manual add, promote to team, remove.
 * Linked Nuzlocke teams: auto-synced from run box, roster locked. */
import { useState } from 'react';
import { Archive, ArrowUp, ArrowUpRight, ChevronDown, Plus, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Sprite from '@/components/Sprite';
import TypeBadge from '@/components/TypeBadge';
import { nameOfPokemon, useLanguage } from '@/lib/i18n-data';
import { LocaleLink } from '@/lib/locale-link';
import { dexEntryPath } from '@/lib/dex-forms-catalog';
import { pokemonHref } from '@/lib/edition-nav';
import { genTypesOf } from '@/lib/teambuilder';
import type { SlotLegality, TeamSlot } from '@/lib/teambuilder';
import type { Pokemon } from '@/lib/types';
import { TYPE_COLORS } from '@/lib/types';
import type { PokemonType } from '@/lib/types';
import { cn } from '@/lib/utils';
import PokemonPicker from './PokemonPicker';

interface BoxPanelProps {
  box: TeamSlot[];
  versionGroup: string;
  pokemonCache: Record<number, Pokemon>;
  legalities: Map<string, SlotLegality>;
  rosterLocked: boolean;
  readOnly: boolean;
  canPromote: boolean;
  expandedId: string | null;
  focusedId: string | null;
  onAdd: (pokemonSlug: string, pokemonId: number) => void;
  onRemove: (slotId: string) => void;
  onPromote: (slotId: string) => void;
  onToggleExpand: (slotId: string) => void;
  onFocus: (slotId: string) => void;
}

export default function BoxPanel({
  box,
  versionGroup,
  pokemonCache,
  legalities,
  rosterLocked,
  readOnly,
  canPromote,
  expandedId,
  focusedId,
  onAdd,
  onRemove,
  onPromote,
  onToggleExpand,
  onFocus,
}: BoxPanelProps) {
  const { t: t8n } = useTranslation();
  const lang = useLanguage();
  const [picking, setPicking] = useState(false);
  const lockRoster = rosterLocked || readOnly;
  const filled = box.filter((s) => s.pokemon && s.pokemonId != null);

  return (
    <section className="tb-panel mt-4 overflow-hidden" aria-label={t8n('tb.box.aria')}>
      <div className="tb-panel-head">
        <div className="min-w-0">
          <h3 className="font-display text-micro13 font-bold tracking-wide text-tx-primary">{t8n('tb.box.title')}</h3>
          <p className="tb-micro mt-0.5 !text-[8px]">
            {rosterLocked ? t8n('tb.box.linkedNote') : t8n('tb.box.note')}
          </p>
        </div>
        <span className="tb-micro shrink-0 tabular-nums">{t8n('tb.box.count', { count: filled.length })}</span>
      </div>

      <div className="p-3">
        <div
          className="tb-scroll flex gap-2 overflow-x-auto pb-1"
          data-lenis-prevent
        >
          {box.map((slot) => {
            if (!slot.pokemon || slot.pokemonId == null) return null;
            const pokemon = pokemonCache[slot.pokemonId];
            const fallbackTypes = (pokemon?.types.map((t) => t.type.name) ?? []) as PokemonType[];
            const types = genTypesOf(versionGroup, slot.pokemon, fallbackTypes);
            const primary = TYPE_COLORS[types[0] ?? 'normal'];
            const label = slot.nickname || nameOfPokemon(slot.pokemon, lang);
            const detailPath = pokemonHref(dexEntryPath({ id: slot.pokemonId, name: slot.pokemon }), {
              game: versionGroup,
            });
            const legality = legalities.get(slot.id) ?? { legal: true, reasons: [] };
            const expanded = expandedId === slot.id;
            const focused = focusedId === slot.id;

            return (
              <div
                key={slot.id}
                role="button"
                tabIndex={readOnly ? -1 : 0}
                aria-expanded={expanded}
                onClick={() => {
                  onFocus(slot.id);
                  if (!readOnly) onToggleExpand(slot.id);
                }}
                onKeyDown={(e) => {
                  if (readOnly) return;
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onFocus(slot.id);
                    onToggleExpand(slot.id);
                  }
                }}
                className={cn(
                  'group/box relative flex w-[7rem] shrink-0 flex-col items-center gap-1 rounded-[0.625rem] border border-hairline bg-surface2/70 px-1.5 pb-1.5 pt-1 transition-all',
                  !readOnly && 'cursor-pointer',
                  focused && 'border-gold/40 shadow-[0_0_0_1px_rgba(246,201,69,0.25)]',
                  expanded && '!border-gold shadow-[0_0_20px_rgba(246,201,69,0.28)]',
                  !legality.legal && 'border-gold/40',
                )}
                style={{
                  background: `linear-gradient(180deg, rgba(${primary.rgb},0.1) 0%, transparent 55%), #171b27`,
                }}
              >
                {!lockRoster && (
                  <div className="absolute right-1 top-1 flex items-center gap-0.5">
                    <LocaleLink
                      to={detailPath}
                      onClick={(e) => e.stopPropagation()}
                      onPointerDown={(e) => e.stopPropagation()}
                      className="rounded-sm p-0.5 text-tx-muted/70 transition-all hover:text-gold"
                      aria-label={t8n('tb.slot.openDetail', { name: label })}
                      title={t8n('tb.slot.openDetail', { name: label })}
                    >
                      <ArrowUpRight size={11} />
                    </LocaleLink>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemove(slot.id);
                      }}
                      aria-label={t8n('tb.box.removeAria', { name: label })}
                      className="rounded-sm p-0.5 text-tx-muted opacity-0 transition-all hover:text-gold group-hover/box:opacity-100"
                    >
                      <X size={11} />
                    </button>
                  </div>
                )}

                <div className="relative h-12 w-12">
                  <Sprite
                    id={slot.pokemonId}
                    name={label}
                    era={slot.pokemonId <= 649 ? 'gen5' : 'default'}
                    shiny={slot.shiny}
                    className="h-full w-full"
                  />
                </div>

                <div className="w-full min-w-0 text-center">
                  <span className="block truncate px-0.5 font-display text-micro10 font-bold text-tx-primary">{label}</span>
                  <span className="tb-chip mt-0.5 !text-micro8">LV {slot.level}</span>
                </div>

                <div className="flex justify-center gap-0.5">
                  {types.slice(0, 2).map((t) => (
                    <TypeBadge key={t} type={t} className="!gap-0 !px-1 !py-0 !text-[0.4375rem]" />
                  ))}
                </div>

                <div className="mt-auto flex w-full items-center justify-center gap-1">
                  {canPromote && !lockRoster && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onPromote(slot.id);
                      }}
                      className="tb-chip !px-1 !py-0.5 !text-[0.4375rem] transition-all hover:border-gold/60 hover:text-gold"
                      title={t8n('tb.box.toTeam')}
                      aria-label={t8n('tb.box.toTeamAria', { name: label })}
                    >
                      <ArrowUp size={9} />
                      {t8n('tb.box.toTeam')}
                    </button>
                  )}
                  {!readOnly && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onFocus(slot.id);
                        onToggleExpand(slot.id);
                      }}
                      className="tb-chip !px-1 !py-0.5 !text-[0.4375rem] transition-all hover:border-gold/60 hover:text-gold"
                      aria-label={t8n('tb.slot.editAria', { name: label })}
                    >
                      {t8n('tb.slot.edit')}
                      <ChevronDown size={8} className={cn('transition-transform', expanded && 'rotate-180')} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {!lockRoster && (
            <div className="flex w-[7rem] shrink-0 flex-col">
              {picking ? (
                <div className="tb-panel flex min-h-[9.25rem] flex-col gap-1.5 border-dashed p-2">
                  <span className="tb-micro text-center !text-[8px]">{t8n('tb.box.addPokemon')}</span>
                  <PokemonPicker
                    menuMinWidth={280}
                    onPick={(e) => {
                      onAdd(e.name, e.id);
                      setPicking(false);
                    }}
                  />
                  <button type="button" onClick={() => setPicking(false)} className="tb-micro mx-auto hover:text-gold">
                    {t8n('tb.slot.cancel')}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setPicking(true)}
                  className="group flex min-h-[9.25rem] flex-1 flex-col items-center justify-center gap-2 rounded-[0.625rem] border border-dashed border-hairline bg-surface2/40 transition-colors hover:border-gold/40"
                  aria-label={t8n('tb.box.addAria')}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline2 text-tx-muted transition-all group-hover:border-gold/60 group-hover:text-gold">
                    <Plus size={18} />
                  </span>
                  <span className="tb-micro group-hover:text-gold">{t8n('tb.box.addPokemon')}</span>
                </button>
              )}
            </div>
          )}
        </div>

        {filled.length === 0 && lockRoster && (
          <p className="tb-micro mt-2 text-center">{t8n('tb.box.empty')}</p>
        )}
      </div>
    </section>
  );
}

export { Archive };
