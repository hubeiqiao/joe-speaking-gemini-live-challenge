'use client';

import { useMemo, useState } from 'react';
import { Tab, Tabs } from '@heroui/react';
import { DailyReviewCard } from '@/components/review/DailyReviewCard';
import { WeeklyReviewCard } from '@/components/review/WeeklyReviewCard';
import type { DailyReview, WeeklyReview } from '@/lib/types/analytics';
import type { ChallengeReview, ChallengeSession } from '@/lib/types/challenge';

function buildDailyReview(latestReview: ChallengeReview | null, latestSession: ChallengeSession | null, sessions: ChallengeSession[]): DailyReview | null {
  if (!latestReview || !latestSession) {
    return null;
  }

  const words = latestReview.recap.split(/\s+/).filter(Boolean);

  return {
    id: latestReview.id,
    date: new Date(latestReview.createdAt),
    practiceVolume: {
      comparisonVsPrevious: {
        recordingsDiff: Math.max(sessions.length - 1, 0),
        sessionsDiff: Math.max(sessions.length - 1, 0),
        speakingTimeDiff: 120,
      },
      recordingsCreated: sessions.length,
      sessionsCompleted: sessions.length,
      totalSpeakingTime: sessions.length * 180,
    },
    transcriptAnalysis: {
      commonPatterns: latestReview.strengths,
      frequentErrors: latestReview.nextSteps.map((step, index) => ({
        count: index + 1,
        description: step,
        type: index % 2 === 0 ? 'coherence' : 'grammar',
      })),
      sentenceStructureAnalysis: latestReview.recap,
      totalWords: words.length,
      uniqueWords: new Set(words.map((word) => word.toLowerCase())).size,
      vocabularyDiversity: words.length > 0 ? new Set(words.map((word) => word.toLowerCase())).size / words.length : 0.5,
    },
    priorityItems: latestReview.nextSteps.map((step, index) => ({
      examples: [latestSession.summary],
      explanation: step,
      quickFixTip: step,
      severity: index === 0 ? 'high' : index === 1 ? 'medium' : 'low',
      title: `Priority ${index + 1}`,
    })),
    miniCheck: {
      questions: latestReview.strengths.slice(0, 2).map((strength, index) => ({
        id: `mini-${index}`,
        question: `Which strength should you keep in the next attempt?`,
        correctAnswer: strength,
        explanation: latestReview.recap,
      })),
      score: 100,
    },
    progressSnapshot: {
      averageScore: latestSession.overallBand,
      comparisonVsYesterday: {
        errorRateDiff: -0.6,
        scoreDiff: 0.5,
        vocabularyDiff: 0.1,
      },
      errorRatePer100Words: Math.max(0.5, latestReview.nextSteps.length * 0.8),
      trend: sessions.length > 1 ? 'improving' : 'stable',
      vocabularyDiversityScore: 0.62,
    },
    generatedAt: new Date(latestReview.createdAt),
    dismissed: false,
  };
}

