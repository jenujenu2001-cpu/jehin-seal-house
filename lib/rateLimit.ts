/**
 * Minimal in-memory rate limiter, scoped to a single Node process.
 *
 * This is intentionally simple — it resets on server restart and doesn't
 * share state across multiple instances. That matches the rest of this
 * project's architecture (a single-instance, file-backed site for one
 * shop); if this ever runs behind a multi-instance/serverless deployment,
 * swap this for a shared store (Redis, Upstash, etc.) instead.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

/**
 * Returns true if `key` is currently allowed to make another attempt.
 * Each call that returns true also counts as one attempt.
 */
export function checkRateLimit(key: string, maxAttempts: number, windowMs: number): boolean {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (existing.count >= maxAttempts) {
    return false;
  }

  existing.count += 1;
  return true;
}

// Periodically forget old buckets so this Map can't grow without bound.
// (No .unref() here — this interval running is fine for the lifetime of a
// long-running Next.js server process.)
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}, 5 * 60 * 1000);
