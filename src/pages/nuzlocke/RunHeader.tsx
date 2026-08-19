/* Nuzlocke run — header (nuzlocke.md §2.1): back link, inline rename,
 * chips, player pills with presence, invite / go-online, overflow menu. */
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { LocaleLink, useLocalePath } from '@/lib/locale-link';
import { useLanguage } from '@/lib/i18n-data';
import i18n from '@/i18n';
import { motion } from 'framer-motion';
import { Archive, ArchiveRestore, ArrowLeft, Check, Flag, Link2, MoreVertical, Pencil, Share2, Skull, SlidersHorizontal, Swords, Trash2 } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { regionName, versionChipLabel } from '@/lib/regions';
import { anyRegionById } from '@/lib/regions-freeform';
import {
  archiveRun,
  deleteRunForever,
  exportRunSummary,
  goOnline,
  isCloudRun,
  isRunArchived,
  isRunOwner,
  myPlayerId,
  pushToast,
  renamePlayer,
  renameRun,
  restoreRun,
  setRunStatus,
} from '@/lib/nuzlocke-store';
import type { RunEntry } from '@/lib/nuzlocke-store';
import { cn } from '@/lib/utils';
import { PixelLabel, Popover, RunStatusChip, SyncBadge } from './ui';
import { RulesEditor } from './RulesBar';

