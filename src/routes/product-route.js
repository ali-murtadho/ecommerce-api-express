import express from "express";
import verifyToken from "../middlewares/verify-token.js";
import upload from "../middlewares/upload.js";
import { createProduct, deleteProduct, getAllProduct, getProductById, getProductByInventoryId, updateProduct } from "../controllers/product-controller.js";
const productRoutes = express.Router();

productRoutes.use(verifyToken);

productRoutes.get("/", getAllProduct);
productRoutes.get("/:id", getProductById);
productRoutes.post("/", upload.single("image"), createProduct);
productRoutes.put("/:id", upload.single("image"), updateProduct);
productRoutes.delete("/:id", deleteProduct);
productRoutes.get("/inventory/:id", getProductByInventoryId);

export default productRoutes;