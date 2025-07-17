import { NextFunction, Request, Response } from "express";
import { redisClient } from "../config/redis";

export const attachRedisClient = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.redisClient = redisClient;
  next();
};
