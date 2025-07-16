import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.divider();
  logger.info("Incoming request", {
    method: req.method,
    url: req.url,
    body: typeof req.body === "object" ? req.body : {},
  });
  next();
};
