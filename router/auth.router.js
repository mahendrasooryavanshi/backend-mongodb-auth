const express = require("express");
const { AuthController } = require("../controller/auth.controller");
const router = express.Router()
const { validate } = require("../middleware/validation");
const { createUserSchema, loginSchema, updateUserSchema } = require("../validation/auth.validation");
const { authTokenMiddleware } = require("../middleware/auth.middleware")


router.post("/signup", validate(createUserSchema), AuthController.signUp)
router.post("/login", validate(loginSchema), AuthController.login);
router.get("/users", [authTokenMiddleware], AuthController.userList);
router.put("/users", [authTokenMiddleware], validate(updateUserSchema), AuthController.update);
router.get("/profile", [authTokenMiddleware], AuthController.profile);

module.exports = router