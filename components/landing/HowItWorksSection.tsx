'use client';

import { BookOpen, FileText, Mic, RefreshCw, Sparkles, Trophy } from 'lucide-react';

const sourceCards = [
  { description: 'Part 1, 2, 3 question bank', label: 'IELTS', meta: '130+ topics', icon: BookOpen },
  { description: 'All speaking tasks covered', label: 'CELPIP', meta: '8 tasks', icon: Trophy },
  { description: 'Recap your day, interviews, anything', label: 'Custom', meta: 'Freestyle', icon: Sparkles },
] as const;

const practiceLoop = [
  { description: 'Answer the prompt', label: 'Record', icon: Mic },
  { description: 'Check your transcript', label: 'Review', icon: FileText },
  { description: 'Get AI insights', label: 'Feedback', icon: Sparkles },
  { description: 'Same topic, better answer', label: 'One More Time', icon: RefreshCw },
] as const;

export function HowItWorksSection() {
  return (
    <section className="landing-section pb-28 pt-10" id="how-it-works">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-semibold text-[var(--landing-text)] sm:text-4xl lg:text-5xl">
          Your Daily Practice Companion
        </h2>
        <p className="mt-4 text-lg leading-8 text-[var(--landing-text-secondary)]">
          Practice anytime. Any topic. Get better every time.
        </p>
      </div>

      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {sourceCards.map((source) => {
          const Icon = source.icon;
          return (
            <article key={source.label} className="landing-card rounded-[1.75rem] p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--landing-accent-soft)] text-[var(--landing-accent-dark)]">
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-4 text-lg font-semibold text-[var(--landing-text)]">{source.label}</p>
              <p className="mt-1 text-sm font-medium text-[var(--landing-accent-dark)]">{source.meta}</p>
              <p className="mt-3 text-sm leading-6 text-[var(--landing-text-secondary)]">{source.description}</p>
            </article>
          );
        })}
      </div>

      <div className="landing-card mt-14 rounded-[2rem] p-6 sm:p-8">
        <div className="max-w-3xl">
          <h3 className="text-2xl font-semibold text-[var(--landing-text)] sm:text-3xl">Same Topic, Multiple Takes</h3>
          <p className="mt-4 text-base leading-7 text-[var(--landing-text-secondary)]">
            Real improvement comes from deliberate practice. Try the same topic multiple times. Compare your versions.
            Watch yourself get better.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {practiceLoop.map((step, index) => {
            const Icon = step.icon;
            return (
              <article key={step.label} className="rounded-[1.5rem] border border-[var(--landing-border)] bg-white/80 p-5">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--landing-accent-soft)] text-[var(--landing-accent-dark)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--landing-text-tertiary)]">
                    0{index + 1}
                  </span>
                </div>
                <h4 className="mt-6 text-lg font-semibold text-[var(--landing-text)]">{step.label}</h4>
                <p className="mt-3 text-sm leading-6 text-[var(--landing-text-secondary)]">{step.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
