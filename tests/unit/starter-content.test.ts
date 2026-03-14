import { describe, expect, it } from 'vitest';
import { buildStarterDemoContent } from '@/lib/demo/starter-content';

describe('buildStarterDemoContent', () => {
  it('creates starter collections and a sample reviewed session for a user', () => {
    const result = buildStarterDemoContent({
      userId: 'user-123',
      now: new Date('2026-03-12T10:00:00.000Z'),
    });

    expect(result.collectionItems).toHaveLength(2);
    expect(result.sampleSession.userId).toBe('user-123');
    expect(result.sampleSession.topicGroupKey).toContain('part2_3');
    expect(result.sampleReview.sessionId).toBe(result.sampleSession.id);
  });

  it('generates deterministic ids for the same user and timestamp', () => {
    const now = new Date('2026-03-12T10:00:00.000Z');
    const first = buildStarterDemoContent({ userId: 'user-123', now });
    const second = buildStarterDemoContent({ userId: 'user-123', now });

    expect(first).toEqual(second);
  });
});

