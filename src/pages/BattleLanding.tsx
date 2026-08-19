/* BattleLanding — SEO landing page for the 1:1 battle simulator
 * (/de/kampf-simulator · /en/battle-simulator).
 *
 * All copy sections render in the initial HTML (prerender, AGENTS.md §8);
 * the embedded arena reuses the Versus machinery (pickers, SideCard, field
 * controls) and lazy-loads BattleView/@pkmn/sim only on demand — no sim code
 * in the main bundle. */
import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router';
import { ArrowRight, Swords } from 'lucide-react';
import HonestyHint from '@/components/HonestyHint';
import GameSelect from '@/components/GameSelect';
import PokeballLoader from '@/components/PokeballLoader';
import QaSection from '@/components/QaSection';
import { LocaleLink } from '@/lib/locale-link';
import { nameOfPokemon, useLanguage } from '@/lib/i18n-data';
import { versionGroupById } from '@/lib/teambuilder';
import {
  defaultVersusContext,
  versusContextFromGame,
  versusGameOptions,
  type VersusContext,
  type VersusField,
} from '@/lib/versus-context';
import type { MovesetSource } from '@/lib/versus';
import type { Pokemon } from '@/lib/types';
import VersusFieldControls, { defaultVersusField, fieldForContext } from './detail/VersusFieldControls';
import {
  blankSide,
  OpponentAutocomplete,
  prefetchSlugs,
  resolveDefaultSet,
  sidePaddedWild,
  SideCard,
  useDexIndex,
  useMoveDetails,
  usePokemonById,
  type SideState,
} from './detail/VersusPanel';
import { Panel } from './detail/ui';
import './detail/versus.css';

/* lazy battle arena — keeps @pkmn/sim out of the route chunk (async chunk) */
const BattleView = lazy(() => import('./detail/BattleView'));

/* default matchup: Glurak vs Turtok (Charizard vs Blastoise), level 50.
 * ?a=<dex>&b=<dex> preselects both sides (matchup-page replay CTA). */
const DEFAULT_YOU_ID = 6;
const DEFAULT_FOE_ID = 9;
const DEFAULT_LEVEL = 50;
const MAX_DEX = 1025;

function dexParam(value: string | null): number | null {
  const n = Number(value);
  return Number.isInteger(n) && n >= 1 && n <= MAX_DEX ? n : null;
}

interface TextPair {
  title: string;
  body: string;
}

interface QaRaw {
  q: string;
  a: string;
}

/* ================================================================== */
/* standalone arena — two pickers + side config + lazy BattleView      */
/* ================================================================== */

