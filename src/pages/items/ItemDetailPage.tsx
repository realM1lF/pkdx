/* ItemDetailPage — /de/items/:deSlug · /en/items/:slug (SEO rollout).
 *
 * All displayed facts come from src/data/items-seo.json (provenance documented
 * in src/lib/seo-items.ts): official flavor texts, PokéAPI-verified effects,
 * FRLG locations from our enriched Kanto dataset. Items WITHOUT location
 * data simply render no location section — nothing is invented. All editorial
 * copy (intro, per-item Q&A answers, verdict) lives in translation.json under
 * seo.itemData.<slug>.* so no two text blocks on the page repeat each other:
 * intro = casual overview, qa1 = mechanics with numbers, qa2 = location
 * conditions, qa3 = worth-it verdict. */
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { ChevronRight, Crosshair, MapPin, Package, Swords } from 'lucide-react';
import HonestyHint from '@/components/HonestyHint';
import { ItemIcon } from '@/components/EntityDescModal';
import QaSection from '@/components/QaSection';
import Sprite from '@/components/Sprite';
import { LocaleLink, useLocale } from '@/lib/locale-link';
import { nameOfPokemon } from '@/lib/i18n-data';
import { itemEffectIsMixedGen } from '@/lib/honesty';
import { ITEMS_SEO, resolveItemParam } from '@/lib/seo-items';
import type { ItemSeoEntry } from '@/lib/seo-items';

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
        <h2 className="font-display text-base font-bold tracking-wide text-tx-primary">{title}</h2>
      </header>
      <div>{children}</div>
    </section>
  );
}

const KIND_KEYS: Record<string, string> = {
  given: 'kindGiven',
  hidden: 'kindHidden',
  ball: 'kindBall',
};

