const { tokenMiddleware } = require("./token.middleware");

module.exports.authTokenMiddleware = async (req, res, next) => {
    try {
        // ✅ Get the token from headers
        const authHeader = req.headers["authorization"];
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided or invalid format.",
            });
        }

        // Extract token from "Bearer <token>"
        const token = authHeader.split(" ")[1];

        // ✅ Verify token
        const decoded = await tokenMiddleware.verifyToken(token, "access");
        // ✅ Attach user info to request (useful for controllers)
        req.user = decoded;
        next();
    } catch (err) {
        console.error("❌ JWT verification failed:", err.message);
        console.log(err)
        const isExpired = err.name === "TokenExpiredError";
        const isInvalid = err.name === "JsonWebTokenError";

        return res.status(401).json({
            success: false,
            message: isExpired
                ? "Token has expired. Please log in again."
                : isInvalid
                    ? "Invalid token. Please provide a valid one."
                    : "Authentication failed.",
        });
    }
};
