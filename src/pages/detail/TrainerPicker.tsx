/* Shared trainer picker — gym leaders, E4, champion, rivals, route (versus community overhaul). */
import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { ChevronDown, Crown, Footprints, Search, Shield, Skull, Swords } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Sprite from '@/components/Sprite';
import { nameOfPokemon, useLanguage } from '@/lib/i18n-data';
import type { RegionId } from '@/lib/regions';
import { trainerGroupKey } from '@/lib/trainer-data';
import type { EnrichedTrainer } from '@/lib/versus';
import { cn } from '@/lib/utils';

type TrainerGroup = ReturnType<typeof trainerGroupKey>;

const GROUPS: Array<{ key: TrainerGroup; labelKey: string; icon: ReactNode }> = [
  { key: 'leaders', labelKey: 'versus.trainerGroupLeaders', icon: <Shield size={9} /> },
  { key: 'e4', labelKey: 'versus.trainerGroupE4', icon: <Crown size={9} /> },
  { key: 'boss', labelKey: 'versus.trainerGroupBoss', icon: <Skull size={9} /> },
  { key: 'rival', labelKey: 'versus.trainerGroupRival', icon: <Swords size={9} /> },
  { key: 'route', labelKey: 'versus.trainerGroupRoute', icon: <Footprints size={9} /> },
];

export interface TrainerPickerProps {
  trainers: EnrichedTrainer[];
  region: RegionId;
  idOf: (slug: string) => number;
  onPick: (t: EnrichedTrainer, member: { species: string; level: number; moves?: string[] }) => void;
}

function nodeLabel(node: string, region: RegionId): string {
  const prefix = `${region}-`;
  return node.replace(new RegExp(`^${prefix}`), '').replace(/-/g, ' ');
}

function PartySprite({ id, big = false }: { id: number; big?: boolean }) {
  if (!id) return <span className={cn('inline-block rounded-full bg-surface3', big ? 'h-6 w-6' : 'h-5 w-5')} />;
  return (
    <Sprite
      id={id}
      name="party member"
      className={cn('shrink-0 rounded-full bg-surface2 ring-1 ring-hairline', big ? 'h-6 w-6' : 'h-5 w-5')}
      skeleton={false}
    />
  );
}

export default function TrainerPicker({ trainers, region, idOf, onPick }: TrainerPickerProps) {
  const { t } = useTranslation();
  const lang = useLanguage();
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return trainers;
    return trainers.filter(
      (tr) =>
        tr.name.toLowerCase().includes(needle) ||
        tr.class.toLowerCase().includes(needle) ||
        nodeLabel(tr.node, region).includes(needle) ||
        tr.party.some((m) => m.species.includes(needle) || nameOfPokemon(m.species, lang).toLowerCase().includes(needle)),
    );
  }, [trainers, q, region, lang]);

  if (!trainers.length) {
    return (
      <div className="flex h-24 items-center justify-center px-4">
        <p className="text-center font-sans text-[11px] text-tx-muted">{t('versus.noTrainersRegion')}</p>
      </div>
    );
  }

  const keyBattlesOnly = trainers.every((tr) => trainerGroupKey(tr) !== 'route');

  return (
    <div>
      <div className="border-b border-hairline px-3 py-2">
        <div className="vs-input vs-input--combo h-7 w-full text-[11px]">
          <Search size={12} className="pointer-events-none shrink-0 text-tx-muted" />
          <input
            className="vs-input-field"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t('versus.trainerSearch')}
            aria-label={t('versus.trainerSearch')}
          />
        </div>
      </div>
      {keyBattlesOnly && (
        <p className="border-b border-hairline px-3 py-2 font-sans text-[10px] leading-snug text-gold/90">
          {t('versus.trainersKeyBattlesOnly')}
        </p>
      )}
      <div className="nz-slim-scroll max-h-[300px] overflow-auto" data-lenis-prevent>
        {GROUPS.map((g) => {
          const rows = filtered.filter((tr) => trainerGroupKey(tr) === g.key);
          if (!rows.length) return null;
          return (
            <div key={g.key}>
              <div className="flex items-center gap-1.5 border-b border-hairline px-3 py-1.5 text-gold">
                {g.icon}
                <span className="pixel-label text-[7px]">{t(g.labelKey)}</span>
              </div>
              {rows.map((tr, i) => {
                const key = `${tr.node}:${tr.name}:${i}`;
                const open = openKey === key;
                return (
                  <div key={key}>
                    <button
                      type="button"
                      onClick={() => setOpenKey(open ? null : key)}
                      className="flex h-[36px] w-full items-center gap-2 border-b border-hairline/60 px-3 text-left transition-colors duration-150 hover:bg-surface2"
                    >
                      <span className="min-w-0 flex-1 truncate font-sans text-[12px] font-semibold text-tx-primary">
                        {tr.name}
                        <span className="ml-2 font-sans text-[9px] font-normal uppercase text-tx-muted">{nodeLabel(tr.node, region)}</span>
                      </span>
                      <span className="flex shrink-0 -space-x-1.5">
                        {tr.party.slice(0, 6).map((m, j) => (
                          <PartySprite key={j} id={idOf(m.species)} />
                        ))}
                      </span>
                      <ChevronDown size={11} className={cn('shrink-0 text-tx-muted transition-transform duration-150', open && 'rotate-180')} />
                    </button>
                    {open && (
                      <div className="grid grid-cols-2 gap-1 border-b border-hairline bg-abyss/40 p-2 sm:grid-cols-3">
                        {tr.party.map((m, j) => (
                          <button
                            key={j}
                            type="button"
                            onClick={() => onPick(tr, m)}
                            className="flex h-[30px] items-center gap-1.5 rounded-md border border-hairline px-1.5 transition-colors duration-150 hover:border-gold/50 hover:bg-gold/15"
                          >
                            <PartySprite id={idOf(m.species)} big />
                            <span className="min-w-0 flex-1 truncate text-left font-sans text-[11px] font-semibold text-tx-primary">
                              {nameOfPokemon(m.species, lang)}
                            </span>
                            <span className="pixel-label shrink-0 text-[7px] text-gold">LV{m.level}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="px-3 py-4 font-sans text-[11px] text-tx-muted">{t('versus.noMatches')}</div>
        )}
      </div>
    </div>
  );
}
