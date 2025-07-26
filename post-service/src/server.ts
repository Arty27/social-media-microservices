import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import postRoutes from "./routes/post.routes";
import { logger } from "./utils/logger";
import { errorHandler } from "./middleware/error-handler";
import { connectToDb } from "./config/db";
import { requestLogger } from "./middleware/request-logger";
import { attachRedisClient } from "./middleware/attach-redis-client";
import connectToRabbitMQ from "./utils/rabbitmq";

const app = express();
const PORT = process.env.PORT || 3002;

// connect to DB
connectToDb();

// Middlewares and rate limiters
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(requestLogger);

// Routes
app.use("/api/posts/", attachRedisClient, postRoutes);

// Global Error Handler
app.use(errorHandler);

async function startServer() {
  try {
    await connectToRabbitMQ();
    app.listen(PORT, () => {
      logger.info(`Post service running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Failed to connect to server", error);
    process.exit(1);
  }
}

startServer();

process.on("unhandledRejection", (reason, promise) => {
  logger.error(`Unhandled rejection at ${promise}, Reason: ${reason}`);
});
