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

const app = express();
const PORT = process.env.PORT || 3004;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(requestLogger);
