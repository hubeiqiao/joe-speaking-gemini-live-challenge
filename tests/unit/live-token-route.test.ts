import { afterEach, describe, expect, it } from 'vitest';
import { POST } from '@/app/api/live/token/route';

const originalGeminiApiKey = process.env.GEMINI_API_KEY;

afterEach(() => {
  process.env.GEMINI_API_KEY = originalGeminiApiKey;
});

describe('POST /api/live/token', () => {
  it('rejects invalid bodies', async () => {
    const response = await POST(
      new Request('http://localhost:3000/api/live/token', {
        method: 'POST',
        body: JSON.stringify({}),
        headers: { 'content-type': 'application/json' },
      }),
    );

    expect(response.status).toBe(400);
  });

  it('returns 503 when Gemini is not configured', async () => {
    delete process.env.GEMINI_API_KEY;

    const response = await POST(
      new Request('http://localhost:3000/api/live/token', {
        method: 'POST',
        body: JSON.stringify({ userId: 'user-123' }),
        headers: { 'content-type': 'application/json' },
      }),
    );

    const payload = await response.json();

    expect(response.status).toBe(503);
    expect(payload.error).toMatch(/gemini/i);
  });

  it('rate limits repeated token requests from the same client ip', async () => {
    delete process.env.GEMINI_API_KEY;

    let response!: Response;

    for (let index = 0; index < 9; index += 1) {
      response = await POST(
        new Request('http://localhost:3000/api/live/token', {
          method: 'POST',
          body: JSON.stringify({ userId: 'user-123' }),
          headers: {
            'content-type': 'application/json',
            'x-forwarded-for': '198.51.100.10',
          },
        }),
      );
    }

    expect(response.status).toBe(429);
    expect(response.headers.get('retry-after')).toBeTruthy();
  });
});
