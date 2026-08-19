/* Context hint for manual route runs — checklist progress and full Dex. */
import { useTranslation } from 'react-i18next';
import HonestyHint from '@/components/HonestyHint';
import { isManualRouteRun } from '@/lib/nuzlocke-routes';
import type { NuzRules } from '@/lib/supabase';
import { cn } from '@/lib/utils';

export default function ManualRoutesHints({
  rules,
  className,
}: {
  rules: Pick<NuzRules, 'routeTracking'>;
  className?: string;
}) {
  const { t } = useTranslation();
  if (!isManualRouteRun(rules)) return null;

  return (
    <HonestyHint show tone="gold" className={cn('min-w-0', className)}>
      {t('honesty.manualRoutesOverview')}
    </HonestyHint>
  );
}
