import Redis from "ioredis";
import { IPost, IPostDocument, Post } from "../models/Post";
import { logger } from "../utils/logger";
import { Request } from "express";
import { publishEvent } from "../utils/rabbitmq";

export interface ICreatePostInput {
  content: string;
  mediaIds: string[];
  user: {
    userId?: string;
  };
}

async function invalidatePostCache(redisClient: Redis, input: IPostDocument) {
  const keys = (await redisClient?.keys("posts:*")) || [];
  if (keys.length > 0) {
    await redisClient?.del(keys);
  }
}

export const createPostService = async (
  postData: ICreatePostInput,
  redisClient: Redis
) => {
  const { content, mediaIds, user } = postData;

  const newPost = new Post({
    user: user.userId,
    content,
    mediaIds: mediaIds || [],
  });

  await newPost.save();
  await invalidatePostCache(redisClient, newPost);
  return newPost._id;
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

export const getPostByIdService = async (id: string, redisClient: Redis) => {
  const cacheKey = `post:${id}`;
  const cachedPost = await redisClient.get(cacheKey);
  if (cachedPost) {
    logger.info(`Fetching post from cache`, { id });
    return JSON.parse(cachedPost);
  }
  const post = await Post.findById(id);
  if (!post) {
    logger.error(`No post found for the id`, { id });
    throw new Error("Post not found!");
  }
  logger.info(`Returning post from Database`, { post: post });
  logger.info(`Cache set`, { key: cacheKey });
  await redisClient.setex(cacheKey, 600, JSON.stringify(post));
  return post;
};

export const deletePostService = async (
  id: string,
  redisClient: Redis,
  userId: string
): Promise<void> => {
  logger.info(`Deleting Post from database`, { id });
  const deletedPost = await Post.findByIdAndDelete(id);
  if (!deletedPost) {
    logger.error(`No Post found to delete`, { id });
    throw new Error(`No Post found`);
  }
  await publishEvent(`post_deleted`, {
    postId: id,
    userId,
    mediaIds: deletedPost.mediaIds,
  });
  const cacheKey = `post:${id}`;
  logger.info(`Deleting post from cache`);
  await redisClient.del(cacheKey);
  await invalidatePostCache(redisClient, deletedPost);
};
