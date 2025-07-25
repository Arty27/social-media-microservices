import { NextFunction, Request, Response } from "express";
import multer, { memoryStorage } from "multer";
import { logger } from "../utils/logger";

const upload = multer({
  storage: memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
}).single("file");

export const handleUpload = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  upload(req, res, (err) => {
    if (err) {
      logger.error("Multer error while uploading", err);
      return res.status(400).json({
        success: false,
        message: err.message,
        stack: err.stack,
      });
    }
    next();
  });
};
