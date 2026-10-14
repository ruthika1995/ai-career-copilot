import { cn } from '../../utils/helpers';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function ProgressBar({
  value,
  max = 100,
  label,
  showValue = true,
  size = 'md',
  className,
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  const getColor = () => {
    if (percentage >= 85) return 'from-success-500 to-success-400';
    if (percentage >= 70) return 'from-brand-500 to-brand-400';
    if (percentage >= 50) return 'from-warning-500 to-warning-400';
    return 'from-danger-500 to-danger-400';
  };

  const heights = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <div className={cn('space-y-1.5', className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center">
          {label && (
            <span className="text-[13px] text-surface-200">{label}</span>
          )}
          {showValue && (
            <span className="text-[13px] font-medium text-surface-100">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div
        className={cn(
          'w-full rounded-full bg-surface-700/50 overflow-hidden',
          heights[size]
        )}
      >
        <div
          className={cn(
            'h-full rounded-full bg-gradient-to-r transition-all duration-700 ease-out',
            getColor()
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
