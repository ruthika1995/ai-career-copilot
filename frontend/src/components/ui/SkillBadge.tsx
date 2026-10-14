import { cn } from '../../utils/helpers';

interface SkillBadgeProps {
  name: string;
  matched?: boolean;
  matchType?: 'exact' | 'semantic' | 'none';
  size?: 'sm' | 'md';
  className?: string;
}

export default function SkillBadge({
  name,
  matched,
  matchType,
  size = 'md',
  className,
}: SkillBadgeProps) {
  const getStyle = () => {
    if (matched === undefined) {
      return 'bg-surface-600/50 text-surface-100 border-surface-500/30';
    }
    if (matched && matchType === 'exact') {
      return 'bg-success-500/10 text-success-400 border-success-500/20';
    }
    if (matched && matchType === 'semantic') {
      return 'bg-brand-500/10 text-brand-400 border-brand-500/20';
    }
    return 'bg-danger-500/10 text-danger-400 border-danger-500/20';
  };

  const getIcon = () => {
    if (matched === undefined) return null;
    if (matched) return '✓';
    return '✗';
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 border rounded-full font-medium',
        size === 'sm' ? 'px-2.5 py-0.5 text-[11px]' : 'px-3 py-1 text-[12px]',
        getStyle(),
        className
      )}
    >
      {getIcon() && <span className="text-[10px]">{getIcon()}</span>}
      {name}
    </span>
  );
}
