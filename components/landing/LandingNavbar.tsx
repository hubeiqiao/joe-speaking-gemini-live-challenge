'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface LandingNavbarProps {
  onStartClick?: () => void;
}

export function LandingNavbar({ onStartClick }: LandingNavbarProps) {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 32);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`mx-3 mt-3 rounded-full border transition-all duration-300 sm:mx-6 lg:mx-8 ${
          hasScrolled
            ? 'border-[var(--landing-border)] bg-white/88 shadow-[var(--landing-shadow-sm)] backdrop-blur-xl'
            : 'border-transparent bg-transparent'
        }`}
      >
        <nav className="landing-section flex items-center justify-between py-3">
          <Link className="flex items-center gap-3" href="/">
            <Image alt="Joe Speaking" className="h-10 w-10" height={40} src="/header-icon.png" width={40} />
            <div className="hidden sm:block">
              <p className="text-base font-semibold text-[var(--landing-text)]">Joe Speaking</p>
              <p className="text-xs tracking-[0.18em] text-[var(--landing-text-tertiary)] uppercase">
                Learn English by actually speaking
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-7 md:flex">
            <a className="text-sm font-medium text-[var(--landing-text-secondary)] transition hover:text-[var(--landing-text)]" href="#features">
              Features
            </a>
            <a
              className="text-sm font-medium text-[var(--landing-text-secondary)] transition hover:text-[var(--landing-text)]"
              href="#how-it-works"
            >
              How It Works
            </a>
          </div>

          <div className="flex items-center gap-2">
            <Link
              className="hidden rounded-full border border-[var(--landing-border)] px-4 py-2 text-sm font-medium text-[var(--landing-text)] transition hover:bg-white md:inline-flex"
              href="/app"
            >
              Open judge demo
            </Link>
            <button
              className="inline-flex rounded-full bg-[var(--landing-accent)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--landing-accent-hover)]"
              onClick={onStartClick}
              type="button"
            >
              Start Speaking Now
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
