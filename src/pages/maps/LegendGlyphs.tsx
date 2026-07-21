/* LegendGlyphs — "how it reads" glyph samples (maps.md §1.3 / §2.4 legend). */
import { useTranslation } from 'react-i18next';

export function NodeKindGlyphs() {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-4">
      {[
        { label: t('maps.kindCity'), el: <polygon points="0,-7 7,0 0,7 -7,0" fill="#171B27" stroke="#A8B0C4" strokeWidth={2} /> },
        { label: t('maps.kindRoute'), el: <circle r={4.5} fill="#1F2433" stroke="#A8B0C4" strokeWidth={1.5} /> },
        { label: t('maps.kindDungeon'), el: <rect x={-5} y={-5} width={10} height={10} fill="#0D0F16" stroke="#A8B0C4" strokeWidth={1.5} strokeOpacity={0.6} /> },
        {
          label: t('maps.kindSpecial'),
          el: (
            <path
              d="M0,-7 L1.8,-1.8 L7,0 L1.8,1.8 L0,7 L-1.8,1.8 L-7,0 L-1.8,-1.8 Z"
              fill="#171B27"
              stroke="#F6C945"
              strokeWidth={1.5}
              strokeLinejoin="round"
            />
          ),
        },
      ].map((g) => (
        <div key={g.label} className="flex flex-col items-center gap-1.5">
          <svg width={16} height={16} viewBox="-8 -8 16 16" className="transition-transform duration-300 hover:scale-125">
            {g.el}
          </svg>
          <span className="pixel-label text-[7px] text-tx-muted">{g.label}</span>
        </div>
      ))}
    </div>
  );
}

export function LinkKindGlyphs() {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-4">
      {[
        { label: t('maps.land'), dash: undefined, color: '#A8B0C4' },
        { label: t('maps.water'), dash: '6 4', color: '#45C8FF' },
        { label: t('maps.tunnel'), dash: '2 4', color: '#F6C945' },
      ].map((l) => (
        <div key={l.label} className="flex flex-col items-center gap-1.5">
          <svg width={32} height={8} viewBox="0 0 32 8">
            <line x1={1} y1={4} x2={31} y2={4} stroke={l.color} strokeWidth={2} strokeLinecap="round" strokeDasharray={l.dash} />
          </svg>
          <span className="pixel-label text-[7px] text-tx-muted">{l.label}</span>
        </div>
      ))}
    </div>
  );
}
