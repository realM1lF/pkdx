/* Side stack — density-addendum §3 Row 2 (span 5).
 * Abilities (hidden tag + one-line description) · type-matchup chip matrix ·
 * training/breeding mini panel. Three stacked micro-panels. */
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import TypeGlyph from '@/components/TypeGlyph';
import EntityDescModal, { useEntityModal } from '@/components/EntityDescModal';
import { pokemonTypes } from '@/lib/pokeapi';
import { nameOfAbility, nameOfGrowth, nameOfType, useLanguage } from '@/lib/i18n-data';
import type { Pokemon, PokemonSpecies } from '@/lib/types';
import { cn } from '@/lib/utils';
import { computeMatchups, genderLabel, getAbilityShort, speciesExtras, typeRgb } from './data';

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number];

function MiniPanel({
  eyebrow,
  title,
  children,
  className,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn('dx-panel', className)}>
      <header className="flex items-baseline gap-2 border-b border-hairline px-3.5 py-2">
        <span className="pixel-label text-[8px] text-gold">{eyebrow}</span>
        <h3 className="font-display text-[13px] font-bold uppercase tracking-wide text-tx-primary">{title}</h3>
      </header>
      <div className="p-3">{children}</div>
    </section>
  );
}

/* ---------- abilities ---------- */

function AbilityRow({ name, hidden, pokemonId }: { name: string; hidden: boolean; pokemonId: number }) {
  const { t } = useTranslation();
  const lang = useLanguage();
  const entityModal = useEntityModal();
  const [desc, setDesc] = useState<string | null>(null);
  useEffect(() => {
    let on = true;
    getAbilityShort(name, lang)
      .then((d) => on && setDesc(d))
      .catch(() => on && setDesc(''));
    return () => {
      on = false;
    };
  }, [name, pokemonId, lang]);

  return (
    <li className="flex items-start gap-2 border-b border-hairline py-1.5 last:border-0 last:pb-0 first:pt-0">
      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold shadow-[0_0_6px_rgba(246,201,69,0.8)]" aria-hidden />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => entityModal.open('ability', name)}
            title={t('desc.openDesc', { name: nameOfAbility(name, lang) })}
            aria-label={t('desc.openDesc', { name: nameOfAbility(name, lang) })}
            className="font-sans text-[13px] font-semibold text-tx-primary transition-colors hover:text-gold"
          >
            {nameOfAbility(name, lang)}
          </button>
          {hidden && (
            <span className="rounded-pill border border-gold/50 bg-gold-soft px-1.5 font-sans text-[9px] font-bold uppercase text-gold">
              {t('detail.side.hidden')}
            </span>
          )}
        </div>
        {desc == null ? (
          <span className="dx-skel mt-1 block h-3 w-4/5" />
        ) : (
          <p className="truncate font-sans text-[11px] leading-snug text-tx-muted" title={desc}>
            {desc || t('detail.side.noDesc')}
          </p>
        )}
      </div>
      <EntityDescModal {...entityModal.props} />
    </li>
  );
}

/* ---------- matchup chips ---------- */

function MatchupRow({ label, mult, types, tint }: { label: string; mult: string; types: string[]; tint: string }) {
  const { t: t8n } = useTranslation();
  const lang = useLanguage();
  return (
    <div className="flex items-start gap-2 py-1">
      <span className="pixel-label w-14 shrink-0 pt-1 text-[8px]" style={{ color: tint }}>
        {label}
      </span>
      <div className="flex min-w-0 flex-1 flex-wrap gap-1">
        {types.length ? (
          types.map((t) => (
            <span
              key={t}
              data-type={t}
              className="inline-flex h-[22px] items-center gap-1 rounded-pill border px-1.5 font-sans text-[10px] font-bold uppercase"
              style={{
                color: `rgb(${typeRgb(t)})`,
                borderColor: `rgba(${typeRgb(t)},0.4)`,
                background: `rgba(${typeRgb(t)},0.12)`,
              }}
              title={t8n('detail.side.dealsDamage', { type: nameOfType(t, lang), mult })}
            >
              <TypeGlyph type={t} size={11} />
              {nameOfType(t, lang)}
            </span>
          ))
        ) : (
          <span className="font-sans text-[11px] text-tx-muted">—</span>
        )}
      </div>
    </div>
  );
}

/* ---------- training / breeding ---------- */

function KV({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-hairline py-1 last:border-0 last:pb-0 first:pt-0">
      <span className="pixel-label text-[8px] text-tx-muted">{k}</span>
      <span className="text-right font-sans text-[12px] font-semibold text-tx-primary">{v}</span>
    </div>
  );
}

/* ---------- stack ---------- */

export default function SideStack({ pokemon, species }: { pokemon: Pokemon; species: PokemonSpecies | null }) {
  const { t } = useTranslation();
  const lang = useLanguage();
  const matchups = computeMatchups(pokemonTypes(pokemon));
  const extras = speciesExtras(species);
  const growth = extras.growth_rate ? nameOfGrowth(extras.growth_rate.name, lang) : '—';

  return (
    <motion.div
      className="flex h-full flex-col gap-3"
      initial="off"
      whileInView="on"
      viewport={{ once: true, margin: '-10% 0px' }}
      variants={{ on: { transition: { staggerChildren: 0.06 } } }}
    >
      <motion.div variants={{ off: { y: 20, opacity: 0 }, on: { y: 0, opacity: 1 } }} transition={{ duration: 0.35, ease: EASE }}>
        <MiniPanel eyebrow={t('detail.side.traitsEyebrow')} title={t('detail.side.abilitiesTitle')}>
          <ul>
            {pokemon.abilities.map((a) => (
              <AbilityRow key={a.ability.name} name={a.ability.name} hidden={a.is_hidden} pokemonId={pokemon.id} />
            ))}
          </ul>
        </MiniPanel>
      </motion.div>

      <motion.div variants={{ off: { y: 20, opacity: 0 }, on: { y: 0, opacity: 1 } }} transition={{ duration: 0.35, ease: EASE }}>
        <MiniPanel eyebrow={t('detail.side.defenseEyebrow')} title={t('detail.side.matchupsTitle')}>
          <MatchupRow label={t('detail.side.weak')} mult="×2" types={matchups.weak} tint="#FF8A6B" />
          <MatchupRow label={t('detail.side.resist')} mult="×0.5" types={matchups.resist} tint="#63D96B" />
          <MatchupRow label={t('detail.side.immune')} mult="×0" types={matchups.immune} tint="#5E6680" />
        </MiniPanel>
      </motion.div>

      <motion.div variants={{ off: { y: 20, opacity: 0 }, on: { y: 0, opacity: 1 } }} transition={{ duration: 0.35, ease: EASE }}>
        <MiniPanel eyebrow={t('detail.side.trainingEyebrow')} title={t('detail.side.breedingTitle')}>
          <KV k={t('detail.side.growthRate')} v={growth} />
          <KV k={t('detail.side.baseHappiness')} v={extras.base_happiness ?? '—'} />
          <KV k={t('detail.side.gender')} v={genderLabel(extras.gender_rate, lang)} />
          <KV
            k={t('detail.side.eggCycles')}
            v={
              extras.hatch_counter != null
                ? `${extras.hatch_counter} (${t('detail.side.steps', { count: extras.hatch_counter * 257 })})`
                : '—'
            }
          />
        </MiniPanel>
      </motion.div>
    </motion.div>
  );
}
