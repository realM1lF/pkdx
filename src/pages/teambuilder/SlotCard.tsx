/* SlotCard — one of the 6 team slots (team-builder.md "6 Slots als Karten-Reihe").
 * Empty → "+" autocomplete add · Filled → sprite aura, types, level, move pips,
 * gold ILLEGAL flag (never red), VS icon-link → /pokemon/{id}?vs= */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { AlertTriangle, ChevronDown, Plus, Swords, X } from 'lucide-react';
import Sprite from '@/components/Sprite';
import TypeBadge from '@/components/TypeBadge';
import { padNum } from '@/lib/pokeapi';
import { nameOfPokemon, useLanguage } from '@/lib/i18n-data';
import { LocaleLink } from '@/lib/locale-link';
import { genTypesOf, versionGroupById } from '@/lib/teambuilder';
import type { SlotLegality, TeamSlot } from '@/lib/teambuilder';
import type { Pokemon } from '@/lib/types';
import { TYPE_COLORS } from '@/lib/types';
import type { PokemonType } from '@/lib/types';
import { cn } from '@/lib/utils';
import PokemonPicker from './PokemonPicker';

interface SlotCardProps {
  slot: TeamSlot;
  index: number;
  pokemon: Pokemon | undefined;
  legality: SlotLegality;
  versionGroup: string;
  expanded: boolean;
  focused: boolean;
  onPick: (slotId: string, pokemonSlug: string, pokemonId: number) => void;
  onRemove: (slotId: string) => void;
  onToggleExpand: (slotId: string) => void;
  onFocus: (slotId: string) => void;
}

