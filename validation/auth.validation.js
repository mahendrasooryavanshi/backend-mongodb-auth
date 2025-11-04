const Joi = require("joi");

const createUserSchema = {
    body: Joi.object({
        firstName: Joi.string().min(3).max(30).required().messages({
            "any.required": "First name is required",
            "string.empty": "First name cannot be empty",
        }),
        lastName: Joi.string().min(3).max(30).optional(),
        email: Joi.string()
            .email({ tlds: { allow: ["com", "net", "in"] } })
            .required()
            .messages({
                "any.required": "Email is required",
                "string.email": "Invalid email format",
            }),
        mobile: Joi.string()
            .pattern(/^[0-9]{10}$/)
            .required()
            .messages({
                "any.required": "Mobile number is required",
                "string.pattern.base": "Mobile must be a 10-digit number",
            }),
        password: Joi.string()
            .min(8)
            .max(30)
            .required()
            .messages({
                "any.required": "Password is required",
                "string.min": "Password must be at least 8 characters long",
            }),
    }),
};
const loginSchema = {
    body: Joi.object({
        email: Joi.string()
            .email({ tlds: { allow: ["com", "net", "in"] } })
            .messages({
                "string.email": "Invalid email format",
            }),
        mobile: Joi.string()
            .pattern(/^[0-9]{10}$/)
            .messages({
                "string.pattern.base": "Mobile must be a 10-digit number",
            }),
        password: Joi.string().min(8).required().messages({
            "any.required": "Password is required",
            "string.min": "Password must be at least 8 characters long",
        }),
    })
        // 🔥 Require at least one: either email or mobile
        .or("email", "mobile")
        .messages({
            "object.missing": "Either email or mobile is required to log in",
        }),
}

module.exports = { createUserSchema, loginSchema };
