/* MatchupPage — curated pairing page with REAL simulation results
 * (/de/versus/<a>-gegen-<b> · /en/versus/<a>-vs-<b>).
 *
 * Every number comes from src/data/matchups.json (100 seeded engine battles
 * per pairing, scripts/simulate-matchups.mjs) — the page adds no new math,
 * only rule-based sentences whose values are all read from the snapshot.
 * Fully prerender-safe: no fetches, no hooks beyond i18n/routing. */
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { ArrowRight, Gauge, Swords, Timer } from 'lucide-react';
import QaSection from '@/components/QaSection';
import Sprite from '@/components/Sprite';
import TypeBadge from '@/components/TypeBadge';
import { LocaleLink } from '@/lib/locale-link';
import { nameOfMove, useLanguage } from '@/lib/i18n-data';
import type { Lang } from '@/lib/i18n-data';
import {
  MATCHUPS,
  MATCHUPS_META,
  matchupNames,
  matchupRest,
  resolveMatchupParam,
  type MatchupEntry,
  type MatchupKeyMove,
} from '@/lib/seo-matchups';
import { battleLandingPath } from '@/lib/seo';
import { EFF_LABEL } from '@/lib/versus';
import type { PokemonType } from '@/lib/types';
import { cn } from '@/lib/utils';

/* ---------- rule-based analysis (every value from the snapshot) ---------- */

function bestMove(moves: MatchupKeyMove[]): MatchupKeyMove | null {
  return moves.length ? moves[0] : null;
}

/* ================================================================== */

function WinBar({ m, lang }: { m: MatchupEntry; lang: Lang }) {
  const { a, b } = matchupNames(m, lang);
  const total = m.winsA + m.winsB + m.ties;
  const pctA = Math.round((m.winsA / total) * 100);
  const pctB = Math.round((m.winsB / total) * 100);
  return (
    <div>
      <div className="flex h-7 overflow-hidden rounded-md border border-hairline" role="img"
        aria-label={`${a} ${pctA}% · ${b} ${pctB}%`}>
        <div className="flex items-center justify-start bg-gold/85 pl-2 font-display text-micro11 font-extrabold text-abyss"
          style={{ width: `${Math.max(pctA, 6)}%` }}>
          {pctA}%
        </div>
        <div className="flex flex-1 items-center justify-end bg-type-water/70 pr-2 font-display text-micro11 font-extrabold text-abyss"
          style={pctB === 0 ? { display: 'none' } : undefined}>
          {pctB}%
        </div>
      </div>
      <div className="mt-1 flex justify-between font-sans text-micro11 text-tx-muted">
        <span>{a}</span>
        <span>{b}</span>
      </div>
    </div>
  );
}

