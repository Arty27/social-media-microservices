import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";

export const authenticateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userIdHeader = req.headers["x-user-id"];
  if (typeof userIdHeader !== "string") {
    logger.warn("Access attempted without userIdHeader");
    res.status(401).json({
      success: false,
      message: "Authentication Required, Please login to continue",
    });
    return;
  }
  req.user = { userId: userIdHeader };
  next();
};
