import express from "express";
import { authenticateRequest } from "../middleware/auth";
import { uploadMediaController } from "../controllers/media.controller";
import multer from "multer";
import { logger } from "../utils/logger";

const router = express.Router();

// configure multer for request

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
}).single("file");

router.post(
  "/upload",
  authenticateRequest,
  (req, res, next) => {
    upload(req, res, function (err) {
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
  },
  uploadMediaController
);

export default router;
