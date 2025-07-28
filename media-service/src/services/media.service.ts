import mongoose from "mongoose";
import { IMediaDocument, Media } from "../models/media.model";
import { uploadMediaToCloudinary } from "../utils/cloudinary";
import { logger } from "../utils/logger";

export const mediaUploadService = async (
  file: Express.Multer.File,
  originalName: string,
  mimeType: string,
  userId: string | mongoose.Types.ObjectId
): Promise<mongoose.Types.ObjectId> => {
  logger.info(`File details name=${originalName} and type= ${mimeType}`);
  logger.info("Initiating upload to Cloudinary...");

  const { public_id, url } = await uploadMediaToCloudinary(file);
  if (!public_id || !url) {
    logger.error(`Failed to upload to cloudinary`);
    throw new Error(`Upload to Cloudinary failed`);
  }
  logger.info(`Uploaded to Cloudinary Successfully!`, {
    publicId: public_id,
  });

  const newMedia: IMediaDocument = new Media({
    publicId: public_id,
    url,
    userId,
    mimeType,
    originalName,
  });
  await newMedia.save();
  if (!newMedia) {
    logger.error(`Failed to update database with cloudinary details`);
    throw new Error(`Error while inserting media record to database`);
  }
  logger.info(`Media details saved to database`, { mediaId: newMedia._id });
  return newMedia._id as mongoose.Types.ObjectId;
};

export const getAllMediaService = async (): Promise<IMediaDocument[]> => {
  const result = await Media.find({}).sort({ createdAt: -1 });
  if (!result) {
    logger.error(`No media found in database`);
    throw new Error(`Failed to fetch media documents from database`);
  }
  return result;
};
