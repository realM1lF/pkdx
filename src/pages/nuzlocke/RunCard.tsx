/* Nuzlocke hub — run card (nuzlocke.md §1.3): name row, player clusters,
 * mini-timeline dot strip, KPIs, overflow menu. Hover lifts + gold border. */
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useLocalePath } from '@/lib/locale-link';
import i18n from '@/i18n';
import { motion } from 'framer-motion';
import { CloudUpload, Copy, HardDrive, MoreVertical, Pencil, CopyPlus, Archive } from 'lucide-react';
import { routeOrder, versionChipLabel } from '@/lib/regions';
import { anyRegionById } from '@/lib/regions-freeform';
import {
  archiveRun,
  duplicateAsSolo,
  kpisOf,
  pushToast,
  renameRun,
  soulLinksOf,
} from '@/lib/nuzlocke-store';
import type { RunEntry, RunState } from '@/lib/nuzlocke-store';
import { cn } from '@/lib/utils';
import { PixelLabel, Popover, RunStatusChip, timeAgo } from './ui';

type NameOf = (id: number) => string;

function MiniTimeline({ state, nameOf }: { state: RunState; nameOf: NameOf }) {
  const region = anyRegionById(state.run.region);
  const nodes = useMemo(() => (region ? routeOrder(region) : []), [region]);
  const links = soulLinksOf(state);
  const linkRoutes = new Set(links.map((l) => l.routeKey));
  const playerColor = (id: string) => state.players.find((p) => p.id === id)?.color ?? '#F6C945';

  const byRoute = useMemo(() => {
    const m = new Map<string, typeof state.encounters>();
    for (const e of state.encounters) {
      const list = m.get(e.route_key) ?? [];
      list.push(e);
      m.set(e.route_key, list);
    }
    return m;
  }, [state.encounters]);

  return (
    <div className="nz-strip-fade flex items-end gap-[6px] overflow-hidden py-1" aria-hidden>
      {nodes.map((n) => {
        const list = byRoute.get(n.id) ?? [];
        const dead = list.find((e) => e.status === 'dead');
        const caught = list.find((e) => e.status === 'caught');
        const missed = list.find((e) => e.status === 'missed' || e.status === 'duped');
        const tip = list.length
          ? `${n.label} — ${list
              .map((e) => {
                const p = state.players.find((pl) => pl.id === e.player_id)?.name ?? '?';
                return `${p}: ${nameOf(e.pokemon_id)} Lv ${e.level}${e.status === 'dead' ? ' ✝' : ''}`;
              })
              .join(' · ')}`
          : n.label;
        return (
          <span key={n.id} className="relative flex flex-col items-center" title={tip}>
            {dead ? (
              <svg width="6" height="6" viewBox="0 0 8 8" className="text-tx-muted">
                <path d="M1 1l6 6M7 1l-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            ) : caught ? (
              <span className="h-[4px] w-[4px] rounded-full" style={{ background: playerColor(caught.player_id) }} />
            ) : missed ? (
              <span className="h-[4px] w-[4px] rounded-full border border-gold/70" />
            ) : (
              <span className="h-[4px] w-[4px] rounded-full border border-tx-muted/30" />
            )}
            {linkRoutes.has(n.id) && <span className="mt-[1px] h-[2px] w-[8px] rounded-full bg-gold/80" />}
          </span>
        );
      })}
    </div>
  );
}

