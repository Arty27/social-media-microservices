import mongoose, { Document, Model, Schema } from "mongoose";

export interface IMedia {
  publicId: string;
  originalName: string;
  mimeType: string;
  url: string;
  userId: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IMediaDocument extends Document, IMedia {}

const mediaSchema = new Schema<IMediaDocument>(
  {
    publicId: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    userId: {
      ref: "User",
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

export const Media: Model<IMediaDocument> = mongoose.model<IMediaDocument>(
  "Media",
  mediaSchema
);
