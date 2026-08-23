import cache from '../redis/redis.js';

/**
 * Check rate limit for an identifier
 * @param {string} identifier (e.g. `ip:endpoint`)
 * @param {number} maxRequests 
 * @param {number} windowSeconds 
 * @returns {Promise<{ allowed: boolean, remaining: number, resetIn: number }>}
 */
export async function checkRateLimit(identifier, maxRequests = 20, windowSeconds = 60) {
  const key = `ratelimit:${identifier}`;
  const now = Date.now();

  const record = await cache.get(key) || { count: 0, startTime: now };

  if (now - record.startTime > windowSeconds * 1000) {
    // Window expired, reset
    record.count = 1;
    record.startTime = now;
    await cache.set(key, record, windowSeconds);
    return { allowed: true, remaining: maxRequests - 1, resetIn: windowSeconds };
  }

  if (record.count >= maxRequests) {
    const resetIn = Math.ceil((record.startTime + windowSeconds * 1000 - now) / 1000);
    return { allowed: false, remaining: 0, resetIn };
  }

  record.count += 1;
  const resetIn = Math.ceil((record.startTime + windowSeconds * 1000 - now) / 1000);
  await cache.set(key, record, resetIn);

  return { allowed: true, remaining: maxRequests - record.count, resetIn };
}

/**
 * Extract client IP from Next.js Request
 * @param {Request} request 
 * @returns {string}
 */
export function getClientIp(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || '127.0.0.1';
}
