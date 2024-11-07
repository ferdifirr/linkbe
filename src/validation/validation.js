import { ResponseError } from "../error/response-error.js";
import Joi from "joi";

const validate = (schema, request) => {
  const result = schema.validate(request, {
    abortEarly: false,
    allowUnknown: false,
  });
  if (result.error) {
    throw new ResponseError(400, result.error.message);
  } else {
    return result.value;
  }
};

const validateImageFile = (file) => {
  const schema = Joi.object({
    mimetype: Joi.string()
      .valid("image/jpeg", "image/png", "image/jpg", "application/octet-stream")
      .required(),
    size: Joi.number()
      .max(2 * 1024 * 1024)
      .required(),
  }).unknown(true);
  return schema.validate(file);
};

export { validate, validateImageFile };
