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

const checkout = async (req,res) => {
    const { email, name, phone, date } = req.body;

    const carts = await prisma.cart.findMany({
        where: { userId: req.user.userId },
        include: { product: true }
    })

    if (carts.length === 0) {
        return errorResponse(res, 'Cart is empty')
    }

    const items = carts.map(c => `${c.product.name} x ${c.quantity}`).join(', ');
    const total = carts.reduce((sum, item) => sum + item.total, 0);

    const invoice = await prisma.invoice.create({
        data: {
          email,
          name,
          phone,
          date: new Date(date),
          items,
          total,
          userId: req.user.id
        }
    });

    await prisma.cart.deleteMany({
        where: { userId: req.user.userId }
    })

    return successResponse(res, 'Checkout Successful', invoice);
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