import express from "express";
import { checkout, deleteInvoice, getAllInvoice, getInvoiceById, getInvoiceByUserEmail } from "../controllers/invoice-controller.js";
import verifyToken from "../middlewares/verify-token.js";

const invoiceRoutes = express.Router();

invoiceRoutes.use(verifyToken);
invoiceRoutes.post("/checkout", checkout);
invoiceRoutes.get("/", getAllInvoice);
invoiceRoutes.get("/:email", getInvoiceByUserEmail);
invoiceRoutes.get("/:id", getInvoiceById);
invoiceRoutes.delete("/:id", deleteInvoice);

export default invoiceRoutes;
