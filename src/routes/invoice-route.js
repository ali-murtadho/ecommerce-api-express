import express from "express";
import { checkout, deleteInvoice, getAllInvoice, getInvoiceById, getInvoiceByUserEmail } from "../controllers/invoice-controller.js";

const invoiceRoutes = express.Router();

invoiceRoutes.get("/", getAllInvoice);
invoiceRoutes.get("/:email", getInvoiceByUserEmail);
invoiceRoutes.post("/", checkout);
invoiceRoutes.get("/:id", getInvoiceById);
invoiceRoutes.delete("/:id", deleteInvoice);

export default invoiceRoutes;