function BattleArena() {
  const { t } = useTranslation();
  const lang = useLanguage();
  const index = useDexIndex();

  const [ctx, setCtx] = useState<VersusContext>(() => defaultVersusContext());
  const [field, setField] = useState<VersusField>(() => defaultVersusField());
  useEffect(() => {
    setField((prev) => fieldForContext(prev, ctx));
  }, [ctx.versionGroup]);

  /* ----- side selection (defaults: two popular fighters, ready to start;
   *       ?a=/?b= preselect from the matchup-page replay CTA) ----- */
  const [searchParams] = useSearchParams();
  const [youId, setYouId] = useState<number>(() => dexParam(searchParams.get('a')) ?? DEFAULT_YOU_ID);
  const [foeId, setFoeId] = useState<number>(() => dexParam(searchParams.get('b')) ?? DEFAULT_FOE_ID);
  const { pokemon: youPokemon, status: youStatus } = usePokemonById(youId);
  const { pokemon: foePokemon, status: foeStatus } = usePokemonById(foeId);

  /* ----- side states (same SideState model as the Versus lab) ----- */
  const [you, setYou] = useState<SideState>(() => blankSide(DEFAULT_LEVEL));
  const [foe, setFoe] = useState<SideState>(() => blankSide(DEFAULT_LEVEL));
  const [youCustom, setYouCustom] = useState(false);
  const [foeCustom, setFoeCustom] = useState(false);
  const [youSource, setYouSource] = useState<MovesetSource>('wild');
  const [foeSource, setFoeSource] = useState<MovesetSource>('wild');

  /* move details for both pools (slots + level-up candidates) */
  const wanted = useMemo(
    () => [...prefetchSlugs(youPokemon, you.slots, ctx), ...prefetchSlugs(foePokemon, foe.slots, ctx)],
    [youPokemon, foePokemon, you.slots, foe.slots, ctx],
  );
  const details = useMoveDetails(wanted);

  /* default sets: recompute while the user hasn't customized slots */
  useEffect(() => {
    if (youCustom || !youPokemon) return;
    const def = resolveDefaultSet(youPokemon, you.level, details, ctx);
    if (def.moves.length) {
      setYou((s) => ({ ...s, slots: def.moves }));
      setYouSource(def.source);
    }
  }, [youPokemon, you.level, details, youCustom, ctx]);

  useEffect(() => {
    if (foeCustom || !foePokemon) return;
    const def = resolveDefaultSet(foePokemon, foe.level, details, ctx);
    if (def.moves.length) {
      setFoe((s) => ({ ...s, slots: def.moves }));
      setFoeSource(def.source);
    }
  }, [foePokemon, foe.level, details, foeCustom, ctx]);

  /* reset a side when its Pokémon changes (derived-state-during-render) */
  const [prevYouId, setPrevYouId] = useState(youId);
  if (prevYouId !== youId) {
    setPrevYouId(youId);
    if (!youCustom) {
      setYou(blankSide(DEFAULT_LEVEL));
      setYouSource('wild');
    }
  }
  const [prevFoeId, setPrevFoeId] = useState(foeId);
  if (prevFoeId !== foeId) {
    setPrevFoeId(foeId);
    if (!foeCustom) {
      setFoe(blankSide(DEFAULT_LEVEL));
      setFoeSource('wild');
    }
  }

  /* ----- game picker ----- */
  const pickGame = (game: string) => {
    setCtx(game ? versusContextFromGame(game, null) : defaultVersusContext());
  };
  const gameOptions = useMemo(
    () =>
      versusGameOptions().map((o) => ({
        id: o.game,
        label: t(`versus.games.${o.game}`, { defaultValue: o.label }),
        short: versionGroupById(o.versionGroup).short,
        gen: o.gen,
      })),
    [t],
  );

  /* ----- 1:1 micro-battle (lazy arena, takes over the current setup) ----- */
  const [battleOpen, setBattleOpen] = useState(false);
  const arenaRef = useRef<HTMLDivElement>(null);

  /* mobile: the arena mounts below the fold — bring it into view */
  useEffect(() => {
    if (!battleOpen) return;
    const timer = window.setTimeout(() => {
      arenaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
    return () => window.clearTimeout(timer);
  }, [battleOpen]);

  const battleInputOf = useCallback(
    (pokemon: Pokemon, side: SideState) => {
      const chosen = side.slots.filter(Boolean);
      return {
        pokemonId: pokemon.id,
        displayName: nameOfPokemon(pokemon.id, lang),
        setup: {
          species: pokemon.name,
          level: side.level,
          // same defaults the versus view resolves when slots are empty
          moves: chosen.length ? chosen : resolveDefaultSet(pokemon, side.level, details, ctx).moves,
          item: side.item ?? null,
          ability: side.ability ?? null,
          nature: side.nature ?? null,
          evs: side.evs,
          status: side.status && side.status !== 'none' ? side.status : null,
        },
      };
    },
    [lang, details, ctx],
  );

  const battleYou = useMemo(
    () => (youPokemon ? battleInputOf(youPokemon, you) : null),
    [youPokemon, you, battleInputOf],
  );
  const battleFoe = useMemo(
    () => (foePokemon ? battleInputOf(foePokemon, foe) : null),
    [foePokemon, foe, battleInputOf],
  );

  const sideLoading = (
    <div className="flex min-h-[9.375rem] flex-1 items-center justify-center p-6">
      <PokeballLoader variant="inline" />
    </div>
  );
  const sideError = (
    <div className="flex min-h-[9.375rem] flex-1 items-center justify-center p-6">
      <p className="font-sans text-micro12 text-gold">{t('versus.errorUnavailable')}</p>
    </div>
  );

  return (
    <div className="grid grid-cols-12 gap-4">
      {/* ---------- toolbar: game + field + start ---------- */}
      <div className="col-span-12 flex flex-wrap items-center gap-2 rounded-lg border border-hairline bg-surface1/60 px-3 py-2">
        <div className="flex min-w-0 flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <span className="pixel-label text-[8px] text-tx-muted">{t('versus.gameSelect')}</span>
            <GameSelect
              value={ctx.game ?? ''}
              onChange={pickGame}
              options={gameOptions}
              ariaLabel={t('versus.gameSelect')}
              defaultOption={{ id: '', label: t('versus.gameDefault'), short: 'SV', gen: 9 }}
            />
          </div>
          <HonestyHint show={!ctx.game && ctx.versionGroup === defaultVersusContext().versionGroup}>
            {t('honesty.defaultEdition')}
          </HonestyHint>
        </div>
        <VersusFieldControls ctx={ctx} field={field} onChange={setField} />
        <button
          type="button"
          onClick={() => setBattleOpen(true)}
          disabled={!youPokemon || !foePokemon || battleOpen}
          title={!youPokemon || !foePokemon ? t('versus.battle.startHint') : battleOpen ? t('versus.battle.runningHint') : undefined}
          className="inline-flex h-6 items-center gap-1 rounded-pill border border-gold bg-gold px-2.5 font-sans text-[14px] leading-none font-bold uppercase text-abyss transition-all hover:shadow-[0_0_14px_rgba(246,201,69,0.45)] disabled:cursor-not-allowed disabled:opacity-40 sm:ml-auto"
        >
          <Swords size={10} />
          {t('versus.battle.startButton')}
        </button>
      </div>

      {/* ---------- your side ---------- */}
      <Panel
        eyebrow={t('versus.you')}
        title={youPokemon ? nameOfPokemon(youPokemon.id, lang) : t('versus.pickYou')}
        className="col-span-12 lg:col-span-5"
        bodyClassName="min-h-[9.375rem] flex flex-col"
        right={
          <div className="w-36">
            <OpponentAutocomplete
              index={index}
              excludeId={foeId}
              onPick={(id) => setYouId(id)}
              placeholder={t('versus.pickYouPlaceholder')}
            />
          </div>
        }
      >
        {youStatus === 'loading' && sideLoading}
        {youStatus === 'error' && sideError}
        {youStatus === 'ready' && youPokemon && (
          <SideCard
            pokemon={youPokemon}
            side={you}
            onSide={(patch) => setYou((s) => ({ ...s, ...patch }))}
            slotsSource={youSource}
            details={details}
            versionGroup={ctx.versionGroup}
            gen={ctx.gen}
            showStatus
            onSlotsChange={(slots) => {
              setYouCustom(true);
              setYouSource('custom');
              setYou((s) => ({ ...s, slots }));
            }}
            onSlotsReset={() => setYouCustom(false)}
            showPaddedWild={sidePaddedWild(youPokemon, you.level, ctx.versionGroup, youSource, you.slots)}
          />
        )}
      </Panel>

      {/* VS mark */}
      <div className="col-span-12 flex items-center justify-center lg:col-span-2">
        <div className="flex flex-col items-center gap-1">
          <span
            className="font-display text-[2.125rem] font-black leading-none text-gold"
            style={{ textShadow: '0 0 24px rgba(246,201,69,0.45)' }}
          >
            VS
          </span>
          <Swords size={14} className="text-gold/70" />
        </div>
      </div>

      {/* ---------- foe side ---------- */}
      <Panel
        eyebrow={t('versus.foe')}
        title={foePokemon ? nameOfPokemon(foePokemon.id, lang) : t('versus.pickOpponent')}
        className="col-span-12 lg:col-span-5"
        bodyClassName="min-h-[9.375rem] flex flex-col"
        right={
          <div className="w-36">
            <OpponentAutocomplete
              index={index}
              excludeId={youId}
              onPick={(id) => setFoeId(id)}
            />
          </div>
        }
      >
        {foeStatus === 'loading' && sideLoading}
        {foeStatus === 'error' && sideError}
        {foeStatus === 'ready' && foePokemon && (
          <SideCard
            pokemon={foePokemon}
            side={foe}
            onSide={(patch) => setFoe((s) => ({ ...s, ...patch }))}
            slotsSource={foeSource}
            details={details}
            versionGroup={ctx.versionGroup}
            gen={ctx.gen}
            showStatus
            onSlotsChange={(slots) => {
              setFoeCustom(true);
              setFoeSource('custom');
              setFoe((s) => ({ ...s, slots }));
            }}
            onSlotsReset={() => setFoeCustom(false)}
            showPaddedWild={sidePaddedWild(foePokemon, foe.level, ctx.versionGroup, foeSource, foe.slots)}
          />
        )}
      </Panel>

      {/* ---------- 1:1 battle arena (lazy — engine loads on demand) ---------- */}
      {battleOpen && battleYou && battleFoe && (
        <div ref={arenaRef} className="col-span-12 scroll-mt-24">
          <Suspense
            fallback={
              <div className="dx-panel flex items-center justify-center p-8">
                <PokeballLoader variant="inline" />
              </div>
            }
          >
            <BattleView
              player={battleYou}
              foe={battleFoe}
              ctx={ctx}
              field={fieldForContext(field, ctx)}
              onExit={() => setBattleOpen(false)}
            />
          </Suspense>
        </div>
      )}
    </div>
  );
}

/* ================================================================== */
/* copy section chrome (Holo-Dex: pixel-label eyebrow + display H2)    */
/* ================================================================== */

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <header className="mb-4">
      <p className="pixel-label text-[9px] text-gold">{eyebrow}</p>
      <h2 className="mt-1 font-display text-lg font-bold tracking-wide text-tx-primary md:text-xl">
        {title}
      </h2>
    </header>
  );
}

