'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { JudgeAppShell } from '@/components/app/JudgeAppShell';
import { SignInCard } from '@/components/auth/SignInCard';
import { useAuth } from '@/components/auth/AuthProvider';
import { GeminiLivePanel } from '@/components/live/GeminiLivePanel';
import {
  createBrowserDemoStore,
  type BrowserDemoState,
} from '@/lib/demo/browser-store';
import {
  createEmptyChallengeState,
  saveCollectionItemToState,
  saveReviewToState,
  saveSessionToState,
} from '@/lib/demo/challenge-state';
import {
  buildReviewTranscript,
  createChallengeReview,
  createCollectionInsight,
} from '@/lib/demo/session-artifacts';
import type { ChallengeSession, GeneratedReview, TranscriptTurn } from '@/lib/types/challenge';

const EMPTY_STATE: BrowserDemoState = createEmptyChallengeState();
const LOCAL_DEMO_USER_ID = 'judge-demo-local';

function buildAttemptFromLatest(latest: ChallengeSession): ChallengeSession {
  return {
    ...latest,
    id: `attempt-${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: 'completed',
    overallBand: Number((latest.overallBand + 0.5).toFixed(1)),
    summary: `Re-practice attempt generated from "${latest.title}" with a tighter structure target.`,
  };
}

export function AppClient() {
  const { user, loading, isConfigured, signInWithGoogle, signOut } = useAuth();
  const activeUserId = user?.id ?? null;
  const storageUserId = activeUserId ?? (!isConfigured ? LOCAL_DEMO_USER_ID : null);
  const store = useMemo(() => (storageUserId ? createBrowserDemoStore(storageUserId) : null), [storageUserId]);
  const [state, setState] = useState<BrowserDemoState>(EMPTY_STATE);
  const [liveStatus, setLiveStatus] = useState<string | null>(null);
  const [liveTranscript, setLiveTranscript] = useState<TranscriptTurn[]>([]);
  const [authError, setAuthError] = useState<string | null>(null);

  const refreshState = useCallback(() => {
    if (!store) {
      setState(EMPTY_STATE);
      return;
    }
    setState(store.read());
  }, [store]);

  const applyState = useCallback(
    (nextState: BrowserDemoState) => {
      if (store) {
        store.replace(nextState);
      }
      setState(nextState);
      return nextState;
    },
    [store],
  );

  const persistState = useCallback(
    async (nextState: BrowserDemoState) => {
      if (!isConfigured) {
        return applyState(nextState);
      }

      const response = await fetch('/api/demo/state', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: nextState }),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(payload?.error ?? 'Failed to persist challenge state.');
      }

      const persisted = (await response.json()) as BrowserDemoState;
      return applyState(persisted);
    },
    [applyState, isConfigured],
  );

  useEffect(() => {
    if (!store || !storageUserId) {
      return;
    }

    const currentStore = store;
    const currentUserId = storageUserId;
    let cancelled = false;

    async function provision() {
      const response = await fetch('/api/demo/provision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId }),
      });

      if (!response.ok) {
        if (!cancelled) {
          refreshState();
        }
        return;
      }

      const provisionedState = (await response.json()) as BrowserDemoState;

      if (!cancelled) {
        applyState(provisionedState);
      }
    }

    provision().catch(() => {
      refreshState();
    });

    return () => {
      cancelled = true;
    };
  }, [applyState, refreshState, storageUserId, store]);

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-12">
        <div className="surface-card rounded-[2rem] p-8 text-[var(--text-secondary)]">
          Loading challenge session…
        </div>
      </main>
    );
  }

  if (isConfigured && !user) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-12">
        <SignInCard
          error={authError}
          isConfigured={isConfigured}
          onSignIn={() => {
            signInWithGoogle().catch((error) => {
              setAuthError(error instanceof Error ? error.message : 'Google sign-in failed.');
            });
          }}
        />
      </main>
    );
  }

  if (!store || !storageUserId) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-12">
        <div className="surface-card rounded-[2rem] p-8">
          <h1 className="text-4xl text-[var(--foreground)]">Challenge setup incomplete</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[var(--text-secondary)]">
            The challenge workspace could not initialize a user context. Check the runtime configuration and reload.
          </p>
        </div>
      </main>
    );
  }

  const currentStore = store;
  const currentUserId = storageUserId;
  const latestSession = state.sessions[0] ?? null;
  const latestReview = latestSession
    ? state.reviews.find((review) => review.sessionId === latestSession.id) ?? null
    : null;

  return (
    <JudgeAppShell
      latestReview={latestReview}
      latestSession={latestSession}
      liveStatus={liveStatus}
      onCreateAttempt={() => {
        if (!latestSession) {
          setLiveStatus('Start or load a session before creating a retry attempt.');
          return;
        }
        setLiveTranscript([]);
        void persistState(saveSessionToState(state, buildAttemptFromLatest(latestSession)))
          .then(() => {
            setLiveStatus('A new same-topic retry attempt has been added to the library.');
          })
          .catch((error) => {
            setLiveStatus(error instanceof Error ? error.message : 'Failed to save the retry attempt.');
          });
      }}
      onGenerateReview={async () => {
        if (!latestSession) {
          setLiveStatus('There is no session available to review yet.');
          return;
        }

        setLiveStatus('Generating a coaching recap for the latest attempt…');

        const response = await fetch('/api/live/review', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topic: latestSession.part2Topic ?? latestSession.title,
            transcript: liveTranscript.length > 0 ? liveTranscript : buildReviewTranscript(latestSession),
          }),
        });

        const payload = (await response.json()) as Partial<GeneratedReview> & { error?: string };

        if (!response.ok || !payload.strengths || !payload.nextSteps || !payload.summary) {
          setLiveStatus(payload.error ?? 'Failed to generate the coaching recap.');
          return;
        }

        void persistState(
          saveReviewToState(
            state,
            createChallengeReview({
              generated: {
                summary: payload.summary,
                recap: payload.recap,
                strengths: payload.strengths,
                nextSteps: payload.nextSteps,
              },
              session: latestSession,
              userId: currentUserId,
            }),
          ),
        )
          .then(() => {
            setLiveStatus('Coaching recap ready. You can now save the key takeaway to Collection.');
          })
          .catch((error) => {
            setLiveStatus(error instanceof Error ? error.message : 'Failed to save the coaching recap.');
          });
      }}
      onResetDemo={async () => {
        currentStore.clear();
        setState(EMPTY_STATE);
        setLiveTranscript([]);
        setLiveStatus('Starter demo state reset. Re-provisioning challenge content…');

        const response = await fetch('/api/demo/provision', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reset: true, userId: currentUserId }),
        });

        if (!response.ok) {
          refreshState();
          return;
        }

        const provisionedState = (await response.json()) as BrowserDemoState;
        applyState(provisionedState);
        setLiveStatus('Starter demo content restored.');
      }}
      onSaveInsight={() => {
        if (!latestSession || !latestReview) {
          setLiveStatus('Generate a review before saving a takeaway to Collection.');
          return;
        }

        void persistState(
          saveCollectionItemToState(
            state,
            createCollectionInsight({
              review: latestReview,
              session: latestSession,
              userId: currentUserId,
            }),
          ),
        )
          .then(() => {
            setLiveStatus('Saved the latest retry cue to Collection.');
          })
          .catch((error) => {
            setLiveStatus(error instanceof Error ? error.message : 'Failed to save the collection takeaway.');
          });
      }}
      onSignOut={async () => {
        if (user) {
          await signOut();
          return;
        }

        currentStore.clear();
        setState(EMPTY_STATE);
        setLiveTranscript([]);
        setLiveStatus('Local judge demo cleared.');
      }}
      isLocalMode={!isConfigured}
      livePanel={
        <GeminiLivePanel
          onStatusChange={setLiveStatus}
          onTranscriptChange={setLiveTranscript}
          topicPrompt={
            latestSession?.part2Topic ?? latestSession?.title ?? 'Describe a trip that changed your perspective'
          }
          userId={currentUserId}
        />
      }
      state={state}
      userLabel={user?.email ?? 'Judge demo (local mode)'}
    />
  );
}
