/* Route1Page — `/maps/kanto/route-1` SEO content pilot (fragengetrieben).
 *
 * Static, prerender-friendly content page BELOW the existing map tooling —
 * the map itself is untouched (the drawer deep-links here). All data is
 * hardcoded from a verified PokéAPI snapshot so the raw HTML carries every
 * table and answer without any runtime fetch.
 *
 * Data verification (PokéAPI, live-checked):
 *   /location-area/kanto-route-1-area → firered & leafgreen IDENTICAL:
 *   pidgey  walk/grass  chance 50 (sum of encounter_details slots = max_chance)  Lv 2–5
 *   rattata walk/grass  chance 50                                                Lv 2–4
 *   item: potion — gift (free sample from the Viridian Poké Mart clerk),
 *   curated in src/data/items-kanto.json → node 'kanto-route-1'. */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Crosshair, Gift, Map as MapIcon } from 'lucide-react';
import { LocaleLink } from '@/lib/locale-link';
import QaSection from '@/components/QaSection';
import Sprite from '@/components/Sprite';
import { nameOfPokemon, useLanguage } from '@/lib/i18n-data';
import { padNum } from '@/lib/pokeapi';
import { cn } from '@/lib/utils';

interface EncounterRow {
  pokemonId: number;
  chance: number;
  minLevel: number;
  maxLevel: number;
}

/* FR/LG identical (PokéAPI-verified, see header comment) */
const ENCOUNTERS: EncounterRow[] = [
  { pokemonId: 16, chance: 50, minLevel: 2, maxLevel: 5 }, // pidgey
  { pokemonId: 19, chance: 50, minLevel: 2, maxLevel: 4 }, // rattata
];

type Frlg = 'firered' | 'leafgreen';

interface QaRaw {
  q: string;
  aLead: string;
  aBody: string;
}

function FrlgToggle({ value, onChange }: { value: Frlg; onChange: (v: Frlg) => void }) {
  const { t } = useTranslation();
  return (
    <div className="flex gap-1" role="group" aria-label={t('seo.route1.encountersTitle')}>
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
          {v === 'firered' ? t('seo.route1.versionFR') : t('seo.route1.versionLG')}
        </button>
      ))}
    </div>
  );
}

function SectionCard({
  eyebrow,
  title,
  right,
  children,
}: {
  eyebrow: string;
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-hairline bg-surface1">
      <header className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-hairline px-4 py-2.5 sm:px-5">
        <span className="pixel-label shrink-0 text-[9px] text-gold">{eyebrow}</span>
        <h2 className="font-display text-base font-bold uppercase tracking-wide text-tx-primary">{title}</h2>
        {right && <div className="ml-auto flex items-center gap-2">{right}</div>}
      </header>
      <div>{children}</div>
    </section>
  );
}

