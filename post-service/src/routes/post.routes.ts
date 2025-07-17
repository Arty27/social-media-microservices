import express from "express";
import { authenticateRequest } from "../middleware/auth";
import { createPostController } from "../controllers/post.controller";

const router = express.Router();

router.use(authenticateRequest);

router.post("/create-post", createPostController);

export default router;
