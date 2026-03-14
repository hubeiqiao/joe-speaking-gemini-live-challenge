import { afterEach, describe, expect, it } from 'vitest';
import { POST } from '@/app/api/live/review/route';

const originalGeminiApiKey = process.env.GEMINI_API_KEY;

afterEach(() => {
  process.env.GEMINI_API_KEY = originalGeminiApiKey;
});

describe('POST /api/live/review', () => {
  it('returns a local fallback recap when Gemini is not configured', async () => {
    delete process.env.GEMINI_API_KEY;

    const response = await POST(
      new Request('http://localhost:3000/api/live/review', {
        method: 'POST',
        body: JSON.stringify({
          topic: 'Describe a trip that changed your perspective',
          transcript: [
            { role: 'user', text: 'I described a solo trip that forced me to adapt quickly.' },
            { role: 'assistant', text: 'You gave a vivid story and good reasons.' },
          ],
        }),
        headers: { 'content-type': 'application/json' },
      }),
    );

    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.recap).toMatch(/trip/i);
    expect(payload.nextSteps.length).toBeGreaterThan(0);
  });

  it('rejects invalid bodies', async () => {
    const response = await POST(
      new Request('http://localhost:3000/api/live/review', {
        method: 'POST',
        body: JSON.stringify({ transcript: [] }),
        headers: { 'content-type': 'application/json' },
      }),
    );

    expect(response.status).toBe(400);
  });

  it('rate limits repeated review generation from the same client ip', async () => {
    delete process.env.GEMINI_API_KEY;

    let response!: Response;

    for (let index = 0; index < 21; index += 1) {
      response = await POST(
        new Request('http://localhost:3000/api/live/review', {
          method: 'POST',
          body: JSON.stringify({
            topic: 'Describe a trip that changed your perspective',
            transcript: [
              { role: 'user', text: 'I described a solo trip that forced me to adapt quickly.' },
              { role: 'assistant', text: 'You gave a vivid story and good reasons.' },
            ],
          }),
          headers: {
            'content-type': 'application/json',
            'x-forwarded-for': '198.51.100.11',
          },
        }),
      );
    }

    expect(response.status).toBe(429);
    expect(response.headers.get('retry-after')).toBeTruthy();
  });
});
