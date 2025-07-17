import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import express from "express";
import helmet from "helmet";
import { requestLogger } from "./middleware/request-logger";
import { logger } from "./utils/logger";
import { errorHandler } from "./middleware/error-handler";
import { indentityServiceProxy, postServiceProxy } from "./middleware/proxy";
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

app.use("/v1/posts", validateToken, postServiceProxy());

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`API Gateway is running on Port: ${PORT}`);
  logger.info(
    `Identity Service is running on: ${process.env.INDENTITY_SERVICE_URI}`
  );
  logger.info(`Post Service is running on: ${process.env.POST_SERVICE_URI}`);
});
