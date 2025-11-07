import joi from "joi";

const createProductValidation = joi.object({
    name: joi.string().max(255).required(),
    image: joi.string().max(255).optional(),
    price: joi.number().required(),
    stock: joi.number().required(),
    description: joi.string().max(255).optional(),
    inventoryId: joi.string().required()
});

const updateProductValidation = joi.object({
    name: joi.string().max(255).optional(),
    image: joi.string().max(255).optional(),
    price: joi.number().optional(),
    stock: joi.number().optional(),
    description: joi.string().max(255).optional(),
    inventoryId: joi.string().optional()
});

export default ({
    createProductValidation,
    updateProductValidation
})