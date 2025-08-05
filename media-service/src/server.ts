import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { errorHandler } from "./middleware/error-handler";
import { connectToDb } from "./config/db";
import { requestLogger } from "./middleware/request-logger";
import cors from "cors";
import helmet from "helmet";
import { logger } from "./utils/logger";
import mediaRoutes from "./routes/media.routes";
import connectToRabbitMQ, { consumeEvent } from "./utils/rabbitmq";
import { handlePostDeleted } from "./event-handlers/media-event.handler";

const app = express();
const PORT = process.env.PORT || 3003;

connectToDb();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(requestLogger);

app.use("/api/media", mediaRoutes);

app.use(errorHandler);

async function startServer() {
  try {
    await connectToRabbitMQ();
    await consumeEvent("post_deleted", handlePostDeleted);
    app.listen(PORT, () => {
      logger.info(`Media service running on port ${PORT}`);
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
