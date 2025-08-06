import Redis from "ioredis";
import mongoose from "mongoose";
import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: mongoose.Types.ObjectId | string;
      };
      redisClient?: Redis;
    }
  }
}
