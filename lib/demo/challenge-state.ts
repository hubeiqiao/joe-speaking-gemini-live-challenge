import type {
  ChallengeCollectionItem,
  ChallengeDemoState,
  ChallengeReview,
  ChallengeSession,
  StarterDemoContent,
} from '@/lib/types/challenge';

function byNewest<T extends { createdAt: string }>(a: T, b: T): number {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
}

function sortByNewest<T extends { createdAt: string }>(items: T[]): T[] {
  return [...items].sort(byNewest);
}

function upsertById<T extends { id: string; createdAt: string }>(items: T[], nextItem: T): T[] {
  return sortByNewest([nextItem, ...items.filter((item) => item.id !== nextItem.id)]);
}

export function createEmptyChallengeState(): ChallengeDemoState {
  return {
    collectionItems: [],
    sessions: [],
    reviews: [],
  };
}

export function provisionChallengeState(
  currentState: ChallengeDemoState,
  starter: StarterDemoContent,
): ChallengeDemoState {
  const hasStarter = currentState.sessions.some((session) => session.id === starter.sampleSession.id);

  if (hasStarter) {
    return currentState;
  }

  return {
    collectionItems: sortByNewest([...currentState.collectionItems, ...starter.collectionItems]),
    sessions: sortByNewest([starter.sampleSession, ...currentState.sessions]),
    reviews: sortByNewest([starter.sampleReview, ...currentState.reviews]),
  };
}

export function saveSessionToState(
  currentState: ChallengeDemoState,
  session: ChallengeSession,
): ChallengeDemoState {
  return {
    ...currentState,
    sessions: upsertById(currentState.sessions, session),
  };
}

export function saveReviewToState(
  currentState: ChallengeDemoState,
  review: ChallengeReview,
): ChallengeDemoState {
  return {
    ...currentState,
    reviews: upsertById(currentState.reviews, review),
  };
}

export function saveCollectionItemToState(
  currentState: ChallengeDemoState,
  item: ChallengeCollectionItem,
): ChallengeDemoState {
  return {
    ...currentState,
    collectionItems: upsertById(currentState.collectionItems, item),
  };
}

export function normalizeChallengeState(input: unknown): ChallengeDemoState {
  if (!input || typeof input !== 'object') {
    return createEmptyChallengeState();
  }

  const candidate = input as Partial<ChallengeDemoState>;

  return {
    collectionItems: Array.isArray(candidate.collectionItems) ? candidate.collectionItems : [],
    sessions: Array.isArray(candidate.sessions) ? candidate.sessions : [],
    reviews: Array.isArray(candidate.reviews) ? candidate.reviews : [],
  };
}
