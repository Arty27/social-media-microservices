import { Post } from "../models/Post";
import { createPostService, ICreatePostInput } from "../services/post.service";
import { logger } from "../utils/logger";
import { Request, Response } from "express";

export const createPostController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info(`Create Post Endpoint Hit`);
    const postData: ICreatePostInput = {
      ...req.body,
    };
    await createPostService(postData);
  } catch (error) {
    logger.error("Error while creating post", error);
    res.status(500).json({
      success: false,
      message: "Error while creating a post",
    });
  }
};

const getAllPosts = async (req: Request, res: Response): Promise<void> => {
  try {
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
