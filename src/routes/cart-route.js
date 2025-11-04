import express from "express";
import verifyToken from "../middlewares/verify-token.js";
import { addToCart, getAllCart } from "../controllers/cart.controller.js";

const cartRoutes = express.Router();

cartRoutes.use(verifyToken);

cartRoutes.get("/", getAllCart);
cartRoutes.post("/", addToCart);

export default cartRoutes;