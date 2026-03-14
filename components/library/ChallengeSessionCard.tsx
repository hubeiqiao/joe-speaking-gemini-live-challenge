'use client';

import { memo } from 'react';
import { Card, CardBody } from '@heroui/react';
import type { ChallengeSession } from '@/lib/types/challenge';

interface ChallengeSessionCardProps {
  onSelect?: (sessionId: string) => void;
  session: ChallengeSession;
  versionCount: number;
}

function formatDate(value: string): string {
  return new Date(value).toLocaleString('en-CA', {
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    month: 'short',
  });
}

function formatBandScore(score: number): string {
  return `Band ${score.toFixed(1)}`;
}

const ScoreBadge = memo(function ScoreBadge({
  score,
  isAboveTarget = true,
}: {
  score: string;
  isAboveTarget?: boolean;
}) {
  return (
    <span
      className={`
      inline-flex items-center px-2 py-0.5 rounded-md
      text-xs font-semibold
      ${isAboveTarget ? 'bg-success/15 text-success' : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'}
    `
        .replace(/\s+/g, ' ')
        .trim()}
    >
      {score}
    </span>
  );
});

const VersionsBadge = memo(function VersionsBadge({ count }: { count: number }) {
  if (count <= 1) return null;

  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-violet-100/80 dark:bg-violet-500/15 text-[10px] font-medium text-violet-600 dark:text-violet-400 flex-shrink-0">
      <span>{count} versions</span>
    </span>
  );
});

const PREMIUM_CARD_CLASSES = `
  w-full h-full
  flex flex-col relative overflow-hidden
  bg-surface
  border border-default-200/60 dark:border-default-100/10
  hover:border-default-300 dark:hover:border-default-100/20
  shadow-sm hover:shadow-[var(--landing-shadow-md)]
  transition-all duration-300 cubic-bezier(0.25, 0.1, 0.25, 1)
  hover:-translate-y-0.5
  group rounded-xl
`.replace(/\s+/g, ' ').trim();

export function ChallengeSessionCard({ session, versionCount, onSelect }: ChallengeSessionCardProps) {
  return (
    <button
      aria-label={session.title}
      className="w-full text-left"
      onClick={() => onSelect?.(session.id)}
      type="button"
    >
      <Card className={PREMIUM_CARD_CLASSES}>
        <CardBody className="pt-3 pb-3 px-3.5 sm:pt-4 sm:pb-4 sm:px-4 flex-1 flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2.5 min-w-0 flex-1">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-teal-50 text-teal-600 dark:bg-teal-500/10 dark:text-teal-400 shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>

              <div className="flex flex-col min-w-0 flex-1">
                <h3 className="font-[family-name:var(--font-display)] text-lg sm:text-xl text-foreground leading-snug line-clamp-1">
                  {session.simulationType === 'full'
                    ? 'IELTS Full Test'
                    : session.simulationType === 'part1'
                      ? 'IELTS Part 1'
                      : 'IELTS Part 2&3'}
                </h3>

                <p className="text-[11px] sm:text-xs text-default-400">{formatDate(session.createdAt)}</p>
              </div>
            </div>

            <div className="ml-auto shrink-0 flex flex-col items-end gap-1.5">
              <ScoreBadge score={formatBandScore(session.overallBand)} isAboveTarget={session.overallBand >= 6.5} />
              <VersionsBadge count={versionCount} />
            </div>
          </div>

          <div className="h-px w-full bg-default-100 dark:bg-default-50/5" />

          <div className="flex items-center gap-2 text-[11px] sm:text-xs text-default-500 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] mask-linear-fade">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-default-50 dark:bg-default-100/5 flex-shrink-0 border border-default-100 dark:border-default-100/5">
              <span className="font-medium text-default-600 dark:text-default-400">{session.title}</span>
            </div>

            {session.part2Topic ? (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-default-50 dark:bg-default-100/5 max-w-full border border-default-100 dark:border-default-100/5">
                <span className="truncate italic text-default-500">&quot;{session.part2Topic}&quot;</span>
              </div>
            ) : null}
          </div>
        </CardBody>
      </Card>
    </button>
  );
}
