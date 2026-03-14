import type { TopicSessionSeed } from '@/lib/types/challenge';

function normalizeTopic(topic: string | null | undefined): string {
  return (topic || '').trim().toLowerCase();
}

export function getTopicKey(session: TopicSessionSeed): string {
  if (session.simulationType === 'full') {
    const part1Key = [...(session.part1Topics || [])]
      .map(normalizeTopic)
      .sort()
      .join(',');
    return `full:${part1Key}:${normalizeTopic(session.part2Topic)}`;
  }

  if (session.simulationType === 'part2_3') {
    return `part2_3:${normalizeTopic(session.part2Topic)}`;
  }

  return `part1:${[...(session.part1Topics || [])]
    .map(normalizeTopic)
    .sort()
    .join(',')}`;
}

