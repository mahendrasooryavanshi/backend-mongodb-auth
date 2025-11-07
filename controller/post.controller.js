const { Post } = require("../model/post.modal");
const { postService } = require("../service/post.service");
const Cache = require("../utils/cache");
// const { userService } = require("../service/user.service");

module.exports.postController = {
    create: async (req, res) => {
        try {
            const userid = req.user.id;
            console.log("req.user", req.user)
            const body = req.body
            const result = await postService.create({ ...body, createdBy: userid })
            if (result) {
                return res.status(201).json({
                    status: 201,
                    message: "Post upload successfully...",
                    data: result
                })
            }
        } catch (error) {
            console.log("Error in post controller while creating post: message error", error.message)
            return res.status(500).json({
                status: 500,
                message: "Something went wrong...",
                errorMessage: error.message
            })
        }
    },
    postList: async (req, res) => {
        try {
            const cacheKey = "posts:list";

            // 🔍 1. Check cache

            const cached = await Cache.get(cacheKey);
            if (cached) {
                console.log("✅ Data fetched from Redis cache");
                return res.status(200).json({
                    source: "cache",
                    data: JSON.parse(cached),
                });
            }
            const userId = req.user.id
            // const result = await Post.find({}).populate("createdBy", "role firstName lastName email").lean()
            const result = await Post.aggregate([
                {
                    $lookup: {
                        from: "users",
                        localField: "createdBy",
                        foreignField: "_id",
                        as: "userInfo",

                    }
                },
                {
                    $unwind: "$userInfo"         // flatten the array
                },
                {
                    $project: {
                        _id: 1,
                        title: 1,
                        decription: 1,
                        createdAt: 1,
                        "userInfo.email": 1,
                        "userInfo.staus": 1,
                        "userInfo.role": 1,
                        "userInfo.createdAt": 1,
                    }
                }
            ])

            // 💾 3. Store in Redis (set expiry of 60 sec)
            await Cache.set(cacheKey, resJSON.stringify(result), { EX: 60 }); // cache for 2 min
            // console.log(result, ">>>>>>>> result")
            return res.status(200).json({
                status: 200,
                message: "post data fetch successfully...",
                total: result.length,
                data: result
            })
        } catch (error) {
            console.log("Error in post list api,Controller:message is", error.message)
            return res.status(500).json({
                status: 500,
                message: "Something went wrong...",
                errorMessage: error.message
            })
        }
    }
}