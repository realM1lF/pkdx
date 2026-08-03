/* PokemonSeoSections — question-driven SEO content BELOW the Pokémon detail
 * dashboard (SEO pilot). Generic registry keyed by dex id; only pilots carry
 * content (#25 Pikachu). Rendered for BOTH the loading skeleton and the
 * ready dashboard state, so the static/prerendered HTML carries the full
 * Q&A + location tables even while the live PokéAPI payloads are in flight.
 *
 * All displayed data is hardcoded from a verified PokéAPI snapshot:
 *   /pokemon/25            → type electric; stats 35/55/40/50/50/90;
 *                            ability static, hidden lightning-rod
 *   /pokemon/25/encounters → firered & leafgreen identical:
 *                            viridian-forest walk 5%  Lv 3–5
 *                            kanto-power-plant walk 25% Lv 22–26
 *   FRLG level-up: thunder-shock+growl 1, tail-whip 6, thunder-wave 8,
 *                  quick-attack 11, double-team 15, slam 20, thunderbolt 26,
 *                  agility 33, thunder 41, light-screen 50
 *   evolution: pichu (friendship) → pikachu (thunder-stone) → raichu;
 *              raichu learns no new level-up moves in FRLG. */
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Map as MapIcon, Swords, Users } from 'lucide-react';
import { LocaleLink } from '@/lib/locale-link';
import QaSection from '@/components/QaSection';
import { resolveDexId } from '@/lib/seo-pilots';
import PokemonSeoGeneric, { POKEMON_SEO_IDS } from './PokemonSeoGeneric';
import { cn } from '@/lib/utils';

/* ---------- shared bits ---------- */

type Frlg = 'firered' | 'leafgreen';

interface QaRaw {
  q: string;
  aLead: string;
  aBody: string;
}

function FrlgToggle({ value, onChange }: { value: Frlg; onChange: (v: Frlg) => void }) {
  const { t } = useTranslation();
  return (
    <div className="flex gap-1" role="group" aria-label={t('seo.pikachu.whereTitle')}>
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
          {v === 'firered' ? t('seo.pikachu.versionFR') : t('seo.pikachu.versionLG')}
        </button>
      ))}
    </div>
  );
}

/* ---------- #25 Pikachu pilot ---------- */

const PIKACHU_LOCATIONS = [
  { key: 'viridianForest', chance: 5, level: '3–5' },
  { key: 'powerPlant', chance: 25, level: '22–26' },
] as const;

