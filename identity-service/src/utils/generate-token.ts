import jwt from "jsonwebtoken";
import crypto from "crypto";
import { IUserDocument } from "../models/user.model";
import { RefreshToken } from "../models/refresh-token.model";

const generateToken = async (
  user: IUserDocument
): Promise<{ accessToken: string; refreshToken: string }> => {
  const accessToken = jwt.sign(
    {
      userId: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET!,
    { expiresIn: "60m" }
  );

  const refreshToken = crypto.randomBytes(40).toString("hex");
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  await RefreshToken.create({
    user: user._id,
    token: refreshToken,
    expiresAt,
  });

  return { accessToken, refreshToken };
};

export default generateToken;
