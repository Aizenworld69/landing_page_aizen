import { cn } from '@/lib/utils/cn';

interface BadgeProps {
  variant: 'upcoming' | 'completed' | 'special';
  children: React.ReactNode;
  className?: string;
}

const variantStyles = {
  upcoming: 'bg-blue-50 text-blue-700 border border-blue-200',
  completed: 'bg-green-50 text-green-700 border border-green-200',
  special: 'bg-primary-500 text-white',
};

export function Badge({ variant, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase',
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
