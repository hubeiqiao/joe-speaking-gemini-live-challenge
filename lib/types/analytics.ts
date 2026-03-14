export interface PracticeVolumeComparison {
  speakingTimeDiff: number;
  sessionsDiff: number;
  recordingsDiff: number;
}

export interface PracticeVolume {
  totalSpeakingTime: number;
  sessionsCompleted: number;
  recordingsCreated: number;
  comparisonVsPrevious: PracticeVolumeComparison;
}

export interface FrequentError {
  type: 'grammar' | 'vocabulary' | 'coherence' | 'pronunciation';
  description: string;
  count: number;
}

export interface TranscriptAnalysis {
  totalWords: number;
  uniqueWords: number;
  commonPatterns: string[];
  frequentErrors: FrequentError[];
  vocabularyDiversity: number;
  sentenceStructureAnalysis?: string;
}

export interface PriorityItem {
  title: string;
  explanation: string;
  examples: string[];
  quickFixTip: string;
  severity: 'high' | 'medium' | 'low';
}

export interface MiniCheckQuestion {
  id: string;
  question: string;
  correctAnswer: string;
  explanation: string;
}

export interface MiniCheck {
  questions: MiniCheckQuestion[];
  score?: number;
}

export interface ProgressSnapshot {
  errorRatePer100Words: number;
  vocabularyDiversityScore: number;
  averageScore: number;
  trend: 'improving' | 'stable' | 'declining';
  comparisonVsYesterday: {
    errorRateDiff: number;
    vocabularyDiff: number;
    scoreDiff: number;
  };
}

export interface DailyReview {
  id: string;
  date: Date;
  practiceVolume: PracticeVolume;
  transcriptAnalysis: TranscriptAnalysis;
  priorityItems: PriorityItem[];
  miniCheck: MiniCheck;
  progressSnapshot: ProgressSnapshot;
  generatedAt: Date;
  dismissed: boolean;
}

export interface PracticeSummary {
  totalTime: number;
  sessionsCompleted: number;
  mostProductiveDay: string;
  consistencyScore: number;
}

export interface CriterionTrend {
  criterion: string;
  trend: 'improving' | 'stable' | 'declining';
  percentChange: number;
  details: string;
}

export interface PersistentIssue {
  issue: string;
  occurrences: number;
  examples: string[];
}

export interface AggregatedInsights {
  criterionTrends: CriterionTrend[];
  persistentIssues: PersistentIssue[];
  improvements: string[];
}

export interface FocusRecommendation {
  skill: string;
  reason: string;
  goal: string;
  resources: string[];
}

export interface DailyTimeBreakdown {
  day: string;
  minutes: number;
}

export interface TimeStats {
  totalMinutes: number;
  dailyAverage: number;
  longestStreak: number;
  dailyBreakdown: DailyTimeBreakdown[];
}

export interface ConsistencyMetrics {
  daysPracticed: number;
  comparisonVsLastWeek: number;
  currentStreak: number;
  idealPattern: string;
}

export interface AchievementHighlights {
  milestones: string[];
  personalBests: Array<{
    metric: string;
    value: string;
    date: Date;
  }>;
}

export interface WeeklyReview {
  id: string;
  weekStart: Date;
  weekEnd: Date;
  practiceSummary: PracticeSummary;
  insights: AggregatedInsights;
  focusRecommendation: FocusRecommendation;
  timeStats: TimeStats;
  consistency: ConsistencyMetrics;
  achievements: AchievementHighlights;
  generatedAt: Date;
  dismissed: boolean;
}
