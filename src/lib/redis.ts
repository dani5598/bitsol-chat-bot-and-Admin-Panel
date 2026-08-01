import Redis from "ioredis";
import { config } from "./config";

/**
 * Optional Redis client (rate-limiting, caching, session helpers).
 * Returns `null` when REDIS_URL is not configured so the app still runs
 * without Redis in local development.
 */
const globalForRedis = globalThis as unknown as { redis: Redis | null | undefined };

function createClient(): Redis | null {
  if (!config.redisUrl) return null;
  const client = new Redis(config.redisUrl, {
    lazyConnect: true,
    maxRetriesPerRequest: 2,
  });
  client.on("error", (err) => console.error("[redis] connection error:", err.message));
  return client;
}

export const redis = globalForRedis.redis ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForRedis.redis = redis;
}

/**
 * Fixed-window rate limiter. No-ops (always allows) when Redis is unavailable
 * so local development is frictionless. Returns whether the action is allowed.
 */
export async function rateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<{ allowed: boolean; remaining: number }> {
  if (!redis) return { allowed: true, remaining: limit };
  try {
    if (redis.status === "wait") await redis.connect();
    const bucket = `ratelimit:${key}`;
    const count = await redis.incr(bucket);
    if (count === 1) await redis.expire(bucket, windowSeconds);
    return { allowed: count <= limit, remaining: Math.max(0, limit - count) };
  } catch {
    // Fail open — availability over strictness for a public helpline.
    return { allowed: true, remaining: limit };
  }
}
