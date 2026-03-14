'use client';

import Image from 'next/image';
import Link from 'next/link';

export function FooterSection() {
  return (
    <footer className="border-t border-[var(--landing-border)] bg-[var(--landing-surface)] py-12">
      <div className="landing-section grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div>
          <Link className="flex items-center gap-3" href="/">
            <Image alt="Joe Speaking" className="h-11 w-11" height={44} src="/header-logo.png" width={44} />
            <div>
              <p className="text-base font-semibold text-[var(--landing-text)]">Joe Speaking</p>
              <p className="text-sm text-[var(--landing-text-secondary)]">Learn English by actually speaking</p>
            </div>
          </Link>

          <p className="mt-4 max-w-md text-sm leading-7 text-[var(--landing-text-secondary)]">
            Competition build for the Gemini Live Agent Challenge. Joe Speaking UI, Gemini Live runtime, and a
            challenge-safe public demo path.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--landing-text-tertiary)]">Product</h4>
          <ul className="mt-4 space-y-3 text-sm text-[var(--landing-text-secondary)]">
            <li>
              <Link className="transition hover:text-[var(--landing-text)]" href="/app">
                Open demo
              </Link>
            </li>
            <li>
              <a className="transition hover:text-[var(--landing-text)]" href="#features">
                IELTS showcase
              </a>
            </li>
            <li>
              <a className="transition hover:text-[var(--landing-text)]" href="#how-it-works">
                Practice loop
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--landing-text-tertiary)]">
            Challenge stack
          </h4>
          <ul className="mt-4 space-y-3 text-sm text-[var(--landing-text-secondary)]">
            <li>Gemini Live</li>
            <li>Google GenAI SDK</li>
            <li>Google Cloud Run</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
