import dotenv from "dotenv";
dotenv.config();

import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import postRoutes from "./routes/post.routes";
import { logger } from "./utils/logger";
import { errorHandler } from "./middleware/error-handler";
import { connectToDb } from "./config/db";
import { requestLogger } from "./middleware/request-logger";
import { redisClient } from "./config/redis";
import { attachRedisClient } from "./middleware/attach-redis-client";

const app = express();
const PORT = process.env.PORT || 3002;

connectToDb();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(requestLogger);

app.use("./api/posts/", attachRedisClient, postRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Post service running on port ${PORT}`);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error(`Unhandled rejection at ${promise}, Reason: ${reason}`);
});
