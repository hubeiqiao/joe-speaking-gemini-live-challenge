'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SignInCard } from '@/components/auth/SignInCard';
import { useAuth } from '@/components/auth/AuthProvider';

export function SignInPageClient({ initialError = null }: { initialError?: string | null }) {
  const router = useRouter();
  const { user, loading, isConfigured, signInWithGoogle } = useAuth();
  const [error, setError] = useState<string | null>(initialError);

  useEffect(() => {
    if (!loading && user) {
      router.replace('/app');
    }
  }, [loading, router, user]);

  useEffect(() => {
    setError(initialError);
  }, [initialError]);

  return (
    <main className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-12">
      <SignInCard
        error={error}
        isConfigured={isConfigured}
        onSignIn={() => {
          signInWithGoogle().catch((authError) => {
            setError(authError instanceof Error ? authError.message : 'Google sign-in failed.');
          });
        }}
      />
    </main>
  );
}
