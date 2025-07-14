import express, { Router } from "express";
import {
  loginUserController,
  registerUserController,
} from "../controllers/identity.controller";

const identityRouter: Router = express.Router();

identityRouter.post("/register", registerUserController);

identityRouter.post("/login", loginUserController);

export default identityRouter;
