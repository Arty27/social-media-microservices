import Redis from "ioredis";

const redisUri = process.env.REDIS_URI;
if (!redisUri) {
  throw new Error("Redis URI missing from .env file!");
}
export const redisClient = new Redis(redisUri);
