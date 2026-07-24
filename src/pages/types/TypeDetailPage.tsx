/* TypeDetailPage — /de/typen/:type · /en/types/:type (SEO rollout).
 *
 * Every matrix on this page is COMPUTED from the gen-9 type chart
 * (src/lib/seo-type-chart.ts → src/lib/versus.ts @pkmn/data): offense,
 * defense, counter quality, example multipliers, attack rating. Only the
 * one-sentence flavor line per type is editorial (seo.type.flavor.<slug>). */
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { ChevronRight, Crosshair, Swords } from 'lucide-react';
import QaSection from '@/components/QaSection';
import Sprite from '@/components/Sprite';
import TypeGlyph from '@/components/TypeGlyph';
import { LocaleLink, useLocale } from '@/lib/locale-link';
import { nameOfPokemon } from '@/lib/i18n-data';
import {
  attackRating,
  countersOf,
  COUNTER_EXAMPLES,
  defenseProfile,
  exampleMultiplier,
  offenseProfile,
} from '@/lib/seo-type-chart';
import { resolveTypeParam, typeName, typeOverviewPath } from '@/lib/seo-types';
import { TypeChip, TypeChipRow } from './TypeChips';

function SectionCard({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-hairline bg-surface1">
      <header className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-hairline px-4 py-2.5 sm:px-5">
        <span className="pixel-label shrink-0 text-[9px] text-gold">{eyebrow}</span>
        <h2 className="font-display text-base font-bold uppercase tracking-wide text-tx-primary">{title}</h2>
      </header>
      <div>{children}</div>
    </section>
  );
}

function MatrixRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5 border-b border-hairline/60 px-4 py-3 last:border-b-0 sm:flex-row sm:items-center sm:gap-3 sm:px-5">
      <span className="pixel-label w-40 shrink-0 text-[7px] text-tx-muted">{label}</span>
      {children}
    </div>
  );
}

