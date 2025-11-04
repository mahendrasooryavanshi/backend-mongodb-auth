const validate = (schema) => (req, res, next) => {
    try {
        const validationTargets = ["params", "query", "body"];
        const errors = [];

        // 🔍 Validate each section: params, query, body
        for (const key of validationTargets) {
            if (schema[key]) {
                const { error, value } = schema[key].validate(req[key], {
                    abortEarly: false, // collect all errors
                    allowUnknown: false, // disallow unknown fields
                    stripUnknown: true, // remove unknown fields
                });

                if (error) {
                    errors.push(...error.details.map((err) => err.message));
                } else {
                    // ✅ replace with sanitized/cleaned value
                    req[key] = value;
                }
            }
        }

        // 🚫 If any errors, stop the request
        if (errors.length > 0) {
            return res.status(400).json({
                status: "true",
                statusCode: 400,
                errorMessage: "Validation Failed",
                message: errors[0],
            });
        }

        // ✅ Proceed to controller
        next();
    } catch (error) {
        console.log("Error in validation middleware :", error.message);
        console.log("Error in middleware validation", error)
        return res.status(400).json({
            status: success,
            statusCode: 500,
            message: "Something went wrong"
        });
    }
};

module.exports = { validate };
