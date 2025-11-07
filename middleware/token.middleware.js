const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt.config")
module.exports.tokenMiddleware = {
    genrateToken: async (payload, { type = "access", expiresIn } = {}) => {
        try {

            const secretKey = type == "refresh" ? jwtConfig.REFRESH_TOKEN_SECRET : jwtConfig.ACCESS_TOKEN_SECRET;

            const ttl = expiresIn || (type == 'refresh' ? jwtConfig.REFRESH_TOKEN_EXPIRES_IN : jwtConfig.ACCESS_TOKEN_EXPIRES_IN)

            const token = jwt.sign(payload, secretKey, { expiresIn: ttl })

            return token;
        } catch (error) {
            console.log("token middleware error message: ", error.message)
            return false
        }
    },
    verifyToken: async (token, type = "access") => {
        console.log("------------verifyToken--------------")
        try {
            const secretKey = type === "refresh"
                ? jwtConfig.REFRESH_TOKEN_SECRET
                : jwtConfig.ACCESS_TOKEN_SECRET;
            const decode = await jwt.verify(token, secretKey);
            // console.log("seckretKey", secretKey);
            // console.log("decode: >>>", decode)
            // console.log("-------------------")

            return decode;
        } catch (err) {
            return null;
        }
    }

}