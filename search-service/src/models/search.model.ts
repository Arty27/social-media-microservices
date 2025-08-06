import mongoose, { Document, Model, model, Schema } from "mongoose";

export interface ISearch {
  postId: string;
  userId: string;
  content: string;
  createdAt?: Date;
}

export interface ISearchDocument extends Document, ISearch {}

const searchSchema = new Schema<ISearchDocument>(
  {
    postId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

searchSchema.index({ content: "text" });
searchSchema.index({ createdAt: -1 });

export const Search: Model<ISearchDocument> = mongoose.model(
  "Search",
  searchSchema
);
