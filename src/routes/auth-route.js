import express from "express";
import { loginAccount, logoutAccount, registerAccount } from "../controllers/auth-controller.js";
const authRoutes = express.Router();

authRoutes.post("/register", registerAccount);
authRoutes.post("/login", loginAccount);
authRoutes.post("/logout", logoutAccount);

export default authRoutes;