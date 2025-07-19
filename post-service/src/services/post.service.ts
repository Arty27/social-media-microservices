import Redis from "ioredis";
import { IPost, IPostDocument, Post } from "../models/Post";
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

export const getAllPostsService = async (
  redisClient: Redis,
  page: number,
  limit: number
): Promise<{
  posts: IPostDocument[];
  currentPage: number;
  totalPages: number;
  totalPosts: number;
}> => {
  const startIndex = (page - 1) * limit;
  const cachedKey = `posts:${page}:${limit}`;
  const cachedPosts = await redisClient.get(cachedKey);
  if (cachedPosts) {
    logger.info("Returning all posts from cache", { page, limit });
    return JSON.parse(cachedPosts);
  }
  const posts = await Post.find({})
    .sort({ createdAt: -1 })
    .skip(startIndex)
    .limit(limit)
    .lean();
  const total = await Post.countDocuments();
  const result = {
    posts,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    totalPosts: total,
  };
  logger.info("Returning results for all posts from Database", { page, limit });
  await redisClient.setex(cachedKey, 300, JSON.stringify(result));
  logger.info(`Cache Set`, { key: cachedKey });
  return result;
};
