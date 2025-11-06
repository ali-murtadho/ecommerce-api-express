import prisma from "../configs/db.js";
import { errorResponse, successResponse } from "../utils/response.js";
import path from "path";
import fs from "fs";
const cleanImageUrl = (base, imagePath) =>
  base.replace(/\/$/, "") + "/" + imagePath.replace(/^\//, "");


const getAllProduct = async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            include: {
                inventory: true
            }
        });
        
        const base = req.protocol + "://" + req.get("host");
        const productWithImgUrl = products.map((product) => ({
            ...product,
            image: products.image? cleanImageUrl(base, product.image) : null,
        }))
        
        if (!products) {
            return errorResponse(res, "Product not found", null, 401);
        }
        
        return successResponse(res, "Success get all product", productWithImgUrl);
    } catch (error) {
        return errorResponse(
            res,
            "Get Product failed",
            { error: error.message },
            500
        );
    }
    
}

const getProductByInventoryId = async (req, res) => {
    const { id } = req.params;
    try {
        const products = await prisma.product.findMany({
            where: {
                inventoryId: id
            }
        });

        if (!products || products.length === 0) {
            return errorResponse(res, "Get products by inventoryId successful", null, 401);
        }
        
        const base = req.protocol + "://" + req.get("host");
        const productWithImgUrl = products.map((product) => ({
            ...product,
            image: products.image? cleanImageUrl(base, product.image) : null,
        }))
        
        return successResponse(res, "Success get all product", productWithImgUrl);
    } catch (error) {
        return errorResponse(
            res,
            "Get products by inventoryId failed",
            { error: error.message },
            500
        );
    }
}

const getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await prisma.product.findUnique({
            where: {
                id
            }
        });

        if (!product) {
            return errorResponse(res, "Product not found", null, 401);
        }

        const base = req.protocol + "://" + req.get("host");
        const productWithImgUrl = {
            ...product,
            image: product.image? `${base}${product.image}` : null,
        }
        
        return successResponse(res, "Success get product", productWithImgUrl);
    } catch (error) {
        return errorResponse(
            res,
            "Get Product failed",
            { error: error.message },
            500
        );
    }
}

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
    
        const product = await prisma.product.findUnique({where: {id}})
        if (!product) return errorResponse(res, "Product not found", null, 404)

        if(product.image){
            const oldImagePath = path.join(
                process.cwd(), //Ganti __dirname dengan process.cwd()
                "uploads",
                path.basename(product.image)
            )

            fs.unlink(oldImagePath, (err) => {
                if (err) {
                    console.warn("Gagal hapus file lama:", oldImagePath);
                } else {
                    console.log("File lama terhapus:", oldImagePath);
                }
            });
        }

        await prisma.product.delete({ where: { id } });
        return successResponse(res, "Product deleted successfully");
        
    } catch (error) {
        return errorResponse(
            res,
            "Update Product failed",
            { error: error.message },
            500
        );
    }
}

const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, inventoryId } = req.body;
        const image = req.file ? 'files/' + req.file.filename : null;

        const products = await prisma.product.create({
            data: {
                name,
                description,
                price: parseFloat(price), //100.000
                stock: parseInt(stock), //biar "100000" -> 100000
                inventoryId,
                image
            }
        })

        if (!name || !description || !price || !stock || !inventoryId) {
            return errorResponse(res, "Name, description, price, stock, inventoryId is required", null, 400);
        }
        
        const base = req.protocol + "://" + req.get("host");
        return successResponse(res, "Success create product", {
            ...products,
            image: products.image? cleanImageUrl(base, products.image) : null
        });
    } catch (error) {
        return errorResponse(
            res,
            "Create Product failed",
            { error: error.message },
            500
        );
    }
}

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, stock, inventoryId } = req.body;
        const image = req.file ? 'files/' + req.file.filename : undefined;

        const findProduct = await prisma.product.findUnique({
            where: {
                id
            }
        })

        if (!findProduct) {
            return errorResponse(res, "Product not found", null, 401);
        }

        if (image && products.image) {
            const oldImage = path.join(
                process.cwd(),
                "files",
                path.basename(products.image)
            )

            fs.unlink(oldImage, (err) => {
                if (err) {
                    console.log(err);
                }
            });
        }
        const updatedData = {
            name,
            description,
            price: parseFloat(price), //100.000
            stock: parseInt(stock), //biar "100000" -> 100000
            inventoryId,
        }
        if (image) {
            updatedData.image = image;
        }

        const products = await prisma.product.update({
            where: {
                id
            },
            data: updatedData
        });

        if (!name || !description || !price || !stock || !inventoryId) {
            return errorResponse(res, "Name, description, price, stock, inventoryId is required", null, 400);
        }
    
        const base = req.protocol + "://" + req.get("host");
        return successResponse(res, "Success update product", {
            ...products,
            image: products.image? cleanImageUrl(base, products.image) : null
        });
    } catch (error) {
        return errorResponse(
            res,
            "Update Product failed",
            { error: error.message },
            500
        );
    }
}
export { cleanImageUrl, getAllProduct, getProductByInventoryId, getProductById, createProduct, updateProduct, deleteProduct };