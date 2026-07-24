/* PokemonSeoGeneric — question-driven SEO sections for the 25 curated
 * Pokémon (SEO rollout part 2), rendered BELOW the detail dashboard.
 *
 * All location/evolution/stat data comes from the build-time PokéAPI
 * snapshot src/data/pokemon-seo.json (slot-summed per area × method,
 * scripts/generate-pokemon-seo.mjs). Weaknesses/resistances are NOT
 * hardcoded — they are computed from the gen 3 type chart via
 * src/lib/versus.ts. Editorial verdicts (Nuzlocke, evolve-timing) are
 * curated i18n strings, labelled as assessments. */
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Map as MapIcon, Shield, Swords, Users } from 'lucide-react';
import { LocaleLink } from '@/lib/locale-link';
import QaSection from '@/components/QaSection';
import { nameOfItem, useLanguage } from '@/lib/i18n-data';
import type { Lang } from '@/lib/i18n-data';
import { effectivenessOf } from '@/lib/versus';
import { typeName } from '@/lib/seo-types';
import { ROUTE_PAGES, routePagePath } from '@/lib/seo-routes-kanto';
import { cn } from '@/lib/utils';
import pokemonSeoJson from '@/data/pokemon-seo.json';

type Frlg = 'firered' | 'leafgreen';

interface LocRow {
  area: string;
  nodeId: string | null;
  nodeDe: string | null;
  nodeEn: string | null;
  method: 'WALK' | 'SURF' | 'FISH' | 'STATIC' | 'OTHER';
  chance: number;
  minLevel: number;
  maxLevel: number;
}

interface EvoStep {
  from: number;
  to: number;
  trigger: string | null;
  minLevel: number | null;
  item: string | null;
  heldItem: string | null;
  minHappiness: number | null;
  timeOfDay: string | null;
  knownMove: string | null;
  location: string | null;
}

interface PokemonSeoEntry {
  slug: string;
  catchRate: number;
  evo: EvoStep[];
  locations: Record<Frlg, LocRow[]>;
}

const DATA = pokemonSeoJson as unknown as {
  ids: number[];
  pokemon: Record<string, PokemonSeoEntry>;
  dex: Record<string, { slug: string; types: string[]; bst: number }>;
  names: Record<string, { de: string; en: string }>;
  evoNames: Record<string, { de: string; en: string }>;
};

export const POKEMON_SEO_IDS: ReadonlySet<number> = new Set(DATA.ids);

const pokeName = (id: number, lang: Lang) => DATA.evoNames[String(id)]?.[lang] ?? `#${id}`;

/* gen-3 type chart only knows these 17 attacking types (no fairy) */
const GEN3_TYPES = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison',
  'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel',
] as const;

/* FRLG ability notes that change the defensive profile (Levitate). */
const ABILITY_NOTE: Record<number, { ability: string; negates: string }> = {
  94: { ability: 'levitate', negates: 'ground' }, // Gengar: Levitate in gen ≤ 6
};

const METHOD_KEY: Record<LocRow['method'], string> = {
  WALK: 'seo.pkmn.methodWalk',
  SURF: 'seo.pkmn.methodSurf',
  FISH: 'seo.pkmn.methodFish',
  STATIC: 'seo.pkmn.methodStatic',
  OTHER: 'seo.pkmn.methodOther',
};

function FrlgToggle({ value, onChange }: { value: Frlg; onChange: (v: Frlg) => void }) {
  const { t } = useTranslation();
  return (
    <div className="flex gap-1" role="group" aria-label={t('seo.pkmn.whereTitle', { name: '' })}>
      {(['firered', 'leafgreen'] as const).map((v) => (
        <button
          key={v}
          type="button"
          aria-pressed={value === v}
          onClick={() => onChange(v)}
          className={cn(
            'pixel-label rounded-pill border px-2.5 py-1 text-[8px] transition-colors',
            value === v ? 'border-gold/60 bg-gold/10 text-gold' : 'border-hairline text-tx-muted hover:text-tx-secondary',
          )}
        >
          {v === 'firered' ? t('seo.pkmn.versionFR') : t('seo.pkmn.versionLG')}
        </button>
      ))}
    </div>
  );
}

const typeList = (types: string[], lang: Lang) => types.map((ty) => typeName(ty, lang)).join(', ');

