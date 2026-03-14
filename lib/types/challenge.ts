export type SimulationType = 'full' | 'part1' | 'part2_3';

export interface TopicSessionSeed {
  simulationType: SimulationType;
  part1Topics?: string[];
  part2Topic?: string | null;
}

export interface ChallengeSession extends TopicSessionSeed {
  id: string;
  userId: string;
  title: string;
  topicGroupKey: string;
  createdAt: string;
  status: 'completed' | 'sample';
  overallBand: number;
  summary: string;
}

export interface ChallengeCollectionItem {
  id: string;
  userId: string;
  title: string;
  notes: string;
  source: 'starter' | 'review';
  createdAt: string;
}

export interface ChallengeReview {
  id: string;
  userId: string;
  sessionId: string;
  strengths: string[];
  nextSteps: string[];
  recap: string;
  createdAt: string;
}

export interface StarterDemoContent {
  collectionItems: ChallengeCollectionItem[];
  sampleSession: ChallengeSession;
  sampleReview: ChallengeReview;
}

export interface TranscriptTurn {
  role: 'user' | 'assistant';
  text: string;
}

export interface GeneratedReview {
  summary: string;
  recap?: string;
  strengths: string[];
  nextSteps: string[];
}

export interface ChallengeDemoState {
  collectionItems: ChallengeCollectionItem[];
  sessions: ChallengeSession[];
  reviews: ChallengeReview[];
}
