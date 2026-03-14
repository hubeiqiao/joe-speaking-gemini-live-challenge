type RateLimitRecord = {
  count: number;
  resetAt: number;
};

type RateLimitOptions = {
  key: string;
  limit: number;
  windowMs: number;
};

type RateLimitResult = {
  ok: boolean;
  retryAfterSeconds: number;
};

const globalStore = globalThis as typeof globalThis & {
  __joeSpeakingRateLimitStore__?: Map<string, RateLimitRecord>;
};

function getStore() {
  if (!globalStore.__joeSpeakingRateLimitStore__) {
    globalStore.__joeSpeakingRateLimitStore__ = new Map<string, RateLimitRecord>();
  }

  return globalStore.__joeSpeakingRateLimitStore__;
}

export function getClientIp(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for');

  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || 'anonymous';
  }

  return request.headers.get('x-real-ip') || 'anonymous';
}

export function consumeRateLimit({ key, limit, windowMs }: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const store = getStore();
  const current = store.get(key);

  if (!current || current.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSeconds: 0 };
  }

  if (current.count >= limit) {
    return {
      ok: false,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  current.count += 1;
  store.set(key, current);

  return { ok: true, retryAfterSeconds: 0 };
}
