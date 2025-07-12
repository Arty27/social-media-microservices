import mongoose, { Document, Model, Schema } from "mongoose";
import argon2 from "argon2";

export interface IUser {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface IUserDocument extends IUser, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUserDocument>(
  {
    username: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      required: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      trim: true,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre<IUserDocument>("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();
    this.password = await argon2.hash(this.password);
    next();
  } catch (error) {
    return next(error as Error);
  }
});

userSchema.methods.comparePassword = async function (
  this: IUserDocument,
  candidatePassword: string
): Promise<boolean> {
  try {
    return await argon2.verify(this.password, candidatePassword);
  } catch {
    throw new Error("Password Verification failed!");
  }
};

userSchema.index({ username: 1 }, { unique: true });

export const User: Model<IUserDocument> = mongoose.model("User", userSchema);