export default function Route1Page() {
  const { t } = useTranslation();
  const lang = useLanguage();
  const [version, setVersion] = useState<Frlg>('firered');
  const qa = t('seo.route1.qa', { returnObjects: true }) as QaRaw[];

  return (
    <div className="mx-auto max-w-content px-4 pb-20 pt-6 md:px-8">
      <div className="max-w-3xl">
        {/* breadcrumb (Maps › Kanto › Route 1) — mirrored by the JSON-LD
            BreadcrumbList emitted from src/lib/structured-data.ts */}
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex flex-wrap items-center gap-1 font-sans text-[12px] font-semibold text-tx-muted">
            <li>
              <LocaleLink to="/maps" className="transition-colors hover:text-gold">
                {t('seo.route1.crumbMaps')}
              </LocaleLink>
            </li>
            <li aria-hidden className="flex items-center">
              <ChevronRight size={12} />
            </li>
            <li>
              <LocaleLink to="/maps/kanto" className="transition-colors hover:text-gold">
                {t('seo.route1.crumbKanto')}
              </LocaleLink>
            </li>
            <li aria-hidden className="flex items-center">
              <ChevronRight size={12} />
            </li>
            <li aria-current="page" className="text-tx-secondary">
              Route 1
            </li>
          </ol>
        </nav>

        <header className="mb-8">
          <p className="pixel-label text-[9px] text-gold">{t('seo.route1.eyebrow')}</p>
          <h1 className="font-display text-2xl font-extrabold uppercase tracking-wide text-tx-primary md:text-3xl">
            {t('seo.route1.title')}
          </h1>
          <p className="mt-3 font-sans text-[14px] leading-relaxed text-tx-secondary">
            {t('seo.route1.intro')}
          </p>
        </header>

        <div className="flex flex-col gap-4">
          {/* encounter table */}
          <SectionCard
            eyebrow={t('seo.route1.encountersEyebrow')}
            title={t('seo.route1.encountersTitle')}
            right={<FrlgToggle value={version} onChange={setVersion} />}
          >
            {/* header row */}
            <div className="flex items-center gap-2 border-b border-hairline px-4 py-2 sm:px-5">
              <span className="pixel-label flex-1 text-[7px] text-tx-muted">{t('seo.route1.colPokemon')}</span>
              <span className="pixel-label hidden w-[72px] text-[7px] text-tx-muted sm:block">{t('seo.route1.colMethod')}</span>
              <span className="pixel-label w-[58px] text-right text-[7px] text-tx-muted">{t('seo.route1.colLevel')}</span>
              <span className="pixel-label w-[84px] text-right text-[7px] text-tx-muted">{t('seo.route1.colChance')}</span>
            </div>
            {ENCOUNTERS.map((e) => (
              <LocaleLink
                key={e.pokemonId}
                to={`/pokemon/${e.pokemonId}`}
                className="group flex h-12 items-center gap-2 border-b border-hairline/60 px-4 transition-colors last:border-b-0 hover:bg-surface2 sm:px-5"
              >
                <span className="flex min-w-0 flex-1 items-center gap-2.5">
                  <Sprite
                    id={e.pokemonId}
                    name={nameOfPokemon(e.pokemonId, lang)}
                    era="gen5"
                    className="h-[34px] w-[34px] shrink-0"
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-[13px] font-semibold text-tx-primary transition-colors group-hover:text-gold">
                      {nameOfPokemon(e.pokemonId, lang)}
                    </span>
                    <span className="pixel-label block text-[7px] text-tx-muted">{padNum(e.pokemonId)}</span>
                  </span>
                </span>
                <span className="hidden w-[72px] shrink-0 text-[11px] font-medium text-tx-secondary sm:block">
                  {t('seo.route1.methodGrass')}
                </span>
                <span className="w-[58px] shrink-0 text-right font-sans text-[11px] tabular-nums text-tx-muted">
                  {`Lv ${e.minLevel}–${e.maxLevel}`}
                </span>
                <span className="flex w-[84px] shrink-0 items-center justify-end gap-1.5">
                  <span className="font-display text-[13px] font-bold tabular-nums text-tx-primary">{e.chance}%</span>
                  <span className="h-[3px] w-10 overflow-hidden rounded-pill bg-surface3">
                    <span className="block h-full rounded-pill bg-gold" style={{ width: `${e.chance}%` }} />
                  </span>
                </span>
              </LocaleLink>
            ))}
            <p className="px-4 py-2.5 text-[10px] font-medium text-tx-muted sm:px-5">
              {t('seo.route1.encounterSource')}
            </p>
          </SectionCard>

          {/* items */}
          <SectionCard eyebrow={t('seo.route1.itemsEyebrow')} title={t('seo.route1.itemsTitle')}>
            <div className="flex items-center gap-3 px-4 py-3 sm:px-5">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-gold/30 bg-gold-soft text-gold">
                <Gift size={16} strokeWidth={1.75} />
              </span>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-tx-primary">{t('seo.route1.potionName')}</p>
                <p className="text-[12px] leading-snug text-tx-secondary">{t('seo.route1.potionNote')}</p>
              </div>
            </div>
          </SectionCard>

          {/* best catch */}
          <SectionCard eyebrow={t('seo.route1.bestCatchEyebrow')} title={t('seo.route1.bestCatchTitle')}>
            <div className="flex items-start gap-3 px-4 py-4 sm:px-5">
              <LocaleLink to="/pokemon/16" className="group shrink-0" aria-label={nameOfPokemon(16, lang)}>
                <Sprite
                  id={16}
                  name={nameOfPokemon(16, lang)}
                  era="gen5"
                  className="h-[56px] w-[56px] transition-transform duration-150 group-hover:scale-110"
                />
              </LocaleLink>
              <p className="font-sans text-[13px] leading-relaxed text-tx-secondary">{t('seo.route1.bestCatchBody')}</p>
            </div>
          </SectionCard>

          {/* nuzlocke box */}
          <section className="rounded-lg border border-gold/40 bg-gradient-to-br from-gold/15 to-gold/5 p-4 sm:p-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-gold/40 bg-abyss/60 text-gold">
                <Crosshair size={16} strokeWidth={1.75} />
              </span>
              <div className="min-w-0 flex-1 basis-56">
                <p className="pixel-label text-[8px] text-gold">{t('seo.route1.nuzlockeEyebrow')}</p>
                <h2 className="font-display text-base font-bold uppercase tracking-wide text-tx-primary">
                  {t('seo.route1.nuzlockeTitle')}
                </h2>
              </div>
              <LocaleLink
                to="/nuzlocke/new?region=kanto&at=kanto-route-1"
                className="inline-flex h-9 items-center gap-1.5 rounded-md border border-gold/60 bg-gradient-to-br from-gold/25 to-gold/10 px-4 font-display text-[12px] font-bold uppercase tracking-wider text-tx-primary transition-all hover:-translate-y-0.5 hover:shadow-glow-gold"
              >
                {t('seo.route1.nuzlockeCta')}
                <ChevronRight size={14} />
              </LocaleLink>
            </div>
            <p className="mt-3 font-sans text-[13px] leading-relaxed text-tx-secondary">{t('seo.route1.nuzlockeBody')}</p>
          </section>

          {/* Q&A */}
          <QaSection
            className="mt-4"
            defaultOpen={2}
            items={qa.map((item) => ({
              q: item.q,
              a: (
                <p>
                  <strong className="font-semibold text-tx-primary">{item.aLead}</strong> {item.aBody}
                </p>
              ),
            }))}
          />

          {/* internal links */}
          <section className="mt-4">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px flex-1 bg-hairline" aria-hidden />
              <span className="pixel-label text-[9px] text-gold">{t('seo.route1.linksEyebrow')}</span>
              <span className="h-px flex-1 bg-hairline" aria-hidden />
            </div>
            <div className="flex flex-col gap-2">
              <LocaleLink
                to="/maps/kanto?node=kanto-route-1"
                className="group flex items-center justify-between rounded-md border border-hairline bg-surface1 px-4 py-3 transition-colors hover:border-hairline2 hover:bg-surface2"
              >
                <span className="flex items-center gap-2.5 text-[13px] font-semibold text-tx-primary transition-colors group-hover:text-gold">
                  <MapIcon size={15} className="text-gold" />
                  {t('seo.route1.openMapCta')}
                </span>
                <ChevronRight size={15} className="text-tx-muted transition-transform group-hover:translate-x-0.5 group-hover:text-gold" />
              </LocaleLink>
              <LocaleLink
                to="/maps/kanto?node=kanto-route-22"
                className="group flex items-center justify-between rounded-md border border-hairline bg-surface1 px-4 py-3 transition-colors hover:border-hairline2 hover:bg-surface2"
              >
                <span className="min-w-0">
                  <span className="block text-[13px] font-semibold text-tx-primary transition-colors group-hover:text-gold">
                    {t('seo.route1.route22Link')}
                  </span>
                  <span className="block text-[11px] text-tx-muted">{t('seo.route1.route22Note')}</span>
                </span>
                <ChevronRight size={15} className="shrink-0 text-tx-muted transition-transform group-hover:translate-x-0.5 group-hover:text-gold" />
              </LocaleLink>
              <LocaleLink
                to="/pokemon/25"
                className="group flex items-center justify-between rounded-md border border-hairline bg-surface1 px-4 py-3 transition-colors hover:border-hairline2 hover:bg-surface2"
              >
                <span className="flex items-center gap-2.5">
                  <Sprite id={25} name={nameOfPokemon(25, lang)} era="gen5" className="h-[26px] w-[26px]" />
                  <span className="text-[13px] font-semibold text-tx-primary transition-colors group-hover:text-gold">
                    {t('seo.route1.linkPikachu')}
                  </span>
                </span>
                <ChevronRight size={15} className="text-tx-muted transition-transform group-hover:translate-x-0.5 group-hover:text-gold" />
              </LocaleLink>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
