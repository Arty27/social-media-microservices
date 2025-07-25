import { Request, Response } from "express";
import { logger } from "../utils/logger";
import { uploadMediaToCloudinary } from "../utils/cloudinary";
import { Media } from "../models/media.model";
import multer from "multer";

export const uploadMediaController = async (req: Request, res: Response) => {
  try {
    logger.info("Upload media endpoint hit");
    console.log(req.file);
    if (!req.file) {
      logger.warn(`No file found in the request object`);
      res.status(404).json({
        success: false,
        message: "No File uploaded, Please upload a file to continue",
      });
      return;
    }
    const { originalname, buffer, mimetype } = req.file;
    const userId = req.user?.userId;
    logger.info(`File Details: name=${originalname}, type=${mimetype} from `, {
      userId,
    });
    logger.info(`Initiating Upload to cloudinary`);
    const { public_id, secure_url, url } = await uploadMediaToCloudinary(
      req.file
    );
    logger.info(`Uploaded to Cloudinary Successfully!`, {
      publicId: public_id,
    });
    const newMedia = new Media({
      url,
      publicId: public_id,
      userId,
      originalName: originalname,
      mimeType: mimetype,
    });
    await newMedia.save();
    res.status(200).json({
      success: true,
      mediaId: newMedia._id,
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
