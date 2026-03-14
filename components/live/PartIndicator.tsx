'use client';

import { memo } from 'react';
import { cn } from '@/lib/utils';

type TestPart = 1 | 2 | 3;

const PART_INFO: Record<TestPart, { description: string; label: string }> = {
  1: { label: 'Part 1', description: 'Introduction' },
  2: { label: 'Part 2', description: 'Long Turn' },
  3: { label: 'Part 3', description: 'Discussion' },
};

export const PartIndicator = memo(function PartIndicator({
  className,
  currentPart,
}: {
  className?: string;
  currentPart: TestPart;
}) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {([1, 2, 3] as TestPart[]).map((part) => {
        const isActive = part === currentPart;
        const isPast = part < currentPart;
        const info = PART_INFO[part];

        return (
          <div key={part} className="flex items-center">
            <div
              className={cn(
                'flex flex-col items-center transition-all duration-300 motion-reduce:transition-none',
                isActive && 'scale-105',
              )}
            >
              <div
                className={cn(
                  'whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors motion-reduce:transition-none',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : isPast
                      ? 'bg-success-100 text-success-600 dark:bg-success-900/30 dark:text-success-400'
                      : 'bg-default-100 text-default-400 dark:bg-default-100/10',
                )}
              >
                {info.label}
              </div>

              {isActive ? <span className="mt-1 whitespace-nowrap text-xs text-default-500">{info.description}</span> : null}
            </div>

            {part < 3 ? (
              <div
                className={cn(
                  'mx-1 h-0.5 w-6 transition-colors motion-reduce:transition-none sm:w-8',
                  part < currentPart ? 'bg-success-300 dark:bg-success-700' : 'bg-default-200 dark:bg-default-700',
                )}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
});

export default PartIndicator;
