import { describe, expect, it, vi } from 'vitest';
import { POST } from '@/app/api/demo/provision/route';

vi.mock('@/lib/config/env', () => ({
  isSupabaseConfigured: vi.fn(() => false),
}));

describe('POST /api/demo/provision', () => {
  it('returns provisioned challenge state for a valid user id in local mode', async () => {
    const request = new Request('http://localhost:3000/api/demo/provision', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'user-123' }),
    });

    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.collectionItems).toHaveLength(2);
    expect(payload.sessions).toHaveLength(1);
    expect(payload.reviews).toHaveLength(1);
    expect(payload.sessions[0]?.userId).toBe('user-123');
  });

  it('rejects invalid payloads', async () => {
    const request = new Request('http://localhost:3000/api/demo/provision', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: '' }),
    });

    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toMatch(/invalid request/i);
  });
});
