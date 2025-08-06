import mongoose from "mongoose";
import { logger } from "../utils/logger";

export const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    logger.info("Connected to Database successfully!");
  } catch (error) {
    logger.error("Failed to connect to database", { error });
    process.exit(1);
  }
};
