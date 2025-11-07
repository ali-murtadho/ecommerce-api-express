import joi from "joi";

const createInventoryValidation = joi.object({
    name: joi.string().max(255).required(),
    description: joi.string().max(255).optional(),
});

const updateInventoryValidation = joi.object({
    name: joi.string().max(255).required(),
    description: joi.string().max(255).optional(),
});

export default ({
    createInventoryValidation,
    updateInventoryValidation,
})