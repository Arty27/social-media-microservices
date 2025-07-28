import cloudinary, { UploadApiResponse } from "cloudinary";
import { logger } from "./logger";
import { Multer } from "multer";

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

export const uploadMediaToCloudinary = (
  file: Express.Multer.File
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      {
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          logger.error("Error while uploading media to cloudinary", error);
          reject(error);
        } else if (result) {
          resolve(result);
        } else {
          reject(new Error("Unkown error during upload"));
        }
      }
    );
    uploadStream.end(file.buffer);
  });
};

export const deleteMediaFromCloudinary = async (publicId: string) => {
  try {
    const result = await cloudinary.v2.uploader.destroy(publicId);
    logger.info(`Media deleted successfully from cloud storage`, { publicId });
    return result;
  } catch (error) {
    logger.error(`Error while deleting media from cloudinary`, error);
    throw error;
  }
};
