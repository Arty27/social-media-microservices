import express from "express";
import { authenticateRequest } from "../middleware/auth";
import { uploadMediaController } from "../controllers/media.controller";
import { handleUpload } from "../middleware/upload";

const router = express.Router();

router.post(
  "/upload",
  authenticateRequest,
  handleUpload,
  uploadMediaController
);

export default router;
