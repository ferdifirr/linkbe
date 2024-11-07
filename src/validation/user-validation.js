import Joi from "joi";

const registerUserValidation = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  name: Joi.string().min(3).max(30).required(),
  phone_number: Joi.string().min(10).max(15).required(),
  password: Joi.string().min(6).max(30).required(),
});

const loginUserValidation = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(6).max(30).required(),
});

export { registerUserValidation, loginUserValidation };