export default function PokemonSeoGeneric({ id }: { id: number }) {
  const { t } = useTranslation();
  const lang = useLanguage();
  const [version, setVersion] = useState<Frlg>('firered');

  const entry = DATA.pokemon[String(id)];
  const dex = DATA.dex[String(id)];
  const name = pokeName(id, lang);

  /* defensive profile — computed from the gen 3 chart, never hardcoded */
  const matchups = useMemo(() => {
    const types = dex.types;
    const ability = ABILITY_NOTE[id];
    const weak: Array<{ type: string; mult: number }> = [];
    const resist: string[] = [];
    const immune: string[] = [];
    for (const atk of GEN3_TYPES) {
      let mult = effectivenessOf(atk, types, 3);
      if (ability && atk === ability.negates) mult = 0;
      if (mult === 0) immune.push(atk);
      else if (mult >= 2) weak.push({ type: atk, mult });
      else if (mult < 1) resist.push(atk);
    }
    return { weak, resist, immune };
  }, [id, dex]);

  if (!entry || !dex) return null;

  const locations = entry.locations[version] ?? [];
  const frLocations = entry.locations.firered ?? [];

  /* FRLG evolution steps (no day/night cycle in FRLG → time-gated steps out) */
  const evoSteps = entry.evo.filter((s) => !s.timeOfDay);
  const evoSentence = (s: EvoStep) => {
    const from = pokeName(s.from, lang);
    const to = pokeName(s.to, lang);
    if (s.trigger === 'use-item' && s.item)
      return t('seo.pkmn.evoStepStone', { from, to, item: nameOfItem(s.item, lang) });
    if (s.trigger === 'trade') return t('seo.pkmn.evoStepTrade', { from, to });
    if (s.minHappiness) return t('seo.pkmn.evoStepFriendship', { from, to });
    if (s.minLevel) return t('seo.pkmn.evoStepLevel', { from, to, level: s.minLevel });
    return null;
  };
  const evoSentences = evoSteps.map(evoSentence);
  const evoText = [...new Set(evoSentences.filter(Boolean))].join('; ') + (evoSentences.length ? '.' : '');

  /* No wild encounter → WHY: evolution path (direct predecessor step, e.g.
   * Charizard ← Charmeleon at 36) or genuinely event-only (Mew #151). */
  const incomingEvo = evoSteps.filter((s) => s.to === id).map(evoSentence).filter(Boolean).join('; ');
  const whereNoneBody =
    id === 151
      ? t('seo.pkmn.qaWhereBodyEvent', { name })
      : incomingEvo
        ? t('seo.pkmn.qaWhereBodyEvo', { name, path: incomingEvo })
        : t('seo.pkmn.qaWhereBodyNone', { name });

  const weakText = matchups.weak
    .map((w) => `${typeName(w.type, lang)}${w.mult >= 4 ? ' (×4)' : ' (×2)'}`)
    .join(', ');
  const resistText = matchups.resist.map((ty) => typeName(ty, lang)).join(', ');
  const immunePart = matchups.immune.length
    ? t('seo.pkmn.qaWeakImmunePart', { list: typeList(matchups.immune, lang) })
    : '';

  const whereList = frLocations
    .map((l) => `${(lang === 'de' ? l.nodeDe : l.nodeEn) ?? l.area} (${l.chance} %, Lv ${l.minLevel === l.maxLevel ? l.minLevel : `${l.minLevel}–${l.maxLevel}`})`)
    .join(', ');

  const nuzBody = t(`seo.pkmnNuz.${id}`, { defaultValue: '' });
  const timingBody = t(`seo.pkmnTiming.${id}`, { defaultValue: '' });

  const qa: Array<{ q: string; a: React.ReactNode }> = [
    {
      q: t('seo.pkmn.qaWeakQ', { name }),
      a: (
        <p>
          <strong className="font-semibold text-tx-primary">{t('seo.pkmn.qaWeakLead', { weak: weakText })}</strong>{' '}
          {t('seo.pkmn.qaWeakBody', { resist: resistText, immune: immunePart })}
        </p>
      ),
    },
    {
      q: t('seo.pkmn.qaEvoQ', { name }),
      a: evoText ? (
        <p>
          <strong className="font-semibold text-tx-primary">{evoText.split('; ')[0]}.</strong>
          {evoText.includes('; ') ? ` ${evoText.slice(evoText.indexOf('; ') + 2)}` : ''}
        </p>
      ) : (
        <p>
          <strong className="font-semibold text-tx-primary">{t('seo.pkmn.qaEvoLeadNone')}</strong>{' '}
          {t('seo.pkmn.qaEvoBodyNone', { name })}
        </p>
      ),
    },
    {
      q: t('seo.pkmn.qaWhereQ', { name }),
      a: whereList ? (
        <p>
          <strong className="font-semibold text-tx-primary">{t('seo.pkmn.qaWhereLead', { list: whereList })}</strong>{' '}
          {t('seo.pkmn.qaWhereBody', { name })}
        </p>
      ) : (
        <p>
          <strong className="font-semibold text-tx-primary">{t('seo.pkmn.qaWhereLeadNone')}</strong>{' '}
          {whereNoneBody}
        </p>
      ),
    },
  ];
  if (timingBody) {
    qa.push({
      q: t('seo.pkmn.qaTimingQ', { name }),
      a: (
        <p>
          <strong className="font-semibold text-tx-primary">{t('seo.pkmn.qaTimingLead')}</strong> {timingBody}
        </p>
      ),
    });
  }
  if (nuzBody) {
    qa.push({
      q: t('seo.pkmn.qaNuzQ', { name }),
      a: (
        <p>
          <strong className="font-semibold text-tx-primary">{t('seo.pkmn.qaNuzLead')}</strong> {nuzBody}
        </p>
      ),
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {/* where to catch (FRLG) */}
      <section className="rounded-lg border border-hairline bg-surface1">
        <header className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-hairline px-4 py-2.5 sm:px-5">
          <span className="pixel-label shrink-0 text-[9px] text-gold">{t('seo.pkmn.whereEyebrow')}</span>
          <h2 className="font-display text-base font-bold uppercase tracking-wide text-tx-primary">
            {t('seo.pkmn.whereTitle', { name })}
          </h2>
          <div className="ml-auto flex items-center gap-2">
            <FrlgToggle value={version} onChange={setVersion} />
          </div>
        </header>
        {locations.length > 0 ? (
          <>
            <p className="border-b border-hairline/60 px-4 py-2.5 font-sans text-[12px] text-tx-secondary sm:px-5">
              {t('seo.pkmn.whereIntro', { name })}
            </p>
            <div className="flex items-center gap-2 border-b border-hairline px-4 py-2 sm:px-5">
              <span className="pixel-label flex-1 text-[7px] text-tx-muted">{t('seo.pkmn.colLocation')}</span>
              <span className="pixel-label hidden w-[72px] text-[7px] text-tx-muted sm:block">{t('seo.pkmn.colMethod')}</span>
              <span className="pixel-label w-[58px] text-right text-[7px] text-tx-muted">{t('seo.pkmn.colLevel')}</span>
              <span className="pixel-label w-[84px] text-right text-[7px] text-tx-muted">{t('seo.pkmn.colChance')}</span>
            </div>
            {locations.map((loc, i) => {
              const locName = (lang === 'de' ? loc.nodeDe : loc.nodeEn) ?? loc.area;
              const inner = (
                <>
                  <span className="flex-1 truncate text-[13px] font-semibold text-tx-primary transition-colors group-hover:text-gold">
                    {locName}
                  </span>
                  <span className="hidden w-[72px] shrink-0 text-[11px] font-medium text-tx-secondary sm:block">
                    {t(METHOD_KEY[loc.method])}
                  </span>
                  <span className="w-[58px] shrink-0 text-right font-sans text-[11px] tabular-nums text-tx-muted">
                    {loc.minLevel === loc.maxLevel ? `Lv ${loc.minLevel}` : `Lv ${loc.minLevel}–${loc.maxLevel}`}
                  </span>
                  <span className="flex w-[84px] shrink-0 items-center justify-end gap-1.5">
                    <span className="font-display text-[13px] font-bold tabular-nums text-tx-primary">{loc.chance}%</span>
                    <span className="h-[3px] w-10 overflow-hidden rounded-pill bg-surface3">
                      <span className="block h-full rounded-pill bg-gold" style={{ width: `${Math.min(100, loc.chance)}%` }} />
                    </span>
                  </span>
                </>
              );
              const rowClass =
                'group flex h-11 items-center gap-2 border-b border-hairline/60 px-4 last:border-b-0 sm:px-5';
              return loc.nodeId && ROUTE_PAGES.has(loc.nodeId) ? (
                <LocaleLink key={`${loc.area}-${loc.method}-${i}`} to={routePagePath(lang, loc.nodeId)} className={cn(rowClass, 'transition-colors hover:bg-surface2')}>
                  {inner}
                </LocaleLink>
              ) : (
                <div key={`${loc.area}-${loc.method}-${i}`} className={rowClass}>
                  {inner}
                </div>
              );
            })}
          </>
        ) : (
          <p className="px-4 py-3 font-sans text-[12px] text-tx-secondary sm:px-5">{whereNoneBody}</p>
        )}
        <p className="px-4 py-2.5 text-[11px] font-medium text-tx-muted sm:px-5">
          {t('seo.pkmn.whereNote')}{' '}
          <LocaleLink to="/maps" className="text-gold underline-offset-2 transition-colors hover:underline">
            {t('seo.pkmn.whereNoteLink')}
          </LocaleLink>
          .
        </p>
      </section>

      {/* weaknesses / resistances — computed from the gen 3 chart */}
      <section className="rounded-lg border border-hairline bg-surface1">
        <header className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-hairline px-4 py-2.5 sm:px-5">
          <span className="pixel-label shrink-0 text-[9px] text-gold">{t('seo.pkmn.weakEyebrow')}</span>
          <h2 className="font-display text-base font-bold uppercase tracking-wide text-tx-primary">
            {t('seo.pkmn.weakTitle')}
          </h2>
          <span className="ml-auto grid h-7 w-7 place-items-center rounded-md border border-gold/30 bg-gold-soft text-gold">
            <Shield size={13} strokeWidth={1.75} />
          </span>
        </header>
        <p className="border-b border-hairline/60 px-4 py-2.5 font-sans text-[12px] text-tx-secondary sm:px-5">
          {t('seo.pkmn.weakIntro', { name, types: typeList(dex.types, lang) })}
        </p>
        <div className="grid gap-3 px-4 py-3 sm:grid-cols-3 sm:px-5">
          <div>
            <p className="pixel-label mb-1.5 text-[7px] text-red-400">{t('seo.pkmn.weakCol')}</p>
            <p className="text-[12px] font-medium text-tx-primary">{weakText || '—'}</p>
          </div>
          <div>
            <p className="pixel-label mb-1.5 text-[7px] text-tx-muted">{t('seo.pkmn.resistCol')}</p>
            <p className="text-[12px] font-medium text-tx-primary">{resistText || '—'}</p>
          </div>
          <div>
            <p className="pixel-label mb-1.5 text-[7px] text-gold">{t('seo.pkmn.immuneCol')}</p>
            <p className="text-[12px] font-medium text-tx-primary">
              {matchups.immune.length ? typeList(matchups.immune, lang) : '—'}
            </p>
          </div>
        </div>
      </section>

      {/* deep links: versus prefilled, team builder, maps */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="pixel-label mr-1 text-[8px] text-tx-muted">{t('seo.pkmn.deepLinksEyebrow')}</span>
        <LocaleLink
          to={`/versus?you=${id}`}
          className="inline-flex h-8 items-center gap-1.5 rounded-md border border-gold/50 px-3 text-[11px] font-semibold text-gold transition-colors hover:bg-gold/10"
        >
          <Swords size={12} />
          {t('seo.pkmn.versusCta', { name })}
        </LocaleLink>
        <LocaleLink
          to="/team"
          className="inline-flex h-8 items-center gap-1.5 rounded-md border border-hairline2 px-3 text-[11px] font-semibold text-tx-secondary transition-colors hover:bg-surface3 hover:text-gold"
        >
          <Users size={12} />
          {t('seo.pkmn.teamCta')}
        </LocaleLink>
        <LocaleLink
          to="/maps/kanto"
          className="inline-flex h-8 items-center gap-1.5 rounded-md border border-hairline2 px-3 text-[11px] font-semibold text-tx-secondary transition-colors hover:bg-surface3 hover:text-gold"
        >
          <MapIcon size={12} />
          {t('seo.pkmn.mapsCta')}
        </LocaleLink>
      </div>

      {/* Q&A */}
      <QaSection defaultOpen={1} items={qa} />
    </div>
  );
}
