import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth-route.js";
import inventoryRoutes from "./routes/inventory-route.js";
import productRoutes from "./routes/product-route.js";
import cartRoutes from "./routes/cart-route.js";
import invoiceRoutes from "./routes/invoice-route.js";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/inventories", inventoryRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/invoice", invoiceRoutes);

export default app;
