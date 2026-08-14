/* Orre Shadow Tracker — Colosseum 48 / XD 83 checklist + missed recovery. */
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Search } from 'lucide-react'
import Sprite from '@/components/Sprite'
import { anyRegionById } from '@/lib/regions-freeform'
import { nodeName } from '@/lib/regions'
import { nameOfPokemon, nameOfType, useLanguage } from '@/lib/i18n-data'
import type { Lang } from '@/lib/i18n-data'
import { LocaleLink } from '@/lib/locale-link'
import { pokemonHref } from '@/lib/edition-nav'
import { genTypesOf } from '@/lib/gen-dex'
import { TYPE_COLORS } from '@/lib/types'
import type { PokemonType } from '@/lib/types'
import { bootNameIndex } from '@/lib/pokeapi'
import type { DexIndexEntry } from '@/lib/types'
import { counts, getStatus, setStatus, subscribeOrreProgress } from '@/lib/orre-progress'
import { pokeSpotArtifact, pokeSpots, shadowNotesToShow, shadowsFor, ORRE_EXPECTED_COUNTS } from '@/lib/orre'
import type { OrreGame, OrreShadow, ShadowStatus } from '@/lib/orre-types'
import { cn } from '@/lib/utils'

type StatusFilter = 'all' | ShadowStatus

const STATUS_CYCLE: ShadowStatus[] = ['remaining', 'snagged', 'missed']

