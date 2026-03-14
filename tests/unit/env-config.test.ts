import { afterEach, describe, expect, it } from 'vitest';
import { getPublicAppUrl } from '@/lib/config/env';

describe('getPublicAppUrl', () => {
  const originalAppUrl = process.env.NEXT_PUBLIC_APP_URL;

  afterEach(() => {
    if (originalAppUrl === undefined) {
      delete process.env.NEXT_PUBLIC_APP_URL;
      return;
    }

    process.env.NEXT_PUBLIC_APP_URL = originalAppUrl;
  });

  it('defaults to a local port that does not collide with the main Joe Speaking app', () => {
    delete process.env.NEXT_PUBLIC_APP_URL;

    expect(getPublicAppUrl()).toBe('http://localhost:3100');
  });

  it('prefers the configured public app URL when provided', () => {
    process.env.NEXT_PUBLIC_APP_URL = 'https://judge-demo.example.run.app';

    expect(getPublicAppUrl()).toBe('https://judge-demo.example.run.app');
  });
});
