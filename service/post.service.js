const { Post } = require("../model/post.modal")

module.exports.postService = {
    create: async (data) => {
        try {
            return await Post.create(data)
        } catch (error) {
            console.error("something went wrong while creating post in post-service,", error.message)
            return false
        }
    },
    update: async (qury, data) => {
        try {
            return await Post.update(qury, data)
        } catch (error) {
            return false
        }
    },
    findeOne: async (data) => {
        try {
            return await Post.findeOne(data)
        } catch (error) {
            return false
        }
    },
    delete: async (data) => {
        try {
            return await Post.deleteOne(data)
        } catch (error) {
            return false
        }
    }
}