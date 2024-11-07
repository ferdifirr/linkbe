import express from "express";
import vendorController from "../controllers/vendor-controller.js";
import productController from "../controllers/product-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";
import upload from "../app/upload.js";

const router = new express.Router();
router.use(authMiddleware);
router.post(
  "/vendor/register",
  upload.single("image_path"),
  vendorController.registerVendor
);

// product
router.get("/product/category", productController.getMainCategories);
router.get("/product/category/:categoryId", productController.getSubCategories);
router.post("/product", upload.single("product_image_path"), productController.createProduct);
router.delete("/product/:productId", productController.deleteProduct);
router.get("/product", productController.getProducts);
router.get("/product/vendor", productController.getVendorProducts);

export { router };
