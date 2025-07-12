import express, { Router } from "express";
import { registerUserController } from "../controllers/identity.controller";

const identityRouter: Router = express.Router();

identityRouter.post("/register", registerUserController);

export default identityRouter;
