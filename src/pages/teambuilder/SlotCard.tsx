/* SlotCard — one of the 6 team slots (team-builder.md "6 Slots als Karten-Reihe").
 * Empty → "+" autocomplete add · Filled → sprite aura, types, level,
 * item/ability line, 4 move chips with type dots, VS link, duplicate/remove.
 * Gold ILLEGAL flag (never red). */
import { useState } from 'react';
import type { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { AlertTriangle, ChevronDown, Copy, Plus, Sparkles, Swords, X } from 'lucide-react';
import Sprite from '@/components/Sprite';
import TypeBadge from '@/components/TypeBadge';
import { padNum } from '@/lib/pokeapi';
import { nameOfAbility, nameOfItem, nameOfMove, nameOfPokemon, useLanguage } from '@/lib/i18n-data';
import { LocaleLink } from '@/lib/locale-link';
import { genTypesOf, legalityReasonText, versionGroupById } from '@/lib/teambuilder';
import type { SlotLegality, TeamSlot } from '@/lib/teambuilder';
import type { Move, Pokemon } from '@/lib/types';
import { TYPE_COLORS } from '@/lib/types';
import type { PokemonType } from '@/lib/types';
import { cn } from '@/lib/utils';
import PokemonPicker from './PokemonPicker';

/** 'Swords Dance' → 'swords-dance' (items/abilities are stored as EN display names) */
function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

interface SlotCardProps {
  slot: TeamSlot;
  index: number;
  pokemon: Pokemon | undefined;
  legality: SlotLegality;
  versionGroup: string;
  versusOpponentId?: number | null;
  moveDetails: Record<string, Move>;
  canDuplicate: boolean;
  expanded: boolean;
  focused: boolean;
  onPick: (slotId: string, pokemonSlug: string, pokemonId: number) => void;
  onRemove: (slotId: string) => void;
  onDuplicate: (slotId: string) => void;
  onToggleExpand: (slotId: string) => void;
  onFocus: (slotId: string) => void;
}

export default function SlotCard({
  slot,
  index,
  pokemon,
  legality,
  versionGroup,
  versusOpponentId,
  moveDetails,
  canDuplicate,
  expanded,
  focused,
  onPick,
  onRemove,
  onDuplicate,
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
      {/* top row: dex num + illegal flag + duplicate/remove */}
      <div className="flex items-center justify-between gap-1">
        <span className="tb-micro !text-[8px]">{padNum(slot.pokemonId)}</span>
        <div className="flex items-center gap-0.5">
          {!legality.legal && (
            <span
              className="tb-illegal-flag tb-chip !border-gold/70 !bg-gold/10 !px-1.5 !py-0.5 !text-[7px] !text-gold"
              title={legality.reasons.map((r) => legalityReasonText(r, lang)).join(' · ')}
            >
              <AlertTriangle size={9} />
              {t8n('tb.slot.illegalIn', { vg: vg.short })}
            </span>
          )}
          <button
            type="button"
            aria-label={t8n('tb.slot.duplicateAria', { name: label })}
            title={t8n('tb.slot.duplicate')}
            disabled={!canDuplicate}
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate(slot.id);
            }}
            className="rounded-sm p-0.5 text-tx-muted transition-all hover:text-gold disabled:cursor-not-allowed disabled:opacity-30"
          >
            <Copy size={12} />
          </button>
          <button
            type="button"
            aria-label={t8n('tb.slot.removeAria', { name: label })}
            title={t8n('tb.slot.remove')}
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
      <div className="relative mx-auto my-0.5 h-[64px] w-[64px]">
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
          shiny={slot.shiny}
          className="relative h-full w-full"
        />
        {slot.shiny && (
          <span
            className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full border border-gold/60 bg-void text-gold shadow-[0_0_8px_rgba(246,201,69,0.5)]"
            title={t8n('tb.slot.shiny')}
          >
            <Sparkles size={9} />
          </span>
        )}
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

      {/* item · ability (one glance, micro rows) */}
      <div className="mt-1.5 space-y-0.5 text-[8px] leading-tight">
        <div className="flex items-baseline justify-between gap-1.5">
          <span className="tb-micro shrink-0 !text-[6.5px]">{t8n('tb.item')}</span>
          <span className={cn('truncate font-semibold', slot.item ? 'text-tx-secondary' : 'text-tx-muted/50')}>
            {slot.item ? nameOfItem(slugify(slot.item), lang) : '—'}
          </span>
        </div>
        <div className="flex items-baseline justify-between gap-1.5">
          <span className="tb-micro shrink-0 !text-[6.5px]">{t8n('tb.ability')}</span>
          <span className={cn('truncate font-semibold', slot.ability ? 'text-tx-secondary' : 'text-tx-muted/50')}>
            {slot.ability ? nameOfAbility(slugify(slot.ability), lang) : '—'}
          </span>
        </div>
      </div>

      {/* 4 moves as type-dotted chips */}
      <div className="mb-1.5 mt-1.5 grid grid-cols-2 gap-1">
        {slot.moves.map((m, i) => {
          const mvType = m ? (moveDetails[m]?.type.name as PokemonType | undefined) : undefined;
          const color = mvType ? TYPE_COLORS[mvType] : null;
          return (
            <span
              key={i}
              className={cn(
                'flex h-[16px] min-w-0 items-center gap-1 rounded-[5px] border px-1 text-[7.5px] font-semibold',
                m ? 'border-hairline bg-surface2 text-tx-secondary' : 'border-hairline/50 text-tx-muted/40',
              )}
              style={color ? ({ '--t': color.rgb } as CSSProperties) : undefined}
              title={m ? nameOfMove(m, lang) : undefined}
            >
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full"
                style={
                  color
                    ? { background: `rgb(${color.rgb})`, boxShadow: `0 0 4px rgba(${color.rgb},0.7)` }
                    : { background: m ? '#F6C945' : '#2a3040' }
                }
              />
              <span className="truncate">{m ? nameOfMove(m, lang) : '—'}</span>
            </span>
          );
        })}
      </div>

      {/* actions: level + VS link + expander toggle */}
      <div className="mt-auto flex items-center justify-between gap-1 border-t border-hairline pt-1.5">
        <span className="tb-chip !text-[9px]">LV {slot.level}</span>
        <div className="flex items-center gap-1">
          <LocaleLink
            to={`/pokemon/${slot.pokemonId}?vs=${versusOpponentId ?? ''}`}
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
      </div>
    </motion.div>
  );
}
