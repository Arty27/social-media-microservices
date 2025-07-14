import { NextFunction, Request, Response } from "express";
import rateLimit from "express-rate-limit";
import RedisStore, { RedisReply } from "rate-limit-redis";
import { redisClient } from "../config/redis";
import { logger } from "../utils/logger";

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
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