function PikachuSeo() {
  const { t } = useTranslation();
  const [version, setVersion] = useState<Frlg>('firered');
  const qa = t('seo.pikachu.qa', { returnObjects: true }) as QaRaw[];

  return (
    <div className="flex flex-col gap-4">
      {/* where to catch (FRLG) */}
      <section className="rounded-lg border border-hairline bg-surface1">
        <header className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-hairline px-4 py-2.5 sm:px-5">
          <span className="pixel-label shrink-0 text-[9px] text-gold">{t('seo.pikachu.whereEyebrow')}</span>
          <h2 className="font-display text-base font-bold tracking-wide text-tx-primary">
            {t('seo.pikachu.whereTitle')}
          </h2>
          <div className="ml-auto flex items-center gap-2">
            <FrlgToggle value={version} onChange={setVersion} />
          </div>
        </header>
        <p className="border-b border-hairline/60 px-4 py-2.5 font-sans text-[12px] text-tx-secondary sm:px-5">
          {t('seo.pikachu.whereIntro')}
        </p>
        <div className="flex items-center gap-2 border-b border-hairline px-4 py-2 sm:px-5">
          <span className="pixel-label flex-1 text-[7px] text-tx-muted">{t('seo.pikachu.colLocation')}</span>
          <span className="pixel-label hidden w-[72px] text-[7px] text-tx-muted sm:block">{t('seo.pikachu.colMethod')}</span>
          <span className="pixel-label w-[58px] text-right text-[7px] text-tx-muted">{t('seo.pikachu.colLevel')}</span>
          <span className="pixel-label w-[84px] text-right text-[7px] text-tx-muted">{t('seo.pikachu.colChance')}</span>
        </div>
        {PIKACHU_LOCATIONS.map((loc) => (
          <div
            key={loc.key}
            className="flex h-11 items-center gap-2 border-b border-hairline/60 px-4 last:border-b-0 sm:px-5"
          >
            <span className="flex-1 truncate text-[13px] font-semibold text-tx-primary">
              {t(`seo.pikachu.${loc.key}`)}
            </span>
            <span className="hidden w-[72px] shrink-0 text-[11px] font-medium text-tx-secondary sm:block">
              {t('seo.pikachu.methodGrass')}
            </span>
            <span className="w-[58px] shrink-0 text-right font-sans text-[11px] tabular-nums text-tx-muted">
              {`Lv ${loc.level}`}
            </span>
            <span className="flex w-[84px] shrink-0 items-center justify-end gap-1.5">
              <span className="font-display text-[13px] font-bold tabular-nums text-tx-primary">{loc.chance}%</span>
              <span className="h-[3px] w-10 overflow-hidden rounded-pill bg-surface3">
                <span className="block h-full rounded-pill bg-gold" style={{ width: `${loc.chance * 2}%` }} />
              </span>
            </span>
          </div>
        ))}
        <p className="px-4 py-2.5 text-[11px] font-medium text-tx-muted sm:px-5">
          {t('seo.pikachu.whereNote')}{' '}
          <LocaleLink to="/maps" className="text-gold underline-offset-2 transition-colors hover:underline">
            {t('seo.pikachu.whereNoteLink')}
          </LocaleLink>
          .
        </p>
      </section>

      {/* deep links: versus prefilled, team builder, maps */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="pixel-label mr-1 text-[8px] text-tx-muted">{t('seo.pikachu.deepLinksEyebrow')}</span>
        <LocaleLink
          to="/versus?you=25"
          className="inline-flex h-8 items-center gap-1.5 rounded-md border border-gold/50 px-3 text-[11px] font-semibold text-gold transition-colors hover:bg-gold/10"
        >
          <Swords size={12} />
          {t('seo.pikachu.versusCta')}
        </LocaleLink>
        <LocaleLink
          to="/team"
          className="inline-flex h-8 items-center gap-1.5 rounded-md border border-hairline2 px-3 text-[11px] font-semibold text-tx-secondary transition-colors hover:bg-surface3 hover:text-gold"
        >
          <Users size={12} />
          {t('seo.pikachu.teamCta')}
        </LocaleLink>
        <LocaleLink
          to="/maps/kanto"
          className="inline-flex h-8 items-center gap-1.5 rounded-md border border-hairline2 px-3 text-[11px] font-semibold text-tx-secondary transition-colors hover:bg-surface3 hover:text-gold"
        >
          <MapIcon size={12} />
          {t('seo.pikachu.mapsCta')}
        </LocaleLink>
      </div>

      {/* Q&A */}
      <QaSection
        defaultOpen={1}
        items={qa.map((item) => ({
          q: item.q,
          a: (
            <p>
              <strong className="font-semibold text-tx-primary">{item.aLead}</strong> {item.aBody}
            </p>
          ),
        }))}
      />
    </div>
  );
}

/* ---------- entry ---------- */

export default function PokemonSeoSections({ queryId }: { queryId: string }) {
  const id = resolveDexId(queryId);
  /* Pikachu keeps its curated pilot module; the other 24 curated Pokémon
   * render the generated sections (PokemonSeoGeneric). */
  if (id === 25) return <PikachuSeo />;
  if (id !== null && POKEMON_SEO_IDS.has(id)) return <PokemonSeoGeneric id={id} />;
  return null;
}
