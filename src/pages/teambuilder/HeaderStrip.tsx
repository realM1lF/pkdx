/* HeaderStrip — team name · GAME selector · IMPORT FROM RUN · SHARE · SAVE · hub · CLEAR
 * (team-builder.md "Header-Strip", density-addendum §2 command-bar) */
import { useEffect, useState } from 'react';
import { ArrowLeftRight, Check, ChevronDown, CopyPlus, Download, ExternalLink, Eye, Gamepad2, Pencil, Save, Share2, Trash2, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import GameSelect from '@/components/GameSelect';
import { LocaleLink } from '@/lib/locale-link';
import { isLinkedTeam } from '@/lib/teambuilder';
import type { Team } from '@/lib/teambuilder';
import { cn } from '@/lib/utils';

interface HeaderStripProps {
  team: Team;
  saved: boolean;
  shareState: 'idle' | 'copied';
  readOnly?: boolean;
  /** Shared / foreign party snapshot — not in the vault */
  viewOnly?: boolean;
  onName: (name: string) => void;
  onGameChange: (vgId: string) => void;
  onImport: () => void;
  onShowdown: () => void;
  onShare: () => void;
  onSave: () => void;
  onSaveCopy?: () => void;
  onClear: () => void;
  onOpenHub: () => void;
  savedCount: number;
}

export default function HeaderStrip({
  team,
  saved,
  shareState,
  readOnly = false,
  viewOnly = false,
  onName,
  onGameChange,
  onImport,
  onShowdown,
  onShare,
  onSave,
  onSaveCopy,
  onClear,
  onOpenHub,
  savedCount,
}: HeaderStripProps) {
  const { t } = useTranslation();
  const linked = isLinkedTeam(team) && !viewOnly;
  const [confirmClear, setConfirmClear] = useState(false);
  useEffect(() => {
    setConfirmClear(false);
  }, [team.id]);
  return (
    <div className="tb-panel mb-3 flex flex-wrap items-center gap-2 !rounded-[12px] px-3 py-2.5">
      <div className="flex min-w-[180px] flex-1 items-center gap-2">
        <Pencil size={13} className="shrink-0 text-tx-muted" aria-hidden />
        <input
          value={team.name}
          onChange={(e) => onName(e.target.value)}
          placeholder={t('tb.teamName')}
          maxLength={40}
          aria-label={t('tb.teamName')}
          disabled={readOnly || linked || viewOnly}
          className="w-full bg-transparent font-display text-[15px] font-bold tracking-wide text-tx-primary outline-none transition-colors placeholder:text-tx-muted focus:text-gold disabled:opacity-70"
        />
        {viewOnly && (
          <span className="tb-chip shrink-0 !border-gold/50 !bg-gold/10 !text-[8px] !text-gold" title={t('tb.viewOnly.tip')}>
            <Eye size={9} className="mr-0.5 inline" />
            {t('tb.viewOnly.badge')}
          </span>
        )}
        {linked && (
          <span className="tb-chip shrink-0 !border-gold/50 !bg-gold/10 !text-[8px] !text-gold" title={t('tb.linked.fromRun')}>
            {t('tb.linked.badge')}
          </span>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {isLinkedTeam(team) && team.linkedRunId && (
          <LocaleLink to={`/nuzlocke/${team.linkedRunId}`} className="tb-btn" title={t('tb.linked.openRun')}>
            <ExternalLink size={13} />
            <span className="hidden sm:inline">{t('tb.linked.openRun')}</span>
          </LocaleLink>
        )}
        <GameSelect
          value={team.versionGroup}
          onChange={onGameChange}
          ariaLabel={t('tb.selectGame')}
          buttonClassName="tb-btn !gap-2"
          buttonContent={(current, open) => (
            <>
              <Gamepad2 size={14} className="text-gold" />
              <span className="tb-micro-gold !text-[8px]">{t('tb.game')}</span>
              <span className="font-display text-[11px] font-bold tracking-wide text-tx-primary">{current.short}</span>
              <span className="hidden text-[11px] text-tx-muted lg:inline">{current.label}</span>
              <ChevronDown size={12} className={cn('transition-transform duration-200', open && 'rotate-180')} />
            </>
          )}
        />
        {!linked && !viewOnly && (
          <button type="button" onClick={onImport} className="tb-btn">
            <Download size={13} />
            {t('tb.importFromRun')}
          </button>
        )}
        <button type="button" onClick={onShowdown} className="tb-btn" title={t('tb.sd.buttonTip')} disabled={readOnly && !viewOnly}>
          <ArrowLeftRight size={13} />
          {t('tb.sd.button')}
        </button>
        {!viewOnly && (
          <button type="button" onClick={onShare} className="tb-btn" aria-live="polite" title={t('tb.shareTip')}>
            {shareState === 'copied' ? <Check size={13} className="text-gold" /> : <Share2 size={13} />}
            {shareState === 'copied' ? t('tb.linkCopied') : t('tb.share')}
          </button>
        )}
        {viewOnly && onSaveCopy ? (
          <button type="button" onClick={onSaveCopy} className="tb-btn tb-btn-primary" title={t('tb.viewOnly.saveCopyTip')}>
            <CopyPlus size={13} />
            {t('tb.viewOnly.saveCopy')}
          </button>
        ) : (
          <button type="button" onClick={onSave} className="tb-btn tb-btn-primary" disabled={readOnly}>
            <Save size={13} />
            {saved ? t('tb.saved') : t('tb.save')}
          </button>
        )}
        <button type="button" onClick={onOpenHub} className="tb-btn" aria-label={t('tb.myTeams')}>
          <Users size={13} />
          <span className="hidden sm:inline">{t('tb.myTeams')}</span>
          {savedCount > 0 && <span className="tb-chip !px-1.5 !py-0 !text-[9px] text-gold">{savedCount}</span>}
        </button>
        {!linked && !viewOnly && (
          <button
            type="button"
            onClick={() => {
              if (!confirmClear) {
                setConfirmClear(true);
                return;
              }
              onClear();
              setConfirmClear(false);
            }}
            className={cn('tb-btn shrink-0', confirmClear ? 'border-gold/50 text-gold' : 'tb-btn-icon')}
            aria-label={confirmClear ? t('tb.confirmClearAria') : t('tb.clearTeam')}
            title={confirmClear ? t('tb.confirmClear') : t('tb.clearTeam')}
          >
            <Trash2 size={13} />
            {confirmClear && (
              <span className="text-[9px] font-semibold tracking-wide">{t('tb.confirmClear')}</span>
            )}
          </button>
        )}
      </div>
      {viewOnly && (
        <p className="w-full text-[11px] text-tx-muted">{t('tb.viewOnly.help')}</p>
      )}
      {linked && !viewOnly && (
        <p className="w-full text-[11px] text-tx-muted">
          {readOnly ? t('tb.linked.readOnly') : t('tb.linked.rosterLocked')}
        </p>
      )}
    </div>
  );
}
