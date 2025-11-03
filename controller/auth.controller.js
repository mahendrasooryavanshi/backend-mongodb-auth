const { sign } = require("jsonwebtoken");

module.exports = {
    signUp: async (req, res) => {
        try {
            const data = req.body
            console.log("data")
            return res.json({
                data: data
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