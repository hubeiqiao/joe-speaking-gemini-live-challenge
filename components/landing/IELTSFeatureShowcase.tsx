'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Award, BarChart2, Layout, Mic } from 'lucide-react';

const features = [
  {
    description: 'Part 1, 2 & 3 or a full test. Practice your way.',
    icon: Layout,
    id: 'modes',
    images: ['/landing/ielts-showcase/main-page.png'],
    title: 'Flexible Practice Modes',
  },
  {
    description: 'Speak naturally with an AI examiner. Includes smart cue cards for Part 2.',
    icon: Mic,
    id: 'conversation',
    images: ['/landing/ielts-showcase/conversation.png', '/landing/ielts-showcase/cue-card.png'],
    title: 'Real-time Conversation',
  },
  {
    description: 'Get estimated band scores immediately after your session.',
    icon: Award,
    id: 'scoring',
    images: ['/landing/ielts-showcase/band-score.png'],
    title: 'Instant Scoring',
  },
  {
    description: 'Question-by-question feedback, pronunciation insights, and version-aware comparisons.',
    icon: BarChart2,
    id: 'feedback',
    images: [
      '/landing/ielts-showcase/pronunciation.png',
      '/landing/ielts-showcase/section-feedback.png',
      '/landing/ielts-showcase/feedback-summary.webp',
    ],
    title: 'Comprehensive Feedback',
  },
] as const;

export function IELTSFeatureShowcase() {
  const [activeFeature, setActiveFeature] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const currentFeature = features[activeFeature];

  useEffect(() => {
    setImageIndex(0);
    const imageTimer =
      currentFeature.images.length > 1
        ? window.setInterval(() => {
            setImageIndex((current) => (current + 1) % currentFeature.images.length);
          }, 2500)
        : null;

    const featureTimer = window.setInterval(() => {
      setActiveFeature((current) => (current + 1) % features.length);
    }, 5000);

    return () => {
      if (imageTimer) {
        window.clearInterval(imageTimer);
      }
      window.clearInterval(featureTimer);
    };
  }, [currentFeature.images.length]);

  const activeImage = useMemo(() => currentFeature.images[imageIndex], [currentFeature.images, imageIndex]);

  return (
    <section className="space-y-10">
      <div className="mx-auto max-w-3xl text-center">
        <h3 className="text-3xl font-semibold text-[var(--landing-text)] sm:text-4xl">Practice with Real Conversation</h3>
        <p className="mt-4 text-lg leading-8 text-[var(--landing-text-secondary)]">
          Experience authentic IELTS speaking with natural conversation flow. Just talk. No dead recorder, no awkward
          clicking through questions.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[0.42fr_0.58fr] lg:items-start">
        <div className="flex flex-col gap-3" role="tablist">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isActive = index === activeFeature;
            return (
              <button
                key={feature.id}
                aria-controls={`showcase-panel-${feature.id}`}
                aria-selected={isActive}
                className={`rounded-[1.5rem] border p-5 text-left transition ${
                  isActive
                    ? 'border-[var(--landing-border)] bg-white shadow-[var(--landing-shadow-sm)]'
                    : 'border-transparent bg-white/40 hover:bg-white/70'
                }`}
                id={`showcase-tab-${feature.id}`}
                onClick={() => setActiveFeature(index)}
                role="tab"
                type="button"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-full ${
                      isActive
                        ? 'bg-[var(--landing-accent)] text-white'
                        : 'bg-[var(--landing-accent-soft)] text-[var(--landing-accent-dark)]'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-[var(--landing-text)]">{feature.title}</h4>
                    <p className="mt-2 text-sm leading-6 text-[var(--landing-text-secondary)]">{feature.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div
          aria-labelledby={`showcase-tab-${currentFeature.id}`}
          className="relative"
          id={`showcase-panel-${currentFeature.id}`}
          role="tabpanel"
        >
          <div className="absolute inset-x-10 top-6 h-48 rounded-full bg-[var(--landing-accent-soft)]/50 blur-3xl" />
          <div className="landing-card relative overflow-hidden rounded-[2rem] p-3">
            <div className="flex items-center gap-2 border-b border-[var(--landing-border)] px-4 py-3">
              <div className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
              <div className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
              <div className="ml-auto flex gap-2">
                {currentFeature.images.map((_, indicatorIndex) => (
                  <span
                    key={`${currentFeature.id}-${indicatorIndex}`}
                    className={`h-2 w-2 rounded-full ${
                      indicatorIndex === imageIndex ? 'bg-[var(--landing-accent)]' : 'bg-[var(--landing-border)]'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="relative aspect-[4/3] bg-[var(--landing-surface)]">
              <Image alt={currentFeature.title} className="object-contain p-2" fill sizes="(max-width: 1024px) 100vw, 58vw" src={activeImage} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
