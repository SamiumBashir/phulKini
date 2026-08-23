import Redis from 'ioredis';

let redis = null;
const memoryStore = new Map();

if (process.env.REDIS_URL) {
  try {
    redis = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
      connectTimeout: 2000,
    });
    redis.on('error', (err) => {
      console.warn('⚠️ Redis error, utilizing in-memory cache fallback:', err.message);
    });
  } catch (e) {
    redis = null;
  }
}

export const cache = {
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

  async del(key) {
    if (redis && redis.status === 'ready') {
      try {
        await redis.del(key);
      } catch (e) {}
    }
    memoryStore.delete(key);
    return true;
  }
};

export default cache;
