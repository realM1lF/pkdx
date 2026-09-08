/* Stats Band — counters (home.md §7). Finals are painted in the first HTML
 * and stay there: Playwright prerender serializes the post-hydration DOM,
 * so a 0-start (even off-screen) would ship as "0" again. */
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/lib/i18n-data';
import { STATS_BAND, formatStatsBandValue } from './stats-band';

export default function StatsBand() {
  const { t } = useTranslation();
  const lang = useLanguage();
  return (
    <section className="relative overflow-x-clip border-y border-hairline bg-surface1">
      {/* faint aura blobs — water left, fire right */}
      <div
        aria-hidden
        className="absolute left-[-10%] top-1/2 h-[15rem] w-[26.25rem] -translate-y-1/2 rounded-full blur-[80px]"
        style={{ background: 'radial-gradient(circle, rgba(69,200,255,0.10), transparent 70%)' }}
      />
      <div
        aria-hidden
        className="absolute right-[-10%] top-1/2 h-[15rem] w-[26.25rem] -translate-y-1/2 rounded-full blur-[80px]"
        style={{ background: 'radial-gradient(circle, rgba(255,122,69,0.10), transparent 70%)' }}
      />
      <div className="relative mx-auto grid max-w-content grid-cols-2 gap-10 px-4 py-16 md:px-8 lg:grid-cols-4">
        {STATS_BAND.map((s) => (
          <div key={s.labelKey} className="flex flex-col items-center gap-3 text-center">
            <span className="font-display text-[2.5rem] font-extrabold leading-none text-gold tabular-nums">
              {formatStatsBandValue(s.target, lang, 'suffix' in s ? s.suffix : '')}
            </span>
            <span className="pixel-label text-[14px] text-tx-muted">{t(s.labelKey)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
