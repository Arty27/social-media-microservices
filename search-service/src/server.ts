import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import { logger } from "./utils/logger";
import { errorHandler } from "./middleware/error-handler";
import { connectToDb } from "./config/db";
import { requestLogger } from "./middleware/request-logger";
import { attachRedisClient } from "./middleware/attach-redis-client";
import { connectToRabbitMQ, consumeEvent } from "./utils/rabbitmq";
import searchRoutes from "./routes/search.routes";
import { handlePostCreated } from "./event-handlers/search-event.handler";

const app = express();
const PORT = process.env.PORT || 3004;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(requestLogger);

app.use("/api", searchRoutes);

app.use(errorHandler);

async function startServer() {
  try {
    await connectToRabbitMQ();
    await consumeEvent("post_created", handlePostCreated);
    app.listen(PORT, () => {
      logger.info(`Search service running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start Search Service", error);
    process.exit(1);
  }
}

startServer();
