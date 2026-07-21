/* PokemonPicker — SearchCommand-style add-pokémon autocomplete (local component,
 * does NOT touch the shared SearchCommand). Boots the shared name index. */
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Sprite from '@/components/Sprite';
import TypeBadge from '@/components/TypeBadge';
import { bootNameIndex, getPokemon } from '@/lib/pokeapi';
import { germanAliasOfPokemon, nameOfPokemon, useLanguage } from '@/lib/i18n-data';
import type { DexIndexEntry, PokemonType } from '@/lib/types';
import MiniAutocomplete from './MiniAutocomplete';

interface PokemonPickerProps {
  onPick: (entry: DexIndexEntry) => void;
  autoFocus?: boolean;
  placeholder?: string;
}

/** result row — hydrates its own type badges from the (cached) PokéAPI payload */
function PokemonRow({ entry }: { entry: DexIndexEntry }) {
  const lang = useLanguage();
  const [types, setTypes] = useState<PokemonType[] | null>(null);
  useEffect(() => {
    let alive = true;
    getPokemon(entry.id)
      .then((p) => alive && setTypes(p.types.map((t) => t.type.name as PokemonType)))
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, [entry.id]);
  return (
    <span className="flex w-full items-center gap-2">
      <span className="relative h-8 w-8 shrink-0">
        <Sprite id={entry.id} name={entry.label} era="default" skeleton={false} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[12px] font-semibold text-tx-primary">{nameOfPokemon(entry.id, lang)}</span>
        <span className="tb-micro !text-[8px]">{entry.num}</span>
      </span>
      <span className="flex shrink-0 gap-1">
        {(types ?? []).map((t) => (
          <TypeBadge key={t} type={t} className="!px-1.5 !py-0 !text-[8px]" />
        ))}
      </span>
    </span>
  );
}

export default function PokemonPicker({ onPick, autoFocus = true, placeholder }: PokemonPickerProps) {
  const { t } = useTranslation();
  const [index, setIndex] = useState<DexIndexEntry[]>([]);

  useEffect(() => {
    let alive = true;
    bootNameIndex()
      .then((entries) => alive && setIndex(entries))
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, []);

  return (
    <MiniAutocomplete
      items={index}
      filter={(e, q) =>
        e.label.toLowerCase().includes(q) ||
        e.name.includes(q) ||
        e.num.includes(q) ||
        (germanAliasOfPokemon(e.id)?.toLowerCase().includes(q) ?? false)
      }
      onSelect={onPick}
      keyOf={(e) => String(e.id)}
      placeholder={placeholder ?? t('tb.autocomplete.searchPokemon')}
      autoFocus={autoFocus}
      maxResults={10}
      renderItem={(e) => <PokemonRow entry={e} />}
    />
  );
}
