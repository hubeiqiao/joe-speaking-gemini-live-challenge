import { describe, expect, it } from 'vitest';
import { buildStarterDemoContent } from '@/lib/demo/starter-content';
import {
  buildReviewTranscript,
  createChallengeReview,
  createCollectionInsight,
} from '@/lib/demo/session-artifacts';

describe('session-artifacts', () => {
  const starter = buildStarterDemoContent({
    userId: 'user-123',
    now: new Date('2026-03-12T10:00:00.000Z'),
  });

  it('builds a simple transcript from the session topic and summary', () => {
    const transcript = buildReviewTranscript(starter.sampleSession);

    expect(transcript).toHaveLength(3);
    expect(transcript[0]?.text).toMatch(/IELTS topic/i);
    expect(transcript[1]?.text).toMatch(/Weekend Travel Story/i);
  });

  it('creates review and collection records for the demo store', () => {
    const review = createChallengeReview({
      generated: {
        summary: 'The retry was more focused and structured.',
        recap: 'The retry was more focused and structured.',
        strengths: ['Better pacing'],
        nextSteps: ['Add a stronger conclusion'],
      },
      session: starter.sampleSession,
      userId: starter.sampleSession.userId,
      createdAt: '2026-03-12T11:00:00.000Z',
    });

    const collectionItem = createCollectionInsight({
      review,
      session: starter.sampleSession,
      userId: starter.sampleSession.userId,
      createdAt: '2026-03-12T11:05:00.000Z',
    });

    expect(review.id).toBe(`review-${starter.sampleSession.id}`);
    expect(collectionItem.source).toBe('review');
    expect(collectionItem.notes).toMatch(/stronger conclusion/i);
  });
});
