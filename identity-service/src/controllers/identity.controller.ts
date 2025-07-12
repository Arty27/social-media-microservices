import { Request, Response } from "express";
import { validateRegistration } from "../utils/validations";
import { logger } from "../utils/logger";
import { registerService } from "../services/identity.service";

// User Registration
export const registerUserController = async (req: Request, res: Response) => {
  try {
    logger.info("Register User");
    const { error } = validateRegistration(req.body);

    if (error) {
      const errors: string[] = error.details.map((e) => e.message);
      logger.warn("Validation Failed during Registration", errors);
      return res.status(400).json({
        success: false,
        message: "Validation Failed",
        errors,
      });
    }

    const { accessToken, refreshToken } = await registerService(req.body);

    res.status(201).json({
      success: true,
      message: "User Registered Successfully!",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    logger.error("Registration error occured", { error });
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
// User login

// Refresh Token

// Logout
