import { IUserDocument, User } from "../models/user.model";
import generateToken from "../utils/generate-token";
import { logger } from "../utils/logger";
import argon2 from "argon2";
import { LoginInput, RegistrationInput } from "../utils/validations";
import mongoose from "mongoose";

export const registerService = async (userData: RegistrationInput) => {
  const { email, username, firstName, lastName, password } = userData;
  let user: IUserDocument | null = await User.findOne({
    $or: [{ email }, { userData }],
  });

  if (user) {
    logger.info("User already exists", { username, email });
    throw new Error("User already exists!");
  }

  user = new User({ email, password, username, firstName, lastName });
  await user.save();
  logger.info("User registered successfully!", { userId: user._id });

  const { refreshToken, accessToken } = await generateToken(user);
  logger.debug("Tokens generated for user", { userId: user._id });
  return { accessToken, refreshToken };
};

export const loginService = async (
  userData: LoginInput
): Promise<{
  accessToken: string;
  refreshToken: string;
  userId: string;
}> => {
  const { email, password } = userData;
  const existingUser: IUserDocument | null = await User.findOne({ email });
  if (!existingUser) {
    logger.error(`No user found with email`, { email });
    throw new Error("No User found!");
  }
  const comparePassword = await existingUser.comparePassword(password);
  if (!comparePassword) {
    logger.warn(`Wrong Password for the user:`, { email });
    throw new Error("Invalid Credentials!");
  }
  const { refreshToken, accessToken } = await generateToken(existingUser);
  logger.debug("Tokens generated for user while logging in ", {
    userId: existingUser._id,
  });
  return {
    accessToken,
    refreshToken,
    userId: existingUser._id as string,
  };
};
