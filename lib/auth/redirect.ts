interface ResolveOAuthRedirectBaseArgs {
  appUrl?: string;
  currentOrigin?: string;
}

export function resolveOAuthRedirectBase({
  appUrl,
  currentOrigin,
}: ResolveOAuthRedirectBaseArgs): string {
  if (currentOrigin?.startsWith('http://localhost:') || currentOrigin?.startsWith('http://127.0.0.1:')) {
    return currentOrigin;
  }

  if (!appUrl) {
    if (currentOrigin) {
      return currentOrigin;
    }
    throw new Error('NEXT_PUBLIC_APP_URL is required when no current origin is available.');
  }

  try {
    return new URL(appUrl).toString().replace(/\/$/, '');
  } catch {
    throw new Error('NEXT_PUBLIC_APP_URL must be a valid absolute URL.');
  }
}

