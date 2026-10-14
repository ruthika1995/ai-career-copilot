import { type LucideIcon } from 'lucide-react';
import { cn } from '../../utils/helpers';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'brand' | 'accent' | 'success' | 'warning' | 'danger';
  className?: string;
}

const colorMap = {
  brand: {
    bg: 'bg-brand-500/10',
    icon: 'text-brand-400',
    border: 'border-brand-500/20',
  },
  accent: {
    bg: 'bg-accent-500/10',
    icon: 'text-accent-400',
    border: 'border-accent-500/20',
  },
  success: {
    bg: 'bg-success-500/10',
    icon: 'text-success-400',
    border: 'border-success-500/20',
  },
  warning: {
    bg: 'bg-warning-500/10',
    icon: 'text-warning-400',
    border: 'border-warning-500/20',
  },
  danger: {
    bg: 'bg-danger-500/10',
    icon: 'text-danger-400',
    border: 'border-danger-500/20',
  },
};

export default function StatCard({
  icon: Icon,
  label,
  value,
  subtitle,
  color = 'brand',
  className,
}: StatCardProps) {
  const colors = colorMap[color];

  return (
    <div
      className={cn(
        'glass-card p-5 flex items-start gap-4',
        className
      )}
    >
      <div className={cn('p-2.5 rounded-xl', colors.bg)}>
        <Icon className={cn('w-5 h-5', colors.icon)} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] text-surface-300 mb-1">{label}</p>
        <p className="text-xl font-bold text-white">{value}</p>
        {subtitle && (
          <p className="text-[12px] text-surface-300 mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
