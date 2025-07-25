import { Request, Response } from "express";
import { logger } from "../utils/logger";
import { uploadMediaToCloudinary } from "../utils/cloudinary";
import { Media } from "../models/media.model";
import multer from "multer";
import { mediaUploadService } from "../services/media.service";

export const uploadMediaController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info("Upload media endpoint hit");
    if (!req.file) {
      logger.warn(`No file found in the request object`);
      res.status(400).json({
        success: false,
        message: "No File uploaded, Please upload a file to continue",
      });
      return;
    }
    const userId = req.user?.userId;
    if (!userId) {
      logger.warn(`UserId missing from request, Internal proxy error`);
      res.status(500).json({
        success: false,
        message: "Internal Proxy Error",
      });
      return;
    }
    const { originalname, mimetype } = req.file;

    const mediaId = await mediaUploadService(
      req.file,
      originalname,
      mimetype,
      userId
    );
    res.status(200).json({
      success: true,
      mediaId,
      message: "Media upload to successful!",
    });
  } catch (error) {
    logger.error("Error while uploading media", error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};
