const express = require("express");
const { authTokenMiddleware } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validation");
const { createPostSchema } = require("../validation/post.validation");
const { postController } = require("../controller/post.controller");
const router = express.Router()

router.post("/posts", [authTokenMiddleware], validate(createPostSchema), postController.create);
router.get("/posts", [authTokenMiddleware], postController.postList)
module.exports = router