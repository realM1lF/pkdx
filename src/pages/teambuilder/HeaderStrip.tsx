/* HeaderStrip — team name · GAME selector · IMPORT FROM RUN · SHARE · SAVE · hub · CLEAR
 * (team-builder.md "Header-Strip", density-addendum §2 command-bar) */
import { ArrowLeftRight, Check, ChevronDown, Download, Gamepad2, Pencil, Save, Share2, Trash2, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import GameSelect from '@/components/GameSelect';
import type { Team } from '@/lib/teambuilder';
import { cn } from '@/lib/utils';

interface HeaderStripProps {
  team: Team;
  saved: boolean;
  shareState: 'idle' | 'copied';
  onName: (name: string) => void;
  onGameChange: (vgId: string) => void;
  onImport: () => void;
  onShowdown: () => void;
  onShare: () => void;
  onSave: () => void;
  onClear: () => void;
  onOpenHub: () => void;
  savedCount: number;
}

export default function HeaderStrip({
  team,
  saved,
  shareState,
  onName,
  onGameChange,
  onImport,
  onShowdown,
  onShare,
  onSave,
  onClear,
  onOpenHub,
  savedCount,
}: HeaderStripProps) {
  const { t } = useTranslation();
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
          className="w-full bg-transparent font-display text-[15px] font-bold uppercase tracking-wide text-tx-primary outline-none transition-colors placeholder:text-tx-muted focus:text-gold"
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
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
        <button type="button" onClick={onImport} className="tb-btn">
          <Download size={13} />
          {t('tb.importFromRun')}
        </button>
        <button type="button" onClick={onShowdown} className="tb-btn" title={t('tb.sd.buttonTip')}>
          <ArrowLeftRight size={13} />
          {t('tb.sd.button')}
        </button>
        <button type="button" onClick={onShare} className="tb-btn" aria-live="polite">
          {shareState === 'copied' ? <Check size={13} className="text-gold" /> : <Share2 size={13} />}
          {shareState === 'copied' ? t('tb.linkCopied') : t('tb.share')}
        </button>
        <button type="button" onClick={onSave} className="tb-btn tb-btn-primary">
          <Save size={13} />
          {saved ? t('tb.saved') : t('tb.save')}
        </button>
        <button type="button" onClick={onOpenHub} className="tb-btn" aria-label={t('tb.myTeams')}>
          <Users size={13} />
          <span className="hidden sm:inline">{t('tb.myTeams')}</span>
          {savedCount > 0 && <span className="tb-chip !px-1.5 !py-0 !text-[9px] text-gold">{savedCount}</span>}
        </button>
        <button type="button" onClick={onClear} className="tb-btn tb-btn-icon" aria-label={t('tb.clearTeam')}>
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}
