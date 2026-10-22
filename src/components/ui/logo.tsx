
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'font-display text-[14px] font-bold tracking-[0.1em] leading-none text-[#F5F1EB] select-none',
        className,
      )}
    >
      KURIO
    </span>
  );
}
