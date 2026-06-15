interface ProgressRingProps {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  sublabel?: string;
}

export default function ProgressRing({
  value,
  max,
  size = 120,
  strokeWidth = 10,
  color = '#22c55e',
  label,
  sublabel,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(value / max, 1);
  const offset = circumference - pct * circumference;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <defs>
          <linearGradient id={`ring-${color.replace('#', '')}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="rgba(148,163,184,0.12)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={`url(#ring-${color.replace('#', '')})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.7s cubic-bezier(0.16, 1, 0.3, 1)' }}
        />
      </svg>
      {label && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-extrabold text-white leading-none" style={{ fontSize: size * 0.22 }}>
            {label}
          </span>
          {sublabel && (
            <span className="text-slate-400 leading-tight mt-0.5" style={{ fontSize: size * 0.10 }}>
              {sublabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
