import { Request, Response } from "express";
import { validateLogin, validateRegistration } from "../utils/validations";
import { logger } from "../utils/logger";
import {
  loginService,
  logoutService,
  refreshTokenService,
  registerService,
} from "../services/identity.service";

// User Registration
export const registerUserController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info("Register User");
    const { error } = validateRegistration(req.body);

    if (error) {
      const errors: string[] = error.details.map((e) => e.message);
      logger.warn("Validation Failed during Registration", errors);
      res.status(400).json({
        success: false,
        message: "Validation Failed",
        errors,
      });
      return;
    }

    const { accessToken, refreshToken } = await registerService(req.body);

    res.status(201).json({
      success: true,
      message: "User Registered Successfully!",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    logger.error("Registration error occured", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    res.status(500).json({
      message,
      success: false,
    });
  }
};

// User login Controller
export const loginUserController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info(`Login User`);
    const { error } = validateLogin(req.body);
    if (error) {
      const errors: string[] = error.details.map((e) => e.message);
      logger.warn("Validation Failed during Login", errors);
      res.status(400).json({
        success: false,
        message: "Validation Failed",
        errors,
      });
      return;
    }
    const { accessToken, refreshToken, userId } = await loginService(req.body);
    res.status(200).json({
      success: true,
      message: "User Login Successful!",
      accessToken,
      refreshToken,
      userId,
    });
  } catch (error) {
    logger.error("Login error occured", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    res.status(500).json({
      message,
      success: false,
    });
  }
};

// Refresh Token
export const refreshTokenController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info("Refresh Token Hit");
    const { refreshToken } = req.body;
    if (!refreshToken) {
      logger.warn(`Refresh Token Missing in request body`);
      res.status(400).json({
        success: false,
        message: "Refresh Token Missing",
      });
      return;
    }

    const tokenData = await refreshTokenService(refreshToken);

    res.status(200).json({
      success: true,
      ...tokenData,
    });
  } catch (error) {
    logger.error("Refresh Token error occured", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    res.status(500).json({
      message,
      success: false,
    });
  }
};

// Logout
export const logoutController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    logger.info(`Logout Endpoint hit`);
    const { refreshToken } = req.body;
    if (!refreshToken) {
      logger.warn(`Refresh Token Missing in request body`);
      res.status(400).json({
        success: false,
        message: "Refresh Token is required",
      });
      return;
    }

    await logoutService(refreshToken);

    res.status(200).json({
      success: true,
      message: "Logged out successfully!",
    });
  } catch (error) {
    logger.error("Error occured while logging out", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    res.status(500).json({
      message,
      success: false,
    });
  }
};
