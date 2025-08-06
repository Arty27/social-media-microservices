import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import express from "express";
import helmet from "helmet";
import { requestLogger } from "./middleware/request-logger";
import { logger } from "./utils/logger";
import { errorHandler } from "./middleware/error-handler";
import {
  indentityServiceProxy,
  mediaServiceProxy,
  postServiceProxy,
  searchServiceProxy,
} from "./middleware/proxy";
import { rateLimiter } from "./middleware/rate-limiter";
import { validateToken } from "./middleware/auth";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(helmet());
app.use(express.json());

// Rate limiter
app.use(rateLimiter);
app.use(requestLogger);

// Proxy setup for identity service
app.use("/v1/auth/", indentityServiceProxy());

// Proxy setup for Post Service
app.use("/v1/posts", validateToken, postServiceProxy());

// Proxy setup for Media Service
app.use("/v1/media", validateToken, mediaServiceProxy());

// Proxy setup for Media Service
app.use("/v1/search", validateToken, searchServiceProxy());

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`API Gateway is running on Port: ${PORT}`);
  logger.info(
    `Identity Service is running on: ${process.env.INDENTITY_SERVICE_URI}`
  );
  logger.info(`Post Service is running on: ${process.env.POST_SERVICE_URI}`);
  logger.info(`Media Service is running on: ${process.env.MEDIA_SERVICE_URI}`);
  logger.info(
    `Search Service is running on: ${process.env.SEARCH_SERVICE_URI}`
  );
});
