import { getRedisClient, isRedisConnected } from "./redisClient.js";

export const getCache = async (key) => {
  try {
    const redisClient = getRedisClient();
    if (!redisClient || !isRedisConnected()) {
      return null;
    }
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.warn(`Cache get error for key ${key}:`, error.message);
    return null;
  }
};

export const setCache = async (key, value, ttl = 300) => {
  try {
    const redisClient = getRedisClient();
    const isConnected = isRedisConnected();

    console.log(
      `[setCache] Key: ${key}, Redis client exists: ${!!redisClient}, Is connected: ${isConnected}`
    );

    if (!redisClient || !isConnected) {
      console.warn(
        `Cache set skipped for key ${key}: Redis not connected (client: ${!!redisClient}, connected: ${isConnected})`
      );
      return;
    }

    const valueStr = JSON.stringify(value);
    console.log(
      `[setCache] Setting key ${key} with value length: ${valueStr.length} chars`
    );

    await redisClient.setEx(key, ttl, valueStr);
    console.log(
      `[setCache]  Cache set successfully for key: ${key} (TTL: ${ttl}s)`
    );

    // Verify it was set
    const verify = await redisClient.get(key);
    console.log(`[setCache] Verification: key exists in Redis: ${!!verify}`);
  } catch (error) {
    console.error(`[setCache]  Cache set error for key ${key}:`, error.message);
    console.error(`[setCache] Error stack:`, error.stack);
  }
};

export const deleteCache = async (key) => {
  try {
    const redisClient = getRedisClient();
    if (!redisClient || !isRedisConnected()) {
      return;
    }
    await redisClient.del(key);
  } catch (error) {
    console.warn(`Cache delete error for key ${key}:`, error.message);
  }
};