export default function RunHeader({
  entry,
  nameOf,
  routeLabel,
}: {
  entry: RunEntry;
  nameOf: (id: number) => string;
  routeLabel: (key: string) => string;
}) {
  const navigate = useNavigate();
  const localePath = useLocalePath();
  const { t } = useTranslation();
  const lang = useLanguage();
  const { user, ready: authReady } = useAuth();
  const state = entry.state;
  const [renaming, setRenaming] = useState(false);
  const [draft, setDraft] = useState('');
  const [renamingPlayerId, setRenamingPlayerId] = useState<string | null>(null);
  const [playerDraft, setPlayerDraft] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [goingOnline, setGoingOnline] = useState(false);
  const [confirm, setConfirm] = useState<null | 'archive' | 'delete'>(null);
  if (!state) return null;
  const region = anyRegionById(state.run.region);
  const owner = isRunOwner(state.run.id);
  const archived = isRunArchived(state.run.id);
  const multi = state.mode === 'multi';
  const mine = myPlayerId(state.run.id);

  const commitPlayerRename = () => {
    if (!renamingPlayerId) return;
    renamePlayer(state.run.id, renamingPlayerId, playerDraft);
    setRenamingPlayerId(null);
  };

  const copyInvite = () => {
    if (!state.run.invite_code) return;
    void navigator.clipboard?.writeText(state.run.invite_code).catch(() => undefined);
    setCopied(true);
    pushToast('success', i18n.t('nuz.toast.inviteCopied', { code: state.run.invite_code }));
    window.setTimeout(() => setCopied(false), 1500);
  };

  const copySummary = () => {
    const summary = exportRunSummary(state, {
      nameOf,
      routeLabel,
      regionLabel: region ? regionName(region, lang) : state.run.region,
      gameLabel: versionChipLabel(state.run.game),
    });
    void navigator.clipboard?.writeText(summary).catch(() => undefined);
    pushToast('success', i18n.t('nuz.exportCopied'));
    setMenuOpen(false);
  };

  return (
    <motion.header initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.35 }} className="flex flex-wrap items-center gap-3 py-4">
      <LocaleLink to="/nuzlocke" className="flex items-center gap-1 font-pixel text-[8px] tracking-[0.08em] text-tx-muted transition-colors hover:text-gold">
        <ArrowLeft size={12} /> {t('nuz.backToRuns')}
      </LocaleLink>
      <span className="h-5 w-px bg-hairline2" />

      {renaming ? (
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              renameRun(state.run.id, draft);
              setRenaming(false);
            }
            if (e.key === 'Escape') setRenaming(false);
          }}
          onBlur={() => {
            renameRun(state.run.id, draft);
            setRenaming(false);
          }}
          className="h-9 rounded-md border border-gold/60 bg-surface2 px-2 font-display text-[1.25rem] font-extrabold text-tx-primary outline-none"
        />
      ) : (
        <h1
          className={cn('font-display text-[clamp(1.125rem,2.4vw,24px)] font-extrabold text-tx-primary', owner && 'cursor-text')}
          title={owner ? t('nuz.header.renameTip') : undefined}
          onClick={() => {
            if (!owner) return;
            setDraft(state.run.name);
            setRenaming(true);
          }}
        >
          {state.run.name}
        </h1>
      )}

      <span
        className="rounded-full border px-2 py-0.5 font-pixel text-[8px] tracking-[0.08em]"
        style={{ borderColor: `${region?.accent ?? '#F6C945'}66`, color: region?.accent ?? '#F6C945' }}
      >
        {versionChipLabel(state.run.game)}
      </span>
      <span className="rounded-full border border-hairline2 px-2 py-0.5 font-pixel text-[8px] tracking-[0.08em] text-tx-muted">
        {region ? regionName(region, lang) : state.run.region}
      </span>
      <RunStatusChip status={state.run.status} />
      <SyncBadge
        status={
          entry.hydrateError
            ? 'error'
            : multi || (state && isCloudRun(state))
              ? entry.status
              : 'local'
        }
      />

      {/* right cluster */}
      <div className="ml-auto flex flex-wrap items-center gap-2">
        {/* player pills — own slot rename only */}
        {[...state.players]
          .sort((a, b) => a.slot - b.slot)
          .map((p, i) => {
            const alive = state.encounters.filter((e) => e.player_id === p.id && e.status === 'caught').length;
            const dead = state.encounters.filter((e) => e.player_id === p.id && e.status === 'dead').length;
            const online = multi && !!entry.online[p.id];
            const isMine = mine === p.id;
            if (renamingPlayerId === p.id) {
              return (
                <motion.span
                  key={p.id}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex h-9 items-center gap-1.5 rounded-full border border-gold/60 bg-surface1 px-2"
                >
                  <span className={cn('h-2.5 w-2.5 shrink-0 rounded-full', online && 'nz-presence-ring')} style={{ background: p.color }} />
                  <input
                    autoFocus
                    value={playerDraft}
                    maxLength={18}
                    onChange={(e) => setPlayerDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') commitPlayerRename();
                      if (e.key === 'Escape') setRenamingPlayerId(null);
                    }}
                    onBlur={commitPlayerRename}
                    className="w-[7rem] bg-transparent text-micro12 font-semibold text-tx-primary outline-none"
                    aria-label={t('nuz.header.renamePlayerTip')}
                  />
                </motion.span>
              );
            }
            return (
              <motion.span
                key={p.id}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 420, damping: 30, delay: i * 0.05 }}
                title={isMine ? t('nuz.header.renamePlayerTip') : t('nuz.header.playerTip', { name: p.name, alive, dead })}
                onClick={() => {
                  if (!isMine) return;
                  setPlayerDraft(p.name);
                  setRenamingPlayerId(p.id);
                }}
                className={cn(
                  'flex h-9 items-center gap-1.5 rounded-full border border-hairline bg-surface1 px-3',
                  isMine && 'cursor-text hover:border-gold/50',
                )}
              >
                <span className={cn('h-2.5 w-2.5 rounded-full', online && 'nz-presence-ring')} style={{ background: p.color }} />
                <span className="text-micro12 font-semibold text-tx-primary">{p.name}</span>
                <span className="text-micro10 tabular-nums text-tx-muted">{alive}</span>
              </motion.span>
            );
          })}

        {/* team builder */}
        <LocaleLink
          to={`/team?fromRun=${state.run.id}`}
          className="flex h-9 items-center gap-1.5 rounded-md border border-hairline2 px-3 text-micro12 font-semibold text-tx-secondary transition-colors hover:border-gold/50 hover:text-gold"
        >
          <Swords size={13} /> {t('nuz.openInBuilder')}
        </LocaleLink>

        {/* invite / go online */}
        {multi ? (
          <button
            type="button"
            onClick={copyInvite}
            className="flex h-9 items-center gap-1.5 rounded-md border border-gold/60 px-3 text-micro12 font-semibold text-gold transition-colors hover:bg-gold/10"
          >
            {copied ? <Check size={13} /> : <Link2 size={13} />}
            {copied ? state.run.invite_code : t('nuz.header.invite')}
          </button>
        ) : (
          <Popover
            open={inviteOpen}
            onClose={() => setInviteOpen(false)}
            align="right"
            anchor={
              <button
                type="button"
                onClick={() => setInviteOpen((o) => !o)}
                className="flex h-9 items-center gap-1.5 rounded-md border border-gold/60 px-3 text-micro12 font-semibold text-gold transition-colors hover:bg-gold/10"
              >
                <Link2 size={13} /> {t('nuz.header.invite')}
              </button>
            }
            className="w-[15rem] p-3"
          >
            <PixelLabel className="text-gold">{t('nuz.header.soloRun')}</PixelLabel>
            {!authReady || user ? (
              <>
                <p className="mt-1.5 text-micro12 leading-snug text-tx-secondary">{t('nuz.header.soloBody')}</p>
                <button
                  type="button"
                  disabled={goingOnline || !authReady || !user}
                  onClick={() => {
                    setGoingOnline(true);
                    void goOnline(state.run.id).then((ok) => {
                      setGoingOnline(false);
                      if (ok) setInviteOpen(false);
                    });
                  }}
                  className="nz-sheen mt-2.5 w-full rounded-md border border-gold/60 bg-[linear-gradient(135deg,rgba(246,201,69,0.25),rgba(246,201,69,0.10))] py-2 font-display text-micro11 font-bold tracking-[0.06em] text-tx-primary disabled:opacity-50"
                >
                  {goingOnline ? t('nuz.header.goingOnline') : t('nuz.header.goOnline')}
                </button>
              </>
            ) : (
              <>
                <p className="mt-1.5 text-micro12 leading-snug text-tx-secondary">{t('nuz.header.loginToGoOnline')}</p>
                <LocaleLink
                  to="/account"
                  className="mt-2.5 block w-full rounded-md border border-gold/60 py-2 text-center font-pixel text-[8px] tracking-[0.08em] text-gold transition-colors hover:bg-gold/10"
                >
                  {t('nuz.wizard.loginCta')}
                </LocaleLink>
              </>
            )}
          </Popover>
        )}

        {/* overflow */}
        <Popover
          open={menuOpen}
          onClose={() => {
            setMenuOpen(false);
            setConfirm(null);
          }}
          align="right"
          anchor={
            <button
              type="button"
              aria-label={t('nuz.header.options')}
              onClick={() => setMenuOpen((o) => !o)}
              className="grid h-9 w-9 place-items-center rounded-md border border-hairline text-tx-muted transition-colors hover:border-gold/50 hover:text-gold"
            >
              <MoreVertical size={15} />
            </button>
          }
          className="w-[13.75rem] py-1"
        >
          {owner && (
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setRulesOpen(true);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-micro12 text-tx-secondary transition-colors hover:bg-surface3 hover:text-gold"
            >
              <SlidersHorizontal size={13} /> {t('nuz.header.editRules')}
            </button>
          )}
          <button
            type="button"
            onClick={copySummary}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-micro12 text-tx-secondary transition-colors hover:bg-surface3 hover:text-gold"
          >
            <Share2 size={13} /> {t('nuz.exportSummary')}
          </button>
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              navigate(localePath(`/team?fromRun=${state.run.id}`));
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-micro12 text-tx-secondary transition-colors hover:bg-surface3 hover:text-gold"
          >
            <Swords size={13} /> {t('nuz.importToTeam')}
          </button>
          <button
            type="button"
            onClick={() => {
              if (owner) {
                setDraft(state.run.name);
                setRenaming(true);
              }
              setMenuOpen(false);
            }}
            className={cn('flex w-full items-center gap-2 px-3 py-2 text-left text-micro12 transition-colors hover:bg-surface3', owner ? 'text-tx-secondary hover:text-gold' : 'text-tx-muted/50')}
          >
            <Pencil size={13} /> {t('nuz.header.rename')}
          </button>
          {state.run.status !== 'complete' && (
            <button
              type="button"
              onClick={() => {
                setRunStatus(state.run.id, 'complete');
                pushToast('success', i18n.t('nuz.toast.complete'));
                setMenuOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-micro12 text-tx-secondary transition-colors hover:bg-surface3 hover:text-gold"
            >
              <Flag size={13} /> {t('nuz.header.markComplete')}
            </button>
          )}
          {state.run.status !== 'failed' && (
            <button
              type="button"
              onClick={() => {
                setRunStatus(state.run.id, 'failed');
                setMenuOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-micro12 text-tx-secondary transition-colors hover:bg-surface3 hover:text-gold"
            >
              <Skull size={13} /> {t('nuz.header.markFailed')}
            </button>
          )}
          {state.run.status !== 'active' && (
            <button
              type="button"
              onClick={() => {
                setRunStatus(state.run.id, 'active');
                setMenuOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-micro12 text-tx-secondary transition-colors hover:bg-surface3 hover:text-gold"
            >
              <Flag size={13} /> {t('nuz.header.reactivate')}
            </button>
          )}
          {archived ? (
            <button
              type="button"
              onClick={() => {
                restoreRun(state.run.id);
                pushToast('success', i18n.t('nuz.toast.restored'));
                setMenuOpen(false);
                setConfirm(null);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-micro12 text-tx-secondary transition-colors hover:bg-surface3 hover:text-gold"
            >
              <ArchiveRestore size={13} /> {t('nuz.header.restore')}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (confirm !== 'archive') {
                  setConfirm('archive');
                  return;
                }
                archiveRun(state.run.id);
                pushToast('info', i18n.t('nuz.toast.archived'));
                setMenuOpen(false);
                setConfirm(null);
                navigate(localePath('/nuzlocke'));
              }}
              className={cn(
                'flex w-full items-center gap-2 px-3 py-2 text-left text-micro12 transition-colors hover:bg-surface3',
                confirm === 'archive' ? 'border border-gold/50 text-gold' : 'text-tx-secondary hover:text-gold',
              )}
            >
              <Archive size={13} /> {confirm === 'archive' ? t('nuz.header.confirmArchive') : t('nuz.header.archive')}
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              if (confirm !== 'delete') {
                setConfirm('delete');
                return;
              }
              deleteRunForever(state.run.id);
              pushToast('info', i18n.t('nuz.toast.deleted'));
              setMenuOpen(false);
              setConfirm(null);
              navigate(localePath('/nuzlocke'));
            }}
            className={cn(
              'flex w-full items-center gap-2 px-3 py-2 text-left text-micro12 transition-colors hover:bg-surface3',
              confirm === 'delete' ? 'border border-gold/50 text-gold' : 'text-tx-secondary hover:text-gold',
            )}
          >
            <Trash2 size={13} /> {confirm === 'delete' ? t('nuz.header.confirmDelete') : t('nuz.header.deleteForever')}
          </button>
        </Popover>

        {/* edit rules popover (owner) */}
        <Popover open={rulesOpen} onClose={() => setRulesOpen(false)} align="right" anchor={<span className="absolute right-0 top-0" />}>
          <RulesEditor state={state} />
        </Popover>
      </div>
    </motion.header>
  );
}