/** XD-only wild tables — the three Poké Spots, bait-based, no trainer involved. */
function PokeSpotDeck({ nameIdx, lang }: { nameIdx: Map<string, DexIndexEntry>; lang: Lang }) {
  const { t } = useTranslation()
  const monName = (slug: string) => {
    const entry = nameIdx.get(slug)
    return entry ? nameOfPokemon(entry.id, lang) : slug
  }

  return (
    <section className="mt-8">
      <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 className="font-display text-lg font-extrabold tracking-wide text-tx-primary">
          {t('orre.pokeSpots.title')}
        </h2>
        <span className="rounded-full border border-gold/50 px-1.5 py-0.5 font-pixel text-[7px] tracking-[0.08em] text-gold">
          {t('orre.pokeSpots.bait')}
        </span>
        <p className="w-full text-[12px] leading-relaxed text-tx-secondary">{t('orre.pokeSpots.intro')}</p>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {pokeSpots().map((spot) => (
          <div key={spot.id} className="rounded-md border border-hairline bg-surface1 p-2.5">
            <p className="font-display text-[13px] font-bold text-tx-primary">
              {lang === 'de' ? spot.nameDe : spot.label}
            </p>
            <ul className="mt-1.5 divide-y divide-hairline">
              {spot.encounters.map((e) => {
                const entry = nameIdx.get(e.species)
                return (
                  <li key={e.species} className="flex min-h-[36px] items-center gap-2 py-1">
                    {entry ? (
                      <LocaleLink
                        to={pokemonHref(entry.id, { game: 'xd' })}
                        className="flex min-w-0 flex-1 items-center gap-2"
                      >
                        <span className="h-8 w-8 shrink-0">
                          <Sprite id={entry.id} name={monName(e.species)} era="default" className="h-8 w-8" />
                        </span>
                        <span className="min-w-0 flex-1 truncate text-[12px] font-semibold text-tx-primary">
                          {monName(e.species)}
                        </span>
                      </LocaleLink>
                    ) : (
                      <>
                        <span className="block h-8 w-8 shrink-0 rounded bg-surface2" />
                        <span className="min-w-0 flex-1 truncate text-[12px] font-semibold text-tx-primary">
                          {monName(e.species)}
                        </span>
                      </>
                    )}
                    <span className="shrink-0 font-pixel text-[7px] text-tx-muted">
                      {t('orre.pokeSpots.levelRange', { min: e.minLevel, max: e.maxLevel })}
                    </span>
                    <span className="w-9 shrink-0 text-right text-[11px] tabular-nums text-gold/90">
                      {t('orre.pokeSpots.rate', { rate: e.rate })}
                    </span>
                  </li>
                )
              })}
            </ul>
            <p className="mt-1.5 text-[11px] leading-snug text-tx-muted">
              {t('orre.pokeSpots.tradeHint', {
                give: monName(spot.trade.give),
                receive: monName(spot.trade.receive),
                npc: lang === 'de' ? spot.trade.npcDe : spot.trade.npc,
              })}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="font-pixel text-[8px] tracking-[0.08em] text-tx-muted">{t('orre.pokeSpots.visitors')}:</span>
        {pokeSpotArtifact().visitors.map((v) => (
          <span
            key={v.species}
            title={t(v.species === 'bonsly' ? 'orre.pokeSpots.visitorHintBonsly' : 'orre.pokeSpots.visitorHintMunchlax')}
            className="flex items-center gap-1.5 rounded-full border border-hairline2 px-2 py-0.5 text-[11px] text-tx-secondary"
          >
            {monName(v.species)}
            <span className="tabular-nums text-tx-muted">{t('orre.pokeSpots.rate', { rate: v.chance })}</span>
          </span>
        ))}
      </div>
    </section>
  )
}

export default function OrreTracker() {
  const { t } = useTranslation()
  const lang = useLanguage()
  const region = anyRegionById('orre')
  const [game, setGame] = useState<OrreGame>('colosseum')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [requiredOnly, setRequiredOnly] = useState(false)
  const [query, setQuery] = useState('')
  const [tick, setTick] = useState(0)
  const [nameIdx, setNameIdx] = useState<Map<string, DexIndexEntry>>(() => new Map())

  useEffect(() => {
    void bootNameIndex().then((list) => {
      setNameIdx(new Map(list.map((e) => [e.name, e])))
    })
  }, [])

  useEffect(() => subscribeOrreProgress(() => setTick((n) => n + 1)), [])

  const shadows = useMemo(() => shadowsFor(game), [game])
  const tally = useMemo(() => counts(game), [game, tick])

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    const nodeById = new Map(region?.nodes.map((n) => [n.id, n]) ?? [])
    return shadows.filter((s) => {
      if (requiredOnly && !s.required) return false
      const st = getStatus(game, s.id)
      if (statusFilter !== 'all' && st !== statusFilter) return false
      if (!q) return true
      const node = nodeById.get(s.locationId)
      const loc = node ? nodeName(node, lang) : s.locationId
      const entry = nameIdx.get(s.species)
      const mon = entry ? nameOfPokemon(entry.id, lang) : s.species
      return (
        mon.toLowerCase().includes(q) ||
        s.species.includes(q) ||
        s.trainer.toLowerCase().includes(q) ||
        loc.toLowerCase().includes(q)
      )
    })
  }, [shadows, game, statusFilter, requiredOnly, query, region, lang, nameIdx, tick])

  const cycleStatus = (s: OrreShadow) => {
    const cur = getStatus(game, s.id)
    const next = STATUS_CYCLE[(STATUS_CYCLE.indexOf(cur) + 1) % STATUS_CYCLE.length]!
    setStatus(game, s.id, next)
    setTick((n) => n + 1)
  }

  const statusLabel = (st: ShadowStatus) =>
    st === 'snagged' ? t('orre.statusSnagged') : st === 'missed' ? t('orre.statusMissed') : t('orre.statusRemaining')

  return (
    <div className="mx-auto max-w-content px-4 pb-20 pt-6 md:px-8">
      <header className="mb-6 max-w-3xl">
        <p className="pixel-label text-[9px] text-gold">{t('orre.eyebrow')}</p>
        <h1 className="font-display text-2xl font-extrabold tracking-wide text-tx-primary md:text-3xl">
          {t('orre.title')}
        </h1>
        <p className="mt-3 font-sans text-[14px] leading-relaxed text-tx-secondary">
          {t('orre.intro', { colo: ORRE_EXPECTED_COUNTS.colosseum, xd: ORRE_EXPECTED_COUNTS.xd })}
        </p>
        <p className="mt-2 font-pixel text-[9px] tracking-[0.08em] text-tx-muted">
          {t('orre.counts', tally)}
        </p>
        <LocaleLink
          to="/nuzlocke?region=orre&wizard=1"
          className="mt-4 inline-flex rounded-md border border-gold/60 px-3 py-2 font-pixel text-[8px] tracking-[0.08em] text-gold transition-colors hover:bg-gold/10"
        >
          {t('orre.openNuzlocke')}
        </LocaleLink>
      </header>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {(['colosseum', 'xd'] as OrreGame[]).map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => setGame(g)}
            className={cn(
              'rounded-md border px-3 py-1.5 font-pixel text-[8px] tracking-[0.08em] transition-colors',
              game === g ? 'border-gold bg-gold/15 text-gold' : 'border-hairline2 text-tx-muted hover:border-gold/50',
            )}
          >
            {g === 'colosseum' ? t('orre.gameColosseum') : t('orre.gameXd')}
          </button>
        ))}
        <span className="mx-1 h-4 w-px bg-hairline2" />
        {([
          ['all', 'orre.filterAll'],
          ['remaining', 'orre.filterRemaining'],
          ['snagged', 'orre.filterSnagged'],
          ['missed', 'orre.filterMissed'],
        ] as const).map(([id, key]) => (
          <button
            key={id}
            type="button"
            onClick={() => setStatusFilter(id)}
            className={cn(
              'rounded-md border px-2.5 py-1.5 font-pixel text-[8px] tracking-[0.08em] transition-colors',
              statusFilter === id ? 'border-gold bg-gold/15 text-gold' : 'border-hairline2 text-tx-muted hover:border-gold/50',
            )}
          >
            {t(key)}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setRequiredOnly((v) => !v)}
          className={cn(
            'rounded-md border px-2.5 py-1.5 font-pixel text-[8px] tracking-[0.08em] transition-colors',
            requiredOnly ? 'border-gold bg-gold/15 text-gold' : 'border-hairline2 text-tx-muted hover:border-gold/50',
          )}
        >
          {t('orre.requiredOnly')}
        </button>
      </div>

      <div className="relative mb-3 max-w-md">
        <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-tx-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('orre.searchPlaceholder')}
          className="h-10 w-full rounded-md border border-hairline bg-surface1 pl-9 pr-3 text-[13px] text-tx-primary outline-none placeholder:text-tx-muted focus:border-gold"
        />
      </div>

      <div
        data-lenis-prevent
        className="max-h-[min(70vh,720px)] overflow-y-auto rounded-md border border-hairline bg-surface1"
      >
        {rows.length === 0 ? (
          <p className="px-4 py-8 text-center text-[13px] text-tx-muted">{t('orre.empty')}</p>
        ) : (
          <ul className="divide-y divide-hairline">
            {rows.map((s) => {
              const st = getStatus(game, s.id)
              const entry = nameIdx.get(s.species)
              const monName = entry ? nameOfPokemon(entry.id, lang) : s.species
              const node = region?.nodes.find((n) => n.id === s.locationId)
              const loc = node && region ? nodeName(node, lang) : s.locationId
              const shown = shadowNotesToShow(s)
              return (
                <li key={s.id} className="flex min-h-[44px] items-center gap-3 px-3 py-1.5">
                  {entry ? (
                    <LocaleLink to={pokemonHref(entry.id, { game })} className="h-9 w-9 shrink-0">
                      <Sprite id={entry.id} name={monName} era="default" className="h-9 w-9" />
                    </LocaleLink>
                  ) : (
                    <span className="block h-9 w-9 shrink-0 rounded bg-surface2" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 items-baseline gap-2">
                      {entry ? (
                        <LocaleLink
                          to={pokemonHref(entry.id, { game })}
                          className="truncate font-display text-[13px] font-bold text-tx-primary hover:text-gold"
                        >
                          {monName}
                        </LocaleLink>
                      ) : (
                        <span className="truncate font-display text-[13px] font-bold text-tx-primary">{monName}</span>
                      )}
                      <span className="shrink-0 font-pixel text-[8px] text-tx-muted">
                        {t('orre.level')}
                        {s.level}
                      </span>
                      {genTypesOf(game, s.species, []).map((tp) => {
                        const c = TYPE_COLORS[tp as PokemonType]
                        return (
                          <span
                            key={tp}
                            className="shrink-0 rounded-full px-1.5 text-[8px] font-bold uppercase leading-[14px]"
                            style={{ background: `rgba(${c?.rgb ?? '168,176,181'},0.18)`, color: c?.base ?? '#A9B0B5' }}
                          >
                            {nameOfType(tp, lang)}
                          </span>
                        )
                      })}
                    </div>
                    <div className="truncate text-[11px] text-tx-secondary">
                      <span className="text-tx-muted">{t('orre.trainer')}: </span>
                      {s.trainer}
                      <span className="mx-1.5 text-tx-muted">·</span>
                      <span className="text-tx-muted">{t('orre.location')}: </span>
                      {loc}
                    </div>
                    {shown.notes && (
                      <p className="mt-0.5 truncate text-[10px] text-tx-muted">{shown.notes}</p>
                    )}
                    {st === 'missed' && shown.reappearNote && (
                      <p className="mt-0.5 truncate text-[11px] text-gold/90">
                        {t('orre.reappears')}: {shown.reappearNote}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => cycleStatus(s)}
                    className={cn(
                      'shrink-0 rounded-md border px-2 py-1 font-pixel text-[8px] tracking-[0.06em]',
                      st === 'snagged' && 'border-[rgba(99,217,107,0.5)] text-[#63D96B]',
                      st === 'missed' && 'border-gold/60 text-gold',
                      st === 'remaining' && 'border-hairline2 text-tx-muted',
                    )}
                  >
                    {statusLabel(st)}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {game === 'xd' && <PokeSpotDeck nameIdx={nameIdx} lang={lang} />}
    </div>
  )
}
