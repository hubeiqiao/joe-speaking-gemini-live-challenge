import { describe, expect, it } from 'vitest';
import { sanitizeNextPath } from '@/lib/auth/sanitize-next-path';

describe('sanitizeNextPath', () => {
  it('keeps safe internal paths', () => {
    expect(sanitizeNextPath('/app')).toBe('/app');
    expect(sanitizeNextPath('/app/session/123')).toBe('/app/session/123');
  });

  it('rejects absolute urls and protocol-relative values', () => {
    expect(sanitizeNextPath('https://example.com/evil')).toBe('/app');
    expect(sanitizeNextPath('//example.com/evil')).toBe('/app');
  });

  it('falls back when the value is blank', () => {
    expect(sanitizeNextPath('')).toBe('/app');
  });
});