export default function ItemDetailPage() {
  const { t } = useTranslation();
  const lang = useLocale();
  const params = useParams();
  const slug = resolveItemParam(params.slug);

  if (!slug) {
    return (
      <div className="mx-auto max-w-content px-4 pb-20 pt-16 md:px-8">
        <h1 className="font-display text-xl font-extrabold text-tx-primary">
          {t('seo.item.notFoundTitle')}
        </h1>
        <p className="mt-3 text-[0.875rem] text-tx-secondary">
          <LocaleLink to="/items" className="text-gold hover:underline">
            {t('seo.item.notFoundLink')}
          </LocaleLink>
        </p>
      </div>
    );
  }

  const item: ItemSeoEntry = ITEMS_SEO[slug];
  const name = lang === 'de' ? item.nameDe : item.nameEn;
  const altName = lang === 'de' ? item.nameEn : item.nameDe;
  const flavor = (lang === 'de' ? item.flavorDe : item.flavorEn) ?? item.flavorEn;
  const effect = lang === 'de' ? item.effectDe : item.effectEn;
  const intro = t(`seo.itemData.${slug}.intro`);
  const qa1Lead = t(`seo.itemData.${slug}.qa1Lead`);
  const qa1Body = t(`seo.itemData.${slug}.qa1Body`);
  const qa2Body = t(`seo.itemData.${slug}.qa2Body`);
  const verdict = t(`seo.itemData.${slug}.verdict`);
  const verdictLead = t(`seo.itemData.${slug}.verdictLead`);
  const evolutionNames = (item.evolutionTargets ?? []).map((id) => nameOfPokemon(id, lang));

  const qa: Array<{ q: string; lead: string; body: string }> = [
    {
      q: t('seo.item.qa1q', { name }),
      lead: qa1Lead,
      body: qa1Body,
    },
    item.locationsFrlg?.length
      ? {
          q: t('seo.item.qa2q', { name }),
          lead: t('seo.item.qa2lead', {
            name,
            locations: item.locationsFrlg
              .map((l) => (lang === 'de' ? l.nameDe : l.nameEn))
              .join(lang === 'de' ? ' und ' : ' and '),
          }),
          body: qa2Body,
        }
      : {
          q: t('seo.item.qa2q', { name }),
          lead: t('seo.item.qa2leadNone', { name }),
          body: qa2Body,
        },
    {
      q: t('seo.item.qa3q', { name }),
      lead: verdictLead,
      body: verdict,
    },
  ];
  if (evolutionNames.length > 0) {
    qa.push({
      q: t('seo.item.qa4q', { name }),
      lead: t(`seo.item.qa4lead_${item.evolutionKind ?? 'stone'}`, { name }),
      body: evolutionNames.join(', '),
    });
  }

  return (
    <div className="mx-auto max-w-content px-4 pb-20 pt-6 md:px-8">
      <div className="max-w-3xl">
        {/* breadcrumb — mirrored by the JSON-LD BreadcrumbList */}
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex flex-wrap items-center gap-1 font-sans text-micro12 font-semibold text-tx-muted">
            <li>
              <LocaleLink to="/items" className="transition-colors hover:text-gold">
                {t('nav.items')}
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
            <Package size={11} />
            {t('seo.item.eyebrow')}
          </p>
          <div className="mt-2 flex items-center gap-4">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-lg border border-gold/30 bg-gold-soft">
              <ItemIcon slug={item.slug} name={name} size={44} />
            </span>
            <div className="min-w-0">
              <h1 className="font-display text-2xl font-extrabold tracking-wide text-tx-primary md:text-3xl">
                {name}
              </h1>
              <p className="mt-0.5 font-sans text-micro12 font-semibold text-tx-muted">
                {t('seo.item.altName', { name: altName })}
                {item.cost != null && <> · {t('seo.item.cost', { cost: item.cost })}</>}
              </p>
            </div>
          </div>
          <p className="mt-4 font-sans text-[0.875rem] leading-relaxed text-tx-secondary">
            {intro}
          </p>
        </header>

        <div className="flex flex-col gap-4">
          {/* effect */}
          <SectionCard eyebrow={t('seo.item.effectEyebrow')} title={t('seo.item.effectTitle')}>
            <div className="px-4 py-3.5 sm:px-5">
              <p className="font-sans text-micro13 leading-relaxed text-tx-secondary">
                <strong className="font-semibold text-tx-primary">{effect}</strong> {flavor}
              </p>
              <HonestyHint show={itemEffectIsMixedGen(item)} className="mt-2">
                {t('honesty.modernEffect')}
              </HonestyHint>
            </div>
          </SectionCard>

          {/* FRLG locations — only rendered when our enriched Kanto data has any */}
          {item.locationsFrlg && item.locationsFrlg.length > 0 && (
            <SectionCard eyebrow={t('seo.item.locationsEyebrow')} title={t('seo.item.locationsTitle')}>
              {item.locationsFrlg.map((loc) => (
                <LocaleLink
                  key={loc.node}
                  to={`/maps/kanto?node=${loc.node}`}
                  className="group flex items-center gap-2.5 border-b border-hairline/60 px-4 py-2.5 transition-colors last:border-b-0 hover:bg-surface2 sm:px-5"
                >
                  <MapPin size={13} className="shrink-0 text-gold" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-micro13 font-semibold text-tx-primary transition-colors group-hover:text-gold">
                      {lang === 'de' ? loc.nameDe : loc.nameEn}
                    </span>
                    {(loc.noteDe || loc.noteEn) && (
                      <span className="block text-micro11 text-tx-muted">
                        {(lang === 'de' ? loc.noteDe : loc.noteEn) ?? loc.noteEn}
                      </span>
                    )}
                  </span>
                  <span className="pixel-label shrink-0 text-[8px] text-tx-muted">
                    {t(`seo.item.${KIND_KEYS[loc.kind] ?? 'kindBall'}`)}
                  </span>
                </LocaleLink>
              ))}
              <HonestyHint show className="px-4 py-2 sm:px-5">
                {t('honesty.locationsFrlgField')}
              </HonestyHint>
              <p className="px-4 py-2.5 text-micro10 font-medium text-tx-muted sm:px-5">
                {t('seo.item.locationsSource')}
              </p>
            </SectionCard>
          )}

          {/* evolution targets */}
          {evolutionNames.length > 0 && (
            <SectionCard eyebrow={t('seo.item.evoEyebrow')} title={t('seo.item.evoTitle', { name })}>
              <div className="flex flex-wrap gap-x-4 gap-y-2 px-4 py-3.5 sm:px-5">
                {(item.evolutionTargets ?? []).map((id) => (
                  <LocaleLink
                    key={id}
                    to={`/pokemon/${id}`}
                    className="group flex items-center gap-2"
                    aria-label={nameOfPokemon(id, lang)}
                  >
                    <Sprite
                      id={id}
                      name={nameOfPokemon(id, lang)}
                      era="gen5"
                      className="h-[2.125rem] w-[2.125rem] transition-transform duration-150 group-hover:scale-110"
                    />
                    <span className="text-[0.7813rem] font-semibold text-tx-primary transition-colors group-hover:text-gold">
                      {nameOfPokemon(id, lang)}
                    </span>
                  </LocaleLink>
                ))}
              </div>
              <p className="border-t border-hairline/60 px-4 py-2.5 text-micro11 text-tx-muted sm:px-5">
                {t(`seo.item.evoNote_${item.evolutionKind ?? 'stone'}`)}
              </p>
            </SectionCard>
          )}

          {/* deep links */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="pixel-label mr-1 text-[8px] text-tx-muted">{t('seo.item.deepLinksEyebrow')}</span>
            <LocaleLink
              to="/versus"
              className="inline-flex h-8 items-center gap-1.5 rounded-md border border-gold/50 px-3 text-micro11 font-semibold text-gold transition-colors hover:bg-gold/10"
            >
              <Swords size={12} />
              {t('seo.item.versusCta')}
            </LocaleLink>
            <LocaleLink
              to="/pokedex"
              className="inline-flex h-8 items-center gap-1.5 rounded-md border border-hairline2 px-3 text-micro11 font-semibold text-tx-secondary transition-colors hover:bg-surface3 hover:text-gold"
            >
              <Crosshair size={12} />
              {t('seo.item.pokedexCta')}
            </LocaleLink>
          </div>

          {/* Q&A */}
          <QaSection
            className="mt-4"
            defaultOpen={2}
            items={qa.map((item2) => ({
              q: item2.q,
              a: (
                <p>
                  <strong className="font-semibold text-tx-primary">{item2.lead}</strong> {item2.body}
                </p>
              ),
            }))}
          />
        </div>
      </div>
    </div>
  );
}
