import { IUserDocument, User } from "../models/user.model";
import generateToken from "../utils/generate-token";
import { logger } from "../utils/logger";
import { RegistrationInput } from "../utils/validations";

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
