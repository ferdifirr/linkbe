import productService from "../services/product-service.js";

const getMainCategories = async (req, res, next) => {
  try {
    const categories = await productService.getMainCategories();
    res.json({ data: categories });
  } catch (error) {
    next(error);
  }
};

const getSubCategories = async (req, res, next) => {
  try {
    const categories = await productService.getSubCategories(
      req.params.categoryId
    );
    res.json({ data: categories });
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const product = req.body;
    product.vendor_id = req.user.vendor_id;
    product.product_image_path = req.file.path;
    const newProduct = await productService.createProduct(product);
    res.status(201).json({ data: newProduct });
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    await productService.deleteProduct(productId);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

const getProducts = async (req, res, next) => {
  try {
    const products = await productService.getProducts();
    res.json({ data: products });
  } catch (error) {
    next(error);
  }
};

const getVendorProducts = async (req, res, next) => {
  try {
    const vendorId = req.user.vendor_id;
    const products = await productService.getVendorProducts(vendorId);
    res.json({ data: products });
  } catch (error) {
    next(error);
  }
};

export default {
  getMainCategories,
  getSubCategories,
  createProduct,
  deleteProduct,
  getProducts,
  getVendorProducts,
};
