import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { JudgeLandingPage } from '@/components/landing/JudgeLandingPage';

describe('JudgeLandingPage', () => {
  it('reuses Joe Speaking landing proof points and keeps the demo CTA pointed at /app', () => {
    render(<JudgeLandingPage />);

    expect(screen.getAllByText(/IELTS Speaking Simulator GPT/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Trusted by 50,000\+ Learners/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Practice with Real Conversation/i).length).toBeGreaterThan(0);
    const openLinks = screen.getAllByRole('link', { name: /open judge demo/i });
    expect(openLinks.length).toBeGreaterThan(0);
    openLinks.forEach((link) => {
      expect(link).toHaveAttribute('href', '/app');
    });
  });
});
