const { User } = require("../model/user.model")

module.exports.userService = {
    create: async (data) => {
        try {
            return User.create(data)
        } catch (error) {
            console.log("error in user-service:", error);
            console.log("Erro message in user service :", error.message);
            false;
        }
    },
    findOne: async (data, options = {}) => {
        try {

            const query = User.findOne(data);

            // allow controller to request password field explicitly
            if (options.includePassword) {
                query.select("+password");
            }

            return await query.exec();
        } catch (error) {
            console.log("error in find one user service", error)
            console.log("error message in user service", error.message)
            return false;
        }
    },
    findById: async (data) => {
        try {
            return await User.findById(data)
        } catch (error) {
            console.log("error in find one user service", error)
            console.log("error message in user service", error.message)
            return false;
        }
    },
    findAll: async (data) => {
        try {
            return await User.find(data).lean();
        } catch (error) {
            console.log("error in find one user service", error)
            console.log("error message in user service", error.message)
            return false;
        }
    },
    findByIdAndDelete: async (data) => {
        try {
            return await User.findByIdAndDelete(data)
        } catch (error) {
            console.log("error in find one user service", error)
            console.log("error message in user service", error.message)
            return false;
        }
    },

}