import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { buildStarterDemoContent } from '@/lib/demo/starter-content';
import { JudgeAppShell } from '@/components/app/JudgeAppShell';
import { AppProviders } from '@/components/providers/AppProviders';

describe('JudgeAppShell', () => {
  it('uses Joe Speaking tab surfaces instead of challenge-only panels', async () => {
    const user = userEvent.setup();
    const starter = buildStarterDemoContent({
      userId: 'user-123',
      now: new Date('2026-03-12T10:00:00.000Z'),
    });

    render(
      <AppProviders>
        <JudgeAppShell
          userLabel="joe@example.com"
          latestReview={starter.sampleReview}
          latestSession={{
            ...starter.sampleSession,
            id: 'attempt-2',
            createdAt: '2026-03-12T11:00:00.000Z',
            status: 'completed',
            overallBand: 7.5,
          }}
          state={{
            collectionItems: starter.collectionItems,
            reviews: [starter.sampleReview],
            sessions: [
              {
                ...starter.sampleSession,
                id: 'attempt-2',
                createdAt: '2026-03-12T11:00:00.000Z',
                status: 'completed',
                overallBand: 7.5,
              },
              starter.sampleSession,
            ],
          }}
          onCreateAttempt={vi.fn()}
          onGenerateReview={vi.fn()}
          onResetDemo={vi.fn()}
          onSaveInsight={vi.fn()}
          onSignOut={vi.fn()}
        />
      </AppProviders>,
    );

    expect(screen.getAllByAltText(/Joe Speaking/i).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('tab', { name: /practice/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('tab', { name: /library/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('tab', { name: /collection/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('tab', { name: /review/i }).length).toBeGreaterThan(0);
    expect(screen.getByText(/live conversation/i)).toBeInTheDocument();

    await act(async () => {
      await user.click(screen.getAllByRole('tab', { name: /library/i })[0]);
    });

    expect(await screen.findByText(/your practice library/i)).toBeInTheDocument();
    expect(screen.getAllByText(/band 7.5/i).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('button', { name: /weekend travel story/i }).length).toBeGreaterThan(0);

    await act(async () => {
      await user.click(screen.getAllByRole('button', { name: /weekend travel story/i })[0]);
    });

    expect(screen.getAllByRole('tab', { name: /review/i })[0]).toHaveAttribute('aria-selected', 'true');
    expect(await screen.findByText(/selected session/i)).toBeInTheDocument();
    expect(screen.getAllByText(/weekend travel story/i).length).toBeGreaterThan(0);

    await act(async () => {
      await user.click(screen.getAllByRole('tab', { name: /collection/i })[0]);
    });

    expect(await screen.findByPlaceholderText(/search collections/i)).toBeInTheDocument();

    await act(async () => {
      await user.click(screen.getAllByRole('tab', { name: /review/i })[0]);
    });

    expect(screen.getAllByRole('tab', { name: /daily/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('tab', { name: /weekly/i }).length).toBeGreaterThan(0);
  });
});
