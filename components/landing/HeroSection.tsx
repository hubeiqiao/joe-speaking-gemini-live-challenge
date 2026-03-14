'use client';

import { ArrowRight, Sparkles } from 'lucide-react';
import Image from 'next/image';

interface HeroSectionProps {
  onCtaClick?: () => void;
}

export function HeroSection({ onCtaClick }: HeroSectionProps) {
  return (
    <section className="landing-section grid gap-12 pb-20 pt-28 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-14 lg:pt-36">
      <div className="max-w-xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--landing-border)] bg-white/80 px-4 py-2 text-sm text-[var(--landing-text-secondary)]">
          <Sparkles className="h-4 w-4 text-[var(--landing-accent)]" />
          Built by a learner, for learners.
        </div>

        <h1 className="mt-6 text-5xl leading-[1.02] tracking-tight text-[var(--landing-text)] sm:text-6xl lg:text-7xl">
          Built by a learner,
          <br />
          <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 bg-clip-text text-transparent">
            for learners.
          </span>
        </h1>

        <p className="mt-6 max-w-lg text-lg leading-8 text-[var(--landing-text-secondary)] sm:text-xl">
          Language is for communication, not perfection. Practice live with Gemini, review what happened, and retry
          the same topic until the pattern clicks.
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <button
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#111111] px-8 py-4 text-base font-semibold text-white transition hover:-translate-y-0.5 hover:bg-black"
            onClick={onCtaClick}
            type="button"
          >
            Start Speaking Now
            <ArrowRight className="h-4 w-4" />
          </button>
          <a
            className="inline-flex items-center justify-center rounded-full border border-[var(--landing-border)] bg-white/80 px-8 py-4 text-base font-semibold text-[var(--landing-text)] transition hover:bg-white"
            href="#features"
          >
            Learn More
          </a>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          <div className="landing-card rounded-[1.75rem] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--landing-text-tertiary)]">
              Based on
            </p>
            <p className="mt-2 text-lg font-semibold text-[var(--landing-text)]">IELTS Speaking Simulator GPT</p>
            <p className="mt-2 text-sm leading-6 text-[var(--landing-text-secondary)]">
              Built on the practice patterns Joe refined with one of the most widely used IELTS speaking GPTs.
            </p>
          </div>
          <div className="landing-card rounded-[1.75rem] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--landing-text-tertiary)]">
              Trust
            </p>
            <p className="mt-2 text-lg font-semibold text-[var(--landing-text)]">Trusted by 50,000+ Learners</p>
            <p className="mt-2 text-sm leading-6 text-[var(--landing-text-secondary)]">
              The challenge build preserves that IELTS speaking credibility while focusing the story on Gemini Live.
            </p>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-x-8 -top-6 h-56 rounded-full bg-[var(--landing-accent-soft)]/60 blur-3xl" />
        <div className="landing-card relative overflow-hidden rounded-[2rem] p-3">
          <div className="rounded-[1.5rem] border border-[var(--landing-border)] bg-[var(--landing-surface)] p-3">
            <Image
              alt="Joe Speaking introduction interface"
              className="h-auto w-full rounded-[1.25rem]"
              height={1328}
              priority
              src="/landing/hero-intro-poster-landscape.webp"
              width={2360}
            />
          </div>

          <div className="grid gap-4 p-5 sm:grid-cols-3">
            <div>
              <p className="text-sm font-semibold text-[var(--landing-text)]">The Most Realistic IELTS Speaking Simulator</p>
              <p className="mt-1 text-sm leading-6 text-[var(--landing-text-secondary)]">
                Real-time conversation instead of reading prompts into a dead recorder.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--landing-text)]">My Daily Practice Tool</p>
              <p className="mt-1 text-sm leading-6 text-[var(--landing-text-secondary)]">
                Library, version history, and saved takeaways stay tied to real speaking attempts.
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--landing-text)]">Repetition & Patterns</p>
              <p className="mt-1 text-sm leading-6 text-[var(--landing-text-secondary)]">
                Same topic, multiple takes, visible improvement across versions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