/* ================================================================== */
/* the page                                                            */
/* ================================================================== */

export default function BattleLanding() {
  const { t } = useTranslation();
  const steps = t('battleLanding.howSteps', { returnObjects: true }) as TextPair[];
  const usecases = t('battleLanding.usecases', { returnObjects: true }) as TextPair[];
  const qa = t('battleLanding.qa', { returnObjects: true }) as QaRaw[];

  return (
    <div className="mx-auto max-w-content px-4 pb-20 pt-6 md:px-8">
      {/* ---------- H1 + intro ---------- */}
      <header className="mb-6">
        <p className="pixel-label text-[9px] text-gold">{t('battleLanding.eyebrow')}</p>
        <h1 className="mt-1 font-display text-2xl font-extrabold tracking-wide text-tx-primary md:text-3xl">
          {t('battleLanding.h1')}
        </h1>
        <p className="mt-2 max-w-2xl font-sans text-[0.8438rem] leading-relaxed text-tx-secondary">
          {t('battleLanding.intro')}
        </p>
      </header>

      {/* ---------- embedded battle (standalone, preconfigured) ---------- */}
      <section id="arena" aria-label={t('battleLanding.arenaTitle')} className="scroll-mt-24">
        <SectionHeader eyebrow={t('battleLanding.arenaEyebrow')} title={t('battleLanding.arenaTitle')} />
        <BattleArena />
      </section>

      {/* ---------- how it works ---------- */}
      <section className="mx-auto mt-12 max-w-3xl">
        <SectionHeader eyebrow={t('battleLanding.howEyebrow')} title={t('battleLanding.howTitle')} />
        <ol className="grid gap-3 sm:grid-cols-2">
          {steps.map((step, i) => (
            <li key={i} className="rounded-lg border border-hairline bg-surface1 px-4 py-3.5">
              <p className="flex items-baseline gap-2">
                <span className="pixel-label shrink-0 text-[8px] text-gold">{String(i + 1).padStart(2, '0')}</span>
                <span className="font-display text-micro13 font-bold tracking-wide text-tx-primary">
                  {step.title}
                </span>
              </p>
              <p className="mt-1.5 font-sans text-[0.7813rem] leading-relaxed text-tx-secondary">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- real battle mechanics ---------- */}
      <section className="mx-auto mt-12 max-w-3xl">
        <div className="rounded-lg border border-hairline bg-surface1 px-4 py-5 sm:px-6">
          <SectionHeader eyebrow={t('battleLanding.mechanicsEyebrow')} title={t('battleLanding.mechanicsTitle')} />
          <p className="font-sans text-[0.8438rem] leading-relaxed text-tx-secondary">
            {t('battleLanding.mechanicsBody')}
          </p>
        </div>
      </section>

      {/* ---------- use cases ---------- */}
      <section className="mx-auto mt-12 max-w-3xl">
        <SectionHeader eyebrow={t('battleLanding.usecasesEyebrow')} title={t('battleLanding.usecasesTitle')} />
        <div className="grid gap-3 sm:grid-cols-3">
          {usecases.map((uc, i) => (
            <div key={i} className="rounded-lg border border-hairline bg-surface1 px-4 py-3.5">
              <p className="font-display text-micro13 font-bold tracking-wide text-tx-primary">
                {uc.title}
              </p>
              <p className="mt-1.5 font-sans text-[0.7813rem] leading-relaxed text-tx-secondary">{uc.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Q&A ---------- */}
      <div className="mx-auto mt-12 max-w-3xl">
        <QaSection
          defaultOpen={1}
          items={qa.map((item) => ({
            q: item.q,
            a: <p>{item.a}</p>,
          }))}
        />
      </div>

      {/* ---------- CTA ---------- */}
      <section className="mx-auto mt-12 max-w-3xl">
        <div className="flex flex-col items-center gap-3 rounded-lg border border-gold/30 bg-gold/5 px-4 py-8 text-center">
          <p className="max-w-xl font-display text-base font-bold tracking-wide text-tx-primary md:text-lg">
            {t('battleLanding.ctaTitle')}
          </p>
          <a
            href="#arena"
            className="inline-flex h-8 items-center gap-1.5 rounded-pill border border-gold bg-gold px-4 font-display text-[11px] leading-none font-extrabold tracking-wider text-abyss transition-all hover:shadow-[0_0_18px_rgba(246,201,69,0.45)]"
          >
            <Swords size={11} />
            {t('battleLanding.ctaButton')}
          </a>
        </div>
      </section>

      {/* ---------- cross-links: Versus + Team Builder ---------- */}
      <section className="mx-auto mt-12 max-w-3xl">
        <div className="mb-4 flex items-center gap-3">
          <span className="h-px flex-1 bg-hairline" aria-hidden />
          <span className="pixel-label text-[9px] text-gold">{t('battleLanding.linksEyebrow')}</span>
          <span className="h-px flex-1 bg-hairline" aria-hidden />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-hairline bg-surface1 px-4 py-3.5">
            <LocaleLink
              to="/versus"
              className="inline-flex items-center gap-1.5 font-display text-micro13 font-bold tracking-wide text-gold transition-colors hover:text-tx-primary"
            >
              {t('battleLanding.linksVersusLabel')}
              <ArrowRight size={11} />
            </LocaleLink>
            <p className="mt-1.5 font-sans text-[0.7813rem] leading-relaxed text-tx-secondary">
              {t('battleLanding.linksVersusText')}
            </p>
          </div>
          <div className="rounded-lg border border-hairline bg-surface1 px-4 py-3.5">
            <LocaleLink
              to="/team"
              className="inline-flex items-center gap-1.5 font-display text-micro13 font-bold tracking-wide text-gold transition-colors hover:text-tx-primary"
            >
              {t('battleLanding.linksTeamLabel')}
              <ArrowRight size={11} />
            </LocaleLink>
            <p className="mt-1.5 font-sans text-[0.7813rem] leading-relaxed text-tx-secondary">
              {t('battleLanding.linksTeamText')}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
