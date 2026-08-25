import Redis from 'ioredis';
import { ENV } from '../config/env.js';

let redis = null;
const memoryStore = new Map();

if (ENV.REDIS.URL) {
  try {
    redis = new Redis(ENV.REDIS.URL, {
      maxRetriesPerRequest: 2,
      enableOfflineQueue: false,
      connectTimeout: 3000,
      lazyConnect: true
    });

    redis.connect().catch((err) => {
      console.warn('⚠️ [REDIS] Initial connection warning, using memory fallback:', err.message);
    });

    redis.on('error', (err) => {
      console.warn('⚠️ [REDIS] Client error:', err.message);
    });
  } catch (e) {
    redis = null;
  }
}

export const cache = {
  /**
   * Get cached value
   */
  async get(key) {
    if (redis && redis.status === 'ready') {
      try {
        const val = await redis.get(key);
        return val ? JSON.parse(val) : null;
      } catch (e) {}
    }
    const item = memoryStore.get(key);
    if (!item) return null;
    if (item.expires && Date.now() > item.expires) {
      memoryStore.delete(key);
      return null;
    }
    return item.value;
  },

  /**
   * Set cached value with TTL
   */
  async set(key, value, ttlSeconds = 300) {
    if (redis && redis.status === 'ready') {
      try {
        await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
        return true;
      } catch (e) {}
    }
    memoryStore.set(key, {
      value,
      expires: ttlSeconds ? Date.now() + ttlSeconds * 1000 : null
    });
    return true;
  },

  /**
   * Delete cached key
   */
  async del(key) {
    if (redis && redis.status === 'ready') {
      try {
        await redis.del(key);
      } catch (e) {}
    }
    memoryStore.delete(key);
    return true;
  },

  /**
   * Atomic increment with expiration for rate limiting
   */
  async incrWithExpire(key, ttlSeconds = 60) {
    if (redis && redis.status === 'ready') {
      try {
        const pipeline = redis.pipeline();
        pipeline.incr(key);
        pipeline.expire(key, ttlSeconds);
        const results = await pipeline.exec();
        const currentCount = results[0][1];
        return { count: currentCount, ttl: ttlSeconds };
      } catch (e) {}
    }

    // In-memory fallback
    const now = Date.now();
    const existing = memoryStore.get(key);

    if (!existing || now > existing.expires) {
      memoryStore.set(key, {
        value: 1,
        expires: now + ttlSeconds * 1000
      });
      return { count: 1, ttl: ttlSeconds };
    }

    existing.value += 1;
    const remainingTtl = Math.max(1, Math.ceil((existing.expires - now) / 1000));
    return { count: existing.value, ttl: remainingTtl };
  }
};

export default cache;
