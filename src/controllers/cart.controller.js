import prisma from "../configs/db.js";
import { errorResponse, successResponse } from "../utils/response.js";

const getAllCart = async (req, res) => {
    const cart = await prisma.cart.findMany({
        where: {
            userId: req.user.id
        },
        include: {
            product: true
        }
    });

    if (!cart) {
        return errorResponse(res, "Cart not found", null, 401);
    }
    return successResponse(res, "Success get all cart", cart);
}

const getCartById = async (req, res) => {
    const { id } = req.params;
    const cart = await prisma.cart.findUnique({
        where: {
            id
        },
        include: {
            product: true
        }
    });

    if (!cart) {
        return errorResponse(res, "Cart not found", null, 401);
    }
    return successResponse(res, "Success get cart", cart);
}

const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;

    const productFind = await prisma.product.findUnique({
        where: {
            id: productId
        }
    });

    if (!productFind) {
        return errorResponse(res, "Product not found", { error: "Product not found" }, 401);
    }

    const total = productFind.price * quantity;


    const cart = await prisma.cart.create({
        data: {
            userId: req.user.id,
            productId,
            quantity,
            total
        }
    });

    if (!cart) {
        return errorResponse(res, "Add to cart failed", { error: "Add to cart failed" }, 401);
    }    
    return successResponse(res, "Success add to cart", cart);
}

export {
    getAllCart,
    getCartById,
    addToCart
}