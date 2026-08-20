/* Compact BST ring + stat radar for team slot cards. */

function MiniBstRing({ bst }: { bst: number }) {
  const frac = Math.min(1, bst / 720);
  const r = 17;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative h-11 w-11 shrink-0" title={`BST ${bst}`}>
      <svg viewBox="0 0 40 40" className="h-full w-full -rotate-90" aria-hidden>
        <circle cx={20} cy={20} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={3} />
        <circle
          cx={20}
          cy={20}
          r={r}
          fill="none"
          stroke="#F6C945"
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - frac)}
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center font-display text-[0.625rem] font-extrabold leading-none text-gold tabular-nums">
        {bst}
      </span>
    </div>
  );
}

function MiniRadar({
  values,
  rgb,
  labels,
}: {
  values: number[];
  rgb: string;
  labels: string[];
}) {
  const size = 88;
  const cx = size / 2;
  const cy = size / 2;
  const R = 24;
  const n = values.length;

  const point = (i: number, radius: number) => {
    const angle = ((2 * Math.PI) / n) * i - Math.PI / 2;
    return [cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius] as const;
  };

  const statPoints = values.map((v, i) => point(i, (Math.min(v, 180) / 180) * R));
  const polygon = statPoints.map(([x, y]) => `${x},${y}`).join(' ');

  return (
    <div className="group/radar shrink-0" title={labels.map((l, i) => `${l} ${values[i]}`).join(' · ')}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="h-[4.75rem] w-[4.75rem]"
        role="img"
        aria-label={labels.map((l, i) => `${l} ${values[i]}`).join(', ')}
      >
      {[0.5, 1].map((f) => (
        <polygon
          key={f}
          points={Array.from({ length: n }, (_, i) => point(i, R * f).join(',')).join(' ')}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={1}
        />
      ))}
      {Array.from({ length: n }, (_, i) => {
        const [x, y] = point(i, R);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(255,255,255,0.08)" strokeWidth={1} />;
      })}
      <polygon points={polygon} fill={`rgba(${rgb},0.22)`} stroke={`rgb(${rgb})`} strokeWidth={1.5} />
      {statPoints.map(([x, y], i) => (
        <circle key={`dot-${i}`} cx={x} cy={y} r={2.75} fill={`rgb(${rgb})`} />
      ))}
      {values.map((v, i) => {
        const [x, y] = statPoints[i];
        return (
          <text
            key={`val-${i}`}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#f4f6fc"
            className="opacity-0 transition-opacity duration-150 group-hover/radar:opacity-100"
            style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 6.5, fontWeight: 700 }}
          >
            {v}
          </text>
        );
      })}
      {labels.map((label, i) => {
        const [x, y] = point(i, R + 13);
        return (
          <text
            key={label}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#8b93a8"
            style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 6.5, fontWeight: 600 }}
          >
            {label}
          </text>
        );
      })}
      </svg>
    </div>
  );
}

export { MiniBstRing, MiniRadar };
