import express, { Router } from "express";
import {
  loginUserController,
  logoutController,
  refreshTokenController,
  registerUserController,
} from "../controllers/identity.controller";

const identityRouter: Router = express.Router();

identityRouter.post("/register", registerUserController);

identityRouter.post("/login", loginUserController);

identityRouter.post("/refreshToken", refreshTokenController);

identityRouter.post("/logout", logoutController);

export default identityRouter;
