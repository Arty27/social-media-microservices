import dotenv from "dotenv";
import { connectToDb } from "./config/db";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import { logger } from "./utils/logger";
import identityRouter from "./routes/identity.routes";
import { errorHandler } from "./middleware/error-handler";
import {
  rateLimiter,
  sensitiveEndPointLimiter,
} from "./middleware/rate-limiter";
import { requestLogger } from "./middleware/request-logger";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

// Connect to DB
connectToDb();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(requestLogger);

// DDoS and rate limiter
app.use(rateLimiter);

// apply sensitiveEndPointLimiter to routes
app.use("/api/auth/register", sensitiveEndPointLimiter);

// Routes
app.use("/api/auth", identityRouter);

// Global error handler
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Identity service running on Port ${PORT}`);
});

// Unhandled promise rejection

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at", promise, "reason:", reason);
});
