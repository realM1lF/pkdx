/* AccountButton — header entry to /account; gold dot when logged in.
 * Hosts the one-time AccountTooltip. */
import { useTranslation } from 'react-i18next';
import { UserRound } from 'lucide-react';
import { LocaleLink } from '@/lib/locale-link';
import { useAuth } from '@/lib/auth';
import AccountTooltip from './AccountTooltip';
import { cn } from '@/lib/utils';

export default function AccountButton({ className }: { className?: string }) {
  const { t } = useTranslation();
  const { user, profile } = useAuth();

  return (
    <div className={cn('relative', className)}>
      <LocaleLink
        to="/account"
        aria-label={t('account.eyebrow')}
        title={profile?.username ?? t('account.eyebrow')}
        className={cn(
          'grid h-10 w-10 place-items-center rounded-md border transition-all duration-200',
          user
            ? 'border-gold/60 bg-gold-soft text-gold shadow-[0_0_12px_rgba(246,201,69,0.25)]'
            : 'border-hairline bg-surface2 text-tx-muted hover:border-hairline2 hover:text-tx-primary',
        )}
      >
        <UserRound size={17} strokeWidth={1.75} />
      </LocaleLink>
      <AccountTooltip />
    </div>
  );
}
