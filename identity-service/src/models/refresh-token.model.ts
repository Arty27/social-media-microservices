import mongoose, { Document, Model, Mongoose, Schema } from "mongoose";

export interface IRefreshToken {
  token: string;
  user: mongoose.Types.ObjectId;
  expiresAt: Date;
}

export interface IRefreshTokenDocument extends IRefreshToken, Document {}

const refreshTokenSchema = new Schema<IRefreshTokenDocument>(
  {
    token: {
      required: true,
      type: String,
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RefreshToken: Model<IRefreshTokenDocument> =
  mongoose.model<IRefreshTokenDocument>("RefreshToken", refreshTokenSchema);
