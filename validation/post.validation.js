const Joi = require("joi");

const createPostSchema = {
    body: Joi.object({
        title: Joi.string()
            .min(2).max(100)
            .messages({
                "string.base": "Title must be a string.",
                "string.empty": "Title is required.",
                "any.required": "Title is required.",
                "string.min": "Title must be at least 2 characters long.",
                "string.max": "Title must not exceed 100 characters.",
            }),
        description: Joi.string()
            .min(1)
            .required()
            .messages({
                "string.base": "Description must be a string.",
                "string.empty": "Description is required.",
                "any.required": "Description is required.",
            }),
        // ✅ Optional file array (but if provided, cannot be empty or contain empty strings)
        files: Joi.array()
            .items(
                Joi.string()
                    .uri()
                    .required()
                    .messages({
                        "string.empty": "File URL cannot be empty.",
                        "string.uri": "Each file must be a valid URL.",
                    })
            )
            .min(1)
            .messages({
                "array.base": "Files must be an array.",
                "array.min": "At least one file must be provided if files field exists.",
            })
            .optional()
    })
};

module.exports = { createPostSchema }