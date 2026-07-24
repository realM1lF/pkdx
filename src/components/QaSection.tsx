/* QaSection — question-driven SEO content block (SEO pilot).
 *
 * Accordion that keeps EVERY answer in the DOM at all times (collapsed via
 * the grid-rows 0fr→1fr technique, never unmounted and never `hidden`), so
 * prerendered/static HTML carries the full Q&A text without any JS. Toggles
 * animate the row height only — no content pop-in, no layout jank.
 *
 * A11y: each item is a heading + button (aria-expanded/aria-controls) with a
 * role="region" panel labelled by the button; keyboard support is native.
 * Visual chrome follows the Holo-Dex panels: bg-surface1, border-hairline,
 * pixel-label divider ("FRAGEN & ANTWORTEN" / "Q&A"), gold chevron. */
import { useId, useState } from 'react';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface QaItem {
  q: string;
  a: ReactNode;
}

interface QaSectionProps {
  items: QaItem[];
  /** how many leading items start expanded (default 1) */
  defaultOpen?: number;
  /** divider label override — defaults to the localized Q&A label */
  label?: string;
  className?: string;
}

export default function QaSection({ items, defaultOpen = 1, label, className }: QaSectionProps) {
  const { t } = useTranslation();
  const baseId = useId();
  const [open, setOpen] = useState<ReadonlySet<number>>(
    () => new Set(items.slice(0, Math.max(0, defaultOpen)).map((_, i) => i)),
  );

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <section className={className} aria-label={label ?? t('seo.qa.label')}>
      {/* pixel-label divider */}
      <div className="mb-4 flex items-center gap-3">
        <span className="h-px flex-1 bg-hairline" aria-hidden />
        <span className="pixel-label text-[9px] text-gold">{label ?? t('seo.qa.label')}</span>
        <span className="h-px flex-1 bg-hairline" aria-hidden />
      </div>

      <div className="divide-y divide-hairline rounded-lg border border-hairline bg-surface1">
        {items.map((item, i) => {
          const isOpen = open.has(i);
          const buttonId = `${baseId}-q${i}`;
          const panelId = `${baseId}-a${i}`;
          return (
            <div key={i}>
              <h3>
                <button
                  type="button"
                  id={buttonId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(i)}
                  className="group flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left transition-colors hover:bg-surface2/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold/60 sm:px-5"
                >
                  <span className="font-sans text-[13px] font-semibold leading-snug text-tx-primary transition-colors group-hover:text-gold sm:text-[14px]">
                    {item.q}
                  </span>
                  <ChevronDown
                    size={16}
                    aria-hidden
                    className={cn(
                      'shrink-0 text-tx-muted transition-transform duration-200 group-hover:text-gold',
                      isOpen && 'rotate-180 text-gold',
                    )}
                  />
                </button>
              </h3>
              {/* panel stays mounted (and in static HTML) — only the row track animates */}
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className={cn(
                  'grid transition-[grid-template-rows] duration-200 ease-out',
                  isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                )}
              >
                <div className="overflow-hidden">
                  <div className="px-4 pb-4 font-sans text-[13px] leading-relaxed text-tx-secondary sm:px-5">
                    {item.a}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
