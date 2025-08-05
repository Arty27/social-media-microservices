import { Media } from "../models/media.model";
import { deleteMediaFromCloudinary } from "../utils/cloudinary";
import { logger } from "../utils/logger";

export interface PostDeletedEvent {
  mediaIds: string[];
  postId: string;
}

export const handlePostDeleted = async (event: PostDeletedEvent) => {
  console.log(event, "EVEVEVE");
  const { postId, mediaIds } = event;
  try {
    const mediaToDelete = await Media.find({ _id: { $in: mediaIds } });
    for (const media of mediaToDelete) {
      await deleteMediaFromCloudinary(media.publicId);
      await Media.findByIdAndDelete(media._id);
      logger.info(
        `Deleted Media ${media._id} associated with deleted post ${postId}`
      );
    }
    logger.info(`Deletion process for post with id ${postId} complete`);
  } catch (error) {
    logger.error("Error occured while media deletion", error);
  }
};
