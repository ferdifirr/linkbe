import Joi from "joi";

const registerVendorValidation = Joi.object({
  user_id: Joi.number().required(),
  business_name: Joi.string().min(3).max(255).required(),
  description: Joi.string().min(3).required(),
  image_path: Joi.string().required(),
  latitude: Joi.number().optional(),
  longitude: Joi.number().optional(),
});

export { registerVendorValidation };