export default function TypeDetailPage() {
  const { t } = useTranslation();
  const lang = useLocale();
  const params = useParams();
  const slug = resolveTypeParam(params.type);

  if (!slug) {
    return (
      <div className="mx-auto max-w-content px-4 pb-20 pt-16 md:px-8">
        <h1 className="font-display text-xl font-extrabold uppercase text-tx-primary">
          {t('seo.type.notFoundTitle')}
        </h1>
        <p className="mt-3 text-[14px] text-tx-secondary">
          <LocaleLink to={typeOverviewPath(lang)} className="text-gold hover:underline">
            {t('seo.type.notFoundLink')}
          </LocaleLink>
        </p>
      </div>
    );
  }

  const name = typeName(slug, lang);
  const names = (list: string[]) => list.map((x) => typeName(x, lang)).join(', ');
  const offense = offenseProfile(slug);
  const defense = defenseProfile(slug);
  const counters = countersOf(slug);
  const rating = attackRating(slug);
  const example = COUNTER_EXAMPLES[slug];
  const exampleMult = exampleMultiplier(example);
  const exampleName = nameOfPokemon(example.pokemonId, lang);
  const multLabel = (m: number) => (m === 0 ? '×0' : m === 0.5 ? '×½' : m === 2 ? '×2' : m === 4 ? '×4' : `×${m}`);

  const counterReason = (c: { type: string; hitsFor: number; takesFor: number }) =>
    c.takesFor === 0
      ? t('seo.type.counterReasonImmune', { counter: typeName(c.type, lang), name })
      : c.takesFor < 1
        ? t('seo.type.counterReasonResist', { counter: typeName(c.type, lang), name })
        : t('seo.type.counterReasonNeutral', { counter: typeName(c.type, lang), name });

  const qa = [
    {
      q: t('seo.type.qa1q', { name }),
      lead: t('seo.type.qa1lead', { name, counters: names(defense.weak) }),
      body: t('seo.type.qa1body', {
        example: exampleName,
        types: names(example.types),
        mult: multLabel(exampleMult),
        counter: typeName(example.counter, lang),
      }),
    },
    {
      q: t('seo.type.qa2q', { name }),
      lead: t('seo.type.qa2lead', { name, weak: names(defense.weak), n: defense.weak.length }),
      body:
        defense.immune.length > 0
          ? t('seo.type.qa2bodyImmune', {
              name,
              resist: names(defense.resist),
              immune: names(defense.immune),
            })
          : t('seo.type.qa2body', { name, resist: names(defense.resist) }),
    },
    {
      q: t('seo.type.qa3q', { name }),
      lead: t('seo.type.qa3lead', { name, resist: names(offense.notVery), n: offense.notVery.length }),
      body:
        offense.zero.length > 0
          ? t('seo.type.qa3bodyImmune', { name, zero: names(offense.zero), se: names(offense.superEffective) })
          : t('seo.type.qa3body', { name, se: names(offense.superEffective) }),
    },
    {
      q: t('seo.type.qa4q', { name }),
      lead: t('seo.type.qa4lead', { name }),
      body: t('seo.type.qa4body', { name }),
    },
    {
      q: t('seo.type.qa5q', { name }),
      lead: t(`seo.type.qa5lead_${rating.tier}`, { name, n2: rating.targets2x }),
      body: t('seo.type.qa5body', {
        name,
        n2: rating.targets2x,
        se: names(offense.superEffective),
        resisted: names(offense.notVery),
        nr: rating.resistedBy,
        immunes: names(offense.zero),
        ni: rating.immunes,
      }),
    },
  ];

  return (
    <div className="mx-auto max-w-content px-4 pb-20 pt-6 md:px-8">
      <div className="max-w-3xl">
        {/* breadcrumb — mirrored by the JSON-LD BreadcrumbList */}
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex flex-wrap items-center gap-1 font-sans text-[12px] font-semibold text-tx-muted">
            <li>
              <LocaleLink to={typeOverviewPath(lang)} className="transition-colors hover:text-gold">
                {t('seo.type.crumbTypes')}
              </LocaleLink>
            </li>
            <li aria-hidden className="flex items-center">
              <ChevronRight size={12} />
            </li>
            <li aria-current="page" className="text-tx-secondary">
              {name}
            </li>
          </ol>
        </nav>

        <header className="mb-8">
          <p className="pixel-label flex items-center gap-1.5 text-[9px] text-gold">
            <TypeGlyph type={slug} size={12} />
            {t('seo.type.eyebrow')}
          </p>
          <h1 className="font-display text-2xl font-extrabold uppercase tracking-wide text-tx-primary md:text-3xl">
            {t('seo.type.title', { name })}
          </h1>
          <p className="mt-3 font-sans text-[14px] leading-relaxed text-tx-secondary">
            {t('seo.type.intro1', {
              name,
              se: names(offense.superEffective),
              n2: offense.superEffective.length,
            })}{' '}
            {t('seo.type.intro2', { name, weak: names(defense.weak), nw: defense.weak.length })}{' '}
            {t(`seo.type.flavor.${slug}`)}
          </p>
        </header>

        <div className="flex flex-col gap-4">
          {/* offense matrix */}
          <SectionCard eyebrow={t('seo.type.offenseEyebrow')} title={t('seo.type.offenseTitle', { name })}>
            <MatrixRow label={t('seo.type.offense2x')}>
              <TypeChipRow types={offense.superEffective} lang={lang} mult={() => '×2'} empty={t('seo.type.none')} />
            </MatrixRow>
            <MatrixRow label={t('seo.type.offenseHalf')}>
              <TypeChipRow types={offense.notVery} lang={lang} mult={() => '×½'} empty={t('seo.type.none')} />
            </MatrixRow>
            <MatrixRow label={t('seo.type.offenseZero')}>
              <TypeChipRow types={offense.zero} lang={lang} mult={() => '×0'} empty={t('seo.type.none')} />
            </MatrixRow>
          </SectionCard>

          {/* defense matrix */}
          <SectionCard eyebrow={t('seo.type.defenseEyebrow')} title={t('seo.type.defenseTitle', { name })}>
            <MatrixRow label={t('seo.type.defenseWeak')}>
              <TypeChipRow types={defense.weak} lang={lang} mult={() => '×2'} empty={t('seo.type.none')} />
            </MatrixRow>
            <MatrixRow label={t('seo.type.defenseResist')}>
              <TypeChipRow types={defense.resist} lang={lang} mult={() => '×½'} empty={t('seo.type.none')} />
            </MatrixRow>
            <MatrixRow label={t('seo.type.defenseImmune')}>
              <TypeChipRow types={defense.immune} lang={lang} mult={() => '×0'} empty={t('seo.type.none')} />
            </MatrixRow>
          </SectionCard>

          {/* best counters */}
          <SectionCard eyebrow={t('seo.type.counterEyebrow')} title={t('seo.type.counterTitle', { name })}>
            <div className="flex flex-col gap-2.5 px-4 py-3.5 sm:px-5">
              {counters.map((c) => (
                <div key={c.type} className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                  <TypeChip type={c.type} lang={lang} mult={multLabel(c.hitsFor)} />
                  <span className="text-[12px] leading-snug text-tx-secondary">{counterReason(c)}</span>
                </div>
              ))}
            </div>
            <div className="flex items-start gap-3 border-t border-hairline/60 px-4 py-3.5 sm:px-5">
              <LocaleLink to={`/pokemon/${example.pokemonId}`} className="group shrink-0" aria-label={exampleName}>
                <Sprite
                  id={example.pokemonId}
                  name={exampleName}
                  era="gen5"
                  className="h-[52px] w-[52px] transition-transform duration-150 group-hover:scale-110"
                />
              </LocaleLink>
              <p className="font-sans text-[13px] leading-relaxed text-tx-secondary">
                <strong className="font-semibold text-tx-primary">
                  {t('seo.type.exampleLead', { example: exampleName, mult: multLabel(exampleMult) })}
                </strong>{' '}
                {t('seo.type.exampleBody', {
                  example: exampleName,
                  types: names(example.types),
                  counter: typeName(example.counter, lang),
                  mult: multLabel(exampleMult),
                })}
              </p>
            </div>
          </SectionCard>

          {/* deep links */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="pixel-label mr-1 text-[8px] text-tx-muted">{t('seo.type.deepLinksEyebrow')}</span>
            <LocaleLink
              to={`/versus?you=${example.pokemonId}`}
              className="inline-flex h-8 items-center gap-1.5 rounded-md border border-gold/50 px-3 text-[11px] font-semibold text-gold transition-colors hover:bg-gold/10"
            >
              <Swords size={12} />
              {t('seo.type.versusCta', { example: exampleName })}
            </LocaleLink>
            <LocaleLink
              to={`/pokedex?type=${slug}`}
              className="inline-flex h-8 items-center gap-1.5 rounded-md border border-hairline2 px-3 text-[11px] font-semibold text-tx-secondary transition-colors hover:bg-surface3 hover:text-gold"
            >
              <Crosshair size={12} />
              {t('seo.type.pokedexCta', { name })}
            </LocaleLink>
          </div>

          {/* Q&A */}
          <QaSection
            className="mt-4"
            defaultOpen={2}
            items={qa.map((item) => ({
              q: item.q,
              a: (
                <p>
                  <strong className="font-semibold text-tx-primary">{item.lead}</strong> {item.body}
                </p>
              ),
            }))}
          />
        </div>
      </div>
    </div>
  );
}
