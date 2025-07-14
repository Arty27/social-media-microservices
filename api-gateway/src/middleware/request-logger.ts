import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info(`${req.method} Request for the endpoint ${req.url}`);
  logger.info(`Request Body = ${req.body}`);
  next();
};
