'use client';

import { Card, CardBody } from '@heroui/react';
import { Mic, Sparkles } from 'lucide-react';
import { ChallengeSimulatorCard } from '@/components/tabs/ChallengeSimulatorCard';

export function PracticeTab({
  livePanel,
  onCreateAttempt,
  onGenerateReview,
}: {
  livePanel?: React.ReactNode;
  onCreateAttempt: () => void;
  onGenerateReview: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 p-3 sm:px-4 sm:pb-4 sm:pt-10 max-w-3xl mx-auto w-full">
      <div className="w-full">
        <div className="flex items-center gap-3 mb-3 mx-2 sm:mx-0 text-foreground pt-2 sm:pt-0">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 text-amber-600 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_1px_2px_rgba(0,0,0,0.05)] border border-amber-200/50">
            <Sparkles className="w-4 h-4" />
          </div>
          <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl tracking-tight text-foreground/90">
            Live Conversation
          </h2>
        </div>

        <ChallengeSimulatorCard className="mb-6 sm:mb-8 mx-2 sm:mx-0" />

        <div className="mb-8 mx-2 sm:mx-0" id="gemini-live-panel">
          {livePanel}
        </div>

        <div className="flex items-center gap-3 mb-3 mx-2 sm:mx-0 text-foreground">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-rose-100 to-pink-100 text-rose-600 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_1px_2px_rgba(0,0,0,0.05)] border border-rose-200/50">
            <Mic className="w-4 h-4" />
          </div>
          <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl tracking-tight text-foreground/90">
            Recording Practice
          </h2>
        </div>

        <Card className="mb-2 border border-default-100 shadow-[var(--landing-shadow-md)] mx-2 sm:mx-0 bg-content1/50 backdrop-blur-sm">
          <CardBody className="gap-3 sm:gap-4 p-4 sm:p-5">
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-2">Practice Loop</label>
              <div className="rounded-xl border border-default-100 bg-default-50/50 px-4 py-4">
                <p className="text-base font-semibold text-foreground">Keep the same topic and try again</p>
                <p className="text-sm text-default-500 mt-1">
                  Re-practice the current prompt or refresh the coaching review without leaving the Joe Speaking flow.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2 sm:mt-1">
              <button
                onClick={onCreateAttempt}
                className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 p-3.5 text-white transition-all duration-300 hover:shadow-[var(--landing-shadow-lg)] hover:scale-[1.01] active:scale-[0.98] shadow-[var(--landing-shadow-md)]"
                type="button"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-center justify-center gap-3">
                  <div className="p-2 rounded-full bg-white/20">
                    <RefreshIcon />
                  </div>
                  <span className="font-semibold text-base sm:text-lg">One More Time</span>
                </div>
              </button>

              <button
                onClick={onGenerateReview}
                className="text-sm text-default-500 hover:text-default-700 transition-colors underline underline-offset-2"
                type="button"
              >
                or Generate Review
              </button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

function RefreshIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  );
}
