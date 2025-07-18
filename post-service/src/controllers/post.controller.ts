import { Post } from "../models/Post";
import { createPostService, ICreatePostInput } from "../services/post.service";
import { logger } from "../utils/logger";
import { Request, Response } from "express";
import { createPostValidation } from "../utils/validations";

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
    const postData: ICreatePostInput = {
      user: req.user,
      ...req.body,
    };
    await createPostService(postData);
    res.status(201).json({
      success: true,
      message: "Post created Successfully",
    });
  } catch (error) {
    logger.error("Error while creating post", error);
    res.status(500).json({
      success: false,
      message: "Error while creating a post",
    });
  }
};

export const getAllPosts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const cacheKey = `posts:${page}:${limit}`;
    const cachedPosts = await req.redisClient?.get(cacheKey);
    if (cachedPosts) {
      res.json(JSON.parse(cachedPosts));
      return;
    }
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);
    const total = await Post.countDocuments();
    const result = {
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
    };
    await req.redisClient?.setex(cacheKey, 300, JSON.stringify(result));
    res.json(result);
  } catch (error) {
    logger.error("Error while fetching all posts", error);
    res.status(500).json({
      success: false,
      message: "Error while fetching all posts",
    });
  }
};

const getPost = async (req: Request, res: Response): Promise<void> => {
  try {
  } catch (error) {
    logger.error("Error while fetching the post", error);
    res.status(500).json({
      success: false,
      message: "Error while fetching the post",
    });
  }
};

const deletePost = async (req: Request, res: Response): Promise<void> => {
  try {
  } catch (error) {
    logger.error("Error while deleting a post", error);
    res.status(500).json({
      success: false,
      message: "Error while deleting a post",
    });
  }
};
