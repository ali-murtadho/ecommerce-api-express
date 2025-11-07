import joi from "joi";

const addToCartValidation = joi.object({
    productId: joi.string().required(),
    quantity: joi.number().required()
});

export default {
    addToCartValidation
}