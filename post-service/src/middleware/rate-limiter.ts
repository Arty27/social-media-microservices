import Redis from "ioredis";
import { NextFunction, Request, Response } from "express";
import { RateLimiterRedis } from "rate-limiter-flexible";
import { redisClient } from "../config/redis";
import { logger } from "../utils/logger";
import RedisStore, { RedisReply } from "rate-limit-redis";
import rateLimit from "express-rate-limit";

export const rateLimiter = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const limiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: "middleware",
    points: 10,
    duration: 60,
  });
  const ip = req.ip || "unkown";
  limiter
    .consume(ip)
    .then(() => next())
    .catch(() => {
      logger.warn("Rate limit exceeded for IP", { IP: req.ip });
      res.status(429).json({
        success: false,
        message: "Too many requests! Please try again later",
      });
    });
};

// IP based rate limiting for sensitive endpoints
export const sensitiveEndPointLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (...args: [string, ...string[]]) =>
      redisClient.call(...args) as Promise<RedisReply>,
  }),
  handler: (req: Request, res: Response) => {
    logger.warn("Sensitive endpoint rate limit exceeded for IP", req.ip);
    res.status(429).json({
      success: false,
      message: "Too many requests! Please try again later",
    });
  },
});
