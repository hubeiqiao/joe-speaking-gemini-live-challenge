import { describe, expect, it } from 'vitest';
import { buildStarterDemoContent } from '@/lib/demo/starter-content';
import {
  addSessionAttempt,
  createMemoryStorage,
  loadDemoState,
  seedStarterContent,
} from '@/lib/demo/browser-store';

describe('browser demo store', () => {
  it('seeds starter content only once', () => {
    const storage = createMemoryStorage();
    const starter = buildStarterDemoContent({
      userId: 'user-123',
      now: new Date('2026-03-12T10:00:00.000Z'),
    });

    seedStarterContent(storage, starter);
    seedStarterContent(storage, starter);

    const state = loadDemoState(storage);

    expect(state.collectionItems).toHaveLength(2);
    expect(state.sessions).toHaveLength(1);
    expect(state.reviews).toHaveLength(1);
  });

  it('adds a new session attempt into the same topic group', () => {
    const storage = createMemoryStorage();
    const starter = buildStarterDemoContent({
      userId: 'user-123',
      now: new Date('2026-03-12T10:00:00.000Z'),
    });

    seedStarterContent(storage, starter);
    addSessionAttempt(storage, {
      id: 'attempt-2',
      userId: 'user-123',
      title: starter.sampleSession.title,
      simulationType: 'part2_3',
      part2Topic: starter.sampleSession.part2Topic,
      createdAt: '2026-03-12T11:00:00.000Z',
      overallBand: 7.5,
      summary: 'Second attempt',
      topicGroupKey: starter.sampleSession.topicGroupKey,
      status: 'completed',
    });

    const state = loadDemoState(storage);
    const grouped = state.sessions.filter(
      (session) => session.topicGroupKey === starter.sampleSession.topicGroupKey,
    );

    expect(grouped).toHaveLength(2);
  });
});
