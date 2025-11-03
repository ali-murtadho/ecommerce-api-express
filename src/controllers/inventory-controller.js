import { errorResponse, successResponse } from "../utils/response.js";

const getListInventory= async (req, res) => {
    const inventories = await prisma.inventory.findMany();
    return successResponse(res, "Success get list inventory", inventories);
}

const getDetailInventory= async (req, res) => {
    const { id } = req.params;
    const inventory = await prisma.inventory.findUnique({
        where: {
            id
        }
    });

    if (!inventory) {
        return errorResponse(res, "Inventory not found", null, 401);
    }

    return successResponse(res, "Success get detail inventory", inventory);
}

const createInventory = async (req, res) => {
    const { name, description } = req.body;

    if (!name || !description) {
        return errorResponse(res, "Name and description is required", null, 400);
    }

    const inventory = await prisma.inventory.create({
        data: {
            name,
            description
        }
    });

    return successResponse(res, "Success create inventory", inventory);
}

const deleteInventory = async (req, res) => {
    const { id } = req.params;
    const inventory = await prisma.inventory.delete({
        where: {
            id
        }
    });

    if (!inventory) {
        return errorResponse(res, "Inventory not found", null, 401);
    }

    return successResponse(res, "Success delete inventory", inventory);
}

const updateInventory = async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;

    const inventory = await prisma.inventory.update({
        where: {
            id
        },
        data: {
            name,
            description
        }
    });

    if (!inventory) {
        return errorResponse(res, "Inventory not found", null, 401);
    }

    return successResponse(res, "Success update inventory", inventory);
}

export {
    getListInventory,
    getDetailInventory,
    createInventory,
    deleteInventory,
    updateInventory
}