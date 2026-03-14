'use client';

import { BeyondIELTSSection } from '@/components/landing/BeyondIELTSSection';
import { FooterSection } from '@/components/landing/FooterSection';
import { HeroSection } from '@/components/landing/HeroSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { LandingNavbar } from '@/components/landing/LandingNavbar';

export function JudgeLandingPage() {
  const handleStartClick = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/app';
    }
  };

  return (
    <main className="landing-shell overflow-x-hidden bg-[var(--landing-bg)]">
      <LandingNavbar onStartClick={handleStartClick} />
      <div id="main-content">
        <HeroSection onCtaClick={handleStartClick} />
        <BeyondIELTSSection />
        <HowItWorksSection />
        <FooterSection />
      </div>
    </main>
  );
}
