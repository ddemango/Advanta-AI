// Simple in-memory rate limiter
const requests = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(ip: string, maxRequests = 10, windowMs = 60000) {
  const now = Date.now();
  const key = ip;
  
  const current = requests.get(key);
  
  // Reset if window expired
  if (!current || now > current.resetTime) {
    requests.set(key, { count: 1, resetTime: now + windowMs });
    return { ok: true };
  }
  
  // Check if over limit
  if (current.count >= maxRequests) {
    return { ok: false };
  }
  
  // Increment count
  current.count++;
  return { ok: true };
}