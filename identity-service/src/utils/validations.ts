import Joi from "joi";

export interface RegistrationInput {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export const validateRegistration = (
  data: RegistrationInput
): Joi.ValidationResult<RegistrationInput> => {
  const schema = Joi.object<RegistrationInput>({
    username: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    firstName: Joi.string().min(3).required(),
    lastName: Joi.string().required(),
  });
  return schema.validate(data, { abortEarly: false });
};

export interface LoginInput {
  email: string;
  password: string;
}

export const validateLogin = (
  data: LoginInput
): Joi.ValidationResult<LoginInput> => {
  const schema = Joi.object<LoginInput>({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  return schema.validate(data, { abortEarly: false });
};
