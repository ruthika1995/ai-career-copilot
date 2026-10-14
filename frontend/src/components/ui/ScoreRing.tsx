import { cn } from '../../utils/helpers';

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  label?: string;
}

export default function ScoreRing({
  score,
  size = 120,
  strokeWidth = 8,
  className,
  label,
}: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  const getColor = () => {
    if (score >= 85) return { stroke: '#34d399', glow: 'rgba(52, 211, 153, 0.3)' };
    if (score >= 70) return { stroke: '#60a5fa', glow: 'rgba(96, 165, 250, 0.3)' };
    if (score >= 50) return { stroke: '#fbbf24', glow: 'rgba(251, 191, 36, 0.3)' };
    return { stroke: '#f87171', glow: 'rgba(248, 113, 113, 0.3)' };
  };

  const color = getColor();

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        {/* Score ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color.stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="score-ring"
          style={{
            filter: `drop-shadow(0 0 6px ${color.glow})`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-white">{Math.round(score)}</span>
        {label && (
          <span className="text-[11px] text-surface-300 mt-0.5">{label}</span>
        )}
      </div>
    </div>
  );
}
