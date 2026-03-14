import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SignInCard } from '@/components/auth/SignInCard';

describe('SignInCard', () => {
  it('renders the Google sign-in CTA and challenge-safe messaging', () => {
    render(<SignInCard isConfigured onSignIn={() => undefined} />);

    expect(
      screen.getByRole('button', { name: /continue with google/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/separate challenge stack/i),
    ).toBeInTheDocument();
  });

  it('links into the local judge demo when Supabase auth is not configured', () => {
    render(<SignInCard isConfigured={false} onSignIn={() => undefined} />);

    expect(
      screen.getByRole('link', { name: /open local judge demo/i }),
    ).toHaveAttribute('href', '/app');
    expect(
      screen.getByText(/google sign-in is disabled/i),
    ).toBeInTheDocument();
    expect(screen.queryByText(/supabase/i)).not.toBeInTheDocument();
  });
});