function MoveRows({
  moves,
  attacker,
  defender,
  lang,
  t,
}: {
  moves: MatchupKeyMove[];
  attacker: string;
  defender: string;
  lang: Lang;
  t: (k: string, o?: Record<string, unknown>) => string;
}) {
  return (
    <div>
      <p className="pixel-label mb-1.5 text-[8px] text-tx-muted">
        {t('matchup.movesVs', { attacker, defender })}
      </p>
      {moves.length === 0 && (
        <p className="font-sans text-micro12 text-tx-secondary">{t('matchup.noDamageMoves')}</p>
      )}
      <ul className="space-y-1">
        {moves.slice(0, 3).map((mv) => (
          <li
            key={mv.slug}
            className="flex h-9 items-center gap-2 rounded-md border border-hairline bg-surface1 px-2.5"
          >
            <span className="min-w-0 flex-1 truncate font-sans text-micro12 font-semibold text-tx-primary">
              {nameOfMove(mv.slug, lang)}
            </span>
            <span className="font-sans text-micro11 tabular-nums text-tx-secondary">
              {mv.range[0]}–{mv.range[1]} {t('matchup.hpUnit')}
            </span>
            <span className="font-sans text-micro11 tabular-nums text-tx-muted">
              {mv.pct[0]}–{mv.pct[1]}%
            </span>
            <span
              className={cn(
                'rounded-pill border px-1.5 font-sans text-[11px] leading-none font-bold tabular-nums',
                mv.eff >= 2
                  ? 'border-gold/50 text-gold'
                  : mv.eff === 0
                    ? 'border-hairline text-tx-muted'
                    : mv.eff < 1
                      ? 'border-hairline text-tx-secondary'
                      : 'border-hairline text-tx-primary',
              )}
            >
              {EFF_LABEL(mv.eff)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ================================================================== */

export default function MatchupPage() {
  const { t } = useTranslation();
  const lang = useLanguage();
  const { slug } = useParams();
  const entry = slug ? resolveMatchupParam(slug) : null;

  if (!entry) {
    return (
      <div className="mx-auto max-w-content px-4 pb-20 pt-6 md:px-8">
        <p className="font-sans text-micro13 text-tx-secondary">{t('matchup.notFound')}</p>
        <LocaleLink to="/versus" className="mt-2 inline-flex items-center gap-1.5 font-display text-micro13 font-bold text-gold">
          {t('matchup.toVersus')}
          <ArrowRight size={11} />
        </LocaleLink>
      </div>
    );
  }

  const m = entry;
  const { a, b } = matchupNames(m, lang);
  const names = { a, b };
  const battles = MATCHUPS_META.battles;
  const level = MATCHUPS_META.level;
  const faster = m.speedA > m.speedB ? 'a' : m.speedB > m.speedA ? 'b' : null;
  const topA = bestMove(m.movesA);
  const topB = bestMove(m.movesB);

  const tt = (key: string, opts?: Record<string, unknown>) => t(key, { ...names, ...opts });

  return (
    <div className="mx-auto max-w-content px-4 pb-20 pt-6 md:px-8">
      {/* ---------- H1 + prerendered result sentence (AI-citable) ---------- */}
      <header className="mb-6">
        <p className="pixel-label text-[9px] text-gold">{t('matchup.eyebrow')}</p>
        <h1 className="mt-1 font-display text-2xl font-extrabold tracking-wide text-tx-primary md:text-3xl">
          {tt('matchup.h1')}
        </h1>
        <p className="mt-3 max-w-2xl font-sans text-[0.875rem] font-semibold leading-relaxed text-tx-primary">
          <strong className="font-bold text-gold">
            {tt('matchup.resultLead', {
              battles,
              level,
              winsA: m.winsA,
              winsB: m.winsB,
            })}
          </strong>{' '}
          {m.ties > 0 && tt('matchup.resultTies', { ties: m.ties })}
        </p>
        <p className="mt-1.5 font-sans text-[0.7188rem] text-tx-muted">
          {tt('matchup.assumptions', { level })}
          {Math.min(m.winsA, m.winsB) >= 30 ? ` ${tt('matchup.varianceNote')}` : ''}
        </p>
      </header>

      {/* ---------- duel header: sprites + win bar ---------- */}
      <section className="rounded-lg border border-hairline bg-surface1 px-4 py-4 sm:px-6">
        <div className="flex items-center justify-center gap-6 sm:gap-10">
          <div className="flex flex-col items-center gap-1">
            <Sprite id={m.dexA} name={a} era="default" eager className="h-20 w-20 sm:h-24 sm:w-24" skeleton={false} />
            <p className="font-display text-micro13 font-bold tracking-wide text-tx-primary">{a}</p>
            <div className="flex gap-1">
              {m.typesA.map((ty) => (
                <TypeBadge key={ty} type={ty as PokemonType} />
              ))}
            </div>
          </div>
          <span className="font-display text-[1.625rem] font-black text-gold" style={{ textShadow: '0 0 24px rgba(246,201,69,0.45)' }}>
            VS
          </span>
          <div className="flex flex-col items-center gap-1">
            <Sprite id={m.dexB} name={b} era="default" eager className="h-20 w-20 sm:h-24 sm:w-24" skeleton={false} />
            <p className="font-display text-micro13 font-bold tracking-wide text-tx-primary">{b}</p>
            <div className="flex gap-1">
              {m.typesB.map((ty) => (
                <TypeBadge key={ty} type={ty as PokemonType} />
              ))}
            </div>
          </div>
        </div>
        <div className="mx-auto mt-4 max-w-xl">
          <p className="pixel-label mb-1 text-[8px] text-tx-muted">{t('matchup.winRateTitle')}</p>
          <WinBar m={m} lang={lang} />
        </div>
      </section>

      {/* ---------- rule-based analysis (2–3 sentences, all values real) ---------- */}
      <section className="mx-auto mt-8 max-w-3xl">
        <p className="pixel-label text-[9px] text-gold">{t('matchup.analysisEyebrow')}</p>
        <div className="mt-2 space-y-2 font-sans text-[0.8438rem] leading-relaxed text-tx-secondary">
          {faster ? (
            <p>
              {tt('matchup.anaSpeed', {
                fast: faster === 'a' ? a : b,
                slow: faster === 'a' ? b : a,
                fastSpe: faster === 'a' ? m.speedA : m.speedB,
                slowSpe: faster === 'a' ? m.speedB : m.speedA,
              })}
            </p>
          ) : (
            <p>{tt('matchup.anaSpeedTie', { spe: m.speedA })}</p>
          )}
          {topA && (
            <p>
              {tt(topA.eff >= 2 ? 'matchup.anaBestSuper' : topA.eff === 0 ? 'matchup.anaBestImmune' : 'matchup.anaBest', {
                attacker: a,
                defender: b,
                move: nameOfMove(topA.slug, lang),
                pctLo: topA.pct[0],
                pctHi: topA.pct[1],
                eff: EFF_LABEL(topA.eff),
              })}
            </p>
          )}
          {topB && (
            <p>
              {tt(topB.eff >= 2 ? 'matchup.anaBestSuper' : topB.eff === 0 ? 'matchup.anaBestImmune' : 'matchup.anaBest', {
                attacker: b,
                defender: a,
                move: nameOfMove(topB.slug, lang),
                pctLo: topB.pct[0],
                pctHi: topB.pct[1],
                eff: EFF_LABEL(topB.eff),
              })}
            </p>
          )}
        </div>
      </section>

      {/* ---------- computed modules: speed + turns + top moves ---------- */}
      <section className="mx-auto mt-8 max-w-3xl">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-hairline bg-surface1 px-4 py-3.5">
            <p className="flex items-center gap-1.5 pixel-label text-[8px] text-tx-muted">
              <Gauge size={10} className="text-gold" />
              {t('matchup.speedTitle')}
            </p>
            <div className="mt-2 space-y-1.5">
              {(
                [
                  [a, m.speedA, m.speedA >= m.speedB],
                  [b, m.speedB, m.speedB >= m.speedA],
                ] as const
              ).map(([name, spe, lead]) => (
                <div key={name} className="flex items-center gap-2">
                  <span className="w-24 truncate font-sans text-micro12 text-tx-primary">{name}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface2">
                    <div
                      className={cn('h-full rounded-full', lead ? 'bg-gold' : 'bg-tx-muted/50')}
                      style={{ width: `${Math.round((spe / Math.max(m.speedA, m.speedB)) * 100)}%` }}
                    />
                  </div>
                  <span className="w-8 text-right font-sans text-micro11 tabular-nums text-tx-secondary">{spe}</span>
                </div>
              ))}
            </div>
            <p className="mt-2 font-sans text-[0.7188rem] text-tx-muted">
              {faster
                ? tt('matchup.speedFirst', {
                    name: faster === 'a' ? a : b,
                  })
                : tt('matchup.speedTieNote')}
            </p>
          </div>
          <div className="rounded-lg border border-hairline bg-surface1 px-4 py-3.5">
            <p className="flex items-center gap-1.5 pixel-label text-[8px] text-tx-muted">
              <Timer size={10} className="text-gold" />
              {t('matchup.medianTurnsTitle')}
            </p>
            <p className="mt-2 font-display text-2xl font-extrabold tabular-nums text-tx-primary">
              {m.medianTurns}
              <span className="ml-1.5 font-sans text-micro12 font-normal text-tx-muted">
                {t('matchup.medianTurnsUnit')}
              </span>
            </p>
            <p className="mt-1.5 font-sans text-[0.7188rem] text-tx-muted">
              {tt('matchup.medianTurnsNote', { turns: m.medianTurns, battles })}
            </p>
          </div>
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-hairline bg-surface1 px-4 py-3.5">
            <MoveRows moves={m.movesA} attacker={a} defender={b} lang={lang} t={tt} />
          </div>
          <div className="rounded-lg border border-hairline bg-surface1 px-4 py-3.5">
            <MoveRows moves={m.movesB} attacker={b} defender={a} lang={lang} t={tt} />
          </div>
        </div>
      </section>

      {/* ---------- transparency: the simulated standard sets ---------- */}
      <section className="mx-auto mt-8 max-w-3xl">
        <div className="rounded-lg border border-hairline bg-surface1 px-4 py-4 sm:px-6">
          <p className="pixel-label text-[9px] text-gold">{t('matchup.setsEyebrow')}</p>
          <h2 className="mt-1 font-display text-base font-bold tracking-wide text-tx-primary">
            {t('matchup.setsTitle')}
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {(
              [
                [a, m.setsA],
                [b, m.setsB],
              ] as const
            ).map(([name, set]) => (
              <div key={name}>
                <p className="font-sans text-micro12 font-semibold text-tx-primary">{name}</p>
                <p className="mt-0.5 font-sans text-micro12 leading-relaxed text-tx-secondary">
                  {set.map((s) => nameOfMove(s, lang)).join(' · ')}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-3 font-sans text-[0.7188rem] text-tx-muted">
            {tt('matchup.setsNote', { level, battles })}
          </p>
        </div>
      </section>

      {/* ---------- replay CTA: same pairing in the live simulator ---------- */}
      <section className="mx-auto mt-8 max-w-3xl">
        <div className="flex flex-col items-center gap-3 rounded-lg border border-gold/30 bg-gold/5 px-4 py-8 text-center">
          <p className="max-w-xl font-display text-base font-bold tracking-wide text-tx-primary md:text-lg">
            {tt('matchup.ctaTitle')}
          </p>
          <p className="max-w-xl font-sans text-[0.7813rem] leading-relaxed text-tx-secondary">
            {tt('matchup.ctaBody')}
          </p>
          <LocaleLink
            to={`${battleLandingPath(lang)}?a=${m.dexA}&b=${m.dexB}`}
            className="inline-flex h-8 items-center gap-1.5 rounded-pill border border-gold bg-gold px-4 font-display text-[11px] leading-none font-extrabold tracking-wider text-abyss transition-all hover:shadow-[0_0_18px_rgba(246,201,69,0.45)]"
          >
            <Swords size={11} />
            {t('matchup.ctaButton')}
          </LocaleLink>
        </div>
      </section>

      {/* ---------- rule-based Q&A (max 2, real queries from the research) ---------- */}
      <div className="mx-auto mt-10 max-w-3xl">
        <QaSection
          defaultOpen={1}
          items={[
            {
              q: tt('matchup.qaSpeedQ'),
              a: <p>{tt(faster ? 'matchup.qaSpeedA' : 'matchup.qaSpeedATie', {
                    fast: faster === 'a' ? a : b,
                    slow: faster === 'a' ? b : a,
                    fastSpe: faster === 'a' ? m.speedA : m.speedB,
                    slowSpe: faster === 'a' ? m.speedB : m.speedA,
                    spe: m.speedA,
                  })}</p>,
            },
            {
              q: tt('matchup.qaWinQ', {
                winner: m.winsA >= m.winsB ? a : b,
                loser: m.winsA >= m.winsB ? b : a,
              }),
              a: <p>{tt('matchup.qaWinA', {
                    winner: m.winsA >= m.winsB ? a : b,
                    loser: m.winsA >= m.winsB ? b : a,
                    winnerWins: Math.max(m.winsA, m.winsB),
                    loserWins: Math.min(m.winsA, m.winsB),
                    battles,
                    level,
                  })}</p>,
            },
          ]}
        />
      </div>

      {/* ---------- internal linking: all curated matchups + tools ---------- */}
      <section className="mx-auto mt-10 max-w-3xl">
        <div className="mb-4 flex items-center gap-3">
          <span className="h-px flex-1 bg-hairline" aria-hidden />
          <span className="pixel-label text-[9px] text-gold">{t('matchup.moreEyebrow')}</span>
          <span className="h-px flex-1 bg-hairline" aria-hidden />
        </div>
        <ul className="flex flex-wrap gap-1.5">
          {MATCHUPS.filter((x) => x.slugEn !== m.slugEn).map((x) => {
            const n = matchupNames(x, lang);
            return (
              <li key={x.slugEn}>
                <LocaleLink
                  to={matchupRest(x, lang)}
                  className="inline-flex h-7 items-center rounded-pill border border-hairline bg-surface1 px-2.5 font-sans text-[11px] leading-none text-tx-secondary transition-colors hover:border-gold/50 hover:text-tx-primary"
                >
                  {n.a} vs. {n.b}
                </LocaleLink>
              </li>
            );
          })}
        </ul>
        <div className="mt-4">
          <LocaleLink
            to="/versus"
            className="inline-flex items-center gap-1.5 font-display text-micro12 font-bold tracking-wide text-gold transition-colors hover:text-tx-primary"
          >
            {t('matchup.toVersus')}
            <ArrowRight size={11} />
          </LocaleLink>
        </div>
      </section>
    </div>
  );
}
