import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppClient } from '@/components/app/AppClient';
import { buildStarterDemoContent } from '@/lib/demo/starter-content';
import { createEmptyChallengeState, provisionChallengeState } from '@/lib/demo/challenge-state';

const { mockUseAuth } = vi.hoisted(() => ({
  mockUseAuth: vi.fn(),
}));

vi.mock('@/components/auth/AuthProvider', () => ({
  useAuth: mockUseAuth,
}));

vi.mock('@/components/live/GeminiLivePanel', () => ({
  GeminiLivePanel: () => <div>Gemini Live Panel</div>,
}));

describe('AppClient', () => {
  const provisionedState = provisionChallengeState(
    createEmptyChallengeState(),
    buildStarterDemoContent({
      userId: 'judge-demo-local',
      now: new Date('2026-03-12T10:00:00.000Z'),
    }),
  );

  beforeEach(() => {
    window.localStorage.clear();
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      isConfigured: false,
      signInWithGoogle: vi.fn(),
      signOut: vi.fn(),
    });
    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        new Response(JSON.stringify(provisionedState), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    );
  });

  it('boots into public local judge mode when Supabase is not configured', async () => {
    render(<AppClient />);

    await waitFor(() => {
      expect(screen.getAllByAltText(/Joe Speaking/i).length).toBeGreaterThan(0);
    });

    expect(screen.getAllByRole('tab', { name: /practice/i }).length).toBeGreaterThan(0);
    expect(screen.queryByText(/Public Demo/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Gemini Live Panel/i)).toBeInTheDocument();
  });
});
