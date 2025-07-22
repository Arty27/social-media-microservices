import express from "express";
import { authenticateRequest } from "../middleware/auth";
import {
  createPostController,
  deletePostController,
  getAllPostsController,
  getPostByIdController,
} from "../controllers/post.controller";

const router = express.Router();

router.use(authenticateRequest);

router.post("/create-post", createPostController);

router.get("/", getAllPostsController);

router.get("/:id", getPostByIdController);

router.delete("/:id", deletePostController);

export default router;
