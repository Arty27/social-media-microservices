import { IUserDocument, User } from "../models/user.model";
import generateToken from "../utils/generate-token";
import { logger } from "../utils/logger";
import { LoginInput, RegistrationInput } from "../utils/validations";
import { RefreshToken } from "../models/refresh-token.model";

export interface TokenOutput {
  refreshToken: string;
  accessToken: string;
  userId: string;
}

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

export const refreshTokenService = async (
  refreshToken: string
): Promise<TokenOutput> => {
  const storedToken = await RefreshToken.findOne({ token: refreshToken });
  if (!storedToken || storedToken.expiresAt < new Date()) {
    logger.warn(`Refresh Token expired or invalid !`);
    throw new Error("Refresh Token invalid or expired");
  }
  const user = await User.findById(storedToken.user);
  if (!user) {
    logger.warn(`User not Found !`);
    throw new Error("No User Found for the refresh token!");
  }
  const { refreshToken: newRefreshToken, accessToken } = await generateToken(
    user
  );
  logger.info(`Refresh Token generated successfully for user`, {
    userId: user._id,
  });
  //delete the old refresh token
  await RefreshToken.deleteOne({ _id: storedToken._id });
  logger.info(`Old refresh Tokens deleted from database for user`, {
    userId: user._id,
  });
  return {
    refreshToken: newRefreshToken,
    accessToken,
    userId: user._id as string,
  };
};

export const logoutService = async (refreshToken: string) => {
  const storedToken = await RefreshToken.findOneAndDelete({
    token: refreshToken,
  });
  if (!storedToken) {
    logger.warn(`Refreshtoken not found`, { refreshToken });
    throw new Error(`Invalid or expired Refresh Token`);
  }
  logger.info(`Refresh Token deleted for logout`, { userId: storedToken.user });
};
