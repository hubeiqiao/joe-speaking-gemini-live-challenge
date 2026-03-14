'use client';

import { useMemo } from 'react';
import { ChallengeSessionCard } from '@/components/library/ChallengeSessionCard';
import type { ChallengeSession } from '@/lib/types/challenge';

function getDateGroup(dateValue: string): string {
  const date = new Date(dateValue);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / 86_400_000);

  if (diffDays <= 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays <= 7) return 'This Week';
  if (diffDays <= 14) return 'Last Week';
  return 'Earlier';
}

export function ChallengeSessionList({
  sessions,
  onSessionSelect,
}: {
  sessions: ChallengeSession[];
  onSessionSelect?: (sessionId: string) => void;
}) {
  const groupedSessions = useMemo(() => {
    const versionCounts = sessions.reduce<Record<string, number>>((counts, session) => {
      counts[session.topicGroupKey] = (counts[session.topicGroupKey] ?? 0) + 1;
      return counts;
    }, {});

    const grouped = new Map<string, Array<{ session: ChallengeSession; versionCount: number }>>();

    sessions.forEach((session) => {
      const group = getDateGroup(session.createdAt);
      const current = grouped.get(group) ?? [];
      current.push({ session, versionCount: versionCounts[session.topicGroupKey] ?? 1 });
      grouped.set(group, current);
    });

    return grouped;
  }, [sessions]);

  const groupOrder = ['Today', 'Yesterday', 'This Week', 'Last Week', 'Earlier'];

  if (sessions.length === 0) {
    return (
      <div className="flex items-center justify-center px-4" style={{ minHeight: 'calc(100vh - 180px)' }}>
        <div className="w-full max-w-lg sm:max-w-2xl -mt-8 text-center">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-2">Your practice library</h2>
          <p className="text-sm sm:text-base text-default-500 max-w-sm mx-auto">
            All your speaking practice sessions will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-1 sm:px-0">
      {groupOrder.map((groupName) => {
        const groupSessions = groupedSessions.get(groupName) ?? [];

        if (groupSessions.length === 0) return null;

        return (
          <div key={groupName}>
            <h2 className="text-xs sm:text-sm font-semibold text-default-500 mb-2 sm:mb-3">{groupName}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-3">
              {groupSessions.map(({ session, versionCount }) => (
                <div key={session.id} className="flex">
                  <ChallengeSessionCard onSelect={onSessionSelect} session={session} versionCount={versionCount} />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
