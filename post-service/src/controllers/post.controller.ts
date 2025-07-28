import { Post } from "../models/Post";
import {
  createPostService,
  deletePostService,
  getAllPostsService,
  getPostByIdService,
  ICreatePostInput,
} from "../services/post.service";
import { logger } from "../utils/logger";
import { Request, Response } from "express";
import { createPostValidation } from "../utils/validations";
import { parsePaginationParams } from "../utils/helper";
import { checkForRedis } from "../utils/redis";

// Controller used to create post
export const createPostController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info(`Create Post Endpoint Hit`);

    const { error } = createPostValidation(req.body);
    if (error) {
      const errors: string[] = error.details.map((e) => e.message);
      logger.warn("Validation Failed during Creating Post", errors);
      res.status(400).json({
        success: false,
        message: "Validation Failed",
        errors,
      });
      return;
    }
    const redisClient = checkForRedis(req);
    const postData: ICreatePostInput = {
      user: req.user,
      ...req.body,
    };
    const postId = await createPostService(postData, redisClient);
    res.status(201).json({
      success: true,
      message: "Post created Successfully",
      id: postId,
    });
  } catch (error) {
    logger.error("Error while creating post", error);
    res.status(500).json({
      success: false,
      message: "Error while creating a post",
    });
  }
};

// Controller to get all posts from cache or DB
export const getAllPostsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info("Get All posts endpoint hit");
    const { page, limit } = parsePaginationParams(req);
    const redisClient = checkForRedis(req);
    const result = await getAllPostsService(redisClient, page, limit);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error("Error while fetching all posts", error);
    res.status(500).json({
      success: false,
      message: "Error while fetching all posts",
    });
  }
};

// Get post by ID
export const getPostByIdController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info(`Get Post by ID endpoint Hit`);
    const { id } = req.params;
    if (!id) {
      logger.warn("Post ID missing in request params");
      res.status(400).json({
        success: false,
        message: "Post ID is required",
      });
      return;
    }
    const redisClient = checkForRedis(req);
    const result = await getPostByIdService(id, redisClient);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error("Error while fetching the post", error);
    res.status(500).json({
      success: false,
      message: "Error while fetching the post",
    });
  }
};

export const deletePostController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info(`Delete Post Endpoint hit`);
    const { id } = req.params;
    const userId = req.user?.userId;
    if (!id) {
      logger.warn("Post ID missing in request params");
      res.status(400).json({
        success: false,
        message: "Post ID is required",
      });
      return;
    }
    if (!userId) {
      logger.error("UserId missing in request headers, Proxy Error");
      res.status(500).json({
        success: false,
        message: "Internal Proxy Error",
      });
      return;
    }
    const redisClient = checkForRedis(req);
    await deletePostService(id, redisClient, userId.toString());
    res.status(200).json({
      success: true,
      message: "Post deleted Successfully",
    });
  } catch (error) {
    logger.error("Error while deleting a post", error);

    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Error while deleting a post",
    });
  }
};
