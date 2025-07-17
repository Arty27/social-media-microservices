import { Post } from "../models/Post";
import { logger } from "../utils/logger";

export interface ICreatePostInput {
  content: string;
  mediaIds: string[];
  user: {
    userId?: string;
  };
}

export const createPostService = async (postData: ICreatePostInput) => {
  const { content, mediaIds, user } = postData;

  const newPost = new Post({
    user: user.userId,
    content,
    mediaIds: mediaIds || [],
  });

  await newPost.save();
  logger.info(`Post Created successfully for user ${postData.user.userId}`);
};
