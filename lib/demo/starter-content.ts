import { getTopicKey } from '@/lib/session/topic-grouping';
import type { StarterDemoContent } from '@/lib/types/challenge';

interface BuildStarterDemoContentArgs {
  userId: string;
  now?: Date;
}

function buildStableId(prefix: string, userId: string, timestamp: string): string {
  return `${prefix}-${userId}-${timestamp.replace(/[:.]/g, '-')}`;
}

export function buildStarterDemoContent({
  userId,
  now = new Date(),
}: BuildStarterDemoContentArgs): StarterDemoContent {
  const createdAt = now.toISOString();

  const sampleSessionId = buildStableId('starter-session', userId, createdAt);
  const sampleReviewId = buildStableId('starter-review', userId, createdAt);
  const collectionBase = buildStableId('starter-collection', userId, createdAt);

  const sampleSession = {
    id: sampleSessionId,
    userId,
    title: 'Weekend Travel Story',
    simulationType: 'part2_3' as const,
    part2Topic: 'Describe a trip that changed your perspective',
    topicGroupKey: getTopicKey({
      simulationType: 'part2_3',
      part2Topic: 'Describe a trip that changed your perspective',
    }),
    createdAt,
    status: 'sample' as const,
    overallBand: 7.0,
    summary:
      'A polished sample attempt that shows how Joe Speaking tracks one topic over multiple live retries.',
  };

  return {
    collectionItems: [
      {
        id: `${collectionBase}-1`,
        userId,
        title: 'Crisp Part 2 story openings',
        notes: 'Use a confident first sentence and anchor the story in a concrete moment.',
        source: 'starter',
        createdAt,
      },
      {
        id: `${collectionBase}-2`,
        userId,
        title: 'Part 3 follow-up bridges',
        notes: 'Bridge from the personal answer into a broader idea before adding evidence.',
        source: 'starter',
        createdAt,
      },
    ],
    sampleSession,
    sampleReview: {
      id: sampleReviewId,
      userId,
      sessionId: sampleSession.id,
      strengths: ['Natural pacing', 'Clear personal example'],
      nextSteps: ['Tighten transitions', 'Use one sharper concluding sentence'],
      recap:
        'The sample review demonstrates the end-of-session coaching recap judges will see after a live Gemini conversation.',
      createdAt,
    },
  };
}
