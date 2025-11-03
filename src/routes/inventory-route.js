import express from "express";
import verifyToken from "../middlewares/verify-token.js";
import { createInventory, deleteInventory, getDetailInventory, getListInventory, updateInventory } from "../controllers/inventory-controller.js";

const inventoryRoutes = express.Router();

inventoryRoutes.use(verifyToken);

inventoryRoutes.get("/", getListInventory);
inventoryRoutes.get("/:id", getDetailInventory);
inventoryRoutes.post("/", createInventory);
inventoryRoutes.put("/:id", updateInventory);
inventoryRoutes.delete("/:id", deleteInventory);

export default inventoryRoutes;