function buildWeeklyReview(latestReview: ChallengeReview | null, sessions: ChallengeSession[]): WeeklyReview | null {
  if (!latestReview || sessions.length === 0) {
    return null;
  }

  const sessionDates = sessions.map((session) => new Date(session.createdAt));
  const sorted = [...sessionDates].sort((a, b) => a.getTime() - b.getTime());
  const weekStart = sorted[0];
  const weekEnd = sorted[sorted.length - 1];
  const dailyBreakdown = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => ({
    day,
    minutes: sessions
      .filter((session) => new Date(session.createdAt).toLocaleDateString('en-US', { weekday: 'long' }) === day)
      .reduce((total) => total + 3, 0),
  }));

  return {
    id: `${weekStart.getUTCFullYear()}-W${Math.max(1, Math.ceil(weekStart.getUTCDate() / 7))}`,
    weekStart,
    weekEnd,
    practiceSummary: {
      consistencyScore: Math.min(1, sessions.length / 4),
      mostProductiveDay:
        dailyBreakdown.toSorted((left, right) => right.minutes - left.minutes)[0]?.day ?? 'Friday',
      sessionsCompleted: sessions.length,
      totalTime: sessions.length * 180,
    },
    insights: {
      criterionTrends: [
        {
          criterion: 'Fluency',
          details: latestReview.strengths[0] ?? 'More natural pace across repeated answers.',
          percentChange: 8,
          trend: sessions.length > 1 ? 'improving' : 'stable',
        },
        {
          criterion: 'Coherence',
          details: latestReview.nextSteps[0] ?? 'Tighter answers are still the main lever.',
          percentChange: 5,
          trend: 'improving',
        },
      ],
      improvements: latestReview.strengths,
      persistentIssues: latestReview.nextSteps.slice(0, 2).map((step, index) => ({
        examples: [step],
        issue: step,
        occurrences: index + 1,
      })),
    },
    focusRecommendation: {
      goal: latestReview.nextSteps[0] ?? 'Keep each answer focused and evidence-based.',
      reason: latestReview.recap,
      resources: latestReview.nextSteps,
      skill: 'Same-topic retry',
    },
    timeStats: {
      dailyAverage: sessions.length > 0 ? (sessions.length * 3) / 7 : 0,
      dailyBreakdown,
      longestStreak: Math.min(3, sessions.length),
      totalMinutes: sessions.length * 3,
    },
    consistency: {
      comparisonVsLastWeek: 1,
      currentStreak: Math.min(3, sessions.length),
      daysPracticed: new Set(sessionDates.map((date) => date.toDateString())).size,
      idealPattern: 'Two short live retries plus one recap review',
    },
    achievements: {
      milestones: ['Completed a Gemini Live speaking loop'],
      personalBests: [
        {
          date: weekEnd,
          metric: 'Best band',
          value: `${Math.max(...sessions.map((session) => session.overallBand)).toFixed(1)}`,
        },
      ],
    },
    generatedAt: new Date(latestReview.createdAt),
    dismissed: false,
  };
}

export function ReviewTab({
  latestReview,
  latestSession,
  sessions,
}: {
  latestReview: ChallengeReview | null;
  latestSession: ChallengeSession | null;
  sessions: ChallengeSession[];
}) {
  const [selectedTab, setSelectedTab] = useState('daily');
  const dailyReview = useMemo(() => buildDailyReview(latestReview, latestSession, sessions), [latestReview, latestSession, sessions]);
  const weeklyReview = useMemo(() => buildWeeklyReview(latestReview, sessions), [latestReview, sessions]);

  return (
    <div className="min-h-[calc(100vh-8rem)] p-2 sm:p-3 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="hidden md:block mb-4 sm:mb-6 md:mb-8 px-2 sm:px-0">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2">Review</h2>
          <p className="text-xs sm:text-sm md:text-base text-muted">
            Keep the Joe Speaking review surface, but feed it with the challenge-safe Gemini recap.
          </p>
        </div>

        {latestSession ? (
          <div className="mb-6 rounded-2xl border border-default-200 bg-content1 p-4 sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-default-500">Selected Session</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <h3 className="font-[family-name:var(--font-display)] text-2xl tracking-tight text-foreground">
                {latestSession.title}
              </h3>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">
                Band {latestSession.overallBand.toFixed(1)}
              </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-default-500">{latestSession.summary}</p>
          </div>
        ) : null}

        <Tabs
          aria-label="Review tabs"
          selectedKey={selectedTab}
          onSelectionChange={(key) => setSelectedTab(String(key))}
          variant="underlined"
          classNames={{
            tabList: 'gap-6 lg:gap-8 relative rounded-none p-0 border-b-0 mb-6',
            cursor: 'w-full bg-accent',
            tab: 'max-w-fit px-3 lg:px-4 h-10',
            tabContent: 'group-data-[selected=true]:text-accent text-sm font-semibold',
          }}
        >
          <Tab key="daily" title="Daily">
            {dailyReview ? <DailyReviewCard review={dailyReview} /> : <EmptyReviewState />}
          </Tab>
          <Tab key="weekly" title="Weekly">
            {weeklyReview ? <WeeklyReviewCard review={weeklyReview} /> : <EmptyReviewState />}
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}

function EmptyReviewState() {
  return (
    <div className="rounded-2xl border border-default-200 bg-content1 p-8 text-center text-default-500">
      Generate a Gemini review from Practice to populate this tab.
    </div>
  );
}
