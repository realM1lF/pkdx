/* Combat panel — density-addendum §3 Row 1 (span 5).
 * StatBars (5 in Gen 1, 6 from Gen 2) + BARS/RADAR + BST ring. */
import { useTranslation } from 'react-i18next';
import StatLabelTip from '@/components/StatLabelTip';
import { nameOfPokemon, useLanguage } from '@/lib/i18n-data';
import type { GenStatBlock } from '@/lib/gen-dex';
import { genHasMechanics, statLabelForGen, statsFromPokemon } from '@/lib/gen-dex';
import type { Pokemon, PokemonType, StatKey } from '@/lib/types';
import CombatStatViz from './CombatStatViz';

export default function CombatPanel({
  pokemon,
  legendary = false,
  stats,
  types: typesProp,
  gen = 9,
  vgId,
}: {
  pokemon: Pokemon;
  legendary?: boolean;
  stats?: GenStatBlock;
  types?: PokemonType[];
  gen?: number;
  vgId?: string;
}) {
  const { t } = useTranslation();
  const lang = useLanguage();
  const speciesName = nameOfPokemon(pokemon.name, lang);
  const types = typesProp ?? (pokemon.types.map((row) => row.type.name) as PokemonType[]);
  const block = stats ?? statsFromPokemon(pokemon);
  const showEvs = vgId ? genHasMechanics(vgId).evs : gen >= 3;
  const evChips = showEvs
    ? pokemon.stats
        .filter((s) => s.effort > 0)
        .map((s) => `+${s.effort} ${statLabelForGen(s.stat.name as StatKey, gen)}`)
    : [];

  return (
    <div className="flex h-full flex-col gap-3 p-4 md:p-5">
      <CombatStatViz
        id={pokemon.id}
        block={block}
        types={types}
        gen={gen}
        legendary={legendary}
        footer={
          <div className="flex flex-col items-end gap-1">
            <StatLabelTip
              label={t('detail.combat.evYield')}
              tip={t('detail.combat.evYieldTip', { name: speciesName })}
              className="pixel-label text-[8px] text-tx-muted"
            />
            <div className="flex gap-1">
              {evChips.length ? (
                evChips.map((c) => (
                  <span
                    key={c}
                    className="rounded-pill border border-hairline bg-surface2 px-1.5 py-px font-sans text-[11px] leading-none font-semibold text-tx-secondary"
                  >
                    {c}
                  </span>
                ))
              ) : (
                <span className="font-sans text-micro11 text-tx-muted">—</span>
              )}
            </div>
          </div>
        }
      />
    </div>
  );
}
