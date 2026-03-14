import { describe, expect, it } from 'vitest';
import { buildStarterDemoContent } from '@/lib/demo/starter-content';
import {
  createEmptyChallengeState,
  provisionChallengeState,
  saveCollectionItemToState,
  saveReviewToState,
  saveSessionToState,
} from '@/lib/demo/challenge-state';

describe('challenge-state', () => {
  it('provisions starter content only once', () => {
    const starter = buildStarterDemoContent({
      userId: 'user-123',
      now: new Date('2026-03-12T10:00:00.000Z'),
    });

    const once = provisionChallengeState(createEmptyChallengeState(), starter);
    const twice = provisionChallengeState(once, starter);

    expect(twice.collectionItems).toHaveLength(2);
    expect(twice.sessions).toHaveLength(1);
    expect(twice.reviews).toHaveLength(1);
  });

  it('replaces matching entities and keeps newest-first ordering', () => {
    const starter = buildStarterDemoContent({
      userId: 'user-123',
      now: new Date('2026-03-12T10:00:00.000Z'),
    });
    const seeded = provisionChallengeState(createEmptyChallengeState(), starter);

    const withSession = saveSessionToState(seeded, {
      ...starter.sampleSession,
      id: 'attempt-2',
      createdAt: '2026-03-12T11:00:00.000Z',
      status: 'completed',
      overallBand: 7.5,
      summary: 'A clearer retry attempt.',
    });

    const withReview = saveReviewToState(withSession, {
      ...starter.sampleReview,
      id: 'review-attempt-2',
      sessionId: 'attempt-2',
      createdAt: '2026-03-12T11:10:00.000Z',
      recap: 'The retry used a clearer opening.',
    });

    const withCollection = saveCollectionItemToState(withReview, {
      ...starter.collectionItems[0],
      id: 'collection-attempt-2',
      source: 'review',
      createdAt: '2026-03-12T11:15:00.000Z',
      title: 'Retry cue: Weekend Travel Story',
    });

    expect(withCollection.sessions[0]?.id).toBe('attempt-2');
    expect(withCollection.reviews[0]?.sessionId).toBe('attempt-2');
    expect(withCollection.collectionItems[0]?.id).toBe('collection-attempt-2');
  });
});
