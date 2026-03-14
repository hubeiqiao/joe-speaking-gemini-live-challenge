import { describe, expect, it } from 'vitest';
import { resolveOAuthRedirectBase } from '@/lib/auth/redirect';

describe('resolveOAuthRedirectBase', () => {
  it('prefers the browser origin in local development', () => {
    expect(
      resolveOAuthRedirectBase({
        appUrl: 'https://challenge-app.example.run.app',
        currentOrigin: 'http://localhost:3000',
      }),
    ).toBe('http://localhost:3000');
  });

  it('falls back to the configured deployed URL when origin is missing', () => {
    expect(
      resolveOAuthRedirectBase({
        appUrl: 'https://challenge-app.example.run.app',
      }),
    ).toBe('https://challenge-app.example.run.app');
  });

  it('rejects invalid configured URLs', () => {
    expect(() =>
      resolveOAuthRedirectBase({
        appUrl: 'not-a-url',
      }),
    ).toThrow(/NEXT_PUBLIC_APP_URL/);
  });
});

