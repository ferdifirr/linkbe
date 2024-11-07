import { prismaClient } from "../app/database.js";
import { createProductValidation } from "../validation/product-validation.js";
import { validate } from "../validation/validation.js";

const getMainCategories = async () => {
  return await prismaClient.categories.findMany({
    where: {
      parentId: null,
    },
  });
};

const getSubCategories = async (categoryId) => {
  categoryId = parseInt(categoryId);
  return await prismaClient.categories.findMany({
    where: {
      parentId: categoryId,
    },
  });
};

const createProduct = async (product) => {
  product = validate(createProductValidation, product);
  return await prismaClient.products.create({
    data: product,
  });
};

const deleteProduct = async (productId) => {
  return await prismaClient.products.delete({
    where: {
      id: parseInt(productId),
    },
  });
};

const getProducts = async () => {
  return await prismaClient.products.findMany();
};

const getVendorProducts = async (vendorId) => {
  return await prismaClient.products.findMany({
    where: {
      vendor_id: parseInt(vendorId),
    },
  });
};

export default {
  getMainCategories,
  getSubCategories,
  createProduct,
  deleteProduct,
  getProducts,
  getVendorProducts,
};
