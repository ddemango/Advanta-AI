const store = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(
  ip: string,
  { max = 10, windowMs = 60_000 } = {}
): { allowed: boolean; remaining: number; retryAfterMs: number } {
  const now = Date.now();
  const record = store.get(ip);

  if (!record || now > record.resetAt) {
    store.set(ip, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: max - 1, retryAfterMs: 0 };
  }

  if (record.count >= max) {
    return { allowed: false, remaining: 0, retryAfterMs: record.resetAt - now };
  }

  record.count += 1;
  return { allowed: true, remaining: max - record.count, retryAfterMs: 0 };
}
