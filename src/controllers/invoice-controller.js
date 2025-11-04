import prisma from "../configs/db.js";
import { errorResponse, successResponse } from "../utils/response.js";

const getAllInvoice = async (req, res) => {
    try {
        const invoices = await prisma.invoice.findMany();
        return successResponse(res, "Success get all invoice", invoices);
    } catch (error) {
        return errorResponse(
            res,
            "Get invoice failed",
            { error: error.message }
        );
    }
}

const getInvoiceByUserEmail = async (req, res) => {
    try {
        const invoices = await prisma.invoice.findMany({
            where: {
                email: req.params.email
            }
        });

        return successResponse(res, "Success get all invoice", invoices);
    } catch (error) {
        return errorResponse(
            res,
            "Get invoice failed",
            { error: error.message }
        );
    }
}

const checkout = async (req, res) => {
    const { email, name, phone, date } = req.body;

    const cart = await prisma.cart.findMany({
        where: {
            userId: req.user.id
        },
        include: {
            product: true
        }
    });

    if (cart.length === 0) {
        return errorResponse(res, "Cart is empty");
    }

    const item = cart.map(c => `${c.quantity} x ${c.product.name}`).join(', ');

    const total = cart.reduce((sum, c) => sum + c.total, 0);

    const invoice = await prisma.invoice.create({
        data: {
            email,
            name,
            phone,
            date: new Date(date),
            item,
            total,
            userId: req.user.id,
        }
    });

    // hapus yang di keranjang
    const deletedCart = await prisma.cart.deleteMany({
        where: {
            userId: req.user.id
        }
    });

    if (!deletedCart) {
        return errorResponse(res, "Checkout failed", { error: "Checkout failed" }, 401);
    }

    return successResponse(res, "Success checkout", invoice);
}

const deleteInvoice = async (req, res) => {
    const { id } = req.params;
    const invoice = await prisma.invoice.delete({
        where: {
            id
        }
    });

    if (!invoice) {
        return errorResponse(res, "Invoice not found", null, 401);
    }

    return successResponse(res, "Success delete invoice", invoice);
}

const getInvoiceById = async (req, res) => {
    const { id } = req.params;
    const invoice = await prisma.invoice.findUnique({
        where: {
            id
        }
    });

    if (!invoice) {
        return errorResponse(res, "Invoice not found", null, 401);
    }
    return successResponse(res, "Success get invoice", invoice);
}

export {
    getAllInvoice,
    getInvoiceByUserEmail,
    checkout,
    deleteInvoice,
    getInvoiceById
}