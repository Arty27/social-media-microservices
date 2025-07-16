import express, { Router } from "express";
import {
  loginUserController,
  refreshTokenController,
  registerUserController,
} from "../controllers/identity.controller";

const identityRouter: Router = express.Router();

identityRouter.post("/register", registerUserController);

identityRouter.post("/login", loginUserController);

identityRouter.post("/refreshToken", refreshTokenController);

export default identityRouter;
