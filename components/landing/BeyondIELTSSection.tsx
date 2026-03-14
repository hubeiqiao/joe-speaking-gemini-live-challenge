'use client';

import { ExternalLink, Quote, Star, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { IELTSFeatureShowcase } from '@/components/landing/IELTSFeatureShowcase';

const testimonials = [
  {
    author: 'higher (25fall 读不书版)',
    content:
      "Thank you so much for your selfless sharing! I've been using the model you published for speaking practice and it has been a huge help.",
    image: '/images/testimonials/rednote-1.png',
  },
  {
    author: '心平气和笑对人生 😁',
    content: 'Came to experience it immediately after seeing it. Very easy to use, thank you very much.',
    image: '/images/testimonials/rednote-2.png',
  },
  {
    author: 'Chris Cheng-Hsueh Chan',
    content:
      'I am an avid user of ChatGPT, especially when it comes to language learning. Appreciate these tools.',
    link: 'https://www.linkedin.com/in/chrischchan1/',
  },
] as const;

export function BeyondIELTSSection() {
  return (
    <section className="landing-section space-y-14 pb-24 pt-8" id="features">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-semibold text-[var(--landing-text)] sm:text-4xl lg:text-5xl">
          Beyond IELTS Speaking Simulator
        </h2>
        <p className="mt-5 text-lg leading-8 text-[var(--landing-text-secondary)]">
          I built one of the most popular IELTS Speaking GPTs. Thousands of learners have used it.{' '}
          <strong className="text-[var(--landing-accent-dark)]">Joe Speaking</strong> takes everything I learned and
          goes further.
        </p>
      </div>

      <div className="landing-card rounded-[2rem] p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <Link
            className="flex flex-col gap-4 rounded-[1.5rem] border border-[var(--landing-border)] bg-white/80 p-5 transition hover:bg-white sm:flex-row sm:items-center"
            href="https://chatgpt.com/g/g-uGueIrCsT-ielts-speaking-simulator"
            rel="noreferrer"
            target="_blank"
          >
            <Image
              alt="IELTS Speaking Simulator GPT"
              className="h-16 w-16 rounded-full border border-[var(--landing-border)]"
              height={64}
              src="/landing/logos/ielts-gpt-logo.png"
              width={64}
            />
            <div>
              <div className="flex items-center gap-2 text-lg font-semibold text-[var(--landing-text)]">
                IELTS Speaking Simulator GPT
                <ExternalLink className="h-4 w-4 text-[var(--landing-text-tertiary)]" />
              </div>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[var(--landing-text-secondary)]">
                <span className="inline-flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  4.4 (500+)
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-blue-500" />
                  Trusted by 50,000+ Learners
                </span>
              </div>
            </div>
          </Link>

          <div className="max-w-md">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--landing-text-tertiary)]">
              Challenge framing
            </p>
            <p className="mt-3 text-base leading-7 text-[var(--landing-text-secondary)]">
              This Gemini Live build keeps Joe Speaking’s IELTS credibility, then narrows the product to the judge
              story: real conversation, review, and same-topic progression.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {testimonials.map((testimonial) => (
          <article key={testimonial.author} className="landing-card rounded-[2rem] p-6">
            <Quote className="h-8 w-8 text-[var(--landing-accent)]/30" />
            {'image' in testimonial ? (
              <div className="mt-5 overflow-hidden rounded-[1.25rem] border border-[var(--landing-border)] bg-white">
                <Image
                  alt={`${testimonial.author} testimonial`}
                  className="h-auto w-full"
                  height={920}
                  src={testimonial.image}
                  width={720}
                />
              </div>
            ) : null}
            <p className="mt-5 text-base leading-7 text-[var(--landing-text)]">{testimonial.content}</p>
            <div className="mt-5">
              <p className="font-semibold text-[var(--landing-text)]">{testimonial.author}</p>
              {'link' in testimonial ? (
                <Link
                  className="mt-2 inline-flex items-center gap-2 text-sm text-[var(--landing-accent-dark)]"
                  href={testimonial.link}
                  rel="noreferrer"
                  target="_blank"
                >
                  View profile
                  <ExternalLink className="h-4 w-4" />
                </Link>
              ) : null}
            </div>
          </article>
        ))}
      </div>

      <IELTSFeatureShowcase />
    </section>
  );
}
