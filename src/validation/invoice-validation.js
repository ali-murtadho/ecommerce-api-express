import joi from "joi";

const checkoutValidation = joi.object({
    email: joi.string().email().required(),
    name: joi.string().max(255).required(),
    phone: joi.string().max(255).required(),
    date: joi.date().required()
});

export default {
    checkoutValidation
}