import Joi from "joi";

const createProductValidation = Joi.object({
  vendor_id: Joi.number().required(),
  product_name: Joi.string().min(3).max(255).required(),
  product_description: Joi.string().min(3).required(),
  product_image_path: Joi.string().required(),
  product_price: Joi.number().required(),
  stock: Joi.number().required(),
  stock_unit: Joi.string().required(),
  stock_description: Joi.string().required(),
  category_id: Joi.number().required(),
});

export { createProductValidation };
