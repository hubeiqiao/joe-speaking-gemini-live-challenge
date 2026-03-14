import type { GeneratedReview, TranscriptTurn } from '@/lib/types/challenge';

function pickUserTurns(transcript: TranscriptTurn[]): string[] {
  return transcript.filter((turn) => turn.role === 'user').map((turn) => turn.text.trim());
}

function firstSentence(text: string): string {
  return text.split(/[.!?]/)[0]?.trim() || text.trim();
}

export function buildFallbackReview(topic: string, transcript: TranscriptTurn[]): GeneratedReview {
  const userTurns = pickUserTurns(transcript);
  const opening = userTurns[0] || 'The learner attempted the topic with a direct answer.';
  const closing = userTurns[userTurns.length - 1] || opening;
  const summary = `On "${topic}", the learner opened with "${firstSentence(opening)}" and closed by reinforcing "${firstSentence(closing)}".`;

  return {
    summary,
    recap: summary,
    strengths: [
      'The answer stayed on topic and kept the conversation moving.',
      'The speaker offered at least one concrete personal detail.',
    ],
    nextSteps: [
      'Add one clearer transition before the final idea.',
      'Use one sharper concluding sentence that directly answers the question.',
    ],
  };
}