export default function SlotCard({
  slot,
  index,
  pokemon,
  legality,
  versionGroup,
  expanded,
  focused,
  onPick,
  onRemove,
  onToggleExpand,
  onFocus,
}: SlotCardProps) {
  const lang = useLanguage();
  const { t: t8n } = useTranslation();
  const [picking, setPicking] = useState(false);

  /* ---------- empty slot ---------- */
  if (!slot.pokemon || slot.pokemonId == null) {
    return (
      <div
        className={cn(
          'tb-panel flex min-h-[172px] flex-col items-stretch justify-center gap-2 border-dashed p-3 transition-colors',
          picking ? '!border-solid border-gold/40' : 'hover:border-gold/30',
        )}
      >
        {picking ? (
          <>
            <span className="tb-micro text-center">{t8n('tb.slot.addToSlot', { n: index + 1 })}</span>
            <PokemonPicker
              onPick={(e) => {
                onPick(slot.id, e.name, e.id);
                setPicking(false);
              }}
            />
            <button type="button" onClick={() => setPicking(false)} className="tb-micro mx-auto hover:text-gold">
              {t8n('tb.slot.cancel')}
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => setPicking(true)}
            className="group flex flex-1 flex-col items-center justify-center gap-2"
            aria-label={t8n('tb.slot.addAria', { n: index + 1 })}
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-hairline2 bg-surface2 text-tx-muted transition-all duration-200 group-hover:border-gold/60 group-hover:text-gold group-hover:shadow-glow-gold">
              <Plus size={20} />
            </span>
            <span className="tb-micro group-hover:text-gold">{t8n('tb.slot.addPokemon')}</span>
          </button>
        )}
      </div>
    );
  }

  /* ---------- filled slot ---------- */
  const fallbackTypes = (pokemon?.types.map((t) => t.type.name) ?? []) as PokemonType[];
  const types = genTypesOf(versionGroup, slot.pokemon, fallbackTypes);
  const primary = TYPE_COLORS[types[0] ?? 'normal'];
  const label = slot.nickname || nameOfPokemon(slot.pokemon, lang);
  const moveCount = slot.moves.filter(Boolean).length;
  const vg = versionGroupById(versionGroup);

  return (
    <motion.div
      layout
      onClick={() => onFocus(slot.id)}
      className={cn(
        'tb-panel tb-slot-drag relative flex min-h-[172px] flex-col overflow-hidden p-2.5 transition-shadow',
        focused && 'border-gold/40 shadow-[0_0_0_1px_rgba(246,201,69,0.25)]',
        !legality.legal && 'border-gold/50',
      )}
      style={{
        background: `linear-gradient(180deg, rgba(${primary.rgb},0.12) 0%, transparent 46%), #11141d`,
      }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* top row: dex num + illegal flag + remove */}
      <div className="flex items-center justify-between gap-1">
        <span className="tb-micro !text-[8px]">{padNum(slot.pokemonId)}</span>
        <div className="flex items-center gap-1">
          {!legality.legal && (
            <span
              className="tb-illegal-flag tb-chip !border-gold/70 !bg-gold/10 !px-1.5 !py-0.5 !text-[7px] !text-gold"
              title={legality.reasons.join(' · ')}
            >
              <AlertTriangle size={9} />
              {t8n('tb.slot.illegalIn', { vg: vg.short })}
            </span>
          )}
          <button
            type="button"
            aria-label={t8n('tb.slot.removeAria', { name: label })}
            onClick={(e) => {
              e.stopPropagation();
              onRemove(slot.id);
            }}
            className="rounded-sm p-0.5 text-tx-muted transition-all hover:rotate-90 hover:text-gold"
          >
            <X size={12} />
          </button>
        </div>
      </div>

      {/* sprite on aura */}
      <div className="relative mx-auto my-0.5 h-[72px] w-[72px]">
        <span
          aria-hidden
          className="absolute inset-[-8px] animate-breathe rounded-full"
          style={{
            background: `radial-gradient(circle at 50% 55%, rgba(${primary.rgb},0.38) 0%, rgba(${primary.rgb},0.12) 42%, transparent 70%)`,
            filter: 'blur(10px)',
          }}
        />
        <Sprite
          id={slot.pokemonId}
          name={nameOfPokemon(slot.pokemon, lang)}
          era={slot.pokemonId <= 649 ? 'gen5' : 'default'}
          className="relative h-full w-full"
        />
      </div>

      {/* name + types */}
      <div className="text-center">
        <div className="truncate font-display text-[12px] font-bold uppercase tracking-wide text-tx-primary" title={label}>
          {label}
        </div>
        <div className="mt-1 flex justify-center gap-1">
          {types.map((t) => (
            <TypeBadge key={t} type={t} className="!gap-1 !px-1.5 !py-0 !text-[8px]" />
          ))}
        </div>
      </div>

      {/* meta row: level + move pips */}
      <div className="mt-2 flex items-center justify-between gap-1">
        <span className="tb-chip !text-[9px]">LV {slot.level}</span>
        <span className="flex items-center gap-1" aria-label={t8n('tb.slot.movesSet', { count: moveCount })}>
          {slot.moves.map((m, i) => (
            <span
              key={i}
              className={cn('h-1.5 w-1.5 rounded-full', m ? 'bg-gold shadow-[0_0_6px_rgba(246,201,69,0.6)]' : 'bg-surface3')}
            />
          ))}
        </span>
      </div>

      {/* actions: VS link + expander toggle */}
      <div className="mt-2 flex items-center justify-between border-t border-hairline pt-1.5">
        <LocaleLink
          to={`/pokemon/${slot.pokemonId}?vs=`}
          onClick={(e) => e.stopPropagation()}
          className="tb-chip !px-1.5 !py-0.5 !text-[8px] transition-all hover:border-gold/60 hover:text-gold"
          aria-label={t8n('tb.slot.compare', { name: label })}
          title={t8n('tb.slot.openVs')}
        >
          <Swords size={9} />
          VS
        </LocaleLink>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpand(slot.id);
          }}
          className="tb-chip !px-1.5 !py-0.5 !text-[8px] transition-all hover:border-gold/60 hover:text-gold"
          aria-expanded={expanded}
          aria-label={t8n('tb.slot.editAria', { name: label })}
        >
          {t8n('tb.slot.edit')}
          <ChevronDown size={9} className={cn('transition-transform duration-200', expanded && 'rotate-180')} />
        </button>
      </div>
    </motion.div>
  );
}
