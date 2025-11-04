// const { sign } = require("jsonwebtoken");

const { tokenMiddleware } = require("../middleware/token.middleware");
const { userService } = require("../service/user.service");

module.exports.AuthController = {
    signUp: async (req, res) => {
        try {
            const body = req.body
            const existingUser = await userService.findOne({
                $or: [{ eamil: body.eamil }, { mobile: body.mobile }]
            })
            if (existingUser) {
                return res.status(404).json({
                    status: 400,
                    message: existingUser.email == body.email ? "Email already exist" : "Mobile number is already exist."
                })
            }
            const user = await userService.create(body)
            const payload = {
                id: user.id,
                email: user.email,
                role: user.role,
            }
            const accessToken = await tokenMiddleware.genrateToken(payload, { type: "access" });
            const refreshToken = await tokenMiddleware.genrateToken(payload, { type: "refresh" });
            return res.status(201).json({
                status: 201,
                message: "User register successfully",
                data: {
                    tokenType: "Bearer",
                    role: user.role,
                    username: user.firstName + " " + user.lastName,
                    accessToken: accessToken,
                    refeshToken: refreshToken
                }

            })
        } catch (error) {
            console.log("Error signup controller", error);
            console.log("Error Message : ", error.message)
            return res.json({
                status: false,
                stausCode: 500,
                message: "Something went wrong.."
            })
        }
    }
}