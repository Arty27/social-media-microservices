import express from "express";
import { authenticateRequest } from "../middleware/auth";
import {
  createPostController,
  getAllPosts,
} from "../controllers/post.controller";

const router = express.Router();

router.use(authenticateRequest);

router.post("/create-post", createPostController);

router.post("/get-all-posts", getAllPosts);

export default router;
