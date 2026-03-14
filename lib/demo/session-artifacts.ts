import type {
  ChallengeCollectionItem,
  ChallengeReview,
  ChallengeSession,
  GeneratedReview,
  TranscriptTurn,
} from '@/lib/types/challenge';

function getTopicPrompt(session: ChallengeSession): string {
  return session.part2Topic ?? session.part1Topics?.[0] ?? session.title;
}

function shortSummary(session: ChallengeSession): string {
  return session.summary.replace(/\s+/g, ' ').trim();
}

export function buildReviewTranscript(session: ChallengeSession): TranscriptTurn[] {
  const topicPrompt = getTopicPrompt(session);
  const summary = shortSummary(session);

  return [
    {
      role: 'assistant',
      text: `Let's practise this IELTS topic: ${topicPrompt}.`,
    },
    {
      role: 'user',
      text: `I answered the topic "${session.title}" by focusing on this idea: ${summary}`,
    },
    {
      role: 'assistant',
      text: 'Good. Keep the structure clear and give one concrete detail before your conclusion.',
    },
  ];
}

export function createChallengeReview({
  generated,
  session,
  userId,
  createdAt = new Date().toISOString(),
}: {
  generated: GeneratedReview;
  session: ChallengeSession;
  userId: string;
  createdAt?: string;
}): ChallengeReview {
  return {
    id: `review-${session.id}`,
    userId,
    sessionId: session.id,
    strengths: generated.strengths,
    nextSteps: generated.nextSteps,
    recap: generated.recap ?? generated.summary,
    createdAt,
  };
}

export function createCollectionInsight({
  review,
  session,
  userId,
  createdAt = new Date().toISOString(),
}: {
  review: ChallengeReview;
  session: ChallengeSession;
  userId: string;
  createdAt?: string;
}): ChallengeCollectionItem {
  const leadNextStep = review.nextSteps[0] ?? 'Refine the next answer with a cleaner conclusion.';

  return {
    id: `collection-${session.id}`,
    userId,
    title: `Retry cue: ${session.title}`,
    notes: `${leadNextStep} ${review.recap}`,
    source: 'review',
    createdAt,
  };
}
