import joi from "joi";

const registerUserValidation = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(8).max(255).required().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,255}$/)
    .messages({
        'string.pattern.base': 'Password harus mengandung huruf besar, huruf kecil, angka, dan simbol.',
    }),
    name: joi.string().max(255).required()
});

const loginValidation = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(8).max(255).required()
});

export default {
    registerUserValidation,
    loginValidation
}