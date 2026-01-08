import { createClient } from "redis";

let redisClient = null;

export const initRedis = async () => {
  if (redisClient?.isReady) {
    return redisClient;
  }

  const REDIS_HOST = process.env.REDIS_HOST || "127.0.0.1";
  const REDIS_PORT = Number(process.env.REDIS_PORT) || 6379;
  const REDIS_DB = Number(process.env.REDIS_DB) || 0;

  redisClient = createClient({
    socket: {
      host: REDIS_HOST,
      port: REDIS_PORT,
      reconnectStrategy: (retries) => {
        if (retries > 10) {
          console.error("[Redis] Too many reconnect attempts. Giving up.");
          return new Error("Redis reconnect failed");
        }
        return Math.min(retries * 100, 2000);
      },
    },
    database: REDIS_DB,
  });

  redisClient.on("connect", () => {
    console.log("[Redis] Socket connected");
  });

  redisClient.on("ready", () => {
    console.log("[Redis] Client ready");
  });

  redisClient.on("reconnecting", () => {
    console.warn("[Redis] Reconnecting...");
  });

  redisClient.on("error", (err) => {
    console.error("[Redis] Client error:", err.message);
  });

  try {
    await redisClient.connect();

    const ping = await redisClient.ping();
    console.log(`[Redis] PING → ${ping}`);

    const info = await redisClient.info("server");
    const runId = info.match(/run_id:(.*)/)?.[1];

    console.log(`[Redis] Connected successfully (run_id=${runId})`);

    return redisClient;
  } catch (err) {
    console.error("[Redis] Failed to connect:", err.message);
    redisClient = null;
    throw err;
  }
};

export const getRedisClient = () => {
  if (!redisClient || !redisClient.isReady) {
    return null;
  }
  return redisClient;
};

export const isRedisConnected = () => {
  return !!redisClient?.isReady;
};

export const closeRedis = async () => {
  if (!redisClient) return;

  try {
    await redisClient.quit();
    console.log("[Redis] Connection closed");
  } catch (err) {
    console.warn("[Redis] Error during shutdown:", err.message);
  } finally {
    redisClient = null;
  }
};
