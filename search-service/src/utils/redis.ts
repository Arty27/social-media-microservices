import { Request } from "express";
import { logger } from "./logger";
import Redis from "ioredis";

export const checkForRedis = (req: Request): Redis => {
  if (!req.redisClient) {
    logger.error(`RedisClient missing on request ${req.url}`);
    throw new Error(`Internal Server Error: Redis not available on request`);
  }
  return req.redisClient;
};
