import express from "express";
import { authenticateRequest } from "../middleware/auth";
import {
  createPostController,
  getAllPostsController,
} from "../controllers/post.controller";

const router = express.Router();

router.use(authenticateRequest);

router.post("/create-post", createPostController);

router.get("/", getAllPostsController);

export default router;
