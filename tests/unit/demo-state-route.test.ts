import { beforeEach, describe, expect, it, vi } from 'vitest';

const { isSupabaseConfigured, createChallengeServerClient } = vi.hoisted(() => ({
  isSupabaseConfigured: vi.fn(),
  createChallengeServerClient: vi.fn(),
}));

vi.mock('@/lib/config/env', () => ({
  isSupabaseConfigured,
}));

vi.mock('@/lib/supabase/server', () => ({
  createChallengeServerClient,
}));

import { GET, PUT } from '@/app/api/demo/state/route';

function createRouteClient({
  state = null,
  userId = 'user-123',
}: {
  state?: unknown;
  userId?: string | null;
}) {
  const maybeSingle = vi.fn(async () => ({ data: state ? { state } : null, error: null }));
  const single = vi.fn(async () => ({ data: { state }, error: null }));
  const eq = vi.fn(() => ({ maybeSingle }));
  const selectAfterUpsert = vi.fn(() => ({ single }));
  const select = vi.fn(() => ({ eq }));
  const upsert = vi.fn((payload: { state: unknown }) => {
    state = payload.state;
    return { select: selectAfterUpsert };
  });

  return {
    auth: {
      getUser: vi.fn(async () => ({
        data: {
          user: userId ? { id: userId } : null,
        },
      })),
    },
    from: vi.fn(() => ({
      select,
      upsert,
    })),
    __calls: {
      eq,
      maybeSingle,
      single,
      upsert,
    },
  };
}

beforeEach(() => {
  vi.resetAllMocks();
});

describe('/api/demo/state', () => {
  it('returns an empty challenge state when the user has no saved row', async () => {
    isSupabaseConfigured.mockReturnValue(true);
    createChallengeServerClient.mockResolvedValue(createRouteClient({ state: null }));

    const response = await GET(new Request('http://localhost:3000/api/demo/state'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({
      collectionItems: [],
      sessions: [],
      reviews: [],
    });
  });

  it('rejects unauthenticated state writes', async () => {
    isSupabaseConfigured.mockReturnValue(true);
    createChallengeServerClient.mockResolvedValue(createRouteClient({ userId: null }));

    const response = await PUT(
      new Request('http://localhost:3000/api/demo/state', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          state: {
            collectionItems: [],
            sessions: [],
            reviews: [],
          },
        }),
      }),
    );

    expect(response.status).toBe(401);
  });
});
