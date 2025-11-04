const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt.config")
module.exports = {
    genrateToken: async (payload, { type = "access", expiresIn } = {}) => {
        try {
            const secretKey = type = "refresh" ? jwtConfig.REFRESH_TOKEN_SECRET : jwtConfig.ACCESS_TOKEN_EXPIRES_IN;
            const ttl = expiresIn || (type == 'refresh' ? jwtConfig.REFRESH_TOKEN_EXPIRES_IN : jwtConfig.ACCESS_TOKEN_EXPIRES_IN)
            return await jwt.sign(payload, secretKey, { expiresIn: ttl })
        } catch (error) {
            console.log("token middleware error message: ", error.message)
            return false
        }
    }
}