export default function RunCard({ state, entry, index, nameOf }: { state: RunState; entry?: RunEntry; index: number; nameOf: NameOf }) {
  const navigate = useNavigate();
  const localePath = useLocalePath();
  const { t } = useTranslation();
  const region = anyRegionById(state.run.region);
  const k = kpisOf(state);
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmArchive, setConfirmArchive] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [nameDraft, setNameDraft] = useState(state.run.name);
  const last = state.encounters[state.encounters.length - 1]?.created_at ?? state.run.created_at;

  const open = () => navigate(localePath(`/nuzlocke/${state.run.id}`));
  const multi = state.mode === 'multi';

  return (
    <motion.article
      initial={{ y: 24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onClick={open}
      className="group col-span-12 cursor-pointer rounded-lg border border-hairline bg-surface1 p-4 transition-all duration-200 hover:-translate-y-1 hover:border-gold/35 lg:col-span-6"
      aria-label={t('nuz.openRun', { name: state.run.name })}
    >
      {/* row 1 — name / chips */}
      <div className="flex items-center gap-2">
        {renaming ? (
          <input
            autoFocus
            value={nameDraft}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => setNameDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                renameRun(state.run.id, nameDraft);
                setRenaming(false);
              }
              if (e.key === 'Escape') setRenaming(false);
            }}
            onBlur={() => {
              renameRun(state.run.id, nameDraft);
              setRenaming(false);
            }}
            className="h-7 flex-1 rounded-sm border border-gold/60 bg-surface2 px-2 font-display text-[15px] font-bold text-tx-primary outline-none"
          />
        ) : (
          <h3 className="truncate font-display text-[16px] font-bold text-tx-primary">{state.run.name}</h3>
        )}
        <span
          className="shrink-0 rounded-full border px-2 py-0.5 font-pixel text-[7px] tracking-[0.08em]"
          style={{ borderColor: `${region?.accent ?? '#F6C945'}66`, color: region?.accent ?? '#F6C945' }}
        >
          {versionChipLabel(state.run.game)}
        </span>
        <RunStatusChip status={state.run.status} />
        <span className="ml-auto flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <span title={multi ? t('nuz.card.multiTip') : t('nuz.card.soloTip')} className="text-tx-muted">
            {multi ? <CloudUpload size={14} /> : <HardDrive size={14} />}
          </span>
          <Popover
            open={menuOpen}
            onClose={() => {
              setMenuOpen(false);
              setConfirmArchive(false);
            }}
            align="right"
            anchor={
              <button
                type="button"
                aria-label={t('nuz.card.options')}
                onClick={() => setMenuOpen((o) => !o)}
                className="grid h-6 w-6 place-items-center rounded-sm text-tx-muted transition-colors hover:bg-surface3 hover:text-gold"
              >
                <MoreVertical size={14} />
              </button>
            }
            className="w-[190px] py-1"
          >
            {[
              { icon: Pencil, label: t('nuz.card.rename'), act: () => { setMenuOpen(false); setRenaming(true); } },
              { icon: CopyPlus, label: t('nuz.card.duplicate'), act: () => { const id = duplicateAsSolo(state.run.id); if (id) pushToast('success', i18n.t('nuz.card.duplicated')); setMenuOpen(false); } },
              {
                icon: Copy,
                label: t(multi ? 'nuz.card.copyInvite' : 'nuz.card.copyInviteOnline'),
                act: () => {
                  if (state.run.invite_code) {
                    void navigator.clipboard?.writeText(state.run.invite_code).catch(() => undefined);
                    pushToast('success', i18n.t('nuz.toast.inviteCopied', { code: state.run.invite_code }));
                  }
                  setMenuOpen(false);
                },
                dim: !multi,
              },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={item.act}
                className={cn('flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] transition-colors hover:bg-surface3', item.dim ? 'text-tx-muted/50' : 'text-tx-secondary hover:text-gold')}
              >
                <item.icon size={13} /> {item.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                if (!confirmArchive) {
                  setConfirmArchive(true);
                  return;
                }
                archiveRun(state.run.id);
                pushToast('info', i18n.t('nuz.toast.archived'));
                setMenuOpen(false);
              }}
              className={cn(
                'flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] transition-colors hover:bg-surface3',
                confirmArchive ? 'border border-gold/50 text-gold' : 'text-tx-secondary hover:text-gold',
              )}
            >
              <Archive size={13} /> {confirmArchive ? t('nuz.card.confirmArchive') : t('nuz.card.archive')}
            </button>
          </Popover>
        </span>
      </div>

      {/* row 2 — players */}
      <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1">
        {[...state.players]
          .sort((a, b) => a.slot - b.slot)
          .map((p) => {
            const total = state.encounters.filter((e) => e.player_id === p.id).length;
            const alive = state.encounters.filter((e) => e.player_id === p.id && e.status === 'caught').length;
            const online = multi && entry?.online[p.id];
            return (
              <span key={p.id} className="flex items-center gap-1.5" title={t('nuz.card.playerTip', { name: p.name, alive, total })}>
                <span className={cn('h-2.5 w-2.5 rounded-full', online && 'nz-presence-ring')} style={{ background: p.color }} />
                <span className="text-[12px] font-semibold text-tx-primary">{p.name}</span>
                <span className="text-[10px] tabular-nums text-tx-muted">
                  {alive}/{total}
                </span>
              </span>
            );
          })}
      </div>

      {/* row 3 — mini timeline */}
      <div className="mt-2 transition-opacity duration-200 group-hover:opacity-100 opacity-80">
        <MiniTimeline state={state} nameOf={nameOf} />
      </div>

      {/* row 4 — KPIs */}
      <div className="mt-2 flex items-center gap-4 border-t border-hairline pt-2">
        <span className="flex items-baseline gap-1.5">
          <PixelLabel>{t('nuz.card.caught')}</PixelLabel>
          <span className="font-display text-[14px] font-bold tabular-nums text-tx-primary">{k.caught}</span>
        </span>
        <span className="flex items-baseline gap-1.5">
          <PixelLabel>{t('nuz.card.dead')}</PixelLabel>
          <span className="font-display text-[14px] font-bold tabular-nums text-tx-primary">{k.dead}</span>
        </span>
        <span className="flex items-baseline gap-1.5">
          <img src="/sparkle.svg" alt="" className="h-2.5 w-2.5 self-center" />
          <PixelLabel>{t('nuz.card.links')}</PixelLabel>
          <span className="font-display text-[14px] font-bold tabular-nums text-gold">{k.links}</span>
        </span>
        <span className="ml-auto font-pixel text-[7px] tracking-[0.08em] text-tx-muted">{t('nuz.card.lastMove', { time: timeAgo(last, true) })}</span>
      </div>
    </motion.article>
  );
}
