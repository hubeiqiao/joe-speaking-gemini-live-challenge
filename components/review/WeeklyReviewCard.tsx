'use client';

import { Button, Card, CardBody, CardHeader, Chip, Progress } from '@heroui/react';
import { formatDateRangeDisplay, formatMinutes } from '@/lib/analytics/date-utils';
import type { WeeklyReview } from '@/lib/types/analytics';

export function WeeklyReviewCard({
  review,
  onDelete,
}: {
  review: WeeklyReview;
  onDelete?: (id: string) => void;
}) {
  const maxMinutes = Math.max(...review.timeStats.dailyBreakdown.map((day) => day.minutes), 1);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col items-start gap-2 pb-4">
        <div className="flex items-center justify-between w-full">
          <div>
            <h3 className="text-xl font-bold">Week {review.id}</h3>
            <p className="text-sm text-muted">{formatDateRangeDisplay(review.weekStart, review.weekEnd)}</p>
          </div>
          {onDelete ? (
            <Button size="sm" color="danger" variant="light" onPress={() => onDelete(review.id)}>
              Delete
            </Button>
          ) : null}
        </div>
      </CardHeader>

      <CardBody className="gap-6">
        <section>
          <h4 className="text-lg font-semibold mb-3">📊 Weekly Summary</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted">Total Time</p>
              <p className="text-lg font-semibold">{formatMinutes(review.timeStats.totalMinutes)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted">Sessions</p>
              <p className="text-lg font-semibold">{review.practiceSummary.sessionsCompleted}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted">Days Practiced</p>
              <p className="text-lg font-semibold">{review.consistency.daysPracticed} / 7</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted">Consistency</p>
              <p className="text-lg font-semibold">
                {(review.practiceSummary.consistencyScore * 100).toFixed(0)}%
              </p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium mb-1">Most Productive Day:</p>
            <Chip color="success" variant="flat">
              {review.practiceSummary.mostProductiveDay}
            </Chip>
          </div>
        </section>

        <section>
          <h4 className="text-lg font-semibold mb-3">📈 Daily Breakdown</h4>
          <div className="space-y-2">
            {review.timeStats.dailyBreakdown.map((day, index) => (
              <div key={index} className="flex items-center gap-3">
                <p className="text-sm w-24 flex-shrink-0">{day.day}</p>
                <div className="flex-1 flex items-center gap-2">
                  <Progress
                    aria-label={`${day.day} speaking minutes`}
                    value={(day.minutes / maxMinutes) * 100}
                    className="flex-1"
                    color={day.minutes >= 5 ? 'success' : 'default'}
                  />
                  <span className="text-sm font-semibold w-16 text-right">{day.minutes.toFixed(0)}m</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h4 className="text-lg font-semibold mb-3">🔍 Insights</h4>
          <div className="space-y-4">
            {review.insights.criterionTrends.length > 0 ? (
              <div>
                <p className="text-sm font-medium mb-2">Criterion Trends:</p>
                <div className="space-y-2">
                  {review.insights.criterionTrends.map((trend, index) => (
                    <div key={index} className="p-3 bg-background rounded-lg border">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold">{trend.criterion}</span>
                        <Chip
                          size="sm"
                          color={
                            trend.trend === 'improving'
                              ? 'success'
                              : trend.trend === 'declining'
                                ? 'danger'
                                : 'default'
                          }
                          variant="flat"
                        >
                          {trend.trend === 'improving' ? '📈' : trend.trend === 'declining' ? '📉' : '📊'}{' '}
                          {trend.percentChange > 0 ? '+' : ''}
                          {trend.percentChange}%
                        </Chip>
                      </div>
                      <p className="text-sm text-muted">{trend.details}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {review.insights.improvements.length > 0 ? (
              <div>
                <p className="text-sm font-medium mb-2">Improvements Maintained:</p>
                <ul className="list-disc list-inside space-y-1">
                  {review.insights.improvements.map((improvement, index) => (
                    <li key={index} className="text-sm text-success">
                      {improvement}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </section>

        <section>
          <h4 className="text-lg font-semibold mb-3">🎯 Focus for Next Week</h4>
          <div className="p-4 bg-primary/5 border-l-4 border-primary rounded-lg">
            <h5 className="font-bold text-lg mb-2">{review.focusRecommendation.skill}</h5>
            <p className="text-sm mb-3">{review.focusRecommendation.reason}</p>
            <div className="mb-3">
              <p className="text-xs font-semibold text-muted mb-1">Goal:</p>
              <p className="text-sm font-medium">{review.focusRecommendation.goal}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted mb-1">Practice Tips:</p>
              <ul className="space-y-1">
                {review.focusRecommendation.resources.map((resource, index) => (
                  <li key={index} className="text-sm pl-3">
                    • {resource}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </CardBody>
    </Card>
  );
}
