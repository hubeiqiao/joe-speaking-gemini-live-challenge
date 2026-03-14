import { z } from 'zod';

const challengeSessionSchema = z.object({
  id: z.string().min(1).max(200),
  userId: z.string().min(1).max(200),
  title: z.string().min(1).max(280),
  topicGroupKey: z.string().min(1).max(280),
  createdAt: z.string().min(1).max(64),
  status: z.enum(['completed', 'sample']),
  overallBand: z.number(),
  summary: z.string().min(1).max(2000),
  simulationType: z.enum(['full', 'part1', 'part2_3']),
  part1Topics: z.array(z.string().min(1).max(280)).optional(),
  part2Topic: z.string().min(1).max(280).nullable().optional(),
});

const challengeCollectionItemSchema = z.object({
  id: z.string().min(1).max(200),
  userId: z.string().min(1).max(200),
  title: z.string().min(1).max(280),
  notes: z.string().min(1).max(4000),
  source: z.enum(['starter', 'review']),
  createdAt: z.string().min(1).max(64),
});

const challengeReviewSchema = z.object({
  id: z.string().min(1).max(200),
  userId: z.string().min(1).max(200),
  sessionId: z.string().min(1).max(200),
  strengths: z.array(z.string().min(1).max(500)).min(1),
  nextSteps: z.array(z.string().min(1).max(500)).min(1),
  recap: z.string().min(1).max(4000),
  createdAt: z.string().min(1).max(64),
});

export const provisionRequestSchema = z.object({
  userId: z.string().min(1).max(128).optional(),
  reset: z.boolean().optional(),
});

export const liveTokenRequestSchema = z.object({
  userId: z.string().min(1).max(128),
});

export const challengeStateSchema = z.object({
  collectionItems: z.array(challengeCollectionItemSchema),
  sessions: z.array(challengeSessionSchema),
  reviews: z.array(challengeReviewSchema),
});

export const saveChallengeStateSchema = z.object({
  state: challengeStateSchema,
});

export const reviewRequestSchema = z.object({
  topic: z.string().min(1).max(280),
  transcript: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        text: z.string().min(1).max(2000),
      }),
    )
    .min(1),
});

export const generatedReviewSchema = z.object({
  summary: z.string().min(1),
  recap: z.string().min(1).optional(),
  strengths: z.array(z.string()).min(1),
  nextSteps: z.array(z.string()).min(1),
});

export type ProvisionRequest = z.infer<typeof provisionRequestSchema>;
export type LiveTokenRequest = z.infer<typeof liveTokenRequestSchema>;
export type ReviewRequest = z.infer<typeof reviewRequestSchema>;
export type GeneratedReviewResponse = z.infer<typeof generatedReviewSchema>;
export type ChallengeStateRequest = z.infer<typeof saveChallengeStateSchema>;
