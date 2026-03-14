'use client';

import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

export function SignInCard({
  isConfigured,
  onSignIn,
  error = null,
}: {
  isConfigured: boolean;
  onSignIn: () => void;
  error?: string | null;
}) {
  return (
    <section className="surface-card mx-auto max-w-2xl rounded-[2rem] p-8">
      <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[var(--accent-soft)] px-4 py-2 text-sm font-medium text-[var(--accent-strong)]">
        <ShieldCheck className="h-4 w-4" />
        Separate challenge stack
      </div>
      <h1 className="text-4xl text-[var(--foreground)]">Sign in for the judge demo</h1>
      <p className="mt-4 text-base leading-7 text-[var(--text-secondary)]">
        This challenge build runs on its own Google Cloud stack, and auth is optional for the public judge demo.
      </p>
      {isConfigured ? (
        <button
          className="mt-8 inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-6 py-3 text-base font-semibold text-white transition hover:bg-[var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-60"
          onClick={onSignIn}
          type="button"
        >
          Continue with Google
        </button>
      ) : (
        <Link
          className="mt-8 inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-6 py-3 text-base font-semibold text-white transition hover:bg-[var(--accent-strong)]"
          href="/app"
        >
          Open local judge demo
        </Link>
      )}
      {error ? (
        <p className="mt-4 text-sm text-[var(--danger)]">{error}</p>
      ) : null}
      {!isConfigured ? (
        <p className="mt-4 text-sm text-[var(--text-secondary)]">
          Google sign-in is disabled in this build configuration, so the app will open the local judge demo directly.
        </p>
      ) : null}
    </section>
  );
}
