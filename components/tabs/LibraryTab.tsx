'use client';

import { ChallengeSessionList } from '@/components/library/ChallengeSessionList';
import type { ChallengeSession } from '@/lib/types/challenge';

export function LibraryTab({
  sessions,
  onSessionSelect,
}: {
  sessions: ChallengeSession[];
  onSessionSelect?: (sessionId: string) => void;
}) {
  return (
    <div className="min-h-[calc(100vh-8rem)] p-2 sm:p-3 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="hidden md:block mb-3 sm:mb-6 md:mb-8 px-1 sm:px-0">
          <div className="flex items-center justify-between gap-2 mb-1 sm:mb-2">
            <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-foreground">Your practice library</h2>
          </div>
          <p className="text-xs sm:text-sm md:text-base text-muted">
            Recordings, Gemini conversations, and same-topic retries stay grouped so progression is easy to review.
          </p>
        </div>

        <ChallengeSessionList onSessionSelect={onSessionSelect} sessions={sessions} />
      </div>
    </div>
  );
}
