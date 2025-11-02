import prisma from "../configs/db.js";
import { errorResponse, successResponse } from "../utils/response.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieOptions from "../utils/cookie-options.js";

export const registerAccount = async (req, res) => {
    const { name, email, password } = req.body;

    const isEmailExist = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (isEmailExist) {
        return errorResponse(res, "Email already exist", null, 400);
    }

    const HashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: HashedPassword
        }
    });

    return successResponse(res, "User registered successfully", {
        id: user.id,
        name: user.name,
        email: user.email
    });
}

export const loginAccount = async (req, res) => {
    const { email, password } = req.body;

    const findUser = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (!findUser) {
        return errorResponse(res, "User not found", null, 400);
    }

    const isPasswordMatch = await bcrypt.compare(password, findUser.password);

    if (!isPasswordMatch) {
        return errorResponse(res, "Invalid password", null, 400);
    }

    const token = jwt.sign({
        id: findUser.id,
        email: findUser.email
    }, process.env.JWT_SECRET, {
        expiresIn: "1d"
    });

    res.cookie("token", token, cookieOptions(req));

    return successResponse(res, "User logged in successfully", {
        id: findUser.id,
        email: findUser.email,
        token: token,
    });
}

export const logoutAccount = async (req, res) => {
    res.clearCookie("token", {
        ...cookieOptions(req),
        maxAge: undefined, // override maxAge biar cookie benar-benar terhapus
    });
    return successResponse(res, "User logged out successfully", null);
}