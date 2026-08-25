import cache from '../redis/redis.js';

/**
 * Check rate limit for an identifier using atomic increment
 * @param {string} identifier (e.g. `login:192.168.1.1`)
 * @param {number} maxRequests
 * @param {number} windowSeconds
 * @returns {Promise<{ allowed: boolean, remaining: number, resetIn: number }>}
 */
export async function checkRateLimit(identifier, maxRequests = 20, windowSeconds = 60) {
  const key = `ratelimit:${identifier}`;

  try {
    const { count, ttl } = await cache.incrWithExpire(key, windowSeconds);

    if (count > maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetIn: ttl
      };
    }

    return {
      allowed: true,
      remaining: Math.max(0, maxRequests - count),
      resetIn: ttl
    };
  } catch (error) {
    // Graceful degraded mode
    return { allowed: true, remaining: 1, resetIn: windowSeconds };
  }
}

/**
 * Extract client IP address from Next.js Request
 * @param {Request} request
 * @returns {string}
 */
export function getClientIp(request) {
  if (!request) return '127.0.0.1';
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return request.headers.get('x-real-ip') || '127.0.0.1';
}
