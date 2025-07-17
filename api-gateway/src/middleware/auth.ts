import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";
import jwt, { JwtPayload } from "jsonwebtoken";
import { DecodeUser } from "../types/express";

export const validateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader?.split(" ")[1];
  if (!token) {
    logger.warn(`Access attempt without valid token`);
    return res.status(401).json({
      success: false,
      message: "Authentication required, Login to continue",
    });
  }
  jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
    if (err) {
      logger.warn("Invalid Token");
      return res.status(403).json({
        success: false,
        message: "Authentication required, Login to continue",
      });
    }
    req.user = user as DecodeUser;
    next();
  });
};
