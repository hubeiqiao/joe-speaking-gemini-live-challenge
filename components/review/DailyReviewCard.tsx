'use client';

import { useState } from 'react';
import { Button, Card, CardBody, CardHeader, Chip, Progress } from '@heroui/react';
import { formatDateDisplay, formatDuration } from '@/lib/analytics/date-utils';
import type { DailyReview } from '@/lib/types/analytics';

export function DailyReviewCard({ review, onDelete }: { review: DailyReview; onDelete?: (id: string) => void }) {
  const [showAnswers, setShowAnswers] = useState(false);

  const trendIcon =
    review.progressSnapshot.trend === 'improving'
      ? '📈'
      : review.progressSnapshot.trend === 'declining'
        ? '📉'
        : '📊';

  const trendColor =
    review.progressSnapshot.trend === 'improving'
      ? 'success'
      : review.progressSnapshot.trend === 'declining'
        ? 'danger'
        : 'default';

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col items-start gap-2 pb-4">
        <div className="flex items-center justify-between w-full">
          <h3 className="text-xl font-bold">{formatDateDisplay(review.date)}</h3>
          {onDelete ? (
            <Button size="sm" color="danger" variant="light" onPress={() => onDelete(review.id)}>
              Delete
            </Button>
          ) : null}
        </div>
        <p className="text-sm text-muted">
          Generated {new Date(review.generatedAt).toLocaleTimeString()}
        </p>
      </CardHeader>

      <CardBody className="gap-6">
        <section>
          <h4 className="text-lg font-semibold mb-3">📊 Practice Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted">Speaking Time</p>
              <p className="text-lg font-semibold">{formatDuration(review.practiceVolume.totalSpeakingTime)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted">Sessions</p>
              <p className="text-lg font-semibold">{review.practiceVolume.sessionsCompleted}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted">Recordings</p>
              <p className="text-lg font-semibold">{review.practiceVolume.recordingsCreated}</p>
            </div>
          </div>
        </section>

        <section>
          <h4 className="text-lg font-semibold mb-3">🔍 Analysis</h4>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Common Patterns:</p>
              <ul className="list-disc list-inside space-y-1">
                {review.transcriptAnalysis.commonPatterns.map((pattern, index) => (
                  <li key={index} className="text-sm">
                    {pattern}
                  </li>
                ))}
              </ul>
            </div>

            {review.transcriptAnalysis.sentenceStructureAnalysis ? (
              <div className="bg-primary/5 p-3 rounded-lg border border-primary/10">
                <p className="text-xs font-bold text-primary mb-1 uppercase">Syntactic Analysis</p>
                <p className="text-sm">{review.transcriptAnalysis.sentenceStructureAnalysis}</p>
              </div>
            ) : null}

            {review.transcriptAnalysis.frequentErrors.length > 0 ? (
              <div>
                <p className="text-sm font-medium mb-2">Frequent Errors:</p>
                <div className="space-y-2">
                  {review.transcriptAnalysis.frequentErrors.map((error, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">
                        <Chip size="sm" variant="flat">
                          {error.type}
                        </Chip>{' '}
                        {error.description}
                      </span>
                      <span className="text-sm font-semibold">×{error.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div>
              <p className="text-sm font-medium mb-1">Vocabulary Diversity:</p>
              <div className="flex items-center gap-3">
                <Progress
                  aria-label="Vocabulary diversity"
                  value={review.transcriptAnalysis.vocabularyDiversity * 100}
                  className="flex-1"
                />
                <span className="text-sm font-semibold">
                  {(review.transcriptAnalysis.vocabularyDiversity * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h4 className="text-lg font-semibold mb-3">🎯 Top Priority Items</h4>
          <div className="space-y-3">
            {review.priorityItems.map((item, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm text-muted mt-1">{item.explanation}</p>
                  </div>
                  <Chip
                    size="sm"
                    color={item.severity === 'high' ? 'danger' : item.severity === 'medium' ? 'warning' : 'default'}
                    variant="flat"
                  >
                    {item.severity}
                  </Chip>
                </div>
                <p className="text-sm mt-3">
                  <span className="font-medium">Quick fix:</span> {item.quickFixTip}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-lg font-semibold">🧠 Mini Knowledge Check</h4>
            <Button size="sm" variant="flat" onPress={() => setShowAnswers((current) => !current)}>
              {showAnswers ? 'Hide answers' : 'Show answers'}
            </Button>
          </div>
          <div className="space-y-3">
            {review.miniCheck.questions.map((question) => (
              <div key={question.id} className="rounded-lg border p-4">
                <p className="font-medium">{question.question}</p>
                {showAnswers ? (
                  <div className="mt-3 text-sm text-muted space-y-2">
                    <p>
                      <span className="font-medium text-foreground">Answer:</span> {question.correctAnswer}
                    </p>
                    <p>{question.explanation}</p>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h4 className="text-lg font-semibold mb-3">📈 Progress Snapshot</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border bg-default-50">
              <p className="text-sm text-muted">Average Score</p>
              <p className="text-2xl font-semibold">{review.progressSnapshot.averageScore.toFixed(1)}</p>
            </div>
            <div className="p-4 rounded-lg border bg-default-50">
              <p className="text-sm text-muted">Error Rate / 100 Words</p>
              <p className="text-2xl font-semibold">{review.progressSnapshot.errorRatePer100Words.toFixed(1)}</p>
            </div>
            <div className="p-4 rounded-lg border bg-default-50">
              <p className="text-sm text-muted">Trend</p>
              <Chip color={trendColor} variant="flat" className="mt-2">
                {trendIcon} {review.progressSnapshot.trend}
              </Chip>
            </div>
          </div>
        </section>
      </CardBody>
    </Card>
  );
}
