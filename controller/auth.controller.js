
const { tokenMiddleware } = require("../middleware/token.middleware");
const { userService } = require("../service/user.service");
const bcrypt = require("bcryptjs");
module.exports.AuthController = {
    signUp: async (req, res) => {
        try {
            const body = req.body

            const existingUser = await userService.findOne({
                $or: [{ email: body.email }, { mobile: body.mobile }]
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
    },
    login: async (req, res) => {
        try {
            const body = req.body;
            const user = await userService.findOne(
                { $or: [{ email: body.email }, { mobile: body.mobile }] },
                { includePassword: true }
            )

            if (!user) {
                return res.status(404).json({
                    status: 404,
                    message: "User not found."
                })
            }
            const isMatchPassword = await bcrypt.compare(body.password, user.password)
            if (!isMatchPassword) {
                return res.status(404).json({
                    staus: 404,
                    message: "invalid password.."
                })
            }
            const payload = {
                id: user.id,
                email: user.email,
                role: user.role,
            }

            const accessToken = await tokenMiddleware.genrateToken(payload, { type: "access" })
            const refeshToken = await tokenMiddleware.genrateToken(payload, { type: "refresh" })

            return res.status(200).json({
                status: 200,
                message: "user login successfully..",
                data: {
                    username: user.firstName + " " + user.lastName,
                    role: user.role,
                    tokenType: "Bearer",
                    accessToken: accessToken,
                    refeshToken: refeshToken
                }
            })

        } catch (error) {
            console.log("Login controller error message: ", error.message)
            return res.status(500).json({
                sataus: 500,
                message: "Something went wrong.."
            })
        }
    },
    profile: async (req, res) => {
        try {
            const userId = req.user.id

            const user = await userService.findById(userId,
                { createdAt: 0, updatedAt: 0, deletedAt: 0 }

            )
            return res.json({
                status: 200,
                message: "User profile",
                data: user
            })
        } catch (error) {
            console.log("Error in profile,auth controller ,Message:", error.message)
            console.log("error :", error)
            return res.status(500).json({
                status: 500,
                message: "Something went wrong...",
                errorMessage: error.message
            })
        }
    },
    userList: async (req, res) => {
        try {
            const userId = req.user.id; // from decoded token
            const query = { isActive: true, _id: { $ne: userId } }
            const {
                limit = 12,
                offset = 0,
                page = 1,
                orderType = 1,
                orderBy = "createdAt"
            } = req.query;
            const options = { limit, offset, page }
            options.sort = { orderBy: orderType }
            options.skip = (page - 1) * limit;
            const users = await userService.findAll(query, options)

            return res.json({
                status: 200,
                message: "user list",
                page: page,
                count: users.length,
                data: users
            })

        } catch (error) {
            console.log("Error in userList,auth controller ,Message:", error.message)
            console.log("error :", error)
            return res.status(500).json({
                status: 500,
                message: "Something went wrong...",
                errorMessage: error.message
            })
        }
    },
    update: async (req, res) => {
        try {
            const userId = req.user.id;
            const body = req.body
            const updateUser = await userService.findByIdAndUpdate({ _id: userId }, body)
            if (updateUser) {
                return res.json({
                    status: 201,
                    message: "user updated successfully.."
                })
            }
        } catch (error) {
            console.log("Error in auth-controller,user update:", error.message);
            console.log("error :", error);
            return res.status(500).json({
                status: 500,
                message: "Something went wrong...",
                errorMessage: error.message
            })
        }
    }
}