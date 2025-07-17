import mongoose from "mongoose";
import { Request } from "express";
import Redis from "ioredis";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string | mongoose.Types.ObjectId;
      };
      redisClient?: Redis;
    }
  }
}
