import express from "express";
import { authenticateRequest } from "../middleware/auth";
import {
  getAllMediaController,
  uploadMediaController,
} from "../controllers/media.controller";
import { handleUpload } from "../middleware/upload";

const router = express.Router();

router.post(
  "/upload",
  authenticateRequest,
  handleUpload,
  uploadMediaController
);

router.get("/", authenticateRequest, getAllMediaController);

export default router;
