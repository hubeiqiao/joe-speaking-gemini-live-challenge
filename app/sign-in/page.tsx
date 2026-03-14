import { SignInPageClient } from '@/components/auth/SignInPageClient';

function resolveAuthError(errorCode?: string): string | null {
  if (errorCode === 'auth_callback_failed') {
    return 'The OAuth callback failed. Check the configured Google sign-in redirect URL and try again.';
  }

  if (errorCode === 'missing_code') {
    return 'The OAuth callback did not include an authorization code.';
  }

  return null;
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const resolvedSearchParams = await searchParams;

  return <SignInPageClient initialError={resolveAuthError(resolvedSearchParams?.error)} />;
}
