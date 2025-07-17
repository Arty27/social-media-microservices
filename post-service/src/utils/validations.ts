import Joi from "joi";
import { ICreatePostInput } from "../services/post.service";

export const createPostValidation = (data: ICreatePostInput) => {
  const schema = Joi.object<ICreatePostInput>({
    content: Joi.string().min(3).max(5000).required(),
  });
  return schema.validate(data);
};
