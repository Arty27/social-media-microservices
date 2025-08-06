import { Search } from "../models/search.model";
import { logger } from "../utils/logger";

export interface SearchPost {
  postId: string;
  userId: string;
  content: string;
  createdAt: Date;
}

export interface PostDeletedEvent {
  mediaIds: string[];
  postId: string;
  userId: string;
}

export const handlePostCreated = async (event: SearchPost) => {
  try {
    const { postId, userId, content, createdAt } = event;
    const newSearch = new Search({
      postId,
      userId,
      content,
      createdAt,
    });
    await newSearch.save();
    logger.info(
      `New Search Post created for post ${postId} with searchId ${newSearch._id}`
    );
  } catch (error) {
    logger.error("Error handling Search creation", error);
  }
};

export const handlePostDeleted = async (event: PostDeletedEvent) => {
  try {
    const { postId } = event;
    await Search.findOneAndDelete({ postId });
    logger.info(`Search Post deleted`, { postId });
  } catch (error) {
    logger.error("Search Service: Error while deleting Search", error);
  }
};
