import mongoose, { Document, Model, Schema } from "mongoose";

export interface IComment {
  user: mongoose.Types.ObjectId;
  text: string;
  createdAt?: Date;
}

export interface IPost {
  user: mongoose.Types.ObjectId;
  content: string;
  mediaIds: string[];
  comments: IComment[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IPostDocument extends IPost, Document {}

const postSchema = new Schema<IPostDocument>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    mediaIds: [{ type: String }],
  },
  { timestamps: true }
);

postSchema.index({ content: "text" });

export const Post: Model<IPostDocument> = mongoose.model("Post", postSchema);
