import { describe, expect, it } from 'vitest';
import { getTopicKey } from '@/lib/session/topic-grouping';

describe('getTopicKey', () => {
  it('groups full simulations by normalized part 1 topics and part 2 topic', () => {
    expect(
      getTopicKey({
        simulationType: 'full',
        part1Topics: ['Work', 'Study'],
        part2Topic: 'Travel',
      }),
    ).toBe('full:study,work:travel');
  });

  it('keeps part2_3 sessions grouped only by part 2 topic', () => {
    expect(
      getTopicKey({
        simulationType: 'part2_3',
        part2Topic: 'Books',
      }),
    ).toBe('part2_3:books');
  });

  it('handles case and whitespace differences', () => {
    expect(
      getTopicKey({
        simulationType: 'part1',
        part1Topics: [' Family ', 'home'],
      }),
    ).toBe('part1:family,home');
  });
});
